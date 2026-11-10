import*as g from"three";import{makePath as tn}from"../kit/core.js";import*as on from"../kit/terrain.js";import*as Nt from"../kit/water.js";import{makeSky as an,makeLightRig as sn,skyDirection as sa}from"../kit/sky.js";const _=Math.PI/180,Q=Math.PI*2,Z=(a,s,i)=>Math.min(i,Math.max(s,a)),O=(a,s,i)=>a+(s-a)*i,T=(a,s,i)=>{const c=Z((i-a)/(s-a),0,1);return c*c*(3-2*c)},na=a=>(a+540)%360-180;function me(a){const s=a.length,i=a.map(r=>r[0]),c=a.map(r=>r[1]),o=[],h=new Array(s);for(let r=0;r<s-1;r++)o.push((c[r+1]-c[r])/(i[r+1]-i[r]));h[0]=o[0],h[s-1]=o[s-2];for(let r=1;r<s-1;r++)h[r]=o[r-1]*o[r]<=0?0:(o[r-1]+o[r])/2;for(let r=0;r<s-1;r++){if(o[r]===0){h[r]=h[r+1]=0;continue}const m=h[r]/o[r],x=h[r+1]/o[r],p=m*m+x*x;if(p>9){const f=3/Math.sqrt(p);h[r]=f*m*o[r],h[r+1]=f*x*o[r]}}return r=>{if(r<=i[0])return c[0];if(r>=i[s-1])return c[s-1];let m=0;for(;r>i[m+1];)m++;const x=i[m+1]-i[m],p=(r-i[m])/x,f=p*p,d=f*p;return(2*d-3*f+1)*c[m]+(d-2*f+p)*x*h[m]+(-2*d+3*f)*c[m+1]+(d-f)*x*h[m+1]}}const N=1.6,K=49,H=K-N,ct=7.5,Me=4.5,le=14,J=a=>a<=N+le?ct:O(ct,Me,Z((a-N-le)/(H-le),0,1)),pe=160,se=[Math.sin(pe*_),-Math.cos(pe*_)],ae=Math.PI/2+Math.asin(N/H),_e=[H*Math.sin(ae)*Math.sin(pe*_),-H*Math.sin(ae)*Math.cos(pe*_)],we=47,nn=[[0,283],[2,283],[3.5,281.8],[5,278],[6.5,271.5],[8,263],[10,251.5],[12,238],[15,216],[18.5,186],[22,153],[25.5,121],[29,90],[32.5,59],[36,26],[39.5,-10],[42.5,-42],[45,-62],[we,-75],[we+2,-85]],rn=[[0,88],[2,71.5],[3.5,60.5],[5,53],[6.5,48.8],[8,46.6],[10,45.6],[12,45.4],[15,45.5],[18.5,45],[22,42.5],[25.5,39.5],[29,36.5],[32.5,37],[36,41],[39.5,48],[42.5,58],[45,69],[we,79],[we+2,88]],ln=[[0,7.5],[3,7.5],[4.5,7.6],[6,8],[7.5,8.6],[9.5,9.8],[12,11.6],[15,14],[18.5,17.6],[22,24],[25.5,30],[29,35.5],[32.5,39.5],[36,39],[39.5,34],[42.5,27],[45,21],[we,16.5],[we+2,13]],ra=119,Wt=30,It=15,Gt=15;function cn(a){const s=me(nn),i=me(rn),c=me(ln),o=[],h=b=>{const z=s(b)*_,C=i(b);return[C*Math.sin(z),c(b),-C*Math.cos(z)]};for(let b=0;b<=we+1e-6;b+=.5)o.push(h(b));const r=h(we),m=h(we+.05),x=Math.atan2(m[0]-r[0],-(m[2]-r[2])),p=ra*_,f=b=>[Math.sin(b),-Math.cos(b)],d=f(p+Math.PI/2),l=f(x-Math.PI/2),e=[_e[0]+Wt*d[0],_e[1]+Wt*d[1]],t=-((r[0]-e[0])*d[0]+(r[2]-e[1])*d[1])/(l[0]*d[0]+l[1]*d[1]+1),n=[r[0]+t*l[0],r[2]+t*l[1]];let u=x-p;for(;u<0;)u+=Q;const w=t*u,v=r[1],A=(m[1]-r[1])/Math.hypot(m[0]-r[0],m[2]-r[2]),k=b=>b<=w?O(v+A*b*(1-b/w)*.5,Gt,T(0,w,b)):O(Gt,It,T(w,w+40,b)),L=6*_;for(let b=L;b<u-1e-6;b+=L){const z=x-b,C=f(z-Math.PI/2);o.push([n[0]-t*C[0],k(t*b),n[1]-t*C[1]])}const S=[n[0]+t*d[0],n[1]+t*d[1]],y=f(p),F=(e[0]-S[0])*y[0]+(e[1]-S[1])*y[1];for(let b=0;b<F-6;b+=12)o.push([S[0]+y[0]*b,k(w+b),S[1]+y[1]*b]);return o.push([e[0],It,e[1]]),a&&Object.assign(a,{R:t,turn:u/_,arcL:w,straight:F,hA:x/_,E:S,Q:e}),o}const ge=60,hn=1/1.4,un=[[0,9.6],[4,8.8],[10,8.4],[18,7.6],[24,6.9],[30,7],[36,8.4],[41,9.6],[46,9.8],[50,9.2],[54,8.8],[60,8.8]],fn=[["west-south-west",247.5],["south-west",225],["south-south-west",202.5],["south",180],["south-south-east",157.5],["south-east",135],["east-south-east",112.5],["east",90],["east-north-east",67.5],["north-east",45],["north-north-east",22.5],["north",0],["north-north-west",337.5],["north-west",315],["west-north-west",292.5],["west",270]];function Bt(){const a={},s=cn(a),i=tn(s,{samples:480});return{info:a,pts:s,path:i}}function Ut(a=Bt()){const{info:s,pts:i,path:c}=a,o=c.length,h=me(un),r=1024,m=new Float64Array(r+1),x=new Float64Array(r+1);let p=0,f=h(0);for(let y=1;y<=r;y++){const F=h(p+o/r/f),b=o/r*2/(f+F);p+=b,m[y]=p,f=h(p)}const d=ge/p,l=o/ge;for(let y=0;y<=r;y++)x[y]=h(m[y]+hn/d)/d;const e=(y,F)=>{const b=Z(F,0,1)*r,z=Math.min(r-1,Math.floor(b));return O(y[z],y[z+1],b-z)},t=y=>e(m,y/o)*d,n=y=>{let F=0,b=o;for(let z=0;z<40;z++){const C=(F+b)/2;t(C)<y?F=C:b=C}return(F+b)/2},u=1e3,w=new Float64Array(u+1),v=new g.Vector3;for(let y=0;y<=u;y++)c.posAtDist(o*y/u,v),w[y]=(Math.atan2(v.x,-v.z)/_+360)%360;const A=(y,F)=>{for(let b=1;b<=u;b++){if(o*b/u<F)continue;const z=na(w[b-1]-y),C=na(w[b]-y);if(z>0&&C<=0&&z-C<90)return o*O(b-1,b,z/(z-C))/u}return NaN},k={};let L=30;for(const[y,F]of fn)k[y]=A(F,L),L=k[y];const S={path:c,pts:i,info:s,L:o,raw:p,scale:d,mean:l,secondsAt:t,metreAt:n,station:k,speedAt:y=>h(e(m,y/o))/d,pace:y=>e(x,y)/l};return S.T=y=>t(k[y]),S}const ia="west-north-west",qt=6*_,Te=1.6;function la(a){const s=a.T(ia),i=1.5*9.81/H,c=[[0,qt]];{let m=qt,x=0,p=0;const f=.002;for(;m<ae&&p<30;)x+=i*Math.sin(m)*f,m+=x*f,p+=f,Math.round(p/f)%25===0&&c.push([p,Math.min(m,ae)]);c.push([p,ae])}const o=c[c.length-1][0],h=s+Te+o;return{tRock:s,tFall:o,tStrike:h,lean:m=>{const x=m-s;if(x<=0)return 0;if(x<Te){const d=x/Te,l=d<.5?Math.sin(Q*d):0;return qt*(d*d*(3-2*d))-1.2*_*l*l}const p=x-Te;if(p>=o)return ae;let f=0;for(;c[f+1][0]<p;)f++;return O(c[f][1],c[f+1][1],(p-c[f][0])/(c[f+1][0]-c[f][0]))},dir:[Math.sin(pe*_),-Math.cos(pe*_)]}}const Y=5,j=H/Y,he=8*_,Vt=30*_,Ht=.8,fe=65,ht=[44,44,0,0,0].map(a=>a*_),jt=[3,-5,4,-6,3].map(a=>a*_),ut=.42,Pe=1.08,kt=.86,Mt=40*_,Kt=.45;function ca(a){const s=a.dir,i=new Float32Array(fe);for(let t=0;t<fe;t++)i[t]=t===0?0:t===fe-1?ae:a.lean(O(a.tRock,a.tStrike,t/(fe-1)));const c=t=>{const n=Z((t-a.tRock)/(a.tStrike-a.tRock),0,1)*(fe-1),u=Math.min(fe-2,Math.floor(n));return O(i[u],i[u+1],n-u)},o=(t,n)=>{let u=a.tRock+Te,w=a.tStrike;for(let v=0;v<44;v++){const A=(u+w)/2;n(A)<t?u=A:w=A}return w},h=(t,n)=>Math.min(ae,n+ht[t]*Math.pow(Math.max(0,(n-he)/(Vt-he)),Ht)),r=o(he,c),m=ht.map((t,n)=>n===Y-1?a.tStrike:o(ae-1e-7,u=>h(n,c(u)))),x=(t,n)=>{const u=c(n);let w=N;for(let A=0;A<t;A++)w+=j*Math.cos(h(A,u));const v=h(t,u);return w+j/2*(1+O(1,kt,T(he,Mt,v)))*Math.cos(v)-J(Math.min(K,N+(t+1)*j))*Math.sin(v)-(t===0?N:0)},p=ht.map((t,n)=>Math.min(m[n]-.05,o(0,u=>-x(n,u)))),f=(t,n=[])=>{const u=c(t);let w=0,v=N,A=0;for(let L=0;L<Y;L++){const S=n[L]||(n[L]={}),y=h(L,u),F=jt[L]*T(he,ae,y),b=Math.cos(F),z=Math.sin(F);S.lean=y,S.swing=F,S.landed=T(p[L],m[L]+Kt,t),S.long=O(1,kt,T(he,Mt,y)),S.x=w,S.y=v,S.z=A,S.fx=s[0]*b-s[1]*z,S.fz=s[0]*z+s[1]*b,w+=j*Math.sin(y)*S.fx,v+=j*Math.cos(y),A+=j*Math.sin(y)*S.fz}const k=n.tip||(n.tip=[0,0,0]);return k[0]=w,k[1]=v,k[2]=A,n},d=(t,n,u,w,v)=>{const A=Z(Math.floor((u-N)/j),0,Y-1),k=t[A],L=u-N-A*j,S=Math.sin(k.lean),y=Math.cos(k.lean),F=(n*s[0]+w*s[1])*O(1,ut,k.landed),b=(-n*s[1]+w*s[0])*O(1,Pe,k.landed),z=j/2+(L-j/2)*k.long;return v[0]=k.x+k.fx*(S*z+y*F)-k.fz*b,v[1]=k.y+y*z-S*F,v[2]=k.z+k.fz*(S*z+y*F)+k.fx*b,v},l=[];return{tBreak:r,land:m,touch:p,when:o,pose:f,place:d,placeAt:(t,n,u,w,v)=>w<=a.tRock?(v[0]=t,v[1]=n,v[2]=u,v):d(f(w,l),t,n,u,v),leanTable:i,leanAt:c,leanOf:h}}const vn=[["entry",20],["south-west",27],["south",30],["south-east",33],["east",36],["north-east",34],["north",27],["north-west",20],["west-north-west",14]],ha=.7,St=2,ua=6.5;function fa(a,s){const i=a.L,c=me(vn.map(([n,u])=>[n==="entry"?0:a.station[n],u])),o=a.station[ia],h=new g.Vector3(H*ha*Math.sin(ae)*s.dir[0],1,H*ha*Math.sin(ae)*s.dir[1]),r=new g.Vector3,m=new g.Vector3,x=new g.Vector3,p=new g.Vector3,f=new g.Quaternion,d=new g.Quaternion,l=new g.Vector3(0,0,-1),e=(n,u=new g.Vector3)=>{const w=a.secondsAt(n);return u.set(0,c(Math.min(n,o)),0),w>s.tRock&&u.lerp(h,T(s.tRock,s.tStrike,w)),u};return{point:e,dir:(n,u=new g.Vector3)=>{const w=a.secondsAt(n);if(a.path.posAtDist(n,r),e(n,m).sub(r).normalize(),w<=s.tStrike+St)return u.copy(m);const v=Math.min(i,n+1);return a.path.posAtDist(v,x),a.path.posAtDist(v-1,p),x.sub(p).normalize(),f.setFromUnitVectors(l,m),d.setFromUnitVectors(l,x),u.copy(l).applyQuaternion(f.slerp(d,T(s.tStrike+St,s.tStrike+St+ua,w)))},high:c,wreck:h}}function Yt(a,s){const i=a.L,c=new g.Vector3,o=new g.Vector3,h=new g.Vector3;return[{at:(m,x)=>{const p=Z(x,0,1)*i;return s.dir(p,o),a.path.posAtDist(p,c),h.copy(c).addScaledVector(o,2e3)},from:-1,to:2,fade:.2,weight:1,steady:!0}]}const ft={zenith:["#1c4a9c","#101d52","#0b1742"],mid:["#6a8fcd","#5a4488","#1d3878"],horizon:["#f1c68a","#d8786a","#4a5f9c"],ground:["#7c7268","#33283c","#111a32"],scatterColor:["#ffa64c","#ff7a20","#ee8452"],sunColor:["#ffcf8e","#ff8f40","#ff8a5a"],lightColor:["#ffc88a","#ff9058","#8f9fe8"],ambientColor:["#a3b6e2","#7e78b8","#4c66b6"],groundLight:["#7a6652","#66475a","#262e50"],cloudLit:["#ffdcae","#ff8c50","#6076ae"],cloudShade:["#6f668e","#3a2d58","#1e2a52"],cirrusLit:["#ffe6c6","#ffa27c","#7f8fc0"],cirrusShade:["#b79aa6","#70497c","#2c3866"],horizonPow:[3.4,4.5,4],midPow:[1.5,1.6,1.5],scatter:[.7,1,.8],scatterPow:[4,3,9],scatterHigh:[.14,.07,0],scatterFall:[3,4,6],sunDisc:[13,11,0],sunGlow:[.75,1,.35],sunTight:[.5,.35,.5],light:[2.9,1.5,.5],ambient:[1.5,1.8,2.2],glint:[1,1,.15]},dn=8;function va(a){const s=me([[0,12],[a.T("west-south-west"),7],[a.T("south-east"),0],[a.T("east-north-east"),-2.6],[a.T("north-north-west"),-4],[ge,-4]]),i=me([[0,300],[a.T("south-south-east"),337.5],[a.T("north-north-west"),360],[ge,360]]),c={};for(const d in ft)c[d]=typeof ft[d][0]=="string"?ft[d].map(l=>new g.Color(l)):ft[d];const o={T:-1,high:0,bearing:0,sunDir:new g.Vector3,keyDir:new g.Vector3,lightDir:new g.Vector3,fogColor:new g.Color};for(const d in c)o[d]=typeof ft[d][0]=="string"?new g.Color:0;const h=new g.Vector3,r=new g.Color,m=(d,l)=>{const e=1-Z(d.y,0,1);l.copy(o.zenith).lerp(o.mid,Math.pow(e,o.midPow)).lerp(o.horizon,Math.pow(e,o.horizonPow));const t=.5+.5*d.dot(o.sunDir),n=Math.pow(t,o.scatterPow)*(o.scatterHigh+(1-o.scatterHigh)*Math.pow(e,o.scatterFall));return l.lerp(o.scatterColor,Z(n*o.scatter,0,1))},x=[20,-20,60,-60,120,-120],p=[.2,.2,.18,.18,.12,.12];return{at:d=>{if(d===o.T)return o;const l=s(d),e=i(d),t=1-T(-4,.5,l),n=(1-t)*T(-.5,9,l),u=1-t-n;for(const w in c){const v=c[w];v[0].isColor?o[w].setRGB(v[0].r*n+v[1].r*u+v[2].r*t,v[0].g*n+v[1].g*u+v[2].g*t,v[0].b*n+v[1].b*u+v[2].b*t):o[w]=v[0]*n+v[1]*u+v[2]*t}o.T=d,o.high=l,o.bearing=e,sa(l,e,o.sunDir),o.keyDir.copy(o.sunDir),o.keyDir.y<.03&&(o.keyDir.y=.03,o.keyDir.normalize()),sa(Math.max(l,dn),e,o.lightDir),o.veil=Math.min(1,o.sunDisc/10)*Z((o.sunDir.y+.03)/.08,0,1),o.fogColor.setRGB(0,0,0);for(let w=0;w<6;w++){const v=(e+x[w])*_;h.set(Math.sin(v),.03,-Math.cos(v)).normalize(),m(h,r),o.fogColor.r+=r.r*p[w],o.fogColor.g+=r.g*p[w],o.fogColor.b+=r.b*p[w]}return o},sunHigh:s,sunBear:i}}const Xt=6,Lt=4,da=3,vt=9.81,oe=600,mn=[["entry",0],["west-south-west",5],["south-west",8],["south",17],["south-south-east",22],["south-east",27],["east",36],["north-east",44],["north-north-east",H]],Qt=[["entry",5.5],["south-west",9],["north-north-east",15]],Se=96,dt=Math.tan(20*_),re=[Math.sin(120*_),-Math.cos(120*_)];function ma(a){const s=e=>e==="entry"?0:a.T(e),i=mn.map(([e,t])=>[s(e),t]),c=i[i.length-1][0],o=me([[-i[1][0],i[1][1]],...i,[ge+1,H]]),h=e=>o(Math.max(0,e)),r=me([...Qt.map(([e,t])=>[s(e),t]),[ge+1,Qt[Qt.length-1][1]]]),m=new Float32Array(Se);for(let e=1;e<Se;e++){const t=H*(e/(Se-1))**2;let n=0,u=c;for(let w=0;w<40;w++){const v=(n+u)/2;h(v)<t?n=v:u=v}m[e]=(n+u)/2}const x=e=>{const t=Math.sqrt(Z(e/H,0,1))*(Se-1),n=Math.min(Se-2,Math.floor(t));return O(m[n],m[n+1],t-n)};return{front:h,crown:r,pass:x,passTable:m,age:(e,t)=>t-x(K-e),share:e=>Z((h(e)+.4*r(e))/(H+.4*15),0,1),smoke:e=>T(4,22,h(e)),sparks:e=>{const t=h(e);return .075*T(0,8,t)+.925*Z((t-8)/(H-8),0,1)},cascade:e=>T(0,30,h(e-Lt)),tFoot:c}}const pa=500,pn=Math.hypot(.6,.4,.072);function wa(a,s,i,c){const o=a("shed"),h=[];for(let r=0;r<pa;r++){const m=H*(.01+.97*o()),x=K-m,p=o()*360,f=da*(.4+.6*o()),d=Lt+16*o()*o(),l=J(x)+.15,e=Math.sin(p*_),t=-Math.cos(p*_),n=(1.5+3*o())*(o()<.5?-1:1),u=o()*Q,w=o()*Q;let v=s.pass(m)+d;v>i.tRock-.5&&(v=1e4);let A=0,k=Ze/2;for(let F=1;F<300;F++){const b=F*.02,z=x-.5*vt*b*b;if(z>N+.4)continue;const C=l+f*b,E=c.height(C*e,C*t);if(z<=Math.max(E,0)+Ze/2){A=E>.05?1:0,k=Math.max(E,0)+Ze/2;break}}const L=Math.sqrt(2*(x-k)/vt),S=Math.max(1,Math.round(Math.abs(n)*L/Math.PI)),y=Math.sign(n)*S*Math.PI/L;h.push({depth:m,y0:x,bear:p,out:f,release:v,R0:l,flight:L,rest:A,yRest:k,reach:l+f*L,spin:y,axis:u,turn:w})}return h}const ga=.35,xa=.875,ya=.9,ba=1.6,Aa=3,Zt=[.35,1.3],De=4e3,Oe=240,wn=130,Jt=220,$e=900,ka=70,Ne=1e3;function Ma(a){const s=a("sparks"),i=new Float32Array(De*4),c=new Float32Array(De*4);for(let o=0;o<De;o++)i.set([s()*Q,s(),s(),(o+.5)/De],o*4),c.set([s(),(60+Math.floor(21*s()))/oe,9+2*s(),s()],o*4);return{A:i,B:c}}const eo=.4;function gn(a,s,i,c,o,h,r,m,x){const{A:p,B:f}=a,d=s*4,l=(f[d]+o*f[d+1])%1,e=l/f[d+1],t=O(i,K+.7*c,Math.pow(p[d+1],.7)),n=O(J(Math.min(t,K))+.3+.9*p[d+2],Me*.85*p[d+2],T(K-1,K+3,t)),u=f[d+2]*e*(1-.02*e),w=.4+.06*u;return h[0]=Math.cos(p[d])*n,h[1]=t,h[2]=Math.sin(p[d])*n,h[3]=1,m&&r-e>m.tRock&&(x.placeAt(h[0],h[1],h[2],r-e,h),p[d+3]>O(1,eo,T(m.tStrike,m.tStrike+1,r-e))&&(h[3]=0)),h[0]+=re[0]*dt*u+Math.sin(e*1.3+f[d+3]*40)*w,h[1]+=u,h[1]<=0&&(h[3]=0),h[2]+=re[1]*dt*u+Math.cos(e*1.1+f[d+3]*23)*w,h}function Sa(a){const s=a("smoke"),i=new Float32Array(Oe*4),c=new Float32Array(Oe*4);for(let o=0;o<Oe;o++)i.set([(o+s())/Oe,(14+Math.floor(3*s()))/oe,s()*Q,.6+.2*s()],o*4),c.set([Math.sqrt(s()),(s()<.5?-1:1)*(1+Math.floor(2*s())),s(),o<wn?0:.08+.92*s()],o*4);return{S:i,D:c}}const La=26,je=[6,14],to=1.5,oo=.4,ao=3,Ca=.4,za=.35;function xn(a,s,i,c,o,h,r,m,x,p){const{S:f,D:d}=a,l=s*4,e=(f[l]+h*f[l+1])%1,t=d[l+3],n=x?m-e/f[l+1]:-1e9,u=x?T(x.tRock,x.tRock+to,n):0;r[4]=x?T(0,oo,Math.abs(n-x.tStrike)):1;const w=Jt*Math.pow(e,1.8)+ao*Math.min(e/f[l+1],5)*(x&&n>=x.tStrike?1:u),v=dt*w*w/(w+50);if(x&&n>=x.tStrike){const z=O(je[0],je[1],Z(w/40,0,1)),C=d[l+2]*7.31%1;return p.placeAt(0,N+H*(.06+.88*C),0,x.tStrike+1,r),r[0]+=re[0]*v+Math.cos(f[l+2])*d[l]*.3*z,r[1]+=1.5+w,r[2]+=re[1]*v+Math.sin(f[l+2])*d[l]*.3*z,r[3]=.5*z*f[l+3],r}const A=O(K+.8*c,Math.max(La,Math.min(K,i+3)),t),k=t>0?.8*J(A):0,L=O(2+6*Z(w/80,0,1),O(14-6*t,40,Z(w/150,0,1)),o),S=O(je[0],je[1],Z(w/40,0,1)),y=O(L,S,u),F=O(.15*L+.6*k,.3*S,u),b=k*(1-u)+v;return x?p.placeAt(0,A,0,n,r):(r[0]=0,r[1]=A,r[2]=0),r[0]+=re[0]*b+Math.cos(f[l+2])*d[l]*F,r[1]+=w,r[2]+=re[1]*b+Math.sin(f[l+2])*d[l]*F,r[3]=.5*y*f[l+3],r}function Fa(a){const s=a("flames"),i=new Float32Array($e*4),c=new Float32Array($e*4),o=$e-ka;for(let h=0;h<$e;h++){const r=h>=o;i.set([s()*Q,r?-1:H*(h+s())/o,r?2.2+2.6*s():1.5+1.5*s(),r?.55+.6*s():3+3*s()],h*4),c.set([s(),(330+60*Math.floor(4*s()))/oe,s(),(300+150*Math.floor(4*s()))/oe],h*4)}return{A:i,B:c}}function Ra(a){const s=a("cascade"),i=new Float32Array(Ne*4),c=new Float32Array(Ne*4);for(let o=0;o<Ne;o++)i.set([s()*Q,3.4+1.6*s(),8*s(),1+1.5*s()],o*4),c.set([s(),.1+.12*s(),s(),(o+.5)/Ne],o*4);return{A:i,B:c}}const We=2400,Ea=400,so=5,Ct=1,yn=2.2,no=[8.5*_,40*_],zt=.7;function _a(a,s){const i=a("burst"),c=new Float32Array(We*4),o=new Float32Array(We*4),h=new Float32Array(We*4),r=[-se[1],se[0]],m=s.when(no[0],s.leanAt),x=s.when(no[1],s.leanAt);for(let p=0;p<We;p++)if(p<Ea){const f=i(),d=(f<zt?2:[1,3,4][Math.min(2,Math.floor((f-zt)/(1-zt)*3))])*j+(i()-.5)*1.5,l=i()*Q,e=J(N+d)*(.5+.5*i()),t=3+5*i();c.set([O(m,x,Math.pow(i(),2)),2+1.5*i(),.22+.28*i(),i()],p*4),o.set([Math.cos(l)*e,N+d,Math.sin(l)*e,0],p*4),h.set([Math.cos(l)*t,-2+8*i(),Math.sin(l)*t,0],p*4)}else{const f=H*i(),d=Math.min(Y-1,Math.floor(f/j)),l=i()*Q,e=2.5*Math.sqrt(i()),t=(i()*2-1)*J(N+f);c.set([s.touch[d]+.4*i()*i(),2.5+2*i(),.22+.28*i(),i()],p*4),o.set([r[0]*t,N+f,r[1]*t,1],p*4),h.set([Math.cos(l)*e,8+14*i(),Math.sin(l)*e,0],p*4)}return{A:c,O:o,V:h}}function bn(a,s,i,c,o,h){const{A:r,O:m,V:x}=a,p=s*4,f=i-r[p];return o.placeAt(m[p],m[p+1],m[p+2],m[p+3]>.5?c.tStrike+1:r[p],h),h[0]+=x[p]*f+re[0]*Ct*f,h[1]+=x[p+1]*f-.5*so*f*f,h[2]+=x[p+2]*f+re[1]*Ct*f,h[3]=f>=0&&f<=r[p+1]&&h[1]>0?1:0,h}const mt=140,ro=120,Ta=120,Ke=mt+ro+Ta,io=1.5,lo=.31,pt=9.81;function Pa(a,s){const i=a("steam"),c=new Float32Array(Ke*4),o=new Float32Array(Ke*4);for(let h=0;h<Ke;h++){const r=h<mt,m=h>=mt+ro,x=r?(h+i())/mt:i(),p=H*(lo+(1-lo)*x),f=Math.min(Y-1,Math.floor(p/j));if(m){c.set([s.touch[f]+.25*i(),p,2,i()],h*4),o.set([9+10*i(),1+3*i(),(i()<.5?-1:1)*(.9+.2*i()),1.2+1.4*i()],h*4);continue}c.set([s.touch[f]+.3*x+(r?.3*i():0),p,r?0:1,i()],h*4),o.set([r?5+30*Math.pow(i(),2.2):(100+Math.floor(51*i()))/oe,i(),i()*2-1,.75+.5*i()],h*4)}return{A:c,B:o}}function An(a,s,i,c,o,h,r){const{A:m,B:x}=a,p=s*4,f=i-m[p],d=m[p+2]>.5&&m[p+2]<1.5,l=m[p+2]>1.5,e=d?(x[p+1]+c*x[p])%1:0,t=d?e/x[p]:f,n=Math.max(f,0),u=l?x[p]*n-.5*pt*n*n:d?8*(1-Math.exp(-t/1.6)):x[p]*(1-Math.exp(-n/.9))+1.5*n,w=l?x[p+3]:d?O(2,5,e)*x[p+3]:O(3,9.5*x[p+3],1-Math.exp(-n/1.5));h.placeAt(0,N+m[p+1],0,o.tStrike+1,r);const v=x[p+2]*(1.1*J(N+m[p+1])+(l?0:.25*u))+(l?Math.sign(x[p+2])*x[p+1]*n:0),A=l?0:io*t,k=l?0:(m[p+3]-.5)*.5*u;return r[0]+=-se[1]*v+se[0]*k+re[0]*A,r[1]=Math.max(r[1],0)+.5+u,r[2]+=se[0]*v+se[1]*k+re[1]*A,r[3]=.5*w,r[4]=f<=0?0:l?.5*T(0,.1,f)*(1-T(.75,1,n*pt/(2*x[p]))):d?T(0,1,f)*O(1,.5,T(0,8,f))*T(0,.12,e)*(1-T(.5,1,e))*.35:T(0,.3,f)*(1-T(3.5,6,f))*.5,r}const Da=700,kn=13,Oa=250,$a=22*_,Na=.6;function Wa(a,s,i){const c=a("wreck"),o=[],h=se,r=s.when($a,s.leanAt),m=s.pose(ge,[]),x=[0,0,0];for(let p=0;p<Da;p++){const f=H*(.02+.98*c()),d=Math.min(Y-1,Math.floor(f/j)),l=J(N+f),e=c()<.5?-1:1,t=Z(f+(c()-.5)*3,.3,H-.05),n=Math.max(l,J(N+t))+(.4+3.4*c()*c())/Pe;s.place(m,-h[1]*e*n,N+t,h[0]*e*n,x);const u=x[0],w=x[2],v=i.height(u,w),A=p<Oa,k=c(),L=c(),S=c(),y=A?O(Math.min(r,s.touch[d]-Na),s.touch[d]-.1,k):s.touch[d]+.05+.3*k,F=A?s.touch[d]-y+.3+.5*L:.5+.7*L,b=A?-1:1+3*S;o.push({sl:f,x:u,y:Math.max(v,0)+.05,z:w,side:e,afloat:v<=.02?1:0,event:y,flight:F,arc:b,turn:c()*Q,tilt:(c()-.5)*.3,spin:(2+4*c())*(c()<.5?-1:1),keep:c()<.35?.6+.4*c():.12*c(),tone:c(),phase:c()})}return o}function Mn(a,s,i,c,o){const h=Z((s-a.event)/a.flight,0,1),r=a.arc<0?h*h:h,m=a.side*.9*J(N+a.sl);return c.place(i,-se[1]*m,N+a.sl,se[0]*m,o),o[0]=O(o[0],a.x,r),o[1]=O(o[1],a.y,r)+Math.max(a.arc,0)*4*h*(1-h),o[2]=O(o[2],a.z,r),o[3]=s>=a.event?1:0,o}const Ft=[Math.sin(225*_),-Math.cos(225*_)],Sn=10.5,Ln=16,Ia=12,Ga=3,Cn=1.2,zn=2.6,Fn=62,Le=7,wt=1600,Rn=2150,En=135;function Ba(a){const s=a.makeNoise(a.hashSeed("pallet-tower-midsummer:ground")),i=b=>Fn+.375*(Math.hypot(b,15)-15)-.075*b+(b>500?2.7*(b-500)*(b-500)/(b-500+80):0),c=b=>i(b)+4*s.fbm2(b*.012,3.3,3)*T(20,80,Math.abs(b)),o=Le/.22+.5+4.6,h=c(0)+6,r=(b,z,C)=>b>=-.5?z*T(-.5,C,b):-Z((-b-.5)*.3,0,Le),m=(b,z)=>{const C=b*-Ft[1]+z*Ft[0],E=b*Ft[0]+z*Ft[1],D=Math.atan2(E,C-Ga),B=1+.09*s.n2(Math.cos(D)*1.7+3,Math.sin(D)*1.7-5)+.04*s.n2(Math.cos(D)*5+9,Math.sin(D)*5);return[(1-Math.hypot((C-Ga)/(Ln*B),E/(Ia*B)))*Ia*B,Sn-E]},x=(b,z)=>{const C=h;if(z<4||z>C)return-1e3;const E=1.8*Math.sin(z/11),D=zn+.8*s.n2(z*.2,1.3);return Math.min(D-Math.abs(b-E),z-4,C-z)},p=(b,z)=>{if(z-i(b)<-o)return-Le;const C=z-c(b);if(C<-.5)return-Z((-C-.5)*.22,0,Le);const E=Math.max(0,C-3);return 1.2*T(-.5,3,C)+11.5*(1-Math.exp(-E/110))+2*s.fbm2(b/180,z/180,3)*T(30,200,C)+.25*s.fbm2(b/9,z/9,2)*T(3,12,C)},f=(b,z)=>{const C=(b+z)*Math.SQRT1_2;if(C<wt-70)return-Le;const E=(b-z)*Math.SQRT1_2,D=C-(wt+60*s.fbm2(E*.004,7.7,3));if(D<-.5)return-Le;const B=En*Math.exp(-(((C-Rn)/260)**2))*T(1150,500,Math.abs(E-100))*(.85+.15*s.fbm2(E*.006,C*.006,3));return 1.5*T(-.5,6,D)+12*T(0,250,D)+B+3*s.fbm2(b/150,z/150,3)*T(20,200,D)},d=(b,z,C)=>{const E=-z,D=b*b+z*z>3136?null:m(b,z),B=D?Math.min(r(D[0],N,1.6),r(D[1],N,.4)):-Le,$=Math.abs(b)>30?-Le:r(x(b,E),Cn,1.5),q=p(b,E),P=f(b,E);let U=B,W=1;return $>U&&(U=$),q>U&&(U=q,W=2),P>U&&(U=P,W=3),C.h=U,C.kind=U<0?0:W,C.shore=W===2?E-c(b):W===3?(b+E)*Math.SQRT1_2-wt:0,C},l={h:0,kind:0,shore:0},e=(b,z)=>d(b,z,l).h,t=b=>new g.Color(b),n=t("#23211f"),u=t("#2f2c29"),w=t("#6a655d"),v=t("#7c766a"),A=t("#51692f"),k=t("#6c7838"),L=t("#2a4026"),S=t("#5a664c"),y=new g.Color;return{height:e,color:(b,z,C,E,D)=>{d(b,z,l);const B=.5+.5*s.n2(b*.31+5,z*.31+77),$=.5+.5*s.fbm2(b*.02,z*.02-4,3);return l.kind<=1?y.copy(w).lerp(v,B):l.kind===2?(y.copy(A).lerp(k,$),y.lerp(w,1-T(2,7,l.shore)+.5*(1-T(.75,.9,E)))):(y.copy(S).lerp(L,T(18,40,C)),y.lerp(w,1-T(1,5,l.shore))),y.lerp(u,1-T(.1,.7,C)),C<0&&y.lerp(n,T(0,2,-C)),D.r=y.r*(.9+.2*B),D.g=y.g*(.9+.2*B),D.b=y.b*(.9+.2*B),D},waterline:c,parts:d,noise:s}}const co=300,Rt=75,ho=220,Et=[125,195,90],Ua=22,qa=12,Va=15,_t=60,Ha=70,xe=[295,350,400,20],ja=300,uo=(a,s)=>(Math.atan2(a,-s)/_+360)%360,_n=[[1,0],[-1,0],[1,1],[1,-1],[-1,1],[-1,-1],[0,1],[0,-1],[0,0]];function fo(a){const s=Math.ceil(a.L),i=new Float64Array(s+1),c=new Float64Array(s+1),o=new Float64Array(s+1),h=new g.Vector3;for(let n=0;n<=s;n++)a.path.posAtDist(a.L*n/s,h),i[n]=h.x,c[n]=h.y,o[n]=h.z;const r=a.path.startTangent,m=Math.hypot(r.x,r.z),x=-r.x/m,p=-r.z/m,f=[],d=[];let l=0;for(let n=0;n<=s;n++)c[n]<Ua&&(f.push(i[n]),d.push(o[n]),l=Math.max(l,Math.hypot(i[n],o[n])));return{n:s,X:i,Y:c,Z:o,low:(n,u)=>{const w=Math.hypot(n,u);if(w>l+40)return w-l;let v=1e9;for(let A=0;A<f.length;A++){const k=(f[A]-n)*(f[A]-n)+(d[A]-u)*(d[A]-u);k<v&&(v=k)}return Math.sqrt(v)},entry:(n,u)=>{const w=Z((n-i[0])*x+(u-o[0])*p,0,_t);return Math.hypot(n-i[0]-x*w,u-o[0]-p*w)},reach:l}}function*Ka(a,s,i){const c=a("boats-place"),o=a("boats-kind"),h=a("boats-raft"),r=fo(s),m=[],x=t=>{if(Math.hypot(t.x,t.z)>ho)return!1;const n=Math.sin(t.head*_),u=-Math.cos(t.head*_),w=t.len/2+.5,v=t.beam/2+.5;for(const[A,k]of _n){const L=t.x+n*A*w+u*k*v,S=t.z+u*A*w-n*k*v,y=Math.hypot(L,S),F=uo(L,S);if(y<Rt||F>Et[0]-1&&F<Et[1]+1&&y<Et[2]+1||r.low(L,S)<qa||r.entry(L,S)<Va||i.height(L,S)>-2)return!1}return!0},p=t=>{for(const n of m)if(n.raft!==t.raft&&Math.hypot(n.x-t.x,n.z-t.z)<(n.len+t.len)*.5+1.5)return!1;return!0},f=(t,n)=>({kind:t,len:n,beam:t==="sail"?Math.max(2.2,.3*n):t==="open"?.38*n:t==="ship"?5.6:Math.max(1.9,.34*n),mast:t==="sail"?1.25*n:t==="ship"?21:0,x:0,z:0,head:0,raft:0}),d=(t,n,u,w,v)=>(t.x=u*Math.sin(n*_),t.z=-u*Math.cos(n*_),t.head=w,t.raft=v,t);m.push(d(f("ship",22),214,152,ja,1),d(f("rescue",9),116,104,206,2),d(f("under-way",6),236,262,150,3));let l=3,e=0;for(;m.length<co&&e++<4e4;){(e&31)===0&&(yield);const t=o(),n=t<.64?"motor":t<.86?"sail":"open",u=o(),w=f(n,n==="motor"?5+7*u*u:n==="sail"?7+7*u*u:3.5+1.5*u),v=c()*360,A=Rt+(ho-Rt)*Math.pow(c(),1.5),k=ja+18*c.gauss(),L=h()<.3?h.int(3,5):1,S=[d(w,v,A,k,++l)],y=Math.cos(k*_),F=Math.sin(k*_);for(let z=1;z<L;z++){const C=h(),E=f(C<.7?"motor":"sail",C<.7?5+6*h():7+5*h()),D=S[z-1],B=D.beam/2+E.beam/2+.3;E.x=D.x+y*B,E.z=D.z+F*B,E.head=k,E.raft=l,S.push(E)}if(m.length+S.length>co)continue;let b=!0;for(const z of S)if(!x(z)||!p(z)){b=!1;break}if(b)for(const z of S)m.push(z)}return m}function Tn(a,s,i){const c=Ka(a,s,i);let o;for(;!(o=c.next()).done;);return o.value}const Ya=2330,Xa=400,Pn=520,vo=.6,mo=.5;function Qa(a,s,i,c){const o=a("people"),h=[],r={h:0,kind:0,shore:0},m=c.near.map(l=>{const e=-l.turn*_;return[l.x,l.z,Math.cos(e),Math.sin(e),l.w/2+mo,l.d/2+mo]}),x=(l,e)=>{for(const t of m){const n=l-t[0],u=e-t[1];if(Math.abs(t[2]*n-t[3]*u)<t[4]&&Math.abs(t[3]*n+t[2]*u)<t[5])return!0}return!1},p=(l,e)=>{for(const t of h)if(Math.hypot(t.x-l,t.z-e)<vo)return!0;return!1},f=(l,e,t,n,u)=>{h.length<Ya&&Math.hypot(l,t)>=Ha&&h.push({x:l,y:e,z:t,sit:n,boat:u,tall:1.55+.3*o(),turn:o()*360,r:Math.hypot(l,t)})};let d=0;for(;h.length<Pn&&d++<2e4;){const l=-135+235*o(),e=5+43*Math.pow(o(),1.4),t=-(i.waterline(l)+e);i.parts(l,t,r),!(r.kind!==2||r.h<.8||x(l,t)||p(l,t))&&f(l,r.h,t,o()<.35,-1)}for(let l=0;l<s.length;l++){const e=s[l],t=e.kind==="ship"?14:e.kind==="open"||e.kind==="under-way"?1+Math.floor(o()*2.5):2+Math.floor(o()*Math.min(5,e.len*.45)),n=Math.sin(e.head*_),u=-Math.cos(e.head*_),w=To(e),[v,A,k]=bs[e.kind],L=[];for(let S=0;S<t;S++){let y=0,F=0,b=!1,z=!1;for(let E=0;E<16&&!z;E++){y=O(v,A,o())*e.len,F=(o()-.5)*2*k*e.beam,b=o()<.5||e.kind==="open"||e.kind==="under-way",e.kind==="sail"&&y>As*e.len&&Math.abs(F)<ks&&(b=!0),e.kind==="ship"&&Math.hypot(y-Ms*e.len,F)<Ss&&(F=F<0?-Po:Po),z=!0;for(const D of L)if(Math.hypot(D[0]-y,D[1]-F)<vo){z=!1;break}}if(!z)continue;L.push([y,F]),f(e.x+n*y+u*-F,w,e.z+u*y+n*F,b,l);const C=h[h.length-1];C&&C.boat===l&&C.al===void 0&&(C.al=y,C.ac=F)}}return h.sort((l,e)=>l.r-e.r),h}function Za(a,s){const i=a("houses"),c=a("town"),o=[],h=[],r={h:0,kind:0,shore:0},m=l=>(s.waterline(l+1)-s.waterline(l-1))/2,x=(l,e,t)=>{const n=-l.turn*_,u=Math.cos(n),w=Math.sin(n);let v=1e9;for(let A=0;A<4;A++)for(let k=0;k<e;k++){const L=k/e-.5,S=(A===0?L:A===1?.5:A===2?-L:-.5)*l.w,y=(A===0?-.5:A===1?L:A===2?.5:-L)*l.d;v=Math.min(v,Math.max(s.height(l.x+u*S+w*y,l.z+u*y-w*S),-.4))}return l.sunk=Math.max(0,l.y-v+t),l};for(let l=-172;l<124;l+=10+12*i()){if(Math.abs(l)<9)continue;const e=-(s.waterline(l)+4.5);o.push({x:l,z:e,y:Math.max(.6,s.height(l,e)-.4),w:5.5+i()*1.5,d:8+i()*2.5,wall:2.7,roof:2.1,turn:-Math.atan(m(l))/_,tone:i()<.7?0:1})}let p=0;for(;o.length<60&&p++<6e3;){const l=-600+1020*i(),e=58+272*i(),t=-(s.waterline(l)+e);if(s.parts(l,t,r),r.kind!==2)continue;let n=!0;for(const v of o)if(Math.hypot(v.x-l,v.z-t)<16){n=!1;break}if(!n)continue;const u={x:l,z:t,y:r.h-.5,w:7+i()*3,d:9+i()*4,wall:5+i()*1.5,roof:2.6,turn:-Math.atan(m(l))/_+(i()<.3?90:0),tone:2},w=uo(l,t);w>xe[0]&&w<xe[1]&&Math.hypot(l,t)<xe[2]&&u.y+u.wall+u.roof>xe[3]||o.push(u)}for(p=0;h.length<600&&p++<2e4;){const l=-950+2e3*c(),e=8+372*Math.pow(c(),1.3),t=wt+75+e,n=(t+l)*Math.SQRT1_2,u=(t-l)*Math.SQRT1_2;s.parts(n,-u,r),!(r.kind!==3||r.h<1||r.h>62)&&h.push({x:n,z:-u,y:r.h-1,w:8+c()*7,d:8+c()*9,wall:5+c()*7,turn:45+(c()<.5?0:90)+8*c.gauss(),tone:c()})}for(const l of o)x(l,8,.2);for(const l of h)x(l,2,1);const f=wt-40,d=700;return{near:o,town:h,ship:{x:(f+d)*Math.SQRT1_2,z:-(f-d)*Math.SQRT1_2,len:190,beam:26,high:22,turn:135}}}const Ye=[[-70,40,12,9,13.5],[-62,30,11,13.5,18],[-50,18,9.5,18,22]],Xe=[-30,-18,3.5,22,27],Ja=500;function es(a,s,i){const c=a("trees"),o=[],h={h:0,kind:0,shore:0};let r=0;for(;o.length<Ja&&r++<3e4;){const m=-950+1430*c(),x=28+492*Math.pow(c(),1.3),p=-(s.waterline(m)+x);if(m>-140&&m<104&&x<56||(s.parts(m,p,h),h.kind!==2)||s.noise.fbm2(m/70+11,p/70-3,3)<-.08)continue;let f=!0;for(const t of i.near)if(Math.hypot(t.x-m,t.z-p)<8){f=!1;break}if(!f)continue;let d=6+6*c();const l=c()*360,e=uo(m,p);e>xe[0]&&e<xe[1]&&Math.hypot(m,p)<xe[2]&&(d=Math.min(d,xe[3]-h.h),d<4)||o.push({x:m,y:h.h-.2,z:p,tall:d,turn:l})}return o}const ts=140,po=30,os=95,as=25,ss=16,Qe=.8,ns=(a,s,i)=>(i[0]=a.cx+a.R*Math.cos(s),i[1]=a.h+a.bob*Math.sin(a.waves*s+Q*a.phase),i[2]=a.cz+a.R*Math.sin(s),i),Dn=(a,s)=>{const i=a.turns*s/oe%1;return a.ang0+Q*(i<0?i+1:i)};function rs(a,s,i){const c=a("gulls"),o=fo(s),h=[],r=(po+Qe+1.5)*(po+Qe+1.5),m=[0,0,0];let x=0;const p=o.n+1+_t,f=new Float64Array(p),d=new Float64Array(p),l=new Float64Array(p);f.set(o.X),d.set(o.Y),l.set(o.Z);{const e=s.path.startTangent,t=Math.hypot(e.x,e.z);for(let n=1;n<=_t;n++){const u=o.n+n;f[u]=o.X[0]-e.x/t*n,d[u]=o.Y[0],l[u]=o.Z[0]-e.z/t*n}}for(;h.length<ts&&x++<6e3;){const e=c()*Q,t=112+103*c(),n=18+32*c(),u=27+33*c(),w=.3+.9*c(),v=1+Math.floor(3*c()),A=c()<.5?-1:1,k=8.5+3*c(),L={cx:Math.sin(e)*t,cz:-Math.cos(e)*t,R:n,h:u,bob:w,waves:v,ang0:c()*Q,phase:c(),turns:A*Math.max(1,Math.round(k*oe/(Q*n))),beats:Math.round((2.6+.8*c())*oe),glide:40+Math.floor(50*c()),glidePhase:c()};if(t-n-Qe<os+1||u-w-Qe<as)continue;let S=!0;for(let y=0;y<p;y++){const F=Math.abs(Math.hypot(f[y]-L.cx,l[y]-L.cz)-n),b=Math.max(0,Math.abs(d[y]-u)-w);if(F*F+b*b<r){S=!1;break}}for(let y=0;S&&y<72;y++)ns(L,y*Q/72,m),m[1]-Qe-Math.max(0,i.height(m[0],m[2]))<ss+.5&&(S=!1);S&&h.push(L)}return h}function On(){return{uSunDir:{value:new g.Vector3(0,1,0)},uSunCol:{value:new g.Color},uSkyCol:{value:new g.Color},uGndCol:{value:new g.Color},uFireA:{value:new g.Vector3(0,K-1,0)},uFireB:{value:new g.Vector3(0,K,0)},uFireCol:{value:new g.Color(0,0,0)},uHazeCol:{value:new g.Color},uGlowCol:{value:new g.Color},uGlow:{value:new g.Vector2(1,4)},uSunTrue:{value:new g.Vector3(0,0,-1)},uSunHigh:{value:12}}}const Ce=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uFireA, uFireB, uFireCol;
vec3 worldLight(vec3 P, vec3 N){
  vec3 l = mix(uGndCol, uSkyCol, .5 + .5*N.y) + uSunCol*max(dot(N, uSunDir), 0.);
  vec3 ab = uFireB - uFireA; float t = clamp(dot(P - uFireA, ab)/max(dot(ab, ab), 1e-4), 0., 1.);
  vec3 v = uFireA + ab*t - P; float d2 = dot(v, v);
  l += uFireCol*(.3 + .7*max(dot(N, v*inversesqrt(max(d2, 1e-4))), 0.))/(1. + d2/3600.);
  return l; }`,$n=`
