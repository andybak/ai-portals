import*as M from"three";import{clamp as Be,lerp as he,smoothstep as be}from"../kit/core.js";const De=["#1b2a55","#5a6fa8","#c9b6c8","#eef3fa","#3b3f4a","#7a2f2a","#ffc46b"],U=0,Ce=1,_e=2,$e=3,le=4,ke=5,Oe=6,je=7,Ze=8,Qe=9,E=0,Le=1,j=2,we=3,Ke=4,qe=5,Je=6;class ze{constructor(e=!1){this.p=[],this.n=[],this.uv=[],this.c=[],this.m=[],this.i=[],this.nv=0,this.sp=e?[]:null,this.spin=[0,0,0,0],this.ox=0,this.oy=0,this.oz=0}setSpin(e=0,s=0,n=0,c=0){this.spin=[e+this.ox,s+this.oy,n,c]}vert(e,s,n,c,l,b,o,f,u,i,d=1){return this.p.push(e+this.ox,s+this.oy,n+this.oz),this.n.push(c,l,b),this.uv.push(o,f),this.c.push(u[0]*d,u[1]*d,u[2]*d),this.m.push(i),this.sp&&this.sp.push(this.spin[0],this.spin[1],this.spin[2],this.spin[3]),this.nv++}quad(e,s,n,c,l,b,o,f){const u=s[0]-e[0],i=s[1]-e[1],d=s[2]-e[2],v=c[0]-e[0],x=c[1]-e[1],t=c[2]-e[2];let h=i*t-d*x,r=d*v-u*t,p=u*x-i*v;const C=Math.hypot(h,r,p)||1;h/=C,r/=C,p/=C;const L=[e,s,n,c],T=[];for(let k=0;k<4;k++){const y=L[k];let X,B;o?(X=o[k][0],B=o[k][1]):Math.abs(r)>.7?(X=y[0],B=y[2]):Math.abs(p)>=Math.abs(h)?(X=y[0],B=y[1]):(X=y[2],B=y[1]),T.push(this.vert(y[0],y[1],y[2],h,r,p,X,B,l,b,f?f[k]:1))}this.i.push(T[0],T[1],T[2],T[0],T[2],T[3])}tri(e,s,n,c,l){const b=s[0]-e[0],o=s[1]-e[1],f=s[2]-e[2],u=n[0]-e[0],i=n[1]-e[1],d=n[2]-e[2];let v=o*d-f*i,x=f*u-b*d,t=b*i-o*u;const h=Math.hypot(v,x,t)||1;v/=h,x/=h,t/=h;const r=this.vert(e[0],e[1],e[2],v,x,t,e[0]+e[2],e[1],c,l),p=this.vert(s[0],s[1],s[2],v,x,t,s[0]+s[2],s[1],c,l),C=this.vert(n[0],n[1],n[2],v,x,t,n[0]+n[2],n[1],c,l);this.i.push(r,p,C)}hexa(e,s,n,c,l,b,o="fkrlt",f){const[u,i,d,v]=n,[x,t,h,r]=c,p=f||[1,1,1,1];o.includes("f")&&this.quad([u,e,v],[i,e,v],[t,s,r],[x,s,r],l,b,null,p),o.includes("k")&&this.quad([i,e,d],[u,e,d],[x,s,h],[t,s,h],l,b,null,p),o.includes("r")&&this.quad([i,e,v],[i,e,d],[t,s,h],[t,s,r],l,b,null,p),o.includes("l")&&this.quad([u,e,d],[u,e,v],[x,s,r],[x,s,h],l,b,null,p),o.includes("t")&&this.quad([x,s,r],[t,s,r],[t,s,h],[x,s,h],l,b),o.includes("b")&&this.quad([u,e,d],[i,e,d],[i,e,v],[u,e,v],l,b)}box(e,s,n,c,l,b,o,f,u="fkrlt",i){this.hexa(n,c,[e,s,l,b],[e,s,l,b],o,f,u,i)}bevelBox(e,s,n,c,l,b,o,f,u,i="fkrlt"){this.box(e,s,n,c-o,l,b,f,u,i.replace("t","")),this.hexa(c-o,c,[e,s,l,b],[e+o,s-o,l+o,b-o],f,u,i)}lathe(e,s,n,c,l,b,o=0,f=Math.PI*2){const u=(i,d,v,x,t)=>{const h=Math.cos(v),r=Math.sin(v);let p,C,L,T,k,y;return s==="x"?(p=d,C=i*h,L=i*r,T=t,k=x*h,y=x*r):s==="y"?(p=i*h,C=d,L=-i*r,T=x*h,k=t,y=-x*r):(p=i*h,C=i*r,L=d,T=x*h,k=x*r,y=t),this.vert(e[0]+p,e[1]+C,e[2]+L,T,k,y,v*Math.max(i,.3),d,l,b)};for(let i=0;i<n.length-1;i++){const[d,v]=n[i],[x,t]=n[i+1],h=x-d,r=t-v,p=Math.hypot(h,r)||1,C=r/p,L=-h/p;let T=null;for(let k=0;k<=c;k++){const y=o+(f-o)*(k/c),X=[u(d,v,y,C,L),u(x,t,y,C,L)];T&&this.i.push(T[0],X[0],X[1],T[0],X[1],T[1]),T=X}}}build(){const e=new M.BufferGeometry;return e.setAttribute("position",new M.Float32BufferAttribute(this.p,3)),e.setAttribute("normal",new M.Float32BufferAttribute(this.n,3)),e.setAttribute("uv",new M.Float32BufferAttribute(this.uv,2)),e.setAttribute("color",new M.Float32BufferAttribute(this.c,3)),e.setAttribute("aMat",new M.Float32BufferAttribute(this.m,1)),this.sp&&e.setAttribute("aSpin",new M.Float32BufferAttribute(this.sp,4)),e.setIndex(this.nv>65535?new M.Uint32BufferAttribute(this.i,1):new M.Uint16BufferAttribute(this.i,1)),e}async buildAsync(e){const s=new M.BufferGeometry,n=async()=>{e&&await e()};return s.setAttribute("position",new M.Float32BufferAttribute(this.p,3)),await n(),s.setAttribute("normal",new M.Float32BufferAttribute(this.n,3)),await n(),s.setAttribute("uv",new M.Float32BufferAttribute(this.uv,2)),await n(),s.setAttribute("color",new M.Float32BufferAttribute(this.c,3)),await n(),s.setAttribute("aMat",new M.Float32BufferAttribute(this.m,1)),this.sp&&s.setAttribute("aSpin",new M.Float32BufferAttribute(this.sp,4)),await n(),s.setIndex(this.nv>65535?new M.Uint32BufferAttribute(this.i,1):new M.Uint16BufferAttribute(this.i,1)),s}}const ue=7,We=34,Ae=We/2,Ve=7,te=We+Ve,ce=65,Me=58.5,G=62.4,Y=4.5,ie=-14,pe=65,oe=64.72,ve=65.75,re=4.95,me=150,W=172,xe=ve+2.75,Ee=re+.55,He=Me-1.85,Ue=Y+.33,Ge=a=>{const e=new M.Color(a);return[e.r,e.g,e.b]},O=(a,e)=>[a[0]*e,a[1]*e,a[2]*e],Se=(a,e,s)=>[he(a[0],e[0],s),he(a[1],e[1],s),he(a[2],e[2],s)],ge=[1,1,1];function et(a,e,s){const n=[],c=[],l=[0],b=2/e.archExp,o=f=>{const u=Math.cos(f),i=Math.sin(f);return[a-Ae*Math.sign(u)*Math.pow(Math.abs(u),b),e.spring+e.rise*Math.pow(Math.max(i,0),b)]};for(let f=0;f<=s;f++){const u=Math.PI*(f/s),i=o(u),d=o(Math.max(0,u-.01)),v=o(Math.min(Math.PI,u+.01));let x=v[0]-d[0],t=v[1]-d[1];const h=Math.hypot(x,t)||1;x/=h,t/=h,n.push(i),c.push([i[0]-t*e.ringT,Math.max(e.spring,i[1]+x*e.ringT)]),f&&l.push(l[f-1]+Math.hypot(i[0]-n[f-1][0],i[1]-n[f-1][1]))}return{P:n,E:c,L:l}}async function tt(a,e,s,n,c){const l=e.stone,b=Y+.25,o=28,f=[1,-1],u=(x,t,h,r,p,C,L,T,k,y)=>{const X=[h[0],h[1],t*x],B=[r[0],r[1],t*x],q=[p[0],p[1],t*x],N=[C[0],C[1],t*x];x>0?a.quad(X,B,q,N,L,T,k,y):a.quad(X,N,q,B,L,T,k?[k[0],k[3],k[2],k[1]]:null,y?[y[0],y[3],y[2],y[1]]:null)},i=(x,t,h)=>x>0?[t,h]:[-h,-t],d=(x,t)=>x>0?t:t.replace(/[fk]/g,h=>h==="f"?"k":"f");for(let x=0;x<ue;x++){const t=(x-(ue-1)/2)*te,{P:h,E:r,L:p}=et(t,e,o),C=O(l,.92+.14*s());for(let L=0;L<o;L++){const T=h[L],k=h[L+1],y=r[L],X=r[L+1];for(const N of f){u(N,b,T,k,X,y,O(C,1.08),Oe,[[p[L],0],[p[L+1],0],[p[L+1],e.ringT],[p[L],e.ringT]]),u(N,Y,y,X,[X[0],G],[y[0],G],C,U,null,[.96,.96,.74,.74]);const D=[y[0],y[1],b*N],Z=[X[0],X[1],b*N],$=[X[0],X[1],Y*N],K=[y[0],y[1],Y*N];N>0?a.quad(D,Z,$,K,C,U):a.quad(D,K,$,Z,C,U)}const B=[b,2.4,-2.4,-b],q=[.95,.5,.5,.95];for(let N=0;N<3;N++)a.quad([T[0],T[1],B[N]],[T[0],T[1],B[N+1]],[k[0],k[1],B[N+1]],[k[0],k[1],B[N]],O(C,.9),Qe,[[B[N],p[L]],[B[N+1],p[L]],[B[N+1],p[L+1]],[B[N],p[L+1]]],[q[N],q[N+1],q[N+1],q[N]])}for(const L of f){u(L,Y,[t-te/2,e.spring],[r[0][0],e.spring],[r[0][0],G],[t-te/2,G],C,U),u(L,Y,[r[o][0],e.spring],[t+te/2,e.spring],[t+te/2,G],[r[o][0],G],C,U);const[T,k]=i(L,Y,Y+.62);a.hexa(Me-.25,Me+e.ringT+.8,[t-.62,t+.62,T,k],[t-.95,t+.95,T,k],O(l,1.2),U,d(L,"frltb"));{const y=Ue*L,X=Me-.25,B=[.05,.055,.07];a.box(t-.04,t+.04,X-1,X,y-.04,y+.04,B,le,"fkrl"),a.hexa(X-1.14,X-.96,[t-.46,t+.46,y-.46,y+.46],[t-.08,t+.08,y-.08,y+.08],B,le,"fkrl"),a.hexa(X-2.05,X-1.14,[t-.24,t+.24,y-.24,y+.24],[t-.38,t+.38,y-.38,y+.38],e.amberC,ke,"fkrlb"),e.keyLamps.push([t,He,y])}}c&&x%2===1&&await c()}for(let x=0;x<=ue;x++){const t=(x-ue/2)*te,h=O(l,.9+.16*s());let r=Ve/2,p=Y+.35,C=e.spring-.9;a.bevelBox(t-r-.5,t+r+.5,e.spring-.9,e.spring+.55,-p-.5,p+.5,.3,O(h,1.12),U,"fkrltb");const L=e.tiers,T=(C-ie)/L;for(let k=0;k<L;k++){const y=C-T*(k===L-1?1:.94+.12*s()),X=C-y,B=r+e.batterX*X,q=p+e.batterZ*X,N=[1-.06*k,1-.06*k,1-.03*k,1-.03*k];a.hexa(y,C,[t-B,t+B,-q,q],[t-r,t+r,-p,p],h,U,"fkrl",[N[0],N[1],.9,.9]);const D=1.35,Z=.55;if(a.hexa(y,C,[t-D,t+D,q,q+Z+.25],[t-D,t+D,p,p+Z],O(h,1.06),U,"frl"),a.hexa(y,C,[t-D,t+D,-q-Z-.25,-q],[t-D,t+D,-p-Z,-p],O(h,1.06),U,"krl"),k===0)for(const $ of f){const K=y+2.3,ee=he(q,p,2.3/X)+Z+.14,w=(ee+.72)*$,z=[.05,.055,.07],[F,V]=i($,ee-.1,ee+.95);a.box(t-.05,t+.05,K+.98,K+1.08,F,V,z,le,"fkrltb"),a.hexa(K+.74,K+.98,[t-.5,t+.5,w-.5,w+.5],[t-.08,t+.08,w-.08,w+.08],ge,Ce,"fkrl"),a.hexa(K-.2,K+.74,[t-.26,t+.26,w-.26,w+.26],[t-.42,t+.42,w-.42,w+.42],e.amberC,ke,"fkrlb"),e.pierLamps.push([t,K+.3,w])}if(k<L-1){const $=e.ledge;e.ledges.push([t,y,B,q]),a.hexa(y-.55,y,[t-B-$,t+B+$,-q-$-.9,q+$+.9],[t-B,t+B,-q-.8,q+.8],O(h,1.1),U,"fkrl"),r=B+$,p=q+$,C=y-.55}else a.bevelBox(t-B-.8,t+B+.8,ie,ie+15+3*s(),-q-1.6,q+1.6,.6,O(h,.95),U,"fkrlt")}for(const k of f){let[y,X]=i(k,Y,Y+.6);a.box(t-2.2,t+2.2,e.spring+.55,G-1.7,y,X,O(h,1.05),U,d(k,"frl"),[1,1,.8,.8]);const[B,q]=i(k,Y,Y+1.35);a.hexa(G-1.7,G+.55,[t-2.2,t+2.2,y,X],[t-2.7,t+2.7,B,q],O(h,1.12),U,d(k,"frlb"));const[N,D]=i(k,re-.5,Y+1.35);a.box(t-2.7,t+2.7,G+.55,ve,N,D,h,U,"fkrl");const[Z,$]=i(k,re-.6,Y+1.47);a.bevelBox(t-2.82,t+2.82,ve,ve+.3,Z,$,.12,O(h,1.15),U,"fkrlt");const K=Ee*k,ee=[.05,.055,.07];a.hexa(ve+.3,xe-.45,[t-.13,t+.13,K-.13,K+.13],[t-.07,t+.07,K-.07,K+.07],ee,le,"fkrl"),a.box(t-.5,t+.5,xe-1.2,xe-1.1,K-.04,K+.04,ee,le,"fkrltb"),a.hexa(xe-.45,xe+.3,[t-.2,t+.2,K-.2,K+.2],[t-.33,t+.33,K-.33,K+.33],e.amberC,ke,"fkrlb"),a.hexa(xe+.3,xe+.72,[t-.42,t+.42,K-.42,K+.42],[t-.05,t+.05,K-.05,K+.05],ge,Ce,"fkrl"),e.lamps.push([t,xe,K])}c&&x%3===2&&await c()}c&&await c();const v=ue/2*te;for(const x of[-1,1])for(const t of f){const h=x>0?v:-W,r=x>0?W:-v;u(t,Y,[h,ie],[r,ie],[r,G],[h,G],O(l,.97),U,null,[.8,.8,.78,.78]);const p=x*(v+W)/2,[C,L]=i(t,Y,Y+.4);a.box(p-9,p-7,20,G,C,L,O(l,1.06),U,d(t,"frl")),a.box(p+7,p+9,20,G,C,L,O(l,1.06),U,d(t,"frl"));const[T,k]=i(t,Y,Y+.7);a.bevelBox(p-9.6,p+9.6,18.8,20.2,T,k,.25,O(l,1.1),U,d(t,"frlt"))}for(const x of f){const[t,h]=i(x,Y,Y+.5);a.box(-W,W,G,G+.55,t,h,O(l,1.14),U,d(x,"ftb"));const[r,p]=i(x,re-.5,re);a.box(-W,W,G+.55,ve,r,p,O(l,1),U,"fk");const[C,L]=i(x,re-.6,re+.1);a.bevelBox(-W,W,ve,ve+.28,C,L,.1,O(l,1.16),U,"fkt");for(let k=-W+1;k<W-.5;k+=1.55){if(Math.abs(((k/te+.5)%1+1)%1-.5)*te<2.5&&Math.abs(k)<v+3)continue;const[X,B]=i(x,Y,Y+.14),[q,N]=i(x,Y,Y+.46);a.hexa(G-.75,G,[k-.26,k+.26,X,B],[k-.3,k+.3,q,N],O(l,1.1),U,d(x,"frl"))}const T=.72*e.trainScale*x;a.box(-W,W,oe,pe,T-.07,T+.07,[.05,.05,.06],le,"fkt")}a.quad([-W,oe,re-.5],[W,oe,re-.5],[W,oe,-re+.5],[-W,oe,-re+.5],ge,Ze)}function Ie(a,e,s=-1){const n=a.nv,c=s>=0;for(let l=0;l<e.nv;l++){for(let b=0;b<3;b++){const o=b===s?-1:1;a.p.push(e.p[l*3+b]*o),a.n.push(e.n[l*3+b]*o)}if(a.uv.push(e.uv[l*2],e.uv[l*2+1]),a.c.push(e.c[l*3],e.c[l*3+1],e.c[l*3+2]),a.m.push(e.m[l]),a.sp){const b=e.sp[l*4+3];a.sp.push(e.sp[l*4],e.sp[l*4+1],e.sp[l*4+2],c&&b>1.5?b+4:b)}}for(let l=0;l<e.i.length;l+=3)a.i.push(n+e.i[l],n+e.i[l+(c?2:1)],n+e.i[l+(c?1:2)]);a.nv+=e.nv}function ot(a,e,s,n,c,l){const b=O(e.stone,.9+.12*s()),o=W-2,f=W+16,u=13,i=17,d=ce+18.5+4*s(),v=4,x=oe+6.2,t=o+1.6,h=w=>u+(i-u)*(d-w)/(d-ie);a.quad([o,ie,-i],[o,ie,-v],[o,d,-v],[o,d,-u],b,U,null,[.7,.7,1,1]),a.quad([o,ie,v],[o,ie,i],[o,d,u],[o,d,v],b,U,null,[.7,.7,1,1]),a.quad([o,ie,-v],[o,ie,v],[o,oe,v],[o,oe,-v],b,U);const r=[],p=[],C=[0],L=14;r.push([-v,oe]),p.push([-v-1,oe]);for(let w=0;w<=L;w++){const z=Math.PI*(1-w/L),F=Math.cos(z),V=Math.sin(z);r.push([v*F,x+v*V]),p.push([(v+1)*F,x+(v+1)*V])}r.push([v,oe]),p.push([v+1,oe]);for(let w=1;w<r.length;w++)C.push(C[w-1]+Math.hypot(r[w][0]-r[w-1][0],r[w][1]-r[w-1][1]));for(let w=0;w<r.length-1;w++){const z=r[w],F=r[w+1],V=p[w],J=p[w+1];w>0&&w<r.length-2&&a.quad([o,z[1],z[0]],[o,F[1],F[0]],[o,d,F[0]],[o,d,z[0]],b,U),a.quad([o,z[1],z[0]],[t,z[1],z[0]],[t,F[1],F[0]],[o,F[1],F[0]],O(b,.55),U,null,[1,.25,.25,1]),a.quad([o-.3,z[1],z[0]],[o-.3,F[1],F[0]],[o-.3,J[1],J[0]],[o-.3,V[1],V[0]],O(b,1.15),Oe,[[C[w],0],[C[w+1],0],[C[w+1],1],[C[w],1]]),a.quad([o-.3,V[1],V[0]],[o-.3,J[1],J[0]],[o,J[1],J[0]],[o,V[1],V[0]],b,U)}a.quad([t,oe,-v],[t,oe,v],[t,x+v,v],[t,x+v,-v],[0,0,0],je),a.hexa(x+v-.2,x+v+1.9,[o-.7,o,-.6,.6],[o-.7,o,-.95,.95],O(b,1.25),U,"fklbt"),a.hexa(ie,d,[o,f,-i,i],[o,f,-u,u],b,U,"fkrt",[.7,.7,1,1]);for(const w of[G,ce+13.2]){const z=h(w)+.45,F=h(w+.7)+.45;a.hexa(w,w+.7,[o-.45,f,-z,z],[o-.45,f,-F,F],O(b,1.15),U,w>ce?"fkbt":"fklbt")}a.quad([o-.45,ce+13.2,-u-.6],[o-.45,ce+13.2,-v-1.2],[o-.45,ce+13.9,-v-1.2],[o-.45,ce+13.9,-u-.6],O(b,1.15),U),a.quad([o-.45,ce+13.2,v+1.2],[o-.45,ce+13.2,u+.6],[o-.45,ce+13.9,u+.6],[o-.45,ce+13.9,v+1.2],O(b,1.15),U),a.hexa(d-1.3,d,[o-.2,f,-u-.2,u+.2],[o-.7,f,-u-.7,u+.7],O(b,1.12),U,"fklbt");const T=(w,z,F,V)=>a.bevelBox(w,z,d,d+1.5+.2*s(),F,V,.18,O(b,.95+.2*s()),U,"fkrlt");if(e.crenel){for(let w=-u-.5;w<u;w+=2.7)T(o-.7,o+.4,w,w+1.5);for(let w=o+2;w<f-1;w+=2.7)T(w,w+1.5,u-.4,u+.7),T(w,w+1.5,-u-.7,-u+.4)}else a.hexa(d,d+7,[o-1.2,f,-u-1.2,u+1.2],[o+7,f,-1.5,1.5],ge,Ce,"fkl");const k=(w,z,F,V,J)=>{a.quad([o-.06,w,z-F],[o-.06,w,z+F],[o-.06,w+V,z+F],[o-.06,w+V,z-F],O(e.amberC,J),ke),a.bevelBox(o-.5,o,w-.35,w,z-F-.3,z+F+.3,.1,O(b,1.2),U,"fklt"),l.glows.push([o-.5,w+V/2,z,e.amberC,3.2*J+2,.5])},y=ce+14.6;for(const w of[-7.5,-2.5,2.5,7.5])s()<.8&&k(y,w,.45,1.5,.5+.5*s());for(const w of[-1,1]){const z=w*(v+2.4),F=oe+5.2;a.box(o-1.1,o,F+.9,F+1,z-.05,z+.05,[.05,.05,.07],le,"fklbt"),a.hexa(F,F+.75,[o-1.25,o-.85,z-.2,z+.2],[o-1.38,o-.72,z-.33,z+.33],e.amberC,ke,"fkrlb"),a.hexa(F+.75,F+1.15,[o-1.45,o-.65,z-.4,z+.4],[o-1.1,o-1,z-.05,z+.05],ge,Ce,"fkrl"),l.glows.push([o-1.05,F+.4,z,e.amberC,6.5,1]),l.lamps.push([o-1.05,F+.4,z])}if(a.box(o-.95,o-.55,x+v+2.3,x+v+2.75,-.22,.22,[.25,1,.55],ke,"fklbt"),l.glows.push([o-1,x+v+2.5,0,[.2,1,.5],3.4,1]),!c)return;const X=W-24,B=W+58,q=52,N=30,D=40,Z=s()*100,$=s.range(-14,14),K=(w,z)=>{const F=Math.abs(z),V=W+6-27*be(13,30,F),J=be(V-1,V+15,w),g=Math.pow(be(0,34,Math.min((q-F)*1.1,B-w)),.8),S=Math.exp(-(Math.pow((w-W-30)/17,2)+Math.pow((z-$)/15,2))),I=(ce+7+12*n.fbm2(w*.02+Z,z*.02,3)+24*S-ie)*(1-.35*be(16,q,F));return ie+J*g*(I+13*(n.ridged2(w*.03+Z,z*.03,4)-.35)+7*n.ridged2(w*.075-Z,z*.075,2))},ee=[];for(let w=0;w<=N;w++)for(let z=0;z<=D;z++){const F=he(X,B,w/N)+(w>0&&w<N?(s()-.5)*1.6:0),V=he(-q,q,z/D)+(z>0&&z<D?(s()-.5)*1.6:0),J=K(F,V),g=.8,S=K(F+g,V)-K(F-g,V),I=K(F,V+g)-K(F,V-g);let P=-S,_=2*g,m=-I;const R=Math.hypot(P,_,m);P/=R,_/=R,m/=R;const A=.8+.3*n.n2(F*.07+Z,V*.07);ee.push(a.vert(F,J,V,P,_,m,F+V,J,[A,A,A],$e))}for(let w=0;w<N;w++)for(let z=0;z<D;z++){const F=ee[w*(D+1)+z],V=ee[w*(D+1)+z+1],J=ee[(w+1)*(D+1)+z+1],g=ee[(w+1)*(D+1)+z];a.i.push(F,V,J,F,J,g)}}async function at(a,e,s,n,c){const l=(f,u,i,d,v,x,t=1.3)=>{const h=Math.max(2,Math.round((u-f)/t)),r=[[-.5,0,-.9,.45],[-.34,.72,-.6,.8],[0,1,0,1],[.34,.72,.6,.8],[.5,0,.9,.45]];let p=null;for(let C=0;C<=h;C++){const L=he(f,u,C/h),T=x*(.6+.55*(n.n2(L*.45,d*3.1)*.5+.5)+.35*(n.n2(L*.11,d)*.5+.5)),k=r.map(y=>a.vert(L,i+y[1]*T,d+y[0]*v*(1+.15*n.n2(L*.3,7+d)),0,y[3],y[2],L,d+y[0],ge,Ce));if(p)for(let y=0;y<4;y++)a.i.push(p[y],p[y+1],k[y+1],p[y],k[y+1],k[y]);p=k}};for(const f of[-1,1])l(-W,W,ve+.26,f*(re-.25),.82,.42),l(-W,W,G+.5,f*(Y+.36),.3,.2,2.6),l(-W,W,oe-.02,f*(re-1),1.3,.55,2.2),c&&await c();{const f=[.075,.062,.058],u=[.17,.18,.25],i=-(re-.22),d=ve+8.2,v=[];for(let t=-8;t<=7;t++)v.push(t*te/2+te/4+(s()-.5)*1.5);const x=[d-.7,d-1.7];for(const t of v){a.hexa(ve+.25,d,[t-.15,t+.15,i-.15,i+.15],[t-.09,t+.09,i-.09,i+.09],f,le,"fkrlt");for(const h of x){a.box(t-.07,t+.07,h,h+.13,i-1,i+1,f,le,"fkrltb");for(const r of[-.85,.85])a.hexa(h+.13,h+.3,[t-.06,t+.06,i+r-.06,i+r+.06],[t-.03,t+.03,i+r-.03,i+r+.03],[.5,.6,.7],_e,"fkrlt")}}for(let t=0;t<v.length-1;t++)for(const h of x)for(const r of[-.85,.85]){const p=i+r,C=.45+.25*s(),L=6,T=.035;for(let k=0;k<L;k++){const y=k/L,X=(k+1)/L,B=he(v[t],v[t+1],y),q=he(v[t],v[t+1],X),N=h+.3-C*4*y*(1-y),D=h+.3-C*4*X*(1-X);for(let Z=0;Z<2;Z++){Z?a.quad([q,D-T,p],[B,N-T,p],[B,N+T,p],[q,D+T,p],u,le):a.quad([B,N-T,p],[q,D-T,p],[q,D+T,p],[B,N+T,p],u,le);const $=a.m.length;a.m[$-4]=a.m[$-3]=le-.25,a.m[$-2]=a.m[$-1]=le+.25}}}}const b=(f,u,i,d,v)=>{const x=s()*6.28,t=[f+(s()-.5)*v,u-d,i+(s()-.5)*v],h=O(ge,.8+.2*s());for(let r=0;r<3;r++){const p=x+r*2.094,C=p+2.094;a.tri([f+Math.cos(p)*v,u,i+Math.sin(p)*v],t,[f+Math.cos(C)*v,u,i+Math.sin(C)*v],h,_e)}},o=()=>.35+2.3*Math.pow(s(),2.6);c&&await c();{let f=48271;const u=()=>(f=f*16807%2147483647,f/2147483647),i=(d,v,x,t,h)=>{const r=u()*6.28,p=[d+(u()-.5)*h,v-t,x+(u()-.5)*h],C=O(ge,.8+.2*u());for(let L=0;L<3;L++){const T=r+L*2.094,k=T+2.094;a.tri([d+Math.cos(T)*h,v,x+Math.sin(T)*h],p,[d+Math.cos(k)*h,v,x+Math.sin(k)*h],C,_e)}};for(const[d,v,x,t]of e.ledges)for(const h of[-1,1]){l(d-x-.15,d+x+.15,v-.04,h*(t+.45),.95,.62,.9);for(let r=0;r<7;r++){const p=.5+2.2*Math.pow(u(),2);i(d+(u()*2-1)*x,v-.53,h*(t+1.15),p,.08+p*.05)}}for(let d=0;d<ue;d++)for(const v of[-1,1]){const x=(d-(ue-1)/2)*te;for(let t=0;t<7;t++){const h=(u()*2-1)*3.2,r=e.spring+e.rise*Math.pow(Math.max(0,1-Math.pow(Math.abs(h)/Ae,e.archExp)),1/e.archExp),p=1.1+2.6*u();Math.abs(h)<.6||i(x+h,r+.03,v*(Y+.2),p,.09+p*.045)}}}c&&await c();for(const f of[-1,1]){for(let u=0;u<e.icicles;u++){const i=(s()*2-1)*W+n.n2(u*.3,1)*3,d=o();b(i,G+.02,f*(Y+.44),d,.07+d*.06)}for(let u=0;u<=ue;u++){const i=(u-ue/2)*te;for(let d=0;d<9;d++){const v=o()*1.2;b(i+(s()*2-1)*3.9,e.spring-.88,f*(Y+.82),v,.08+v*.06)}}for(let u=0;u<ue;u++){const i=(u-(ue-1)/2)*te;for(let d=0;d<16;d++){const v=(s()*2-1)*8.5,x=e.spring+e.rise*Math.pow(Math.max(0,1-Math.pow(Math.abs(v)/Ae,e.archExp)),1/e.archExp),t=o()*1.3;b(i+v,x+.03,f*(Y+.18),t,.08+t*.06)}}c&&await c()}}const st=.4,ye=.95,de=1.16;async function nt(a,e,s){const n=new ze(!0),c=new ze(!0),l=[.042,.046,.06],b=[.06,.063,.075],o=[.3,.31,.34],f=O(a.crimson,2.3),u=O(a.crimson,1.6),i=O(a.amberC,.75),d=Se(a.snowC,a.amberC,.35).map(g=>g*.62),v=[],x=async()=>{Ie(n,c),s&&await s(),Ie(n,c,2),c.p.length=c.n.length=c.uv.length=c.c.length=c.m.length=c.sp.length=c.i.length=0,c.nv=0},t=g=>{n.ox=g,c.ox=g},h=()=>{n.setSpin(),c.setSpin()},r=(g,S,I,P,_,m)=>{c.setSpin(g,S,S,1);const R=[g,S,0];c.lathe(R,"z",[[S+.06,I-.2],[S+.06,I-.13],[S,I-.12],[S,I],[S-.07,I+.02],[S-.14,I]],m,o,j),c.lathe(R,"z",[[S-.12,I-.07],[0,I-.07]],m,O(_,.35),E),c.lathe(R,"z",[[.2,I-.06],[.2,I+.05],[.1,I+.08],[0,I+.08]],8,_,E);for(let A=0;A<P;A++){const H=A/P*6.2832,Q=Math.cos(H),se=Math.sin(H),ne=.045,fe=I-.02;c.quad([g+Q*.15+se*ne,S+se*.15-Q*ne,fe],[g+Q*(S-.1)+se*ne,S+se*(S-.1)-Q*ne,fe],[g+Q*(S-.1)-se*ne,S+se*(S-.1)+Q*ne,fe],[g+Q*.15-se*ne,S+se*.15+Q*ne,fe],_,E)}c.setSpin()},p=(g,S,I,P,_,m,R)=>{const A=Math.floor(R*50)*2;c.quad([g,I,_],[S,I,_],[S,P,_],[g,P,_],O(a.amberC,m),Le,[[A,0],[A+1,0],[A+1,1],[A,1]])},C=(g,S,I,P,_,m,R=8)=>n.lathe([0,I,0],"x",[[0,g],[P,g],[P,S],[0,S]],R,m,we,-_,_);t(0),h();const L=2.55,T=1.02;n.lathe([0,L,0],"x",[[0,-10.7],[T,-10.7],[T,-3],[T+.07,-3],[T+.07,-1.25],[.96,-1.19],[.62,-1.02],[0,-.95]],20,l,E);for(const g of[-9.2,-7.6,-6,-4.4,-3.05])n.lathe([0,L,0],"x",[[T+.025,g-.05],[T+.035,g],[T+.025,g+.05]],20,i,j);n.lathe([0,L,0],"x",[[.84,-1.13],[.87,-1.1],[.84,-1.07]],20,i,j),n.lathe([0,L,0],"x",[[0,-.97],[.13,-.97],[.1,-.86],[0,-.84]],8,i,j),n.box(-12.7,-.45,1.16,1.3,-1.4,1.4,b,E,"fkrltb"),n.box(-10.7,-8.5,1.3,2.5,-1.05,1.05,l,E,"fkrl"),n.box(-10.5,-8.7,.45,1.16,-.72,.72,[1,.42,.1],qe,"fkrlb"),n.box(-8.5,-1.6,.55,1.16,-.6,.6,l,E,"fkb"),n.box(-.5,-.2,.8,1.42,-1.38,1.38,f,E,"fkrltb");{const g=[1.45,.12,0],S=[.95,1.05,0];for(const I of[1,-1]){const P=[-.2,.12,1.5*I],_=[-.2,1.05,1.42*I];I>0?n.quad(g,S,_,P,f,we):n.quad(g,P,_,S,f,we)}n.tri(S,[-.2,1.05,-1.42],[-.2,1.05,1.42],u,we)}s&&await s();const k=-2.05;n.lathe([k,0,0],"y",[[.5,3.42],[.34,3.62],[.3,4.05]],12,l,E),n.lathe([k,0,0],"y",[[.3,4.05],[.4,4.24],[.43,4.34],[.33,4.36],[.3,4.2]],12,i,j);const y=(g,S,I,P,_)=>n.lathe([g,0,0],"y",[[S*1.15,L+T-.1],[S,L+T+.05],[S,L+T+I*.5],[S*.86,L+T+I*.78],[S*.5,L+T+I*.96],[0,L+T+I]],12,P,_),X=a.domeFirst?-4:-6.4,B=a.domeFirst?-6.4:-4;y(X,.5,.72,i,j),y(B,.4,.5,l,E);for(const g of[-.2,.2])n.lathe([-8.9,0,g],"y",[[.09,3.5],[.09,3.95],[.12,4],[0,4.02]],6,i,j);if(n.lathe([-10,0,.45],"y",[[.05,3.5],[.05,3.85],[.1,3.9],[.1,4.05],[0,4.08]],6,i,j),n.lathe([0,3.98,0],"x",[[0,-1.5],[.2,-1.5],[.27,-1],[.3,-.92]],12,l,E),n.lathe([0,3.98,0],"x",[[.28,-.93],[0,-.9]],12,[1,.86,.6],Ke),n.box(-1.4,-1,3.6,3.75,-.15,.15,l,E,"fkrl"),a.deflectors)for(const g of[1.3,-1.3])n.quad([-3.05,1.3,g],[-1.35,1.3,g],[-1.55,2.7,g],[-3.05,3.25,g],b,E),n.quad([-3.05,3.19,g*1.02],[-1.55,2.64,g*1.02],[-1.55,2.7,g*1.02],[-3.05,3.25,g*1.02],i,j);s&&await s(),n.box(-12.9,-10.7,1.3,3.32,-1.42,1.42,f,E,"fkrl"),n.box(-12.95,-10.65,1.3,1.42,-1.45,1.45,i,j,"fkrl"),C(-13.25,-10.5,1.83,2.02,.8,b),n.quad([-12.92,1.5,-1],[-12.92,1.5,1],[-12.92,3.1,1],[-12.92,3.1,-1],[1,.45,.12],qe);for(const g of[-.95,.95])n.quad([-10.68,2.75,g+.3],[-10.68,2.75,g-.3],[-10.68,3.2,g-.3],[-10.68,3.2,g+.3],O(a.amberC,1.2),Le,[[4,0],[5,0],[5,1],[4,1]]);p(-12.35,-11.2,2.35,3.15,1.435,1.5,.13),c.box(-12.5,-11.05,2.24,2.3,1.42,1.47,i,j,"ftb"),c.box(-12.5,-11.05,3.2,3.26,1.42,1.47,i,j,"ftb"),c.box(-12.6,-.5,.98,1.16,1.36,1.41,f,E,"fb"),c.box(-9.4,-1.5,2.98,3.03,1,1.05,i,j,"ft"),c.lathe([0,.98,1.1],"x",[[0,-3.5],[.4,-3.5],[.44,-3.42],[.44,-2],[.4,-1.92],[0,-1.92]],12,l,E),c.lathe([0,.98,1.1],"x",[[.2,-1.92],[.2,-1.84],[0,-1.82]],8,i,j),c.box(-5.2,-3.5,1.28,1.36,1.02,1.18,o,j,"ftb");const q=a.drivers===4?[-4.9,-6.55,-8.2,-9.85]:[-5.4,-7.45,-9.5];s&&await s();for(const g of q)r(g,ye,.9,14,f,22);s&&await s();for(const g of[-1.55,-2.85])r(g,.46,.88,8,f,14);r(-11.6,.6,.88,10,f,14),c.setSpin(0,0,1,2),c.box(q[q.length-1]-.2,q[0]+.2,ye-.08,ye+.08,.95,1.01,o,j,"ftbrl");for(const g of q)c.box(g-.13,g+.13,ye-.13,ye+.13,1.01,1.06,i,j,"ftbrl");{const g=q[1],S=-4.2,I=1.07,P=1.12,_=ye,m=(se,ne,fe,Pe)=>(c.setSpin(0,0,Pe,4),c.vert(se,ne,fe,0,0,1,se,ne,o,j)),R=m(g,_-.07,P,1),A=m(S,_-.06,P,0),H=m(S,_+.06,P,0),Q=m(g,_+.07,P,1);c.i.push(R,A,H,R,H,Q),c.setSpin(0,0,0,4),c.box(S-.25,S+.2,_-.16,_+.16,I,P+.03,o,j,"ftbrl"),c.box(S,-3.5,_-.035,_+.035,1.07,1.12,o,j,"ftb")}s&&await s(),h(),await x(),s&&await s();for(let g=0;g<n.nv;g++)n.p[g*3]*=de,n.p[g*3+1]*=de,n.p[g*3+2]*=de,n.sp[g*4]*=de,n.sp[g*4+1]*=de,n.sp[g*4+3]>.5&&n.sp[g*4+3]<1.5&&(n.sp[g*4+2]*=de);s&&await s();let N=null,D=null;if(a.plough){t(.55),h();const g=2,S=1.72,I=6.9,P=8.3;n.box(.1,I,.7,1.1,-1.25,1.25,l,E,"fkrlb"),n.box(0,I,1.1,3.55,-1.5,1.5,f,E,"fkrl"),n.box(-.05,I+.05,1.1,1.3,-1.54,1.54,i,j,"fkrl"),C(-.2,I+.1,2,2.1,.8,b),n.box(.5,2.9,3.6,4.5,-.95,.95,f,E,"fkrl"),C(.35,3.05,3.55,1.5,.72,b,6),n.quad([2.91,3.95,.75],[2.91,3.95,-.75],[2.91,4.4,-.75],[2.91,4.4,.75],O(a.amberC,1.3),Le,[[20,0],[21,0],[21,1],[20,1]]),n.lathe([4.6,0,0],"y",[[.26,3.9],[.2,4.5],[.27,4.62],[.2,4.64]],10,l,E),n.lathe([0,g,0],"x",[[0,I-.1],[S,I-.1],[S,P-.5],[S+.16,P],[S+.06,P+.03],[S-.1,P-.45]],22,b,E),n.lathe([0,g,0],"x",[[S+.17,P-.03],[S+.2,P+.02],[S+.1,P+.06]],22,i,j),n.lathe([0,g,0],"x",[[S-.1,P-.5],[0,P-.5]],22,O(l,.45),E),n.setSpin(0,g,0,10);for(let _=0;_<10;_++){const m=_/10*6.2832,R=Math.cos(m),A=Math.sin(m),H=.34,Q=S-.2,se=.16,ne=.5,fe=_%2?f:o,Pe=(Xe,Re,Ye)=>[P-.2+Ye,g+R*Xe-A*Re,A*Xe+R*Re];n.quad(Pe(H,-se,-.22),Pe(Q,-ne,-.22),Pe(Q,ne,.04),Pe(H,se,.04),fe,j)}n.lathe([0,g,0],"x",[[.46,P-.46],[.36,P-.1],[.14,P+.06],[0,P+.08]],12,i,j),h();{const _=I+.25,m=P-.35,R=[[3.55,-.62],[4.3,-.6],[4.82,-.2],[5,.5]];for(let A=0;A<R.length-1;A++){const[H,Q]=R[A],[se,ne]=R[A+1];n.quad([_,H,Q],[m,H,Q],[m,se,ne],[_,se,ne],f,we);for(const fe of[_,m])n.tri([fe,H,Q],[fe,se,ne],[fe,3.55,.62],u,we)}n.box(m-.5,m-.2,5,5.28,-.16,.16,l,E,"fkrlt"),n.lathe([0,5.42,0],"x",[[0,m-.75],[.2,m-.75],[.27,m-.2],[.3,m-.12]],12,l,E),n.lathe([0,5.42,0],"x",[[.28,m-.13],[0,m-.1]],12,[1,.86,.6],Ke),N=[.55+m-.05,5.42,0],D=[.55+P-.3,5,.3]}p(.5,1.5,2.2,3.05,1.512,1.3,.31),p(1.9,2.9,2.2,3.05,1.512,1.2,.57),p(.8,2.6,3.9,4.35,.962,1.1,.77),c.box(3.4,I-.3,1.5,3.3,1.5,1.515,u,E,"f");for(const _ of[1.48,3.3])c.box(3.4,I-.3,_,_+.05,1.515,1.53,i,j,"f");c.quad([P-.7,.22,S-.12],[P+.35,.22,S+.5],[P+.35,2.5,S+.5],[P-.7,2.5,S-.12],f,we),c.quad([P-.7,2.5,S-.12],[P+.35,2.5,S+.5],[P+.35,2.58,S+.5],[P-.7,2.58,S-.12],i,j);for(const _ of[1.2,2.4,4.7,5.9])r(_,.5,.92,8,f,14);c.box(.6,6.5,.4,.72,1,1.12,b,E,"ftb"),await x(),v.push([N[0]+.1,N[1],0,[1,.85,.6],5.2]),s&&await s()}const Z=-13.5*de-.4;t(Z),n.box(-6.45,-.05,.72,1.16,-1.3,1.3,l,E,"fkrlb"),n.box(-6.5,0,1.16,3,-1.4,1.4,f,E,"fkrl"),n.box(-6.55,.05,2.94,3.08,-1.45,1.45,b,E,"fkrlt");for(const[g,S,I,P]of[[-6.1,-.4,1.45,1.5],[-6.1,-.4,2.6,2.65],[-6.1,-6.05,1.45,2.65],[-.45,-.4,1.45,2.65]])c.box(g,S,I,P,1.4,1.415,i,j,"f");{const I=[];for(let P=0;P<=7;P++)for(let _=0;_<=4;_++){const m=Math.min(P,7-P,_,4-_)>0?1:0,R=-6.2+5.9*P/7,A=-1.25+2.5*_/4;I.push(n.vert(R,3.05+m*(.25+.5*e()),A,(e()-.5)*.9,.8,(e()-.5)*.9,R,A,O(l,.6+e()),Je))}for(let P=0;P<7;P++)for(let _=0;_<4;_++){const m=I[P*5+_],R=I[P*5+_+1],A=I[(P+1)*5+_+1],H=I[(P+1)*5+_];n.i.push(m,R,A,m,A,H)}}for(const g of[-1.2,-3.25,-5.3])r(g,.52,.9,8,f,14);c.box(-6.2,-.3,.5,.72,.98,1.1,b,E,"ftb"),await x(),s&&await s();const $=Z-6.5,K=13.6,ee=.8,w=$-ee;for(let g=0;g<a.carriages;g++){const S=w-g*(K+ee);t(S);const I=a.creamBand?d:O(f,.85),P=1.42;n.box(-K+.1,-.1,.8,1.16,-1.3,1.3,l,E,"fkrlb"),n.box(-K,0,1.16,3.46,-P,P,u,E,"rl"),n.box(0,ee,1.25,3.2,-.6,.6,l,E,"fkt"),c.box(-K,0,1.16,2.02,P-.01,P,f,E,"f"),c.box(-K,0,2.02,3.02,P-.01,P,I,E,"f"),c.box(-K,0,3.02,3.46,P-.01,P,f,E,"f");for(const A of[1.98,3.02])c.box(-K,0,A,A+.05,P,P+.012,i,j,"f");c.box(-K+.2,-.2,1.2,1.25,P,P+.012,i,j,"f");const _=9,m=-1.75,R=(K-3.5)/_;for(let A=0;A<_;A++){const H=m-A*R,Q=e()<.9?.75+.6*e():.06;p(H-R+.28,H,2.12,2.94,P+.006,Q,e())}for(const A of[-.95,-K+.95])c.box(A-.42,A+.42,1.2,3.1,P,P+.015,O(f,.7),E,"f"),p(A-.26,A+.26,2.2,2.9,P+.02,.5+.4*e(),e()),c.box(A+.28,A+.33,1.9,2.1,P+.015,P+.05,i,j,"f");C(-K-.12,.12,2,2.05,.775,b),n.box(-K+1.1,-1.1,3.9,4.22,-.55,.55,b,we,"fkrl"),C(-K+.9,-.9,2.82,1.5,.42,b,4);for(let A=0;A<11;A++){const H=-1.5-A*((K-3)/11);c.quad([H-.7,3.98,.556],[H,3.98,.556],[H,4.16,.556],[H-.7,4.16,.556],O(a.amberC,.5),Le,[[8,.4],[9,.4],[9,.6],[8,.6]])}for(const A of[-2.5,-K+2.5])c.box(A-1.55,A+1.55,.36,.7,.98,1.12,b,E,"ftbrl"),r(A-.95,.46,.9,0,b,12),r(A+.95,.46,.9,0,b,12);if(c.box(-K/2-1.7,-K/2+1.7,.3,.8,.7,1.15,l,E,"frlb"),g===a.carriages-1){for(const A of[-.95,.95])n.box(-K-.12,-K,1.45,1.75,A-.15,A+.15,[1,.08,.05],Ke,"fklbt"),v.push([S-K-.2,1.6,A,[1,.1,.06],2.2]);n.quad([-K-.01,2.1,.5],[-K-.01,2.1,-.5],[-K-.01,2.9,-.5],[-K-.01,2.9,.5],O(a.amberC,.9),Le,[[12,0],[13,0],[13,1],[12,1]])}await x(),s&&await s()}t(0);const z=-(w-a.carriages*(K+ee))-ee,F=de,V=g=>g.map(S=>S*F);v.push([-.75*F,3.98*F,0,[1,.85,.6],4.6],[-9.6*F,.7*F,0,[1,.4,.1],8.5],[-12.2*F,2.4*F,0,[1,.5,.16],5]);const J=await n.buildAsync(s);return s&&await s(),{geo:J,tris:n.i.length/3,length:z,glows:v,plough:D,lead:a.plough?9.5:0,chimney:V([k,4.4,0]),headlamp:N||V([-.85,3.98,0]),firebox:V([-9.6,.9,0]),whistle:V([-10,4.1,.45]),cyl:V([-2,.9,1.5]),carEnd:w}}const ae=a=>Number(a).toFixed(4),Te=`
uniform float uTime, uHeadX, uTrainLen, uTrainS, uCarStart, uFireOff, uLampK, uTrainK;
uniform vec3 uSky, uGround, uRim, uRimDir, uWarm, uFire, uLampOff; uniform vec2 uPier;
const float PITCH = ${ae(te)}, LAMPY = ${ae(xe)}, LAMPZ = ${ae(Ee)}, RAILY = ${ae(pe)}, XCLIP = ${ae(W-.5)}, KEYY = ${ae(He)}, KEYZ = ${ae(Ue)};
float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash21(i), hash21(i+vec2(1,0)), f.x), mix(hash21(i+vec2(0,1)), hash21(i+vec2(1,1)), f.x), f.y); }
float fbm(vec2 p){ float a = .5, s = 0.; for (int i = 0; i < 4; i++){ s += a*vnoise(p); p = p*2.03 + vec2(17.1, 9.2); a *= .5; } return s; }
float wrapNL(vec3 n, vec3 L, float d2, float wrap){ return max((dot(n, L*inversesqrt(d2 + 1e-4)) + wrap) / (1. + wrap), 0.); }
// warm light of the parapet lanterns (one over every pier, both sides)
vec3 lampLight(vec3 p, vec3 n, float wrap){
  float px = clamp((floor(p.x/PITCH) + .5)*PITCH, -3.5*PITCH, 3.5*PITCH);
  vec3 L = vec3(px, LAMPY, (p.z >= 0. ? 1. : -1.)*LAMPZ) - p; float d2 = dot(L, L);
  float fl = .9 + .1*sin(uTime*9. + px*1.7)*sin(uTime*5.3 + px), sz = p.z >= 0. ? 1. : -1.;
  float acc = fl * wrapNL(n, L, d2, wrap) / (1. + d2*.06);
  float under = 1. - smoothstep(59.5, 62.5, p.y);                       // the lanterns under the keystones and on the piers light nothing above the deck
  float kx = clamp(floor(p.x/PITCH + .5)*PITCH, -3.*PITCH, 3.*PITCH);
  vec3 L2 = vec3(kx, KEYY, sz*KEYZ) - p; float e2 = dot(L2, L2);
  acc += under * .78 * (.92 + .08*sin(uTime*7.3 + kx)) * wrapNL(n, L2, e2, wrap) / (1. + e2*.07);
  vec3 L3 = vec3(px, uPier.x, sz*uPier.y) - p; float e3 = dot(L3, L3);
  acc += under * .8 * wrapNL(n, L3, e3, wrap) / (1. + e3*.08);
  return uWarm * (uLampK * acc);
}
// warm light of the moving train: a line of lit windows plus the firebox
vec3 trainLight(vec3 p, vec3 n, float wrap){
  vec3 acc = vec3(0.);
  float x1 = min(uHeadX - uCarStart, XCLIP), x0 = max(uHeadX - uTrainLen, -XCLIP);
  if (x1 > x0){
    vec3 L = vec3(clamp(p.x, x0, x1), RAILY + 2.5*uTrainS, clamp(p.z, -1.9, 1.9)) - p; float d2 = dot(L, L);
    float rh = .8 + .2*sin((p.x - uHeadX)*3.6);
    acc += uWarm * (.95 * rh * wrapNL(n, L, d2, wrap) / (1. + d2*.08));
  }
  float fx = uHeadX - uFireOff;
  if (abs(fx) < XCLIP){
    vec3 L = vec3(fx, RAILY + 1.0, 0.) - p; float d2 = dot(L, L);
    float fl = .8 + .2*sin(uTime*13.)*sin(uTime*7.1 + 1.);
    acc += uFire * (2.4 * fl * wrapNL(n, L, d2, wrap) / (1. + d2*.03));
  }
  return acc * uTrainK;
}
// headlamp cone along +X
float headCone(vec3 p){
  vec3 d = p - vec3(uHeadX - uLampOff.x, RAILY + uLampOff.y, 0.);
  if (d.x < 0. || abs(uHeadX) > XCLIP + 2.) return 0.;
  float cr = .5 + d.x*.07;
  return (1. - smoothstep(cr*.1, cr, length(d.yz))) * exp(-d.x*.04) * uTrainK;
}
vec3 ambient(vec3 n){ return mix(uGround, uSky, n.y*.5 + .5) + uRim * max(dot(n, uRimDir), 0.); }
// the low key light skimming a surface seen against it: soffits, pier arrises and snow caps catch a warm edge
vec3 skim(vec3 n, vec3 v){ float g = 1. - abs(dot(n, v)); return uRim * (g*g*g * smoothstep(.15, .9, dot(v, uRimDir)) * .55); }
`,it=`
attribute float aMat; uniform float uWirePx;
varying vec3 vPos, vNor, vCol, vWV; varying vec2 vUv; varying float vMat;
#include <fog_pars_vertex>
void main(){
  vPos = position; vNor = normal; vCol = color; vUv = uv; vMat = aMat;
  vec4 wp = modelMatrix * vec4(position, 1.); vWV = wp.xyz - cameraPosition;
  float wk = aMat - 4.;                                    // telegraph wires: +-.25 marks the ribbon's two edges
  if (abs(abs(wk) - .25) < .05) wp.y += sign(wk) * max(0., length(vWV) * uWirePx - .035);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,rt=`
