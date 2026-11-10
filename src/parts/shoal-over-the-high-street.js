import*as I from"three";const o0=46,Yt={red:"#c8261d",white:"#fbf6ee",dark:"#7c1411",lip:"#ffe2c4",belly:"#f3dcc8",feeler:"#f4e7cd",eye:"#07070a",stalk:"#f1dcc8",amber:"#f2a53a"},yt=[{len:30,r0:.15,r1:.03,root:[1.95,-.32,19.3]},{len:15,r0:.13,r1:.03,root:[.8,.9,20.1]},{len:13,r0:.13,r1:.03,root:[.56,.68,20.2]}],I0=(t,e)=>{const o=yt[t],r=Math.max(0,1-e/o.len);return(o.r1+(o.r0-o.r1)*Math.pow(r,1.2))*Math.min(1,r*10)},ie=.1,Gt=16,re=1.9,se=re.toFixed(4),c0=(t,e,o)=>{const r=Math.min(1,Math.max(0,(o-t)/(e-t)));return r*r*(3-2*r)},gt=(t,e,o)=>t+(e-t)*o,jt=t=>Math.min(1,Math.max(0,t)),St={rho:4.4,rho2:3,e0:.06,az:1.15},Dt=Math.PI/2;function le(t,e,o,r,s,m,x,c){let l,h,a,v=0;if(t===0){a=e/yt[0].len;const p=St.rho*Dt,q=Math.max(p*.6,p+(m+yt[0].root[1]-St.rho)-St.rho2);v=jt((e-q)/(St.rho2*Dt))*o;const Y=gt(1.3,3.13,c0(0,4.4,e))-.1*a*a,Z=gt(.22,-.075,c0(0,9,e))-.26*a*a,at=gt(St.az,s*x,c0(q-2.5,q-.2,e)),et=-St.e0-(Dt-St.e0)*jt(e/p)+Dt*jt((e-q)/(St.rho2*Dt));l=gt(Y,at,o),h=gt(Z,et,o)}else t===1?(a=e/yt[1].len,l=.17+.05*a,h=gt(gt(.52,.26,a),gt(.36,.02,a),o)):(a=e/yt[2].len,l=.07+.06*a,h=gt(gt(.2,.02,a),gt(.06,-.26,a),o));const L=Math.cos(h);let g=Math.sin(l)*L,k=Math.sin(h),M=Math.cos(l)*L;const F=t===0&&m<500?o:0,C=(t===0?gt(.05+.13*a,.05+.15*a,o):.03+.1*a)*(1-.5*F)*(1-.5*v),T=t===0?.24:.3,R=t*1.7+(s>0?0:2.4),j=r*gt(st.whipSwim,1,o);g+=C*Math.sin(T*e-.8*j+R),k+=C*.7*(1-v)*Math.sin(T*.8*e-.62*j+R*1.3+1),M+=C*.6*Math.sin(T*.9*e-.71*j+R*.7+2);const Q=1/Math.hypot(g,k,M);return c[0]=g*Q*s,c[1]=k*Q,c[2]=M*Q,c}const n0=[0,0,0];function T0(t,e,o,r,s,m,x,c){const l=yt[t];let h=l.root[0]*s,a=l.root[1],v=l.root[2];for(let L=0;L<Gt;L++){const g=L/Gt,k=(L+1)/Gt,M=(g+k)*.5;le(t,e*M*M,o,r,s,m,x,n0);const F=e*(k*k-g*g);h+=n0[0]*F,a+=n0[1]*F,v+=n0[2]*F}return t===0&&(a=Math.max(a,-m)),c[0]=h,c[1]=a,c[2]=v,c}const he=`
vec3 whipDir(float id, float s, float h, float t, float side, vec2 drape) {
  float az, el, k, lie = 0.0;
  if (id < 0.5) {
    k = s / ${yt[0].len.toFixed(1)};
    float sa = ${(St.rho*Dt).toFixed(5)}, sb = ${(St.rho2*Dt).toFixed(5)};
    float s1 = max(sa * 0.6, sa + (drape.x + ${yt[0].root[1].toFixed(4)} - ${St.rho.toFixed(4)}) - ${St.rho2.toFixed(4)});
    float turn = clamp((s - s1) / sb, 0.0, 1.0);
    lie = turn * h;
    float azS = mix(1.30, 3.13, smoothstep(0.0, 4.4, s)) - 0.10 * k * k, elS = mix(0.22, -0.075, smoothstep(0.0, 9.0, s)) - 0.26 * k * k;
    float azH = mix(${St.az.toFixed(4)}, side * drape.y, smoothstep(s1 - 2.5, s1 - 0.2, s));
    float elH = -${St.e0.toFixed(4)} - ${(Dt-St.e0).toFixed(5)} * clamp(s / sa, 0.0, 1.0) + 1.570796 * turn;
    az = mix(azS, azH, h); el = mix(elS, elH, h);
  } else if (id < 1.5) {
    k = s / ${yt[1].len.toFixed(1)};
    az = 0.17 + 0.05 * k; el = mix(mix(0.52, 0.26, k), mix(0.36, 0.02, k), h);
  } else {
    k = s / ${yt[2].len.toFixed(1)};
    az = 0.07 + 0.06 * k; el = mix(mix(0.20, 0.02, k), mix(0.06, -0.26, k), h);
  }
  float ce = cos(el);
  vec3 d = vec3(sin(az) * ce, sin(el), cos(az) * ce);
  float draped = id < 0.5 && drape.x < 500.0 ? h : 0.0;
  float a = (id < 0.5 ? mix(0.05 + 0.13 * k, 0.05 + 0.15 * k, h) : 0.03 + 0.10 * k) * (1.0 - 0.5 * draped) * (1.0 - 0.5 * lie), kk = id < 0.5 ? 0.24 : 0.3, ph = id * 1.7 + (side > 0.0 ? 0.0 : 2.4);
  float rt = t * mix(${se}, 1.0, h);
  d.x += a * sin(kk * s - 0.80 * rt + ph);
  d.y += a * 0.7 * (1.0 - lie) * sin(kk * 0.8 * s - 0.62 * rt + ph * 1.3 + 1.0);
  d.z += a * 0.6 * sin(kk * 0.9 * s - 0.71 * rt + ph * 0.7 + 2.0);
  d = normalize(d); d.x *= side;
  return d;
}
vec3 whipPoint(vec3 root, float id, float s, float h, float t, float side, vec2 drape) {
  vec3 p = root;
  for (int i = 0; i < ${Gt}; i++) {
    float u0 = float(i) / ${Gt}.0, u1 = float(i + 1) / ${Gt}.0, um = (u0 + u1) * 0.5;
    p += whipDir(id, s * um * um, h, t, side, drape) * (s * (u1 * u1 - u0 * u0));
  }
  if (id < 0.5) p.y = max(p.y, -drape.x);
  return p;
}`;class qt{constructor(){this.p=[],this.n=[],this.c=[],this.pv=[],this.pv2=[],this.a=[],this.fx=[],this.sg=[],this.idx=[],this.keys=[],this.cur={pv:[0,0,0],pv2:[0,0,0],a:[0,0,0,0],fx:[0,0]}}get count(){return this.p.length/3}get triangles(){return this.idx.length/3}set(e,o,r,s){return this.cur={pv:e,pv2:o||e,a:r,fx:s||[0,0]},this}v(e,o,r,s,m,x,c){this.p.push(e,o,r),this.n.push(s,m,x),this.c.push(c.r,c.g,c.b);const l=this.cur;return this.pv.push(l.pv[0],l.pv[1],l.pv[2]),this.pv2.push(l.pv2[0],l.pv2[1],l.pv2[2]),this.a.push(l.a[0],l.a[1],l.a[2],l.a[3]),this.fx.push(l.fx[0],l.fx[1]),this.p.length/3-1}quad(e,o,r,s){this.idx.push(e,o,r,e,r,s)}tri(e,o,r){this.idx.push(e,o,r)}tube(e,o,r,s,m=!0,x=!0){const c=e.length,l=[];let h=null;const a=new I.Vector3,v=new I.Vector3,L=new I.Vector3;for(let g=0;g<c;g++){const k=e[g],M=e[Math.max(0,g-1)],F=e[Math.min(c-1,g+1)];a.set(F[0]-M[0],F[1]-M[1],F[2]-M[2]).normalize(),h||(h=new I.Vector3(1,0,0),Math.abs(a.x)>.9&&h.set(0,0,1)),v.copy(h).addScaledVector(a,-h.dot(a)).normalize(),h.copy(v),L.crossVectors(a,v);const C=Array.isArray(o)?o[g]:o,T=Array.isArray(s)?s[g]:s,R=[];for(let j=0;j<r;j++){const Q=j/r*Math.PI*2,p=Math.cos(Q),q=Math.sin(Q),Y=v.x*p+L.x*q,Z=v.y*p+L.y*q,at=v.z*p+L.z*q;R.push(this.v(k[0]+Y*C,k[1]+Z*C,k[2]+at*C,Y,Z,at,T))}if(l.push(R),g===0&&m||g===c-1&&x){const j=g===0?-1:1,Q=this.v(k[0],k[1],k[2],a.x*j,a.y*j,a.z*j,T);for(let p=0;p<r;p++){const q=(p+1)%r;g===0?this.tri(Q,R[q],R[p]):this.tri(Q,R[p],R[q])}}}for(let g=0;g<c-1;g++)for(let k=0;k<r;k++){const M=(k+1)%r;this.quad(l[g][k],l[g][M],l[g+1][M],l[g+1][k])}}build(){const e=new I.BufferGeometry;return e.setAttribute("position",new I.Float32BufferAttribute(this.p,3)),e.setAttribute("normal",new I.Float32BufferAttribute(this.n,3)),e.setAttribute("aColor",new I.Float32BufferAttribute(this.c,3)),e.setAttribute("aPivot",new I.Float32BufferAttribute(this.pv,3)),e.setAttribute("aPivot2",new I.Float32BufferAttribute(this.pv2,3)),e.setAttribute("aAnim",new I.Float32BufferAttribute(this.a,4)),e.setAttribute("aFx",new I.Float32BufferAttribute(this.fx,2)),e.setIndex(this.idx),e}}const Jt=t=>e=>{const o=t.length;if(e<=t[0][0])return t[0][1];if(e>=t[o-1][0])return t[o-1][1];let r=0;for(;e>t[r+1][0];)r++;const s=t[Math.max(0,r-1)][1],m=t[r][1],x=t[r+1][1],c=t[Math.min(o-1,r+2)][1],l=(e-t[r][0])/(t[r+1][0]-t[r][0]);return .5*(2*m+(-s+x)*l+(2*s-5*m+4*x-c)*l*l+(-s+3*m-3*x+c)*l*l*l)},f0=-1.4,i0=5.2,Ot=17.5*Math.PI/180;function C0(t){const e=f0-t;if(e<=0)return{y:0,z:t,a:0};const o=Ot/i0;if(e<i0)return{y:-(1-Math.cos(o*e))/o,z:f0-Math.sin(o*e)/o,a:o*e};const r=-(1-Math.cos(Ot))/o,s=f0-Math.sin(Ot)/o;return{y:r-(e-i0)*Math.sin(Ot),z:s-(e-i0)*Math.cos(Ot),a:Ot}}function d0(t,e,o,r){const s=C0(o),m=Math.cos(s.a),x=Math.sin(s.a);return r[0]=t,r[1]=s.y+e*m,r[2]=s.z-e*x,r}function ce(t){const e=C0(t),o=Math.cos(e.a),r=Math.sin(e.a);return(s,m,x)=>{const c=x-t;return[s,e.y+m*o+c*r,e.z-m*r+c*o]}}const fe=-24,r0={top:Jt([[4.6,3.1],[8,2.98],[11,3],[14,3.08],[16,2.6],[17.25,1.95]]),bot:Jt([[4.6,-3.1],[8,-3.3],[11,-3.3],[14,-3.15],[16,-2.7],[17.25,-2.1]]),hw:Jt([[4.6,2.4],[8,2.5],[11,2.5],[14,2.3],[16,1.9],[17.25,1.4]])},Zt={top:Jt([[-17.3,1],[-12.6,1.65],[-9.3,2.2],[-5.9,2.75],[-2.2,3.12],[1.3,3],[4.9,2.85]]),bot:Jt([[-17.3,-.75],[-12.6,-1.15],[-9.3,-1.5],[-5.9,-1.9],[-2.2,-2.3],[1.3,-2.55],[4.9,-2.75]]),hw:Jt([[-17.3,1.05],[-12.6,1.45],[-9.3,1.7],[-5.9,1.95],[-2.2,2.15],[1.3,2.25],[4.9,2.3]])},Kt=[[4.9,1.3,.9,"white"],[1.3,-2.2,1.15,"red"],[-2.2,-5.9,1,"red"],[-5.9,-9.3,.9,"white"],[-9.3,-12.6,.8,"red"],[-12.6,-17.3,.4,"white"]],V0=13;function u0(t,e,o){const r=[],s=t.e??.8;for(let m=0;m<=e;m++){const x=m/e*Math.PI/2;r.push([t.hw*Math.pow(Math.sin(x),s),t.mid+(t.top-t.mid)*Math.pow(Math.cos(x),s),0])}for(let m=1;m<=o;m++){const x=m/o*Math.PI/2;r.push([t.fx+(t.hw-t.fx)*Math.pow(Math.cos(x),s),t.mid-(t.mid-t.flap)*Math.pow(Math.sin(x),s),0])}return r.push([t.fx,t.flap,1],[t.bw,t.bot,1],[t.bw*.5,t.bot-.3*(t.bulge??1),1],[0,t.bot-.4*(t.bulge??1),1]),r}qt.prototype.ring=function(t,e,o,r=-1,s=!0){const m=t.length,x=[],c=[0,0,0];for(let l=0;l<2*m-2;l++){const h=l<m?l:2*m-2-l,a=t[h],v=l<m?a[0]:-a[0];s?d0(v,a[1],e,c):(c[0]=v,c[1]=a[1],c[2]=e);const L=this.v(c[0],c[1],c[2],0,1,0,o(v,a[1],a[2],h));this.sg[L]=r<0?a[2]:r,x.push(L)}return x},qt.prototype.bridge=function(t,e){const o=t.length;for(let r=0;r<o;r++){const s=(r+1)%o;this.quad(t[r],t[s],e[s],e[r])}},qt.prototype.cap=function(t,e,o,r,s,m){const x=this.v(e,o,r,0,0,m?1:-1,s),c=t.length;this.sg[x]=this.sg[t[0]]||0;for(let l=0;l<c;l++){const h=(l+1)%c;m?this.tri(x,t[h],t[l]):this.tri(x,t[l],t[h])}return x},qt.prototype.smooth=function(t,e,o=this.count,r=this.idx.length){const s=this.p,m=this.n,x=this.idx;for(let l=t*3;l<o*3;l++)m[l]=0;for(let l=e;l<r;l+=3){const h=x[l]*3,a=x[l+1]*3,v=x[l+2]*3,L=s[a]-s[h],g=s[a+1]-s[h+1],k=s[a+2]-s[h+2],M=s[v]-s[h],F=s[v+1]-s[h+1],C=s[v+2]-s[h+2],T=g*C-k*F,R=k*M-L*C,j=L*F-g*M;for(const Q of[h,a,v])m[Q]+=T,m[Q+1]+=R,m[Q+2]+=j}const c=new Map;for(let l=t;l<o;l++){const h=((Math.round(s[l*3]*200)+8192)*16384+Math.round(s[l*3+1]*200)+8192)*65536+(Math.round(s[l*3+2]*200)+8192)*4+(this.sg[l]||0);let a=c.get(h);a||(a=[0,0,0,[]],c.set(h,a)),a[0]+=m[l*3],a[1]+=m[l*3+1],a[2]+=m[l*3+2],a[3].push(l)}for(const l of c.values()){const h=Math.hypot(l[0],l[1],l[2])||1;for(const a of l[3])m[a*3]=l[0]/h,m[a*3+1]=l[1]/h,m[a*3+2]=l[2]/h}};const H0={near:{nu:10,nl:6,shield:[17.25,16.6,15.9,15,14],shieldRed:[11.8,10.6,9.4,8.2,7,5.8],plate:[0,.14,.32,.5,.68,.84],whip:[72,9,28,7],leg:7,eye:[10,7],rim:!0},far:{nu:3,nl:2,shield:[17.25,15.6],shieldRed:[10.4,7.6],plate:[0,.5],whip:[26,3,9,3],leg:3,eye:[5,3],rim:!1},shadow:{nu:1,nl:1,shield:[17.25],shieldRed:[9],plate:[0],whip:[9,3,4,3],leg:3,eye:[3,2],rim:!1}},Qt=t=>t==="far"||t==="shadow"?t:"near",p0=.3,m0=.1;function q0(t,e,o,r=!1){const s=t.count,m=t.idx.length;t.set([0,0,0],null,[0,0,0,0],[0,.6]);const x=e.nu+e.nl,c=p=>(q,Y,Z,at)=>e.rim&&at===x?o.dark:p,l=2*(x+5)-2,h=p=>(t.fx[p[x]*2]=.5,t.fx[p[l-x]*2]=.5,p),a=p=>{for(const q of p)t.fx[q*2]=.5;return p},v=(p,q=1,Y=0)=>{const Z=r0.top(p)*q+Y,at=r0.bot(p)*q,et=r0.hw(p)*q+Y*.6;return{top:Z,bot:at,hw:et,mid:at+.44*(Z-at),flap:at-.38*q,fx:.82*et,bw:.5*et,e:.78}},L=(p,q,Y,Z,at)=>h(t.ring(u0(v(p,Y,Z),e.nu,e.nl),p,c(q),at));let g=L(17.25,o.white,.45,0);t.cap(g,0,-.1,18.55,o.white,!0);for(const p of g)t.p[p*3+2]+=.95;let k=g;g=L(17.25,o.white,.8,0);for(const p of g)t.p[p*3+2]+=.5;t.bridge(k,g),k=g;for(const p of e.shield)g=L(p,o.white),t.bridge(k,g),k=g;g=L(V0,o.white),t.bridge(k,g),k=L(V0,o.red);for(const p of e.shieldRed)g=L(p,o.red,1,p<6?.05:0),t.bridge(k,g),k=g;e.rim?(g=L(4.6+p0,o.red,1,.1),t.bridge(k,g),k=L(4.6+p0,o.dark,1,.1),g=a(L(4.6+m0,o.dark,1,.13)),t.bridge(k,g),k=a(L(4.6+m0,o.lip,1,.13)),g=a(L(4.6,o.lip,1,.14)),t.bridge(k,g)):(g=a(L(4.6,o.red,1,.14)),t.bridge(k,g));const M=(p,q,Y,Z=0)=>{const at=Kt[p][2],et=.24*Y+.11*Math.sin(Math.PI*Y)-Z,ft=Zt.top(q)+et,lt=Zt.bot(q),$=Zt.hw(q)+et*.8;return{top:ft,bot:lt,hw:$,mid:lt+.5*(ft-lt),flap:lt-at*Math.pow(Math.sin(Math.PI*Math.pow(Y,.9)),.6),fx:.9*$,bw:.5*$,e:.86}};let F=L(4.6,o.dark,1,.14,2);for(let p=0;p<6;p++){const q=Kt[p][0]+(p?.3:0),Y=Kt[p][1],Z=o[Kt[p][3]],at=E=>q+(Y-q)*E,et=p?Kt[p-1][1]:4.6,ft=(et-q)/(Y-q),lt=(E,G,ut)=>h(t.ring(u0(M(p,at(E),E),e.nu,e.nl),at(E),c(G),ut)),$=(E,G)=>G>=1?E:E.clone().multiplyScalar(G);t.bridge(F,lt(ft,o.dark,2)),k=lt(ft,$(Z,e.rim?.55:.72));for(const E of e.plate)E<=ft+.03||(g=lt(E,$(Z,E<.2?.86:1)),t.bridge(k,g),k=g);if(e.rim){const E=1-p0/(q-Y),G=1-m0/(q-Y);g=lt(E,Z),t.bridge(k,g),k=lt(E,o.dark),g=a(lt(G,o.dark)),t.bridge(k,g),k=a(lt(G,o.lip)),g=a(lt(1,o.lip)),t.bridge(k,g)}else g=a(lt(1,Z)),t.bridge(k,g);F=lt(1,o.dark,2)}const C=Kt[5][1],T=M(5,C,1);T.top*=.55,T.bot*=.5,T.hw*=.6,T.flap=T.bot,T.fx=.9*T.hw,T.bw=.5*T.hw,g=t.ring(u0(T,e.nu,e.nl),C,c(o.dark),2),t.bridge(F,g);const R=d0(0,.1,C-.5,[0,0,0]);t.cap(g,R[0],R[1],R[2],o.dark,!1);const j=t.count,Q=t.idx.length;if(r)return()=>t.smooth(s,m,j,Q);t.smooth(s,m)}qt.prototype.pipe=function(t,e,o=!0,r=!0){this.tube(t.map(s=>[s[0],s[1],s[2]]),t.map(s=>s[3]),e,t.map(s=>s[4]),o,r)},qt.prototype.ball=function(t,e,o,r,s,m,x){const c=[];for(let l=0;l<=m;l++){const h=l/m*Math.PI,a=Math.cos(h),v=Math.sin(h),L=[];if(l===0||l===m){c.push([this.v(t,e+a*r,o,0,a,0,x)]);continue}for(let g=0;g<s;g++){const k=g/s*Math.PI*2,M=Math.cos(k)*v,F=Math.sin(k)*v;L.push(this.v(t+M*r,e+a*r,o+F*r,M,a,F,x))}c.push(L)}for(let l=0;l<m;l++)for(let h=0;h<s;h++){const a=(h+1)%s,v=c[l],L=c[l+1];v.length===1?this.tri(v[0],L[a],L[h]):L.length===1?this.tri(v[h],v[a],L[0]):this.quad(v[h],v[a],L[a],L[h])}},qt.prototype.leaf=function(t,e,o,r){const s=this.count,m=this.idx.length,x=[],c=[],l=[];for(let h=0;h<t.length;h++){const a=Array.isArray(o)?o[h]:o;x.push(this.v(t[h][0],t[h][1],t[h][2],0,1,0,a)),l.push(this.v(e[h][0],e[h][1],e[h][2],0,1,0,a)),r&&c.push(this.v(r[h][0],r[h][1],r[h][2],0,1,0,a))}for(let h=0;h<t.length-1;h++)r?(this.quad(x[h],c[h],c[h+1],x[h+1]),this.quad(c[h],l[h],l[h+1],c[h+1])):this.quad(x[h],l[h],l[h+1],x[h+1]);this.smooth(s,m)};function v0(t,e,o){const r=e.rim,s=[0,0,0,0],m=v=>3.05+.0115*(v-14.6)*(v-14.6),x=v=>v<=17.3?r0.top(v)-.45:1.5+(m(23)-1.5)*Math.pow((v-17.3)/5.7,1.3),c=r?[14.6,15.4,16.2]:[14.6,17.3,20.4];if(r)for(let v=0;v<8;v++){const L=16.6+v*.7;c.push(L,L+.56,L+.63)}c.push(r?22.5:22,23),t.set([0,0,0],null,s,[0,.5]);const l=t.count,h=t.idx.length;let a=null;for(let v=0;v<c.length;v++){const L=c[v],g=r&&v>=3&&v<27&&(v-3)%3===1,k=m(L)+(g?.55:0),M=Math.min(x(L),k-.02),F=.34*(1-(L-14.6)/8.6)+.05,C=(k+M)/2,T=o.white,R=Math.min(.5,(k-M)*.36),j=r?[t.v(0,k,L,0,1,0,o.red),t.v(F*.6,k-R,L,1,0,0,o.red),t.v(F,C,L,1,0,0,T),t.v(0,M,L,0,-1,0,T),t.v(-F,C,L,-1,0,0,T),t.v(-F*.6,k-R,L,-1,0,0,o.red)]:[t.v(0,k,L,0,1,0,o.red),t.v(F,C,L,1,0,0,T),t.v(0,M,L,0,-1,0,T),t.v(-F,C,L,-1,0,0,T)];a&&t.bridge(j,a),a=j}t.smooth(l,h);for(const v of[-1,1])t.set([0,0,0],null,s,[0,.3]),t.pipe([[v*.9,1.2,16.9,.4,o.stalk],[v*1.7,1.5,17.4,.36,o.stalk],[v*2.25,1.68,17.72,.33,o.stalk]],e.leg,!1,!1),t.set([0,0,0],null,s,[0,1]),t.ball(v*2.62,1.76,17.95,.58,e.eye[0],e.eye[1],o.eye);for(const v of[-1,1]){t.set([0,0,0],null,s,[0,.4]);const L=yt[0].root,g=yt[1].root;t.pipe([[v*1.2,-.6,17.1,.58,o.red],[v*1.55,-.48,18.3,.52,o.red],[v*1.55,-.48,18.3,.52,o.white],[v*L[0],L[1],L[2],.4,o.white]],e.leg,!1,!0),t.pipe([[v*.5,.4,17.7,.36,o.white],[v*.6,.62,19.1,.32,o.white],[v*.6,.62,19.1,.32,o.red],[v*.68,.78,20.15,.27,o.red]],e.leg,!1,!0),t.set([0,0,0],null,s,[1,.3]);const k=r?9:4,M=[],F=[],C=[],T=[],R=[];for(let j=0;j<=k;j++){const Q=j/k;R.push([Q,Q>.62?o.red:o.white]),Q<.62&&(j+1)/k>.62&&R.push([.62,o.white],[.62,o.red])}for(const[j,Q]of R){const p=.85*Math.pow(Math.sin(Math.PI*Math.pow(j,.62)),.8)*(1-.25*j)+.02,q=17+5*j,Y=1.55+.75*j,Z=.2+.4*j;M.push([v*(Y-p*.92),Z+p*.38,q]),F.push([v*(Y+p*.92),Z-p*.38,q]),C.push([v*Y,Z+.16*Math.sin(Math.PI*Math.pow(j,.6)),q]),T.push(Q)}t.leaf(M,F,T,r?C:null),t.set([0,0,0],null,s,[0,.3]),r&&t.pipe([[v*.7,-2.2,16.6,.34,o.red],[v*.95,-2.75,18.4,.3,o.red],[v*.95,-2.75,18.4,.3,o.white],[v*.9,-2.55,20.2,.25,o.white],[v*.9,-2.55,20.2,.25,o.red],[v*.8,-2.2,21.6,.14,o.red]],e.leg,!1,!0)}}const de=[[14.6,0,1],[12.7,0,1.18],[10.7,1,.94],[8.7,1,1],[6.7,1,1.04]],ue=[{k1:[1.1,-1.3,.9],k2:[.2,-.9,1.5],end:[-.1,.15,1.3]},{k1:[1.7,-1.3,-1.7],k2:[.55,-1,-2.5],end:[.05,-.7,-2.5]}],pe=[3.1,-.45,-4.05,-7.6,-10.95],me=3.8,y0=1.3;function w0(t,e,o){const r=e.rim,s=e.leg,m=(l,h,a=1)=>[l[0]+h[0]*a,l[1]+h[1]*a,l[2]+h[2]*a],x=(l,h,a)=>[l[0]+(h[0]-l[0])*a,l[1]+(h[1]-l[1])*a,l[2]+(h[2]-l[2])*a],c=(l,h,a)=>[l[0],l[1],l[2],h,a];de.forEach(([l,h,a],v)=>{for(const L of[-1,1]){const g=ue[h],k=p=>[p[0]*L*a,p[1]*a,p[2]*a],M=[L*1.25,-3.2,l],F=m(M,k(g.k1)),C=m(F,k(g.k2)),T=m(C,k(g.end)),R=x(M,F,.55);if(r&&(t.set([0,0,0],null,[0,0,0,0],[0,.35]),t.ball(M[0],M[1]-.05,M[2],.66,7,4,o.red)),t.set(M,F,[3,v,0,L],[0,.35]),r?t.pipe([c(M,.4,o.red),c(R,.36,o.red),c(R,.36,o.white),c(x(M,F,.9),.32,o.white),c(F,.39,o.white)],s,!1,!0):t.pipe([c(M,.42,o.red),c(F,.38,o.white)],s,!1,!1),t.set(M,F,[3,v,1,L],[0,.35]),!r){t.pipe([c(F,.36,o.red),c(C,.32,o.red),c(T,h?.1:.3,o.white)],s,!1,!1);continue}t.ball(F[0],F[1],F[2],.43,6,4,o.white),t.ball(C[0],C[1],C[2],.39,6,4,o.red);const j=x(F,C,.12),Q=x(F,C,.9);if(t.pipe([c(F,.35,o.red),c(j,.3,o.red),c(Q,.28,o.red),c(C,.35,o.red),c(C,.35,o.white),c(x(C,T,.14),.26,o.white)].concat(h===1?[c(x(C,T,.66),.2,o.white),c(x(C,T,.66),.2,o.red),c(T,.05,o.red)]:[c(x(C,T,.55),.3,o.white),c(x(C,T,.55),.3,o.red),c(T,.29,o.red)]),s,!0,!0),h===0){const p=k([-.05,.1,.9]),q=k([0,.34,.05]);t.pipe([c(T,.23,o.red),c(m(m(T,p),q,-.25),.04,o.white)],5,!1,!1),t.pipe([c(m(T,q,.3),.18,o.red),c(m(m(T,p,.95),q,1),.04,o.white)],5,!1,!1)}}}),pe.forEach((l,h)=>{const a=ce(l),v=Zt.bot(l),L=Zt.hw(l);for(const g of[-1,1]){const k=g*.5*L,M=(T,R,j)=>a(k+T*g,v-R,l+j),F=M(0,0,0),C=M(0,y0,0);t.set(F,C,[2,h,0,g],[0,.3]),r?t.pipe([c(M(0,-.3,0),.42,o.red),c(M(0,.55,0),.4,o.red),c(M(0,.55,0),.4,o.white),c(C,.34,o.white)],s,!1,!0):t.pipe([c(M(0,-.3,0),.42,o.red),c(C,.36,o.white)],s,!1,!1);for(const[T,R]of[[.85,.62],[-.66,-.62]]){const j=me-y0+.05,Q=r?10:2,p=[[],[],[],[],[]],q=[],Y=[],Z=Math.cos(R),at=Math.sin(R);for(let lt=0;lt<=Q;lt++){const $=lt/Q,E=y0-.05+j*$,G=T*Math.pow($,.8),ut=.74*Math.pow(Math.sin(Math.PI*Math.pow($,.55)),.7)+.03,ot=ut*(r&&lt%2?1.24:.9),pt=.13*Math.sin(Math.PI*Math.pow($,.5));[-ot,-ut*.6,0,ut*.6,ot].forEach((Rt,Mt)=>p[Mt].push(M(G+Rt*Z,E,Rt*at))),q.push(M(G-pt*at,E,pt*Z)),Y.push(M(G+pt*at,E,-pt*Z))}if(t.set(F,C,[2,h,1,g],[1,.25]),!r){t.leaf(p[0],p[4],o.red);continue}const et=(lt,$,E)=>{for(let G=lt+E;G<$;G+=2)t.c[G*3]=o.red.r,t.c[G*3+1]=o.red.g,t.c[G*3+2]=o.red.b};let ft=t.count;t.leaf(p[0],p[1],o.white),et(ft,t.count,1),ft=t.count,t.leaf(p[3],p[4],o.white),et(ft,t.count,0),t.leaf(p[1],p[3],o.red,q),t.leaf(p[1],p[3],o.red,Y),t.set(F,C,[2,h,1,g],[0,.2]),t.pipe([c(q[0],.2,o.red),c(p[2][Q>>1],.16,o.red),c(p[2][Q],.06,o.red)],4,!1,!1)}}})}function x0(t,e,o){const r=e.rim,s=[0,0,0],m=(g,k,M)=>(d0(g,k,M,s),[s[0],s[1],s[2]]);t.set([0,0,0],null,[0,0,0,0],[0,.6]);const x=t.count,c=t.idx.length,l=-16.7,h=fe+.55,a=r?[0,.2,.45,.7,.78,.78,.92,1]:[0,.45,.78,.78,1];let v=null,L=!1;a.forEach((g,k)=>{k&&a[k-1]===g&&(L=!0);const M=l+(h-l)*g,F=.66*(1-Math.pow(g,1.6))+.03,C=L?o.white:o.red,T=.32-.1*g,R=.3*(1-.8*g),j=[t.v(...m(0,T+R,M),0,1,0,C),t.v(...m(F,T,M),1,0,0,C),t.v(...m(0,T-R*.6,M),0,-1,0,C),t.v(...m(-F,T,M),-1,0,0,C)];v&&t.bridge(v,j),v=j}),t.smooth(x,c),t.set([0,0,0],null,[0,0,0,0],[1,.6]);for(const g of[-1,1])for(const[k,M,F,C,T,R]of[[.62,.2,.035,6.75,.6,.1],[.95,.06,.085,7.25,.62,.22]]){const j=r?10:4,Q=[],p=[],q=[],Y=[],Z=[],at=[];for(let et=0;et<=j;et++){const ft=et/j;at.push([ft,ft>.76?o.white:o.red]),ft<.76&&(et+1)/j>.76&&at.push([.76,o.red],[.76,o.white])}for(const[et,ft]of at){const lt=C*et,$=T*Math.pow(Math.sin(Math.PI*Math.min(1,.08+.92*Math.pow(et,.62))),.55)+.02,E=k+Math.sin(F)*lt,G=-16.95-Math.cos(F)*lt,ut=Math.cos(R),ot=Math.sin(R);Q.push(m(g*(E-$*ut),M+$*ot,G)),p.push(m(g*(E+$*ut),M-$*ot,G)),q.push(m(g*E,M+.13*Math.sin(Math.PI*Math.pow(et,.5)),G)),Y.push(m(g*E,M-.11*Math.sin(Math.PI*Math.pow(et,.5)),G)),Z.push(ft)}t.leaf(Q,p,Z,q),r&&t.leaf(Q,p,Z,Y)}}function g0(t,e,o){for(let r=0;r<3;r++)for(const s of[-1,1]){const m=yt[r],x=r===0?e.whip[0]:e.whip[2],c=r===0?e.whip[1]:e.whip[3],l=[];for(let h=0;h<=x;h++){const a=h/x,v=m.len*Math.pow(a,1.25),L=I0(r,v),g=[];t.set([m.root[0]*s,m.root[1],m.root[2]],null,[4,r,v,s],[0,.1]);for(let k=0;k<c;k++){const M=k/c*Math.PI*2;g.push(t.v(Math.cos(M),Math.sin(M),L,0,1,0,o.feeler))}l.push(g)}for(let h=0;h<x;h++)for(let a=0;a<c;a++){const v=(a+1)%c;t.quad(l[h][a],l[h][v],l[h+1][v],l[h+1][a])}}}function ve(t){const e=H0[Qt(t)],o=new qt,r={};for(const s in Yt)r[s]=new I.Color(Yt[s]);return q0(o,e,r),typeof v0=="function"&&v0(o,e,r),typeof w0=="function"&&w0(o,e,r),typeof x0=="function"&&x0(o,e,r),typeof g0=="function"&&g0(o,e,r),o}const st={swim:.72,hover:.34,power:.36,fwd:-.5,back:.85,hoverAmp:.75,fold:.8,flex:1.1,flexRate:.45,wave:1.5,waveRate:2.1,waveLen:3.2,fan:1.6,fanLag:.9,set:2.4,side:3,sway:1.3,swayRate:.31,walkSwim:2.2,whipSwim:1.9},B0=-16.95,W0=7.3,E0=-8,mt=t=>t.toFixed(4),Ut={a1:.55,a2:.28},D0=`
attribute vec3 aColor; attribute vec3 aPivot; attribute vec3 aPivot2; attribute vec4 aAnim; attribute vec2 aFx;
attribute vec3 iPos; attribute vec4 iQuat; attribute vec3 iMisc; attribute vec2 iDrape; attribute vec4 iVar;
uniform float uTime;
vec3 qrot(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
vec3 rotX(vec3 v, float a) { float c = cos(a), s = sin(a); return vec3(v.x, c * v.y - s * v.z, s * v.y + c * v.z); }
float ease(float x) { x = clamp(x, 0.0, 1.0); return x * x * (3.0 - 2.0 * x); }
${he}
// a swimming leg at beat fraction c: the quick spread stroke backward, then the slower folded return. x: angle, y: how far folded
vec2 stroke(float c) {
  float pw = ${mt(st.power)};
  return c < pw ? vec2(mix(${mt(st.fwd)}, ${mt(st.back)}, ease(c / pw)), 0.0) : vec2(mix(${mt(st.back)}, ${mt(st.fwd)}, ease((c - pw) / (1.0 - pw))), sin(3.14159 * (c - pw) / (1.0 - pw)));
}
// walking leg k: angles about the root and about the first knee
vec2 walk(float k, float side, float hov, float t) {
  float w = 6.2832 * (t * 0.30 + k * 0.21) + side * 0.9, m = mix(${mt(st.walkSwim)}, 1.0, hov);
  vec2 a = vec2(0.07 * m * sin(w), 0.11 * m * sin(w + 1.1));
  if (k < 1.5) { float pk = 6.2832 * (t * 0.55 + k * 0.5) + side * 1.3; a = mix(a, vec2(0.30 + 0.08 * sin(pk * 0.5), 0.12 + 0.24 * sin(pk)), hov); }
  return a;
}
void animate(out vec3 P, out vec3 Nn) {
  float kind = aAnim.x, side = aAnim.w, hov = iMisc.z, t = uTime + iMisc.y * 37.0;
  vec3 p = position, n = normal; float zref = p.z;
  if (kind > 3.5) {
    float id = aAnim.y, s = aAnim.z;
    vec3 c = whipPoint(aPivot, id, s, hov, t, side, iDrape), T = whipDir(id, s, hov, t, side, iDrape);
    vec3 ref = normalize(mix(vec3(1.0, 0.0, 0.0), vec3(0.0, 1.0, 0.0), smoothstep(0.5, 0.9, abs(T.x))));
    vec3 cr = cross(T, ref); float cl = dot(cr, cr);
    vec3 N1 = cl > 1e-8 ? cr * inversesqrt(cl) : vec3(0.0, 0.0, 1.0), B1 = cross(T, N1);
    n = N1 * position.x + B1 * position.y;
    // a feeler is never thinner than WHIP_FLOOR metres of the world (its radius, whatever the animal's size), near or far, in light and in shadow
    float rmin = ${ie.toFixed(3)} / max(iMisc.x, 0.0001);
    float tip = clamp((1.0 - s / (id < 0.5 ? ${yt[0].len.toFixed(1)} : id < 1.5 ? ${yt[1].len.toFixed(1)} : ${yt[2].len.toFixed(1)})) * 10.0, 0.0, 1.0);   // and it ends in a point
    p = c + n * max(position.z, rmin * tip); zref = 20.0;
  } else if (kind > 2.5) {
    vec2 a = walk(aAnim.y, side, hov, t); float lower = aAnim.z;
    p = mix(p, aPivot2 + rotX(p - aPivot2, a.y), lower); n = mix(n, rotX(n, a.y), lower);
    p = aPivot + rotX(p - aPivot, a.x); n = rotX(n, a.x); zref = aPivot.z;
  } else if (kind > 1.5) {
    float k = aAnim.y, dist = aAnim.z, lag = (4.0 - k) * 0.2;
    vec2 sw = stroke(fract(t * ${mt(st.swim)} - lag)), sh = stroke(fract(t * ${mt(st.hover)} - lag)) * vec2(${mt(st.hoverAmp)}, 1.0);
    vec2 st = mix(sw, sh, hov);
    p.x = mix(p.x, aPivot.x + (p.x - aPivot.x) * (1.0 - 0.62 * st.y), dist);
    float fold = ${mt(st.fold)} * st.y;
    p = mix(p, aPivot2 + rotX(p - aPivot2, fold), dist); n = mix(n, rotX(n, fold), dist);
    p = aPivot + rotX(p - aPivot, st.x); n = rotX(n, st.x); zref = aPivot.z;
  }
  float q = clamp((4.6 - zref) / 27.6, 0.0, 1.0), sw = 1.0 - hov;
  // THE BODY SWIMS: the wave down the tail part, the fan's beat at its end, the tail part's own set and its slow sway
  float wph = t * ${mt(st.waveRate)} * (0.8 + 0.4 * iVar.x) - ${mt(st.waveLen)} * q + 6.2832 * iVar.y;
  p.y += q * q * (${mt(st.flex)} * sin(t * ${mt(st.flexRate)} + 0.6) + sw * (${mt(st.wave)} * sin(wph) + ${mt(st.set)} * (iVar.z - 0.5)));
  p.y += clamp((${mt(B0)} - zref) / ${mt(W0)}, 0.0, 1.0) * sw * ${mt(st.fan)} * sin(wph - ${mt(st.fanLag)});
  p.x += q * q * sw * (${mt(st.sway)} * sin(t * ${mt(st.swayRate)} + 6.2832 * iVar.w) + ${mt(st.side)} * (iVar.w - 0.5));
  // NO TWO ALIKE: each animal's body slides a little along its own length, its bands, plates and legs with it (so band widths and
  // spacing differ); nothing ahead of z = 15.5 moves (the feelers' roots), nor the tail's end
  float env = smoothstep(-22.5, -17.0, zref) * (1.0 - smoothstep(11.5, 15.5, zref));
  p.z += env * ((iVar.x - 0.5) * ${mt(2*Ut.a1)} * sin(0.37 * zref + iVar.y * 6.2832) + (iVar.z - 0.5) * ${mt(2*Ut.a2)} * sin(0.71 * zref + iVar.w * 6.2832));
  P = p; Nn = n;
}`,ye=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vN; varying vec3 vCol; varying vec3 vWorld; varying vec3 vRest; varying vec4 vFx; varying vec4 vVar; varying vec3 vAxis;
${D0}
void main() {
  vec3 p, n; animate(p, n);
  vec3 w = (modelMatrix * vec4(iPos + qrot(iQuat, p * iMisc.x), 1.0)).xyz;
  vN = normalize(mat3(modelMatrix) * qrot(iQuat, n)); vCol = aColor; vWorld = w; vRest = position; vVar = iVar; vAxis = mat3(modelMatrix) * qrot(iQuat, vec3(0.0, 0.0, 1.0));
  vFx = vec4(aFx, aAnim.x < 0.5 ? n.y : 0.0, aAnim.x > 3.5 ? 1.0 : 0.0);
  vec4 mvPosition = viewMatrix * vec4(w, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,we=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSunDir, uSunColor, uSkyColor, uGroundColor, uAmber;
varying vec3 vN; varying vec3 vCol; varying vec3 vWorld; varying vec3 vRest; varying vec4 vFx; varying vec4 vVar; varying vec3 vAxis;
float hash1(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float vnoise(vec3 x) {
  vec3 i = floor(x), f = fract(x); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash1(i), hash1(i + vec3(1.0, 0.0, 0.0)), f.x), mix(hash1(i + vec3(0.0, 1.0, 0.0)), hash1(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
             mix(mix(hash1(i + vec3(0.0, 0.0, 1.0)), hash1(i + vec3(1.0, 0.0, 1.0)), f.x), mix(hash1(i + vec3(0.0, 1.0, 1.0)), hash1(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z);
}
void main() {
  float nl = dot(vN, vN);
  vec3 n = nl > 1e-8 ? vN * inversesqrt(nl) : vec3(0.0, 1.0, 0.0), V = normalize(cameraPosition - vWorld);
  // vFx.x: 1 a single flat skin (fin, paddle, scale), 0.5 a plate's thin edge; vFx.y: 1 eye, 0.55 and over the shell, less the limbs
  float sheet = step(0.75, vFx.x), thin = clamp(vFx.x * 2.0, 0.0, 1.0) * (1.0 - sheet), shine = clamp(vFx.y, 0.0, 1.0), ny = vFx.z, whip = vFx.w;
  float eye = step(0.9, shine), skin = step(0.55, shine) * (1.0 - eye), limb = (1.0 - skin) * (1.0 - eye) * (1.0 - whip) * (1.0 - sheet);
  if (sheet > 0.5 && dot(n, V) < 0.0) n = -n;
  vec3 alb = vCol;
  // NO TWO ALIKE: this animal's own tone, hue of red, and spots (three numbers from its four)
  float tone = fract(vVar.x * 7.31 + vVar.z * 3.17) - 0.5, hue = fract(vVar.y * 5.71 + vVar.w * 9.13) - 0.5, spotty = fract(vVar.z * 11.3 + vVar.x * 5.9);
  // the shell's own paint inside the red bands: a soft marbling and fine pale spots (fixed to the skin; faded where too small to draw)
  float redAny = clamp((alb.r - alb.g) * 2.4 - 0.45, 0.0, 1.0), red = redAny * skin;
  vec3 q = vRest * (1.2 + 0.5 * spotty) + vVar.xyz * 31.0, ci = floor(q), cf = fract(q);
  float rad = 0.17 + 0.12 * hash1(ci), d = length(cf - (0.3 + 0.4 * vec3(hash1(ci + 7.3), hash1(ci + 13.7), hash1(ci + 21.1))));
  float fw = max(fwidth(q.x), max(fwidth(q.y), fwidth(q.z)));
  float many = 0.45 + 0.55 * fract(vVar.w * 13.7);                                             // how many of the cells hold a spot, on this animal
  float spot = mix((1.0 - smoothstep(rad * 0.7, rad, d)) * step(hash1(ci + 3.1), many), 0.06 * many, smoothstep(0.35, 1.3, fw / rad));
  float marb = vnoise(vRest * 0.55 + vVar.yzx * 23.0) * 0.6 + vnoise(vRest * 1.7 + vVar.zxy * 11.0) * 0.4;
  alb = mix(alb, alb * (0.76 + 0.48 * marb), red * 0.85);
  alb = mix(alb, alb * vec3(1.0, 1.0 + 0.9 * hue, 1.0 - 0.3 * hue), redAny) * (1.0 + 0.10 * tone);
  alb = mix(alb, vec3(0.98, 0.90, 0.80), spot * red * 0.9);
  // a paler, warmer underside; the thin amber glaze of the back
  float under = smoothstep(0.1, 0.8, -ny) * skin, back = clamp(ny, 0.0, 1.0);
  alb = mix(alb, alb * 1.18 + vec3(0.03, 0.006, 0.004), under * 0.7);
  alb = mix(alb, alb * vec3(1.0, 0.86, 0.60), 0.30 * back * back * skin);
  float ndl = dot(n, uSunDir), dif = max(ndl, 0.0), ndv = clamp(dot(n, V), 0.0, 1.0);
  dif = mix(dif, 0.55 + 0.45 * (ndl * 0.5 + 0.5), whip);                                     // a feeler stays white, with a faint grey shade side
  vec3 hemi = mix(uGroundColor, uSkyColor, n.y * 0.5 + 0.5);
  vec3 col = alb * (uSunColor * dif + hemi) * RECIPROCAL_PI;
  // HALF CLEAR: light passes through the fins and paddles, the legs, the plates' thin edges and the shell where it turns away:
  // what lies beyond the animal along the eye's line, and the sun when it stands behind, tinted by the shell (ivory through the clear
  // parts, a deep glowing orange red through the paint: never pink)
  float rim = pow(1.0 - ndv, 3.0);
  float clear = (sheet * 0.36 + thin * 0.5 + limb * (0.08 + 0.30 * rim) + skin * rim * 0.30) * (1.0 - eye) * mix(0.7, 1.0, redAny);
  vec3 beyond = mix(uGroundColor, uSkyColor, clamp(0.5 - 0.5 * V.y, 0.0, 1.0)) * RECIPROCAL_PI * 1.1;
  float toSun = pow(max(dot(V, -uSunDir), 0.0), 4.0);
  vec3 glass = mix(vec3(1.0, 0.94, 0.84), vec3(1.0, 0.15, 0.045), redAny);
  col = mix(col, (beyond + uSunColor * RECIPROCAL_PI * (0.6 * max(-ndl, 0.0) + 0.9 * toSun)) * glass, clear);
  // the sky's sheen on the wet shell where it turns away (a thin glassy line), and the warm amber edge light
  float wet = (skin + limb * 0.7 + sheet * 0.5) * (1.0 - eye), lit = smoothstep(-0.05, 0.15, ndl);
  col += uSkyColor * RECIPROCAL_PI * pow(1.0 - ndv, 5.0) * 0.45 * wet * mix(1.0, 0.35, redAny);
  col += uAmber * uSunColor * rim * (0.35 + 0.65 * lit) * 0.06 * (0.4 + 0.6 * skin) * (1.0 - whip) * (1.0 - eye);
  // a soft knee: sunlit white stays well under the glow of the post chain (its threshold is 0.9), so the wet highlights can sit over it
  float top = max(col.r, max(col.g, col.b)), k0 = mix(0.74, 0.60, redAny), knee = top > k0 ? (k0 + (top - k0) * 0.14) / top : 1.0;   // (the red paint is held deeper: never boiled)
  col *= mix(knee, min(1.0, 0.86 / max(top, 0.001)), whip);
  // WET: the sun's own highlight, a small hard glint inside a soft sheen, laid over (never above 0.88)
  // (taken round the body's own axis more than along it, so it runs as a streak down the wet shell, broken at each plate)
  vec3 hs = V + uSunDir; float hl = dot(hs, hs);
  vec3 H = hl > 1e-8 ? hs * inversesqrt(hl) : n, ax = normalize(vAxis);
  vec3 Hc = normalize(H - ax * dot(H, ax) * 0.8), nc = normalize(n - ax * dot(n, ax) * 0.8);
  float ndh = max(dot(nc, Hc), 0.0), hiK = lit * wet * (1.0 - 0.7 * abs(dot(H, ax)));
  // the glint is all there or not at all (a hard edge; it narrows where the light glances): a half-strength white over red would be pink
  float core = smoothstep(0.46, 0.54, pow(ndh, 60.0) * mix(0.55, 1.0, hiK) * (0.8 + 0.45 * marb)) * step(0.2, hiK), halo = pow(ndh, 22.0) * 0.30;
  vec3 sunTint = uSunColor / max(max(uSunColor.r, uSunColor.g), max(uSunColor.b, 0.001));
  col = mix(col, mix(vec3(0.88), vec3(0.88, 0.10, 0.035), redAny) * sunTint, halo * hiK);     // the sheen keeps the paint's own hue: red stays red
  col = mix(col, sunTint * 0.88, core * 0.95);
  float glint = pow(max(dot(n, normalize(V + vec3(0.0, 0.9, 0.0) + 0.4 * uSunDir)), 0.0), 150.0);
  col = mix(col, vec3(0.88), clamp(glint * 3.0, 0.0, 1.0) * eye);                              // the eye's small highlight
  gl_FragColor = vec4(min(col, vec3(0.89)), 1.0);
  #include <fog_fragment>
}`,xe=`
${D0}
void main() { vec3 p, n; animate(p, n); gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(iPos + qrot(iQuat, p * iMisc.x), 1.0); }`,ge=`
#include <packing>
void main() { gl_FragColor = packDepthToRGBA(gl_FragCoord.z); }`,N0=Math.PI*2,Me=-3.25;function be(t){const e=st.power,o=r=>(r=jt(r),r*r*(3-2*r));return t<e?[gt(st.fwd,st.back,o(t/e)),0]:[gt(st.back,st.fwd,o((t-e)/(1-e))),Math.sin(Math.PI*(t-e)/(1-e))]}function j0(t,e,o,r){const s=N0*(r*.3+t*.21)+e*.9,m=gt(st.walkSwim,1,o);let x=.07*m*Math.sin(s),c=.11*m*Math.sin(s+1.1);if(t<1.5){const l=N0*(r*.55+t*.5)+e*1.3;x=gt(x,.3+.08*Math.sin(l*.5),o),c=gt(c,.12+.24*Math.sin(l),o)}return[x,c]}const Fe=t=>t-Math.floor(t);function s0(t,e,o=0,r=t.count,s=null){s=s||{up:-1e9,down:-1e9,downFore:-1e9,downAft:-1e9,halfWidth:0,front:-1e9,back:-1e9,downRest:-1e9,pick:{down:-1e9,front:-1e9,back:1e9,halfWidth:0}};const m=t.p,x=t.a,c=t.pv,l=t.pv2,h=25,a=1-e,v=M=>{const F=jt((4.6-M)/27.6);return F*F*(st.flex+a*(st.wave+st.set/2))+jt((B0-M)/W0)*a*st.fan},L=M=>{const F=jt((4.6-M)/27.6);return F*F*a*(st.sway+st.side/2)},g=(M,F,C,T,R=C)=>{F+T>s.up&&(s.up=F+T),T-F>s.down&&(s.down=T-F),R>E0?T-F>s.downFore&&(s.downFore=T-F):T-F>s.downAft&&(s.downAft=T-F);const j=(M<0?-M:M)+L(R);j>s.halfWidth&&(s.halfWidth=j),C>s.front&&(s.front=C),-C>s.back&&(s.back=-C)},k=new Float32Array(h*3*5);for(let M=0;M<h;M++)for(let F=0;F<3;F++){const C=M/h,T=(M*3+F)*5;let R,j,Q=1;if(F===0){const p=be(C);R=p[0]*gt(1,st.hoverAmp,e),j=st.fold*p[1],Q=1-.62*p[1]}else{const p=F===1?j0(2,0,e,C/.3):j0(0,0,e,gt(1.3,2,e)*C/gt(.3,.55,e));R=p[0],j=p[1]}k[T]=Math.cos(R),k[T+1]=Math.sin(R),k[T+2]=Math.cos(j),k[T+3]=Math.sin(j),k[T+4]=Q}for(let M=o;M<r;M++){const F=x[M*4],C=m[M*3],T=m[M*3+1],R=m[M*3+2];if(F>3.5)continue;if(F<1.5){const $=v(R);g(C,T,R,$),$-T>s.downRest&&(s.downRest=$-T);continue}const j=x[M*4+1],Q=x[M*4+2],p=c[M*3],q=c[M*3+1],Y=c[M*3+2],Z=l[M*3],at=l[M*3+1],et=l[M*3+2],ft=v(Y),lt=(F<2.5?0:j<1.5?2:1)*5;for(let $=0;$<h;$++){const E=$*15+lt,G=k[E],ut=k[E+1],ot=k[E+2],pt=k[E+3];let Rt=C,Mt=T,Lt=R;if(Q>.5){F<2.5&&(Rt=p+(C-p)*k[E+4]);const zt=Mt-at,Xt=Lt-et;Mt=at+ot*zt-pt*Xt,Lt=et+pt*zt+ot*Xt}const Ct=Mt-q,t0=Lt-Y;if(Mt=q+G*Ct-ut*t0,Lt=Y+ut*Ct+G*t0,g(Rt,Mt,Lt,ft,Y),F>2.5&&j<1.5){const zt=s.pick;ft-Mt>zt.down&&(zt.down=ft-Mt),Lt>zt.front&&(zt.front=Lt),Lt<zt.back&&(zt.back=Lt),Math.abs(Rt)>zt.halfWidth&&(zt.halfWidth=Math.abs(Rt))}else ft-Mt>s.downRest&&(s.downRest=ft-Mt)}}return s}function G0(t,e,o,r,s){const m=[0,0,0],x=22,c=48,l=yt[0],h=[],a=[];for(let v=0;v<=x;v++){const L=l.len*Math.pow(v/x,1.15),g=I0(0,L),k=[];let M=0,F=0,C=0;for(let R=0;R<c;R++)T0(0,L,t,R*1.731,r,e,o,m),k.push([m[0],m[1],m[2]]),M+=m[0],F+=m[1],C+=m[2],s&&s(m,g);M/=c,F/=c,C/=c;let T=0;for(const R of k)T=Math.max(T,Math.hypot(R[0]-M,R[1]-F,R[2]-C));h.push([M,F,C,T*1.1+g+.15]);for(const R of k)a.push([R[0],R[1],R[2],g])}return{line:h,all:a}}function l0(t,e=1e3,o=0){const r=[0,0,0],s=48,m=yt[0],x={xMax:0,yMin:1e9,yMax:-1e9,zMin:1e9,zMax:-1e9,reach:0},c=(p,q)=>{x.xMax=Math.max(x.xMax,Math.abs(p[0])+q),x.yMin=Math.min(x.yMin,p[1]-q),x.yMax=Math.max(x.yMax,p[1]+q),x.zMin=Math.min(x.zMin,p[2]-q),x.zMax=Math.max(x.zMax,p[2]+q),x.reach=Math.max(x.reach,Math.hypot(p[0],p[1],p[2])+q)},{line:l,all:h}=G0(t,e,o,1,c),a=l.length-1,v=(p,q,Y)=>{let Z=q[0]-p[0],at=q[1]-p[1],et=q[2]-p[2];const ft=Math.hypot(Z,at,et);Z/=ft,at/=ft,et/=ft;let lt=0,$=0;for(const E of Y){const G=(E[0]-p[0])*Z+(E[1]-p[1])*at+(E[2]-p[2])*et;G+E[3]>lt&&(lt=G+E[3])}for(const E of Y){const G=Math.min(lt,Math.max(0,(E[0]-p[0])*Z+(E[1]-p[1])*at+(E[2]-p[2])*et));$=Math.max($,Math.hypot(E[0]-p[0]-Z*G,E[1]-p[1]-at*G,E[2]-p[2]-et*G)+E[3])}return{dir:[Z,at,et],length:lt+.3,spread:$*1.05+.3}},L=l[a],g=v(m.root,L,h),k=v([0,m.root[1],m.root[2]],[0,L[1],L[2]],h);g.line=l;const M=[];let F=0,C=0,T=0,R=0;for(let p=1;p<=2;p++)for(let q=1;q<=6;q++)for(let Y=0;Y<s;Y+=2){const Z=yt[p].len*q/6;T0(p,Z,t,Y*1.731,1,e,o,r),M.push([r[0],r[1],r[2],yt[p].r0]),c(r,yt[p].r0),q===6&&(C+=r[1],T+=r[2],R++)}const j=[0,.8,20.1],Q=v(j,[0,C/R,T/R],M);return{box:x,each:g,mid:k,short:Q,shortRoot:j}}const wt=t=>Math.round(t*100)/100,ke=t=>Math.round(t*1e4)/1e4;function J0(t,e,o,r){const s=(a,v)=>({downNoPick:wt(a.downRest+.1),pick:{down:wt(a.pick.down+.1),front:wt(a.pick.front+.1+Ut.a1+Ut.a2),back:wt(a.pick.back-.1-Ut.a1-Ut.a2),halfWidth:wt(a.pick.halfWidth+.1)},halfLength:wt(Math.max(a.front,a.back)+.05),up:wt(a.up+.1),down:wt(a.down+.1),downFore:wt(a.downFore+.1),downAft:wt(a.downAft+.1),aftZ:E0,halfWidth:wt(a.halfWidth+.1),front:wt(a.front+.05),back:wt(a.back+.05),feelerUp:wt(v.box.yMax+.4),feelerDown:wt(-v.box.yMin+.4),feelerFront:wt(v.box.zMax+.4),feelerBack:wt(-v.box.zMin+.4),feelerHalfWidth:wt(v.box.xMax+.4),feelerReach:wt(v.box.reach+.4)}),m=s(t,o),x=s(e,r),c=a=>({dir:a.dir.map(ke),length:wt(a.length),spread:wt(a.spread)}),l=a=>({...c(a.each),line:a.each.line.map(v=>v.map(wt))}),h=yt[0];return{halfLength:Math.max(m.halfLength,x.halfLength),up:Math.max(m.up,x.up),down:Math.max(m.down,x.down),halfWidth:Math.max(m.halfWidth,x.halfWidth),upSwim:m.up,upHover:x.up,downSwim:m.down,downHover:x.down,halfWidthSwim:m.halfWidth,halfWidthHover:x.halfWidth,bellyLine:Me,feelerReach:Math.max(m.feelerReach,x.feelerReach),swim:m,hover:x,feeler:{root:[0,h.root[1],h.root[2]],length:h.len,swim:c(o.mid),hover:c(r.mid),each:{root:h.root.slice(),swim:l(o),hover:l(r)},short:{root:o.shortRoot.slice(),length:yt[1].len,swim:c(o.short),hover:c(r.short)}}}}function ze(t,e){if(e===1)return t;const o=(r,s)=>typeof r=="number"?wt(r*e):Array.isArray(r)?s==="dir"?r.slice():r.map(m=>o(m,"")):r&&typeof r=="object"?Object.fromEntries(Object.entries(r).map(([m,x])=>[m,o(x,m)])):r;return o(t,"")}function Ae(t){return J0(s0(t,0),s0(t,1),l0(0),l0(1))}const Se=()=>{const t={};for(const e in Yt)t[e]=new I.Color(Yt[e]);return t};async function Pe(t,e=["near","far"]){const o={},r=async()=>{t&&t.yield&&await t.yield()};let s=null;for(const m of e){const x=H0[Qt(m)],c=new qt,l=Se(),h=q0(c,x,l,!0);if(await r(),h(),await r(),v0(c,x,l),await r(),w0(c,x,l),await r(),x0(c,x,l),g0(c,x,l),await r(),!s){const a=R=>c.a[R*4]>1.5&&c.a[R*4]<3.5,v=[0];let L=0,g=0,k=null,M=null;for(let R=0;R<c.count;R++)a(R)&&L++;const F=Math.max(1,Math.ceil(L/5));for(let R=0;R<c.count;R++)a(R)&&++g%F===0&&v.push(R+1);v[v.length-1]!==c.count&&v.push(c.count);for(let R=1;R<v.length;R++)k=s0(c,0,v[R-1],v[R],k),await r();for(let R=1;R<v.length;R++)M=s0(c,1,v[R-1],v[R],M),await r();const C=l0(0);await r();const T=l0(1);await r(),s=J0(k,M,C,T)}o[Qt(m)]={builder:c,bounds:s}}return o}function $e(t,e,o,r,s){const m=t+"|"+e+"|"+o;let x=2166136261;for(let c=0;c<m.length;c++)x=Math.imul(x^m.charCodeAt(c),16777619);for(let c=0;c<4;c++){x=x+1831565813|0;let l=Math.imul(x^x>>>15,1|x);l=l+Math.imul(l^l>>>7,61|l)^l,r[s+c]=((l^l>>>14)>>>0)/4294967296}}function Le(t,e={}){const o=Math.max(1,e.count|0||1),r=e.length??o0,s=Qt(e.detail),m=r/o0,x=e.prepared&&e.prepared[s],c=x?x.builder:ve(s),l=c.triangles,h=c.build(),a=ze(x?x.bounds:Ae(c),m),v=new I.InstancedBufferGeometry;v.index=h.index;for(const $ in h.attributes)v.setAttribute($,h.attributes[$]);const L=new I.InstancedBufferAttribute(new Float32Array(o*3),3),g=new I.InstancedBufferAttribute(new Float32Array(o*4),4),k=new I.InstancedBufferAttribute(new Float32Array(o*3),3),M=new I.InstancedBufferAttribute(new Float32Array(o*2),2),F=new I.InstancedBufferAttribute(new Float32Array(o*4),4),C=String(t&&t.seed!=null?t.seed:0),T=String(e.seedKey??s);for(let $=0;$<o;$++)g.array[$*4+3]=1,M.array[$*2]=1e3,e.variety!==!1?$e(C,T,$,F.array,$*4):F.array.fill(.5,$*4,$*4+4);v.setAttribute("iPos",L),v.setAttribute("iQuat",g),v.setAttribute("iMisc",k),v.setAttribute("iDrape",M),v.setAttribute("iVar",F),v.instanceCount=o;const R=(e.sun?e.sun.clone():new I.Vector3(-.5,.78,.38)).normalize(),j=e.bounce??.8,Q=new I.Color(e.townColor??"#d8cfbf"),p=I.UniformsUtils.merge([I.UniformsLib.fog,{uTime:{value:0},uSunDir:{value:R},uAmber:{value:new I.Color(Yt.amber)},uSunColor:{value:e.sunColor?new I.Color(e.sunColor):new I.Color("#fff1dc").multiplyScalar(3)},uSkyColor:{value:e.skyColor?new I.Color(e.skyColor):new I.Color("#bcd6f5").multiplyScalar(1.4)},uGroundColor:{value:new I.Color}}]);let q=e.groundColor?new I.Color(e.groundColor):null;const Y=()=>{const $=p.uGroundColor.value;$.copy(p.uSunColor.value).multiplyScalar(Math.max(.15,p.uSunDir.value.y)).add(p.uSkyColor.value).multiply(Q).multiplyScalar(j),q&&($.r=Math.max($.r,q.r),$.g=Math.max($.g,q.g),$.b=Math.max($.b,q.b))};Y();const Z=new I.ShaderMaterial({uniforms:p,vertexShader:ye,fragmentShader:we,fog:!0,side:I.DoubleSide}),at=new I.ShaderMaterial({uniforms:{uTime:p.uTime},vertexShader:xe,fragmentShader:ge,side:I.DoubleSide}),et=new I.Mesh(v,Z);et.frustumCulled=!1,et.customDepthMaterial=at,et.castShadow=e.castShadow!==!1,et.receiveShadow=!1,et.name="shrimps-"+s;const ft=new I.Group;return ft.add(et),{object:ft,mesh:et,material:Z,depthMaterial:at,count:o,length:r,triangles:l,drawCalls:1,bounds:a,detail:s,setPose($,E,G,ut=1,ot=0,pt=0){$<0||$>=o||(L.array[$*3]=E.x,L.array[$*3+1]=E.y,L.array[$*3+2]=E.z,g.array[$*4]=G.x,g.array[$*4+1]=G.y,g.array[$*4+2]=G.z,g.array[$*4+3]=G.w,k.array[$*3]=ut*m,k.array[$*3+1]=ot,k.array[$*3+2]=Math.min(1,Math.max(0,pt)))},commit(){L.needsUpdate=!0,g.needsUpdate=!0,k.needsUpdate=!0,M.needsUpdate=!0},variety($){return F.array.subarray($*4,$*4+4)},setVariety($,E){if($<0||$>=o)return;const G=F.array,ut=$*4;G[ut]===E[0]&&G[ut+1]===E[1]&&G[ut+2]===E[2]&&G[ut+3]===E[3]||(G[ut]=E[0],G[ut+1]=E[1],G[ut+2]=E[2],G[ut+3]=E[3],F.needsUpdate=!0)},setDrape($,E,G=0){$<0||$>=o||(M.array[$*2]=E>0?Math.max(E/m,St.rho+St.rho2+.5):1e3,M.array[$*2+1]=G)},feelerLines($){const E=k.array[$*3],G=k.array[$*3+2],ut=M.array[$*2],ot=M.array[$*2+1],pt=[],Rt=new I.Quaternion(g.array[$*4],g.array[$*4+1],g.array[$*4+2],g.array[$*4+3]),Mt=new I.Vector3;for(const Lt of[1,-1])pt.push(G0(G,ut,ot,Lt).line.map(Ct=>(Mt.set(Ct[0],Ct[1],Ct[2]).multiplyScalar(E).applyQuaternion(Rt),[Mt.x+L.array[$*3],Mt.y+L.array[$*3+1],Mt.z+L.array[$*3+2],Ct[3]*E])));return pt},update($,E){p.uTime.value=E},setLight($={}){$.sun&&p.uSunDir.value.copy($.sun).normalize(),$.sunColor&&p.uSunColor.value.copy($.sunColor),$.skyColor&&p.uSkyColor.value.copy($.skyColor),$.groundColor&&(q=new I.Color($.groundColor)),Y()},setLightFromScene($){let E=!1,G=!1;const ut=new I.Color(0,0,0),ot=new I.Color(0,0,0);$.traverse(pt=>{pt.isDirectionalLight&&!E?(E=!0,p.uSunDir.value.copy(pt.position).sub(pt.target.position).normalize(),p.uSunColor.value.copy(pt.color).multiplyScalar(pt.intensity)):pt.isHemisphereLight&&!G?(G=!0,ut.copy(pt.color).multiplyScalar(pt.intensity)):pt.isAmbientLight&&ot.add(pt.color.clone().multiplyScalar(pt.intensity))}),(G||ot.r+ot.g+ot.b>0)&&p.uSkyColor.value.copy(ut).add(ot),Y()},dispose(){v.dispose(),h.dispose(),Z.dispose(),at.dispose(),ft.remove(et)}}}async function Re(t,e={}){const o=Qt(e.detail),r=await Pe(t,[o]),s=Le(t,{count:1,length:e.length??o0,seedKey:"hero",...e,detail:o,prepared:r});t&&t.yield&&await t.yield();const m=e.hover??0,x=s.length/o0;return s.setPose(0,new I.Vector3(0,0,0),new I.Quaternion,1,e.phase??0,m),s.commit(),{object:s.object,radius:30*x,height:24*x,center:new I.Vector3(0,0,-6*x),ground:!1,anchors:{bounds:s.bounds,nose:new I.Vector3(0,.6*x,23*x),tail:new I.Vector3(0,-4*x,-23*x),belly:new I.Vector3(0,-3*x,8*x)},shoal:s,update(c,l){s.update(c,l)},dispose(){s.dispose()}}}const M0=(()=>{const t=Math.PI*2,e=i=>i.toFixed(5),o=(i,f,n)=>Math.min(n,Math.max(f,i)),r=(i,f,n)=>i+(f-i)*n,s=(i,f,n)=>{const d=o((n-i)/(f-i),0,1);return d*d*(3-2*d)},m=i=>{const f=new I.Color(i);return[f.r,f.g,f.b]};function x(i,f,n,d,b){const A=i+"|"+f+"|"+n;let y=2166136261;for(let w=0;w<A.length;w++)y=Math.imul(y^A.charCodeAt(w),16777619);for(let w=0;w<4;w++){y=y+1831565813|0;let u=Math.imul(y^y>>>15,1|y);u=u+Math.imul(u^u>>>7,61|u)^u,d[b+w]=((u^u>>>14)>>>0)/4294967296}}class c{constructor(){this.p=[],this.n=[],this.c=[],this.ct=[],this.a=[],this.fx=[],this.idx=[],this.sg=[],this.cur={col:[1,1,1],coat:null,amount:0,a:[0,0,0,0],fx:[0,0],sg:0}}get count(){return this.p.length/3}get triangles(){return this.idx.length/3}set(f){return Object.assign(this.cur,f),this}v(f,n,d,b){const A=this.cur,y=b&&b.col||A.col,w=b&&b.amount!=null?b.amount:A.amount,u=b&&b.a||A.a,_=b&&b.fx||A.fx,z=A.coat;return this.p.push(f,n,d),this.n.push(0,1,0),this.c.push(y[0],y[1],y[2]),z?this.ct.push(f*z[0]+z[1],n*z[0]+z[2],d*z[0]+z[3],w):this.ct.push(0,0,0,0),this.a.push(u[0],u[1],u[2],u[3]),this.fx.push(_[0],_[1]),this.sg.push(A.sg),this.p.length/3-1}quad(f,n,d,b){this.idx.push(f,n,d,f,d,b)}tri(f,n,d){this.idx.push(f,n,d)}bridge(f,n){const d=f.length;for(let b=0;b<d;b++){const A=(b+1)%d;this.quad(f[b],f[A],n[A],n[b])}}fan(f,n,d){const b=f.length;for(let A=0;A<b;A++){const y=(A+1)%b;d?this.tri(n,f[y],f[A]):this.tri(n,f[A],f[y])}}smooth(f,n){const d=this.p,b=this.n,A=this.idx,y=this.count;for(let u=f*3;u<y*3;u++)b[u]=0;for(let u=n;u<A.length;u+=3){const _=A[u]*3,z=A[u+1]*3,B=A[u+2]*3,D=d[z]-d[_],W=d[z+1]-d[_+1],V=d[z+2]-d[_+2],K=d[B]-d[_],ht=d[B+1]-d[_+1],S=d[B+2]-d[_+2],P=W*S-V*ht,H=V*K-D*S,O=D*ht-W*K;for(const U of[_,z,B])b[U]+=P,b[U+1]+=H,b[U+2]+=O}const w=new Map;for(let u=f;u<y;u++){const _=Math.round(d[u*3]*2e3)+","+Math.round(d[u*3+1]*2e3)+","+Math.round(d[u*3+2]*2e3)+","+this.sg[u];let z=w.get(_);z||(z=[0,0,0,[]],w.set(_,z)),z[0]+=b[u*3],z[1]+=b[u*3+1],z[2]+=b[u*3+2],z[3].push(u)}for(const u of w.values()){const _=Math.hypot(u[0],u[1],u[2])||1;for(const z of u[3])b[z*3]=u[0]/_,b[z*3+1]=u[1]/_,b[z*3+2]=u[2]/_}}ball(f,n,d,b,A,y,w,u,_){const z=[];for(let B=0;B<=u;B++){const D=B/u*Math.PI,W=Math.cos(D),V=Math.sin(D),K=[];if(B===0||B===u){z.push([this.v(f,n+W*A,d,_)]);continue}for(let ht=0;ht<w;ht++){const S=ht/w*t;K.push(this.v(f+Math.cos(S)*V*b,n+W*A,d+Math.sin(S)*V*y,_))}z.push(K)}for(let B=0;B<u;B++)for(let D=0;D<w;D++){const W=(D+1)%w,V=z[B],K=z[B+1];V.length===1?this.tri(V[0],K[W],K[D]):K.length===1?this.tri(V[D],V[W],K[0]):this.quad(V[D],V[W],K[W],K[D])}}build(){const f=new I.BufferGeometry;return f.setAttribute("position",new I.Float32BufferAttribute(this.p,3)),f.setAttribute("normal",new I.Float32BufferAttribute(this.n,3)),f.setAttribute("aColor",new I.Float32BufferAttribute(this.c,3)),f.setAttribute("aCoat",new I.Float32BufferAttribute(this.ct,4)),f.setAttribute("aAnim",new I.Float32BufferAttribute(this.a,4)),f.setAttribute("aFx",new I.Float32BufferAttribute(this.fx,2)),f.setIndex(this.idx),f}}function l(i,f,n,d,b,A,y,w,u,_){const z=[],B=Math.cos(d),D=Math.sin(d),W=V=>Math.sign(V)*Math.pow(Math.abs(V),u);for(let V=0;V<w;V++){const K=V/w*t,ht=Math.cos(K),S=Math.sin(K),P=b*W(S),H=(ht>=0?A:y)*W(ht);z.push(i.v(P,f+H*B,n+H*D,_?_(V,ht,S):null))}return z}const h={cream:m("#ead6a6"),pale:m("#f1e4c4"),mane:m("#70401f"),hoof:m("#2b2521"),tuft:m("#1f1915"),horn:m("#33271f"),muzzle:m("#5f4b3c"),eye:m("#0b0908"),ear:m("#e3c79f")},a={stride:5.2,hf:.2,girth:.14,C0:[2.35,.05],pitch:.075,phPitch:.02,bob:.06,phBob:.93,Nb:[2.55,-.85],neck:.15,phNeck:.06,headK:.62,Pp:[4.6,-2.15],carry:.16,reach:.1,Tr:[2.52,1.09],tail0:.38,tail1:1.3,tailW:.32,phTail:.15,flick:.75,fore:{H:[2.42,-.62],J:[1.06,-.62],K:[.2,-.62],x:.21,bend:1,give:[.17,.12],zc:-.6,duty:.3,lift:.72,off:[.46,.55]},hind:{H:[2.3,.74],J:[1.13,1.12],K:[.2,.95],x:.3,bend:-1,give:[0,.13],zc:.77,duty:.3,lift:.46,off:[0,.09]}};for(const i of[a.fore,a.hind])i.L1=Math.hypot(i.J[0]-i.H[0],i.J[1]-i.H[1]),i.L2=Math.hypot(i.K[0]-i.J[0],i.K[1]-i.J[1]),i.a1=Math.atan2(-(i.J[1]-i.H[1]),-(i.J[0]-i.H[0])),i.a2=Math.atan2(-(i.K[1]-i.J[1]),-(i.K[0]-i.J[0]));const v=(i,f,n,d)=>{const b=Math.cos(n),A=Math.sin(n);return d[0]=b*i-A*f,d[1]=A*i+b*f,d},L=i=>a.pitch*Math.sin(t*(i-a.phPitch));function g(i,f,n,d){return v(i-a.C0[0],f-a.C0[1],L(n),d),d[0]+=a.C0[0]+a.bob*Math.cos(t*(n-a.phBob)),d[1]+=a.C0[1],d}function k(i,f,n){const d=.5*a.stride*i.duty;if(f<i.duty)return n[0]=a.hf,n[1]=i.zc-d+a.stride*f,n[2]=0,n;const b=(f-i.duty)/(1-i.duty),A=a.stride*(1-i.duty),y=b*b,w=y*b,u=Math.sin(Math.PI*b);return n[0]=a.hf+i.lift*u*(.55+.45*u),n[1]=(i.zc+d)*(2*w-3*y+1)+(i.zc-d)*(3*y-2*w)+A*(2*w-3*y+b),n[2]=s(0,.22,b)*(1-s(.78,1,b)),n}const M=[0,0],F=[0,0,0],C=[0,0];function T(i,f,n,d){const b=n-i.off[f>0?1:0],A=k(i,b-Math.floor(b),F),y=g(i.H[0],i.H[1],n,M);let w=A[0]-y[0],u=A[1]-y[1],_=Math.max(Math.hypot(w,u),1e-4);w/=_,u/=_;const z=(i.L1+i.L2)*.9996,B=o(z-_,-i.give[1],i.give[0]);y[0]-=w*B,y[1]-=u*B,_+=B;const D=o(_,Math.abs(i.L1-i.L2)+.001,i.L1+i.L2-1e-4),W=o((i.L1*i.L1+D*D-i.L2*i.L2)/(2*i.L1*D),-1,1),V=Math.atan2(-u,-w)+i.bend*Math.acos(W);d.Jy=y[0]-i.L1*Math.cos(V),d.Jz=y[1]-i.L1*Math.sin(V);const K=Math.atan2(-(A[1]-d.Jz),-(A[0]-d.Jy));return d.Fy=A[0],d.Fz=A[1],d.th1=V-i.a1,d.th2=K-i.a2,d.th3=A[2]*(d.th2-a.flick*A[2]),d.miss=Math.abs(Math.hypot(A[0]-d.Jy,A[1]-d.Jz)-i.L2),d.Hy=y[0],d.Hz=y[1],d.knee=V-K,d}const R={};function j(i,f,n,d,b,A,y,w,u,_){const z=C;let B=A,D=y;if(i>2.5){const W=f,V=-(a.tail0+a.tail1*W+a.tailW*W*Math.sin(t*(w-a.phTail)-2.4*W));v(B-a.Tr[0],D-a.Tr[1],V,z),B=a.Tr[0]+z[0],D=a.Tr[1]+z[1]}else if(i>1.5){const W=a.neck*Math.sin(t*(w-a.phNeck))+(u-.5)*a.carry,V=W*s(0,.5,f);n>.5&&(v(B-a.Pp[0],D-a.Pp[1],-a.headK*W,z),B=a.Pp[0]+z[0],D=a.Pp[1]+z[1]);const K=1+a.reach*.5*s(0,.5,f);v(B-a.Nb[0],D-a.Nb[1],V,z),B=a.Nb[0]+z[0]*K,D=a.Nb[1]+z[1]*K}else if(i>.5){const W=f>1.5?a.hind:a.fore,V=T(W,d,w,R);return n>1.5?(v(B-W.K[0],D-W.K[1],V.th3,z),_[0]=b,_[1]=V.Fy+z[0],_[2]=V.Fz+z[1],_):(v(B-W.J[0],D-W.J[1],r(V.th1,V.th2,n),z),_[0]=b,_[1]=V.Jy+z[0],_[2]=V.Jz+z[1],_)}return g(B,D,w,z),_[0]=b*(1+a.girth*.5),_[1]=z[0],_[2]=z[1],_}const Q=[[1.16,2.28,0,.06,.08,.1],[1.1,2.26,0,.2,.24,.26],[.98,2.25,0,.31,.33,.36],[.8,2.25,0,.375,.37,.4],[.5,2.3,0,.4,.385,.36],[.2,2.34,0,.42,.43,.41],[-.1,2.37,0,.43,.51,.47],[-.38,2.4,0,.43,.6,.54],[-.62,2.44,8,.41,.64,.58],[-.84,2.52,24,.38,.6,.6],[-1.02,2.66,40,.34,.52,.56],[-1.19,2.86,51,.295,.42,.47],[-1.36,3.1,56,.25,.335,.375],[-1.56,3.42,58,.205,.265,.29],[-1.76,3.75,59,.17,.215,.228],[-1.94,4.06,60,.14,.18,.17],[-2.08,4.32,62,.12,.155,.145],[-2.17,4.5,64,.105,.135,.125],[-2.22,4.6,64,.07,.09,.085]],p=8,q=[4.69,-2.08],Y=[4.4,-2.76],Z=[[0,.06,.075,.075],[.07,.11,.13,.135],[.2,.13,.168,.17],[.36,.128,.142,.175],[.52,.104,.102,.15],[.68,.086,.084,.115],[.82,.08,.082,.096],[.93,.075,.074,.082],[1,.05,.045,.056]],at=[[0,-.08,.085,.13,0,1],[0,.02,.125,.2,0,1],[0,.2,.13,.2,0,1],[0,.37,.115,.165,0,1],[0,.56,.095,.125,0,1],[0,.76,.076,.092,0,.92],[0,.92,.066,.074,0,.82],[0,.965,.082,.097,.25,.76,0,-.012],[1,0,.09,.108,.5,.7,0,-.016],[1,.055,.08,.092,.75,.64,0,-.01],[1,.14,.058,.063,1,.55],[1,.5,.05,.054,1,.3],[1,.86,.05,.055,1,.06],[1,1,.066,.072,1,0],[2,.4,.055,.06,2,0],[2,.56,.072,.088,2,0],[2,.56,.072,.088,2,0,"hoof"],[2,1,.086,.108,2,0,"hoof"]],et=[[0,-.12,.09,.17,0,1,0,-.02],[0,0,.15,.33,0,1,0,-.05],[0,.22,.15,.3,0,1,0,-.1],[0,.45,.125,.215,0,1,0,-.085],[0,.66,.095,.14,0,.95,0,-.035],[0,.82,.075,.1,0,.88],[0,.93,.064,.08,0,.8],[0,.965,.074,.096,.25,.76,0,.012],[1,0,.08,.108,.5,.7,0,.022],[1,.055,.072,.092,.75,.64,0,.012],[1,.14,.056,.065,1,.55],[1,.5,.05,.056,1,.3],[1,.86,.05,.056,1,.06],[1,1,.066,.072,1,0],[2,.4,.055,.06,2,0],[2,.56,.07,.084,2,0],[2,.56,.07,.084,2,0,"hoof"],[2,1,.082,.102,2,0,"hoof"]],ft={near:{body:16,bodyRings:null,head:12,headRings:null,leg:10,legRings:null,horn:5,ear:!0,eye:[6,4],mane:!0,tail:[5,6]},shadow:{body:6,bodyRings:[0,2,4,6,8,10,12,15,18],head:4,headRings:[0,2,5,8],leg:4,legRings:[0,3,8,13,17],horn:0,ear:!1,eye:null,mane:!1,tail:[3,3]}},lt=2.7,$=5.2,E=8;function G(i){const f=ft[i==="shadow"?"shadow":"near"],n=new c,d=Math.PI/180;let b=n.count,A=n.idx.length,y=null;n.set({col:h.cream,coat:[lt,0,0,0],amount:1,fx:[0,0],sg:0});const w=f.bodyRings||Q.map((S,P)=>P),u=Q.length-1;for(const S of w){const P=Q[S],H=S<=p?0:(S-p)/(u-p),O=S<=p?[0,0,0,0]:[2,H,0,0],U=S<=p?.85:r(.5,.12,s(0,.4,H)),N=l(n,P[1],P[0],P[2]*d,P[3],P[4],P[5],f.body,.9,(nt,ct)=>{const tt=s(.35,.95,-ct);return{a:O,amount:1-U*tt,col:h.cream.map((dt,it)=>r(dt,h.pale[it],tt))}});y?n.bridge(y,N):n.fan(N,n.v(0,P[1],P[0]+.03,{a:O,amount:1}),!0),y=N,S===u&&n.fan(N,n.v(0,P[1]+.03,P[0]-.02,{a:O,amount:1}),!1)}n.smooth(b,A),b=n.count,A=n.idx.length,y=null;const _=Math.atan2(Y[0]-q[0],-(Y[1]-q[1])),z=[2,1,1,0],B=[Math.cos(_),Math.sin(_)],D=(S,P=0)=>[r(q[0],Y[0],S)+B[0]*P,r(q[1],Y[1],S)+B[1]*P];n.set({col:h.cream,coat:[E,0,0,0],amount:1,a:z,sg:0});const W=f.headRings||Z.map((S,P)=>P);for(const S of W){const P=Z[S],H=D(P[0]),O=s(.5,.82,P[0]),U=l(n,H[0],H[1],_,P[1],P[2],P[3],f.head,.92,(N,nt)=>({amount:(1-O)*(.85-.5*s(.2,.9,-nt))*s(0,.1,P[0]),col:h.cream.map((ct,tt)=>r(r(ct,h.pale[tt],s(.2,.9,-nt)),h.muzzle[tt],O*.9))}));if(y)n.bridge(y,U);else{const N=D(P[0]-.035);n.fan(U,n.v(0,N[0],N[1],{amount:0}),!0)}if(y=U,S===Z.length-1){const N=D(1.035,-.005);n.fan(U,n.v(0,N[0],N[1],{amount:0,col:h.muzzle}),!1)}}if(n.smooth(b,A),f.horn)for(const S of[-1,1]){b=n.count,A=n.idx.length,y=null;const P=D(.17,.1),H=[S*.1,.965,.24],O=[[0,.04,h.cream,.5],[.15,.034,h.cream,.4],[.21,.035,h.horn,0],[.255,.042,h.horn,0],[.288,.028,h.horn,0]];n.set({coat:[E,0,0,0],a:z,sg:0});for(const[U,N,nt,ct]of O){const tt=[],dt=S*.062+H[0]*U,it=P[0]+H[1]*U,rt=P[1]+H[2]*U;for(let At=0;At<f.horn;At++){const xt=At/f.horn*t;tt.push(n.v(dt+Math.sin(xt)*N,it-H[2]*Math.cos(xt)*N,rt+H[1]*Math.cos(xt)*N,{col:nt,amount:ct}))}y&&n.bridge(tt,y),y=tt}n.fan(y,n.v(S*.062+H[0]*.3,P[0]+H[1]*.3,P[1]+H[2]*.3,{col:h.horn,amount:0}),!0),n.smooth(b,A)}if(f.ear)for(const S of[-1,1]){b=n.count,A=n.idx.length,y=null;const P=D(.1,.045),H=[S*.93,.26,.26];n.set({col:h.ear,coat:null,amount:0,a:z,sg:0});for(const[U,N]of[[0,.034],[.08,.062],[.17,.058],[.245,.03]]){const nt=S*.085+H[0]*U,ct=P[0]+H[1]*U,tt=P[1]+H[2]*U,dt=.014,it=[n.v(nt,ct+N,tt-.2*N),n.v(nt,ct+.1*N,tt-dt-.5*N,{col:h.pale}),n.v(nt,ct-N,tt+.2*N),n.v(nt,ct,tt+dt+.25*N)];y&&(S>0?n.bridge(it,y):n.bridge(y,it)),y=it}const O=n.v(S*.085+H[0]*.29,P[0]+H[1]*.29,P[1]+H[2]*.29);n.fan(y,O,S>0),n.smooth(b,A)}if(f.eye){for(const S of[-1,1]){b=n.count,A=n.idx.length;const P=D(.33,.035);n.set({col:h.eye,coat:null,amount:0,a:z,fx:[1,0],sg:0}),n.ball(S*.112,P[0],P[1],.026,.032,.038,f.eye[0],f.eye[1]),n.smooth(b,A)}n.set({fx:[0,0]})}if(f.mane){b=n.count,A=n.idx.length,y=null,n.set({col:h.mane,coat:null,amount:0,sg:1});for(let S=p;S<=u-1;S++){const P=Q[S],H=P[2]*d,O=Math.cos(H),U=Math.sin(H),N=S<=p?0:(S-p)/(u-p),nt=S<=p?[0,0,0,0]:[2,N,0,0],ct=S===p?0:S===u-1?.035:.075,tt=P[4]*.93,dt=.045,it=[n.v(-dt,P[1]+tt*O,P[0]+tt*U,{a:nt}),n.v(0,P[1]+(P[4]+ct)*O,P[0]+(P[4]+ct)*U,{a:nt}),n.v(dt,P[1]+tt*O,P[0]+tt*U,{a:nt})];y&&(n.quad(y[0],y[1],it[1],it[0]),n.quad(y[1],y[2],it[2],it[1])),y=it}n.smooth(b,A)}b=n.count,A=n.idx.length,y=null;const V=1.02,K=f.tail[0],ht=f.tail[1]===3?[[0,.04,0],[.62,.03,0],[.8,.07,1],[1,.012,1]]:[[0,.042,0],[.2,.032,0],[.42,.026,0],[.62,.024,0],[.64,.03,1],[.74,.062,1],[.88,.05,1],[1,.012,1]];n.set({col:h.cream,coat:[$,3.3,1.7,.9],amount:.6,sg:0});for(const[S,P,H]of ht){const O=[];for(let U=0;U<K;U++){const N=U/K*t;O.push(n.v(Math.sin(N)*P,a.Tr[0]-S*V,a.Tr[1]-Math.cos(N)*P,{a:[3,S,0,0],col:H?h.tuft:h.cream,amount:H?0:.6*(1-S)}))}y&&n.bridge(y,O),y=O}return n.fan(y,n.v(0,a.Tr[0]-V-.02,a.Tr[1],{a:[3,1,0,0],col:h.tuft,amount:0}),!1),n.smooth(b,A),[a.fore,a.hind].forEach((S,P)=>{const H=P?et:at,O=[S.H,S.J,S.K,[0,S.K[1]]],U=f.legRings||H.map((N,nt)=>nt);for(const N of[-1,1]){const nt=P*2+(N>0?1:0),ct=N*S.x;b=n.count,A=n.idx.length,y=null,n.set({col:h.cream,coat:[$,nt*7.3+2.1,nt*3.1,nt*5.7],amount:1,sg:0});const tt=dt=>{const it=O[dt[0]],rt=O[dt[0]+1];return[r(it[0],rt[0],dt[1]),r(it[1],rt[1],dt[1])]};U.forEach((dt,it)=>{const rt=H[dt],At=tt(rt),xt=tt(H[U[Math.max(0,it-1)]]),Pt=tt(H[U[Math.min(U.length-1,it+1)]]);let vt=Pt[0]-xt[0],bt=Pt[1]-xt[1];const It=Math.hypot(vt,bt)||1;vt/=It,bt/=It,rt[0]===2&&(vt=-1,bt=0);const Tt=rt[6]==="hoof",Nt=rt[0]===2?-.018*rt[1]:0,J=s(.75,.3,rt[5]),Ft=Tt?h.hoof:h.cream.map((kt,a0)=>r(kt,h.pale[a0],J)),$t=[];for(let kt=0;kt<f.leg;kt++){const a0=kt/f.leg*t,_0=Math.cos(a0),ne=Math.sin(a0);$t.push(n.v(ct+ne*rt[2]*N,At[0]+_0*rt[3]*-bt,At[1]+Nt+(rt[7]||0)+_0*rt[3]*vt,{a:[1,P*2,rt[4],N],amount:rt[5],col:Ft,fx:Tt?[.35,0]:[0,0]}))}if(y)N>0?n.bridge(y,$t):n.bridge($t,y);else{const kt=tt([0,rt[1]-.07]);n.fan($t,n.v(ct,kt[0],kt[1],{a:[1,P*2,0,N],amount:1}),N<0)}y=$t,it===U.length-1&&n.fan($t,n.v(ct,0,At[1]+Nt,{a:[1,P*2,2,N],amount:0,col:h.hoof}),N>0)}),n.smooth(b,A)}}),n}const ut=`
attribute vec3 aColor; attribute vec4 aCoat; attribute vec4 aAnim; attribute vec2 aFx;
attribute vec3 iPos; attribute vec4 iQuat; attribute vec4 iMisc; attribute vec4 iVar;
uniform float uTime;
vec3 qrot(vec4 q, vec3 v) { return v + 2.0 * cross(q.xyz, cross(q.xyz, v) + q.w * v); }
// turns (y, z) about the animal's own x: a + angle carries what hangs down toward -z (forward)
vec2 rot2(vec2 v, float a) { float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }
// the angle of a (y, z) direction from straight down, + toward -z
float ang(vec2 d) { return abs(d.x) + abs(d.y) > 1e-6 ? atan(-d.y, -d.x) : 0.0; }
`,ot=i=>`vec2(${e(i[0])}, ${e(i[1])})`,pt=`
${ut}
float gPitch(float ph) { return ${e(a.pitch)} * sin(6.2831853 * (ph - ${e(a.phPitch)})); }
vec2 gTrunk(vec2 v, float ph) { return ${ot(a.C0)} + rot2(v - ${ot(a.C0)}, gPitch(ph)) + vec2(${e(a.bob)} * cos(6.2831853 * (ph - ${e(a.phBob)})), 0.0); }
// the fetlock of a leg at its own beat q (0 the foot comes down, duty it leaves, 1 it comes down again): (y, z, swing)
vec3 gFoot(float q, float zc, float duty, float inv, float lift) {
  float hs = ${e(.5*a.stride)} * duty;
  if (q < duty) return vec3(${e(a.hf)}, zc - hs + ${e(a.stride)} * q, 0.0);
  float u = clamp((q - duty) * inv, 0.0, 1.0), m = ${e(a.stride)} * (1.0 - duty), u2 = u * u, u3 = u2 * u, sb = sin(3.14159265 * u);
  return vec3(${e(a.hf)} + lift * sb * (0.55 + 0.45 * sb), (zc + hs) * (2.0 * u3 - 3.0 * u2 + 1.0) + (zc - hs) * (3.0 * u2 - 2.0 * u3) + m * (2.0 * u3 - 3.0 * u2 + u),
    smoothstep(0.0, 0.22, u) * (1.0 - smoothstep(0.78, 1.0, u)));
}
void animate(out vec3 P, out vec3 Nn) {
  float kind = aAnim.x, ph = iMisc.y;
  vec3 p = position, n = normal;
  if (kind > 2.5) {
    // the tail streams: each ring turns about the root by its own angle, a wave running down it with the stride
    float s = aAnim.y, a = -(${e(a.tail0)} + ${e(a.tail1)} * s + ${e(a.tailW)} * s * sin(6.2831853 * (ph - ${e(a.phTail)}) - 2.4 * s));
    p.yz = ${ot(a.Tr)} + rot2(p.yz - ${ot(a.Tr)}, a); n.yz = rot2(n.yz, a);
  } else if (kind > 1.5) {
    // the neck pumps with the stride (and each animal carries it a little higher or lower); the head stays near level
    float nk = ${e(a.neck)} * sin(6.2831853 * (ph - ${e(a.phNeck)})) + (iVar.w - 0.5) * ${e(a.carry)}, a = nk * smoothstep(0.0, 0.5, aAnim.y);
    if (aAnim.z > 0.5) { p.yz = ${ot(a.Pp)} + rot2(p.yz - ${ot(a.Pp)}, -${e(a.headK)} * nk); n.yz = rot2(n.yz, -${e(a.headK)} * nk); }
    // (and each animal's neck is a little longer or shorter: it grows from the withers)
    p.yz = ${ot(a.Nb)} + rot2(p.yz - ${ot(a.Nb)}, a) * (1.0 + ${e(a.reach)} * (fract(iVar.x * 7.31 + iVar.w * 3.17) - 0.5) * smoothstep(0.0, 0.5, aAnim.y)); n.yz = rot2(n.yz, a);
  } else if (kind > 0.5) {
    // a leg: its fetlock is put where the stride has it, and the two bones are laid between the body and that place
    bool hind = aAnim.y > 1.5; float w = aAnim.z;
    vec2 H = hind ? ${ot(a.hind.H)} : ${ot(a.fore.H)}, J = hind ? ${ot(a.hind.J)} : ${ot(a.fore.J)}, K = hind ? ${ot(a.hind.K)} : ${ot(a.fore.K)};
    float L1 = hind ? ${e(a.hind.L1)} : ${e(a.fore.L1)}, L2 = hind ? ${e(a.hind.L2)} : ${e(a.fore.L2)}, A1 = hind ? ${e(a.hind.a1)} : ${e(a.fore.a1)}, A2 = hind ? ${e(a.hind.a2)} : ${e(a.fore.a2)};
    float bend = hind ? ${e(a.hind.bend)} : ${e(a.fore.bend)}, giveA = hind ? ${e(a.hind.give[0])} : ${e(a.fore.give[0])}, giveB = hind ? ${e(a.hind.give[1])} : ${e(a.fore.give[1])};
    float off = hind ? (aAnim.w > 0.0 ? ${e(a.hind.off[1])} : ${e(a.hind.off[0])}) : (aAnim.w > 0.0 ? ${e(a.fore.off[1])} : ${e(a.fore.off[0])});
    vec3 ft = gFoot(fract(ph - off), hind ? ${e(a.hind.zc)} : ${e(a.fore.zc)}, hind ? ${e(a.hind.duty)} : ${e(a.fore.duty)}, hind ? ${e(1/(1-a.hind.duty))} : ${e(1/(1-a.fore.duty))}, hind ? ${e(a.hind.lift)} : ${e(a.fore.lift)});
    vec2 Hp = gTrunk(H, ph), t = ft.xy - Hp; float d = max(length(t), 1e-4); t = t * (1.0 / d);
    float sl = clamp((L1 + L2) * 0.9996 - d, -giveB, giveA); Hp -= t * sl; d += sl;
    float dc = clamp(d, abs(L1 - L2) + 1e-3, L1 + L2 - 1e-4);
    float a1 = ang(t) + bend * acos(clamp((L1 * L1 + dc * dc - L2 * L2) / max(2.0 * L1 * dc, 1e-4), -1.0, 1.0));
    vec2 Jp = Hp - L1 * vec2(cos(a1), sin(a1));
    float th1 = a1 - A1, th2 = ang(ft.xy - Jp) - A2;
    if (w > 1.5) { float th3 = ft.z * (th2 - ${e(a.flick)} * ft.z); p.yz = ft.xy + rot2(p.yz - K, th3); n.yz = rot2(n.yz, th3); }
    else { float th = mix(th1, th2, w); p.yz = Jp + rot2(p.yz - J, th); n.yz = rot2(n.yz, th); }
    P = p; Nn = n; return;
  }
  p.x *= 1.0 + ${e(a.girth)} * (iVar.z - 0.5);   // each animal's own build: a little broader or narrower through barrel and neck
  p.yz = gTrunk(p.yz, ph); n.yz = rot2(n.yz, gPitch(ph));
  P = p; Nn = n;
}`,Rt=i=>`
#include <common>
#include <fog_pars_vertex>
#ifdef BEAST_SHADOW
#include <shadowmap_pars_vertex>
#endif
varying vec3 vN; varying vec3 vCol; varying vec3 vWorld; varying vec4 vCoat; varying vec4 vVar; varying vec3 vFx; varying vec3 vRest; varying vec3 vRestN;
${i}
void main() {
  vec3 p, n; animate(p, n);
  vec3 w = (modelMatrix * vec4(iPos + qrot(iQuat, p * iMisc.x), 1.0)).xyz;
  vN = mat3(modelMatrix) * qrot(iQuat, n); vCol = aColor;
  #ifdef BEAST_SHADOW
  // where this place of the skin lies in the sun's shadow picture (the engine's own lookup)
  vec4 worldPosition = vec4(w, 1.0);
  vec3 transformedNormal = mat3(viewMatrix) * (vN * inversesqrt(max(dot(vN, vN), 1e-12)));
  #include <shadowmap_vertex>
  #endif
  vWorld = w; vCoat = aCoat; vVar = iVar; vFx = vec3(aFx, aAnim.x); vRest = position; vRestN = normal;
  vec4 mvPosition = viewMatrix * vec4(w, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Mt=i=>`
${i}
void main() { vec3 p, n; animate(p, n); gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(iPos + qrot(iQuat, p * iMisc.x), 1.0); }`,Lt=`
#include <packing>
void main() { gl_FragColor = packDepthToRGBA(gl_FragCoord.z); }`,Ct=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSunDir, uSunColor, uSkyColor, uGroundColor;
#ifdef BEAST_SHADOW
uniform bool receiveShadow;
#include <packing>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
#endif
varying vec3 vN; varying vec3 vCol; varying vec3 vWorld; varying vec4 vCoat; varying vec4 vVar; varying vec3 vFx; varying vec3 vRest; varying vec3 vRestN;
// how much of the sun reaches this place: 1 in the open, 0 in the shadow of a house, of another animal or of the animal itself
float sunReach() {
  #ifdef BEAST_SHADOW
  return getShadowMask();
  #else
  return 1.0;
  #endif
}
vec3 hash3(vec3 p) { p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx) * p.zyx); }
`,t0=`
${Ct}
void main() {
  float nl = dot(vN, vN);
  vec3 n = nl > 1e-8 ? vN * inversesqrt(nl) : vec3(0.0, 1.0, 0.0);
  if (!gl_FrontFacing) n = -n;
  vec3 vd = cameraPosition - vWorld; float vl = dot(vd, vd);
  vec3 V = vl > 1e-8 ? vd * inversesqrt(vl) : vec3(0.0, 0.0, 1.0);
  float amount = vCoat.w, tone = vVar.x;
  vec3 q = vCoat.xyz * (0.86 + 0.32 * vVar.y) + vVar.xyz * 61.0;
  vec3 ci = floor(q), cf = fract(q), p1 = vec3(0.0), p2 = vec3(0.0);
  float d1 = 9.0, d2 = 9.0, id = 0.0;
  for (int k = -1; k <= 1; k++) for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
    vec3 g = vec3(float(i), float(j), float(k)), o = hash3(ci + g), r = g + 0.5 + 0.82 * (o - 0.5) - cf;
    float d = dot(r, r);
    if (d < d1) { d2 = d1; p2 = p1; d1 = d; p1 = r; id = o.x + o.y; } else if (d < d2) { d2 = d; p2 = r; }
  }
  vec3 dv = p2 - p1; float dl = dot(dv, dv);
  // how far to the wall between this patch and its neighbour, measured along the skin (a wall that meets the skin aslant
  // would else draw a broad line): the skin's own normal as built is taken out of the wall's
  vec3 wn = dl > 1e-6 ? dv * inversesqrt(dl) : vec3(1.0, 0.0, 0.0);
  float rl = dot(vRestN, vRestN), across = rl > 1e-8 ? dot(vRestN, wn) * inversesqrt(rl) : 0.0;
  float edge = (d2 - d1) * 0.5 * inversesqrt(max(dl, 1e-6)) * inversesqrt(max(1.0 - across * across, 0.05));
  float fw = max(fwidth(q.x), max(fwidth(q.y), fwidth(q.z)));
  float wl = 0.045 + 0.03 * vVar.z + (1.0 - amount) * 0.42;                         // half the cream line; it widens where the coat thins (legs, belly)
  float spot = smoothstep(wl - 0.6 * fw, wl + 0.6 * fw + 0.03, edge);
  float cover = clamp(1.0 - wl * 2.1, 0.0, 1.0);
  spot = mix(spot, cover * cover, smoothstep(0.3, 0.9, fw)) * step(0.004, amount); // (where a patch is too small to draw, its share of the two colours)
  vec3 pc = mix(vec3(0.39, 0.155, 0.050), vec3(0.135, 0.046, 0.019), tone);
  pc *= (0.84 + 0.32 * fract(id * 7.31)) * (1.0 - 0.16 * smoothstep(0.02, 0.28, edge - wl));
  pc = mix(vCol * vec3(0.92, 0.72, 0.5), pc, 0.35 + 0.65 * smoothstep(0.0, 0.8, amount));
  vec3 alb = mix(vCol * (0.96 + 0.08 * tone), pc, spot);
  float shine = vFx.x;
  float ndl = dot(n, uSunDir), ndv = clamp(dot(n, V), 0.0, 1.0);
  float dif = mix(max(ndl, 0.0), clamp((ndl + 0.22) * 0.82, 0.0, 1.0), 0.5);         // a coat is soft: the light wraps a little round the turn
  vec3 hemi = mix(uGroundColor, uSkyColor, n.y * 0.5 + 0.5);
  float sun = sunReach();
  vec3 col = alb * (uSunColor * dif * sun + hemi) * RECIPROCAL_PI;
  float rim = 1.0 - ndv; rim = rim * rim * rim;
  col += alb * uSunColor * RECIPROCAL_PI * 0.22 * rim * smoothstep(-0.2, 0.4, ndl) * (1.0 - shine) * sun;   // the nap's faint sheen where the coat turns from the eye
  vec3 hs = V + uSunDir; float hl = dot(hs, hs);
  float ndh = hl > 1e-8 ? max(dot(n, hs * inversesqrt(hl)), 0.0) : 0.0, g2 = ndh * ndh, g8 = g2 * g2 * g2 * g2, g64 = g8 * g8 * g8 * g8 * g8 * g8 * g8 * g8;
  col += uSunColor * RECIPROCAL_PI * 0.5 * g64 * shine * step(0.0, ndl) * sun;                // the eye's and the hoof's small light
  float top = max(col.r, max(col.g, col.b)), knee = top > 0.70 ? (0.70 + (top - 0.70) * 0.22) / top : 1.0;
  gl_FragColor = vec4(min(col * knee, vec3(0.89)), 1.0);
  #include <fog_fragment>
}`,zt=new I.Quaternion,Xt=new I.Vector3,b0=new I.Vector3,k0=new I.Vector3,O0=new I.Matrix4;function z0(i,f,n){const d=Math.max(1,f.count|0||1),b=f.detail==="shadow",A=b?n.shadow:n.near,y=A.build(),w=new I.InstancedBufferGeometry;w.index=y.index;for(const J in y.attributes)w.setAttribute(J,y.attributes[J]);const u=new I.InstancedBufferAttribute(new Float32Array(d*3),3),_=new I.InstancedBufferAttribute(new Float32Array(d*4),4),z=new I.InstancedBufferAttribute(new Float32Array(d*4),4),B=new I.InstancedBufferAttribute(new Float32Array(d*4),4),D=String(i&&i.seed!=null?i.seed:0),W=String(f.seedKey??n.name);for(let J=0;J<d;J++)_.array[J*4+3]=1,x(D,W,J,B.array,J*4);const V={iPos:u,iQuat:_,iMisc:z,iVar:B};for(const J in V)w.setAttribute(J,V[J]);w.instanceCount=d;const K=(f.sun?f.sun.clone():new I.Vector3(-.23,.33,-.92)).normalize(),ht=f.bounce??.8,S=new I.Color(f.townColor??"#d8cfbf"),P=f.receiveShadow!==!1,H=I.UniformsUtils.merge([I.UniformsLib.fog,P?I.UniformsLib.lights:{},{uTime:{value:0},uSunDir:{value:K},uSunColor:{value:f.sunColor?new I.Color(f.sunColor):new I.Color("#ffd49a").multiplyScalar(3)},uSkyColor:{value:f.skyColor?new I.Color(f.skyColor):new I.Color("#bcd6f5").multiplyScalar(1.2)},uGroundColor:{value:new I.Color}}]),O=new I.Color(0,0,0),U=new I.Color,N=new I.Color,nt=new I.Color;f.groundColor&&O.set(f.groundColor);const ct=()=>{const J=H.uGroundColor.value;J.copy(H.uSunColor.value).multiplyScalar(Math.max(.15,H.uSunDir.value.y)).add(H.uSkyColor.value).multiply(S).multiplyScalar(ht*n.bounce),J.r=Math.max(J.r,O.r),J.g=Math.max(J.g,O.g),J.b=Math.max(J.b,O.b)};ct();let tt=!1,dt=!1;const it=J=>{J.isDirectionalLight&&!tt?(tt=!0,H.uSunDir.value.copy(J.position).sub(J.target.position).normalize(),H.uSunColor.value.copy(J.color).multiplyScalar(J.intensity)):J.isHemisphereLight&&!dt?(dt=!0,U.copy(J.color).multiplyScalar(J.intensity)):J.isAmbientLight&&N.add(nt.copy(J.color).multiplyScalar(J.intensity))},rt=new I.ShaderMaterial({uniforms:H,vertexShader:Rt(n.anim),fragmentShader:n.frag,fog:!0,lights:P,side:I.DoubleSide,defines:P?{BEAST_SHADOW:1}:{}}),At=new I.ShaderMaterial({uniforms:{uTime:H.uTime},vertexShader:Mt(n.anim),fragmentShader:Lt,side:I.DoubleSide}),xt=new I.Mesh(w,rt);xt.frustumCulled=!1,xt.customDepthMaterial=At,xt.castShadow=b&&f.castShadow!==!1,xt.receiveShadow=P,xt.name=n.name+(b?"-shadow":"");const Pt=new I.Group;Pt.name=n.name,Pt.add(xt);let vt=null,bt=null,It=null,Tt=null;if(f.castShadow!==!1&&!b){It=n.shadow.build(),bt=new I.InstancedBufferGeometry,bt.index=It.index;for(const J in It.attributes)bt.setAttribute(J,It.attributes[J]);for(const J in V)bt.setAttribute(J,V[J]);bt.instanceCount=0,Tt=new I.ShaderMaterial({uniforms:{uTime:H.uTime},vertexShader:Mt(n.anim),fragmentShader:Lt,side:I.DoubleSide,colorWrite:!1,depthWrite:!1}),vt=new I.Mesh(bt,Tt),vt.frustumCulled=!1,vt.customDepthMaterial=At,vt.castShadow=!0,vt.receiveShadow=!1,vt.name=n.name+"-shade",vt.onBeforeShadow=()=>{bt.instanceCount=d},vt.onBeforeRender=()=>{bt.instanceCount=0},Pt.add(vt)}return{api:{object:Pt,mesh:xt,material:rt,depthMaterial:At,shadowMesh:vt,count:d,bounds:n.bounds,triangles:A.triangles,shadowTriangles:n.shadow.triangles,drawCalls:1,commit(){u.needsUpdate=!0,_.needsUpdate=!0,z.needsUpdate=!0},update(J,Ft){H.uTime.value=Ft},variety(J,Ft){const $t=B.array,kt=J*4;return Ft?(Ft[0]=$t[kt],Ft[1]=$t[kt+1],Ft[2]=$t[kt+2],Ft[3]=$t[kt+3],Ft):$t.subarray(kt,kt+4)},setLight(J){J&&(J.sun&&H.uSunDir.value.copy(J.sun).normalize(),J.sunColor&&H.uSunColor.value.copy(J.sunColor),J.skyColor&&H.uSkyColor.value.copy(J.skyColor),J.groundColor&&O.set(J.groundColor),ct())},setLightFromScene(J){tt=!1,dt=!1,U.setRGB(0,0,0),N.setRGB(0,0,0),J.traverse(it),(dt||N.r+N.g+N.b>0)&&H.uSkyColor.value.copy(U).add(N),ct()},dispose(){w.dispose(),y.dispose(),rt.dispose(),At.dispose(),vt&&(bt.dispose(),It.dispose(),Tt.dispose(),Pt.remove(vt)),Pt.remove(xt)}},iPos:u,iQuat:_,iMisc:z,count:d}}const Vt=i=>Math.round(i*100)/100;function A0(i,f=0,n=i.count,d=null){d=d||{up:0,front:0,back:0,halfWidth:0,head:0,tail:0,down:0};const b=i.p,A=i.a,y=24,w=[0,0,0];for(let u=f;u<n;u++){const _=A[u*4];for(let z=0;z<y;z++)for(let B=0;B<=1;B++)_<1.5&&B||_>2.5&&B||(j(_,A[u*4+1],A[u*4+2],A[u*4+3],b[u*3],b[u*3+1],b[u*3+2],z/y,B,w),w[1]>d.up&&(d.up=w[1]),-w[1]>d.down&&(d.down=-w[1]),Math.abs(w[0])>d.halfWidth&&(d.halfWidth=Math.abs(w[0])),-w[2]>d.front&&(d.front=-w[2]),w[2]>d.back&&(d.back=w[2]))}return d}function S0(i){return{height:Vt(i.up+.03),length:Vt(i.front+i.back+.06),halfWidth:Vt(i.halfWidth+.03),stride:a.stride,headFront:Vt(i.front+.03),tailBack:Vt(i.back+.03),shoulder:3.07,duty:a.fore.duty,beats:{hind:a.hind.off.slice(),fore:a.fore.off.slice()}}}const _t={giraffe:null,ladybird:null};function P0(i,f,n){return{name:"giraffes",near:i,shadow:f,bounds:n,anim:pt,frag:t0,bounce:1}}async function K0(i){const f=async()=>{i&&i.yield&&await i.yield()};if(!_t.giraffe){const n=G("near");await f();const d=G("shadow");await f();let b=null;const A=Math.ceil(n.count/6);for(let y=0;y<n.count;y+=A)b=A0(n,y,Math.min(n.count,y+A),b),await f();_t.giraffe=P0(n,d,S0(b))}return _t.ladybird||(_t.ladybird=await ae(f),await f()),_t}function U0(i,f={}){if(!_t.giraffe){const w=G("near");_t.giraffe=P0(w,G("shadow"),S0(A0(w)))}const{api:n,iPos:d,iQuat:b,iMisc:A,count:y}=z0(i,f,_t.giraffe);return n.setPose=(w,u,_,z,B=0,D=0,W=1)=>{w<0||w>=y||(d.array[w*3]=u,d.array[w*3+1]=_,d.array[w*3+2]=z,b.array[w*4]=0,b.array[w*4+1]=Math.sin(B*.5),b.array[w*4+2]=0,b.array[w*4+3]=Math.cos(B*.5),A.array[w*4]=W,A.array[w*4+1]=D-Math.floor(D))},n}const Bt={red:m("#d3231b"),black:m("#0e0d0c"),pale:m("#f4eedc"),feeler:m("#3a2a1c")},X={stride:1.2,duty:.6,lift:.17,ankle:.07,bob:.018,roll:.02,tilt:.95,ze0:-.7,ze1:1.6,rim:.13,legs:[{hip:[.26,.3,-1.02],foot:[1.02,-1.5],L1:.52,L2:.64,lag:0},{hip:[.3,.3,-.55],foot:[1.5,-.45],L1:.62,L2:.76,lag:.04},{hip:[.3,.3,-.15],foot:[1.26,.86],L1:.8,L2:.94,lag:.08}]};for(const i of X.legs){const f=i.foot[0]-i.hip[0],n=i.foot[1]-i.hip[2],d=Math.hypot(f,n),b=X.ankle-i.hip[1],A=Math.hypot(b,d);i.dir0=[f/d,n/d],i.r0=d;const y=Math.atan2(d,-b)+Math.acos(o((i.L1*i.L1+A*A-i.L2*i.L2)/(2*i.L1*A),-1,1));i.H=[i.hip[1],0],i.J=[i.hip[1]-i.L1*Math.cos(y),-i.L1*Math.sin(y)],i.K=[X.ankle,-d],i.a1=y,i.a2=Math.atan2(-(i.K[1]-i.J[1]),-(i.K[0]-i.J[0]))}const X0=(i,f)=>(i===1!=f<0?.5:0)+X.legs[i].lag;function Y0(i,f,n){const d=.5*X.stride*X.duty,b=i.foot[1];if(f<X.duty)return n[0]=X.ankle,n[1]=b-d+X.stride*f,n[2]=0,n;const A=(f-X.duty)/(1-X.duty),y=X.stride*(1-X.duty),w=A*A,u=w*A,_=Math.sin(Math.PI*A);return n[0]=X.ankle+X.lift*_*(.55+.45*_),n[1]=(b+d)*(2*u-3*w+1)+(b-d)*(3*w-2*u)+y*(2*u-3*w+A),n[2]=s(0,.25,A)*(1-s(.75,1,A)),n}function Z0(i,f,n,d,b,A,y,w){const u=X.legs[i],_=y-X0(i,f),z=Y0(u,_-Math.floor(_),F),B=u.hip[0]*f,D=u.foot[0]*f;let W=D-B,V=z[1]-u.hip[2];const K=Math.max(Math.hypot(W,V),1e-4);W/=K,V/=K;let ht=z[0]-u.H[0],S=-K;const P=Math.max(Math.hypot(ht,S),1e-4);ht/=P,S/=P;const H=o(P,Math.abs(u.L1-u.L2)+.001,u.L1+u.L2-1e-4),O=Math.atan2(-S,-ht)+Math.acos(o((u.L1*u.L1+H*H-u.L2*u.L2)/(2*u.L1*H),-1,1)),U=u.H[0]-u.L1*Math.cos(O),N=-u.L1*Math.sin(O),nt=O-u.a1,ct=Math.atan2(-(-K-N),-(z[0]-U))-u.a2,tt=C;if(n>1.5){v(b-u.K[0],A-u.K[1],-o((z[0]-X.ankle)*3,0,.5),tt);const Ft=-tt[1],$t=u.dir0[0]*f,kt=u.dir0[1];return w[0]=D+$t*Ft-kt*d,w[1]=z[0]+tt[0],w[2]=z[1]+kt*Ft+$t*d,w}v(b-u.J[0],A-u.J[1],r(nt,ct,n),tt);const dt=-(N+tt[1]),it=W*dt-V*d,rt=U+tt[0]-u.hip[1],At=V*dt+W*d;let xt=D-B,Pt=z[0]-u.hip[1],vt=z[1]-u.hip[2];const bt=Math.max(Math.hypot(xt,Pt,vt),1e-4);xt/=bt,Pt/=bt,vt/=bt;const It=X.tilt*f*(i>1.5?-1:1),Tt=Math.cos(It),Nt=Math.sin(It),J=(xt*it+Pt*rt+vt*At)*(1-Tt);return w[0]=B+it*Tt+(Pt*At-vt*rt)*Nt+xt*J,w[1]=u.hip[1]+rt*Tt+(vt*it-xt*At)*Nt+Pt*J,w[2]=u.hip[2]+At*Tt+(xt*rt-Pt*it)*Nt+vt*J,w}function h0(i,f){const n=i<.38?1.25*(1-.2*Math.pow((.38-i)/.38,2)):1.25*Math.sqrt(Math.max(0,1-Math.pow((i-.38)/.62,2))),d=i<.4?1.5-.5*Math.pow((.4-i)/.4,2):X.rim+(1.5-X.rim)*Math.pow(Math.max(0,1-Math.pow((i-.4)/.6,2)),.45),b=Math.sin(f),A=Math.cos(f);return[n*Math.sign(b)*Math.pow(Math.abs(b),.85),X.rim+(d-X.rim)*Math.pow(Math.max(A,0),.8),r(X.ze0,X.ze1,i)]}const Wt=[[.075,0,.25],[.27,60,.2],[.5,28,.28],[.77,50,.22]].map(([i,f,n])=>{const d=h0(i,f*Math.PI/180);return[d[0],d[1],d[2],n]}),$0=(()=>{const i=h0(.012,24*Math.PI/180);return[i[0],i[1],i[2],.105]})(),Q0={near:{dome:[0,.07,.18,.3,.42,.55,.68,.8,.9,.97],across:14,shield:8,head:6,leg:4,feelers:!0},shadow:{dome:[0,.3,.62,.93],across:6,shield:4,head:0,leg:3,feelers:!1,shieldRows:[0,2,4]}};function e0(i){const f=Q0[i==="shadow"?"shadow":"near"],n=new c,d=(y,w,u,_,z)=>{let B=n.count,D=n.idx.length;const W=[];n.set({col:w,coat:null,amount:0,a:[0,0,0,0],fx:[1,u],sg:0});for(const S of y)W.push(S.map(P=>n.v(P[0],P[1],P[2])));for(let S=0;S+1<W.length;S++)for(let P=0;P+1<W[S].length;P++)n.quad(W[S][P],W[S+1][P],W[S+1][P+1],W[S][P+1]);if(z){const S=y[y.length-1],P=n.v(0,z[0],z[1]),H=W[W.length-1];for(let O=0;O+1<H.length;O++)n.tri(P,H[O+1],H[O])}if(n.smooth(B,D),B=n.count,D=n.idx.length,n.set({col:Bt.black,fx:[.6,1],sg:1}),_){const S=y[0],P=n.v(0,_[0],_[1]),H=S.map(O=>n.v(O[0],O[1],O[2]));for(let O=0;O+1<H.length;O++)n.tri(P,H[O],H[O+1]);n.tri(P,H[H.length-1],H[0])}n.smooth(B,D),B=n.count,D=n.idx.length,n.set({sg:2});const V=y[0].length-1,K=y.map(S=>n.v(S[0][0],S[0][1],S[0][2])),ht=y.map(S=>n.v(S[V][0],S[V][1],S[V][2]));for(let S=0;S+1<y.length;S++)n.quad(K[S],ht[S],ht[S+1],K[S+1]);if(z){const S=n.v(0,z[0],z[1]);n.tri(K[y.length-1],ht[y.length-1],S)}n.smooth(B,D)},b=(y,w)=>{const u=[];for(let _=0;_<=w;_++)u.push(y(-Math.PI/2+Math.PI*_/w));return u};d(f.dome.map(y=>b(w=>h0(y,w),f.across)),Bt.red,0,[.6,X.ze0],[X.rim,X.ze1]);const A=(y,w,u,_)=>z=>{const B=Math.sin(z),D=Math.cos(z);return[w*Math.sign(B)*Math.pow(Math.abs(B),.8),_+(u-_)*Math.pow(Math.max(D,0),.75),y]};if(d([[-.6,1,1],[-.84,.95,.9],[-1.08,.8,.7],[-1.24,.62,.5],[-1.31,.44,.36]].filter((y,w)=>!f.shieldRows||f.shieldRows.includes(w)).map(([y,w,u])=>b(A(y,w,u,.14),f.shield)).reverse(),Bt.black,2,[.3,-1.31],null),f.head&&d([[-1.24,.4,.5],[-1.42,.4,.47],[-1.55,.3,.37]].map(([y,w,u])=>b(A(y,w,u,.15),f.head)).reverse().concat([]),Bt.black,3,[.27,-1.6],null),X.legs.forEach((y,w)=>{for(const u of[-1,1]){const _=n.count,z=n.idx.length,B=f.leg,D=[.03,y.K[1]-.27];n.set({col:Bt.black,coat:null,amount:0,fx:[.6,1],sg:0});const W=[[y.H,.095,0],[y.J,.085,.5],[y.K,.058,1],[y.K,.05,2],[D,.024,2]].slice(0,f.feelers?5:3);let V=null;W.forEach(([K,ht,S],P)=>{const H=W[Math.max(0,P-1)][0],O=W[Math.min(W.length-1,P+1)][0];let U=O[0]-H[0],N=O[1]-H[1];const nt=Math.hypot(U,N)||1;U/=nt,N/=nt,P>=3&&(U=0,N=-1),P===2&&(U=-1,N=0);const ct=[];for(let tt=0;tt<B;tt++){const dt=tt/B*t,it=Math.cos(dt),rt=Math.sin(dt);ct.push(n.v(rt*ht,K[0]+it*ht*-N,K[1]+it*ht*U,{a:[1,w,S,u]}))}V&&n.bridge(V,ct),V=ct}),f.feelers?n.fan(V,n.v(0,D[0],D[1]-.03,{a:[1,w,2,u]}),!1):n.fan(V,n.v(0,y.K[0]-.05,y.K[1],{a:[1,w,1,u]}),!1),n.smooth(_,z)}}),f.feelers)for(const y of[-1,1]){const w=n.count,u=n.idx.length;let _=null;n.set({col:Bt.feeler,coat:null,amount:0,fx:[.3,1],sg:0});const z=[.17,.33,-1.52],B=[.55,.42,-.72],D=Math.hypot(B[0],B[1],B[2]);for(const[W,V]of[[0,.03],[.26,.024],[.4,.045],[.5,.02]]){const K=[y*(z[0]+B[0]/D*W),z[1]+B[1]/D*W,z[2]+B[2]/D*W],ht=[];for(let S=0;S<3;S++){const P=S/3*t;ht.push(n.v(K[0]+Math.cos(P)*V,K[1]+Math.sin(P)*V*.8,K[2]+Math.sin(P)*V*.5,{a:[2,W/.5,0,y]}))}_&&n.bridge(_,ht),_=ht}n.smooth(w,u)}return n}const Et=i=>`vec3(${e(i[0])}, ${e(i[1])}, ${e(i[2])})`,Ht=i=>`(k < 0.5 ? ${i(X.legs[0])} : k < 1.5 ? ${i(X.legs[1])} : ${i(X.legs[2])})`,te=`
${ut}
// the ankle of a leg at its own beat q (0 the foot comes down, duty it leaves): (y, z, swing)
vec3 lFoot(float q, float zc) {
  float hs = ${e(.5*X.stride*X.duty)};
  if (q < ${e(X.duty)}) return vec3(${e(X.ankle)}, zc - hs + ${e(X.stride)} * q, 0.0);
  float u = clamp((q - ${e(X.duty)}) * ${e(1/(1-X.duty))}, 0.0, 1.0), m = ${e(X.stride*(1-X.duty))}, u2 = u * u, u3 = u2 * u, sb = sin(3.14159265 * u);
  return vec3(${e(X.ankle)} + ${e(X.lift)} * sb * (0.55 + 0.45 * sb), (zc + hs) * (2.0 * u3 - 3.0 * u2 + 1.0) + (zc - hs) * (3.0 * u2 - 2.0 * u3) + m * (2.0 * u3 - 3.0 * u2 + u),
    smoothstep(0.0, 0.25, u) * (1.0 - smoothstep(0.75, 1.0, u)));
}
void animate(out vec3 P, out vec3 Nn) {
  float kind = aAnim.x, ph = iMisc.y, side = aAnim.w;
  vec3 p = position, n = normal;
  if (kind > 0.5 && kind < 1.5) {
    // a leg, built in its own upright plane (x across, y up, z = minus the way out from the hip): its ankle is put where the
    // walk has it, the thigh and shin are laid between hip and ankle with the knee up, and the plane is turned to face the foot
    float k = aAnim.y, w = aAnim.z;
    vec3 hip = ${Ht(i=>Et(i.hip))}; vec2 foot = ${Ht(i=>ot(i.foot))}, J = ${Ht(i=>ot(i.J))}, K = ${Ht(i=>ot(i.K))}, D0 = ${Ht(i=>ot(i.dir0))};
    float L1 = ${Ht(i=>e(i.L1))}, L2 = ${Ht(i=>e(i.L2))}, A1 = ${Ht(i=>e(i.a1))}, A2 = ${Ht(i=>e(i.a2))}, lag = ${Ht(i=>e(i.lag))};
    float off = (((k > 0.5 && k < 1.5) != (side < 0.0)) ? 0.5 : 0.0) + lag;
    vec3 ft = lFoot(fract(ph - off), foot.y);
    float hx = hip.x * side, fx = foot.x * side;
    vec2 dxz = vec2(fx - hx, ft.y - hip.z); float r = max(length(dxz), 1e-4); dxz = dxz * (1.0 / r);
    vec2 t = vec2(ft.x - hip.y, -r); float d = max(length(t), 1e-4); t = t * (1.0 / d);
    float dc = clamp(d, abs(L1 - L2) + 1e-3, L1 + L2 - 1e-4);
    float a1 = ang(t) + acos(clamp((L1 * L1 + dc * dc - L2 * L2) / max(2.0 * L1 * dc, 1e-4), -1.0, 1.0));
    vec2 Jp = vec2(hip.y, 0.0) - L1 * vec2(cos(a1), sin(a1));
    float th1 = a1 - A1, th2 = ang(vec2(ft.x, -r) - Jp) - A2;
    if (w > 1.5) {
      // the foot lies along the leg's line as built and does not turn while it stands
      float th3 = -clamp((ft.x - ${e(X.ankle)}) * 3.0, 0.0, 0.5); vec2 l = rot2(p.yz - K, th3), d0 = vec2(D0.x * side, D0.y); n.yz = rot2(n.yz, th3);
      P = vec3(fx - d0.x * l.y - d0.y * p.x, ft.x + l.x, ft.y - d0.y * l.y + d0.x * p.x);
      Nn = vec3(-d0.x * n.z - d0.y * n.x, n.y, -d0.y * n.z + d0.x * n.x);
      return;
    }
    float th = mix(th1, th2, w); vec2 l = Jp + rot2(p.yz - J, th); n.yz = rot2(n.yz, th);
    // the knee is held out to the side, not straight up: thigh and shin are turned about the line from hip to ankle
    vec3 v = vec3(-dxz.x * l.y - dxz.y * p.x, l.x - hip.y, -dxz.y * l.y + dxz.x * p.x), vn = vec3(-dxz.x * n.z - dxz.y * n.x, n.y, -dxz.y * n.z + dxz.x * n.x);
    vec3 kx = vec3(fx - hx, ft.x - hip.y, ft.y - hip.z); kx = kx * inversesqrt(max(dot(kx, kx), 1e-8));
    float ta = ${e(X.tilt)} * side * (k > 1.5 ? -1.0 : 1.0), ct = cos(ta), st = sin(ta);
    P = vec3(hx, hip.y, hip.z) + v * ct + cross(kx, v) * st + kx * (dot(kx, v) * (1.0 - ct));
    Nn = vn * ct + cross(kx, vn) * st + kx * (dot(kx, vn) * (1.0 - ct));
    return;
  }
  if (kind > 1.5) {
    // a feeler: it nods and sways about its root, by the clock and a little with the walk
    float s = aAnim.y, a = s * (0.10 * sin(uTime * 2.3 + side * 1.1 + iVar.x * 6.2831853) + 0.06 * sin(12.5663706 * ph + side));
    vec2 root = vec2(0.33, -1.52);
    p.yz = root + rot2(p.yz - root, a); n.yz = rot2(n.yz, a);
    p.x += s * 0.035 * sin(uTime * 1.7 + side * 2.0 + iVar.y * 6.2831853);
  }
  // the body rides its legs: a small rise and fall twice a stride, a small roll once
  float roll = ${e(X.roll)} * sin(6.2831853 * ph), cr = cos(roll), sr = sin(roll);
  p.xy = vec2(0.0, 0.4) + vec2(cr * p.x - sr * (p.y - 0.4), sr * p.x + cr * (p.y - 0.4)); n.xy = vec2(cr * n.x - sr * n.y, sr * n.x + cr * n.y);
  p.y += ${e(X.bob)} * sin(12.5663706 * ph);
  P = p; Nn = n;
}`,ee=`
${Ct}
// 1 inside a ball of radius r about c, 0 outside, the edge aa wide
float disc(vec3 p, vec3 c, float r, float aa) { vec3 d = p - c; return 1.0 - smoothstep(r - aa, r + aa, sqrt(max(dot(d, d), 1e-12))); }
void main() {
  float nl = dot(vN, vN);
  vec3 n = nl > 1e-8 ? vN * inversesqrt(nl) : vec3(0.0, 1.0, 0.0);
  if (!gl_FrontFacing) n = -n;
  vec3 vd = cameraPosition - vWorld; float vl = dot(vd, vd);
  vec3 V = vl > 1e-8 ? vd * inversesqrt(vl) : vec3(0.0, 0.0, 1.0);
  float gloss = vFx.x, part = vFx.y;
  vec3 alb = vCol, pr = vec3(abs(vRest.x), vRest.yz);
  float aa = max(fwidth(vRest.x), max(fwidth(vRest.y), fwidth(vRest.z))) * 0.75 + 0.004;
  vec3 PALE = ${Et(Bt.pale)}, BLACK = ${Et(Bt.black)};
  if (part < 0.5) {
    // THE WING CASES: this animal's own red (from scarlet toward orange), its seven black spots (each animal's a little larger
    // or smaller), the two pale marks beside the first spot, the fine parting line, a darker rim
    alb = mix(vec3(0.62, 0.030, 0.014), vec3(0.72, 0.105, 0.012), vVar.x * vVar.x);
    float k = 0.86 + 0.28 * vVar.y;
    float sp = max(max(disc(pr * vec3(1.0, 1.0, 0.8), ${Et(Wt[0])} * vec3(1.0, 1.0, 0.8), ${e(Wt[0][3])} * k, aa), disc(pr, ${Et(Wt[1])}, ${e(Wt[1][3])} * k, aa)),
      max(disc(pr, ${Et(Wt[2])}, ${e(Wt[2][3])} * k, aa), disc(pr, ${Et(Wt[3])}, ${e(Wt[3][3])} * k, aa)));
    alb = mix(alb, PALE, disc(pr, ${Et($0)}, ${e($0[3])}, aa));
    alb = mix(alb, alb * 0.22, (1.0 - smoothstep(0.004, 0.012 + aa, pr.x)) * 0.9);
    alb = mix(alb, BLACK, sp);
    alb *= mix(0.55, 1.0, smoothstep(${e(X.rim)}, ${e(X.rim+.08)}, vRest.y));
  } else if (part > 1.5 && part < 2.5) {
    // the shield: black, a pale patch at each fore corner
    alb = mix(alb, PALE, disc(pr * vec3(1.0, 0.7, 1.25), vec3(0.62, 0.50, -1.12) * vec3(1.0, 0.7, 1.25), 0.21, aa));
  } else if (part > 2.5) {
    alb = mix(alb, PALE, disc(pr, vec3(0.17, 0.45, -1.45), 0.075, aa));   // the head: two small pale marks between the eyes
  }
  float ndl = dot(n, uSunDir), dif = max(ndl, 0.0), ndv = clamp(dot(n, V), 0.0, 1.0);
  vec3 hemi = mix(uGroundColor, uSkyColor, n.y * 0.5 + 0.5);
  float sun = sunReach();
  vec3 col = alb * (uSunColor * dif * sun + hemi) * RECIPROCAL_PI;
  float redAny = clamp((alb.r - alb.g) * 2.0 - 0.2, 0.0, 1.0);
  float top = max(col.r, max(col.g, col.b)), k0 = mix(0.74, 0.58, redAny), knee = top > k0 ? (k0 + (top - k0) * 0.14) / top : 1.0;   // (the red is held deep: never boiled)
  col *= knee;
  // LACQUER: the sky and the town mirrored faintly in the shell, more where it turns from the eye; the sun's own small hard light
  float fr = 1.0 - ndv, f5 = fr * fr * fr * fr * fr;
  vec3 R = reflect(-V, n);
  vec3 env = mix(uGroundColor, uSkyColor, smoothstep(-0.2, 0.3, R.y)) * RECIPROCAL_PI;
  col += env * (0.045 + 0.6 * f5) * gloss;
  vec3 hv = V + uSunDir; float hl = dot(hv, hv);
  float ndh = hl > 1e-8 ? max(dot(n, hv * inversesqrt(hl)), 0.0) : 0.0, lit = smoothstep(-0.05, 0.15, ndl) * sun;
  float core = pow(max(ndh, 1e-4), 260.0), halo = pow(max(ndh, 1e-4), 30.0);
  vec3 sunTint = uSunColor / max(max(uSunColor.r, uSunColor.g), max(uSunColor.b, 0.001));
  col += uSunColor * RECIPROCAL_PI * halo * 0.07 * gloss * lit;
  col = mix(col, sunTint * 0.88, clamp(core * 1.6, 0.0, 1.0) * gloss * lit);
  gl_FragColor = vec4(min(col, vec3(0.89)), 1.0);
  #include <fog_fragment>
}`;function L0(i,f=0,n=i.count,d=null){d=d||{up:0,halfWidth:0,front:0,back:0,body:0};const b=i.p,A=i.a,y=20,w=[0,0,0];for(let u=f;u<n;u++){const _=A[u*4],z=b[u*3],B=b[u*3+1],D=b[u*3+2];for(let W=0;W<(_===1?y:1);W++)_===1?Z0(A[u*4+1],A[u*4+3],A[u*4+2],z,B,D,W/y,w):(w[0]=z,w[1]=B+X.bob+X.roll*Math.abs(z),w[2]=D,_===0&&Math.abs(z)>d.body&&(d.body=Math.abs(z))),w[1]>d.up&&(d.up=w[1]),Math.abs(w[0])>d.halfWidth&&(d.halfWidth=Math.abs(w[0])),-w[2]>d.front&&(d.front=-w[2]),w[2]>d.back&&(d.back=w[2])}return d}function F0(i){return{length:3.2,halfWidth:Vt(i.halfWidth+.03),height:Vt(i.up+.02),stride:X.stride,bodyHalfWidth:Vt(i.body),front:Vt(i.front+.03),back:Vt(i.back+.03),duty:X.duty}}function R0(i,f,n){return{name:"ladybirds",near:i,shadow:f,bounds:n,anim:te,frag:ee,bounce:1}}async function ae(i){const f=e0("near");await i();const n=e0("shadow");return await i(),R0(f,n,F0(L0(f)))}function oe(i,f={}){if(!_t.ladybird){const w=e0("near");_t.ladybird=R0(w,e0("shadow"),F0(L0(w)))}const{api:n,iPos:d,iQuat:b,iMisc:A,count:y}=z0(i,f,_t.ladybird);return n.setPose=(w,u,_,z=0,B=0,D=1)=>{if(w<0||w>=y)return;let W=_.x??_[0],V=_.y??_[1],K=_.z??_[2];const ht=Math.hypot(W,V,K);ht>1e-9?(W/=ht,V/=ht,K/=ht):(W=0,V=1,K=0);let S=-W*V,P=1-V*V,H=-K*V,O=Math.hypot(S,P,H);O<1e-4&&(S=0,P=0,H=-1,O=1),S/=O,P/=O,H/=O;let U,N,nt;if(typeof z=="number"){const ct=Math.cos(z),tt=Math.sin(z),dt=V*H-K*P,it=K*S-W*H,rt=W*P-V*S;U=S*ct+dt*tt,N=P*ct+it*tt,nt=H*ct+rt*tt}else{const ct=z.x??z[0],tt=z.y??z[1],dt=z.z??z[2],it=ct*W+tt*V+dt*K;U=ct-W*it,N=tt-V*it,nt=dt-K*it;const rt=Math.hypot(U,N,nt);rt<1e-6?(U=S,N=P,nt=H):(U/=rt,N/=rt,nt/=rt)}Xt.set(N*K-nt*V,nt*W-U*K,U*V-N*W),b0.set(W,V,K),k0.set(-U,-N,-nt),zt.setFromRotationMatrix(O0.makeBasis(Xt,b0,k0)),d.array[w*3]=u.x??u[0],d.array[w*3+1]=u.y??u[1],d.array[w*3+2]=u.z??u[2],b.array[w*4]=zt.x,b.array[w*4+1]=zt.y,b.array[w*4+2]=zt.z,b.array[w*4+3]=zt.w,A.array[w*4]=D,A.array[w*4+1]=B-Math.floor(B)},n}return{prepareBeasts:K0,makeGiraffes:U0,makeLadybirds:oe}})(),_e=M0.prepareBeasts,Ie=M0.makeGiraffes,Te=M0.makeLadybirds;export{Re as buildHero,Ie as makeGiraffes,Te as makeLadybirds,Le as makeShrimps,_e as prepareBeasts,Pe as prepareShrimps};