varying vec3 vP, vN, vC;
#include <fog_pars_vertex>
void main(){
  vec4 p = vec4(position, 1.); vec3 n = normal;
  #ifdef USE_INSTANCING
    p = instanceMatrix*p; n = mat3(instanceMatrix)*n;
  #endif
  vec4 wp = modelMatrix*p; vP = wp.xyz; vN = normalize(mat3(modelMatrix)*n); vC = vec3(1.);
  #ifdef USE_INSTANCING_COLOR
    vC = instanceColor;
  #endif
  #ifdef USE_COLOR
    vC *= color;
  #endif
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Nn=`
uniform vec3 uTint; varying vec3 vP, vN, vC;
${Ce}
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN); if(!gl_FrontFacing) N = -N;
  gl_FragColor = vec4(uTint*vC*worldLight(vP, N), 1.);
  #include <fog_fragment>
}`,Ie=()=>g.UniformsUtils.clone(g.UniformsLib.fog),wo=(a,s="#ffffff",i=g.FrontSide)=>new g.ShaderMaterial({uniforms:{...Ie(),...a,uTint:{value:new g.Color(s)}},vertexShader:$n,fragmentShader:Nn,fog:!0,side:i});function go(a,s){const i=new g.BufferGeometry;i.setAttribute("position",new g.Float32BufferAttribute(a,3)),i.setIndex(s);const c=i.toNonIndexed();return c.computeVertexNormals(),i.dispose(),c}function Tt(a,s,i=1,c=1){const o=[],h=[];for(const[r,m]of a)for(let x=0;x<s;x++){const p=x/s*Q;o.push(Math.cos(p)*r*i,m,Math.sin(p)*r*c)}for(let r=0;r<a.length-1;r++)for(let m=0;m<s;m++){const x=r*s+m,p=r*s+(m+1)%s,f=x+s,d=p+s;a[r][0]>0&&h.push(x,f,p),a[r+1][0]>0&&h.push(p,f,d)}return go(o,h)}const Ze=.144,xo=1.2,M=a=>a.toFixed(3),ee=`
uniform float uPass[${Se}]; uniform float uT, uClock, uEmber; uniform vec4 uFire; uniform sampler2D uNoise; uniform vec3 uWind;
const float TOP = ${M(K)}, FOOT = ${M(N)}, STACK_L = ${M(H)};
float passAt(float depth){ float i = sqrt(clamp(depth/STACK_L, 0., 1.))*${M(Se-1)}, k = min(floor(i), ${M(Se-2)}); int n = int(k); return mix(uPass[n], uPass[n + 1], i - k); }
float ageAt(float y){ return uT - passAt(TOP - y); }
float stackR(float y){ return y <= ${M(N+le)} ? ${M(ct)} : mix(${M(ct)}, ${M(Me)}, clamp((y - ${M(N+le)})/${M(H-le)}, 0., 1.)); }
// fire's colour by its heat (0 to 1), 3.0 at the most, in the heart (the hottest tenth: rule F3): a covering colour in the sleeve, the tongues, the core and the heart; added to the lit wood in the shell and the pallets; summed in the cascade's fragments alone (0.9 of it)
vec3 fireRamp(float t){
  vec3 c = mix(vec3(.14, .008, 0.), vec3(.85, .12, .008), smoothstep(0., .38, t));
  c = mix(c, vec3(1.5, .36, .02), smoothstep(.3, .68, t));
  c = mix(c, vec3(2.3, .95, .12), smoothstep(.62, 1., t));
  return mix(c, vec3(3., 1.7, .45), smoothstep(.9, 1., t)); }`,G=a=>a.toFixed(6),ye=`
uniform vec4 uPiece[${Y}]; uniform vec3 uJoint[${Y}]; uniform float uLean[${fe}]; uniform vec2 uLand[${Y}]; uniform vec4 uFall;      // (lean, swing, landed share, how far it is drawn in); each length's foot; the rod's lean; each length's (touch, landing) seconds; (the release, the strike, the break: seconds)
const float LEADS[${Y}] = float[${Y}](${ht.map(G).join(", ")}), SWINGS[${Y}] = float[${Y}](${jt.map(G).join(", ")});
const vec2 FALLD = vec2(${G(Math.sin(pe*_))}, ${G(-Math.cos(pe*_))});
vec3 fallPlace(vec3 p, out vec3 e, out vec3 a, out vec3 n, out float ld){
  float sl = p.y - FOOT, k = clamp(floor(sl/${G(j)}), 0., ${Y-1}.); int i = int(k); sl -= k*${G(j)};
  vec4 q = uPiece[i]; float cs = cos(q.y), sn = sin(q.y), ct = cos(q.x), st = sin(q.x); vec2 f = vec2(FALLD.x*cs - FALLD.y*sn, FALLD.x*sn + FALLD.y*cs);
  a = vec3(f.x*st, ct, f.y*st); e = vec3(f.x*ct, -st, f.y*ct); n = vec3(-f.y, 0., f.x); ld = q.z;
  float rf = dot(p.xz, FALLD), rn = dot(p.xz, vec2(-FALLD.y, FALLD.x));
  return uJoint[i] + a*(${G(j/2)} + (sl - ${G(j/2)})*q.w) + e*(rf*mix(1., ${M(ut)}, ld)) + n*(rn*mix(1., ${M(Pe)}, ld));
}
vec3 fallTurn(vec3 v, vec3 e, vec3 a, vec3 n){ return e*dot(v.xz, FALLD) + a*v.y + n*dot(v.xz, vec2(-FALLD.y, FALLD.x)); }
float leanAt(float T){ float x = clamp((T - uFall.x)/(uFall.y - uFall.x), 0., 1.)*${fe-1}., k = min(floor(x), ${fe-2}.); int j = int(k); return mix(uLean[j], uLean[j + 1], x - k); }
vec3 lengthPlace(vec3 p, float T){
  float th = leanAt(T), sl = p.y - FOOT, k = clamp(floor(sl/${G(j)}), 0., ${Y-1}.), a = 0.; int pi = int(k); sl -= k*${G(j)};
  vec3 J = vec3(0., FOOT, 0.); vec2 f = FALLD;
  for (int i = 0; i < ${Y}; i++) {
    a = min(${G(ae)}, th + LEADS[i]*pow(max(th - ${G(he)}, 0.)/${G(Vt-he)}, ${M(Ht)}));
    float sw = SWINGS[i]*smoothstep(${G(he)}, ${G(ae)}, a), cs = cos(sw), sn = sin(sw); f = vec2(FALLD.x*cs - FALLD.y*sn, FALLD.x*sn + FALLD.y*cs);
    if (i == pi) break;
    J += ${G(j)}*vec3(sin(a)*f.x, cos(a), sin(a)*f.y);
  }
  float ld = smoothstep(uLand[pi].x, uLand[pi].y + ${M(Kt)}, T), al = ${G(j/2)} + (sl - ${G(j/2)})*mix(1., ${M(kt)}, smoothstep(${G(he)}, ${G(Mt)}, a)), st = sin(a), ct = cos(a);
  float rf = dot(p.xz, FALLD)*mix(1., ${M(ut)}, ld), rn = dot(p.xz, vec2(-FALLD.y, FALLD.x))*mix(1., ${M(Pe)}, ld);
  return J + vec3(f.x*(st*al + ct*rf) - f.y*rn, ct*al - st*rf, f.y*(st*al + ct*rf) + f.x*rn);
}`;function yo(a,s,i,c){const o=[],h=[],r=[],m=[],x=a.length;for(let f=0;f<x;f++){const[d,l]=a[f],e=a[Math.max(0,f-1)],t=a[Math.min(x-1,f+1)],n=-(t[0]-e[0])/Math.max(1e-6,t[1]-e[1]),u=1/Math.hypot(1,n);for(let w=0;w<=s;w++){const v=w/s*Q;o.push(Math.cos(v)*d,l,Math.sin(v)*d),h.push(Math.cos(v)*u,n*u,Math.sin(v)*u),r.push(w/s,f/(x-1))}}for(let f=0;f<x-1;f++){if(a[f+1][1]-a[f][1]<.01){if(c)for(const[d,l]of[[f,1],[f+1,-1]]){const[e,t]=a[d],n=o.length/3;for(let u=0;u<=s;u++){const w=u/s*Q;o.push(Math.cos(w)*e*c,t,Math.sin(w)*e*c),h.push(0,l,0),r.push(u/s,d/(x-1))}o.push(0,t,0),h.push(0,l,0),r.push(.5,d/(x-1));for(let u=0;u<s;u++)m.push(n+u,n+s+1,n+u+1)}continue}for(let d=0;d<s;d++){const l=f*(s+1)+d,e=l+1,t=l+s+1,n=t+1;m.push(l,t,e,e,t,n)}}if(i){const[f,d]=a[x-1],l=o.length/3;for(let e=0;e<=s;e++){const t=e/s*Q;o.push(Math.cos(t)*f,d,Math.sin(t)*f),h.push(0,1,0),r.push(e/s,1)}o.push(0,d,0),h.push(0,1,0),r.push(.5,1);for(let e=0;e<s;e++)m.push(l+e,l+s+1,l+e+1)}const p=new g.BufferGeometry;return p.setAttribute("position",new g.Float32BufferAttribute(o,3)),p.setAttribute("normal",new g.Float32BufferAttribute(h,3)),p.setAttribute("uv",new g.Float32BufferAttribute(r,2)),p.setIndex(m),p}const is=(a,s)=>{const i=a.slice(),c=a[a.length-1][1];for(let o=1;o<Y;o++){const h=N+o*j;h<c&&i.push([s(h),h-.002],[s(h),h+.002])}return i.sort((o,h)=>o[1]-h[1])};async function Wn(a,s){const c=a.makeRng(a.hashSeed("pallet-tower-midsummer:noise")),o=new Uint8Array(16384*4),h=m=>m*m*(3-2*m);for(let m=0;m<4;m++){const x=[];for(let p=0;p<3;p++){const f=[4,8,16,5][m]<<p,d=new Float32Array(f*f);for(let l=0;l<f*f;l++)d[l]=c();x.push([f,d])}for(let p=0;p<128;p++)for(let f=0;f<128;f++){let d=0,l=.5,e=0;for(const[t,n]of x){const u=f/128*t,w=p/128*t,v=Math.floor(u),A=Math.floor(w),k=h(u-v),L=h(w-A),S=(v+1)%t,y=(A+1)%t;d+=l*O(O(n[A*t+v],n[A*t+S],k),O(n[y*t+v],n[y*t+S],k),L),e+=l,l*=.5}o[(p*128+f)*4+m]=Math.round(255*Z((d/e-.5)*1.6+.5,0,1))}await s()}const r=new g.DataTexture(o,128,128,g.RGBAFormat);return r.wrapS=r.wrapT=g.RepeatWrapping,r.magFilter=g.LinearFilter,r.minFilter=g.LinearMipmapLinearFilter,r.generateMipmaps=!0,r.needsUpdate=!0,r}function In(a,s,i,c){return{uPass:{value:a.passTable},uT:{value:0},uClock:{value:0},uEmber:{value:.3},uFire:{value:new g.Vector4(K,3,0,0)},uNoise:{value:s},uWind:{value:new g.Vector3(re[0],re[1],dt)},uCrown:{value:new g.Vector4(.4,-.3,.08,.3)},uSmoke:{value:new g.Vector4(0,K+2.4,0,0)},uShow:{value:new g.Vector4(0,0,0,0)},uPiece:{value:Array.from({length:Y},()=>new g.Vector4(0,0,0,1))},uJoint:{value:Array.from({length:Y},(o,h)=>new g.Vector3(0,N+h*j,0))},uLean:{value:c.leanTable},uLand:{value:c.land.map((o,h)=>new g.Vector2(c.touch[h],o))},uFall:{value:new g.Vector4(i.tRock,i.tStrike,c.tBreak,0)}}}const ls=`
varying vec3 vP, vN, vL; varying vec2 vUv; varying float vWl;      // (vWl: the normal's height as it stands in the standing stack: wall or cap)
${ee}
${ye}
#include <fog_pars_vertex>
void main(){
  vL = position; vUv = uv; vWl = normal.y;
  vec3 e3, a3, n3; float ld; vec3 Q = fallPlace(position, e3, a3, n3, ld);
  vec4 wp = modelMatrix*vec4(Q, 1.); vP = wp.xyz; vN = normalize(mat3(modelMatrix)*fallTurn(normal, e3, a3, n3));
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Gn=[[.038469,.038469,.038208,.4412],[.038208,.037957,.036996,.44173],[.037223,.036137,.033024,.44224],[.033806,.030748,.023132,.44262],[.024908,.018626,.0065665,.44301],[.0073597,.0048423,.0023388,.44338],[.0035417,.0017035,0,.44412],[.044944,.044944,.043943,.49591],[.043943,.043052,.039788,.4964],[.040437,.037405,.029632,.49689],[.031296,.02524,.012133,.49758],[.013548,.0088286,.0029704,.4981],[.0037782,.0022481,41805e-8,.49853],[50268e-8,22886e-8,0,.49902],[.049905,.049905,.046787,.49818],[.046787,.044467,.036751,.49867],[.038041,.032439,.018903,.49916],[.020402,.014882,.0076771,.49966],[.0092064,.006269,.0026197,.50031],[.0031612,.0020761,35389e-8,.50049],[5052e-7,21947e-8,0,.50098]],Bn=[113,127,128],cs=[.34,1,0,5.5],hs=[0,1.25,.41,3],us=K-.2,fs=K-.5,Un=a=>a.toExponential(4),qn=Gn.map(a=>"vec4("+a.map(Un).join(", ")+")").join(", "),vs=`
const vec4 LOST[21] = vec4[21](${qn});
const vec3 LAST = vec3(${Bn.map(M).join(", ")})/255.;
const vec4 CORE = vec4(${cs.map(M).join(", ")}), HEART = vec4(${hs.map(M).join(", ")}); const float CORE_TOP = ${M(us)}, HEART_TOP = ${M(fs)};
// a lookup's level: gx, gy the slopes of (the turn, the height) across a pixel, k the lookup's scale of them; 128 texels a turn of the texture
float noiseLod(vec2 gx, vec2 gy, vec2 k){ vec2 a = gx*k*128., b = gy*k*128.; return clamp(.5*log2(max(max(dot(a, a), dot(b, b)), 1e-12)), 0., 6.); }
// the unfiltered noise's (mean, spread squared) where channel ch's lookup at level l reads x; d: this machine's last copy less the table's
vec2 unfiltered(float x, int ch, float l, float d){
  if(l <= 0.) return vec2(x, 0.);
  int i = min(int(l), 5); float f = l - float(i);
  vec4 o = LOST[7*ch], a = LOST[7*ch + i], b = LOST[7*ch + i + 1];
  float c = mix(a.x, b.x, f), g = c/((1. - f)*(1. - f)*a.y + 2.*f*(1. - f)*a.z + f*f*b.y);
  return vec2(o.w + g*(x - mix(a.w, b.w, f) - d*l/7.), max(o.y - g*c, 0.)); }
float normShare(float z){ z = clamp(z, -8., 8.); return 1./(1. + exp(-(1.5976*z + .07056*z*z*z))); }      // the normal share under z, in closed form: WRITTEN ANEW FROM A PUBLISHED IDEA, a logistic of a cubic in z (named at the head, with its source as far as the crew holds it); its two numbers are what the form gives when fitted anew for the least greatest error (normshare/fit.txt); within 0.00015 of the true share at every z
// the share of a pixel that is pitted: the hard cut where nothing is lost; whole or none within a thousandth
float pitShare(float pit, float T, vec2 ms){ if(ms.y <= 0.) return pit < T ? 1. : 0.; float c = normShare((T - ms.x)/sqrt(ms.y)); return c < .001 ? 0. : (c > .999 ? 1. : c); }
// the ember's law (the core's and the heart's)
vec3 emberGlow(vec4 n1, vec4 n2, float strength, float age){
  float e = clamp(.08 + .62*n1.r + .5*n2.g - .28, 0., 1.), pulse = .86 + .14*sin(uClock*3.14159 + n1.b*12.);
  return fireRamp(e*pulse)*(strength*smoothstep(-1., 7., age)*(.45 + .55*uEmber)) + vec3(.012, .009, .007); }
// is the core (k = CORE) or the heart (k = HEART) there at the turn u and the height y, and its two lookups (at their own levels)
bool emberAt(float u, float y, vec2 gx, vec2 gy, vec4 k, float top, out vec4 n1, out vec4 n2){
  float eat = k.w*uFire.w*smoothstep(.2, .7, textureLod(uNoise, vec2(u*4. + k.z, .63), noiseLod(gx, gy, vec2(4., 0.))).r) + .3*uFire.w;
  n1 = textureLod(uNoise, vec2(u*4. + k.z + uClock*.005, y*.09 - uClock*.01), noiseLod(gx, gy, vec2(4., .09)));
  n2 = textureLod(uNoise, vec2(u*11. + k.z, y*.31 + uClock*.02), noiseLod(gx, gy, vec2(11., .31)));
  return y <= min(TOP - eat, top); }
// the core's pitted share, from its two lookups q1, q2 at the levels l1, l2
float corePit(vec4 q1, vec4 q2, float l1, float l2, float T, vec3 d){
  vec2 a = unfiltered(q2.r, 0, l2, d.r), b = unfiltered(q1.b, 2, l1, d.b);
  return pitShare(q2.r*.6 + q1.b*.4, T, vec2(.6*a.x + .4*b.x, .36*a.y + .16*b.y)); }`,Vn=`
uniform vec3 uPale, uDark, uGap, uChar; uniform vec4 uStack;      // the islet's top, the straight part's top, a course's height, a pallet's length
varying vec3 vP, vN, vL; varying vec2 vUv; varying float vWl;
${Ce}
${ee}
#include <fog_pars_fragment>
float h11(float p){ p = fract(p*.1031); p *= p + 33.33; p *= p + p; return fract(p); }
float h21(vec2 p){ vec3 p3 = fract(vec3(p.xyx)*.1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y)*p3.z); }
${vs}
// the rim's glow among what is not pitted: the soft step of the unfiltered noise, eased as the cut is (the step it was where nothing is lost)
float pitRim(float pit, float T, vec2 ms, float c){
  if(ms.y <= 0.) return 1. - smoothstep(T, T + .05, pit);
  float e = 5.*ms.y/(sqrt(.000625 + 5.*ms.y) + .025), sa = smoothstep(T - e, T + .05 + e, ms.x), sb = normShare((ms.x - T - .025)/sqrt(ms.y + .000125));
  return clamp(1. - mix(sa, sb, ms.y/(ms.y + .000125))/max(1. - c, .001), 0., 1.); }
