import*as i from"three";import{makePath as W0,makeRng as I0,clamp as J,lerp as Pe,smoothstep as Q}from"../kit/core.js";import{buildHero as q0,buildTent as H0,makeSlabMaterial as N0,makeFountains as U0,SWELL_GLSL as c0,MOON_GLSL as Y0}from"../parts/ember-moon-tide.js";const y=["#08070A","#2A1418","#8E1F14","#E8611C","#FFC65A","#FFF3D0","#B9B4C8"],u0=14,f0=625,S=770,Je=12*Math.PI/180,Qe=Math.PI/180,yt=m=>250-80*m+330*(1-Q(0,.16,m)),X0=105,Z0=m=>u0*.5*(1+Math.cos(Math.PI*J(m/f0,-1,1))),bt=`
float hash21(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vnoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.-2.*f);
  return mix(mix(hash21(i), hash21(i+vec2(1.,0.)), f.x), mix(hash21(i+vec2(0.,1.)), hash21(i+vec2(1.,1.)), f.x), f.y); }
float fbm3(vec2 p){ float a = .5, s = 0.; s += a*vnoise(p); p = p*2.03+17.1; a *= .5; s += a*vnoise(p); p = p*2.01+9.7; a *= .5; s += a*vnoise(p); return s / .875; }
`,h0=`
float crustOpen(float s){ return smoothstep(-330., -200., s); }
float crustGold(float s){ return smoothstep(-200., -60., s); }
`;var eo={id:"ember-moon-tide",name:"The Ember Moon",category:"prehistoric",media:["air","open"],weirdness:.6,async build(m){const D=m.rng,ze=m.vary||{},me=J(m.quality?.detail??1,.5,1),Mt=J(ze.density??1,.7,1.3),W=new i.Scene,zt=(e,t=1)=>new i.Color(e).multiplyScalar(t),St=D(),At=D(),d0=D(),m0=D(),p0=D();let Oe=St<.5?"crescent":St<.78?"half":"unlit";ze.hour==="golden"?Oe="half":ze.hour==="night"?Oe="unlit":ze.hour==="dawn"&&(Oe="crescent");const Y=At<.5?"glass":At<.76?"young":"ash",Tt=d0<.42?-(.3+.14*D()):0,et=m0<.45?.55+.45*D():0,Ct=(p0<.36?.5:1.45)/Mt,v0=!!ze.rare,kt=new i.Color(.008,.0065,.012);W.background=kt.clone(),W.fog=new i.FogExp2(zt(y[1],et>0?1.35:1.15),et>0?52e-5:44e-5);const L=await q0(m,{palette:y,detail:me,moonPhase:Oe,crust:Y,seaRadius:0});L.object.position.set(0,0,-S),W.add(L.object),await m.yield();const _=await H0(m,{hero:L,palette:y,detail:me});await m.yield();const X=L.uniforms.shared,tt=L.uniforms.moon,ot=.8;L.slabMaterial.uniforms.uSheen.value=ot;for(const e of[_.raft.material,_.slabs[0].material])e.uniforms.uSheen.value=ot*.4;_.raft.material.uniforms.uMirror.value=.3,X.uSwell.value.set(yt(0),u0,f0,Tt);const ee=L.anchors.flyThrough,Rt=e=>{const t=S-e;if(t>=ee[0].z)return 0;for(let o=0;o<ee.length-1;o++)if(t<=ee[o].z&&t>=ee[o+1].z){const a=(ee[o].z-t)/(ee[o].z-ee[o+1].z);return .6*Pe(ee[o].x,ee[o+1].x,a)*Q(240,200,Math.abs(t))}return 0},Se=e=>t=>{if(t<=e[0][0])return e[0][1];for(let o=0;o<e.length-1;o++)if(t<=e[o+1][0])return Pe(e[o][1],e[o+1][1],Q(e[o][0],e[o+1][0],t));return e[e.length-1][1]},w0=Se([[0,9],[100,9],[200,12],[262,8],[335,-10],[430,-12],[500,-3],[545,0]]),g0=Se([[0,0],[60,-9],[175,-9],[305,25],[350,25],[435,12]]),Ft=e=>w0(e)*Qe,x0=e=>g0(e)*Qe,G=4,Gt=S-240,y0=S+55,b0=716;let Et=0;{let e=0,t=0,o=0;for(;t<Gt;){const a=Ft(o+G*.5);e+=Math.sin(a)*G,t+=Math.cos(a)*G,o+=G}Et=-e}const T=[];let te=0;{let e=Et,t=0,o=0;for(;t<Gt;){T.push([e,-t,o]);const r=Ft(o+G*.5);e+=Math.sin(r)*G,t+=Math.cos(r)*G,o+=G}for(e=Rt(t);t<y0;){T.push([e,-t,o]);const r=Rt(t+G);o+=Math.hypot(r-e,G),e=r,t+=G}te=o;let a=-t;for(;o-te<b0;){T.push([e,a,o]);const r=x0(o-te+G*.5);e+=Math.sin(r)*G,a-=Math.cos(r)*G,o+=G}T.push([e,a,o])}const M0=T[T.length-1][2],Ae=-T[T.length-1][1],z0=Se([[0,9.5],[250,9.5],[385,20],[470,34],[530,34],[645,16],[te-20,16],[te+115,54],[te+270,52],[te+440,13],[te+530,9.2]]),S0=e=>z0(e),Pt=[];for(let e=0;e<T.length;e++){if(e%7!==0&&e!==T.length-1)continue;const t=T[e],o=t[2]/M0;Pt.push([t[0],S0(t[2])+Z0(-t[1]-yt(o)+Tt*t[0]),t[1]])}const pe=e=>{let t=J(Math.floor(e/G),0,T.length-2);for(;t<T.length-2&&-T[t+1][1]<e;)t++;for(;t>0&&-T[t][1]>e;)t--;const o=T[t],a=T[t+1],r=J((e+o[1])/Math.max(o[1]-a[1],.001),0,1);return Pe(o[0],a[0],r)},E=W0(Pt);_.object.rotation.y=-Je,_.object.updateMatrixWorld(!0);const Ot=_.anchors.portalSeat.position.clone().applyAxisAngle(new i.Vector3(0,1,0),-Je);_.object.position.set(E.end.x-Ot.x,0,E.end.z-Ot.z),W.add(_.object);const Le=_.object.position.clone();_.slabs[0].material.uniforms.uLamp.value.set(E.end.x,E.end.y,E.end.z,.08),_.raft.material.uniforms.uLamp.value.set(E.end.x,E.end.y,E.end.z,.55),await m.yield();const x=D.fork("plates"),ve=m.noise,je=I0((m.seed|0)*7919+4513>>>0),at=Y==="young"?33:Y==="ash"?66:54,we=Y==="ash"?8:Y==="young"?4.5:6.5,Z=1.2,Te=Z-we,Be=297,Ce=-110,nt=Ce+36*(1800/33),I=Math.round(2*Be/at),se=Math.round((nt-Ce)/at),Lt=2*Be/I,jt=(nt-Ce)/se,ge=L.anchors.patchCentre,A0=L.anchors.patchRadiusX,T0=L.anchors.patchRadiusZ,Bt=(e,t,o)=>{const a=(e-ge.x)/(A0*o),r=(t+S-ge.z)/(T0*o);return a*a+r*r},re=new Float32Array((I+1)*(se+1)*2),Vt=new Uint8Array((I+1)*(se+1));for(let e=0;e<=se;e++)for(let t=0;t<=I;t++){const o=e*(I+1)+t,a=t===0||t===I||e===0||e===se;let r=-Be+t*Lt+(a?0:x.range(-.3,.3)*Lt),n=-(Ce+e*jt)+(a?0:x.range(-.3,.3)*jt);const w=Bt(r,n,.9);if(w<1){Vt[o]=1;const l=r-ge.x,c=n+S-ge.z,g=1/Math.max(Math.sqrt(w),.05);r=ge.x+l*g,n=-S+ge.z+c*g}re[o*2]=r,re[o*2+1]=n}const st=new Uint8Array(I*se),rt=[],C0=(e,t,o,a)=>{if(e+o>I||t+a>se)return!1;for(let r=0;r<a;r++)for(let n=0;n<o;n++)if(st[(t+r)*I+e+n])return!1;return!0};for(let e=0;e<se;e++)for(let t=0;t<I;t++){if(st[e*I+t])continue;const o=x();let a=1,r=1;Y!=="young"?o<.15?(a=2,r=2):o<.3?a=2:o<.45&&(r=2):o<.12?a=2:o<.24&&(r=2),C0(t,e,a,r)||(a=1,r=1);for(let n=0;n<r;n++)for(let w=0;w<a;w++)st[(e+n)*I+t+w]=1;rt.push([t,e,a,r])}const Ve=(e,t,o)=>{o[0]=e+ve.n2(e*.045,t*.045)*4.2+ve.n2(e*.33+40,t*.33)*.55+ve.n2(e*.13+7,t*.13+55)*1.5,o[1]=t+ve.n2(e*.045+90,t*.045+20)*4.2+ve.n2(e*.33,t*.33+70)*.55+ve.n2(e*.13+31,t*.13+3)*2.2},_t=Math.cos(Je),Dt=Math.sin(Je),Wt=(e,t)=>{const o=e-Le.x,a=t-Le.z,r=o*_t+a*Dt,n=-o*Dt+a*_t+8,w=n>0?184:138;return r/100*(r/100)+n/w*(n/w)<1},M=[],It=[],qt=[],Ht=[],Nt=[],j=[],H=[0,0];let _e=0;const De=(e,t)=>t*(I+1)+e;for(let e=0;e<rt.length;e++){e%2===0&&await m.yield();const[t,o,a,r]=rt[e],n=[];for(let u=0;u<a;u++)n.push(De(t+u,o));for(let u=0;u<r;u++)n.push(De(t+a,o+u));for(let u=0;u<a;u++)n.push(De(t+a-u,o+r));for(let u=0;u<r;u++)n.push(De(t,o+r-u));let w=0,l=0,c=0;for(const u of n)w+=Vt[u],l+=re[u*2],c+=re[u*2+1];l/=n.length,c/=n.length;const g=x(),b=x(),z=x(),O=x(),P=x(),C=x();if(w===n.length||Wt(l,c))continue;const k=[];for(let u=0;u<n.length;u++){const B=n[u],oe=n[(u+1)%n.length],F=re[B*2],ae=re[B*2+1],ne=re[oe*2],q=re[oe*2+1],K=Math.hypot(ne-F,q-ae);if(K<.5)continue;const be=(F+ne)*.5,Ze=-(ae+q)*.5,Fe=Math.abs(be-pe(Ze))<120,Me=Math.max(1,Math.round(K/(Fe?Y==="young"?3.6:3:9/me))),Ge=Math.min(B,oe)===B;for(let N=0;N<Me;N++){const $=Ge?N/Me:1-(Me-N)/Me;Ve(Ge?F+(ne-F)*$:ne+(F-ne)*(1-$),Ge?ae+(q-ae)*$:q+(ae-q)*(1-$),H),k.push([H[0],H[1],Fe?1:0])}}if(k.length<4)continue;const p=-c>S+150&&Math.abs(l-pe(-c))<190;We(k,l,c,[g,b,z,O,p?0:P,C],w>0?.12:0),_e++}for(let e=0;e<6;e++){const t=e%2?.58+.3*x():.08+.3*x(),o=t<.5?-(.22+1.7*t):Math.PI+.22+1.7*(t-.5),a=x.range(-6,6),r=S+215+e*3%5*26+x.range(-8,8),n=pe(r)+(e%2?1:-1)*(54+13*(e>>1))+a,w=x.range(24,30),l=x.range(15,20),c=Math.cos(o),g=Math.sin(o),b=[];for(let O=0;O<6;O++){const P=(O+x.range(-.3,.3))/6*6.2832,C=x.range(.78,1.15),k=Math.cos(P)*w*C,p=Math.sin(P)*l*C;b.push([n+k*c-p*g,-r+k*g+p*c])}const z=[];for(let O=0;O<6;O++){const P=b[O],C=b[(O+1)%6],k=Math.max(2,Math.round(Math.hypot(C[0]-P[0],C[1]-P[1])/3));for(let p=0;p<k;p++)Ve(P[0]+(C[0]-P[0])*p/k,P[1]+(C[1]-P[1])*p/k,H),z.push([H[0],H[1],1])}We(z,n,-r,[x(),t,.5,.75+.25*x(),0,x()],.3),_e++,e%2&&await m.yield()}{const e=te+462,t=T[Math.min(T.length-1,Math.round(e/G))],o=t[0]+66,a=t[1],r=[],n=[],w=Math.atan2(.78,-.63);for(let l=0;l<7;l++){const c=(l+je.range(-.3,.3))/7*6.2832,g=je.range(.8,1.15),b=Math.cos(c)*30*g,z=Math.sin(c)*24*g;r.push([o+b*Math.cos(w)-z*Math.sin(w),a+b*Math.sin(w)+z*Math.cos(w)])}for(let l=0;l<7;l++){const c=r[l],g=r[(l+1)%7],b=Math.max(2,Math.round(Math.hypot(g[0]-c[0],g[1]-c[1])/2.6));for(let z=0;z<b;z++)Ve(c[0]+(g[0]-c[0])*z/b,c[1]+(g[1]-c[1])*z/b,H),n.push([H[0],H[1],1])}We(n,o,a,[je(),.5,.5,1,0,je(),0,w,40],.3),_e++}await m.yield();{const e=D.fork("rafts"),t=[],o=Math.round(60*(.7+.3*me));for(let a=0,r=0;a<o&&r<700;r++){const n=Pe(S+190,Ae-95,(a+e())/o)+e.range(-30,30),w=e()<.5?-1:1,l=e.range(17,38)*(e()<.25?1.35:1),c=e()<.3,g=pe(n)+w*(c?e()*18:22+l*.8+e()*e()*125),b=-n;if(Wt(g,b)||!c&&E.nearestXZ(g,b).dist<20+l*.8||t.some(p=>Math.hypot(p[0]-g,p[1]-b)<(p[2]+l)*.72+6))continue;t.push([g,b,l]),a++;const z=5+Math.floor(e()*4),O=e()*6.2832,P=e.range(.6,1),C=[];for(let p=0;p<z;p++){const u=O+(p+e.range(-.3,.3))/z*6.2832,B=l*e.range(.62,1.12);C.push([g+Math.cos(u)*B,b+Math.sin(u)*B*P])}const k=[];for(let p=0;p<z;p++){const u=C[p],B=C[(p+1)%z],oe=Math.max(2,Math.round(Math.hypot(B[0]-u[0],B[1]-u[1])/2.6));for(let F=0;F<oe;F++)Ve(u[0]+(B[0]-u[0])*F/oe,u[1]+(B[1]-u[1])*F/oe,H),k.push([H[0],H[1],1])}We(k,g,b,[e(),e(),.9,e(),.9,e(),1],0),_e++,await m.yield()}}await m.yield();function We(e,t,o,a,r){const n=e.length;let w=0;for(let s=0;s<n;s++){const d=e[s],v=e[(s+1)%n];w+=d[0]*v[1]-v[0]*d[1]}w<0&&e.reverse();let l=0,c=0,g=0;for(const s of e)l+=s[0],c+=s[1],g+=s[2];l/=n,c/=n;const b=g>0,z=new Float32Array(n),O=new Float32Array(n),P=new Float32Array(n+1);let C=0,k=0;for(let s=0;s<n;s++){const d=e[(s+n-1)%n],v=e[(s+1)%n],f=e[s];let h=v[0]-d[0],A=v[1]-d[1];const U=Math.hypot(h,A)||1;h/=U,A/=U,z[s]=A,O[s]=-h,P[s]=C,C+=Math.hypot(v[0]-f[0],v[1]-f[1]),k=Math.max(k,Math.hypot(f[0]-l,f[1]-c))}P[n]=C;const p=E.nearestXZ(l,c),u=E.pointAt(p.u),B=l>=u.x?1:-1,oe=p.dist-k*.75<17,F=-c,ae=a[7]!==void 0||F>S+190&&F<Ae+260&&Math.abs(l)<X0&&a[2]<.62&&!a[6],ne=!ae&&F>S+105&&p.dist>60;let q=ae?a[1]<.5?-(.22+1.7*a[1]):Math.PI+.22+1.7*(a[1]-.5):p.dist<140?a[1]>.5&&p.dist-k*.6>26?Math.PI/2-B*(.25+(a[1]-.5)*1.4):(B>0?0:Math.PI)+((a[1]>.5?a[1]-.5:a[1])-.25)*3:a[1]*6.2832;a[7]!==void 0&&(q=a[7]);let K=0;for(const s of e)K=Math.max(K,Math.abs((s[0]-l)*Math.cos(q)+(s[1]-c)*Math.sin(q)));let be=oe?Math.min(.03+.05*a[2],Math.asin(J(4.2/(1.8*K),0,.5))):a[6]?.22+.3*a[3]:a[2]<(ne?.56:.36)?.34+.24*a[3]:.11+.16*a[3];be=Math.min(be,Math.asin(J((ne?38:31)/(2*K),0,ne?.7:.62)));let Ze=a[4]<.4?9+5*a[5]+we:0,Fe=.04+.06*a[5];if(ae){const s=a[8]!==void 0?a[8]:J(44+.05*(F-S-190),44,62)*(.8+.2*a[3]),d=J(s/(.6*K)-1,.05,.95);be=Math.asin(J(s/((1+d)*K),0,.82)),Ze=20+we+((l-pe(F)>58||l-pe(F)<-58&&F<S+290)&&p.dist-k*.75>24?100:0),Fe=-d}const Me=Math.max(3,Math.round(C/(we/4))),Ge=M.length/3,N=(s,d,v,f,h,A,U,de,$e)=>{M.push(s,d,v),It.push(f,h,A),qt.push(U,de,$e),Ht.push(l,c,K,a[0]),Nt.push(q,be,Ze,Fe)},$=new Float32Array(n);let Ke=0,Qt=0;for(let s=0;s<n;s++)Ke<=0&&x()<.06&&(Ke=1+Math.floor(x()*3),Qt=.2+x()*.5),$[s]=Ke>0?Qt:0,Ke--;const vt=(s,d,v)=>{v[0]=e[s][0]-z[s]*d,v[1]=e[s][1]-O[s]*d},e0=(s,d,v)=>{const f=e[s],h=l-f[0],A=c-f[1],U=Math.hypot(h,A)||1,de=Math.min(d,U*.9)/U;v[0]=f[0]+h*de,v[1]=f[1]+A*de},V=[0,0],wt=(s,d,v,f)=>{for(let h=0;h<v;h++){const A=f?(h+1)%v:h+1;j.push(s+h,s+A,d+h,s+A,d+A,d+h)}},t0=(s,d,v)=>{for(let f=0;f<v;f++)j.push(s+f,s+(f+1)%v,d)},gt=(s,d)=>{let v=0;for(let f=s;f<j.length;f+=3){const h=j[f]*3,A=j[f+1]*3,U=j[f+2]*3,de=M[A]-M[h],$e=M[A+1]-M[h+1],n0=M[A+2]-M[h+2],s0=M[U]-M[h],r0=M[U+1]-M[h+1],i0=M[U+2]-M[h+2],_0=$e*i0-n0*r0,l0=n0*s0-de*i0,D0=de*r0-$e*s0;v+=d===0?l0:d===2?-l0:_0*(M[h]-l)+D0*(M[h+2]-c)}if(v<0)for(let f=s;f<j.length;f+=3){const h=j[f+1];j[f+1]=j[f+2],j[f+2]=h}};let Ee=j.length,he=M.length/3;for(let s=0;s<n;s++)vt(s,$[s],V),N(V[0],Z-.05-r,V[1],0,0,0,0,1,0);for(let s=0;s<n;s++)e0(s,2.4+$[s],V),N(V[0],Z-r,V[1],0,2.4,0,0,1,0);N(l,Z-r,c,0,30,0,0,1,0),wt(he,he+n,n,!0),t0(he+n,he+2*n,n),gt(Ee,0),Ee=j.length;const o0=b?[[Z-.05,0,1,.7],[Z-.3,-.05,.93,.1],[Z-.36,.3,.9,-.5],[Z-we*.5,.16,.45,.05],[Te,.85,0,-.2]]:[[Z-.05,0,1,.6],[Z-.36,.26,.9,0],[Te,.8,0,-.2]];let xt=-1;for(let s=0;s<o0.length;s++){const d=o0[s],v=M.length/3;for(let f=0;f<=n;f++){const h=f%n;vt(h,d[1]+(s<2?$[h]:$[h]*.3),V);const A=Math.hypot(1,d[3]);N(V[0],d[0],V[1],1,d[2],-1-P[f]/C*Me,z[h]/A,d[3]/A,O[h]/A)}xt>=0&&wt(xt,v,n,!1),xt=v}gt(Ee,1),Ee=j.length,he=M.length/3;for(let s=0;s<n;s++)vt(s,.85,V),N(V[0],Te,V[1],2,.85,q,0,-1,0);if(b){for(let s=0;s<n;s++)e0(s,6,V),N(V[0],Te-.15,V[1],2,6,q,0,-1,0);wt(he,he+n,n,!0)}const a0=M.length/3-n;return N(l,Te-.3,c,2,30,q,0,-1,0),t0(a0,a0+n,n),gt(Ee,2),Ge}await m.yield();const xe=async(e,t)=>{const o=new t(e.length);for(let a=0;a<e.length;){const r=Math.min(e.length,a+9e4);for(;a<r;a++)o[a]=e[a];await m.yield()}return o},ie=new i.BufferGeometry;ie.setAttribute("position",new i.BufferAttribute(await xe(M,Float32Array),3)),ie.setAttribute("aSlab",new i.BufferAttribute(await xe(It,Float32Array),3)),ie.setAttribute("normal",new i.BufferAttribute(await xe(qt,Float32Array),3)),ie.setAttribute("aCtr",new i.BufferAttribute(await xe(Ht,Float32Array),4)),ie.setAttribute("aKin",new i.BufferAttribute(await xe(Nt,Float32Array),4)),ie.setIndex(new i.BufferAttribute(await xe(j,Uint32Array),1)),ie.boundingSphere=new i.Sphere(new i.Vector3(0,0,-800),1400),await m.yield();const Ut={value:0},it=N0(tt,X,y,{heat:1,ash:Y==="ash"?.8:0,rough:Y==="young"?.1:.08,ribW:we/4,sheen:ot,stars:1,uniforms:{uCamD:Ut},xformPars:`attribute vec4 aCtr, aKin; uniform float uCamD; ${h0}`,xformMain:`{
        vec2 ctr = aCtr.xy; float ph = aCtr.w, s = swellS(ctr);
        open = crustOpen(s);
        vec3 q = vec3(position.x - ctr.x, position.y, position.z - ctr.y);
        lpos = q + vec3(ph * 197., 0., ph * 61.);
        float up = smoothstep(-430., -150., s + ph * 70.) * smoothstep(0., 0.3, open), aft = smoothstep(0., 380., s + ph * 60.);
        float sinker = step(0.5, aKin.z), bobA = open * (1. - 0.5 * aft * sinker);
        float crown = step(aKin.w, -1e-4), sc = s + ph * 60.;
        float stay = step(90., aKin.z), snk = aKin.z - 100. * stay;
        float gap = -ctr.y - uCamD + ph * 50. + 700. * stay; float upC = 1., dnC = smoothstep(760., 520., gap);
        float ang = mix(aKin.y * up * mix(1. - 0.2 * aft, 1. + 0.8 * aft, sinker), aKin.y * upC * (1. - 0.78 * dnC), crown) + sin(uTime * (0.75 + 0.4 * ph) + ph * 40.) * 0.012 * bobA;
        float shr = 1. - mix(aKin.w, 0.06, crown) * open - (0.26 + 0.22 * ph) * aft * (1. - sinker);      // the survivors break down to rafts half their size
        q.xz *= shr;
        vec2 r = vec2(cos(aKin.x), sin(aKin.x)); float al = dot(q.xz, r); vec2 pp = q.xz - r * al;
        float ca = cos(ang), sa = sin(ang);
        float al2 = al * ca - q.y * sa, y2 = al * sa + q.y * ca;
        y2 += abs(sa) * aCtr.z * shr * mix(0.8 * (1. - aft * sinker), -aKin.w, crown);
        y2 += sin(uTime * (0.8 + 0.45 * ph) + ph * 23.) * 0.3 * bobA;
        y2 -= snk * mix(smoothstep(40., 420., s + ph * 110.), smoothstep(680., 480., gap), crown);
        vec2 dr = r * 0.025 * max(s, 0.) * (1. - sinker);
        lp.xyz = vec3(ctr.x + pp.x + r.x * al2 + dr.x, y2, ctr.y + pp.y + r.y * al2 + dr.y);
        float na = dot(n.xz, r); vec2 np = n.xz - r * na;
        n = vec3(np.x + r.x * (na * ca - n.y * sa), na * sa + n.y * ca, np.y + r.y * (na * ca - n.y * sa));
      }`});{const e=E.pointAt(.094);it.uniforms.uVent.value.set(e.x+9,e.z,30,1)}const lt=new i.Mesh(ie,it);lt.name="crust",lt.frustumCulled=!1,W.add(lt),await m.yield();const ke=D.fork("fountains"),le=[{x:92,y:0,z:-400,height:46},{x:-104,y:0,z:-618,height:55},{x:-95,y:0,z:-(S+460),height:62},{x:215,y:0,z:-(Ae+185),height:60},{x:88,y:0,z:-(Ae+215),height:44}];for(let e=0;e<400&&le.length<12;e++){const t=(ke()<.5?-1:1)*ke.range(82,285),o=-ke.range(S+60,Ae+260),a=ke.range(20,60);E.nearestXZ(t,o).dist<78||Math.hypot(t-Le.x,o-Le.z)<135||Bt(t,o,1.25)<1||le.some(r=>Math.hypot(r.x-t,r.z-o)<95)||le.push({x:t,y:0,z:o,height:a})}const Yt={uTime:X.uTime,uResY:X.uResY,uFount:{value:1},uSwell:X.uSwell};[0,1,2,3].forEach(e=>{const t=le[e];for(const o of[it,L.slabMaterial])o.uniforms.uFire.value[e].set(t.x,t.z,t.height*1.15,1)}),[3,4].forEach((e,t)=>{const o=le[e];_.raft.material.uniforms.uFire.value[t].set(o.x,o.z,o.height*1.15,.8)}),L.slabMaterial.uniforms.uStars.value=1,_.raft.material.uniforms.uStars.value=.6;const k0=[0,1,2,3].map(e=>{const t=le[Math.min(e,le.length-1)];return new i.Vector3(t.x,t.z,14+t.height*.5)}),ce=64,Ie=128,qe=new Float32Array((ce+1)*(Ie+1)*3),Xt=[];for(let e=0;e<=Ie;e++)for(let t=0;t<=ce;t++){const o=t/ce*2-1,a=(e*(ce+1)+t)*3;qe[a]=Math.sign(o)*3800*Math.pow(Math.abs(o),1.9),qe[a+1]=-.15,qe[a+2]=420-6500*Math.pow(e/Ie,1.45)}for(let e=0;e<Ie;e++)for(let t=0;t<ce;t++){const o=e*(ce+1)+t,a=o+1,r=o+ce+1,n=r+1;Xt.push(o,a,r,a,n,r)}const ct=new i.BufferGeometry;ct.setAttribute("position",new i.BufferAttribute(qe,3)),ct.setIndex(Xt);const R=(e,t=1)=>({value:zt(e,t)}),R0=new i.ShaderMaterial({fog:!0,uniforms:{...i.UniformsLib.fog,...tt,uTime:X.uTime,uSwell:X.uSwell,uCell:{value:at*1.25},uAsh:{value:Y==="ash"?.8:0},uField:{value:new i.Vector4(Be-5,Ce+5,nt-5,0)},uHeroZ:{value:-S},uFnt:{value:k0},uFount:Yt.uFount,uBlack:R(y[0]),uGarnet:R(y[1]),uRed:R(y[2]),uOrange:R(y[3]),uGold:R(y[4]),uCream:R(y[5]),uCool:R(y[6])},vertexShader:`
        varying vec3 vWorld;
        #include <fog_pars_vertex>
        ${c0}
        void main(){ vec4 wp = modelMatrix * vec4(position, 1.); wp.y += swellH(wp.xz); vWorld = wp.xyz;
          vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
          #include <fog_vertex>
        }`,fragmentShader:`
        uniform float uTime, uCell, uAsh, uHeroZ, uFount; uniform vec4 uField; uniform vec3 uFnt[4]; uniform vec3 uMoonDir, uMoonRight, uMoonUp;
        uniform vec3 uBlack, uGarnet, uRed, uOrange, uGold, uCream, uCool;
        varying vec3 vWorld;
        #include <fog_pars_fragment>
        ${bt}
        ${c0}
        ${h0}
        ${Y0}
        void main(){
          vec2 pw = vWorld.xz, p = vec2(pw.x, pw.y - uHeroZ);
          float s = swellS(pw), open = crustOpen(s), gold = crustGold(s);
          vec3 Vv = cameraPosition - vWorld; float dist = max(length(Vv), 1e-3); vec3 V = Vv / dist;
          // open melt: slow bright streams running through the orange, the hottest threads white-gold. Everything finer than
          // a few pixels is faded into its mean with distance (far, far2), so the far sea is a smooth graded band, not speckle
          float far = smoothstep(200., 650., dist), near = 1. - far, far2 = smoothstep(450., 1300., dist);
          float fw0 = max(length(dFdx(pw)), length(dFdy(pw)));
          vec2 fl = p * 0.045 + uTime * vec2(0.035, 0.012);
          float m1 = mix(fbm3(fl), 0.5, far2), m2 = mix(fbm3(fl * 2.7 - uTime * vec2(0.02, 0.05) + 4.), 0.5, far);
          vec2 sq = vec2(p.x * 0.016 + m1 * 1.3, p.y * 0.05 + m2 * 0.5) + uTime * vec2(0.012, 0.02);
          float st = 1. - abs(2. * fbm3(sq) - 1.); st *= st;
          vec3 melt = mix(uRed * 0.55 + uOrange * 0.16, uOrange * 0.72 + uGold * 0.14, smoothstep(0.3, 0.85, m1 * 0.55 + m2 * 0.55));
          melt += (uOrange * 0.22 + uGold * 0.32) * smoothstep(0.55, 0.95, st) * (1. - 0.9 * smoothstep(1.2, 5.0, fw0)) + uCream * 0.28 * smoothstep(0.90, 1.0, st) * near;
          // THE SWELL ON THE MELT. It is a runny liquid and it heaves: four crossing wave trains tilt the surface. A melt gives
          // off its light best along its own normal and turns to a dark mirror at a glancing angle (emissivity = 1 - Fresnel),
          // so the faces of a swell that lean toward us burn gold and their backs go dark and carry the Moon's red road and
          // the horizon's garnet. Each train fades into its mean before its wavelength falls under a few pixels.
          float fw = max(length(dFdx(pw)), length(dFdy(pw)));
          float wob = 2.6 * vnoise(p * 0.013 + 5.) + 1.3 * vnoise(p * 0.047 + 21.);
          vec2 wg = vec2(0.); float kAvg = 0.;
          { vec2 d = vec2(0.42, 0.91); float lam = 37., kp = 1. - smoothstep(0.16, 0.45, fw / lam), a = dot(p, d) * 6.2832 / lam + uTime * 0.9 + wob; wg += d * 0.125 * kp * (cos(a) + 0.35 * cos(2. * a + 1.)); kAvg += kp * 0.4; }
          { vec2 d = vec2(-0.64, 0.77); float lam = 23., kp = 1. - smoothstep(0.16, 0.45, fw / lam), a = dot(p, d) * 6.2832 / lam + uTime * 1.15 + wob * 1.7 + 2.; wg += d * 0.10 * kp * (cos(a) + 0.35 * cos(2. * a + 1.)); kAvg += kp * 0.3; }
          { vec2 d = vec2(0.94, 0.34); float lam = 14., kp = 1. - smoothstep(0.16, 0.45, fw / lam), a = dot(p, d) * 6.2832 / lam + uTime * 1.5 - wob * 1.3 + 4.; wg += d * 0.075 * kp * cos(a); kAvg += kp * 0.2; }
          { vec2 d = vec2(-0.17, 0.985); float lam = 8.5, kp = 1. - smoothstep(0.16, 0.45, fw / lam), a = dot(p, d) * 6.2832 / lam + uTime * 1.9 + wob * 2.3 + 1.; wg += d * 0.06 * kp * cos(a); kAvg += kp * 0.1; }
          vec3 wn = normalize(vec3(-wg.x, 1., -wg.y));
          float wci = clamp(dot(wn, V), 0., 1.) + 0.11 * (1. - kAvg) + 0.02, wR = 1. - min(wci, 1.); wR = wR * wR * wR * wR * wR; wR = 0.04 + 0.96 * wR;
          float wE = mix(1. - wR, 0.40, far2);      // (polish 3) far off we see the melt at a glancing angle: it gives little light and mirrors the night, so the sea deepens to red toward the horizon
          vec3 wRf = reflect(-V, wn); wRf.y = abs(wRf.y);
          vec2 wuv = vec2(dot(wRf, uMoonRight), dot(wRf, uMoonUp)) / 0.06976;
          vec3 wMir = (dot(wRf, uMoonDir) > 0. && dot(wuv, wuv) < 1.) ? moonShade(wuv, 3.).rgb : vec3(0.);
          wMir = mix(wMir, min(wMir, uRed * 1.1), smoothstep(450., 1100., dist));
          vec3 wSky = uGarnet * (0.30 + 0.9 * exp(-wRf.y / 0.16)) + wMir * 0.9;
          melt = mix(melt, uRed * 0.80 + uOrange * 0.10, 0.55 * far2) * (0.20 + 1.08 * wE) + wSky * (1. - wE) * 0.8;
          // (polish 3) THE SKIN ON THE MELT. The sea is not one orange sheet: it lies in zones a few hundred metres across. Where the
          // tide has just torn it the melt stands open and runs yellow-white; elsewhere it has skinned over in black glass (the
          // Moon's road and the sky's violet on it) cut by long leads and short rifts of white-gold. Edges soften by the pixel's
          // own footprint (fw), not by distance, so from high up the pattern holds to the horizon and never breaks into speckle.
          vec2 sp = p * 0.030 + uTime * vec2(0.018, 0.007);
          float sk = fbm3(sp) * 0.72 + fbm3(sp * 2.6 + 7. - uTime * 0.012) * 0.28;
          float feather = ((vnoise(p * vec2(0.16, 0.5) + sk * 5.) - 0.5) * 0.10 + (vnoise(p * 1.7) - 0.5) * 0.03) * near;
          float zone = vnoise(p * 0.0075 + vec2(3.7, 1.9)) * 0.60 + vnoise(p * 0.019 + 8.3) * 0.40, zs = smoothstep(0.30, 0.64, zone);
          float th = mix(0.38, 0.66, zs) - 0.05 * gold + 0.03 * sin(uTime * 0.23 + m1 * 9.);
          float sd = sk + feather - th, ew = 0.012 + 0.020 * fw;
          float skin = 1. - smoothstep(-ew, ew, sd);
          // (polish 4) the hottest melt, where it stands open, runs in FILAMENTS: a net of yellow-white threads drawn out along the flow
          // over deep orange, so an open reach is a moving surface and not one soft bright patch
          vec2 fq = vec2(p.x * 0.021 + m1 * 0.9, p.y * 0.034 - m2 * 0.6) + uTime * vec2(0.016, 0.024);
          float fil = 1. - abs(2. * fbm3(fq) - 1.), filK = 1. - smoothstep(2.0, 8.0, fw);
          float filL = mix(0.30, smoothstep(0.62, 0.97, fil) + 0.25 * smoothstep(0.30, 0.62, fil), filK);
          melt = mix(melt, melt * (0.62 + 0.25 * m2) + uRed * 0.10, (1. - zs) * filK * (1. - smoothstep(0.30, 0.75, fil)) * 0.8);
          melt += (uGold * 0.80 + uCream * 0.50) * (1. - zs) * smoothstep(0.25, 0.75, m1) * filL * (0.35 + 0.65 * wE);
          float seam = 0.;
          float tw = max(0.0067, ew * 0.8), tear = exp(-min(abs(sd), 1.) / tw) * min(1., 0.0085 / tw);      // (a line spread over a wider pixel is dimmer by as much: no floor, or the far skin fills with glow)
          float rw = 0.022 + 0.085 * fw, rift = (1. - smoothstep(rw * 0.4, rw, abs(fbm3(p * 0.11 + 9.) - 0.5))) * min(1., 0.022 / rw) * skin;
          float rw2 = 0.010 + 0.022 * fw, lead2 = (1. - smoothstep(rw2 * 0.4, rw2, abs(fbm3(p * 0.027 + 31.) - 0.5 + 0.06 * (m2 - 0.5)))) * min(1., 0.014 / rw2) * skin;
          vec3 skinC = uBlack * 1.5 + uGarnet * (0.20 + 0.25 * m2) + uCool * 0.03 + uRed * 0.22 * smoothstep(0.06, 0.0, -sd);
          skinC += wSky * (0.25 + 0.5 * (1. - wE));      // the skin is glass: it mirrors the sky's glow and the Moon
          vec3 sea = mix(melt, skinC, skin * 0.95) + (uOrange * 1.0 + uGold * 0.9) * (tear + rift * 0.6) + (uOrange * 0.7 + uGold * 1.0 + uCream * 0.3) * lead2;
          // inside the plate field the melt shows only in leads: red hairlines while shut, white-gold as they open
          float inField = (1. - smoothstep(uField.x - 4., uField.x + 4., abs(pw.x))) * smoothstep(uField.y - 4., uField.y + 4., -pw.y) * (1. - smoothstep(uField.z - 4., uField.z + 4., -pw.y));
          vec3 lead = mix(uRed * 1.1 + uOrange * 0.25, melt * 1.5 + uGold * (0.45 + 0.5 * smoothstep(0.5, 0.95, st)) + uCream * 0.25 * m2, open * (0.75 + 0.25 * m2));
          // beyond the field the closed crust is drawn: black glass in plates, a net of joints, the Moon's road on it
          vec2 cq = pw / uCell + (vnoise(pw * 0.011) - 0.5) * 0.5, ci = floor(cq), cf = fract(cq);
          float f1 = 9., f2 = 9.;
          for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) { vec2 g = vec2(float(i), float(j)); vec2 o = vec2(hash21(ci + g), hash21(ci + g + 17.3)); float d = length(g + 0.15 + 0.7 * o - cf); if (d < f1) { f2 = f1; f1 = d; } else if (d < f2) f2 = d; }
          float jd = (f2 - f1) * uCell;                                     // metres from the nearest joint, roughly
          float jw = max(0.5 + 16. * open, dist * 0.0016);                  // never thinner than about a pixel and a half
          float joint = (1. - smoothstep(jw * 0.4, jw, jd)) * min(1., (0.5 + 16. * open) / jw + 0.25);
          vec3 n = normalize(vec3(vnoise(pw * 1.3 + 3.1) - .5 + (vnoise(pw * 6.1) - .5) * .6, 14., vnoise(pw * 1.3 + 11.7) - .5 + (vnoise(pw * 6.1 + 5.) - .5) * .6));
          vec3 R = reflect(-V, n);
          float fres = 0.22 + 0.78 * pow(1. - clamp(dot(n, V), 0., 1.), 3.);
          vec2 muv = vec2(dot(R, uMoonRight), dot(R, uMoonUp)) / 0.06976;
          vec3 mir = (dot(R, uMoonDir) > 0. && dot(muv, muv) < 1.) ? moonShade(muv, 3.).rgb : vec3(0.);
          mir = mix(mir, min(mir, uRed * 1.1), smoothstep(450., 1100., dist));
          float gn = fbm3(pw * 0.33), gst = vnoise(pw * vec2(0.07, 0.45) + 31.);
          vec3 crustC = uBlack * 1.1 + uGarnet * 0.05 + (uBlack * 0.6 + (uGarnet * 0.85 + uRed * 0.07) * (0.15 + 0.85 * exp(-max(V.y, 0.) / 0.22))) * (0.22 + 0.78 * pow(1. - clamp(V.y, 0., 1.), 3.)) * 0.8 * (0.22 + 1.0 * gn * gn + 0.45 * gst * gst) * (1. - 0.6 * uAsh) + (mir * 1.15 + uMoonCol[0] * 0.30 * pow(max(dot(R, uMoonDir), 0.), 160.)) * fres * (1. - 0.8 * uAsh);
          crustC = mix(crustC, uCool * 0.16 * (0.5 + fbm3(pw * 0.33)), uAsh * 0.8);
          crustC = mix(crustC, lead, joint);
          vec3 outC = mix(crustC, sea, gold);
          vec3 inC = mix(lead, sea, gold);
          vec3 c = mix(outC, inC, inField);
          // the sea round a fountain's foot runs brighter: the falling melt stirs the skin off it
          float fg = 0.;
          for (int i = 0; i < 4; i++) { vec2 fd = pw - uFnt[i].xy; fg += exp(-dot(fd, fd) / max(uFnt[i].z * uFnt[i].z, 1.)); }
          c += (uOrange * 0.35 + uGold * 0.60 + uCream * 0.20) * min(fg, 1.) * uFount * gold * (0.55 + 0.45 * m2) * (1. - 0.5 * skin);
          gl_FragColor = vec4(c, 1.);
          #include <fog_fragment>
        }`}),ut=new i.Mesh(ct,R0);ut.name="tideSea",ut.frustumCulled=!1,W.add(ut),await m.yield();const F0=U0(le,Yt,y,ke,me);W.add(F0),await m.yield();const G0=W.fog.color,ye={uTime:{value:0},uTop:{value:kt.clone()},uBand:{value:G0.clone()},uGarnet:R(y[1]),uCool:R(y[6]),uRedS:R(y[2]),uOrangeS:R(y[3]),uWarm:{value:.2}},Re=new i.Mesh(new i.SphereGeometry(5200,48,24),new i.ShaderMaterial({uniforms:ye,side:i.BackSide,depthWrite:!1,fog:!1,vertexShader:"varying vec3 vDir; void main(){ vDir = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }",fragmentShader:`
        uniform float uTime, uWarm; uniform vec3 uTop, uBand, uGarnet, uCool, uRedS, uOrangeS; varying vec3 vDir;
        ${bt}
        void main(){
          vec3 d = normalize(vDir + vec3(0., 1e-5, 0.));
          float el = asin(clamp(d.y, -1., 1.)), az = atan(d.x, -d.z + 1e-5);
          float breathe = 1. + 0.10 * sin(uTime * 0.37 + az * 5.) + 0.06 * sin(uTime * 0.23 - az * 11.);
          float band = exp(-max(el, 0.) / 0.030) * breathe;
          vec3 c = uTop + uGarnet * 0.10 * exp(-max(el, 0.) / 0.22);
          c = mix(c, uBand * (el > 0. ? 1.5 : 1.0), clamp(band, 0., 1.));
          // (polish 5) the planet's own light in the thin rock vapour over the horizon: as the crust opens and the floor turns gold (uWarm, by u)
          // the band warms from garnet to a dull red glow a few degrees high, so the sky over the open sea is not an empty black band
          c += (uRedS * 0.23 + uOrangeS * 0.035) * uWarm * exp(-max(el, 0.) / 0.048) * (0.85 + 0.15 * breathe);
          // stars: two layers of cells in (azimuth, elevation), turning with the sky
          float turn = uTime * 0.00036; vec3 acc = vec3(0.);
          for (int L = 0; L < 2; L++) {
            float sc = L == 0 ? 70. : 150.;
            vec2 uv = vec2((az + turn) * cos(clamp(el, -1.4, 1.4)), el) * sc + float(L) * 13.7, id = floor(uv), f = fract(uv) - 0.5;
            float h = hash21(id + 3.1), b = h * h; b = b * b; b = b * b * (L == 0 ? 2.6 : 1.0) * step(L == 0 ? 0.62 : 0.74, h);
            vec2 o = (vec2(hash21(id + 7.7), hash21(id + 19.3)) - 0.5) * 0.7;
            float r = L == 0 ? 0.075 : 0.13, tw = 0.8 + 0.2 * sin(uTime * (1.5 + 3. * h) + h * 60.);
            acc += mix(vec3(1., 0.86, 0.74), vec3(0.80, 0.84, 1.0), hash21(id + 5.)) * b * tw * (1. - smoothstep(r * 0.3, r, length(f - o)));
          }
          c += acc * 1.5 * smoothstep(0.012, 0.09, el);
          gl_FragColor = vec4(c, 1.);
        }`}));Re.frustumCulled=!1,Re.renderOrder=-1,Re.name="sky",W.add(Re);const E0={uTime:ye.uTime,uVeil:{value:et},uGarnet:R(y[1]),uRed:R(y[2])},He=new i.Mesh(new i.PlaneGeometry(2,1,24,6),new i.ShaderMaterial({uniforms:E0,transparent:!0,depthWrite:!1,fog:!1,vertexShader:`varying vec2 vA; void main(){ float az = position.x * 0.75, el = (position.y + 0.5) * 0.26 - 0.01; vA = vec2(az, el);
        vec3 d = vec3(sin(az) * cos(el), sin(el), -cos(az) * cos(el)); gl_Position = projectionMatrix * viewMatrix * vec4(cameraPosition + d * 4300., 1.); }`,fragmentShader:`
        uniform float uTime, uVeil; uniform vec3 uGarnet, uRed; varying vec2 vA;
        ${bt}
        void main(){
          vec2 q = vec2(vA.x * 9. + uTime * 0.012, vA.y * 70.);
          float n = fbm3(q) * 0.65 + fbm3(q * vec2(2.3, 1.7) + 5. - uTime * 0.02) * 0.35;
          float v = smoothstep(0.42, 0.78, n) * exp(-pow(abs(vA.y - 0.050) / 0.045, 2.)) * (1. - smoothstep(0.55, 0.75, abs(vA.x)));
          float a = v * 0.5 * uVeil;
          gl_FragColor = vec4((uGarnet * 1.5 + uRed * 0.30) * (0.6 + 0.6 * n), a);
        }`}));He.frustumCulled=!1,He.renderOrder=-.4,He.name="veils",W.add(He),await m.yield();const Zt=()=>{const e=new i.InstancedBufferGeometry;return e.setAttribute("position",new i.Float32BufferAttribute([0,-1,0,1,-1,0,1,1,0,0,1,0],3)),e.setIndex([0,1,2,0,2,3]),e},Ne=Ct<1?8:6,ft=Zt(),Kt=new Float32Array(Ne);for(let e=0;e<Ne;e++)Kt[e]=e;ft.setAttribute("aSlot",new i.InstancedBufferAttribute(Kt,1)),ft.instanceCount=Ne;const Ue=new i.Mesh(ft,new i.ShaderMaterial({uniforms:{uTime:ye.uTime,uResY:X.uResY,uGap:{value:Ct},uSlots:{value:Ne},uGold:R(y[4]),uCream:R(y[5]),uOrange:R(y[3])},transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,fog:!1,side:i.DoubleSide,vertexShader:`
        attribute float aSlot; uniform float uTime, uGap, uSlots, uResY; varying vec4 vM;
        float h2(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
        vec3 dirOf(vec2 ae){ return vec3(sin(ae.x) * cos(ae.y), sin(ae.y), -cos(ae.x) * cos(ae.y)); }
        void main(){
          float T = uGap * uSlots, tt = uTime + aSlot * uGap + 41.3, cyc = floor(tt / T), t = tt - cyc * T;
          float r1 = h2(vec2(aSlot + 1.3, cyc)), r2 = h2(vec2(cyc + 5.1, aSlot + 9.)), r3 = h2(vec2(aSlot + 21., cyc + 2.7)), r4 = h2(vec2(cyc, aSlot + 31.7));
          float life = min(2.6 + 1.0 * r3, T * 0.95), tau = t / life;      // slow gold ribbons
          vec2 a0 = vec2((r1 - 0.5) * 0.90, 0.10 + 0.07 * r2), da = vec2(sin((r4 - 0.5) * 1.7), -cos((r4 - 0.5) * 1.7));
          float len = (0.060 + 0.030 * r1) * smoothstep(0., 0.3, tau);      // 3.4 to 5.2 degrees long (the brief's 3 to 5)
          vec2 ae = a0 + da * (tau * (0.075 + 0.04 * r3) - position.x * len);
          mat4 PV = projectionMatrix * viewMatrix;
          vec4 c1 = PV * vec4(cameraPosition + dirOf(ae) * 4200., 1.), c2 = PV * vec4(cameraPosition + dirOf(ae + da * 0.004) * 4200., 1.);
          float asp = projectionMatrix[1][1] / max(projectionMatrix[0][0], 1e-4);
          vec2 sd = (c2.xy / max(c2.w, 1e-3) - c1.xy / max(c1.w, 1e-3)) * vec2(asp, 1.); float sl = length(sd); sd = sl > 1e-6 ? sd / sl : vec2(0., 1.);
          float w = (2.0 + 1.0 * r2) * mix(1., 0.3, position.x) * 2. / max(uResY, 100.) * (tau < 1. ? 1. : 0.);
          c1.xy += vec2(-sd.y / asp, sd.x) * position.y * w * c1.w;
          // (polish 5) a ribbon is never cut by the frame: it dims as either end of it nears the edge of the picture
          vec2 trv = da * (tau * (0.075 + 0.04 * r3));
          vec4 eH = PV * vec4(cameraPosition + dirOf(a0 + trv) * 4200., 1.), eT = PV * vec4(cameraPosition + dirOf(a0 + trv - da * len) * 4200., 1.);
          vec2 nH = abs(eH.xy) / max(eH.w, 1e-3), nT = abs(eT.xy) / max(eT.w, 1e-3);
          float inF = (eH.w > 0. && eT.w > 0.) ? (1. - smoothstep(0.80, 0.96, max(max(nH.x, nH.y), max(nT.x, nT.y)))) : 0.;
          vM = vec4(position.x, position.y, tau, inF);
          gl_Position = c1;
        }`,fragmentShader:`
        uniform vec3 uGold, uCream, uOrange; varying vec4 vM;
        void main(){
          float k = pow(max(1. - vM.x, 0.), 2.2);
          float a = k * (1. - vM.y * vM.y) * smoothstep(0., 0.12, vM.z) * (1. - smoothstep(0.6, 1., vM.z)) * clamp(vM.w, 0., 1.);
          vec3 c = mix(uOrange * 0.9, uGold * 1.6 + uCream * 1.2, k);
          gl_FragColor = vec4(c * a, 1.);
        }`}));Ue.frustumCulled=!1,Ue.renderOrder=4,Ue.name="meteors",W.add(Ue);const Ye=new i.Group;Ye.name="carried";const ht=Math.max(60,Math.round(400*me*Mt)),dt=Zt(),$t=new Float32Array(ht*4),P0=D.fork("embers");for(let e=0;e<ht*4;e++)$t[e]=P0();dt.setAttribute("aSeed",new i.InstancedBufferAttribute($t,4)),dt.instanceCount=ht;const mt=new i.Mesh(dt,new i.ShaderMaterial({uniforms:{uTime:ye.uTime,uResY:X.uResY,uGold:R(y[4]),uOrange:R(y[3])},transparent:!0,depthWrite:!1,blending:i.AdditiveBlending,fog:!1,vertexShader:`
        attribute vec4 aSeed; uniform float uTime, uResY; varying vec3 vE;
        void main(){
          vec3 box = vec3(64., 26., 64.);
          vec3 fwd = -vec3(viewMatrix[0][2], viewMatrix[1][2], viewMatrix[2][2]), ctr = cameraPosition + fwd * 48.;
          vec3 b = aSeed.xyz * box + vec3(sin(uTime * 0.5 + aSeed.w * 30.) * 1.4, uTime * (0.8 + 1.5 * aSeed.w), cos(uTime * 0.4 + aSeed.w * 17.) * 1.4);
          vec3 wv = mod(b - ctr, box), p = ctr + wv - 0.5 * box, e = wv / box;
          float fade = smoothstep(0., 0.14, e.x) * (1. - smoothstep(0.86, 1., e.x)) * smoothstep(0., 0.14, e.y) * (1. - smoothstep(0.86, 1., e.y)) * smoothstep(0., 0.14, e.z) * (1. - smoothstep(0.86, 1., e.z));
          vec4 mv = viewMatrix * vec4(p, 1.);
          float px = -mv.z * 2. / (projectionMatrix[1][1] * max(uResY, 100.));
          float sz = max(0.035 + 0.06 * aSeed.w * aSeed.x, px * 0.9);
          mv.xy += vec2(position.x * 2. - 1., position.y) * sz;
          vE = vec3(position.x * 2. - 1., position.y, fade * (0.65 + 0.35 * sin(uTime * (1. + 2. * aSeed.y) + aSeed.z * 50.)) * min(1., (0.035 + 0.06 * aSeed.w * aSeed.x) / sz + 0.3));
          gl_Position = projectionMatrix * mv;
        }`,fragmentShader:`
        uniform vec3 uGold, uOrange; varying vec3 vE;
        void main(){ float d = max(1. - dot(vE.xy, vE.xy), 0.); gl_FragColor = vec4(mix(uOrange, uGold * 1.6, d) * d * d * vE.z * 1.6, 1.); }`}));mt.frustumCulled=!1,mt.renderOrder=5,Ye.add(mt),W.add(Ye),await m.yield();const ue=new i.Vector3,K0=new i.Vector3,Jt=new i.Vector3,O0=Se([[0,5],[.08,-4],[.16,10.5],[.25,-12.5],[.34,0],[.46,0],[.52,-5],[.565,-9],[.61,-15],[.655,6],[.7,13],[.79,12.5],[.86,12],[1,12]]),L0=Se([[0,0],[.1,0],[.16,2.4],[.22,0],[.525,0],[.567,-.5],[.603,-12],[.617,-12],[.653,-.7],[.7,-.3],[1,0]]),j0=(e,t)=>{const o=O0(t)*Qe;return E.pointAt(t,ue),ue.x+=Math.sin(o)*3e3,ue.z-=Math.cos(o)*3e3,ue.y+=Math.tan(L0(t)*Qe)*3e3,ue},B0=e=>.93+.17*Q(.5,.6,e)-.1*Q(.82,.9,e),Xe=e=>{let t=0,o=1;for(let a=0;a<24;a++){const r=(t+o)/2;-E.pointAt(r,ue).z<e?t=r:o=r}return(t+o)/2},fe=[[Xe(S-540),0],[Xe(S-384),.22],[Xe(S-240),.6],[Xe(S+35),1]],V0=e=>{if(e<=fe[0][0])return 0;for(let t=0;t<3;t++)if(e<=fe[t+1][0])return Pe(fe[t][1],fe[t+1][1],(e-fe[t][0])/(fe[t+1][0]-fe[t][0]));return 1},pt=tt.uMoonScar.value;return pt.set(.24+.2*D(),.1+.3*D(),0,0),{scene:W,path:E,duration:46,pace:B0,title:"The Ember Moon \xB7 4.5 billion years ago",camera:{fov:22,near:1,far:6e3,lookAhead:120,sway:0,bank:.6},pois:[{at:j0,from:0,to:1,fade:.04,weight:1}],portal:{shape:"circle",radius:7,color:"#D9D4EC",glow:.7,revealDistance:520},post:{exposure:1,bloom:{strength:.45,radius:.34,threshold:1.4},grade:{saturation:1.05,contrast:1.06,tint:"#ffffff",shadowTint:"#48474b",vignette:.3,grain:.03}},ride:"none",companion:"none",style:"none",update:(e,t,o,a)=>{X.uSwell.value.x=yt(a),Ut.value=-E.pointAt(a,ue).z,L.setProgress(V0(a)),L.setEarthGlow(Q(.05,.55,a)),L.update(e,t,o),_.update(e,t),ye.uTime.value=t,ye.uWarm.value=.2+.8*Q(.3,.68,a),Jt.setFromMatrixPosition(o.matrixWorld),Re.position.copy(Jt),v0&&(pt.z=.25*Q(.13,.275,a),pt.w=Q(.127,.132,a)*(1-Q(.132,.152,a))),Ye.visible=a>0&&!m.through},dispose(){}}}};export{eo as default};