varying vec3 vPos, vNor, vCol, vWV; varying vec2 vUv; varying float vMat;
uniform vec3 uSnowCol, uRockCol;
#include <fog_pars_fragment>
${Te}
void main(){
  vec3 n = normalize(vNor); float m = floor(vMat + .5);
  vec3 alb = vCol; vec3 emis = vec3(0.), bulk = vec3(0.); float sheen = 0.; float snow = 0.; float wrap = .35;
  float big = fbm(vPos.xy*.06 + vPos.z*.11), fwY = fwidth(vPos.y);
  if (m < .5 || abs(m - 6.) < .5 || m > 8.5){            // ashlar masonry / voussoirs / the soffits (the same ashlar, lining the barrels)
    float bh = .85, bw = 1.9, hs = 0.; vec2 q; float edge;
    if (m > 5. && m < 7.){ q = vec2(vUv.x/.95, 0.); float f = fract(q.x); edge = min(f, 1. - f)*.95; }
    else { float row = floor(vUv.y/bh); q = vec2((vUv.x + fract(row*.5)*bw + hash21(vec2(row, 3.))*.6)/bw, vUv.y/bh);
      vec2 f = fract(q); edge = min(min(f.x, 1. - f.x)*bw, min(f.y, 1. - f.y)*bh);
      float cut = .36 + .28*hash21(floor(q) + 37.);                // about one stone in three is two shorter ones: never a wall of evenly sized blocks
      if (hash21(floor(q) + 31.) > .66){ edge = min(edge, abs(f.x - cut)*bw); hs = step(cut, f.x)*.37 + .11; } }
    vec2 id = floor(q) + vec2(hs, 0.); float lod = clamp(1. - fwidth(vUv.y)*1.6, 0., 1.);
    float mort = (1. - smoothstep(.02, .08, edge)) * lod;
    float t = hash21(id + 11.), t2 = hash21(id + 5.);
    alb *= (.74 + .5*t) * mix(vec3(1.), vec3(1.08, .98, .9), t2*.6);          // block to block variation
    alb *= mix(.72, 1.12, vnoise(vec2(vPos.x*.9 + vPos.z*.7, vPos.y*.05)));   // drip streaks
    alb *= .8 + .4*fbm(vUv*1.7);
    alb *= 1. - .5*mort;
    // close to, every block is a pillowed stone: a lit upper arris, a shadowed lower joint, pits, damp stains
    float nearK = lod * (1. - smoothstep(26., 85., length(vWV)));
    if (m < .5 || m > 8.5){ float fb = fract(q.y); alb *= 1. + nearK * (.2*smoothstep(.8, .97, fb) - .3*(1. - smoothstep(.03, .2, fb))); }
    else alb *= 1. - .3*nearK*(1. - smoothstep(0., .3, vUv.y));
    alb *= 1. - nearK * .3 * smoothstep(.55, .85, vnoise(vUv*6.3 + id*3.7));
    alb = mix(alb, alb * vec3(.7, .8, .96), nearK * .55 * smoothstep(.42, .72, fbm(vUv*.33 + 7.)));
    // no wall of one tone: here and there a paler replaced stone or a dark old one, warmer and cooler blocks
    { float t3 = hash21(id + 23.); alb *= 1. + (.3 + .2*nearK)*step(.88, t3) - (.28 + .12*nearK)*step(t3, .12); alb *= mix(vec3(1.), t3 > .5 ? vec3(1.12, .97, .86) : vec3(.88, .97, 1.12), abs(t3 - .5) * (1. + nearK));
      alb *= 1. + nearK * (.44*(t - .5) + .2*(t2 - .5)); }                // close to, the stones differ more
    float strSnow = 0., iceK = 0.;
    if (m < .5 && abs(n.z) > .7){                          // the two faces of the viaduct
      float lodF = clamp(1. - fwY*3., 0., 1.);
      // a string course half way up the spandrels: long pale stones, a shadow under it, snow lying on it
      float ys = vPos.y - 51.4, band = step(0., ys) * step(ys, .62), jf = fract(vPos.x/3.1 + .3);
      float jb = 1. - smoothstep(.02, .07, min(jf, 1. - jf)*3.1);
      alb = mix(alb, vCol * (1.04 + .2*hash21(vec2(floor(vPos.x/3.1 + .3), 7.))) * (1. - .45*jb*lodF) * (.86 + .28*smoothstep(.1, .55, ys)), band);
      alb *= 1. - .4 * (1. - smoothstep(0., .5, -ys)) * step(ys, 0.) * lodF;
      strSnow = band * smoothstep(.47, .56, ys + .05*vnoise(vec2(vPos.x*1.3, 2.))) * .9;
      // damp running down from the course and from the ledge under the parapet, in streaks; soot in a long band under the ledge
      float dr = max((1. - smoothstep(0., 3.6, -ys)) * step(ys, 0.), 1. - smoothstep(0., 5., 61.4 - vPos.y));
      alb *= 1. - .36 * dr * smoothstep(.4, .78, vnoise(vec2(vPos.x*.8, vPos.y*.05 + 2.)));
      alb *= 1. - .22 * smoothstep(.5, .8, vnoise(vec2(vPos.x*.035 + 4., vPos.y*.3)));
      // close to: rime lying in long level bands across the courses, and soot hanging in a curtain over every crown
      float nearF = 1. - smoothstep(40., 120., length(vWV)), xc = mod(vPos.x + ${(te/2).toFixed(2)}, ${te.toFixed(1)}) - ${(te/2).toFixed(2)};
      strSnow = max(strSnow, nearF * lodF * .46 * smoothstep(.56, .8, vnoise(vec2(vPos.x*.1 + 9., vPos.y*.6))*.72 + vnoise(vec2(vPos.x*.8, vPos.y*2.1))*.28));
      alb *= 1. - .42 * nearF * (1. - smoothstep(2., 10., abs(xc))) * smoothstep(57.2, 59.6, vPos.y) * (1. - smoothstep(60.2, 65.5, vPos.y)) * (.45 + .55*vnoise(vec2(vPos.x*1.2, vPos.y*.22)));
      // weep holes in the course below it, a tongue of ice hanging from most of them
      float wy = vPos.y - 47.3, wc = floor(vPos.x/6.8 + .15), wx = (fract(vPos.x/6.8 + .15) - .5)*6.8, wh = hash21(vec2(wc, 41.));
      if (wh > .3){
        alb = mix(alb, vec3(.012), (1. - smoothstep(.08, .12, max(abs(wx), abs(wy)))) * lodF);
        float len = 1.1 + 3.4*hash21(vec2(wc, 17.)), k = clamp(1. + wy/len, 0., 1.), w = .045 + .15*k;
        iceK = (1. - smoothstep(w*.6, w, abs(wx + .04*sin(wy*4. + wc)))) * step(wy, -.07) * smoothstep(0., .22, k) * step(.45, wh) * lodF;
      }
      // on the two piers of the central arch an iron inspection ladder up the pilaster, and a bulkhead lamp at its head throwing its pool on the stone
      float lx = abs(vPos.x) - ${(te/2).toFixed(2)}, lodL = clamp(1. - fwY*7., 0., 1.);
      if (abs(lx) < 6.){
        vec2 dl = vec2(lx - .95, vPos.y - 59.6); float d2 = dot(dl, dl);
        bulk = uWarm * (1.5 * exp(-d2*.2) * (.92 + .08*sin(uTime*6.1 + vPos.x)));
        emis += uWarm * 7. * (1. - smoothstep(.02, .045, d2));
        float inY = step(42.4, vPos.y) * step(vPos.y, 60.3);
        float rail = 1. - smoothstep(.03, .065, abs(abs(lx) - .27));
        float rung = (1. - smoothstep(.025, .055, abs(fract(vPos.y/.36) - .5)*.36)) * step(abs(lx), .27);
        float lad = max(rail, rung) * inY * lodL;
        float shd = (1. - smoothstep(.03, .09, abs(abs(lx + .1) - .27))) * inY * lodL * exp(-d2*.03);      // the rails' shadow in the lamp's light
        alb *= 1. - .45*shd; alb = mix(alb, vec3(.035, .035, .045), lad);
      }
    } else if (m > 8.5){                                   // the barrels: soot in long bands along the arc, rime toward both rims
      alb *= 1. - .3 * smoothstep(.45, .8, vnoise(vec2(vUv.x*.3 + 5., vUv.y*.05)));
      strSnow = .34 * smoothstep(2.6, 4.4, abs(vPos.z)) * smoothstep(.35, .7, vnoise(vUv*vec2(.5, .16) + 21.));
    }
    // wind-plastered snow: patches, course ledges and frost toward the top
    float fy = fract(vUv.y/bh);
    float fr = smoothstep(.46, .8, big + .08*vnoise(vUv*2.3) + smoothstep(20., 66., vPos.y)*.12) * .42;
    fr = max(fr, (m < .5 ? smoothstep(.8, .97, fy) : 0.) * lod * smoothstep(.35, .6, vnoise(vUv*vec2(.6, .2) + 3.)) * .55);
    fr = max(fr, mort * nearK * .6 * smoothstep(.3, .65, vnoise(vUv*.8 + 13.)));      // rime packed into the joints
    snow = max(max(fr * (.4 + .6*smoothstep(-.6, .2, n.y)), strSnow), smoothstep(.3, .62, n.y + (vnoise(vPos.xz*1.3) - .5)*.2));
    alb = mix(alb, vec3(.5, .64, .84), iceK*.85); sheen = iceK*.8; snow *= 1. - iceK;
  } else if (m < 1.5){ snow = 1.; }
  else if (m < 2.5){ alb = vec3(.42, .56, .74)*vCol; sheen = .9; wrap = 1.; }          // ice
  else if (m < 3.5){                                                                   // crag rock
    float st = fbm(vec2(vPos.y*.33 + fbm(vPos.xz*.05)*4., (vPos.x + vPos.z)*.045));
    alb = uRockCol * vCol * (.62 + .6*st) * (.75 + .5*vnoise(vec2(vPos.x*.5 + vPos.z*.4, vPos.y*.07)));
    snow = smoothstep(.36, .64, n.y + (fbm(vPos.xz*.16) - .5)*.55 + (st - .5)*.25);
  } else if (m < 4.5){ sheen = .5; snow = smoothstep(.6, .9, n.y)*.8; }
  else if (m < 5.5){ emis = vCol * (4.6 + .5*sin(uTime*8. + vPos.x)); alb = vec3(0.); }
  else if (m < 7.5){ alb = vec3(.002); }
  else {                                                                               // deck: snow, sleepers, ballast
    float az = abs(vPos.z), tr = 1. - smoothstep(1.3, 1.9, az);
    float sl = smoothstep(.3, .42, abs(fract(vPos.x/.78) - .5));
    alb = mix(vec3(.75), vec3(.07, .065, .07), tr * (.35 + .4*sl) * (.6 + .4*vnoise(vPos.xz*3.)));
    snow = 1. - tr*(.5 + .4*sl);
  }
  vec3 snowAlb = uSnowCol * (.86 + .14*vnoise(vPos.xz*.8 + vPos.y*.6));
  alb = mix(alb, snowAlb, clamp(snow, 0., 1.));
  wrap = mix(wrap, .75, snow);
  vec3 v = normalize(vWV);
  vec3 light = ambient(n) + skim(n, v) * (1. + 1.5*snow);
  vec3 lmp = lampLight(vPos, n, .7), trn = trainLight(vPos, n, 1.2);
  light += lmp + trn + bulk + (m > 8.5 ? lmp*.5 : vec3(0.));      // the barrels hold the keystone lanterns' light
  light += vec3(1., .9, .7) * headCone(vPos) * (max(-n.x, 0.)*2. + .35) * .9;
  vec3 col = alb * light + emis;
  float fres = pow(1. - max(dot(-v, n), 0.), 3.);
  col += fres * sheen * (uSky*.5 + lmp*.6 + uRim*.5*smoothstep(0., .8, dot(v, uRimDir)));
  // sparkle on snow close to the lamps
  float sp = step(.992, hash21(floor(vPos.xz*9.) + floor(vPos.y*9.))) * snow;
  col += sp * (lmp + trn) * 1.5;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,lt=`
attribute float aMat; attribute vec4 aSpin;
uniform float uTravel, uHeadX, uTrainS, uTime;
varying vec3 vPos, vLoc, vNor, vCol, vWV; varying vec2 vUv; varying float vMat;
#include <fog_pars_vertex>
void main(){
  vec3 p = position, n = normal; float mode = aSpin.w;
  if (mode > .5 && mode < 1.5){
    float a = -uTravel/aSpin.z, c = cos(a), s = sin(a); vec2 d = p.xy - aSpin.xy;
    p.xy = aSpin.xy + vec2(c*d.x - s*d.y, s*d.x + c*d.y); n.xy = vec2(c*n.x - s*n.y, s*n.x + c*n.y);
  } else if (mode > 9.5){
    float a = uTime*11., c = cos(a), s = sin(a); vec2 d = vec2(p.y - aSpin.y, p.z);
    p.y = aSpin.y + c*d.x - s*d.y; p.z = s*d.x + c*d.y; n.yz = vec2(c*n.y - s*n.z, s*n.y + c*n.z);
  } else if (mode > 1.5){
    float far = step(5., mode), mm = mode - 4.*far, a = -uTravel/${ae(ye*de)} + 1.5708*far;
    p.xy += ${ae(st*de)} * vec2(cos(a), sin(a) * (mm > 3. ? aSpin.z : 1.));
  }
  vPos = p; vNor = n; vCol = color; vUv = uv; vMat = aMat;
  vLoc = vec3(uHeadX, ${ae(pe)}, 0.) + p * uTrainS;
  vec4 wp = modelMatrix * vec4(p, 1.); vWV = wp.xyz - cameraPosition;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ct=`
varying vec3 vPos, vLoc, vNor, vCol, vWV; varying vec2 vUv; varying float vMat;
uniform vec3 uSnowCol;
#include <fog_pars_fragment>
${Te}
void main(){
  if (abs(vLoc.x) > XCLIP) discard;
  vec3 n = normalize(vNor); if (!gl_FrontFacing) n = -n;
  float m = floor(vMat + .5); vec3 v = normalize(vWV);
  vec3 alb = vCol, emis = vec3(0.); float gloss = .6, snow = 0.;
  if (m > .5 && m < 1.5){                                 // lit window: lamp glow, curtains, passengers
    float seed = floor(vUv.x*.5 + .01), u = vUv.x - seed*2., w = vUv.y;
    float h1 = hash21(vec2(seed, 7.)), h2 = hash21(vec2(seed, 19.));
    float g = .55 + .45*smoothstep(0., 1., w) ;
    float curt = 1. - smoothstep(.1, .22, min(u, 1. - u) * (.7 + w*1.2));
    vec2 hp = vec2(.3 + .4*h1, .2);
    float head = (1. - smoothstep(.1, .15, length((vec2(u, w) - hp)*vec2(1., .8)))) + (1. - smoothstep(.16, .2, abs(u - hp.x))) * step(w, .14);
    head *= step(.45, h2);
    vec3 c = vCol * g * mix(vec3(1.), vec3(.9, .3, .2), curt*.8) * (1. - .7*clamp(head, 0., 1.));
    float frame = smoothstep(.0, .05, min(min(u, 1. - u), min(w, 1. - w)*.6)) * (1. - .5*(1. - smoothstep(.0, .025, abs(u - .5))));
    emis = c * 5. * frame; alb = vec3(.01);
  } else if (m > 3.5 && m < 4.5){ emis = vCol * 9.; alb = vec3(0.); }
  else if (m > 4.5 && m < 5.5){ float fl = .65 + .35*vnoise(vec2(uTime*6., vPos.y*3. + vPos.z*2.)); emis = vCol * (3.4 + 4.6*fl); alb = vec3(0.); }
  else if (m > 1.5 && m < 2.5){ gloss = 1.4; }
  else if (m > 2.5 && m < 3.5){ gloss = .15; snow = smoothstep(.25, .6, n.y + (vnoise(vLoc.xz*.9) - .5)*.5); }
  else if (m > 5.5){ gloss = .6; snow = smoothstep(.55, .75, vnoise(vLoc.xz*2.5)) * .7; }
  else { snow = smoothstep(.75, .95, n.y) * .7; }
  alb = mix(alb, uSnowCol * .92, snow); gloss *= 1. - snow;
  vec3 light = ambient(n) + skim(n, v) + lampLight(vLoc, n, .3)*1.1;
  light += uWarm * (.1 + .2*max(-n.y, 0.)) * step(vPos.x, -uCarStart/uTrainS + 1.) * (1. - snow);      // the carriages' own window light spilling on their sides
  vec3 Lf = vec3(-uFireOff/uTrainS, 1.0, 0.) - vPos; float d2 = dot(Lf, Lf);
  light += uFire * (3.2 * wrapNL(n, Lf, d2, .6) / (1. + d2*.07)) * (.8 + .2*sin(uTime*13.));
  vec3 col = alb * light + emis;
  vec3 r = reflect(v, n); float fres = pow(1. - max(dot(-v, n), 0.), 4.);
  vec3 env = mix(uGround*.6, uSky, smoothstep(-.3, .5, r.y)) + uRim * pow(max(dot(r, uRimDir), 0.), 6.) * 3.;
  col += env * gloss * (.1 + .6*fres) * (m > 1.5 && m < 2.5 ? vCol*3. + .2 : vec3(1.));
  col += lampLight(vLoc, r, 0.) * gloss * .25;
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,Fe=`
float fogAmount(){
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      return 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      return smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #else
    return 0.;
  #endif
}`;function Ne(a){const e=new M.InstancedBufferGeometry;return e.setAttribute("position",new M.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),e.setIndex([0,1,2,0,2,3]),e.instanceCount=a,e.boundingSphere=new M.Sphere(new M.Vector3(0,50,0),400),e}function ft(a,e,s,n){const c=a.puffs,l=26,b=44,o=60,f=180,u=a.plough?900:0,i=c+l+b+o+f+u,d=new Float32Array(i*4);for(let h=0;h<i;h++){const r=h<c?0:h<c+l?1:h<c+l+b?2:h<c+l+b+o?3:h<c+l+b+o+f?4:5;d.set([r===0?(h+e()*.8)/c:e(),e(),e(),r],h*4)}const v=Ne(i);v.setAttribute("aSeed",new M.InstancedBufferAttribute(d,4));const x=new M.ShaderMaterial({uniforms:{...n,...s},fog:!0,transparent:!0,depthWrite:!1,blending:M.CustomBlending,blendSrc:M.OneFactor,blendDst:M.OneMinusSrcAlphaFactor,blendSrcAlpha:M.OneFactor,blendDstAlpha:M.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec4 aSeed;
      uniform float uTime, uHeadX, uTrainS, uTravelW, uPlumeLen, uWhistle, uTrainLen, uTrainK;
      uniform vec3 uChim, uWhis, uCyl, uLampOff; uniform vec4 uPlough; uniform vec2 uBlow;
      varying vec2 vQ, vOff; varying vec3 vK; varying float vSeed, vKind;
      #include <fog_pars_vertex>
      const float RAILY = ${ae(pe)}, XCLIP = ${ae(W-.5)}, XEND = ${ae(me)}, PARTOP = ${ae(ve)};
      void main(){
        float kind = aSeed.w, size, alpha; vec3 c; vec2 warm = vec2(0.);
        vec3 head = vec3(uHeadX, RAILY, 0.);
        if (kind < .5){
          float u = fract(aSeed.x + uTravelW/uPlumeLen + uTime*.012), d = u*uPlumeLen;
          float ex = uHeadX + uChim.x - d, spread = .45 + 6.5*pow(u, .75);
          float calm = 1. - clamp(length(uBlow)*.125, 0., 1.);
          float rise = 1.0 + (10. + 4.*calm)*(1. - exp(-d/24.)) + (5. + 15.*calm)*u + 2.2*calm*sin(ex*.085)*smoothstep(8., 40., d);      // still air: it towers in rolling heads
          c = vec3(ex + sin(aSeed.y*40. + uTime*.31)*spread*.5,
                   RAILY + uChim.y + rise + (aSeed.y - .5)*spread*1.15 + sin(uTime*.45 + aSeed.x*30.)*spread*.12,
                   (aSeed.z - .5)*spread*1.5 + sin(d*.045 + 1.3)*2.4*u - 7.*u*u + cos(uTime*.37 + aSeed.z*20.)*spread*.12);
          size = (1.05 + 9.5*pow(u, .7)) * (.7 + .6*aSeed.z);
          alpha = smoothstep(0., .012, u) * (1. - smoothstep(.4, 1., u)) * .72;
          alpha *= smoothstep(-XCLIP - 3., -XCLIP + 5., ex) * (1. - smoothstep(XCLIP - 4., XCLIP + 1., ex));
          warm = vec2(exp(-d/12.) * 1.5 + .4*exp(-d/38.) + .66*exp(-d/170.), (1. - smoothstep(uTrainLen*.8, uTrainLen*1.1, d)) * .42);      // the firebox lights the first 40 m from below, and the lit carriages under it carry the orange on along the whole plume
        } else if (kind < 1.5){
          float age = fract(aSeed.x + uTime*1.4);
          c = head + uWhis + vec3(-age*5.5 + (aSeed.y - .5)*age, age*7.5, (aSeed.z - .5)*age*2.2);
          size = .35 + 2.6*age; alpha = uWhistle * (1. - age) * .95 * step(abs(c.x), XCLIP);
        } else if (kind < 2.5){
          float sd = aSeed.y > .5 ? 1. : -1., age = fract(aSeed.x + uTime*.85);
          c = head + uCyl*vec3(1., 1., sd) + vec3(-age*7. + (aSeed.z - .5)*age*2., -.3 + age*age*2.6, sd*(.3 + age*6.));
          size = .45 + 3.6*age; alpha = (1. - age) * .5 * step(abs(c.x), XCLIP);
          warm = vec2(0., .5);
        } else if (kind < 3.5){
          float age = fract(aSeed.x + uTime*(.5 + .5*aSeed.y)), t = age*1.9;
          c = head + uChim + vec3(-t*(6. + 9.*aSeed.z) + sin(aSeed.y*50. + t*5.)*.5, .6 + t*(5. + 5.*aSeed.y) - t*t*2.5, (aSeed.z - .5)*t*4.5 + cos(aSeed.x*70. + t*4.)*.4);
          size = .11 + .12*aSeed.y; alpha = (1. - age)*(1. - age) * smoothstep(0., .04, age) * step(abs(c.x), XCLIP);
          warm = vec2(1., 0.);
        } else if (kind < 4.5){
          float sd = aSeed.y > .5 ? 1. : -1., age = fract(aSeed.x*13. + uTime*(.5 + .35*aSeed.z)), back = aSeed.x*(uTrainLen + 10.) - 5.;
          c = vec3(uHeadX - back + age*(5. + 7.*aSeed.z), PARTOP + .25 + age*(1.2 + 3.4*aSeed.z) + sin(age*9. + aSeed.x*40.)*.35*age, sd*(4.9 + age*(1.5 + 5.5*fract(aSeed.y*7.3))));
          size = .55 + 3.6*age; alpha = smoothstep(0., .12, age) * (1. - age) * .4 * step(abs(c.x), XEND + 4.);
          warm = vec2(.2*exp(-max(back, 0.)/18.), .45);
        } else {
          float age = fract(aSeed.x + uTime*.5), t = age*2.3;
          vec3 v0 = vec3(9. + 6.*aSeed.y, 2.6 + 2.6*aSeed.z, 7. + 6.*fract(aSeed.y*9.7));      // thrown out and forward over the parapet, to fall away below the deck
          c = head + uPlough.xyz + v0*t + vec3(0., -4.9*t*t, 0.) + vec3(sin(aSeed.z*30. + t), cos(aSeed.y*40. + t), sin(aSeed.x*50.))*.4*t;
          size = .07 + .17*age + .11*age*aSeed.z; alpha = uPlough.w * smoothstep(0., .04, age) * pow(1. - age, .7) * .8 * step(abs(head.x + uPlough.x), XCLIP);
          vec3 dc = c - vec3(uHeadX - uLampOff.x, RAILY + uLampOff.y, 0.); float crn = .5 + max(dc.x, 0.)*.07;      // it flies through the headlamp's beam
          warm = vec2(0., .7*exp(-t*1.6) + 1.6*step(0., dc.x)*(1. - smoothstep(crn*.1, crn, length(dc.yz)))*exp(-max(dc.x, 0.)*.04));
        }
        alpha *= uTrainK;
        float a = aSeed.z*6.283 + uTime*(aSeed.y - .5)*.25, cs = cos(a), sn = sin(a);
        vQ = position.xy; vOff = vec2(cs*position.x - sn*position.y, sn*position.x + cs*position.y);
        vK = vec3(alpha, warm); vSeed = aSeed.x*91. + aSeed.y*13.; vKind = kind;
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.);
        if (kind > 4.5){                                         // a grain of thrown snow: a streak along its flight
          float tp = fract(aSeed.x + uTime*.5)*2.3;
          vec3 vel = vec3(9. + 6.*aSeed.y, 2.6 + 2.6*aSeed.z - 9.8*tp, 7. + 6.*fract(aSeed.y*9.7));
          vec2 ax = normalize((modelViewMatrix * vec4(vel, 0.)).xy + vec2(1e-4, 0.));
          vOff = position.xy; mvPosition.xy += (ax*position.x*2.5 + vec2(-ax.y, ax.x)*position.y) * size;
        } else mvPosition.xy += vOff * size;
        gl_Position = alpha > .002 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vQ, vOff; varying vec3 vK; varying float vSeed, vKind;
      #include <fog_pars_fragment>
      ${Te}
      ${Fe}
      void main(){
        float r = length(vQ);
        if (vKind > 2.5 && vKind < 3.5){                       // a spark: additive (premultiplied with no coverage)
          if (r > 1.) discard;
          float g = exp(-r*r*5.) * vK.x * (1. - fogAmount());
          gl_FragColor = vec4(mix(uFire, vec3(1., .75, .35), g) * g * 9., 0.); return;
        }
        float nz = fbm(vQ*1.7 + vSeed + vec2(0., -uTime*.06));
        float a = (1. - smoothstep(.25, 1., r + (nz - .5)*1.0)) * vK.x;
        if (vKind > 4.5) a = (1. - smoothstep(.15, 1., r)) * vK.x * (.32 + .95*smoothstep(.4, .55, nz));       // thrown snow is a grainy spray, not a puff
        if (a < .004) discard;
        float up = clamp(vOff.y*.55 + .5 + (nz - .5)*.5, 0., 1.), snowy = step(3.5, vKind);
        vec3 col = mix(uGround*.8, uSky*1.15 + uRim*.13, up) * (.7 + .6*nz) * (1. - .6*min(vK.y, 1.));      // cold blue-grey steam, a little of the last light on its crown
        col = mix(col, (mix(uGround, uSky, up)*1.5 + uRim*.2) * (.75 + .5*nz), snowy);
        col += (uFire + uWarm*.16) * vK.y * pow(1. - up, 1.3) * (.6 + .8*nz) * 1.25 + uWarm * vK.z * mix(1. - up, 1., snowy) * (.5 + nz) * .6;
        col = mix(col, fogColor, fogAmount());
        gl_FragColor = vec4(col*a, a);
      }`}),t=new M.Mesh(v,x);return t.frustumCulled=!1,t.renderOrder=3,t}function ut(a,e,s){const n=a.length,c=new Float32Array(n*3),l=new Float32Array(n*3),b=new Float32Array(n*3);a.forEach((i,d)=>{c.set([i[0],i[1],i[2]],d*3),l.set(i[3],d*3),b.set([i[4],i[5]>1.5?1:0,d*1.7],d*3)});const o=Ne(n);o.setAttribute("aPos",new M.InstancedBufferAttribute(c,3)),o.setAttribute("aCol",new M.InstancedBufferAttribute(l,3)),o.setAttribute("aSz",new M.InstancedBufferAttribute(b,3));const f=new M.ShaderMaterial({uniforms:{...s,...e},fog:!0,transparent:!0,depthWrite:!1,blending:M.AdditiveBlending,vertexShader:`
      attribute vec3 aPos, aCol, aSz; uniform float uTime, uHeadX, uTrainS, uTrainK, uGlowK;
      varying vec2 vQ; varying vec3 vC;
      #include <fog_pars_vertex>
      void main(){
        vec3 c = aPos; float k = uGlowK;
        if (aSz.y > .5){ c = vec3(uHeadX, ${ae(pe)}, 0.) + aPos*uTrainS; k *= step(abs(c.x), ${ae(W-.5)}) * uTrainK; }
        k *= .88 + .12*sin(uTime*7. + aSz.z*3.)*sin(uTime*4.3 + aSz.z);
        vQ = position.xy; vC = aCol * k;
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.); mvPosition.xyz *= 1. - 1.3/max(1.3, length(mvPosition.xyz))*.999;
        mvPosition.xy += position.xy * aSz.x * .5;
        gl_Position = k > .001 ? projectionMatrix * mvPosition : vec4(2., 2., 2., 1.);
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vQ; varying vec3 vC;
      #include <fog_pars_fragment>
      ${Fe}
      void main(){
        float r2 = dot(vQ, vQ); if (r2 > 1.) discard;
        float g = exp(-r2*5.5)*.55 + exp(-r2*60.)*1.6; g *= 1. - r2;
        gl_FragColor = vec4(vC * g * (1. - fogAmount()), 1.);
      }`}),u=new M.Mesh(o,f);return u.frustumCulled=!1,u.renderOrder=4,u}function vt(a,e,s,n){const c=a.flakes,l=new Float32Array(c*4);for(let u=0;u<c*4;u++)l[u]=e();const b=Ne(c);b.setAttribute("aP",new M.InstancedBufferAttribute(l,4));const o=new M.ShaderMaterial({uniforms:{...n,...s},fog:!0,transparent:!0,depthWrite:!1,blending:M.AdditiveBlending,vertexShader:`
      attribute vec4 aP; uniform vec2 uBlow; varying vec2 vQ; varying vec3 vC;
      #include <fog_pars_vertex>
      ${Te}
      void main(){
        const vec3 B0 = vec3(${ae(-W-4)}, ${ae(pe-10)}, -15.), BS = vec3(${ae(2*W+8)}, 26., 30.);
        vec3 c = B0 + vec3(mod(aP.x*BS.x - uTime*(.5 + aP.w*.5) + uTime*uBlow.x*(.7 + .6*aP.w), BS.x) + sin(uTime*.7 + aP.w*40.)*.5,
                           mod(aP.y*BS.y - uTime*(1.2 + aP.w*1.1), BS.y),
                           mod(aP.z*BS.z + sin(uTime*.5 + aP.w*23.)*.6 + uTime*.25 + uTime*uBlow.y*(.7 + .6*aP.w), BS.z));
        vec3 l = lampLight(c, vec3(0.), 1e3)*3.4 + trainLight(c, vec3(0.), 1e3)*2. + vec3(1., .9, .7)*headCone(c)*5.;
        vC = uSky*.22 + l; vQ = position.xy;
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.);
        float sz = max(.05 + .06*aP.w, -mvPosition.z*.0012);
        vC *= min(1., (.05 + .06*aP.w)/sz*2.2) * smoothstep(0., 1.5, min(c.y - B0.y, B0.y + BS.y - c.y));
        mvPosition.xy += position.xy * sz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vQ; varying vec3 vC;
      #include <fog_pars_fragment>
      ${Fe}
      void main(){ float r = length(vQ); if (r > 1.) discard; gl_FragColor = vec4(vC * (1. - smoothstep(.25, 1., r)) * (1. - fogAmount()), 1.); }`}),f=new M.Mesh(b,o);return f.frustumCulled=!1,f.renderOrder=2,f}function ht(a,e,s,n){const c=[],l=[],b=[],o=[],f=a.headlamp,u=50,i=20,d=10;for(let h=0;h<=d;h++)for(let r=0;r<=i;r++){const p=h/d,C=r/i*6.2832,L=.5/e.trainScale+p*u*.07;c.push(f[0]+.1+p*u,f[1]+Math.cos(C)*L,Math.sin(C)*L),l.push(-.1,Math.cos(C),Math.sin(C)),b.push(p,0)}for(let h=0;h<d;h++)for(let r=0;r<i;r++){const p=h*(i+1)+r,C=p+i+1;o.push(p,C,C+1,p,C+1,p+1)}for(const h of[-1,1]){const r=c.length/3,p=-a.length,C=a.carEnd;c.push(p,3,1.45*h,C,3,1.45*h,C,.7,4.6*h,p,.7,4.6*h),l.push(0,1,0,0,1,0,0,1,0,0,1,0),b.push(0,1,0,1,1,1,1,1),o.push(r,r+1,r+2,r,r+2,r+3)}const v=new M.BufferGeometry;v.setAttribute("position",new M.Float32BufferAttribute(c,3)),v.setAttribute("normal",new M.Float32BufferAttribute(l,3)),v.setAttribute("aK",new M.Float32BufferAttribute(b,2)),v.setIndex(o);const x=new M.ShaderMaterial({uniforms:{...n,...s},fog:!0,transparent:!0,depthWrite:!1,blending:M.AdditiveBlending,side:M.DoubleSide,vertexShader:`
      attribute vec2 aK; uniform float uHeadX, uTrainS; varying vec2 vK; varying vec3 vN, vV, vP; varying float vX;
      #include <fog_pars_vertex>
      void main(){
        vK = aK; vP = position; vX = uHeadX + position.x*uTrainS;
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.); vN = normalMatrix * normal; vV = mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      varying vec2 vK; varying vec3 vN, vV, vP; varying float vX;
      #include <fog_pars_fragment>
      ${Te}
      ${Fe}
      void main(){
        if (abs(vX) > XCLIP) discard;
        vec3 col;
        if (vK.y < .5){
          // a soft beam: bright only where the eye looks through its thickness, dying along its length, broken up by the falling snow it lights
          float f = pow(abs(dot(normalize(vN), normalize(vV))), 2.6);
          float ang = atan(vP.z, vP.y - 4. + 1e-5);
          float streak = .5 + .5*vnoise(vec2(vP.x*.5 - uTime*3., ang*4.));
          float speck = smoothstep(.66, .92, vnoise(vec2(vP.x*2.4 - uTime*2.5, ang*8. + uTime*1.3)));       // soft motes of lit snow (hard cells read as rectangles when the beam is seen end-on)
          col = vec3(1., .88, .66) * f * pow(clamp(1. - vK.x, 0., 1.), 3.4) * (streak * .26 + speck * .16) * smoothstep(0., .04, vK.x);
        } else {
          float w = 1. - vK.x; col = uWarm * w*w * (.14 + .08*sin(vP.x*4.6)) ;
        }
        gl_FragColor = vec4(col * uTrainK * (1. - fogAmount()), 1.);
      }`}),t=new M.Mesh(v,x);return t.frustumCulled=!1,t.renderOrder=2,t}async function mt(a,e={}){const s=a.rng.fork?a.rng.fork("express-viaduct"):a.rng,n=a.noise,l=(Array.isArray(e.palette)&&e.palette.length>=7?e.palette:De).map(Ge),b=s.range(17,20.5),o={stone:Se(l[4],l[2],s.range(.24,.36)),rock:Se(l[4],l[2],s.range(.22,.36)).map(m=>m*1.5),amberC:l[6],snowC:l[3],crimson:l[5],rise:b,spring:Me-b,archExp:s.pick([2,2,1.85,1.72]),ringT:s.range(1.35,1.7),tiers:s.int(3,4),batterX:s.range(.028,.045),batterZ:s.range(.05,.075),ledge:s.range(.3,.5),icicles:s.int(240,380),crenel:s.chance(.65),trainScale:e.trainScale??1.45,carriages:e.carriages??8,creamBand:s.chance(.5),domeFirst:s.chance(.5),deflectors:s.chance(.45),drivers:s.pick([3,3,4]),puffs:300,flakes:Math.max(1500,Math.round(e.flakes??7e3)),lamps:[],keyLamps:[],pierLamps:[],ledges:[],plough:!!e.plough},f=o.trainScale,u=new M.Group;u.name="express-on-the-viaduct";const i=new ze,d=a.yield?()=>a.yield():null;await tt(i,o,s,n,d),await a.yield?.();const v=o.lamps.map(m=>[m[0],m[1]-.1,m[2],l[6],7.5,1]);for(const m of o.keyLamps)v.push([m[0],m[1]+.25,m[2],l[6],6.4,1]);for(const m of o.pierLamps)v.push([m[0],m[1],m[2],l[6],6.4,1]);const x=o.pierLamps.reduce((m,R)=>m+R[1],0)/Math.max(1,o.pierLamps.length),t=o.pierLamps.reduce((m,R)=>m+Math.abs(R[2]),0)/Math.max(1,o.pierLamps.length),h=[];for(const m of[1,-1]){const R=new ze,A={glows:[],lamps:[]};ot(R,o,s,n,e.crags!==!1,A),Ie(i,R,m>0?-1:0);for(const H of A.glows)v.push([H[0]*m,H[1],H[2],H[3],H[4],H[5]]);for(const H of A.lamps)h.push([H[0]*m,H[1],H[2]]);await a.yield?.()}await at(i,o,s,n,d),await a.yield?.();const r=await nt(o,s,d);await a.yield?.();const p=r.length*f,C=r.lead*f,L=2*(W+4)+p+C,T=m=>-(W+4)-C+Be(m,0,1)*L,k=m=>Be((m+W+4+C)/L,0,1),y=m=>new M.Vector3(m[0],m[1],m[2]),X=m=>new M.Color(m[0],m[1],m[2]),B={uTime:{value:0},uHeadX:{value:0},uTravel:{value:0},uTravelW:{value:0},uWhistle:{value:0},uTrainLen:{value:p},uTrainS:{value:f},uCarStart:{value:-r.carEnd*f},uFireOff:{value:-r.firebox[0]*f},uLampOff:{value:new M.Vector3(-r.headlamp[0]*f,r.headlamp[1]*f,0)},uChim:{value:y(r.chimney).multiplyScalar(f)},uWhis:{value:y(r.whistle).multiplyScalar(f)},uCyl:{value:y(r.cyl).multiplyScalar(f)},uPlumeLen:{value:150},uLampK:{value:2.4},uTrainK:{value:1},uGlowK:{value:1},uPlough:{value:r.plough?new M.Vector4(r.plough[0]*f,r.plough[1]*f,r.plough[2]*f,1):new M.Vector4(0,0,0,0)},uBlow:{value:new M.Vector2((e.wind?.[0]??0)*13*(e.blow??0),(e.wind?.[1]??0)*13*(e.blow??0))},uSky:{value:X(Se(l[1],l[3],.3)).multiplyScalar(.8)},uGround:{value:X(Se(l[1],l[2],.5)).multiplyScalar(.36)},uRim:{value:X(l[2]).multiplyScalar(.5)},uRimDir:{value:new M.Vector3(0,.22,-1).normalize()},uWarm:{value:X(l[6])},uFire:{value:new M.Color(1,.36,.08)},uSnowCol:{value:X(l[3]).multiplyScalar(.84)},uRockCol:{value:X(o.rock)},uPier:{value:new M.Vector2(x,t)},uWirePx:{value:.0016}},q=new M.Vector2,N=()=>M.UniformsUtils.clone(M.UniformsLib.fog);await a.yield?.();const D=await i.buildAsync(d);await a.yield?.();const Z=new M.Mesh(D,new M.ShaderMaterial({uniforms:{...N(),...B},vertexShader:it,fragmentShader:rt,vertexColors:!0,fog:!0}));Z.name="viaduct",u.add(Z),await a.yield?.();const $=new M.Mesh(r.geo,new M.ShaderMaterial({uniforms:{...N(),...B},vertexShader:lt,fragmentShader:ct,vertexColors:!0,fog:!0,side:M.DoubleSide}));$.name="express",$.frustumCulled=!1,$.scale.setScalar(f),$.position.set(0,pe,0),u.add($),await a.yield?.();const K=ht(r,o,B,N());$.add(K),await a.yield?.();for(const m of r.glows)v.push([m[0],m[1],m[2],m[3],m[4]*f,2]);const ee=ut(v,B,N());u.add(ee),await a.yield?.();const w=ft(o,s,B,N());u.add(w),await a.yield?.();let z=null;e.snow!==!1&&(z=vt(o,s,B,N()),u.add(z));let F=null;e.light!==!1&&(F=new M.PointLight(16747066,900,90,2),u.add(F)),await a.yield?.();let V=-1;function J(m){if(m=Be(+m||0,0,1),m===V)return;V=m;const R=T(m);B.uHeadX.value=R,B.uTravelW.value=R+W+4,B.uTravel.value=(R+W+4)/f,$.position.x=R;const A=be(-W-1,-W+6,R)*(1-be(-me+30,-me+62,R)),H=be(me-62,me-40,R)*(1-be(me-8,me+8,R));if(B.uWhistle.value=Math.max(A,H),F){const Q=R+r.firebox[0]*f;F.position.set(Q,pe+1.4*f,0),F.intensity=Math.abs(Q)<W-1?900:0}}const g=(m,R=.42,A=.6)=>k(he(-me,0,(m-R)/(A-R)));J(e.progress??k(52));const S=m=>m&&m.isColor?m:new M.Color(m);function I(m={}){m.sky&&B.uSky.value.copy(S(m.sky)),m.ground&&B.uGround.value.copy(S(m.ground)),m.rim&&B.uRim.value.copy(S(m.rim)),m.rimDir&&B.uRimDir.value.copy(m.rimDir).normalize(),m.warm&&B.uWarm.value.copy(S(m.warm))}const P=Math.round(i.i.length/3+r.tris+(o.puffs+70+v.length+(z?o.flakes:0))*2+450),_={gaze:new M.Vector3(0,52,0),flyThrough:[[0,8,170],[0,14,110],[0,21,50],[0,25,0],[0,28,-50],[0,34,-110]].map(y),archCentre:new M.Vector3(0,30,0),archClear:{halfWidth:Ae,crownY:Me,springY:o.spring,depth:2*(Y+.25)},portalSeat:{position:new M.Vector3(0,64,-250),facing:new M.Vector3(0,0,1),note:"not built by the hero: seat the 14 m portal in the castle gatehouse on the arch axis"},castleSeat:new M.Vector3(0,55,-250),train:{deckY:oe,railY:pe,x0:-me,x1:me,tunnelX:W,length:p,headX:T,progressForHeadX:k},viewpoints:{entry:new M.Vector3(0,60,420),river:new M.Vector3(0,6,150),underArch:new M.Vector3(0,25,0),farSide:new M.Vector3(0,30,-70),threeQuarter:new M.Vector3(-150,78,230)},lamps:o.lamps.concat(h).map(y),lanterns:o.keyLamps.concat(o.pierLamps).map(y),firebox:m=>new M.Vector3(T(m)+r.firebox[0]*f,pe+1.4*f,0),tunnels:[new M.Vector3(-W+2,oe,0),new M.Vector3(W-2,oe,0)]};return{object:u,radius:150,height:80,center:new M.Vector3(0,48,0),anchors:_,update(m,R,A){if(B.uTime.value=R,A&&a.renderer){const H=a.renderer.getDrawingBufferSize(q).y,Q=A.projectionMatrix.elements[5];H>0&&Q>.01&&(B.uWirePx.value=1.05/(Q*H))}},dispose(){},ground:!0,groundY:0,setProgress:J,progressForU:g,setLight:I,uniforms:B,info:{triangles:P,drawCalls:z?6:5,trainLength:p,arches:ue,rise:o.rise,archExp:o.archExp,tiers:o.tiers,crenel:o.crenel,drivers:o.drivers,creamBand:o.creamBand,deflectors:o.deflectors}}}export{mt as buildHero};