// what stands straight inward of a place of the shell (the same turn, the same height): the core by its own law, and through the core's
// pits, by their share, the heart; a = 0 where neither is known to stand there (over their eaten tops)
vec4 throughPit(float u, float y, vec2 gx, vec2 gy, vec3 d){
  float age = ageAt(y); vec4 n1, n2, m1, m2;
  if(emberAt(u, y, gx, gy, CORE, CORE_TOP, n1, n2)){
    float pitT = CORE.x*smoothstep(6., 28., age), cc = corePit(n1, n2, noiseLod(gx, gy, vec2(4., .09)), noiseLod(gx, gy, vec2(11., .31)), pitT, d);
    vec3 c = emberGlow(n1, n2, CORE.y, age);
    if(cc <= 0.) return vec4(c, 1.);
    if(emberAt(u, y, gx, gy, HEART, HEART_TOP, m1, m2)) return vec4(mix(c, emberGlow(m1, m2, HEART.y, age), cc), 1.);
    return (cc >= 1. || n2.r*.6 + n1.b*.4 < pitT) ? vec4(0.) : vec4(c, 1.);
  }
  if(emberAt(u, y, gx, gy, HEART, HEART_TOP, m1, m2)) return vec4(emberGlow(m1, m2, HEART.y, age), 1.);
  return vec4(0.); }
void main(){
  vec3 N = normalize(vN); float inner = gl_FrontFacing ? 0. : 1.; if(inner > .5) N = -N;
  float y = vL.y, wall = step(abs(vWl), .5);
  // this course's age, its front ragged by a broad fixed noise
  vec4 nA = texture2D(uNoise, vec2(vUv.x*3., y*.045)), nB = texture2D(uNoise, vec2(vUv.x*9. + .37, y*.19 + .11));
  float age = ageAt(y) + (nA.r - .5)*3.*uFire.z;
  float cy = (y - uStack.x)/uStack.z, fw = fwidth(cy);                       // (the courses' measure across pixels, taken before any discard)
  float R = length(vL.xz); vec2 tang = vec2(-vL.z, vL.x)/max(R, 1e-3); float fwx = (abs(dot(dFdx(vL.xz), tang)) + abs(dot(dFdy(vL.xz), tang)))/uStack.w;      // a pixel's footprint along the course, in pallets (by the face's own place: no seam; before any discard)
  vec2 gx = dFdx(vec2(vUv.x, y)), gy = dFdy(vec2(vUv.x, y));      // the slopes of (the turn, the height) across a pixel: the footprints of the pits' lookups (taken before any discard)
  // the top eaten ragged within its upper 5 m (some teeth keep the height); the flat top is dropped in one frame once the eaten share of the top passes 0.004 (1.62 s after the eating begins)
  float eat = 5.*uFire.w*smoothstep(.34, .72, texture2D(uNoise, vec2(vUv.x*5., .11)).g);
  if((wall > .5 && y > TOP - eat) || (wall < .5 && uFire.w > .004)) discard;
  // pits eaten through the char (the core behind fills them). Where a pixel's footprint is under a texel of both lookups the cut is the
  // hard cut it was. Beyond, on the outside's faces, the cover is the share of the unfiltered noise under the threshold (GLSL_PITS):
  // whole, the fragment is dropped; in part, the wall is mixed (after the fog) toward what stands straight inward of it (throughPit)
  float pit = nB.g*.65 + nA.b*.35, pitT = .4*smoothstep(4., 26., age), cover = 0., rim = 0.; vec3 behind = vec3(0.);
  if(wall > .5 && age > 4.){
    cover = pit < pitT ? 1. : 0.; rim = 1. - smoothstep(pitT, pitT + .05, pit);      // (the inside's faces keep the plain cut and rim)
    if(inner < .5){
      float lA = noiseLod(gx, gy, vec2(3., .045)), lB = noiseLod(gx, gy, vec2(9., .19));
      float qA = textureLod(uNoise, vec2(vUv.x*3., y*.045), lA).b, qB = textureLod(uNoise, vec2(vUv.x*9. + .37, y*.19 + .11), lB).g;
      vec3 lastOff = textureLod(uNoise, vec2(.5), 7.).rgb - LAST;      // this machine's last copy less the table's
      vec2 rawA = unfiltered(qA, 2, lA, lastOff.b), rawB = unfiltered(qB, 1, lB, lastOff.g), ms = vec2(.65*rawB.x + .35*rawA.x, .4225*rawB.y + .1225*rawA.y);
      pit = qB*.65 + qA*.35; float soft = pitShare(pit, pitT, ms); vec4 thru = vec4(0., 0., 0., 1.);
      if(soft > 0. && soft < 1.) thru = throughPit(vUv.x, y, gx, gy, lastOff);
      if(thru.a > .5){ cover = soft; behind = thru.rgb; rim = pitRim(pit, pitT, ms, soft); }
      else { cover = pit < pitT ? 1. : 0.; rim = 1. - smoothstep(pitT, pitT + .05, pit); }      // (nothing known stands behind: the plain cut)
    }
    if(cover >= 1.) discard;
  }
  // the courses
  float row = floor(cy), fy = fract(cy);
  float ux = vUv.x*6.2832*R/uStack.w + h11(row)*7.3, colm = floor(ux), fx = fract(ux);
  float fine = (1. - smoothstep(.3, .7, fw))*(1. - smoothstep(.15, .35, fwx));      // (rule I6) 1 where a pixel's footprint is 0.3 of a course or less in height, 0 from 0.7 of a course up; along the course 1 where it is 0.15 of a pallet or less, 0 from 0.35 up
  float eY = min(fw, .5)*.5, eX = min(fwx, .2)*.5;                          // the edges of openings and joints eased over the pixel's footprint: no hard step, no moire
  // a pallet's side: openings between the boards and the blocks; a joint between pallets
  float open = smoothstep(.17 - eY, .17 + eY, fy)*(1. - smoothstep(.83 - eY, .83 + eY, fy))*(smoothstep(.1 - eX, .1 + eX, fx)*(1. - smoothstep(.45 - eX, .45 + eX, fx)) + smoothstep(.55 - eX, .55 + eX, fx)*(1. - smoothstep(.9 - eX, .9 + eX, fx)));
  float joint = (1. - smoothstep(.012 - eX, .012 + eX, fx)) + smoothstep(.988 - eX, .988 + eX, fx);
  float tone = h21(vec2(colm, row)), band = h11(row*.37 + 5.);
  vec3 wood = mix(uDark, uPale, smoothstep(uStack.y - 6., uStack.y + 6., y));                  // the darker pallets below (facts a and f), going over to the paler above over 12 m
  wood *= .78 + .3*mix(.5, tone, fine) + .12*(band - .5)*fine;
  float gap = mix(.486, max(open, joint), fine)*wall;                      // (rule O5) their mean where they cannot be told apart (the openings' and the joints' share of the face)
  // scorched under the front, charred above it; the stack's inside is char
  float scorch = smoothstep(-3., 0., age), ch = smoothstep(0., ${M(Xt)}, age);
  wood = mix(wood, uChar, max(max(ch, .6*scorch), inner));
  vec3 col = mix(wood, uGap, gap*.85)*worldLight(vP, N);
  // fire in the openings: the burning edge, then the skeleton's ember
  float edge = smoothstep(-.4, .5, age)*(1. - smoothstep(3.5, 9., age));
  float ember = smoothstep(3., 9., age)*uEmber*(.55 + .75*nB.r);
  float flick = .8 + .2*sin(uClock*9.42478 + tone*31. + row);
  col += fireRamp(clamp(.34 + .5*edge + .34*nB.b, 0., 1.))*(edge + ember)*mix(gap, 1., inner)*flick;
  col += fireRamp(.55)*rim*smoothstep(4., 4.5, age)*wall*(.3 + .7*uEmber);     // a pit's rim (eased with the cut: pitRim)
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
  if(cover > 0.) gl_FragColor.rgb = mix(gl_FragColor.rgb, behind, cover);      // through a part-covered pit: the ember behind, which takes no fog
}`,Hn=`
uniform vec4 uCore;      // its share of pits, its strength, a shift of its noise, how far its top is eaten (m)
varying vec3 vL; varying vec2 vUv;
${ee}
${vs}
void main(){
  float y = vL.y, age = ageAt(y);
  float eat = uCore.w*uFire.w*smoothstep(.2, .7, texture2D(uNoise, vec2(vUv.x*4. + uCore.z, .63)).r) + .3*uFire.w;
  vec4 n1 = texture2D(uNoise, vec2(vUv.x*4. + uCore.z + uClock*.005, y*.09 - uClock*.01)), n2 = texture2D(uNoise, vec2(vUv.x*11. + uCore.z, y*.31 + uClock*.02));
  vec2 gx = dFdx(vec2(vUv.x, y)), gy = dFdy(vec2(vUv.x, y));      // (the pits' lookups' footprints; taken before any discard)
  if(y > TOP - eat) discard;
  vec3 c = emberGlow(n1, n2, uCore.y, age);
  // the core's pits (the heart has none): the hard cut it was where a pixel's footprint is under a texel of both lookups, and on the inside's
  // faces; beyond, on the outside's, the share of the unfiltered noise under the threshold (GLSL_PITS): whole, dropped; in part, mixed toward the heart behind
  if(uCore.x > 0.){
    float pitT = uCore.x*smoothstep(6., 28., age), cover = n2.r*.6 + n1.b*.4 < pitT ? 1. : 0.;
    if(gl_FrontFacing){
      float l1 = noiseLod(gx, gy, vec2(4., .09)), l2 = noiseLod(gx, gy, vec2(11., .31));
      vec4 q1 = textureLod(uNoise, vec2(vUv.x*4. + uCore.z + uClock*.005, y*.09 - uClock*.01), l1), q2 = textureLod(uNoise, vec2(vUv.x*11. + uCore.z, y*.31 + uClock*.02), l2), m1, m2;
      float soft = corePit(q1, q2, l1, l2, pitT, textureLod(uNoise, vec2(.5), 7.).rgb - LAST);
      if(soft <= 0. || soft >= 1.) cover = soft;
      else if(emberAt(vUv.x, y, gx, gy, HEART, HEART_TOP, m1, m2)){ cover = 0.; c = mix(c, emberGlow(m1, m2, HEART.y, age), soft); }
      else cover = q2.r*.6 + q1.b*.4 < pitT ? 1. : 0.;      // (no heart known behind: the plain cut)
    }
    if(cover > .5) discard;
  }
  gl_FragColor = vec4(c, 1.);
}`;function jn(a,s){const i=[];for(let t=N;t<K-1e-6;t+=.5)i.push([J(t),t]);i.push([Me,K]);const c=yo(is(i,J),96,!0),o=t=>({value:new g.Color(t)}),h=new g.ShaderMaterial({uniforms:{...Ie(),...a,...s,uPale:o("#c9a66a"),uDark:o("#8a6a3c"),uGap:o("#2a2016"),uChar:o("#14100d"),uStack:{value:new g.Vector4(N,N+le,Ze,xo)}},vertexShader:ls,fragmentShader:Vn,fog:!0,side:g.DoubleSide}),r=new g.Mesh(c,h);r.name="stack",r.frustumCulled=!1;const m=(t,n,u,w,v)=>{const A=[];for(let k=N;k<u-1e-6;k+=n)A.push([J(k)*t,k]);return A.push([J(u)*t,u]),yo(is(A,k=>J(k)*t),w,!1,v)},x=(t,n,u,w)=>new g.ShaderMaterial({uniforms:{...s,uCore:{value:new g.Vector4(t,n,u,w)}},vertexShader:ls,fragmentShader:Hn,side:g.DoubleSide}),p=new g.Mesh(m(.9,.5,us,64),x(...cs));p.name="core",p.frustumCulled=!1;const f=new g.Mesh(m(.62,1,fs,48,.9/.62),x(...hs));f.name="heart",f.frustumCulled=!1;const d=new g.Mesh(Tt([[0,0],[.3,0],[.34,.45],[.3,.9],[0,.9]],14),wo(a,"#3a2c20"));d.position.set(.4,K,-.3),d.name="barrel";const l=new g.Group;l.name="stack-group",l.add(r,p,f,d);const e=t=>(t.geometry.index?t.geometry.index.count:t.geometry.attributes.position.count)/3;return{object:l,mesh:r,core:p,heart:f,barrel:d,material:h,materials:[h,p.material,f.material,d.material],triangles:e(r)+e(p)+e(f)+e(d)}}function Je(a,s,i,c,o,h=1){const r=new g.PlaneGeometry(1,1,1,h),m=new g.InstancedBufferGeometry;m.index=r.index,m.setAttribute("position",r.attributes.position),m.setAttribute("uv",r.attributes.uv);for(const p in i)m.setAttribute(p,new g.InstancedBufferAttribute(i[p],4));m.instanceCount=s;const x=new g.Mesh(m,c);return x.name=a,x.frustumCulled=!1,x.renderOrder=o,x}const ds=.9,Kn=.33,Yn=.35,Xn=.18,Qn=.25,bo=[1.2,2.4],Zn=[[.00189,.00754,.0197,.03612,.0427,.04472,.04494],[.00544,.01747,.03502,.04364,.04783,.04969,.04991]],Ao=[2.5,9,.4],ms=(a,s)=>{const i=Zn[a].map((c,o,h)=>G(s*(c-(o?h[o-1]:0))));return`vec4(${i.slice(0,4).join(", ")}), vec3(${i.slice(4).join(", ")})`},Jn=.9,Ge=[1/48,1.2],er=`
uniform vec4 uShell;      // how far the shell stands off the first shell's face (m), its cover's share, its climb's share, a phase of its own
varying vec2 vUv, vDeep; varying float vY, vFres;      // vDeep: the sheet's radius here (m); the cosine between the stack's axis and the ray to the eye
${ee}
${ye}
void main(){
  vUv = uv; vY = position.y;
  vec3 rad = normalize(vec3(position.x, 0., position.z));
  float n = texture2D(uNoise, vec2(uv.x*3. + uShell.w, position.y*.05 - uClock*.11)).r;
  vec3 e3, a3, n3; float ld; vec3 P = fallPlace(position + rad*(uShell.x + (n - .5)*1.3), e3, a3, n3, ld), radW = fallTurn(rad, e3, a3, n3);
  P.xz += uWind.xy*(max(dot(radW.xz, uWind.xy), 0.)*1.1);                 // in the lee it streams off the face
  vec4 wp = modelMatrix*vec4(P, 1.);
  // the sheet's own normal, from its two slopes (round the stack and up it: the bulge's noise read one step of the mesh to either side, and the stack's taper), each carried as fallPlace
  // carries it (turned, crushed, drawn in) and as the lee's streaming shears it: signed, and under 0 where the sheet is turned from the eye
  vec2 nq = vec2(uv.x*3. + uShell.w, position.y*.05 - uClock*.11), du = vec2(${G(3*Ge[0])}, 0.), dv = vec2(0., ${G(.05*Ge[1])});
  float R = length(position.xz) + uShell.x + (n - .5)*1.3;                // the sheet's radius here (m)
  float ra = (texture2D(uNoise, nq + du).r - texture2D(uNoise, nq - du).r)*${G(1.3/(2*Ge[0]*Q))};      // metres of radius a radian round
  float ry = (texture2D(uNoise, nq + dv).r - texture2D(uNoise, nq - dv).r)*${G(1.3/(2*Ge[1]))} + (stackR(position.y + ${M(Ge[1])}) - stackR(position.y - ${M(Ge[1])}))*${G(1/(2*Ge[1]))};      // and a metre up
  vec4 q = uPiece[int(clamp(floor((position.y - FOOT)/${G(j)}), 0., ${Y-1}.))]; vec3 eS = e3*mix(1., ${M(ut)}, ld), aS = a3*q.w, nS = n3*mix(1., ${M(Pe)}, ld), tang = vec3(-rad.z, 0., rad.x);
  vec3 sa = fallTurn(rad*ra + tang*R, eS, aS, nS), sy = fallTurn(vec3(rad.x*ry, 1., rad.z*ry), eS, aS, nS);
  sa.xz += uWind.xy*(step(0., dot(radW.xz, uWind.xy))*dot(fallTurn(tang, e3, a3, n3).xz, uWind.xy)*1.1);
  mat3 mm = mat3(modelMatrix); vec3 toEye = normalize(cameraPosition - wp.xyz);
  vFres = dot(normalize(cross(mm*sy, mm*sa)), toEye);
  vDeep = vec2(R, dot(normalize(mm*a3), toEye));
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,tr=`
uniform vec4 uShell, uTile, uFall;      // uTile: the two noises' turns round the stack (whole numbers: no seam) and their tiles up it (1/m)
varying vec2 vUv, vDeep; varying float vY, vFres; const float DEEP = ${M(Jn)};      // DEEP: metres of flame under a sheet
${ee}
// which of the texture's copies a lookup at q is read from (0: its 128 texels a side; 7: its one), by the lookup's slope across neighbouring pixels, as the texture's own filter chooses it
float copyOf(vec2 q){ vec2 dx = dFdx(q), dy = dFdy(q); return clamp(7. + .5*log2(max(max(dot(dx, dx), dot(dy, dy)), 1e-12)), 0., 7.); }
// the variance a noise has lost at copy l: seven steps, straight from one whole copy to the next
float lostAt(float l, vec4 lo, vec3 hi){ return dot(clamp(l - vec4(0., 1., 2., 3.), 0., 1.), lo) + dot(clamp(l - vec3(4., 5., 6.), 0., 1.), hi); }
void main(){
  float age = ageAt(vY), on = smoothstep(-.3, 1.2, age);
  float front = 1. - smoothstep(3., 9., age);
  vec2 big = texture2D(uNoise, vec2(vUv.x + uShell.w, vY*.01 - uClock*.02)).ra - .5, push = big*${M(2*Yn)};      // the slow great noise
  vec2 c1 = vec2(vUv.x*uTile.x, vY*uTile.y - uClock*.35*uShell.z) + push; float n1 = texture2D(uNoise, c1).g;
  vec2 c2 = vec2(vUv.x*uTile.z + n1*.2, vY*uTile.w - uClock*.6*uShell.z) + push.yx; float n2 = texture2D(uNoise, c2).b;
  float lost = lostAt(copyOf(c1), ${ms(0,.36)}) + lostAt(copyOf(c2), ${ms(1,.16)});      // the variance the heat f has lost under this pixel (its noises' shares .6 and .4, squared)
  float f = n1*.6 + n2*.4, dens = (mix(.34, .72, front) + big.x*${M(2*Xn)})*uShell.y;
  float sl = vY - FOOT, jn = abs(sl - clamp(floor(sl/${G(j)} + .5), 1., ${Y-1}.)*${G(j)});      // metres along the stack to the nearest joint
  float cut = mix(1., smoothstep(${M(bo[0])}, ${M(bo[1])}, jn), smoothstep(uFall.z, uFall.z + .4, uT));
  float h1 = sqrt(.0256 + ${M(Ao[0])}*lost), h2 = sqrt(.0256 + ${M(Ao[1])}*lost), mid = 1.06 - dens;      // the cut's middle and its two half widths (.16, as it was, where nothing is lost)
  float a = mix(smoothstep(mid - h1, mid + h1, f), smoothstep(mid - h2, mid + h2, f), ${M(Ao[2])})*on*cut;
  // x: how much of its shell's depth the ray crosses, as a share of the crossing square on. The body: the near half of a round shell DEEP under its sheet, its density (R*R - r*r)^2 (r: metres
  // from the axis; R: the sheet's radius): nothing at the sheet, densest at the inner face. s1: the ray's run from the sheet to its nearest point to the axis; L: the part of that run in the shell.
  // Where there is flame its opacity is 1 - .1^x (.9 square on, as it was); the cover a stays a share of the pixel, so the mean the cut keeps is kept under this too
  float ce = sqrt(max(1. - vDeep.y*vDeep.y, 1e-4)), s1 = vDeep.x*clamp(vFres/ce, 0., 1.), b2 = s1*s1, d2 = DEEP*(2.*vDeep.x - DEEP), L = min(b2, d2)/max(s1 + sqrt(max(b2 - d2, 0.)), 1e-6);
  float x = L*L*L*(b2*${G(4/3)} - s1*L + L*L*.2)/(DEEP*DEEP*DEEP*(vDeep.x*vDeep.x*${G(4/3)} - vDeep.x*DEEP + DEEP*DEEP*.2)*ce);
  a *= (1. - pow(.1, x))/.9;      // (no discard: where the cover is nothing the covering blend leaves the pixel as it was, and no depth is written)
  gl_FragColor = vec4(fireRamp(clamp(f*1.35 - .3 + .3*front + big.y*${M(2*Qn)}, 0., 1.)), a*.9);
}`,or=`
attribute vec4 aA, aB; uniform vec4 uCrown, uShow;      // the crown flame's foot (x, z), its radius' and its width's share of the full; (uShow.w: how near the whole pillar is to burning)
varying vec2 vUv; varying vec4 vS;
${ee}
${ye}
void main(){
  vUv = uv;
  float crown = step(aA.y, -.5), depth = max(aA.y, 0.), y0 = TOP - depth, age = uT - passAt(depth);
  float on = mix(smoothstep(0., 1.5, age), 1., crown), front = (1. - smoothstep(4., 9., age))*(1. - crown);
  float pulse = .8 + .2*sin(6.2832*(uClock*aB.w + aB.x));
  float h = mix(aA.w*mix(1., 2.3, front)*(1. + ${M(xa)}*uShow.w), aA.w*uFire.y, crown)*on*pulse, w = mix(aA.z*mix(.8, 1.35, front), aA.z*uCrown.w, crown)*on;
  float rf = stackR(y0) + .25 + .6*aB.z, rc = ${M(Me*.8)}*sqrt(aB.z)*uCrown.z;
  vec3 anchor = mix(vec3(cos(aA.x)*rf, y0, sin(aA.x)*rf), vec3(uCrown.x + cos(aA.x)*rc, TOP - .4, uCrown.y + sin(aA.x)*rc), crown);
  { float ldA = uPiece[int(clamp(floor((anchor.y - FOOT)/${G(j)}), 0., ${Y-1}.))].z; anchor.xz -= FALLD*(2.*ldA*max(dot(anchor.xz, FALLD), 0.)); }      // once its length has landed a tongue stands on the lying body's upper side, never under it
  vec3 e3, a3, n3; float ld; vec3 was = lengthPlace(anchor, uT - ${M(ga)}); anchor = fallPlace(anchor, e3, a3, n3, ld); h *= mix(1., ${M(ya)}, ld) + ${M(Aa)}*ld*(1. - ld); w *= mix(1., ${M(ba)}, ld);
  h *= mix(1., .25 + .75*smoothstep(0., 9., depth), ld);      // on a landed length the fire dies away over the stack's last 9 m; the crown's clump stands a quarter as tall
  h *= mix(1., ${M(Zt[0])} + ${M(Zt[1])}*texture2D(uNoise, vec2(depth*${G(1/22)}, uClock*.03)).r, ld*(1. - crown));      // (rule I7: once landed its height goes by the world's noise along the fallen line and slowly by the clock, 18 whole turns in the wrap: a ragged fire, not a hedge)
       // it rides its length; it flares as its length lands (1.70 at the middle of the landing), then stands RAFT_TALL as tall and RAFT_WIDE as wide (the raft's flames close to a wall)
  vec4 wa = modelMatrix*vec4(anchor, 1.);
  vec3 toCam = cameraPosition - wa.xyz, right = normalize(vec3(toCam.z, 0., -toCam.x) + vec3(1e-5, 0., 0.));
  vec3 P = wa.xyz + right*(position.x*w) + vec3(0., uv.y*h, 0.);
  P.xz += uWind.xy*(uWind.z*.5*uv.y*uv.y*h);                             // it leans before the wind as it rises
  vec3 back = mat3(modelMatrix)*(was - anchor); P += back*(min(1., h/max(length(back), 1e-4))*uv.y*uv.y);      // it streams: its tip is drawn back to where its anchor stood TONGUE_BACK ago, never by more than its own height
  vS = vec4(aB.x, aB.y, .2*front + .12*crown, on*mix(.72, 1., max(front, crown)));
  gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.);
}`,ar=`
varying vec2 vUv; varying vec4 vS;
${ee}
void main(){
  float x = vUv.x*2. - 1., y = vUv.y;
  float kx = (.1 + .1*fract(vS.x*17.3))*(fract(vS.x*7.7) < .5 ? -1. : 1.), ky = .25 + .25*fract(vS.x*29.1), k2 = 1.2 + .8*fract(vS.x*13.7);      // each tongue reads the fire's noise at a scale and a handedness of its own (by its own number, not by the eye)
  vec2 q = vec2(x*kx + vS.x*3.7, y*ky - uClock*vS.y + vS.x*7.);
  float n1 = texture2D(uNoise, q).g, n2 = texture2D(uNoise, vec2(x*kx*k2 + vS.x*12.7 + .5, y*ky*k2 - uClock*(2.*vS.y + .3) + vS.x*14.)).b;
  float d = abs(x + (n1 - .5)*1.6*y)/max(smoothstep(0., .14, y)*pow(max(1. - y, 0.), .8)*(.65 + .7*n2), .02);
  float a = (1. - smoothstep(.35, 1., d))*(1. - smoothstep(.6, 1., y + (n2 - .5)*.5));
  a *= smoothstep(.34, .7, n1*.6 + n2*.6 + .25*(1. - y) - .1)*vS.w; if(a < .004) discard;
  gl_FragColor = vec4(fireRamp(clamp(.18 + .75*(1. - d)*(1. - .8*y) + (n2 - .5)*.35 + vS.z, 0., 1.)), a);
}`,sr=`
attribute vec4 aS, aD; uniform vec4 uSmoke;      // the column's share (0: the thread), its foot's height, the last light on its head
varying vec2 vUv; varying vec3 vR, vU, vF; varying vec4 vI; varying float vLit;
${ee}
${ye}
void main(){
  float s = fract(aS.x + uClock*aS.y), h = ${M(Jt)}*pow(s, 1.8), k = uSmoke.x, f = aD.w;
  float born = uT - s/aS.y, wreck = step(uFall.y, born), tw = smoothstep(uFall.x, uFall.x + ${M(to)}, born); h += ${M(ao)}*min(s/aS.y, 5.)*max(wreck, tw);      // (its birth: T less its own age by the wrapped clock; tw: how far it is a puff of the fall)
  float yFoot = mix(uSmoke.y, max(${M(La)}, min(TOP, uFire.x + 3.)), f), off = f > 0. ? .8*stackR(yFoot) : 0.;
  float W0 = mix(2. + 6.*clamp(h/80., 0., 1.), mix(14. - 6.*f, 40., clamp(h/150., 0., 1.)), k), Wt = mix(${M(je[0])}, ${M(je[1])}, clamp(h/40., 0., 1.)), W = mix(W0, Wt, max(wreck, tw));
  // born before the release: on the column where it stands; born during the fall: from its foot's own length as that length then was (one law)
  vec3 c = lengthPlace(vec3(0., yFoot, 0.), born) + vec3(0., h, 0.); c.xz += uWind.xy*(off*(1. - tw) + uWind.z*h*h/(h + 50.)) + vec2(cos(aS.z), sin(aS.z))*(aD.x*mix(.15*W0 + .6*off, .3*Wt, tw));
  // born after the strike: from the fallen line (a place along it of its own), climbing and leaning as before
  if (wreck > .5) { c = lengthPlace(vec3(0., FOOT + STACK_L*(.06 + .88*fract(aD.z*7.31)), 0.), uFall.y + 1.) + vec3(0., 1.5 + h, 0.); c.xz += uWind.xy*(uWind.z*h*h/(h + 50.)) + vec2(cos(aS.z), sin(aS.z))*(aD.x*.3*W); }
  float gap = smoothstep(0., ${M(oo)}, abs(born - uFall.y));      // (a puff's place steps as its birth second passes the strike, and is not seen to: a puff born within SMOKE_GAP of the strike is faded, to nothing for one born at the strike itself)
  vLit = mix(1., mix(1., .2, smoothstep(uFall.x, uFall.y, uT)), 1. - tw);      // the fire's light on a puff of the standing column goes down with the stack
  float rot = 6.2832*(aD.z*3.7 + aD.y*uClock/${M(oe)}), cr = cos(rot), sr = sin(rot);
  vec3 R = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), Up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vR = R*cr + Up*sr; vU = Up*cr - R*sr; vF = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  vec3 P = c + (vR*position.x + vU*position.y)*(W*aS.w*1.5);      // (the puff's soft edge lies inside its sheet: the sheet is drawn half as wide again)
  vUv = uv; vI = vec4(h, gap*mix(mix(1., ${M(za)}, smoothstep(uFall.x, uFall.y, uT)), ${M(Ca)}, max(wreck, tw))*mix(.13, .85, k)*smoothstep(0., .1, s)*(1. - smoothstep(.72, 1., s))*mix(1., k, step(.001, f)), aD.z, k);
  gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.);
}`,nr=`
uniform vec3 uThread, uColumn, uGlowCol; uniform vec4 uSmoke;
varying vec2 vUv; varying vec3 vR, vU, vF; varying vec4 vI; varying float vLit;
${Ce}
${ee}
void main(){
  vec2 p = vUv*2. - 1.; float r = length(p);
  vec4 n = texture2D(uNoise, vUv*.55 + vec2(vI.z*5.3, vI.z*9.1)), n2 = texture2D(uNoise, vUv*1.3 + vec2(vI.z*3.1 + uClock*.02, vI.z*7.7 - uClock*.02));      // (the second noise drifts by the wrapped clock: 12 whole turns in the wrap)
  float a = exp(-7.8*r*r/(.7 + .6*n.r))*(1. - smoothstep(.6, .95, r))*smoothstep(.1, .55, n2.g + .45*(1. - r))*vI.y; if(a < .003) discard;      // (rule F5) its cover falls from its middle with no flat top (the radius taken against the puff's own edge), eaten by the second noise: smoke, not a disc
  vec3 N = normalize((vR*(p.x + n.b - .5) + vU*(p.y + n.a - .5))*.5 + vF*sqrt(max(.44 - r*r, .1)));      // (rule F5) a soft lump, not a ball: a flatter normal, pushed about by the puff's own noise
  float sun = .5 + .5*dot(N, uSunDir); sun *= sun;                                                        // half wrapped: the light goes smoothly from its sunward to its far side, no limb
  vec3 l = mix(uGndCol, uSkyCol, .5 + .5*N.y) + uSunCol*(.6*sun) + uGlowCol*(.3*uSmoke.z*sun*sun);      // the sky, the sun, the last light on its sunward side
  l += uFireCol*(1.8*vLit*mix(.4, 1., vI.w)*exp(-vI.x/15.)*(.6 - .4*N.y));                       // the fire under it: orange in its first 15 m
  vec3 c = mix(uThread, uColumn, vI.w)*(.6 + .8*n.g)*l;
  gl_FragColor = vec4(c, a);
}`,ko=[1.8,1.5],rr=`
attribute vec4 aA, aB; uniform vec4 uShow; uniform vec3 uSpark[3];      // the share of the sparks shown; their colours young, grown, old
varying vec2 vUv; varying vec4 vC;
${ee}
${ye}
void main(){
  float s = fract(aB.x + uClock*aB.y), tau = s/aB.y, born = uT - tau;      // (its birth: T less its own age by the wrapped clock)
  float yb = mix(uFire.x, TOP + .7*uFire.y, pow(aA.y, .7)), Rb = mix(stackR(min(yb, TOP)) + .3 + .9*aA.z, ${M(Me*.85)}*aA.z, smoothstep(TOP - 1., TOP + 3., yb));
  float rise = aB.z*tau*(1. - .02*tau), sw = .4 + .06*rise;
  vec3 c = vec3(cos(aA.x)*Rb, yb, sin(aA.x)*Rb);
  c = lengthPlace(c, born);                              // born during the fall: on its own length as that length then was; after it: on the fallen line (before the release: where it stands)
  c.y += rise;
  c.xz += uWind.xy*(uWind.z*rise) + vec2(sin(tau*1.3 + aB.w*40.), cos(tau*1.1 + aB.w*23.))*sw;
  float size = (.07 + .09*fract(aB.w*7.3))*(1. - .5*s)*mix(1., ${M(yn)}, smoothstep(uFall.x, uFall.x + 1., born)), sz = max(size, length(cameraPosition - c)*.0011), dim = (size/sz)*(size/sz);      // (one born from the release on is drawn larger, smoothly over a second of birth: the trail)
  vec3 R = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), Up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 col = mix(mix(uSpark[0], uSpark[1], smoothstep(0., .45, s)), uSpark[2], smoothstep(.45, 1., s));
  float thr = uShow.x*mix(1., ${M(eo)}, smoothstep(uFall.y, uFall.y + 1., born)), show = (1. - smoothstep(thr - .05, thr, aA.w))*(1. - smoothstep(.3, .5, s)*smoothstep(uFall.y, uFall.y + 1., born))*smoothstep(0., .6, c.y)*smoothstep(0., .04, s)*(1. - smoothstep(.7, 1., s))*(.7 + .3*sin(tau*9. + aB.w*50.));
  vUv = uv; vC = vec4(col*(${M(ko[0])}*(1. - .6*s)), show*dim);
  gl_Position = projectionMatrix*viewMatrix*vec4(c + (R*position.x + Up*position.y)*sz, 1.);
}`,Mo=`
varying vec2 vUv; varying vec4 vC;
void main(){ float a = (1. - smoothstep(.2, 1., length(vUv*2. - 1.)))*vC.a; gl_FragColor = vec4(vC.rgb, a); }`,ir=`
attribute vec4 aA, aB; uniform vec4 uShow;      // the share of the cascade shown, and the depth under the top down to which courses shed
varying vec2 vUv; varying vec4 vC;
${ee}
float hash(vec2 p){ vec4 t = texture2D(uNoise, (floor(p) + .5)/128.); return fract(t.a*17. + t.r*29. + t.g*7.); }      // (the world's own noise at a texel's middle: the same on every machine; no sine of a great number)
void main(){
  float cyc = (uT - aA.z)/aA.y, k = floor(cyc), tau = (cyc - k)*aA.y;
  float y0 = TOP - hash(vec2(aB.x*127., k))*uShow.z, ang = aA.x + k*2.399 + hash(vec2(aB.x*127., k + 64.));
  vec3 rad = vec3(cos(ang), 0., sin(ang));
  vec3 c = rad*(stackR(y0) + .3 + aA.w*tau) + vec3(0., y0 - ${M(vt/2)}*tau*tau, 0.), vel = rad*aA.w + vec3(0., -${M(vt)}*tau, 0.);
  vec4 wc = modelMatrix*vec4(c, 1.); vec3 wv = normalize(mat3(modelMatrix)*vel);
  vec3 side = cross(wv, cameraPosition - wc.xyz); side /= max(length(side), 1e-4);
  float wd = max(aB.y, length(cameraPosition - wc.xyz)*.0011), dim = aB.y/wd;
  vec3 P = wc.xyz + side*(position.x*wd) + wv*(position.y*(.3 + .05*length(vel)));
  float show = smoothstep(aB.w, aB.w + .03, uShow.y)*step(0., cyc)*smoothstep(.25, 1.2, c.y)*smoothstep(0., .15, tau);      // (eased in by its rank and over its first 0.15 s, eased out between 1.2 and 0.25 m over the sea)
  vUv = uv; vC = vec4(fireRamp(.85 - .35*tau/aA.y)*.9, show*dim);
  gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.);
}`,So=[.35,.4],lr=`
attribute vec4 aFly, aFly2;      // its release (T), its outward speed, its flight's seconds, its spin; (1 lies on the rock, 0 sinks), its spin's axis, the age at which it is burnt away
varying vec3 vP, vN; varying vec4 vS; varying float vW;
${ee}
${ye}
#include <fog_pars_vertex>
vec3 turn(vec3 v, vec3 ax, float th){ float c = cos(th), s = sin(th); return v*c + cross(ax, v)*s + ax*(dot(ax, v)*(1. - c)); }
void main(){
  vec3 anchor = instanceMatrix[3].xyz; mat3 im = mat3(instanceMatrix);
  float age = uT - passAt(TOP - anchor.y), since = uT - aFly.x, tau = clamp(since, 0., aFly.z), rest = step(aFly.z, since);
  vec3 ax = vec3(cos(aFly2.y), 0., sin(aFly2.y)), p = turn(im*position, ax, aFly.w*tau), n = turn(im*normal, ax, aFly.w*tau);
  vec3 c = anchor + normalize(vec3(anchor.x, 0., anchor.z) + 1e-5)*(aFly.y*tau) - vec3(0., ${M(vt/2)}*tau*tau, 0.);
  float sc = (1. - (1. - aFly2.x)*rest*smoothstep(0., 1.5, since - aFly.z))*(1. - smoothstep(aFly2.z, aFly2.z + 2.5, age));
  // one that is not (yet) shed rides its length through the fall
  vec3 e3, a3, n3; float ld, ride = 1. - step(0., since); vec3 fp = fallPlace(anchor, e3, a3, n3, ld);
  vec4 wp = modelMatrix*vec4(mix(c + p*sc, fp + fallTurn(p*sc, e3, a3, n3), ride), 1.); vP = wp.xyz; vN = normalize(mat3(modelMatrix)*mix(n, fallTurn(n, e3, a3, n3), ride));
  vS = vec4(age, smoothstep(0., .2, since)*(1. - smoothstep(aFly.z - .2, aFly.z, since)), fract(anchor.x*7.31 + anchor.y*3.17 + anchor.z*5.9), 1. - .65*rest*smoothstep(0., 12., since - aFly.z));
  vW = smoothstep(${M(N+le-6)}, ${M(N+le+6)}, anchor.y);
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ps=`
uniform vec3 uPale, uDark, uChar;
varying vec3 vP, vN; varying vec4 vS; varying float vW;
${Ce}
${ee}
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN);
  vec3 wood = mix(uDark, uPale, vW)*(.8 + .35*vS.z);
  vec3 col = mix(wood, uChar, max(smoothstep(0., ${M(Xt)}, vS.x), .6*smoothstep(-3., 0., vS.x)))*worldLight(vP, N);
  float n = texture2D(uNoise, vP.xy*.6 + vP.zx*.45 + vS.z*3.).r;
  col += fireRamp(clamp(.12 + .42*n + .12*vS.y, 0., 1.))*(smoothstep(.5, 4., vS.x)*vS.w*smoothstep(.4, .75, n)*(.2 + .45*uEmber + .5*vS.y));
  col += fireRamp(.3 + .25*n)*(smoothstep(.5, 4., vS.x)*vS.w*(${M(So[0])} + ${M(So[1])}*uEmber));      // (rule I3: its whole face an ember's dull red to orange: none stands flat black before the flames)
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,cr=`
attribute vec4 aA, aO, aV; uniform vec3 uSpark[3];      // (its event's second, its life, its size, a number of its own); its place on the standing stack (w: 0 at the break, 1 at a landing); its speed
varying vec2 vUv; varying vec4 vC;
${ee}
${ye}
void main(){
  float age = uT - aA.x, s = age/aA.y;
  vec3 c = lengthPlace(aO.xyz, mix(aA.x, uFall.y + 1., aO.w)) + aV.xyz*age - vec3(0., ${M(so/2)}*age*age, 0.); c.xz += uWind.xy*(${M(Ct)}*age);
  float size = aA.z*(1. - .5*s), sz = max(size, length(cameraPosition - c)*.0018), dim = (size/sz)*(size/sz);      // an ember: no smaller than 0.0018 of its distance from the lens (1.6 pixels of a picture 1,080 lines high)
  vec3 R = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), Up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vec3 col = mix(mix(uSpark[0], uSpark[1], smoothstep(0., .25, s)), uSpark[2], smoothstep(.45, 1., s));
  float show = step(0., age)*step(s, 1.)*smoothstep(0., .4, c.y)*smoothstep(0., .03, s)*(1. - smoothstep(.6, 1., s))*(.7 + .3*sin(age*11. + aA.w*50.));
  vUv = uv; vC = vec4(col*(${M(ko[1])}*(1. - .6*s)), show*dim);
  gl_Position = projectionMatrix*viewMatrix*vec4(c + (R*position.x + Up*position.y)*sz, 1.);
}`,hr=`
attribute vec4 aA, aB;      // (its beginning's second, its place along the stack, 0 the eruption, 1 the hiss or 2 spray, a number of its own); (the eruption's height, the hiss's rate or the spray's speed upward; its phase or the spray's speed outward; its side; its width's share or the spray's width)
varying vec2 vUv; varying vec3 vR, vU, vF; varying vec4 vI;
${ee}
${ye}
void main(){
  float since = uT - aA.x, spray = step(1.5, aA.z), hiss = step(.5, aA.z)*(1. - spray), s = fract(aB.y + uClock*aB.x*hiss), tau = mix(since, s/max(aB.x, 1e-4), hiss);
  float te = max(since, 0.), h = mix(aB.x*(1. - exp(-te/.9)) + 1.5*te, 8.*(1. - exp(-tau/1.6)), hiss), W = mix(mix(3., 9.5*aB.w, 1. - exp(-te/1.5)), mix(2., 5., s)*aB.w, hiss);
  float al = mix(smoothstep(0., .3, since)*(1. - smoothstep(3.5, 6., since))*.5, smoothstep(0., 1., since)*mix(1., .5, smoothstep(0., 8., since))*smoothstep(0., .12, s)*(1. - smoothstep(.5, 1., s))*.35, hiss)*step(0., since);
  // spray: up at its own speed and back at SPRAY_G, outward on its side, ending where it meets the sea again
  h = mix(h, aB.x*te - ${M(pt/2)}*te*te, spray); W = mix(W, aB.w, spray); al = mix(al, .5*smoothstep(0., .1, since)*(1. - smoothstep(.75, 1., te*${M(pt/2)}/aB.x))*step(0., since), spray);
  vec3 c = lengthPlace(vec3(0., FOOT + aA.y, 0.), uFall.y + 1.);
  c.xz += vec2(-FALLD.y, FALLD.x)*(aB.z*(1.1*stackR(FOOT + aA.y) + .25*h*(1. - spray)) + spray*sign(aB.z)*aB.y*te) + FALLD*((aA.w - .5)*.5*h*(1. - spray)) + uWind.xy*(${M(io)}*tau*(1. - spray)); c.y = max(c.y, 0.) + .5 + h;      // (the plume widens as it climbs)
  float rot = 6.2832*(aA.w*3.7 + (aA.w - .5)*.1*tau), cr = cos(rot), sr = sin(rot);
  vec3 R = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), Up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  vR = R*cr + Up*sr; vU = Up*cr - R*sr; vF = vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]);
  vUv = uv; vI = vec4(h, al, aA.w, spray);
  gl_Position = projectionMatrix*viewMatrix*vec4(c + (vR*position.x + vU*position.y)*(W*1.5), 1.);      // (the puff's soft edge lies inside its sheet, as the smoke's)
}`,ur=`
uniform vec3 uSteam;
varying vec2 vUv; varying vec3 vR, vU, vF; varying vec4 vI;
${Ce}
${ee}
void main(){
  vec2 p = vUv*2. - 1.; float r = length(p);
  vec4 n = texture2D(uNoise, vUv*.5 + vec2(vI.z*5.3, vI.z*9.1)), n2 = texture2D(uNoise, vUv*1.2 + vec2(vI.z*3.1 + uClock*.02, vI.z*7.7 - uClock*.02));      // (the second noise drifts by the wrapped clock: 12 whole turns in the wrap)
  float a = (1. - smoothstep(.05 + .3*n.r, .62, r))*smoothstep(.1, .55, n2.g + .45*(1. - r))*vI.y; if(a < .003) discard;      // a soft edge, eaten by the second noise
  vec3 N = normalize((vR*p.x + vU*p.y)*.5 + vF*sqrt(max(.44 - r*r, .02)));      // shaded nearly flat: steam, not a heap of balls
  vec3 l = mix(uGndCol, uSkyCol, .5 + .5*N.y)*2.2 + uSunCol*(.6*max(dot(N, uSunDir), 0.));
  l = mix(l, vec3(dot(l, vec3(.3, .5, .2))), .4);                         // drawn 0.4 of the way toward its own grey: white steam, less of the sky's violet
  l += uFireCol*(1.6*exp(-vI.x/9.)*(.6 - .4*N.y));                        // the fire under it: orange over its first 9 m
  gl_FragColor = vec4(uSteam*(.75 + .5*n.g)*l*(1. + .5*vI.w), a);            // (spray: half as bright again)
}`,fr=`
attribute vec4 aW, aW2;      // (where along the stack it comes from, its event's second, its flight's seconds, its arc's height); (its spin, the ember it keeps, its tone, its bob's phase or -1 on the rock)
varying vec3 vP, vN; varying vec4 vS; varying float vW;
${ee}
${ye}
#include <fog_pars_vertex>
vec3 turn(vec3 v, vec3 ax, float th){ float c = cos(th), s = sin(th); return v*c + cross(ax, v)*s + ax*(dot(ax, v)*(1. - c)); }
void main(){
  vec3 rest = instanceMatrix[3].xyz; mat3 im = mat3(instanceMatrix);
  float since = uT - aW.y, tau = clamp(since/aW.z, 0., 1.), flying = smoothstep(0., .2, since)*(1. - smoothstep(aW.z - .2, aW.z, since));      // (rule O2: its brighter ember in flight comes and goes over 0.2 s)
  float sr = sign(dot(rest.xz, vec2(-FALLD.y, FALLD.x)))*.9*stackR(FOOT + aW.x), q = mix(tau, tau*tau, step(aW.w, 0.));      // (from its length's side; one that leaves in the air (arc under 0) goes slowly at first)
  vec3 e3, a3, n3; float ld; vec3 from = fallPlace(vec3(-FALLD.y*sr, FOOT + aW.x, FALLD.x*sr), e3, a3, n3, ld);
  vec3 c = mix(from, rest, q) + vec3(0., max(aW.w, 0.)*4.*tau*(1. - tau) + smoothstep(0., 1., since - aW.z)*step(0., aW2.w)*.05*sin(6.2832*(uClock*${M(300/oe)} + aW2.w)), 0.);
  vec3 ax = normalize(vec3(cos(aW2.z*40.), .3, sin(aW2.z*40.))); float th = aW2.x*(1. - tau)*aW.z;
  vec3 p = turn(im*position, ax, th), n = turn(im*normal, ax, th);
  vec4 wp = modelMatrix*vec4(c + p*smoothstep(0., .3, since), 1.); vP = wp.xyz; vN = normalize(mat3(modelMatrix)*n);      // (it grows out of its length over 0.3 s: no step)
  vS = vec4(40., flying, aW2.z, mix(1., aW2.y, smoothstep(0., 5., since - aW.z))); vW = .5;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ws=.1,Lo=32,et=45,gs=8,vr=`
uniform vec3 uFireA, uFireB;
varying vec3 vQ; varying float vY;
void main(){
  vec3 ab = uFireB - uFireA; float len = max(length(ab), 1e-3); vec3 ax = ab/len;
  vec3 side = cross(ax, cameraPosition - .5*(uFireA + uFireB)); side /= max(length(side), 1e-4);
  float al = mix(-${M(et)}, len + ${M(et)}, uv.y), ac = (uv.x*2. - 1.)*${M(et)};
  vQ = vec3(ac, al, len); vec3 P = uFireA + ax*al + side*ac; vY = P.y;
  gl_Position = projectionMatrix*viewMatrix*vec4(P, 1.);
}`,dr=`
uniform vec3 uFireCol;
varying vec3 vQ; varying float vY;
void main(){
  float along = vQ.y - clamp(vQ.y, 0., vQ.z), d2 = vQ.x*vQ.x + along*along;
  float g = exp(-2.5*d2/${M(Lo*Lo)})*(1. - smoothstep(${M(.7*et)}, ${M(et)}, sqrt(d2)));
  gl_FragColor = vec4(uFireCol*(${M(ws)}*g*smoothstep(0., ${M(gs)}, vY)), 1.);
}`,mr=a=>{const s=Math.sin(a*7.9153+4.1)*31873.917;return s-Math.floor(s)};function pr(a,s,i){const c=new g.Group;c.name="fire-on-the-stack";const o=new g.Group;o.name="fire-in-the-air";const h={},r=[],m=n=>{const u=new g.ShaderMaterial(n);return r.push(u),u},x=n=>({value:new g.Color(n)}),p={transparent:!0,depthWrite:!1},f={transparent:!0,depthWrite:!1,blending:g.AdditiveBlending};{const n=[];for(let w=N+.3;w<K-.3;w+=1.2)n.push([J(w)+.9,w]);n.push([Me+.9,K]);const u=yo(n,48,!1);h.flames=0;for(const[w,v,A]of[["sleeve",[0,1,1,0],[6,.09,14,.21]],["sleeve-outer",[ds,Kn,1.5,.37],[4,.06,9,.14]]]){const k=new g.Mesh(u,m({uniforms:{...s,uShell:{value:new g.Vector4(...v)},uTile:{value:new g.Vector4(...A)}},vertexShader:er,fragmentShader:tr,...p}));k.name=w,k.frustumCulled=!1,k.renderOrder=4,c.add(k),h.flames+=u.index.count/3}}c.add(Je("tongues",$e,{aA:i.flames.A,aB:i.flames.B},m({uniforms:{...s},vertexShader:or,fragmentShader:ar,side:g.DoubleSide,...p}),5,6)),h.flames+=$e*12,o.add(Je("smoke",Oe,{aS:i.smoke.S,aD:i.smoke.D},m({uniforms:{...a,...s,uThread:x("#b4aea6"),uColumn:x("#4a423c")},vertexShader:sr,fragmentShader:nr,side:g.DoubleSide,...p}),3)),h.smoke=Oe*2,o.add(Je("sparks",De,{aA:i.sparks.A,aB:i.sparks.B},m({uniforms:{...s,uSpark:{value:[new g.Color("#ff8f30"),new g.Color("#ff7a1e"),new g.Color("#a3200a")]}},vertexShader:rr,fragmentShader:Mo,side:g.DoubleSide,...f}),6)),h.sparks=De*2,c.add(Je("cascade",Ne,{aA:i.cascade.A,aB:i.cascade.B},m({uniforms:{...s},vertexShader:ir,fragmentShader:Mo,side:g.DoubleSide,...f}),6)),h.cascade=Ne*2;const d=m({uniforms:{...Ie(),...a,...s,uPale:x("#c9a66a"),uDark:x("#8a6a3c"),uChar:x("#14100d")},vertexShader:lr,fragmentShader:ps,fog:!0}),l=(n,u,w,v)=>{const A=new g.BoxGeometry(xo,Ze,.8),k=new g.InstancedMesh(A,d,u),L=new Float32Array(u*4),S=new Float32Array(u*4);k.name=n;for(let y=0;y<u;y++){qe.set(1,1,1);const F=w(y,Ue);k.setMatrixAt(y,No.compose(Ue,Wo.setFromAxisAngle(Os,F),qe)),v(y,L,S)}return A.setAttribute("aFly",new g.InstancedBufferAttribute(L,4)),A.setAttribute("aFly2",new g.InstancedBufferAttribute(S,4)),k.instanceMatrix.needsUpdate=!0,k.frustumCulled=!1,c.add(k),h.pallets=(h.pallets||0)+u*12,k},e=i.st("pallets-proud");l("pallets-proud",900,(n,u)=>{const w=N+.3+(H-.6)*e(),v=e()*Q,A=J(w)+.1+.25*e();return u.set(Math.sin(v)*A,w,-Math.cos(v)*A),-v+(e()-.5)*.5},(n,u,w)=>{u.set([1e4,0,0,0],n*4),w.set([1,0,10+24*mr(n),0],n*4)});const t=i.shed;l("pallets-shed",t.length,(n,u)=>{const w=t[n];return u.set(Math.sin(w.bear*_)*w.R0,w.y0,-Math.cos(w.bear*_)*w.R0),-w.bear*_+(w.turn-Math.PI)*.08},(n,u,w)=>{const v=t[n];u.set([v.release,v.out,v.flight,v.spin],n*4),w.set([v.rest,v.axis,1e4,0],n*4)}),o.add(Je("burst",We,{aA:i.burst.A,aO:i.burst.O,aV:i.burst.V},m({uniforms:{...s,uSpark:{value:[new g.Color("#ff8f30"),new g.Color("#ff7a1e"),new g.Color("#a3200a")]}},vertexShader:cr,fragmentShader:Mo,side:g.DoubleSide,...f}),6)),h.burst=We*2,o.add(Je("steam",Ke,{aA:i.steam.A,aB:i.steam.B},m({uniforms:{...a,...s,uSteam:x("#eef0f4")},vertexShader:hr,fragmentShader:ur,side:g.DoubleSide,...p}),3)),h.steam=Ke*2;{const n=i.wreck,u=n.length,w=new g.BoxGeometry(xo,Ze,.8),v=new Float32Array(u*4),A=new Float32Array(u*4),k=new g.Euler,L=new g.InstancedMesh(w,m({uniforms:{...Ie(),...a,...s,uPale:x("#c9a66a"),uDark:x("#8a6a3c"),uChar:x("#14100d")},vertexShader:fr,fragmentShader:ps,fog:!0}),u);L.name="pallets-wreck";for(let S=0;S<u;S++){const y=n[S];qe.set(1,1,1),Ue.set(y.x,y.y,y.z),L.setMatrixAt(S,No.compose(Ue,Wo.setFromEuler(k.set(y.tilt,y.turn,y.tilt*.6)),qe)),v.set([y.sl,y.event,y.flight,y.arc],S*4),A.set([y.spin,y.keep,y.tone,y.afloat?y.phase:-1],S*4)}w.setAttribute("aW",new g.InstancedBufferAttribute(v,4)),w.setAttribute("aW2",new g.InstancedBufferAttribute(A,4)),L.instanceMatrix.needsUpdate=!0,L.frustumCulled=!1,o.add(L),h.pallets+=u*12}{const n=new g.Mesh(new g.PlaneGeometry(1,1),m({uniforms:{uFireA:a.uFireA,uFireB:a.uFireB,uFireCol:a.uFireCol},vertexShader:vr,fragmentShader:dr,side:g.DoubleSide,...f}));n.name="glow",n.frustumCulled=!1,n.renderOrder=7,o.add(n),h.glow=2}return{stackBound:c,free:o,rows:h,materials:r}}const Co=78,zo=252,wr=`
attribute vec3 aInfo; varying vec3 vP, vInfo;
void main(){ vInfo = aInfo; vec4 wp = modelMatrix*vec4(position, 1.); vP = wp.xyz; gl_Position = projectionMatrix*viewMatrix*wp; }`,gr=`
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uHazeCol, uGlowCol, uSunTrue, uRock; uniform vec2 uGlow;
varying vec3 vP, vInfo;
void main(){
  vec3 N = cross(dFdx(vP), dFdy(vP)); N /= max(length(N), 1e-12); if(N.y < 0.) N = -N;
  float snow = smoothstep(.56, .7, vInfo.y + .16*(vInfo.z - .5))*smoothstep(.45, .8, vInfo.x)*smoothstep(.35, .6, N.y);
  vec3 c = mix(uRock*(.8 + .4*vInfo.z), vec3(.8, .84, .9), snow)*(mix(uGndCol, uSkyCol, .5 + .5*N.y) + uSunCol*max(dot(N, uSunDir), 0.));
  vec3 d = normalize(vec3(vP.x - cameraPosition.x, 0., vP.z - cameraPosition.z));
  float side = .5 + .5*dot(d, normalize(vec3(uSunTrue.x, 0., uSunTrue.z)));
  vec3 haze = mix(uHazeCol, uGlowCol, clamp(pow(max(side, 0.), uGlow.y)*uGlow.x, 0., 1.));
  float hz = mix(.5, .88, vInfo.x); hz = mix(hz, 1., .55*(1. - smoothstep(0., .45, vInfo.y)));
  gl_FragColor = vec4(mix(c, haze, hz), 1.);
}`;function xr(a,s){const i=a.makeNoise(a.hashSeed("pallet-tower-midsummer:ranges")),c=4,o=280,h=[0,.24,.5,.78,1],r=h.length,m=(o+1)*r,x=new Float32Array(c*m*3),p=new Float32Array(c*m*3),f=[];for(let t=0;t<c;t++){const n=t/(c-1),u=O(1750,3350,n),w=O(110,340,n),v=17.3*t+4,A=1.1+.5*t,k=w*1.5;for(let L=0;L<=o;L++){const S=O(Co,zo,L/o),y=S*_,F=Math.sin(y),b=-Math.cos(y),z=T(Co,Co+14,S)*(1-T(zo-14,zo,S)),C=1-Math.abs(i.fbm2(F*A*1.7+v,b*A*1.7+v,4,2.1,.55)),E=i.n2(F*A*9+v,b*A*9-v)+.45*i.n2(F*A*23-v,b*A*23+v),D=T(-.75,.25,i.fbm2(F*.9+v,b*.9-v,2)+.15),B=w*Z(((.22+.78*Math.pow(C,1.6))*(.3+.7*D)+.07*E)*z,0,1.2);for(let $=0;$<r;$++){const q=t*m+L*r+$,P=h[$],U=i.n2(F*41-$*5.3,b*41+v+$),W=u-k*(1-P)+($===r-1?0:k*.12*U),V=$===0?-6:B*(P+($<r-1?.08*U:0))-6*(1-z);x[q*3]=F*W,x[q*3+1]=V,x[q*3+2]=b*W,p[q*3]=n,p[q*3+1]=V/w,p[q*3+2]=.5+.5*i.n2(F*31+v+$*2.2,b*31+$*1.3)}}for(let L=0;L<o;L++)for(let S=0;S<r-1;S++){const y=t*m+L*r+S,F=y+r,b=y+1,z=F+1;L+S&1?f.push(y,F,z,y,z,b):f.push(y,F,b,F,z,b)}}const d=new g.BufferGeometry;d.setAttribute("position",new g.BufferAttribute(x,3)),d.setAttribute("aInfo",new g.BufferAttribute(p,3)),d.setIndex(f);const l=new g.ShaderMaterial({uniforms:{...s,uRock:{value:new g.Color("#4b5560")}},vertexShader:wr,fragmentShader:gr,side:g.DoubleSide}),e=new g.Mesh(d,l);return e.name="ranges",e.frustumCulled=!1,{object:e,material:l,triangles:f.length/3}}const Fo=5,gt=7,Ro=13.6,Eo=.03,Pt=.012,xs=a=>{const s=/#define NW (\d+)/.exec(a.material.vertexShader||"");return[a.uniforms.uWA.value.length,s?+s[1]:8]},xt=2,ze=262,yr=236,tt=6,_o=8,Be=312,ot=[80,285];function br(a,s,i,c,o={}){const[h,r,m,x]=a,p=Math.sin(m*_),f=Math.cos(m*_);let d=0,l=0,e=0;if(x>0)for(let y=0;y<_o;y++){const F=i[y],b=c[y],z=b.w*b.w/(b.w*b.w+x*x),C=F.z*(F.x*h+F.y*r)-F.w*s+b.z;d+=b.x*Math.sin(C)*z;const E=b.x*F.z*Math.cos(C)*z;l+=F.x*E,e+=F.y*E}let t=-l*xt,n=1,u=-e*xt;const w=Math.hypot(t,n,u);t/=w,n/=w,u/=w;const v=p*t-f*u;let A=p-t*v,k=-n*v,L=-f-u*v;const S=Math.hypot(A,k,L);return A/=S,k/=S,L/=S,o.org=[h,d,r],o.up=[t,n,u],o.fw=[A,k,L],o.ax=[k*u-L*n,L*t-A*u,A*n-k*t],o.at=(y,F,b,z=[0,0,0])=>{for(let C=0;C<3;C++)z[C]=o.org[C]+o.ax[C]*y+o.up[C]*F+o.fw[C]*b;return z},o}const Ar=(()=>{const a=(Be-ze)/2,s=(ot[1]-ot[0])*_,i=ze*s,c=Math.PI*a,o=Be*s;return{r:a,rm:(Be+ze)/2,l1:i,l2:c,l3:o,total:i+2*c+o,s0:ze*(ot[1]-yr)*_}})();function ys(a,s=[0,0,0,tt]){const i=Ar,c=ot[0]*_,o=ot[1]*_;let h=(i.s0+i.total*(a/oe))%i.total,r,m,x,p;if(h<i.l1){const f=o-h/ze;r=ze*Math.sin(f),m=-ze*Math.cos(f),x=-Math.cos(f),p=-Math.sin(f)}else if((h-=i.l1)<i.l2){const f=h/i.r,d=Math.sin(c),l=Math.cos(c),e=Math.sin(f),t=Math.cos(f);r=i.rm*d+i.r*(-d*t-l*e),m=-i.rm*l+i.r*(l*t-d*e),x=d*e-l*t,p=-l*e-d*t}else if((h-=i.l2)<i.l3){const f=c+h/Be;r=Be*Math.sin(f),m=-Be*Math.cos(f),x=Math.cos(f),p=Math.sin(f)}else{const f=(h-i.l3)/i.r,d=Math.sin(o),l=Math.cos(o),e=Math.sin(f),t=Math.cos(f);r=i.rm*d+i.r*(d*t+l*e),m=-i.rm*l+i.r*(-l*t+d*e),x=-d*e+l*t,p=l*e+d*t}return s[0]=r,s[1]=m,s[2]=Math.atan2(x,-p)/_,s[3]=tt,s}const kr=a=>`
uniform vec4 uWA[${a}], uWB[${a}], uUnderWay; uniform float uTime;
void boatFrame(inout vec4 boat, out vec3 org, out vec3 ax, out vec3 up, out vec3 fw){
  if (boat.w < 0.) boat = uUnderWay;
  float sh = sin(boat.z), ch = cos(boat.z), heave = 0.; vec2 g = vec2(0.);
  if (boat.w > 0.) for (int i = 0; i < ${_o}; i++) { vec4 a = uWA[i], b = uWB[i]; float w = b.w*b.w/(b.w*b.w + boat.w*boat.w), th = a.z*dot(a.xy, boat.xy) - a.w*uTime + b.z;
    heave += b.x*sin(th)*w; g += a.xy*(b.x*a.z*cos(th)*w); }
  up = normalize(vec3(-g.x*${M(xt)}, 1., -g.y*${M(xt)}));
  vec3 f0 = vec3(sh, 0., -ch); fw = normalize(f0 - up*dot(f0, up)); ax = cross(fw, up);
  org = vec3(boat.x, heave, boat.y);
}`,To=a=>a.kind==="ship"?1.5:a.kind==="open"||a.kind==="under-way"?.35:.3+.07*a.len,bs={motor:[-.44,-.05,.3],rescue:[-.44,-.05,.3],sail:[-.44,-.13,.22],open:[-.3,.25,.2],"under-way":[-.3,.25,.2],ship:[-.09,.26,.28]},As=-.3,ks=.45,Ms=.14,Ss=.5,Po=.6,X={hull:0,deck:1,cabin:2,window:3,metal:4,canvas:5,dark:6,wood:7};function yt(a){const s=[],i=[],c=[],o=(f,d,l=0,e=0)=>{const t=s.length/3;for(const n of f)s.push(n[0],n[1],n[2]),i.push(d,l,e);for(let n=1;n<f.length-1;n++)c.push(t,t+n,t+n+1)},h=(f,d,l,e,t)=>{const n=f.map(([u,w,v])=>[[-.5*w,v,u],[-.43*w,.12,u],[0,-.45,u],[.43*w,.12,u],[.5*w,v,u]]);for(let u=0;u<n.length-1;u++){const w=n[u],v=n[u+1];for(let y=0;y<4;y++)o([w[y],w[y+1],v[y+1],v[y]],d);const A=e(f[u][0],f[u][2]),k=e(f[u+1][0],f[u+1][2]),L=.5*f[u][1]*t,S=.5*f[u+1][1]*t;o([[-L,A,f[u][0]],[L,A,f[u][0]],[S,k,f[u+1][0]],[-S,k,f[u+1][0]]],l)}o(n[0],d)},r=(f,d,l,e,t,n,u,w,v,A=X.cabin)=>{const k=[[-l,e,f],[l,e,f],[l,e,d],[-l,e,d]],L=[[-u,w,t],[u,w,t],[u,w,n],[-u,w,n]],S=k.map((y,F)=>[O(y[0],L[F][0],v),O(e,w,v),O(y[2],L[F][2],v)]);o([k[0],k[1],S[1],S[0]],X.cabin),o([S[0],S[1],L[1],L[0]],X.cabin),o([k[2],k[3],S[3],S[2]],X.cabin),o([S[2],S[3],L[3],L[2]],X.window);for(const[y,F]of[[1,2],[3,0]])o([k[y],k[F],S[F],S[y]],X.cabin),o([S[y],S[F],L[F],L[y]],X.window);o(L,A)},m=(f,d,l,e,t,n,u,w=0,v=0)=>{const A=k=>[k&1?d:f,k&2?e:l,k&4?n:t];for(const k of[[0,1,3,2],[4,6,7,5],[0,4,5,1],[2,3,7,6],[0,2,6,4],[1,5,7,3]])o(k.map(A),u,w,v)},x=(f,d,l)=>m(-d,d,0,l,-d,d,X.metal,1,f);if(a==="motor")h([[-.5,.86,1.3],[-.2,1,1.3],[.1,.98,1.36],[.3,.78,1.46],[.44,.4,1.56],[.5,.03,1.62]],X.hull,X.deck,(f,d)=>f<.05?1:d-.04,.94),r(-.02,.3,.33,1,0,.2,.28,2.7,.52),m(-.09,.09,.5,1.5,-.56,-.5,X.dark),x(.1,.03,1);else if(a==="sail")h([[-.5,.55,1.12],[-.28,.9,1.08],[0,1,1.1],[.25,.82,1.2],[.42,.42,1.32],[.5,.03,1.4]],X.hull,X.deck,(f,d)=>d-.05,.94),r(-.12,.22,.27,1.05,-.1,.16,.22,1.55,.35),o([[-.2,1.1,-.42],[.2,1.1,-.42],[.2,1.1,-.16],[-.2,1.1,-.16]],X.dark),x(.1,.07,1),m(-.13,.13,1.25,1.55,-.3,.09,X.canvas,2,0);else if(a==="open"){h([[-.5,.8,1.5],[-.15,1,1.55],[.2,.88,1.65],[.42,.45,1.8],[.5,.04,1.9]],X.hull,X.wood,()=>.9,.8);for(const f of[-.2,.12])o([[-.42,1.3,f],[.42,1.3,f],[.4,1.3,f+.08],[-.4,1.3,f+.08]],X.wood);m(-.1,.1,.4,2.1,-.58,-.5,X.dark)}else{h([[-.5,.7,1.75],[-.3,.95,1.6],[0,1,1.55],[.25,.9,1.65],[.42,.5,1.85],[.5,.05,2]],X.hull,X.wood,()=>1,.93),r(-.32,-.14,.24,1,-.31,-.15,.21,2.2,.45,X.wood),x(.14,.16,1),x(-.12,.14,.82),m(-.2,.2,2.1,2.5,-.1,.13,X.canvas,2,0),m(-.18,.18,2.1,2.45,-.44,-.13,X.canvas,2,0),m(-.1,.1,1.3,1.5,.47,.66,X.wood,2,0);for(const[f,d]of[[.14,.62],[-.12,.5]])m(-3.2,3.2,d,d+.022,-.15,.15,X.canvas,1,f)}const p=new g.BufferGeometry;return p.setAttribute("position",new g.Float32BufferAttribute(s,3)),p.setAttribute("aPart",new g.Float32BufferAttribute(i,3)),p.setIndex(c),p}const bt=.7,Do=-3.3,Oo=35e-5,Mr=["#eceeee","#e4e6e2","#f1efe8","#1e3050","#8f2f25","#24493a","#7b5a3a"],at=[1,.62,.3],st=[1,.9,.74],Ls=[.86,.93,1];function Cs(a,s){const i=a("boats-look"),c=[];for(const o of s){const h=i(),r=To(o);c.push({deck:r,mast:o.kind==="sail"||o.kind==="ship"?o.mast:1.7*r+.5,tint:o.kind==="ship"?"#3a2a1c":o.kind==="rescue"?"#c8401f":Mr[h<.3?0:h<.58?1:h<.78?2:h<.84?3:h<.89?4:h<.94?5:6]})}return c}function zs(a,s,i,c){const o=a("lamps"),h=a("lamps-place"),r=()=>bt-(bt-Do)*o(),m=[],x=new Float32Array(s.length);for(let e=0;e<s.length;e++){const t=s[e],n=i[e],u=x[e]=r(),w=n.deck+n.mast,v=h()<.55,A=(h()-.5)*.3*t.beam;if(t.kind==="ship"){m.push([e,0,w,.14*t.len,u,.2,st],[e,0,n.deck+.82*n.mast,-.12*t.len,u,.2,st]);for(let k=0;k<5;k++)m.push([e,(k%2?1:-1)*.3*t.beam,n.deck+1.9,(-.34+.15*k)*t.len,u,.17,at]);continue}if(t.kind!=="open"&&t.kind!=="under-way"&&m.push([e,0,w,.1*t.len,u,.19,st]),t.kind==="rescue"){m.push([e,.2*t.beam,n.deck+1.2,-.3*t.len,u,.17,Ls]);continue}(v||t.kind==="under-way")&&m.push([e,A,n.deck+(t.kind==="open"||t.kind==="under-way"?.9:1.3),(t.kind==="open"||t.kind==="under-way"?.2:-.24)*t.len,u,.16,at])}const p=(e,t,n,u)=>{const w=-e.turn*_,v=Math.cos(w),A=Math.sin(w);return[e.x+v*t+A*u,e.y+n,e.z+v*u-A*t]};for(const e of c.near)if(e.tone<2){const t=p(e,0,e.wall+.4,e.d/2+.3);m.push([-1,t[0],t[1],t[2],r(),.2,at])}else{const t=r(),n=p(e,0,e.wall+.5,e.d/2+.3),u=p(e,0,e.wall+.5,-e.d/2-.3);m.push([-1,n[0],n[1],n[2],t,.3,at],[-1,u[0],u[1],u[2],t,.3,h()<.3?st:at])}const f=c.town.map(e=>Math.cos(-e.turn*_)),d=c.town.map(e=>Math.sin(-e.turn*_)),l=(e,t)=>{for(let n=0;n<c.town.length;n++){const u=c.town[n];if(u===t)continue;const w=f[n],v=d[n],A=e[0]-u.x,k=e[2]-u.z;if(Math.abs(w*A-v*k)<u.w/2+.3&&Math.abs(v*A+w*k)<u.d/2+.3&&e[1]<u.y+u.wall+.3)return!0}return!1};for(const e of c.town){const t=h(),n=r(),u=v=>-(v[0]-e.x)*e.x-(v[2]-e.z)*e.z,w=[[e.w/2+.15,0],[-e.w/2-.15,0],[0,e.d/2+.15],[0,-e.d/2-.15]].map(([v,A])=>p(e,v,e.wall*(.3+.5*t),A)).sort((v,A)=>u(A)-u(v)).find(v=>!l(v,e));if(w&&m.push([-1,w[0],w[1],w[2],n,.5,t<.75?at:st]),h()<.3){const v=r(),A=[e.x-.7*e.w-4,e.y+5,e.z+.7*e.d+4];l(A,null)||m.push([-1,A[0],A[1],A[2],v,.4,Ls])}}{const e=c.ship,t=Math.sin(e.turn*_),n=-Math.cos(e.turn*_),u=r();for(let w=0;w<2;w++)for(let v=0;v<20;v++){const A=Ye[w],k=O(A[0]+2,A[1]-2,v/19),L=A[2]+.4;m.push([-1,e.x+t*k-n*L,.5*(A[3]+A[4]),e.z+n*k+t*L,u,.5,st])}}return{list:m,boatThr:x}}const Sr=a=>`
attribute vec3 aPart; attribute vec4 aBoat, aBoat2, aTint;      // aBoat: x, z, heading, length; aBoat2: beam, deck height, mast height, its lamps' threshold
uniform vec3 uPartCol[8]; uniform float uSunHigh;
varying vec3 vP, vC; varying float vGlow;
${a}
#include <fog_pars_vertex>
void main(){
  vec4 boat = aBoat; vec3 org, ax, up, fw; boatFrame(boat, org, ax, up, fw);
  vec3 p = position, l; float D = aBoat2.y;
  if (aPart.y < .5) l = vec3(p.x*aBoat2.x, p.y*D, p.z*boat.w);
  else if (aPart.y < 1.5) {
    // a mast is drawn at its true thickness at every distance from the lens (no floor)
    l = vec3(p.x, D + p.y*aBoat2.z, aPart.z*boat.w + p.z); }
  else l = vec3(p.x, D + p.y, p.z*boat.w);
  vec3 wp = org + ax*l.x + up*l.y + fw*l.z; vP = wp;
  int id = int(aPart.x + .5); vC = id == 0 ? aTint.rgb : uPartCol[id];
  vGlow = id == 3 ? 1. - smoothstep(aBoat2.w - .5, aBoat2.w + .5, uSunHigh) : 0.;
  vec4 mvPosition = viewMatrix*vec4(wp, 1.); gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Lr=`
uniform vec3 uWindowGlow; varying vec3 vP, vC; varying float vGlow;
${Ce}
#include <fog_pars_fragment>
void main(){
  vec3 N = cross(dFdx(vP), dFdy(vP)); N /= max(length(N), 1e-12); if (dot(N, cameraPosition - vP) < 0.) N = -N;
  gl_FragColor = vec4(vC*worldLight(vP, N) + uWindowGlow*vGlow, 1.);
  #include <fog_fragment>
}`,Cr=a=>`
attribute vec4 aBoat, aFig, aLook;       // aFig: across, up, along, its turn; aLook: its height, its coat (red, green, blue)
varying vec3 vP, vC; varying float vGlow;
${a}
#include <fog_pars_vertex>
void main(){
  vec4 boat = aBoat; vec3 org, ax, up, fw; boatFrame(boat, org, ax, up, fw);
  float c = cos(aFig.w), s = sin(aFig.w); vec3 p = vec3(position.x*.24, position.y*aLook.x, position.z*.17);
  vec3 l = aFig.xyz + vec3(c*p.x + s*p.z, p.y, c*p.z - s*p.x);
  vec3 wp = org + ax*l.x + up*l.y + fw*l.z; vP = wp;
  vC = position.y > .84 ? vec3(.62, .46, .36) : position.y < .42 ? vec3(.07, .08, .1) : aLook.yzw; vGlow = 0.;
  vec4 mvPosition = viewMatrix*vec4(wp, 1.); gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,zr=60,Fr=.2,Rr=.0014,Er=a=>`
attribute vec4 aBoat, aLamp, aLamp2;     // aLamp: across, up, along, threshold; aLamp2: colour, size
uniform float uSunHigh;
varying vec2 vUv; varying vec4 vC; varying vec3 vL;      // vC: the colour, and how far the lamp is on; vL: the glow's level and the core's (the air between in both), and the glow's radius over the core's
${a}
void main(){
  vec4 boat = aBoat; vec3 org, ax, up, fw; boatFrame(boat, org, ax, up, fw);
  vec3 wp = org + ax*aLamp.x + up*aLamp.y + fw*aLamp.z;
  float on = 1. - smoothstep(aLamp.w - .5, aLamp.w + .5, uSunHigh), size = aLamp2.w, blur = distance(cameraPosition, wp)*${G(Rr)}, sz = max(size, blur), szC = max(${M(Fr)}*size, blur);      // (the glass's least disc at this distance; the glow's radius and the core's, neither drawn smaller)
  vec3 R = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), Up = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
  float haze = distance(cameraPosition, wp)*${M(Oo*1e3)}*.001, air = exp(-haze*haze); vUv = uv; vC = vec4(aLamp2.rgb*2.6, on);
  vL = vec3(air*(size/sz)*(size/sz), air*${M(zr-1)}*(size/szC)*(size/szC), sz/szC);      // (each disc dimmed by as much as its face is drawn larger than by place: its whole light kept; the core's level by place is LAMP_POWER - 1 over LAMP_CORE squared)
  gl_Position = projectionMatrix*viewMatrix*vec4(wp + (R*(uv.x - .5) + Up*(uv.y - .5))*(2.6*sz), 1.);
}`,_r=`
varying vec2 vUv; varying vec4 vC; varying vec3 vL;
void main(){ float r = length(vUv*2. - 1.), glow = 1. - smoothstep(.2, 1., r), core = 1. - smoothstep(.2, 1., r*vL.z);
  gl_FragColor = vec4(vC.rgb, vC.a*min(1., vL.x*glow + vL.y*core)); }`,Fs=.45,Rs=.2,Dt=.6,Tr=a=>`
attribute vec4 aBoat, aLamp, aLamp2;
uniform float uSunHigh;
varying vec2 vUv, vXZ, vDir; varying vec4 vC; varying float vEnd;
${a}
void main(){
  vec4 boat = aBoat; vec3 org, ax, up, fw; boatFrame(boat, org, ax, up, fw);
  vec3 wp = org + ax*aLamp.x + up*aLamp.y + fw*aLamp.z;
  float on = 1. - smoothstep(aLamp.w - .5, aLamp.w + .5, uSunHigh);
  vec2 d = cameraPosition.xz - wp.xz; float D = max(length(d), 1.); d /= D;
  float h = max(wp.y, .3), ell = D*h/(max(cameraPosition.y, 1.) + h), a0 = .62*ell, a1 = min(1.7*ell + .5, .9*D), along = mix(a0, a1, uv.y);
  float far = length(vec2(D - along, cameraPosition.y)), band = max(.2 + .8*aLamp2.w + ${M(Rs)}*h, length(vec2(D - a0, cameraPosition.y))*.0012), wide = band/${M(1-Dt)};      // (the band's half width, drawn no less than 0.0012 of the distance from the lens to its sheet's FARTHEST water, the end by the lamp: ONE width for the whole sheet, so that its light across is kept at every point of it; the sheet is wide enough to hold the band where it wavers furthest)
  vec2 xz = wp.xz + d*along + vec2(-d.y, d.x)*((uv.x - .5)*2.*wide);
  float mirror = pow(1. - min(cameraPosition.y/far, 1.), 5.);                 // water mirrors little seen from above, much at a grazing eye
  float size = aLamp2.w;
  vUv = vec2(uv.x, (along - ell)/max(.45*ell, .5)); vEnd = uv.y; vXZ = xz; vDir = d;
  float haze = distance(cameraPosition, wp)*${M(Oo*1e3)}*.001;
  vC = vec4(aLamp2.rgb*${M(Fs)}, on*(.04 + .96*mirror)*step(a0 + .5, a1)*exp(-haze*haze)*((.2 + .8*size)/band));      // (its whole light across is what its lamp gives by place, .2 + .8*size, however wide the band is drawn)
  gl_Position = projectionMatrix*viewMatrix*vec4(xz.x, .24, xz.y, 1.);
}`,Pr=.06,$o=.03,Dr=(a,s)=>`
uniform vec4 uSeaA[${a}], uSeaB[${a}]; uniform float uTime, uDetail, uClock; uniform sampler2D uNoise;
varying vec2 vUv, vXZ, vDir; varying vec4 vC; varying float vEnd;
void main(){
  float al = dot(vXZ, vDir), ac = dot(vXZ, vec2(-vDir.y, vDir.x));
  float wob = (texture2D(uNoise, vec2(al/24. - uClock*.03, ac/60. + .5)).r - .5)*${M(2*Dt)};      // (its middle wavers along its length: the world's noise, 18 whole turns in the wrap)
  float across = 1. - smoothstep(.2, 1., abs(vUv.x*2. - 1. + wob)/${M(1-Dt)}), ends = smoothstep(0., .08, vEnd)*(1. - smoothstep(.75, 1., vEnd));
  float foot = max(length(fwidth(vXZ)), 1e-3); vec2 slope = vec2(0.); float lost2 = ${M(Pt*Pt*1e4)}e-4;
  for (int i = 0; i < ${a}; i++) { vec4 wa = uSeaA[i], wb = uSeaB[i];
    float ka = wa.z*wb.x*(i < ${s} ? 1. : uDetail), f0 = smoothstep(1.2, 4., wb.w/foot);
    slope += wa.xy*(ka*f0*cos(wa.z*dot(wa.xy, vXZ) - wa.w*uTime + wb.z)); lost2 += (1. - f0*f0)*ka*ka*.25; }
  float off = dot(slope, vDir) - ${M(Pr)}*vUv.y, w2 = ${M($o*$o*1e4)}e-4 + lost2, glint = exp(-off*off/(2.*w2))*${M($o)}/sqrt(w2);
  float dash = smoothstep(.3, .7, texture2D(uNoise, vec2(al/12. - uClock*.05, ac/4. + uClock*.02)).g);
  float a = vC.a*across*ends*exp(-4.*vUv.y*vUv.y)*(.03 + glint)*(.2 + 1.3*dash);      // (no fragment is thrown away: the streak sums its light into the picture, and a fragment of no light adds none)
  gl_FragColor = vec4(vC.rgb, a);
}`,Or=`
uniform vec4 uUnderWay; varying vec2 vW;
void main(){
  float sh = sin(uUnderWay.z), ch = cos(uUnderWay.z); vW = uv;
  vec2 xz = uUnderWay.xy + vec2(ch, sh)*position.x + vec2(sh, -ch)*position.z;
  gl_Position = projectionMatrix*viewMatrix*vec4(xz.x, .2, xz.y, 1.);
}`,$r=`
uniform vec3 uSkyCol, uSunCol; varying vec2 vW;
void main(){ float a = (1. - vW.y)*(1. - vW.y)*smoothstep(0., .25, abs(vW.x - .5)*2. + .25*(1. - vW.y))*(1. - smoothstep(.7, 1., abs(vW.x - .5)*2.))*.5; if (a < .004) discard;
  gl_FragColor = vec4((uSkyCol + .5*uSunCol)*.8, a); }`,Es=["#8c2f2a","#2d4a78","#c9a23a","#3b3f45","#d8d6cf","#3f6b4a","#a85a2c","#5b3d6b","#1f2a36","#b9c4cf"];function Nr(a,s,i,c,o){const{boats:h,look:r,lamps:m,people:x}=c,p={fleet:0,people:0,lamps:0},f=new g.Group;f.name="fleet";const d=C=>new g.Color(C),l=kr(a.uniforms.uWA.value.length),e={value:new g.Vector4(0,0,0,tt)},t=[0,0,0,tt],n={uWA:a.uniforms.uWA,uWB:a.uniforms.uWB,uTime:a.uniforms.uTime,uUnderWay:e},u=[d("#ffffff"),d("#cfc8b6"),d("#e8eae8"),d("#141a20"),d("#aeb2b6"),d("#27364f"),d("#1b1b1d"),d("#8a6a44")],w={uniforms:{...Ie(),...s,...n,uPartCol:{value:u},uWindowGlow:{value:d("#ffb060").multiplyScalar(1.1)}},fragmentShader:Lr,fog:!0,side:g.DoubleSide},v=new g.ShaderMaterial({...w,vertexShader:Sr(l)}),A=new g.ShaderMaterial({...w,vertexShader:Cr(l)}),k=[v,A],L=(C,E,D,B,$,q=0)=>{const P=new g.InstancedBufferGeometry;P.index=E.index;for(const W in E.attributes)P.setAttribute(W,E.attributes[W]);for(const W in D)P.setAttribute(W,D[W]instanceof g.InstancedBufferAttribute?D[W]:new g.InstancedBufferAttribute(D[W],4));P.instanceCount=B;const U=new g.Mesh(P,$);return U.name=C,U.frustumCulled=!1,U.renderOrder=q,f.add(U),U},S=C=>C.kind==="under-way"?[0,0,0,-1]:[C.x,C.z,C.head*_,C.len],y={motor:yt("motor"),sail:yt("sail"),open:yt("open"),ship:yt("ship")},F=C=>C.kind==="rescue"?"motor":C.kind==="under-way"?"open":C.kind;for(const C in y){const E=[];if(h.forEach((P,U)=>{F(P)===C&&E.push(U)}),!E.length)continue;const D=new Float32Array(E.length*4),B=new Float32Array(E.length*4),$=new Float32Array(E.length*4),q=new g.Color;E.forEach((P,U)=>{const W=h[P],V=r[P];D.set(S(W),U*4),B.set([W.beam,V.deck,V.mast,m.boatThr[P]],U*4),q.set(V.tint),$.set([q.r,q.g,q.b,1],U*4)}),L("boats-"+C,y[C],{aBoat:D,aBoat2:B,aTint:$},E.length,v),p.fleet+=E.length*y[C].index.count/3}const b=Tt([[0,0],[.5,0],[.62,.3],[.8,.55],[1,.8],[.45,.86],[.55,.94],[0,1]],5),z=Tt([[0,0],[.6,0],[1,.8],[.5,.9],[0,1]],4);{const C=o("people-look"),E=x.length,D=new Float32Array(E*4),B=new Float32Array(E*4),$=new Float32Array(E*4),q=new g.Color;x.forEach((W,V)=>{const ne=W.boat>=0?h[W.boat]:null;q.set(Es[Math.floor(C()*Es.length)]),ne?(D.set(S(ne),V*4),B.set([W.ac,W.y,W.al,W.turn*_],V*4)):(D.set([W.x,W.z,0,0],V*4),B.set([0,W.y,0,W.turn*_],V*4)),$.set([W.sit?W.tall*.62:W.tall,q.r,q.g,q.b],V*4)});const P=Math.min(Xa,E),U=(W,V,ne)=>W.subarray(V*4,ne*4);L("figures-near",b,{aBoat:U(D,0,P),aFig:U(B,0,P),aLook:U($,0,P)},P,A),p.people+=P*b.attributes.position.count/3,L("figures-far",z,{aBoat:U(D,P,E),aFig:U(B,P,E),aLook:U($,P,E)},E-P,A),p.people+=(E-P)*z.attributes.position.count/3}{const C=m.list.length,E=new Float32Array(C*4),D=new Float32Array(C*4),B=new Float32Array(C*4);m.list.forEach(([V,ne,ve,Ae,ue,At,nt],ce)=>{V>=0?(E.set(S(h[V]),ce*4),D.set([ne,ve,Ae,ue],ce*4)):(E.set([ne,Ae,0,0],ce*4),D.set([0,ve,0,ue],ce*4)),B.set([nt[0],nt[1],nt[2],At],ce*4)});const $=new g.PlaneGeometry(1,1),q={aBoat:new g.InstancedBufferAttribute(E,4),aLamp:new g.InstancedBufferAttribute(D,4),aLamp2:new g.InstancedBufferAttribute(B,4)},P={transparent:!0,depthWrite:!1,blending:g.AdditiveBlending},U=new g.ShaderMaterial({uniforms:{...s,...n,uSeaA:{value:a.uniforms.uWA.value},uSeaB:{value:a.uniforms.uWB.value},uDetail:a.uniforms.uDetail,uNoise:i.uNoise,uClock:i.uClock},vertexShader:Tr(l),fragmentShader:Dr(...xs(a)),side:g.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,...P}),W=new g.ShaderMaterial({uniforms:{...s,...n},vertexShader:Er(l),fragmentShader:_r,...P});L("lamp-streaks",$,q,C,U,2),L("lamps",$,q,C,W,6),p.lamps=C*4,k.push(U,W)}{const C=new g.PlaneGeometry(1,1,1,6),E=C.attributes.position;for(let $=0;$<E.count;$++){const q=.5-E.getY($),P=.8+6.5*q;E.setXYZ($,E.getX($)*2*P,0,-tt/2-34*q),C.attributes.uv.setY($,q)}const D=new g.ShaderMaterial({uniforms:{...s,uUnderWay:e},vertexShader:Or,fragmentShader:$r,transparent:!0,depthWrite:!1,side:g.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),B=new g.Mesh(C,D);B.name="wake",B.frustumCulled=!1,B.renderOrder=2,f.add(B),p.fleet+=12,k.push(D)}return{object:f,rows:p,materials:k,update(C){const E=ys(C,t);e.value.set(E[0],E[1],E[2]*_,E[3])},dispose(){for(const C of k)C.dispose();for(const C in y)y[C].dispose();b.dispose(),z.dispose()}}}const _s=6,Ts=.22,Ps=1.6,Ds=.6,Wr=(a,s)=>`
${ee}
uniform vec3 uSunDir, uSunCol, uSkyCol, uGndCol, uFireCol, uFireA, uFireB;
uniform vec3 uAxisP, uAxisD, uRoadCore, uRoadEdge, uPale, uDark, uChar;
uniform vec4 uFall;        // (the release, the strike, the break)
uniform float uTouch[${Y}];        // each length's touch (the second its far rim meets the sea; the lowest length's: the islet's top): the water's second at each joint of the fallen chain, straight from the one to the next between two joints (rule O4)
uniform vec4 uWA[${a}], uWB[${a}]; uniform float uTime, uDetail;        // the kit sea's own waves, clock and detail
uniform vec4 uRoad;        // along the axis from its foot: the front, the top; the crown flame's height; the fire's strength on the water
varying vec3 vWorld; varying vec2 vXZ; varying float vH; varying vec3 vPixK;
#include <fog_pars_fragment>
void main(){
  vec3 r0 = vWorld - uAxisP;
  vec3 toCam = cameraPosition - vWorld; float dist = length(toCam); vec3 V = toCam/dist;
  float pix = max(fwidth(vPixK.x/vPixK.y)*vPixK.z, 1e-5), foot = dist*pix/max(abs(V.y), .03);       // a pixel's footprint on the water (m)
  float k2 = 1. - smoothstep(.2, 1., foot/1.2);
  vec2 n2 = texture2D(uNoise, vXZ.yx/9. - uClock*vec2(40., -20.)/600.).ba - .5;
  vec2 slope = n2*(${M(2*Eo)}*k2); float lost2 = ${M(Pt*Pt*1e4)}e-4 + ${M(.16*Eo*Eo*1e4)}e-4*(1. - k2*k2);
  for (int i = 0; i < ${a}; i++) { vec4 wa = uWA[i], wb = uWB[i];
    float ka = wa.z*wb.x*(i < ${s} ? 1. : uDetail), f0 = smoothstep(1.2, 4., wb.w/foot);
    slope += wa.xy*(ka*f0*cos(wa.z*dot(wa.xy, vXZ) - wa.w*uTime + wb.z)); lost2 += (1. - f0*f0)*ka*ka*.5; }
  float lost = sqrt(lost2);
  vec3 N = normalize(vec3(-slope.x, 1., -slope.y)), R = reflect(-V, N); R.y = max(R.y, .01); R = normalize(R);
  // where the mirrored ray passes nearest the axis: t along the ray, s along the axis from its foot, m the gap between them
  float b = dot(R, uAxisD), d = dot(R, r0), e = dot(uAxisD, r0), den = max(1. - b*b, 1e-3);
  float t = (b*e - d)/den, s = (e - b*d)/den, m = length(r0 + t*R - s*uAxisD), w = step(0., t);
  float bl = 2.*lost*t, bs = bl/max(sqrt(den), .3), rs = stackR(FOOT + clamp(s, 0., STACK_L));
  float mirror = pow(clamp(1. - dot(V, N), 0., 1.), 5.);
  // the fire: the burning length from the front to the top, and the crown flame over it
  float above = smoothstep(uRoad.y - 1., uRoad.y + 1.5, s);
  float soft = mix(1.5, ${M(_s)}, smoothstep(uFall.z, uFall.y, uT));      // (rule J3) the image's foot end comes in over 3 m of the line until the break, over twice ROAD_SOFT from the strike on
  float inFire = smoothstep(uRoad.x - soft - bs, uRoad.x + soft + bs, s)*(1. - smoothstep(uRoad.y + .45*uRoad.z - bs, uRoad.y + uRoad.z + .5 + bs, s));
  float rf = mix(rs + 1.3, 1.2 + .16*uRoad.z, above), rad = sqrt(rf*rf + bl*bl), gs = exp(-m*m/(rad*rad)), g = gs*(rf/rad);       // gs: the image's shape across, 1 on its centre line at every width; g: its amount, less as the image is wider (its sum across is kept)
  float heat = mix(.6 + .4*exp(-max(s - uRoad.x, 0.)/9.), 1., above);
  float aF = w*(.2 + .8*mirror)*g*inFire*heat*uRoad.w;
  vec3 fireC = mix(uRoadEdge, uRoadCore, smoothstep(.15, .9, gs*heat))*2.2;       // the colour goes by the shape, not by the amount: a widened image keeps its centre line's own colour (the core's at full heat), and its light of each colour, summed across, is kept
  // the stack's own image: pale where the sun finds that face, char above the front. Its sum across is kept as the lost slope (bl) widens it: the soft edge spreads about the same half-way mark (0.8 rs + 0.3) until its inner end
  // reaches the axis (bl = 0.45 rs); from there on the image is scaled ONCE, by the width it had there over the width it has ((1.6 rs + 0.6)/(1.15 rs + bl + 0.6), which is 1 at the join)
  float inStack = smoothstep(-1. - bs, .5 + bs, s)*(1. - smoothstep(uRoad.y - bs, uRoad.y + 1. + bs, s));
  float aD = w*(1. - smoothstep(max(.45*rs - bl, 0.), 1.15*rs + bl + .6, m))*inStack*mix(.12, .95, mirror)*min(1., (1.6*rs + .6)/(1.15*rs + bl + .6))*(1. - smoothstep(uFall.z, uFall.y, uT));      // weak where one looks down into the water; (rule J2) it goes with the fall, from the break to the strike: a low raft has no such image
  vec3 Nf = normalize(vec3(r0.x, 0., r0.z) + 1e-4);
  vec3 face = mix(mix(uDark*.8, uPale*.8, smoothstep(${M(le-6)}, ${M(le+6)}, s)), uChar, smoothstep(uRoad.x - 2., uRoad.x + 2., s))*(mix(uGndCol, uSkyCol, .5) + uSunCol*max(dot(Nf, uSunDir), 0.));
  float cF = .6*min(aF, 1.);
  vec3 rgb = face*aD*(1. - cF) + fireC*aF; float a = 1. - (1. - aD)*(1. - cF);
  // THE FALL'S WATER (stage D), by the distance from the fallen line and by T less the water's second there (each length's touch at its far end; between two joints straight from the one touch to the next: rule O4): a ring wave that runs
  // out at WAVE_SPEED (a pale band, widening, gone at WAVE_GONE; a second, fainter, 1.5 s behind) and churned foam beside the lengths, gone at 8 s
  vec2 w0 = vec2(${G(se[0]*Ro)}, ${G(se[1]*Ro)}), wv = vec2(${G(_e[0])}, ${G(_e[1])}) - w0;
  float wt = clamp(dot(vXZ - w0, wv)/dot(wv, wv), 0., 1.), dl = length(vXZ - w0 - wv*wt), aW = 0.;
  float xj = dot(vXZ, vec2(${G(se[0])}, ${G(se[1])}))/${M(j*Math.sin(ae))}, tw = uTouch[0];      // (xj: along the fallen line in lengths; a joint lies at each whole number)
  for (int i = 1; i < ${Y}; i++) tw += (uTouch[i] - uTouch[i - 1])*clamp(xj - float(i), 0., 1.);
  float wage = uT - tw;
  if (wage > 0. && dl < 80.) {
    float wb = wage - 1.5;
    float q1 = (dl - ${M(Fo)}*wage)/(2.5 + .5*wage), q2 = (dl - ${M(Fo)}*wb)/(2.5 + .5*max(wb, 0.));      // (squared by multiplication: never a pow of a signed value)
    aW = .35*exp(-q1*q1)*(1. - smoothstep(${M(.45*gt)}, ${M(gt)}, wage));
    if (wb > 0.) aW += .18*exp(-q2*q2)*(1. - smoothstep(${M(.45*gt)}, ${M(gt)}, wage));
    aW += .7*(1. - smoothstep(0., 3., dl - ${M(Pe)}*stackR(FOOT + wt*STACK_L)))*(1. - smoothstep(3., 8., wage))*smoothstep(-.25, .15, n2.y + .1*n2.x);
    aW = min(aW, .85)*smoothstep(0., .35, wage);      // (wave and foam come in over 0.35 s: no step at a touch)
  }
  vec3 foam = vec3(.78, .82, .86)*(mix(uGndCol, uSkyCol, .8) + uSunCol*max(uSunDir.y, 0.) + uFireCol*(.25/(1. + dl*dl/3600.)));
  rgb = rgb*(1. - aW) + foam*aW; a = 1. - (1. - a)*(1. - aW);
  // the fire's light on the sea (rule F2), under what the road and the foam already cover
  { vec3 fa = uFireB - uFireA; vec3 fv = uFireA + fa*clamp(dot(vWorld - uFireA, fa)/max(dot(fa, fa), 1e-4), 0., 1.) - vWorld; float fd2 = dot(fv, fv);
    float facet = clamp(.5 + ${M(Ps)}*dot(N.xz, fv.xz*inversesqrt(max(dot(fv.xz, fv.xz), 1e-4))), 0., 1.);
    rgb += uFireCol*((.3 + .7*max(fv.y, 0.)*inversesqrt(max(fd2, 1e-4)))/(1. + fd2/3600.)*${M(Ts)}*mix(${M(Ds)}, 1., facet)*(1. - a)); }
  if ((a < .004 && rgb.r < .004) || dot(r0.xz, r0.xz) > 250000.) discard;       // nothing to show further than 500 m from the axis (the one discard, after every slope and lookup and before the air: the air has no part in the cut; what it cuts has read the lens only through the mirror and the filters by the pixel's footprint, named at the head)
  #ifdef USE_FOG
    float clear = exp(-fogDensity*fogDensity*vFogDepth*vFogDepth); rgb *= clear; a *= clear;
  #endif
  gl_FragColor = vec4(rgb, a);
}`;function Ir(a,s,i){const c=m=>({value:new g.Color(m)}),o={...a.uniforms,...s,...i,uAxisP:{value:new g.Vector3(0,N,0)},uAxisD:{value:new g.Vector3(0,1,0)},uRoad:{value:new g.Vector4(H,H,0,1)},uTouch:{value:[1e4,1e4,1e4,1e4,1e4]},uRoadCore:c("#ffb04a"),uRoadEdge:c("#c8340c"),uPale:c("#c9a66a"),uDark:c("#8a6a3c"),uChar:c("#14100d")},h=new g.ShaderMaterial({uniforms:o,defines:{...a.material.defines},vertexShader:a.material.vertexShader,fragmentShader:Wr(...xs(a)),fog:!0,transparent:!0,depthWrite:!1,blending:g.CustomBlending,blendSrc:g.OneFactor,blendDst:g.OneMinusSrcAlphaFactor,blendSrcAlpha:g.OneFactor,blendDstAlpha:g.OneMinusSrcAlphaFactor,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),r=new g.Mesh(a.surface.geometry,h);return r.name="road-of-fire",r.frustumCulled=!1,r.renderOrder=2,a.object.add(r),{mesh:r,material:h,uniforms:o,triangles:a.surface.geometry.index.count/3,follow(){r.position.copy(a.surface.position)}}}const No=new g.Matrix4,Wo=new g.Quaternion,Ue=new g.Vector3,qe=new g.Vector3,Os=new g.Vector3(0,1,0);function Gr(a,s,i,c,o){const h=new g.InstancedMesh(s,i,c);h.name=a;for(let r=0;r<c;r++){qe.set(1,1,1),Ue.set(0,0,0);const m=o(r,Ue,qe)||0;h.setMatrixAt(r,No.compose(Ue,Wo.setFromAxisAngle(Os,m),qe))}return h.instanceMatrix.needsUpdate=!0,h.computeBoundingSphere(),{object:h,triangles:c*(s.index?s.index.count:s.attributes.position.count)/3}}const Br=a=>Math.PI-a*_;function $s(a){const s=[-.5,0,-.5,.5,0,-.5,.5,0,.5,-.5,0,.5],i=a?.6:1;s.push(-.5,i,-.5,.5,i,-.5,.5,i,.5,-.5,i,.5);const c=[0,4,5,0,5,1,1,5,6,1,6,2,2,6,7,2,7,3,3,7,4,3,4,0];return a?(s.push(0,1,-.5,0,1,.5),c.push(4,8,5,6,9,7,5,8,9,5,9,6,4,9,8,4,7,9)):c.push(4,7,6,4,6,5),go(s,c)}function Ns(a,s){const i=a.attributes.position.array,c=new Float32Array(i.length),o=new g.Color;for(let h=0;h<i.length;h+=9){o.set(s(i.subarray(h,h+9)));for(let r=0;r<9;r+=3)c[h+r]=o.r,c[h+r+1]=o.g,c[h+r+2]=o.b}return a.setAttribute("color",new g.BufferAttribute(c,3)),a}const Io=2.6,Go=1,Bo=1.2,Ws=[1.3,4],Uo=.5,Ur=.6,qr=.6,Vr=2.2,Hr=.25,jr=1.4,Ve={red:"#8c2f24",tar:"#2e2925",white:"#e4e1d8",ochre:"#c8a25e",grey:"#8d9096"},Kr=["#2f3236","#33373c","#7a3a2c"],Is=(a,s)=>{let i=Math.abs(a*.1031)%1+1.618*(Math.abs(s*.11369)%1);return i=i*(i+33.33)%1,i*(i+19.19)*7.31%1},Yr=a=>a<.45?Ve.white:a<.65?Ve.ochre:a<.83?Ve.red:Ve.grey,Xr=`
attribute vec4 aP, aS, aK, aC;           // aP: place, turn; aS: width, wall, roof, depth; aK: kind, hash, the roof's number, how far its walls go down under its foot; aC: the wall's colour
varying vec3 vP, vN, vL, vNl, vC; varying vec4 vS, vK;
#include <fog_pars_vertex>
void main(){
  float yl = position.y < .3 ? -aK.w : (position.y < .8 ? aS.y : aS.y + aS.z);        // (rule O6: the walls go down under the foot by the house's own skirt)
  vec3 l = vec3(position.x*aS.x, yl, position.z*aS.w), n = normal;
  if (abs(n.y) > .1 && abs(n.x) > .1) n = normalize(vec3(sign(n.x)*aS.z, .5*aS.x, 0.));        // a roof's slope by the house's own roof and width
  float c = cos(aP.w), s = sin(aP.w);
  vec4 wp = modelMatrix*vec4(aP.xyz + vec3(c*l.x + s*l.z, l.y, c*l.z - s*l.x), 1.);
  vL = l; vNl = n; vS = aS; vK = aK; vC = aC.rgb; vP = wp.xyz; vN = normalize(mat3(modelMatrix)*vec3(c*n.x + s*n.z, n.y, c*n.z - s*n.x));
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Qr=`
uniform vec3 uRoofs[3], uGlass, uLit, uDoor; uniform float uSunHigh;
varying vec3 vP, vN, vL, vNl, vC; varying vec4 vS, vK;
${Ce}
#include <fog_pars_fragment>
float h13(vec3 p){ p = fract(p*.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y)*p.z); }
float slit(float d, float w, float f){ return min(min(1., w/f), clamp((.5*w - abs(d))/f + .5, 0., 1.)); }      // the mean, over a footprint f wide, of a slit w wide whose middle lies d away: summed across the wall it is w whatever f
void main(){
  vec3 N = normalize(vN), col = vC; float glass = 0., lit = 0.;
  float fwX = fwidth(vL.x), fwZ = fwidth(vL.z), fwY = fwidth(vL.y);      // (every slope across pixels before any branch)
  if (vNl.y > .1) col = uRoofs[int(vK.z + .5)];
  else {
    bool gable = abs(vNl.z) > .5; float s = gable ? vL.x : vL.z, len = gable ? vS.x : vS.w, y = vL.y, fw = (gable ? fwX : fwZ) + fwY + 1e-4, fo = min(2.*fw, ${M(2*Uo)});      // fo: the footprint the mean is taken over: twice the summed slopes, never more than twice the least room a window keeps to its wall's end and to the roof's line over its outer edge (so no part of its light falls off its wall but the upper outer corner of a gable window's, at most 0.0015 m2 of 1.2: named at the head)
    if (vK.x < .5) { if (vNl.z > .5) col = mix(col, uDoor, slit(s, ${M(qr)}*vS.x, fo)*clamp((${M(Vr)} - y)/fo + .5, 0., 1.)); }
    else if (vK.x < 1.5) {
      float n = floor((len - ${M(2*Uo+Go)})/${M(Io)}) + 1., k = floor(s/${M(Io)} + .5*n), sc = (k + .5 - .5*n)*${M(Io)};
      float id = gable ? (vNl.z > 0. ? 0. : 1.) : (vNl.x > 0. ? 2. : 3.);
      float roofLine = vS.y + (gable ? vS.z*(1. - 2.*(abs(sc) + ${M(Go/2)})/vS.x) : 0.);        // the roof's line over the window's outer edge
      for (int row = 0; row < 2; row++) { float sill = row == 0 ? ${M(Ws[0])} : ${M(Ws[1])};
        if (k < 0. || k > n - .5 || sill + ${M(Bo+Uo)} > roofLine) continue;
        float w = slit(s - sc, ${M(Go)}, fo)*slit(y - sill - ${M(Bo/2)}, ${M(Bo)}, fo);
        float h = h13(vec3(k + 9.*id, float(row) + 1., vK.y*97.)), thr = ${M(bt)} - ${M(bt-Do)}*h13(vec3(float(row) + 3., k + 5.*id, vK.y*61.));
        glass += w; lit += w*step(h, ${M(Ur)})*(1. - smoothstep(thr - .5, thr + .5, uSunHigh)); }
    }
  }
  gl_FragColor = vec4(mix(col, uGlass, min(glass, 1.))*worldLight(vP, N) + uLit*min(lit, 1.), 1.);
  #include <fog_fragment>
}`;function Gs(a,s,i,c,o){const h=new g.InstancedBufferGeometry,r=c.length,m=new Float32Array(4*r),x=new Float32Array(4*r),p=new Float32Array(4*r),f=new Float32Array(4*r),d=new g.Color;h.setAttribute("position",s.attributes.position),h.setAttribute("normal",s.attributes.normal);for(let e=0;e<r;e++){const t=o(c[e]);m.set(t.place,4*e),x.set(t.size,4*e),p.set(t.kind,4*e),d.set(t.wall),f.set([d.r,d.g,d.b,1],4*e)}for(const[e,t]of[["aP",m],["aS",x],["aK",p],["aC",f]])h.setAttribute(e,new g.InstancedBufferAttribute(t,4));h.instanceCount=r;const l=new g.Mesh(h,i);return l.name=a,l.frustumCulled=!1,{object:l,geometry:h,triangles:r*s.attributes.position.count/3}}function Bs(a){const s=[],i=[],c=a.beam/2,o=a.len/2,h=Ye[0][3],r=(e,t,n)=>s.push(e,t,n)/3-1,m=(e,t,n,u)=>i.push(e,t,n,e,n,u),x=(e,t)=>[r(-.8*c,e,-o),r(-c,e,-o+15),r(-c,e,o-45),r(0,e,t),r(c,e,o-45),r(c,e,-o+15),r(.8*c,e,-o)],p=x(-1,o-10),f=x(h,o);for(let e=0;e<7;e++){const t=(e+1)%7;m(p[e],p[t],f[t],f[e])}for(let e=1;e<6;e++)i.push(f[0],f[e],f[e+1]);const d=(e,t,n,u,w)=>{const v=[r(-n,u,e),r(n,u,e),r(n,u,t),r(-n,u,t)],A=[r(-n,w,e),r(n,w,e),r(n,w,t),r(-n,w,t)];for(let k=0;k<4;k++)m(v[k],v[(k+1)%4],A[(k+1)%4],A[k]);m(A[0],A[1],A[2],A[3])};for(const e of Ye)d(e[0],e[1],e[2],e[3],e[4]);d(Xe[0],Xe[1],Xe[2],Xe[3],Xe[4]);const l=Ye[Ye.length-1][4];return Ns(go(s,i),e=>{const t=Math.max(e[1],e[4],e[7]);return t<h+.01?"#1c2740":t<l+.01?"#e8e8e4":"#22252b"})}const Zr=.62,Jr=.3,ei=.12,qo=a=>Math.floor(a.turn)%5<2,Us=a=>1+2*ei*(a.turn*7.3%1-.5),ti=[[.11,0],[.11,.22],[.7,.26],[1,.42],[.98,.6],[.8,.78],[.5,.92],[0,1]],oi=[[.1,0],[.1,.12],[1,.15],[.42,.46],[.74,.48],[.26,.74],[.46,.76],[0,1]],qs=(a,s,i)=>Ns(Tt(a,7),c=>Math.max(Math.hypot(c[0],c[2]),Math.hypot(c[3],c[5]),Math.hypot(c[6],c[8]))<.12?i:s),ai=32*_,si=24*_,Vs=18*_,ni=5*_,ri=.04,be=.3,Vo=.335;function Hs(){const a=[],s=[],i=[],c=[],o=(d,l,e,t)=>{const n=l[0]-d[0],u=l[1]-d[1],w=l[2]-d[2],v=e[0]-d[0],A=e[1]-d[1],k=e[2]-d[2];let L=u*k-w*A,S=w*v-n*k,y=n*A-u*v;const F=Math.hypot(L,S,y)||1,b=d[0]+l[0]+e[0],z=d[1]+l[1]+e[1],C=d[2]+l[2]+e[2]-.09;t?(L=0,S=1,y=0):L*b+S*z+y*C<0&&(L=-L,S=-S,y=-y);for(const E of[d,l,e])a.push(E[0],E[1],E[2]),s.push(L/F,S/F,y/F),i.push(E[3]||0,E[4]||0,E[5]||0,E[6]||0),c.push(E[7]||0)},h=[0,0,.21],r=[0,0,-.21],m=[0,.045,.03],x=[-.05,-.03,.03],p=[.05,-.03,.03];for(const d of[h,r])o(d,m,p),o(d,p,x),o(d,x,m);for(const d of[-1,1]){const l=(e,t,n,u,w)=>[0,0,e,d,t,n,u,w];o(l(.09,0,0,0,0),l(.11,be,0,0,0),l(-.05,be,0,0,0),!0),o(l(.09,0,0,0,0),l(-.05,be,0,0,0),l(-.07,0,0,0,0),!0),o(l(.11,be,0,1,.15),l(.02,be,Vo,1,1),l(-.05,be,Vo,1,1),!0),o(l(.11,be,0,1,.15),l(-.05,be,Vo,1,1),l(-.05,be,0,1,.15),!0)}const f=new g.InstancedBufferGeometry;return f.setAttribute("position",new g.Float32BufferAttribute(a,3)),f.setAttribute("normal",new g.Float32BufferAttribute(s,3)),f.setAttribute("aW",new g.Float32BufferAttribute(i,4)),f.setAttribute("aTip",new g.Float32BufferAttribute(c,1)),f}const ii=`
attribute vec4 aW, aC, aD, aE;           // aW: side, along the inner panel, along the outer, panel; aC: the circle's centre x and z, radius, height;
attribute float aTip;                    // aD: angle at clock 0, turns in the wrap (signed), bob, waves a turn; aE: beats in the wrap, phase, glide turns, phase
uniform float uClock;
varying vec3 vP, vN, vK;
#include <fog_pars_vertex>
void main(){
  float ang = aD.x + 6.2831853*fract(aD.y*uClock/${M(oe)}), ca = cos(ang), sa = sin(ang), dir = sign(aD.y);
  vec3 c = vec3(aC.x + aC.z*ca, aC.w + aD.z*sin(aD.w*ang + 6.2831853*aE.y), aC.y + aC.z*sa);
  vec3 f = dir*vec3(-sa, 0., ca), r = vec3(f.z, 0., -f.x), u = vec3(0., 1., 0.);
  float cb = ${M(Math.cos(Vs))}, sb = ${M(Math.sin(Vs))}*dir; vec3 r2 = r*cb + u*sb, u2 = u*cb - r*sb;        // banked: the wing toward the centre is the low one
  float beat = 6.2831853*fract(aE.x*uClock/${M(oe)} + aE.y), power = smoothstep(-.2, .4, sin(6.2831853*fract(aE.z*uClock/${M(oe)} + aE.w)));
  float a1 = mix(${M(ni)}, ${M(ai)}*sin(beat), power), a2 = a1 + power*${M(si)}*sin(beat - 1.5707963);
  vec3 l = position, n = normal;
  if (aW.x != 0.) { float a = aW.w > .5 ? a2 : a1; l = vec3(aW.x*(${M(ri)} + aW.y*cos(a1) + aW.z*cos(a2)), aW.y*sin(a1) + aW.z*sin(a2), position.z); n = vec3(-aW.x*sin(a), cos(a), 0.); }
  vec4 wp = modelMatrix*vec4(c + r2*l.x + u2*l.y + f*l.z, 1.); vP = wp.xyz; vN = normalize(mat3(modelMatrix)*(r2*n.x + u2*n.y + f*n.z)); vK = vec3(aTip, aW.x == 0. ? 1. : 0., n.y);
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,li=`
uniform vec3 uOver, uUnder, uTipCol;
varying vec3 vP, vN, vK;
${Ce}
#include <fog_pars_fragment>
void main(){
  vec3 N = normalize(vN); float eye = dot(N, cameraPosition - vP), over = vK.y > .5 ? step(.2, vK.z) : step(0., eye);
  if (eye < 0.) N = -N;
  gl_FragColor = vec4(mix(mix(uUnder, uOver, over), uTipCol, vK.x)*(worldLight(vP, N) + .3*uSkyCol + .15*uSunCol), 1.);        // a feather lets light through (OURS)
  #include <fog_fragment>
}`;async function ci(a,s,i,c){const o=new g.Group;o.name="shore";const h={},r=[],m=[],x=(v,A)=>(o.add(A.object),h[v]=(h[v]||0)+A.triangles,m.push(A.object.geometry),A),{houses:p,trees:f,gulls:d}=i,l=v=>({value:new g.Color(v)}),e=wo(a);e.vertexColors=!0,r.push(e);const t=[[f.filter(v=>!qo(v)),qs(oi,"#20362a","#3a2f26"),Jr,"spruces"],[f.filter(qo),qs(ti,"#44632f","#6e6253"),Zr,"leaf-trees"]];for(const[v,A,k,L]of t){if(!v.length){A.dispose();continue}const S=x("trees",Gr(L,A,e,v.length,(F,b,z)=>{const C=v[F];return b.set(C.x,C.y,C.z),z.set(C.tall*k/2,C.tall,C.tall*k/2),C.turn*_})),y=new g.Color;for(let F=0;F<v.length;F++){const b=Us(v[F]);S.object.setColorAt(F,y.setRGB(b,b,b))}S.object.instanceColor.needsUpdate=!0,await c()}const n=new g.ShaderMaterial({uniforms:{...Ie(),...a,uRoofs:{value:Kr.map(v=>new g.Color(v))},uGlass:l("#1a2230"),uLit:{value:new g.Color("#ffc673").multiplyScalar(jr)},uDoor:l("#1c1a18")},vertexShader:Xr,fragmentShader:Qr,fog:!0});r.push(n);const u=$s(!0),w=$s(!1);m.push(u,w),x("houses",Gs("houses",u,n,p.near,v=>{const A=Is(v.x,v.z),k=v.tone<2;return{place:[v.x,v.y,v.z,-v.turn*_],size:[v.w,v.wall,v.roof,v.d],kind:[k?0:1,A,k?0:A<Hr?2:1,v.sunk],wall:k?v.tone<1?Ve.red:Ve.tar:Ve.white}})),x("houses",Gs("town",w,n,p.town,v=>({place:[v.x,v.y,v.z,-v.turn*_],size:[v.w,v.wall,0,v.d],kind:[2,0,1,v.sunk],wall:Yr(v.tone)}))),await c();{const v=p.ship,A=Bs(v),k=wo(a,"#ffffff",g.DoubleSide);k.vertexColors=!0,r.push(k);const L=new g.Mesh(A,k);L.name="long-ship",L.position.set(v.x,0,v.z),L.rotation.y=Br(v.turn),x("houses",{object:L,triangles:A.attributes.position.count/3})}{const v=Hs(),A=d.length,k=new Float32Array(4*A),L=new Float32Array(4*A),S=new Float32Array(4*A);for(let b=0;b<A;b++){const z=d[b];k.set([z.cx,z.cz,z.R,z.h],4*b),L.set([z.ang0,z.turns,z.bob,z.waves],4*b),S.set([z.beats,z.phase,z.glide,z.glidePhase],4*b)}for(const[b,z]of[["aC",k],["aD",L],["aE",S]])v.setAttribute(b,new g.InstancedBufferAttribute(z,4));v.instanceCount=A;const y=new g.ShaderMaterial({uniforms:{...Ie(),...a,uClock:s.uClock,uOver:l("#a9afb8"),uUnder:l("#f1f0ec"),uTipCol:l("#1d1f24")},vertexShader:ii,fragmentShader:li,fog:!0,side:g.DoubleSide});r.push(y);const F=new g.Mesh(v,y);F.name="gulls",F.frustumCulled=!1,x("gulls",{object:F,triangles:A*v.attributes.position.count/3})}return await c(),{object:o,rows:h,materials:r,dispose(){for(const v of r)v.dispose();for(const v of m)v.dispose()}}}const Ho=2.2,jo=Math.log((1+1e4/3600)/(1+4900/3600))/Math.log(100/70),js=Math.PI*Math.pow(70,jo)/(1+4900/3600),Ko=41,Yo=[3.5,47],Xo=[1.8,5.6],Ks=Ko,Ys=4,Qo=.25,Xs=1.9;async function hi(a){const{core:s}=a,i=new g.Scene,c={rows:{}},o=R=>s.makeRng(s.hashSeed(R+":"+a.seed)),h=Bt();await a.yield();const r=Ut(h);await a.yield();const m=la(r),x=ca(m),p=fa(r,m),f=Yt(r,p),d=va(r),l=d.at(0),e=ma(r);await a.yield();const t=Ba(s);let n;{const R=Ka(o,r,t);let I;for(;!(I=R.next()).done;)await a.yield();n=I.value}await a.yield();const u=Za(o,t);await a.yield();const w=Qa(o,n,t,u);await a.yield();const v=es(o,t,u);await a.yield();const A=rs(o,r,t);await a.yield();const k=wa(o,e,m,t);await a.yield();const L=o("cloud"),S=an({preset:"goldenHour",rng:L,sunElevation:l.high,sunAzimuth:l.bearing,sunSize:Xs,stars:0,clouds:{coverage:.4+.08*L(),scale:1,stretch:.2,softness:.4,silver:1.5,seed:L()*200,wind:[.006,.002]},clouds2:{coverage:.42,opacity:.32,stretch:.55,seed:L()*200}});S.material.transparent=!0,S.materialLow&&(S.materialLow.transparent=!0),i.add(S.object),c.rows.sky=32;const y={ambientColor:l.ambientColor,groundColor:l.groundLight,horizonColor:l.horizon,lightColor:l.lightColor,lightDirection:l.lightDir,ambientIntensity:l.ambient,lightIntensity:l.light,flash:0},F=sn(y,{follow:!0});i.add(F.object);const b=new g.PointLight("#ff7a2c",0,0,jo);b.position.set(0,K-4,0),i.add(b),i.fog=new g.FogExp2(0,Oo),await a.yield();const z=[-300,-360,300,200],C=await Nt.oceanDepthAsync({depthAt:(R,I)=>-t.height(R,I),depthRect:z,depthRes:256},a.yield);await a.yield();const E=Nt.waterLight(S),B={rng:s.makeRng(s.hashSeed("pallet-tower-midsummer:sea")),preset:"calm",windAngle:Math.PI/6,light:E,depthData:C,depthRect:z,depthRes:256,shoalDepth:3,shoalWidth:12,deep:"#0a3a5e",shallowColor:"#1f4a4c"},$=Nt.makeOcean(B);i.add($.object),c.rows.sea=$.surface.geometry.index.count/3,await a.yield();const q=await on.makeTerrainAsync({rng:s.makeRng(s.hashSeed("pallet-tower-midsummer:terrain")),noise:t.noise,height:t.height,color:t.color,corridor:!1,focus:[[0,-10,.8],[-20,-100,1.5],[1520,-1520,10]],bounds:[-1e3,-2750,2750,140],cell:1.5,near:24,levels:8,maxTriangles:5e4,skirt:0,heightRange:[-8,150],biome:"meadow",shadow:0,waterLevel:0,palette:{clouds:0,tufts:.6}},a.yield);i.add(q.object),c.rows.ground=q.triangles,await a.yield();const P=On(),U=xr(s,P);i.add(U.object),c.rows.ranges=U.triangles,await a.yield();const W=await Wn(s,a.yield),V=In(e,W,m,x);await a.yield();const ne=jn(P,V);i.add(ne.object),c.rows["shell and core"]=ne.triangles,await a.yield();const ve={flames:Fa(o),smoke:Sa(o),shed:k,st:o};await a.yield(),ve.sparks=Ma(o),ve.cascade=Ra(o),await a.yield(),ve.burst=_a(o,x),ve.steam=Pa(o,x),await a.yield(),ve.wreck=Wa(o,x,t),await a.yield();const Ae=pr(P,V,ve);ne.object.add(Ae.stackBound),i.add(Ae.free);for(const R in Ae.rows)c.rows[R]=Ae.rows[R];await a.yield();const ue=Ir($,P,V);c.rows["road of fire"]=ue.triangles,ue.uniforms.uTouch.value=Array.from(x.touch),await a.yield();const At=Cs(o,n),nt=zs(o,n,At,u);await a.yield();const ce=Nr($,P,V,{boats:n,look:At,lamps:nt,people:w},o);i.add(ce.object);for(const R in ce.rows)c.rows[R]=ce.rows[R];await a.yield();const rt=await ci(P,V,{houses:u,trees:v,gulls:A},a.yield);i.add(rt.object);for(const R in rt.rows)c.rows[R]=(c.rows[R]||0)+rt.rows[R];await a.yield();const te=S.uniforms,Qs=Math.sin(Xs*_),Fe=new g.Color,Zo=R=>{te.uZenith.value.copy(R.zenith),te.uMid.value.copy(R.mid),te.uHorizon.value.copy(R.horizon),te.uGround.value.copy(R.ground),te.uScatterColor.value.copy(R.scatterColor),te.uSunColor.value.copy(R.sunColor),te.uGrad.value.set(R.horizonPow,R.scatter,R.scatterPow,7),te.uGrad2.value.set(R.midPow,R.scatterHigh,R.scatterFall,0),te.uSunDir.value.copy(R.sunDir),te.uSun.value.set(Qs,R.sunDisc,R.sunGlow,R.sunTight),te.uVeil.value=R.veil,te.uCloudLit.value[0].copy(R.cloudLit),te.uCloudLit.value[1].copy(R.cirrusLit),te.uCloudShade.value[0].copy(R.cloudShade),te.uCloudShade.value[1].copy(R.cirrusShade),te.uKeyDir.value.copy(R.keyDir),te.uKeyColor.value.copy(R.sunColor),y.ambientIntensity=R.ambient,y.lightIntensity=R.light,F.match(y),i.fog.color.copy(R.fogColor),P.uSunHigh.value=R.high;const I=E;I.sunDir.copy(R.keyDir),I.scatDir.copy(R.sunDir),I.sunColor.copy(R.lightColor).multiplyScalar(R.light),I.zenith.copy(R.zenith),I.mid.copy(R.mid),I.horizon.copy(R.horizon),I.scatterColor.copy(R.scatterColor),I.cloudLit.copy(R.cloudLit),I.cloudShade.copy(R.cloudShade),I.fogColor.copy(R.fogColor),I.skyP.set(R.midPow,R.horizonPow,R.scatter,R.scatterPow),I.skyQ.set(R.scatterHigh,R.scatterFall,R.glint,0);const de=T(.25,.95,I.cloud.x)*I.cloud.w*.8;Fe.setRGB(R.zenith.r*.3+R.mid.r*.4+R.horizon.r*.3,R.zenith.g*.3+R.mid.g*.4+R.horizon.g*.3,R.zenith.b*.3+R.mid.b*.4+R.horizon.b*.3),I.ambient.setRGB(Fe.r+(R.cloudLit.r*.45+R.cloudShade.r*.55-Fe.r)*de,Fe.g+(R.cloudLit.g*.45+R.cloudShade.g*.55-Fe.g)*de,Fe.b+(R.cloudLit.b*.45+R.cloudShade.b*.55-Fe.b)*de),P.uSunDir.value.copy(R.lightDir),P.uSunCol.value.copy(R.lightColor).multiplyScalar(R.light/Math.PI),P.uSkyCol.value.copy(R.ambientColor).multiplyScalar(R.ambient/Math.PI),P.uGndCol.value.copy(R.groundLight).multiplyScalar(R.ambient/Math.PI),P.uHazeCol.value.copy(R.horizon),P.uGlowCol.value.copy(R.scatterColor),P.uGlow.value.set(R.scatter,R.scatterPow),P.uSunTrue.value.copy(R.sunDir)},Zs=new g.Color("#ff7a2c"),Js=[],Jo=[_e[0]/2,_e[1]/2],ea=(R,I,de)=>{const it=de%oe,ie=e.front(I),Re=T(0,4,ie),Ee=x.pose(I,Js),en=T(m.tRock,m.tRock+Te,I),Ot=T(m.tRock,m.tStrike,I);let He=0;for(let lt=0;lt<Y;lt++){const ke=Ee[lt];V.uPiece.value[lt].set(ke.lean,ke.swing,ke.landed,ke.long),V.uJoint.value[lt].set(ke.x,ke.y,ke.z),He+=ke.landed/Y}const $t=O(e.crown(I),Ys,en),oa=e.share(I)*(1-Qo*He);V.uT.value=I,V.uClock.value=it,V.uEmber.value=O(1,.3,T(-2,.5,R.high)),V.uFire.value.set(K-ie,$t,T(.5,6,ie),T(Yo[0],Yo[1],ie)),V.uCrown.value.set(.4*(1-Re),-.3*(1-Re),O(.08,1,Re),O(.3,1,Re)),V.uSmoke.value.set(e.smoke(I),K+.8*e.crown(Math.min(I,m.tRock)),T(-2.5,.5,R.high),0),V.uShow.value.set(e.sparks(I),e.cascade(I)*(1-T(m.tRock-1,m.tRock+.5,I)),e.front(I-Lt),T(H-10,H,ie)),ue.uniforms.uRoad.value.set(H-ie,H,$t,1-Qo*He),ue.uniforms.uAxisP.value.set(0,N+2*He,0),ue.uniforms.uAxisD.value.set(Ee.tip[0],Ee.tip[1]-N,Ee.tip[2]).normalize();const aa=1+.05*Math.sin(Q*.7*it)+.05*Math.sin(Q*2.3*it+1.3);P.uFireA.value.set(0,K-ie+1.2*He,0),P.uFireB.value.set(Ee.tip[0],Ee.tip[1]+.5*$t+1.2*He,Ee.tip[2]),P.uFireCol.value.copy(Zs).multiplyScalar(Ho*oa*aa),b.intensity=js*Ho*oa*aa,b.position.set(Jo[0]*Ot,O(Math.max(Ko,K-ie/2),Ks,Ot),Jo[1]*Ot),ne.barrel.scale.setScalar(1-T(Xo[0],Xo[1],ie))};Zo(l),ea(l,0,0),a.renderer&&await S.prewarm(a.renderer,null,i),await a.yield();let ta=0;for(const R in c.rows)ta+=c.rows[R];return c.triangles=Math.round(ta),{scene:i,path:r.path,duration:ge,pace:r.pace,pois:f,ride:"none",style:"none",camera:{fov:62,near:.3,far:14e3,sway:0,bank:0,lookAhead:26},portal:{shape:"circle",radius:7,tilt:!0,color:"#ffb46a",glow:1,blendDistance:25},post:{exposure:1,bloom:{strength:.3,radius:.55,threshold:1},grade:{saturation:1.04,contrast:1,vignette:.2,grain:.01}},report:c,made:{F:r,fall:m,pieces:x,hour:d,burn:e,shed:k,ground:t,boats:n,people:w,houses:u,trees:v,gulls:A,sky:S,rig:F,sea:$,terrain:q,stack:ne,fire:Ae,shore:rt,B:V,U:P},update(R,I,de,it){const ie=r.secondsAt(Z(it,0,1)*r.L),Re=d.at(ie);Zo(Re),ea(Re,ie,I),S.update(R,I,de),F.update(R,I,de),$.update(R,I,de),ue.follow(),ce.update(I%oe),q.update(R,I)},dispose(){S.dispose(),W.dispose(),$.uniforms.uDepthTex&&$.uniforms.uDepthTex.value.dispose(),ue.material.dispose(),ce.dispose(),rt.dispose()}}}var vi={id:"pallet-tower-midsummer",name:"Pallet Tower Midsummer",category:"city",weirdness:.2,media:["air","open"],flight:{makeFlight:Ut,makePois:Yt},sums:{makeWay:Bt,makeFlight:Ut,makeFall:la,makeGaze:fa,makePois:Yt,makeHour:va,makeGround:Ba,lineOf:fo,dealBoats:Tn,dealPeople:Qa,dealHouses:Za,dealTrees:es,dealGulls:rs,gullAt:ns,gullAngle:Dn,treeLeaf:qo,treeTone:Us,hashPlace:Is,shipGeometry:Bs,gullGeometry:Hs,stackRadius:J,rockFrame:br,underWayAt:ys,deckOf:To,dealLook:Cs,dealLamps:zs,boatGeometry:yt,makePieces:ca,dealBurst:_a,burstPlace:bn,dealSteam:Pa,steamPlace:An,dealWreck:Wa,wreckPlace:Mn,makeBurn:ma,dealShed:wa,dealSparks:Ma,sparkPlace:gn,dealSmoke:Sa,smokePlace:xn,dealFlames:Fa,dealCascade:Ra,K:{GULLS:ts,GULL_LINE:po,GULL_AXIS:os,GULL_LOW:as,GULL_GROUND:ss,GULL_REACH:Qe,SHIP_DECKS:Ye,SHIP_FUNNEL:Xe,TREES:Ja,SUN_SIDE:xe,FOOT:N,TOP:K,STACK_L:H,R_FOOT:ct,R_TOP:Me,STRAIGHT:le,FALL_BEAR:pe,FALL_END:ae,TIP:_e,DURATION:ge,BOATS:co,BOAT_MIN:Rt,BOAT_MAX:ho,FALL_WATER:Et,LOW_LINE:Ua,LINE_CLEAR:qa,ENTRY_CLEAR:Va,ENTRY_BACK:_t,FIGURE_MIN:Ha,FIGURES:Ya,FIGURES_NEAR:Xa,FIGURE_APART:vo,HOUSE_CLEAR:mo,RING_OFF:Wt,RING_Y:It,OUT_HEAD:ra,CHAR:Xt,SHED_AFTER:Lt,SHED_OUT:da,SHED:pa,PALLET_HALF:pn,SPARKS:De,SMOKE:Oe,SMOKE_HIGH:Jt,TONGUES:$e,TONGUES_CROWN:ka,CASCADE:Ne,WIND_LEAN:dt,LEE:re,WRAP:oe,FIRE_K:Ho,FIRE_DECAY:jo,FIRE_LAMP:js,LAMP_LOW:Ko,ROCK_GAIN:xt,ROCK_WAVES:_o,UNDER_R:ze,UNDER_LEN:tt,UNDER_OUT:Be,UNDER_ARC:ot,SEA_FACET:Ps,SEA_AWAY:Ds,ROAD_SOFT:_s,STREAK_SPREAD:Rs,STREAK_WAVER:Dt,PALLET_EMBER:So,SPARK_K:ko,RAFT_RAGGED:Zt,LOW_Y:Gt,ABOARD:bs,BOOM_AFT:As,BOOM_SIDE:ks,SHIP_MAST:Ms,MAST_CLEAR:Ss,MAST_SIDE:Po,EATEN:Yo,BARREL_GONE:Xo,LAMP_FIRST:bt,LAMP_LAST:Do,PIECES:Y,SEG:j,BREAK:he,LEAD_FULL:Vt,LEADS:ht,SWINGS:jt,K_FLAT:ut,K_WIDE:Pe,K_LONG:kt,DRAW_FULL:Mt,LAND_AFTER:Kt,LEAD_POW:Ht,BURST:We,BURST_BREAK:Ea,BURST_G:so,BURST_WIND:Ct,STEAM:Ke,STEAM_FIRST:mt,STEAM_HISS:ro,STEAM_SPRAY:Ta,SPRAY_G:pt,STEAM_DRIFT:io,STEAM_FROM:lo,SMOKE_FALL_SHOWN:Ca,SMOKE_OLD_SHOWN:za,WRECK:Da,WRECK_REACH:kn,WRECK_EARLY:Oa,EARLY_FROM:$a,EARLY_LEAD:Na,BURST_OPEN:no,BURST_KINK:zt,TONGUE_BACK:ga,TONGUE_WHOLE:xa,RAFT_TALL:ya,RAFT_WIDE:ba,RAFT_FLARE:Aa,SLEEVE_OFF:ds,SLEEVE_CUT:bo,GLOW_K:ws,GLOW_R:Lo,GLOW_FAR:et,GLOW_FOOT:gs,SEA_GLOW:Ts,STREAK_K:Fs,HOLD:St,EASE:ua,SMOKE_FALL_RISE:ao,WRECK_SPARKS:eo,SMOKE_TURN:to,SMOKE_GAP:oo,NLEAN:fe,WAVE_SPEED:Fo,WAVE_GONE:gt,WAVE_FROM:Ro,LAMP_AFTER:Ks,CROWN_FALLEN:Ys,FIRE_LANDED:Qo,ROCK:Te,FALL_DIR:se}},build:hi};export{vi as default};
