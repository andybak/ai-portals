import*as c from"three";import{clamp as O,lerp as Z,smoothstep as Y,makeRng as ge,hashSeed as xe}from"../kit/core.js";const _e=["#F6E6E8","#F2B8C6","#D4567A","#A8553A","#1F3B30","#5FA08C","#BCD3E0"],Xt=15,It=20,ot=8,vt=2.5,we=6.3,Fe=3.2,_t=()=>c.UniformsUtils.clone(c.UniformsLib.fog),Ft=()=>c.UniformsUtils.clone(c.UniformsLib.lights),Bt=`
  #include <common>
  #include <lights_pars_begin>
  uniform float uSunGain, uAmbGain;
  vec3 psSunDir(){
    #if NUM_DIR_LIGHTS > 0
      return directionalLights[0].direction;
    #else
      return vec3(0.0, 1.0, 0.0);
    #endif
  }
  vec3 psSunCol(){
    #if NUM_DIR_LIGHTS > 0
      return directionalLights[0].color*uSunGain;
    #else
      return vec3(0.0);
    #endif
  }
  vec3 psAmb(vec3 n){
    vec3 irr = ambientLightColor;
    #if NUM_HEMI_LIGHTS > 0
      irr += getHemisphereLightIrradiance(hemisphereLights[0], n);
    #endif
    return irr*uAmbGain;
  }
  float psHash(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.y); }
  float psNoise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
    return mix(mix(psHash(i), psHash(i + vec2(1.0, 0.0)), f.x), mix(psHash(i + vec2(0.0, 1.0)), psHash(i + vec2(1.0, 1.0)), f.x), f.y); }
  // a thin translucent petal. alb albedo, n view-space normal turned to the viewer, vd unit eye-to-fragment,
  // trB light through the back of the petal, trS glow when looking toward the sun, shade 0..1 sun reaching it
  vec3 psPetal(vec3 alb, vec3 n, vec3 vd, float trB, float trS, float shade){
    vec3 L = psSunDir(); float nl = dot(n, L);
    float front = max(nl, 0.0), back = max(-nl, 0.0);
    float toSun = max(dot(vd, L), 0.0);
    vec3 through = alb*vec3(1.05, 0.62, 0.74);
    vec3 sun = psSunCol()*shade;
    vec3 c = alb*RECIPROCAL_PI*(sun*(front*0.85 + 0.12) + psAmb(n));
    c += through*RECIPROCAL_PI*sun*(trB*back + trS*toSun*toSun);
    return c;
  }
`,Jt=`
  uniform float uTime, uClock;
  uniform vec3 uWindH;                 // x, z: unit horizontal wind; y: rise per metre travelled
  // swung out like hair, then easing to a steady stream: nothing is torn off. (0.62: the curtain leans and flies but the crown keeps
  // its dome and its tiers, so from the pass above it is still a tree and not a sheet of streaks)
  float psLift(float rel, float clock){ float c = clock - rel*1.4; return 0.62*smoothstep(-1.5, 0.7, c)*(1.0 - 0.36*smoothstep(3.2, 8.0, c)); }
  float psTb(float rel, float t, float id){ return rel*2.1 + (1.0 - t)*0.45 + id*0.5; }
  // THE GUST STRIPS THE WINDWARD HALF (uStrip 0..1.2 runs with the gust clock; 0 = nothing is taken). A strand's share of
  // blossom gone: the most windward go first and go bare, the middle of the crown is thinned, the lee half keeps everything.
  uniform float uStrip;
  float psStripLim(float rel){ return 0.94*smoothstep(0.64, 0.3, rel); }
  float psStrip(float rel){ return clamp((uStrip - rel*0.9)/0.35, 0.0, 1.0)*psStripLim(rel); }
  vec3 psStrand(vec4 A, vec4 B, float t, float la, float swayK, float tm){
    float L = A.w, La = max(B.y, 0.2), s = t*L;
    vec2 o = vec2(sin(B.x), cos(B.x));
    float e = exp(-s/La);
    float xo = 0.9*La*(1.0 - e);                       // the twig arches outward ...
    float bump = (1.2 + 1.8*fract(B.z*3.17))*s*exp(-s/(0.7*La));   // ... and up before it falls
    float sig = s - La*(1.0 - e);                      // hanging length so far
    float sigL = max(L - La*(1.0 - exp(-L/La)), 0.5);  // whole hanging length
    float pulse = 0.11*sin(tm*2.3 + B.z) + 0.06*sin(tm*5.1 + B.z*3.0);
    float th = la*(0.86 + 0.6*fract(B.z*7.31) + pulse);
    float th0 = th*0.40, th1 = max(th*0.85/sigL, 1e-4);
    float hx = (cos(th0) - cos(th0 + th1*sig))/th1;    // the chain integrated along a turning angle:
    float hy = -(sin(th0 + th1*sig) - sin(th0))/th1;   // hx downwind, hy down
    vec3 p = A.xyz + vec3(o.x*xo, bump, o.y*xo);
    p += vec3(uWindH.x*hx, hy + uWindH.y*hx, uWindH.z*hx);
    float w = 3.2*inversesqrt(max(L, 1.0));
    float tt = t*sqrt(max(t, 0.0));
    float gst = 1.0 + 0.7*sin(tm*0.31 + A.x*0.15 + A.z*0.11);
    vec2 sw = o*sin(tm*w + B.z + 2.2*t) + vec2(-o.y, o.x)*0.6*sin(tm*w*1.31 + B.z*1.7 + 1.4*t);
    p.xz += sw*tt*(0.07 + 0.009*L)*gst*swayK*(1.0 - 0.7*la);
    vec2 sd = vec2(-uWindH.z, uWindH.x);
    float fl = la*t*swayK;
    p.xz += sd*fl*(0.5*sin(tm*6.3 - s*0.9 + B.z) + 0.24*sin(tm*11.0 - s*2.1 + B.z*1.7));
    p.y += fl*0.4*sin(tm*8.1 - s*1.2 + B.z*2.0);
    return p;
  }
`,ye=`
  float psPetalMask(vec2 q){
    float tp = 0.55 + 0.45*clamp(q.y, 0.0, 1.0);
    float d = (q.x*q.x)/(0.1444*tp*tp) + (q.y - 0.58)*(q.y - 0.58)/0.25;
    float notch = length(vec2(q.x, q.y - 1.1));
    return (d > 1.0 || notch < 0.12) ? 0.0 : 1.0;
  }
`,s=(t,e,z)=>new c.Vector3(t,e,z);function Ht(t,e=1){const z=new c.Color(t);return new c.Vector3(z.r*e,z.g*e,z.b*e)}function Gt(t,e,z){return new c.Vector3().copy(t).lerp(e,z)}function be(t,e,z){const k=Math.max(0,Math.abs(z)-26);return Math.hypot(t-ot,e-vt,k)}function Me(t,e){const z=be(t.x,t.y,t.z),k=we+e;if(z>=k)return;let p=t.x-ot,M=t.y-vt;const o=Math.hypot(p,M);o<.001?(p=0,M=1):(p/=o,M/=o),M<.35&&(M=.35,p=Math.sqrt(1-M*M)*Math.sign(p||1)),t.x=ot+p*k,t.y=vt+M*k}function Se(t){t.y>It-.7&&(t.y=It-.7);const e=(Xt-.4)*Math.sqrt(Math.max(.05,1-(t.y/(It+.5))**2)),z=Math.hypot(t.x,t.z);z>e&&(t.x*=e/z,t.z*=e/z)}function Be(t,e){return{pos:new Float32Array(t*3),nor:new Float32Array(t*3),col:new Float32Array(t*3),uv:new Float32Array(t*2),idx:new Uint32Array(e),nv:0,ni:0,maxV:t,maxI:e}}const xt=s(0,0,0),Xe=s(0,0,0),wt=s(0,0,0),At=s(0,0,0);function Ge(t,e,z,k,p={}){const M=e.length;if(M<2||t.nv+M*(k+1)>t.maxV||t.ni+(M-1)*k*6>t.maxI)return;const o=p.flute??0,L=p.k1??5,T=p.k2??8,P=p.twist??0,Q=p.phase??0,H=p.bump??0,K=p.noise,tt=p.moss??0,G=p.ao??1,W=t.nv;let h=0,w=!1;const l=s(1,0,0);for(let B=0;B<M;B++){const $=e[Math.max(B-1,0)],D=e[Math.min(B+1,M-1)],a=e[B];xt.subVectors(D,$),xt.lengthSq()<1e-10&&xt.set(0,1,0),xt.normalize(),w||(l.set(0,0,1),Math.abs(xt.z)>.9&&l.set(1,0,0),w=!0),l.addScaledVector(xt,-l.dot(xt)),l.lengthSq()<1e-8&&l.set(xt.y,-xt.x,0),l.normalize(),wt.crossVectors(xt,l),B>0&&(h+=a.distanceTo(e[B-1]));const m=z[B],v=n=>{let _=1+o*(.6*Math.sin(L*n+P*h+Q)+.4*Math.sin(T*n-P*.6*h+Q*2.3));if(H&&K){const d=Math.cos(n),f=Math.sin(n);_+=H*K.n3((a.x+(l.x*d+wt.x*f)*m)*.9,(a.y+(l.y*d+wt.y*f)*m)*.7,(a.z+(l.z*d+wt.z*f)*m)*.9)}return _};for(let n=0;n<=k;n++){const _=n/k*Math.PI*2,d=Math.cos(_),f=Math.sin(_),S=m*v(_),N=m*(v(_+.06)-v(_-.06))/.12,F=l.x*d+wt.x*f,j=l.y*d+wt.y*f,g=l.z*d+wt.z*f,C=-l.x*f+wt.x*d,V=-l.y*f+wt.y*d,at=-l.z*f+wt.z*d,E=t.nv*3;t.pos[E]=a.x+F*S,t.pos[E+1]=a.y+j*S,t.pos[E+2]=a.z+g*S,At.set(F*S-C*N,j*S-V*N,g*S-at*N),At.lengthSq()<1e-12&&At.set(F,j,g),At.normalize(),t.nor[E]=At.x,t.nor[E+1]=At.y,t.nor[E+2]=At.z,t.col[E]=G*(p.aoFn?p.aoFn(a.y):1),t.col[E+1]=tt,t.col[E+2]=O(m/.8,0,1),t.uv[t.nv*2]=_*Math.max(m,.05),t.uv[t.nv*2+1]=h,t.nv++}}const R=k+1;for(let B=0;B<M-1;B++)for(let $=0;$<k;$++){const D=W+B*R+$,a=D+1,m=D+R,v=m+1;t.idx[t.ni++]=D,t.idx[t.ni++]=a,t.idx[t.ni++]=m,t.idx[t.ni++]=a,t.idx[t.ni++]=v,t.idx[t.ni++]=m}}function qt(t,e,z){const k=O(e,0,1)*(t.length-1),p=Math.min(t.length-2,Math.floor(k));return z.copy(t[p]).lerp(t[p+1],k-p)}function Kt(t,e){const z=O(e,0,.999)*(t.length-1),k=Math.min(t.length-2,Math.floor(z));return Math.atan2(t[k+1].x-t[k].x,t[k+1].z-t[k].z)}function jt(t,e){const z=O(e,0,1)*(t.length-1),k=Math.min(t.length-2,Math.floor(z));return Z(t[k],t[k+1],z-k)}function Ne(t,e,z=[]){const k=(o,L,T)=>{const P=Math.hypot(o,L),Q=(t.n2(o*.42+e,L*.42-e)*.7+t.n2(o*1.05-e,L*1.05+e)*.3)*Y(2.2,5.5,P)*(1-Y(15.5,18.5,P));let H=0,K=1e9;for(const tt of z){const G=tt.P;let W=1e9,h=0;for(let R=0;R+1<G.length;R++){const B=G[R][0],$=G[R][1],D=G[R+1][0]-B,a=G[R+1][1]-$,m=O(((o-B)*D+(L-$)*a)/(D*D+a*a),0,1),v=Math.hypot(o-B-D*m,L-$-a*m);v<W&&(W=v,h=(R+m)/(G.length-1))}W<K&&(K=W);const w=Z(.62,.3,h),l=tt.h*Y(0,.12,h)*(1-Y(.55,1,h));H=Math.max(H,l*Math.exp(-(W*W)/(w*w)))}return T[0]=.28+.8*Math.exp(-(P*P)/27)+.2*t.fbm2(o*.13+e,L*.13-e,3)*Y(1.5,6,P)-1.7*Y(13,19,P)+.24*Q+H,T[1]=Q,T[2]=H,T[3]=K,T},p=[0,0,0,0],M=(o,L)=>k(o,L,p)[0];return M.info=k,M}async function Ve(t,e,z,k=[]){const p=t.noise,M=Be(4e4,23e4),o=[],L=e.range(0,100),T=e.range(Math.PI*.62,Math.PI*1.38),P=e.range(.2,.55),Q=e.range(17.3,18.6),H=(a,m)=>{const v=O(a/4.3,0,1),n=Y(5,12,a);return m.set(Math.cos(T)*P*v*v+p.n2(a*.23+L,1.7)*.3*O(a/3,0,1)+p.n2(a*.15+L,9.1)*1.3*n,a,Math.sin(T)*P*v*v+p.n2(a*.23+L,4.9)*.3*O(a/3,0,1)+p.n2(a*.15+L,13.3)*1.3*n)},K=a=>1.5+1.15*Math.exp(-(a+.9)/.75)+.28*Math.exp(-(((a-4.2)/1)**2)),tt=a=>a<=4.3?K(a):(.16+(K(4.3)-.16)*Math.exp(-(a-4.3)/1.7))*(1-.72*Y(13.5,Q,a)),G=(a,m,v,n,_,d)=>{if(Ge(M,a,m,v,{noise:p,...n}),_>0)for(let f=1;f<a.length;f++){const S=f/(a.length-1);S<=d||o.push({a:a[f-1],b:a[f],r:m[f],up:!!n.up,w:_*a[f].distanceTo(a[f-1])*(.6+.8*S)*(1+2.6*Y(9,16,a[f].y))})}},W=(a,m,v,n,_,d,f,S,N)=>{const F=[],j=[],g=e.range(0,100);for(let C=0;C<S;C++){const V=C/(S-1),at=m+N*p.n2(V*2.3+g,5.1)*V,E=v*(V-.12*V*V),et=Z(d,f,Math.pow(V,.8)),ht=s(a.x+Math.sin(at)*E,a.y+n*4*V*(1-V)-_*V*V+.22*p.n2(V*3.7+g,11.3)*V,a.z+Math.cos(at)*E);C>0&&(Me(ht,et),Se(ht)),F.push(ht),j.push(et)}return{P:F,R:j}},h=(a,m,v)=>{for(const n of m){const _=qt(a.P,n,s(0,0,0)),d=Kt(a.P,n)+e.sign()*e.range(.25,1.05),f=e.range(2.4,4.4)*v,S=W(_,d,f,e.range(.3,1),f*e.range(.32,.66),Math.min(.05,jt(a.R,n)),.016,6,.9);G(S.P,S.R,4,{moss:-.25},3,.1)}},w=(a,m)=>{for(const v of m){const n=qt(a.P,v,s(0,0,0)),_=Kt(a.P,v)+e.sign()*e.range(.2,1.3),d=e.range(2.6,4.6),f=W(n,_,d,e.range(1.5,2.8),e.range(.1,1),Math.min(.065,jt(a.R,v)),.018,7,.9);G(f.P,f.R,4,{moss:-.25,up:!0},4.5,.3)}};{const a=[-.9,-.3,.2,.7,1.3,2,2.8,3.6,4.3,5,5.8,6.8,8,9.5,11,12.6,14.2,15.8,Q],m=[],v=[];for(const f of a)m.push(H(f,s(0,0,0))),v.push(tt(f));G(m,v,20,{flute:.15,k1:5,k2:9,twist:.33,phase:e.range(0,6),bump:.07,moss:.12,aoFn:f=>.62+.38*Y(-.3,2.2,f)},1,.8),await t.yield();const n={P:m.slice(11),R:v.slice(11)};h(n,[.55,.7,.82,.92,1,1],1),w(n,[.6,.8,.95,1]),await t.yield();const _=12,d=e.range(0,6.28);for(let f=0;f<_;f++){const S=7.6+f/(_-1)*(Q-9.2)+e.range(-.3,.3),N=H(S,s(0,0,0)),F=(S-7.6)/9.5,j=e.range(4.6,7.6)*(1-.45*F),g=W(N,d+f*2.4+e.range(-.4,.4),j,e.range(.9,2),e.range(.8,2.2),Math.min(.2,tt(S)*.6),.045,9,.8);G(g.P,g.R,6,{flute:.08,bump:.05,moss:0},1.4,.35),h(g,[.4,.62,.84,1],.95),w(g,[.3,.6,.9]),f%2===1&&await t.yield()}}await t.yield();{const a=e.int(6,8),m=e.range(0,6.28);for(let v=0;v<a;v++){const n=m+(v+e.range(-.3,.3))/a*Math.PI*2,_=e.range(0,100),d=e.range(4.4,7.2)*(Math.sin(n)>.3?.72:1),f=[],S=[];for(let N=0;N<8;N++){const F=N/7,j=n+.55*p.n2(F*2.1+_,2.2)*F,g=.9+(d-.9)*F,C=Math.sin(j)*g,V=Math.cos(j)*g;f.push(s(C,Z(1.25,z(C,V)-.3,Math.pow(F,.55))+.1*p.n2(F*4+_,6.6),V)),S.push(.58*Math.pow(1-F,.8)+.11)}G(f,S,7,{flute:.12,k1:3,k2:5,twist:.5,phase:_,bump:.08,moss:.3,aoFn:()=>.7},0,1)}}for(const a of k){const m=[],v=[];for(let _=0;_<=9;_++){const d=_/9,f=d*a.wood*(a.P.length-1),S=Math.min(a.P.length-2,Math.floor(f)),N=f-S,F=Z(a.P[S][0],a.P[S+1][0],N),j=Z(a.P[S][1],a.P[S+1][1],N),g=.66*Math.pow(1-d,.7)+.13;m.push(s(F,Z(1.5,z(F,j)+g*.25-.3*d*d,Math.pow(Math.min(1,d*2.2),.6)),j)),v.push(g)}G(m,v,9,{flute:.14,k1:3,k2:5,twist:.45,phase:a.sd,bump:.09,moss:.32,aoFn:()=>.78},0,1)}const l=e.int(6,8),R=e.range(0,6.28),B=e.range(0,6.28),$=e.range(.05,.16);for(let a=0;a<l;a++){const m=R+(a+e.range(-.28,.28))/l*Math.PI*2,v=e.range(9.6,12.6)*(1+$*Math.cos(m-B)),n=e.range(3.3,5.3),_=e.range(11,15.5),d=e.range(0,100),f=H(n,s(0,0,0)),S=[],N=[];for(let g=0;g<13;g++){const C=g/12,V=m+.5*p.n2(C*1.9+d,3.3)*C,at=v*Math.pow(C,.85),E=.6*Math.pow(1-C,1.15)+.1,et=s(f.x+Math.sin(V)*at,n+(_-n)*(1-Math.pow(1-C,2.3))-1.4*C**4+.6*p.n2(C*3.1+d,7.7)*Math.min(1,C*3),f.z+Math.cos(V)*at);g>0&&(Me(et,E),Se(et)),S.push(et),N.push(E)}const F={P:S,R:N};G(S,N,9,{flute:.13,k1:4,k2:7,twist:.6,phase:d,bump:.08,moss:.1},1,.7);let j=e.sign();for(const g of[.3,.45,.6,.78,.94]){const C=O(g+e.range(-.05,.05),0,1);j=-j;const V=qt(S,C,s(0,0,0)),at=e.range(4.6,7.6)*(1-.22*C),E=W(V,Kt(S,C)+j*e.range(.45,1.2),at,e.range(.6,1.6),e.range(1,3),Math.min(.3,jt(N,C)*.6),.045,9,.9);G(E.P,E.R,6,{flute:.08,bump:.05,moss:0},1.4,.35),h(E,[.36,.58,.8,1],1),w(E,[.3,.62]),await t.yield()}h(F,[.88,1,1],1.1),w(F,[.36,.5,.64,.78,.9]),await t.yield()}{const a=e.range(0,100),m=[[.4,3.3,-1.3],[1,4.1,-4.2],[1.7,4.6,-7.2],[2.5,5,-9.8],[3.1,5.6,-12],[3,6.6,-14],[2.2,7.9,-15.6]],v=[],n=[];for(let d=0;d<=18;d++){const f=d/18*(m.length-1),S=Math.min(m.length-2,Math.floor(f)),N=f-S,F=m[S],j=m[S+1];v.push(s(Z(F[0],j[0],N)+.22*p.n2(d*.5+a,2.1),Z(F[1],j[1],N)+.18*p.n2(d*.45+a,7.4),Z(F[2],j[2],N))),n.push(.62*Math.pow(1-d/18,.9)+.13)}const _={P:v,R:n};G(v,n,11,{flute:.14,k1:4,k2:7,twist:.5,phase:a,bump:.09,moss:.34},1.6,.25);for(const[d,f]of[[.45,-1],[.62,1],[.8,-1],[.95,1]]){const S=qt(v,d,s(0,0,0)),N=e.range(3.4,5.2),F=W(S,Kt(v,d)+f*e.range(.5,1),N,e.range(.8,1.6),e.range(.6,1.8),Math.min(.22,jt(n,d)*.6),.04,8,.8);G(F.P,F.R,6,{flute:.08,bump:.05,moss:.1},1.6,.3),h(F,[.5,.8,1],.9),w(F,[.4,.8])}h(_,[.7,.86,1,1],1),w(_,[.5,.7,.9]),await t.yield()}const D=new c.BufferGeometry;return D.setAttribute("position",new c.BufferAttribute(M.pos.slice(0,M.nv*3),3)),D.setAttribute("normal",new c.BufferAttribute(M.nor.slice(0,M.nv*3),3)),D.setAttribute("aCol",new c.BufferAttribute(M.col.slice(0,M.nv*3),3)),D.setAttribute("uv",new c.BufferAttribute(M.uv.slice(0,M.nv*2),2)),D.setIndex(new c.BufferAttribute(M.idx.slice(0,M.ni),1)),D.computeBoundingSphere(),{geometry:D,cand:o,topY:Q,tris:M.ni/3}}function We(t,e){return new c.ShaderMaterial({fog:!0,lights:!0,uniforms:{...Ft(),..._t(),uSunGain:t.uSunGain,uAmbGain:t.uAmbGain,uBare:t.uBare,uSnow:t.uSnow,uTime:t.uTime,uBark:{value:e.bark},uBarkRed:{value:e.barkRed},uMossD:{value:e.mossD},uMossL:{value:e.mossL},uLichen:{value:e.lichen}},vertexShader:`
      attribute vec3 aCol;
      varying vec3 vN, vNl, vP, vCol, vVP; varying vec2 vUv;
      #include <fog_pars_vertex>
      void main(){
        vP = position; vNl = normal; vCol = aCol; vUv = uv;
        vN = normalize(normalMatrix*normal);
        vec4 mvPosition = modelViewMatrix*vec4(position, 1.0);
        vVP = mvPosition.xyz;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Bt}
      uniform vec3 uBark, uBarkRed, uMossD, uMossL, uLichen; uniform float uBare, uSnow, uTime;
      varying vec3 vN, vNl, vP, vCol, vVP; varying vec2 vUv;
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN); vec3 nl = normalize(vNl);
        float big = vCol.z;
        float n1 = psNoise(vUv*vec2(2.2, 0.9)), n2 = psNoise(vUv*vec2(9.0, 3.0) + 7.0);
        float band = smoothstep(0.55, 0.85, psNoise(vec2(vUv.x*1.6, vUv.y*11.0)));          // the cherry's horizontal lenticels
        float crack = smoothstep(0.62, 0.9, psNoise(vec2(vUv.x*7.0, vUv.y*1.1) + 3.0))*big;  // old bark splits lengthways
        vec3 bark = mix(uBarkRed, uBark, smoothstep(0.04, 0.3, big))*(0.62 + 0.55*n1 + 0.3*n2);
        bark = mix(bark, bark*1.9 + 0.02, band*0.45*(1.0 - 0.6*big));
        bark *= 1.0 - 0.6*crack;
        bark = mix(bark, uLichen, smoothstep(0.72, 0.9, psNoise(vP.xz*1.7 + vP.y*2.3))*0.5*smoothstep(0.1, 0.5, big));
        float mn = psNoise(vP.xz*2.3 + vP.y*1.1), mf = psNoise(vP.xz*17.0 + vP.y*13.0);
        float moss = smoothstep(0.25, 0.75, nl.y*0.85 + vCol.y + (mn - 0.5)*0.8 + 0.25*big);
        vec3 mcol = mix(uMossD, uMossL, mn*0.6 + mf*0.5)*(0.75 + 0.5*mf);
        vec3 alb = mix(bark, mcol, moss);
        float snow = uSnow*smoothstep(0.35, 0.75, nl.y + (mn - 0.5)*0.4);
        alb = mix(alb, vec3(0.78, 0.8, 0.84), snow);
        vec3 L = psSunDir();
        float dap = 0.55 + 0.45*psNoise(vP.xz*0.9 + vP.y*0.6 + uTime*0.06);
        float domeD = length(vec3(vP.x/15.5, (vP.y - 2.0)/18.5, vP.z/15.5));
        float shade = mix(mix(0.42*dap + 0.1, 1.0, smoothstep(0.72, 1.0, domeD)), 1.0, uBare);   // under its own blossom until it strips
        shade = max(shade, (0.62 + 0.3*dap)*smoothstep(13.5, 7.0, vP.y)*smoothstep(-2.5, 1.5, vP.z + 0.3*vP.x));   // the south hall stands open: light reaches the trunk and its roots
        float nlg = max(dot(n, L), 0.0);
        float rim = pow(1.0 - max(dot(n, -normalize(vVP)), 0.0), 3.0);
        vec3 c = alb*RECIPROCAL_PI*(psSunCol()*nlg*shade + psAmb(n)*vCol.x*(1.0 + 0.5*rim));
        c += mcol*RECIPROCAL_PI*psSunCol()*moss*shade*0.25*max(dot(n, L)*0.5 + 0.5, 0.0);   // moss is velvety: a little wrap
        gl_FragColor = vec4(c, 1.0);
        #include <fog_fragment>
      }`})}async function De(t,e,z,k){const p=[],M=[],o=[],L=[0,0,0,0],T=36,P=96,Q=1+T*P,H=new Float32Array(Q*2),K=(h,w)=>{z.info(h,w,L);const l=p.length/3;H[l*2]=L[2],H[l*2+1]=L[3],p.push(h,L[0],w),M.push(0,L[1],0)};K(0,0);for(let h=1;h<=T;h++){const w=19*Math.pow(h/T,.85);for(let l=0;l<P;l++){const R=l/P*Math.PI*2+h%2*(Math.PI/P);K(Math.sin(R)*w,Math.cos(R)*w)}h%5===0&&k&&await k()}for(let h=0;h<P;h++)o.push(0,1+h,1+(h+1)%P);for(let h=1;h<T;h++)for(let w=0;w<P;w++){const l=1+(h-1)*P+w,R=1+(h-1)*P+(w+1)%P,B=l+P,$=R+P;o.push(l,B,R,R,B,$)}const tt=[],G=t.int(8,11);for(let h=0,w=0;h<G&&w<80;w++){const l=t.range(0,6.28),R=t.range(3.6,15.5),B=Math.sin(l)*R,$=Math.cos(l)*R,D=t.range(.45,1.25)*(R>9?1.25:1);if(Math.abs(B-ot)<3.2+D||tt.some(g=>Math.hypot(g.x-B,g.z-$)<g.s+D+.6))continue;tt.push({x:B,z:$,s:D}),h++;const a=12,m=7,v=p.length/3,n=t.range(0,100),_=t.range(.9,1.5),d=t.range(.5,.8),f=t.range(.8,1.3),S=t.range(0,6.28),N=z(B,$)+D*d*t.range(.05,.3),F=(g,C)=>{const V=C*Math.PI,at=g*Math.PI*2,E=Math.sin(V)*Math.cos(at),et=Math.cos(V),ht=Math.sin(V)*Math.sin(at);let bt=D*(1+.28*e.n3(E*1.2+n,et*1.2,ht*1.2)+.1*e.n3(E*3.1,et*3.1+n,ht*3.1));bt*=1-.22*Math.abs(Math.sin(E*2.3+n)*Math.sin(ht*2.9+n));const Nt=E*bt*_,ft=ht*bt*f;p.push(B+Nt*Math.cos(S)+ft*Math.sin(S),N+et*bt*d,$-Nt*Math.sin(S)+ft*Math.cos(S)),M.push(1,.3,.25+.6*Math.max(0,et))};F(0,0);for(let g=1;g<m;g++)for(let C=0;C<a;C++)F(C/a,g/m);F(0,1);const j=v+1+(m-1)*a;for(let g=0;g<a;g++)o.push(v,v+1+(g+1)%a,v+1+g);for(let g=0;g<m-2;g++)for(let C=0;C<a;C++){const V=v+1+g*a+C,at=v+1+g*a+(C+1)%a,E=V+a,et=at+a;o.push(V,at,E,at,et,E)}for(let g=0;g<a;g++)o.push(j,j-a+g,j-a+(g+1)%a)}k&&await k();for(let h=0;h<Q;h++){const w=p[h*3],l=p[h*3+2],R=Math.hypot(w,l);L[1]=M[h*3+1],L[2]=H[h*2],L[3]=H[h*2+1],h%900===899&&k&&await k();let B=0;for(const v of tt){const n=Math.hypot(w-v.x,l-v.z)/(v.s*1.25);B=Math.max(B,Math.exp(-((n-1.15)**2)/.16))}const $=L[3]<50?Math.exp(-(((L[3]-.75)/.5)**2))*Y(1.8,4,R)*(1-Y(11,13.5,R)):0,D=e.n2(w*.16+7.7,l*.16-3.1),a=e.n2((w*.75+l*.66)*.11,(l*.75-w*.66)*.5+5),m=Math.exp(-(((R-13.2)/2.3)**2))*(.45+.55*Y(-.2,.3,D));M[h*3+2]=O(.12+.62*$+.6*B+.42*m+.5*Y(.1,.5,a)*Y(-.1,.35,D)-.5*L[1]-1.2*L[2]-.25*Y(5,2,R),0,1)}k&&await k();const W=new c.BufferGeometry;return W.setAttribute("position",new c.Float32BufferAttribute(p,3)),W.setAttribute("aRock",new c.Float32BufferAttribute(M,3)),W.setIndex(o),W.computeVertexNormals(),W.computeBoundingSphere(),{geometry:W,stones:tt,tris:o.length/3}}function Ee(t,e){return new c.ShaderMaterial({fog:!0,lights:!0,uniforms:{...Ft(),..._t(),uSunGain:t.uSunGain,uAmbGain:t.uAmbGain,uTime:t.uTime,uSnow:t.uSnow,uShade:t.uShade,uLitter:t.uLitter,uClock:t.uClock,uWindH:t.uWindH,uMossD:{value:e.mossD},uMossL:{value:e.mossL},uRock:{value:e.rock},uShell:{value:e.shell},uPale:{value:e.pale}},vertexShader:`
      attribute vec3 aRock;
      varying vec3 vN, vNl, vP, vVP; varying vec3 vRock;
      #include <fog_pars_vertex>
      void main(){
        vP = position; vNl = normal; vRock = aRock;
        vN = normalize(normalMatrix*normal);
        vec4 mvPosition = modelViewMatrix*vec4(position, 1.0);
        vVP = mvPosition.xyz;
        gl_Position = projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Bt}
      uniform vec3 uMossD, uMossL, uRock, uShell, uPale, uWindH; uniform vec4 uShade; uniform float uLitter, uSnow, uTime, uClock;
      varying vec3 vN, vNl, vP, vVP; varying vec3 vRock;
      #include <fog_pars_fragment>
      void main(){
        vec3 n = normalize(vN); vec3 nl = normalize(vNl);
        float r = length(vP.xz), dist = length(vVP);
        float n1 = psNoise(vP.xz*0.8), n2 = psNoise(vP.xz*5.0 + 11.0), n3 = psNoise(vP.xz*21.0);
        // velvet: pale on the crests of the hummocks, deep in the hollows, a fine nap that fades with distance
        float hum = clamp(vRock.y*0.5 + 0.5 + (n2 - 0.5)*0.3, 0.0, 1.0);
        vec3 moss = mix(uMossD*0.62, uMossL*1.12, smoothstep(0.18, 0.9, hum*0.75 + n1*0.25))*(0.78 + 0.44*n3*(1.0 - smoothstep(10.0, 34.0, dist)));
        float mossAmt = mix(1.0, smoothstep(0.15, 0.65, nl.y + (n2 - 0.5)*0.6), vRock.x);
        vec3 rock = uRock*(0.55 + 0.9*psNoise(vP.xz*3.0 + vP.y*4.0));
        vec3 alb = mix(rock, moss, mossAmt);
        // fallen petals: single specks near the lens, a pale drift far off
        // fallen petals lie in windrows: thick drifts with ragged edges where the mesh says they gather, a scatter of single
        // petals between, and almost bare moss on the crests
        float dn = vRock.z + uLitter*0.6 + (psNoise(vP.xz*1.7 + 9.0) - 0.5)*0.42 + (n2 - 0.5)*0.2;
        // the gust lifts the fall off the moss, windward first, drift by drift: pink clears to green
        dn -= 0.62*smoothstep(0.0, 4.2, uClock + 0.7 - clamp(0.5 + 0.5*dot(vP.xz, uWindH.xz)/16.0, 0.0, 1.0)*1.7 - 3.0*psNoise(vP.xz*0.55 + 3.0));
        float thick = smoothstep(0.5, 0.64, dn)*smoothstep(0.2, 0.65, nl.y);
        float thin = clamp(0.035 + 0.5*smoothstep(0.22, 0.52, dn), 0.0, 0.6)*smoothstep(0.2, 0.65, nl.y);
        vec2 g = vP.xz*9.5; vec2 ci = floor(g), cf = fract(g) - 0.5;
        float h = psHash(ci), h2 = psHash(ci + 17.3);
        vec2 d2 = cf - (vec2(h2, psHash(ci + 41.1)) - 0.5)*0.62;
        float ang = h*6.2832, ca = cos(ang), sa = sin(ang);
        d2 = vec2(d2.x*ca + d2.y*sa, -d2.x*sa + d2.y*ca);
        float pet = 1.0 - smoothstep(0.055, 0.085, d2.x*d2.x + d2.y*d2.y*2.2);
        vec2 g2 = vP.xz*14.0 + 3.7; vec2 cj = floor(g2), cg = fract(g2) - 0.5; float hj = psHash(cj + 5.1);
        vec2 d3 = cg - (vec2(hj, psHash(cj + 23.9)) - 0.5)*0.6;
        float pet2 = (1.0 - smoothstep(0.07, 0.11, dot(d3, d3)*1.6))*step(hj, 0.75);
        float speck = max(pet*step(h, thin + thick*0.9), pet2*thick);                 // in a drift the petals overlap: two layers of them
        float far = smoothstep(12.0, 40.0, dist);
        float cover = mix(max(speck, thick*0.58), thick*0.8 + thin*0.25, far);
        alb = mix(alb, mix(uShell, uPale, h2*0.55)*(0.86 + 0.2*hj), cover);
        alb = mix(alb, vec3(0.78, 0.8, 0.84), uSnow*smoothstep(0.3, 0.7, nl.y + (n1 - 0.5)*0.5)*0.8);
        // the crown's shadow, dappled, let go as the tree strips
        float hh = clamp(dot(vP.xz, uShade.xy)/max(dot(uShade.xy, uShade.xy), 1e-3), 0.0, 1.0);   // a capsule from the trunk to where the crown's shadow lands
        float sd = length(vP.xz - uShade.xy*hh)/max(uShade.z, 1.0);
        float dap = psNoise(vP.xz*1.1 + uTime*0.07)*0.6 + psNoise(vP.xz*3.7 - uTime*0.11)*0.4;
        float lit = smoothstep(0.55, 1.12, sd + (dap - 0.5)*0.45);
        float shade = mix(1.0, lit, uShade.w);
        vec3 c = alb*RECIPROCAL_PI*(psSunCol()*max(dot(n, psSunDir()), 0.0)*shade + psAmb(n)*mix(1.0, 0.72 + 0.28*lit, uShade.w));
        gl_FragColor = vec4(c, 1.0);
        #include <fog_fragment>
      }`})}function qe(t,e){const M=document.createElement("canvas");M.width=512,M.height=1024;const o=M.getContext("2d");o.fillStyle="rgb(0,205,128)",o.fillRect(0,0,512,1024);const L=(P,Q,H,K,tt,G,W,h)=>{if(o.save(),o.translate(P,Q),o.rotate(K),o.scale(1,tt),W)o.fillStyle=`rgb(255,${h[0]-95},${G})`,o.beginPath(),o.ellipse(0,0,H*.3,H*.55,0,0,Math.PI*2),o.fill();else{for(let w=0;w<5;w++){o.save(),o.rotate(w/5*Math.PI*2);const l=o.createLinearGradient(0,-H*.08,0,-H*1.02);l.addColorStop(0,`rgb(255,${Math.floor(h[w]*.62)},${G})`),l.addColorStop(.55,`rgb(255,${h[w]-25},${G})`),l.addColorStop(1,`rgb(255,${h[w]},${G})`),o.fillStyle=l,o.beginPath(),o.ellipse(0,-H*.56,H*.36,H*.5,0,0,Math.PI*2),o.fill(),o.restore()}o.fillStyle=`rgb(255,60,${G})`,o.beginPath(),o.arc(0,0,H*.13,0,Math.PI*2),o.fill()}o.restore()};for(let P=0;P<4;P++){o.save(),o.beginPath(),o.rect(P*128+3,0,122,1024),o.clip();const Q=64+P*5;for(let H=0;H<Q;H++){const K=(H+t())/Q*1024,tt=(t()+t()+t()-1.5)*44,G=P*128+128/2+O(tt,-44,44),W=t.range(12,18),h=t.range(0,6.28),w=t.range(.5,1),l=Math.floor(t()*255),R=t.chance(e),B=[0,1,2,3,4].map(()=>Math.floor(t.range(195,255)));for(const $ of[0,-1024,1024])K+$>-30&&K+$<1054&&L(G,K+$,W,h,w,l,R,B)}o.restore()}const T=new c.CanvasTexture(M);return T.colorSpace=c.NoColorSpace,T.wrapS=c.ClampToEdgeWrapping,T.wrapT=c.RepeatWrapping,T.generateMipmaps=!0,T.minFilter=c.LinearMipmapLinearFilter,T.magFilter=c.LinearFilter,T.anisotropy=4,T.needsUpdate=!0,T}function Ke(t,e,z){return new c.ShaderMaterial({fog:!0,lights:!0,side:c.DoubleSide,uniforms:{...Ft(),..._t(),uSunGain:t.uSunGain,uAmbGain:t.uAmbGain,uTime:t.uTime,uClock:t.uClock,uWindH:t.uWindH,uViewH:t.uViewH,uCentre:t.uCentre,uShed:t.uShed,uStrip:t.uStrip,uTrans:t.uTrans,uSunL:t.uSunL,uRim:t.uRim,uTier:t.uTier,uAtlas:{value:z},uShell:{value:e.shell},uRose:{value:e.rose},uHeart:{value:e.heart},uTwig:{value:e.twig}},vertexShader:`
      attribute vec4 iA, iB, iC;
      uniform float uViewH, uRim; uniform vec3 uCentre, uSunL;
      varying vec2 vUv; varying vec4 vS; varying vec3 vN, vVP, vK; varying vec2 vX, vF; varying float vTs, vTy, vGo;
      #include <fog_pars_vertex>
      ${Jt}
      void main(){
        float t = position.y;
        vGo = psStrip(iB.w);
        float la = psLift(iB.w, uClock);
        vec3 p = psStrand(iA, iB, t, la, 1.0, uTime);
        vec3 p2 = psStrand(iA, iB, t + 0.03, la, 1.0, uTime);
        vec4 wp = modelMatrix*vec4(p, 1.0);
        vec3 tg = mat3(modelMatrix)*(p2 - p);
        vec3 sd = cross(tg, wp.xyz - cameraPosition); sd /= max(length(sd), 1e-6);
        float depth = max(-(viewMatrix*wp).z, 0.05);
        float pxw = 2.0*depth/(projectionMatrix[1][1]*uViewH);     // metres per pixel at this depth
        float w = max(0.40*iC.z, 1.6*pxw);
        // far off, where a strand is drawn wider than it is, some are left out so the curtain keeps its partings
        w *= step(fract(iC.w*7.31 + iB.z*0.37), clamp(0.40*iC.z/(1.6*pxw) + 0.18, 0.0, 1.0));
        wp.xyz += sd*(position.x*w);
        vec4 mvPosition = viewMatrix*wp;
        gl_Position = projectionMatrix*mvPosition;
        vVP = mvPosition.xyz;
        vX = vec2(position.x + 0.5, 0.55*mix(1.0, 0.6, t)*pxw/w);
        vUv = vec2((floor(iC.x) + 0.5 + position.x*0.94)/4.0, t*iA.w/${Fe.toFixed(2)} + iC.w);
        vS = vec4(t, iB.w, mix(0.0075, 0.003, t)/w, 1.0 - smoothstep(5.0, 22.0, w/pxw));
        vTs = t*iA.w;
        vec3 q = p - uCentre;
        vec3 nl = normalize(q*vec3(1.0, 0.7, 1.0) + vec3(0.0, 4.0, 0.001));
        vN = normalize(mat3(viewMatrix)*(mat3(modelMatrix)*nl));
        float ao = mix(0.32, 1.0, smoothstep(0.3, 0.95, length(q.xz)/15.0 + 0.25*smoothstep(0.0, 8.0, q.y)));
        vK = vec3(iC.y*(0.7 + 0.3*smoothstep(2.0, 16.0, p.y)), mix(ao, 1.0, la*0.6), la);
        // the crown as one form: the flank turned to the sun, the flank turned away, and the hem in the crown's own shade
        float form = smoothstep(-0.7, 0.4, dot(q.xz, uSunL.xz)/15.0 + 0.05*q.y);
        vF = vec2(mix(0.36 + 0.3*uRim, 1.0, form), mix(0.6 + 0.25*uRim, 1.0, smoothstep(-9.5, -2.0, q.y)));   // by moonlight the lee side keeps more of its silver
        // the crown hangs in TIERS, each a skirt of cascades over the one below: the tier lines wander round the tree
        // (laid out on the strand at rest, so a tier rides up with its strands when the gust lifts them)
        { vec3 p0 = psStrand(iA, iB, t, 0.0, 1.0, 0.0), q0 = p0 - uCentre; float az = atan(q0.z, q0.x + 1e-4); vTy = (p0.y + 1.5*sin(az*3.0 + 1.3) + 0.8*sin(az*7.0 + 4.0))/4.4; }
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Bt}
      uniform sampler2D uAtlas; uniform vec3 uShell, uRose, uHeart, uTwig; uniform float uClock, uShed, uTrans, uRim;
      varying vec2 vUv; varying vec4 vS; varying vec3 vN, vVP, vK; varying vec2 vX, vF; varying float vTs, vTy, vGo;
      uniform vec2 uTier;
      #include <fog_pars_fragment>
      void main(){
        vec4 tx = texture2D(uAtlas, vUv);
        float gone = 1.0 - step(max(uShed, vGo), tx.b + 1e-4);          // a season thins the blossom; the gust takes it from the windward strands
        float tb = fract(vTy), tierK = vS.w*(1.0 - 0.45*vK.z)*0.92;      // tiers read from far off and in still air
        float cov = tx.r*(1.0 - gone);
        // from far off a strand is not one pink stroke: its blossom sits in clusters a metre long, some thin, some full, with dark between
        float clh = psHash(vec2(vS.y*57.0 + 3.0, floor(vTs*0.85 + vS.y*13.0)));
        float clk = max(vS.w, min(vK.z*1.7, 1.0));                        // in the gust the clusters part further and the boughs show between them
        cov *= 1.0 - 0.9*clk*step(clh, mix(0.2, 0.44, smoothstep(0.1, 0.5, vK.z)));
        cov *= 1.0 - 0.8*tierK*(1.0 - smoothstep(0.0, 0.13, tb))*step(0.45, fract(vS.y*37.0 + tx.b*0.3));   // each tier's hem is ragged: the dark of the crown shows through it
        float thr = mix(0.5, 0.13, vS.w);
        float bl = smoothstep(thr - 0.08, thr + 0.08, cov);
        float hw = mix(vS.z, max(vS.z, vX.y), gone);                    // the bare whip never thinner than about a pixel
        float tw = 1.0 - smoothstep(hw*0.7, hw*1.3 + 1e-4, abs(vX.x - 0.5));
        if (max(bl, tw) < 0.5) discard;
        vec3 n = normalize(vN); vec3 vd = normalize(vVP);
        vec3 body = mix(uRose, uShell, clamp(vK.x + (tx.g - 0.85)*0.9, 0.0, 1.0));
        body = mix(body, uShell, vS.w*0.1);
        vec3 alb = mix(uHeart, body, smoothstep(0.27, 0.52, tx.g));
        vec3 L = psSunDir();
        float fk = 0.3 + 0.7*vS.w, shp = mix(1.0, vF.x*vF.y, fk);              // the mass shading takes over as strands merge
        // every cascade is a shingle: its arching shoulder takes the light, its tips hang in the shade of the one above
        float tier = 1.0 + uTier.x*(1.0 - smoothstep(0.25, 2.4, vTs)) - uTier.y*smoothstep(0.5, 1.0, vS.x)*(1.0 - vK.z);
        float expo = clamp(dot(n, L)*0.6 + 0.5, 0.0, 1.0)*vK.y*shp*tier;        // how much sun reaches this part of the crown
        float bk = smoothstep(-0.15, 0.55, dot(vd, L));                         // 0 the lit face, 1 seen against the sun
        vec3 amb = psAmb(n)*mix(1.0, (0.4 + 0.6*vK.y)*(0.66 + 0.34*vF.x)*(0.7 + 0.3*vF.y), fk);
        vec3 cb = alb*RECIPROCAL_PI*(psSunCol()*expo*mix(0.95, 0.22, bk) + amb);
        cb += alb*vec3(1.05, 0.62, 0.74)*RECIPROCAL_PI*psSunCol()*(expo*bk*1.2*uTrans);
        cb += mix(alb, vec3(0.8), 0.5)*RECIPROCAL_PI*psSunCol()*(uRim*0.55*smoothstep(0.5, 1.0, vF.x)*vK.y);   // moonlit rim
        cb *= mix(1.0, 0.62 + 0.7*clh, 0.7*clk);
        cb *= mix(1.0, mix(0.4, 1.28, smoothstep(0.03, 0.66, tb)), tierK);       // a tier's shoulder takes the light; its tips hang dark over the shoulder below
        vec3 ct = uTwig*(1.0 + 0.6*(1.0 - gone))*(0.7 + 0.6*psHash(vec2(vS.y*91.0, floor(vUv.y*3.0))))*RECIPROCAL_PI*(psSunCol()*(0.25 + 0.6*max(dot(n, psSunDir()), 0.0))*vK.y*shp + amb);
        gl_FragColor = vec4(mix(ct, cb, step(0.5, bl)), 1.0);
        #include <fog_fragment>
      }`})}function je(){const t=[],e=[],z=[],k=s(0,0,0),p=s(0,0,0),M=s(0,0,0),o=s(0,0,0),L=(P,Q,H,K,tt,G)=>{const W=Math.cos(K),h=Math.sin(K),w=(l,R)=>R.set(W*l[1]-h*l[0],h*l[1]+W*l[0],tt?.07:.3*l[1]+G*l[0]);w(P,k),w(Q,p),w(H,M),o.subVectors(p,k).cross(s(0,0,0).subVectors(M,k)).normalize();for(const[l,R]of[[k,P],[p,Q],[M,H]])t.push(l.x,l.y,l.z),e.push(o.x,o.y,o.z),z.push(R[0],R[1],tt)};for(let P=0;P<5;P++)L([0,-.1],[-.75,1.15],[.75,1.15],P/5*Math.PI*2+.2*Math.sin(P*2.1),0,P%2?.14:-.1);L([0,.24],[-.21,-.12],[.21,-.12],.4,1,0);const T=new c.BufferGeometry;return T.setAttribute("position",new c.Float32BufferAttribute(t,3)),T.setAttribute("normal",new c.Float32BufferAttribute(e,3)),T.setAttribute("aQ",new c.Float32BufferAttribute(z,3)),T}function Qe(t,e){return new c.ShaderMaterial({fog:!0,lights:!0,side:c.DoubleSide,uniforms:{...Ft(),..._t(),uSunGain:t.uSunGain,uAmbGain:t.uAmbGain,uTime:t.uTime,uClock:t.uClock,uWindH:t.uWindH,uCentre:t.uCentre,uShed:t.uShed,uStrip:t.uStrip,uTrans:t.uTrans,uSize:{value:.056},uShell:{value:e.shell},uRose:{value:e.rose},uHeart:{value:e.heart},uAnther:{value:e.anther}},vertexShader:`
      attribute vec3 aQ; attribute vec4 iA, iB, iC; attribute float iD;
      uniform float uSize, uShed; uniform vec3 uCentre;
      varying vec3 vQ, vN, vVP; varying vec2 vK;
      #include <fog_pars_vertex>
      ${Jt}
      void main(){
        float t = iC.x, sd = iC.w;
        float la = psLift(iB.w, uClock);
        vec3 c = psStrand(iA, iB, t, la, 1.0, uTime);
        float a = iC.y*6.2832;
        c += vec3(cos(a)*iC.z, -0.5*iC.z, sin(a)*iC.z);                       // out on its pedicel
        vec3 f = normalize(vec3(cos(a)*0.8, -0.25 - 0.9*fract(sd*13.7), sin(a)*0.8));   // nodding outward and down
        f = normalize(f + vec3(uWindH.x, 0.2, uWindH.z)*la*0.45);
        vec3 e1 = cross(f, vec3(0.31, 0.2, 0.93)); e1 /= max(length(e1), 1e-4);
        vec3 e2 = cross(f, e1);
        float sp = sd*31.4 + 0.25*sin(uTime*1.7 + sd*50.0) + la*0.6*sin(uTime*9.0 + sd*80.0);
        float cs = cos(sp), sn = sin(sp);
        vec3 a1 = e1*cs + e2*sn, a2 = e2*cs - e1*sn;
        float id = fract(sd*5.3);
        float sc = step(max(uShed, psStrip(iB.w)), id + 1e-4)*uSize*(0.8 + 0.45*fract(sd*3.7));
        vec3 lp = c + (a1*position.x + a2*position.y + f*position.z)*sc;
        vec3 ln = a1*normal.x + a2*normal.y + f*normal.z;
        vec4 mvPosition = modelViewMatrix*vec4(lp, 1.0);
        gl_Position = projectionMatrix*mvPosition;
        vVP = mvPosition.xyz; vN = normalMatrix*ln; vQ = aQ;
        vec3 q = c - uCentre;
        float ao = mix(0.55, 1.0, smoothstep(0.3, 0.95, length(q.xz)/15.0 + 0.25*smoothstep(0.0, 8.0, q.y)));
        vK = vec2(iD, mix(ao, 1.0, la*0.6));
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Bt}
      ${ye}
      uniform vec3 uShell, uRose, uHeart, uAnther; uniform float uTrans;
      varying vec3 vQ, vN, vVP; varying vec2 vK;
      #include <fog_pars_fragment>
      void main(){
        vec3 alb;
        if (vQ.z < 0.5) {
          if (psPetalMask(vQ.xy) < 0.5) discard;
          vec3 body = mix(uRose, uShell, clamp(vK.x + (vQ.y - 0.6)*0.5, 0.0, 1.0));
          alb = mix(uHeart, body, smoothstep(0.08, 0.5, vQ.y))*(0.93 + 0.07*sin(vQ.x*34.0));
        } else {
          alb = mix(uHeart*0.6, uAnther, step(0.62, psHash(floor(vQ.xy*26.0) + 3.0)));
        }
        vec3 n = normalize(vN); vec3 vd = normalize(vVP);
        if (dot(n, vd) > 0.0) n = -n;
        gl_FragColor = vec4(psPetal(alb, n, vd, uTrans*1.25, uTrans*0.9, vK.y), 1.0);
        #include <fog_fragment>
      }`})}function $e(t,e){return new c.ShaderMaterial({fog:!0,lights:!0,side:c.DoubleSide,uniforms:{...Ft(),..._t(),uSunGain:t.uSunGain,uAmbGain:t.uAmbGain,uTime:t.uTime,uClock:t.uClock,uWindH:t.uWindH,uViewH:t.uViewH,uCentre:t.uCentre,uShed:t.uShed,uStrip:t.uStrip,uTrans:t.uTrans,uSunL:t.uSunL,uWind:t.uWind,uSideV:t.uSideV,uUpV:t.uUpV,uSpeed:t.uSpeed,uLife:t.uLife,uLoose:t.uLoose,uSize:{value:.05},uShell:{value:e.shell},uRose:{value:e.rose},uHeart:{value:e.heart},uPale:{value:e.pale}},vertexShader:`
      attribute vec4 iA, iB, iC, iD, iG;
      uniform float uViewH, uSpeed, uLoose, uLife, uShed, uSize; uniform vec3 uWind, uSideV, uUpV, uCentre, uSunL;
      varying vec2 vQ; varying vec3 vN, vVP; varying vec2 vK; varying float vForm;
      #include <fog_pars_vertex>
      ${Jt}
      void main(){
        float t = iC.x, id = iC.y;
        float grd = step(0.4, iD.w);                                          // three in five lie on the moss as last week's fall
        float loose = step(iD.w, uLoose);                                     // a few are falling in still air
        float la = psLift(iB.w, uClock);
        vec3 p = psStrand(iA, iB, t, la, 1.0, uTime);                         // the rest are held in the curtain and stay in it
        float a = iD.x*6.2832;
        p += vec3(cos(a), -0.5, sin(a))*iD.y;
        float y0 = max(p.y - 0.15, 0.3);
        float per = y0/0.95 + 2.0 + 4.0*iC.z;
        float ph = fract(uTime/per + iC.w)*per;
        float fall = min(ph*0.95, y0);
        float gs = max(uClock - iB.w*1.4 + 1.5, 0.0);
        float fk = smoothstep(0.0, 1.2, fall);
        vec3 lp = p + vec3((sin(fall*1.3 + iC.z*40.0)*0.4 + 0.22*fall*sin(iC.w*20.0))*fk, -fall, (cos(fall*1.1 + iC.w*40.0)*0.4 + 0.22*fall*cos(iC.w*20.0))*fk);
        lp += uWind*(gs*gs*5.0*(0.5 + iC.z));
        float visL = smoothstep(0.0, 0.25, ph)*(1.0 - smoothstep(1.0, 2.4, gs));
        // THE GUST LIFTS WHAT HAS ALREADY FALLEN. A petal on the moss goes up when the front reaches its drift (windward first),
        // slowly at first, and is drawn into one of four bands that wind up round the tree as a wide slow gyre, a funnel that
        // opens with height (it clears the streaming curtain); above the crown the bands lean away down the wind and thin out.
        vec3 hm = iG.xyz; float r0 = length(hm.xz), a0 = atan(hm.z, hm.x + 1e-5);
        float h1 = fract(iC.w*13.3), h2 = fract(iC.z*17.3), h3 = fract(iC.w*23.7);
        float Tg = clamp(0.5 + 0.5*dot(hm.xz, uWindH.xz)/16.0, 0.0, 1.0)*1.2 + iG.w*3.8 - 1.0;
        float tg = max(uClock - Tg, 0.0), up = smoothstep(0.0, 0.7, tg);
        float yy = hm.y + 0.07 + (2.3 + 3.3*h1)*(tg - (1.0 - exp(-1.6*tg))/1.6);
        float gat = smoothstep(0.2, 2.6, tg), lane = floor(h3*4.0);
        float thB = lane*1.5708 + 0.42*Tg;
        thB += 6.2832*floor((a0 - thB)/6.2832 + 0.5);                         // the turn of its band that lies nearest where it lay
        float thL = thB + 0.42*(uClock - Tg) + 0.15*(yy - hm.y) + 0.4*sin(yy*0.17 + lane*2.0) + (h2 - 0.5)*(0.22 + 1.2*abs(h2 - 0.5));   // four bands with clear air between
        float th = mix(a0 + 0.45*tg, thL, gat);
        float rr = mix(r0, 15.6 + 0.74*min(yy, 22.0) + 0.22*max(yy - 22.0, 0.0) + (fract(iC.z*91.7) - 0.5)*4.2 + 1.2*sin(tg*0.9 + h1*20.0), gat);
        float away = max(tg - (6.0 + 3.5*h1), 0.0);
        vec3 gp = vec3(cos(th)*rr, yy + 0.25*up*sin(uTime*2.1 + h1*40.0), sin(th)*rr) + uWind*(away*away*0.45 + away*2.0)
          + up*0.3*vec3(sin(uTime*1.7 + h2*31.0), 0.0, cos(uTime*1.3 + h3*29.0));
        float lifeG = 11.5 + 4.0*h2;
        float visG = 1.0 - smoothstep(lifeG - 3.5, lifeG, tg);
        // a petal held in a windward strand is torn out when the stripping reaches it (ts: seconds of the gust clock since)
        // and goes off down the wind, rising, in the lee of its strand
        float lim = psStripLim(iB.w), took = step(id, lim - 1e-4)*step(0.0005, uStrip);
        float ts = max((uStrip - iB.w*0.9 - 0.35*id/max(lim, 0.05))*(5.0/1.2), 0.0)*took;
        float torn = step(1e-4, ts)*(1.0 - loose)*(1.0 - grd);
        vec3 tp = p + uWind*(ts*(3.0 + 4.0*h1) + ts*ts*1.6) + vec3(0.0, ts*(0.6 + 1.6*h2), 0.0)
          + 0.6*min(ts, 1.5)*vec3(sin(uTime*2.3 + h1*40.0 + ts*2.0), sin(uTime*1.9 + h2*31.0), cos(uTime*2.1 + h3*29.0 + ts*1.7));
        float visT = 1.0 - smoothstep(2.6, 4.2, ts);
        vec3 P = mix(mix(mix(p, tp, torn), lp, loose), gp, grd);
        float vis = mix(mix(mix(step(uShed, id + 1e-4), visT, torn), visL, loose), visG, grd);
        // tumbling in the air; lying nearly flat on the moss
        float fly = max(max(loose, torn), grd*up);
        float spin = iC.z*40.0*(1.0 - grd) + grd*(1.0 - up)*0.25*sin(iC.w*50.0) + fly*uTime*(4.0 + 7.0*iC.w) + (1.0 - fly)*(1.0 - grd)*0.3*sin(uTime*1.3 + iC.w*50.0);
        float be = iC.w*6.2832 + fly*uTime*(1.0 + 2.0*iC.z);
        vec3 e1 = vec3(cos(be), 0.0, -sin(be));
        vec3 e2 = vec3(sin(be)*cos(spin), -sin(spin), cos(be)*cos(spin));
        vec4 wp = modelMatrix*vec4(P, 1.0);
        float depth = max(-(viewMatrix*wp).z, 0.05);
        float pxw = 2.0*depth/(projectionMatrix[1][1]*uViewH);
        float sz = uSize*(0.8 + 0.4*fract(iC.w*7.7))*(1.0 + 0.8*fly)*mix(1.0, mix(0.4, 1.0, smoothstep(1.5, 8.0, depth)), fly);   // seen whole once it is in the air; by the lens, three centimetres
        float need = 3.0*pxw;                                                   // never under 2 px; thinned instead
        float keep = step(fract(iC.z*91.7), clamp(14.0*sz*sz/(need*need), 0.0, 1.0));
        float s = max(sz, need)*vis*keep*mix(smoothstep(0.35, 1.0, depth), smoothstep(1.0, 2.2, depth), fly);
        wp.xyz += mat3(modelMatrix)*((e1*position.x + e2*(position.y - 0.5))*s);
        vec4 mvPosition = viewMatrix*wp;
        gl_Position = projectionMatrix*mvPosition;
        vVP = mvPosition.xyz; vQ = position.xy;
        vN = mat3(viewMatrix)*(mat3(modelMatrix)*cross(e1, e2));
        vK = vec2(iD.z, max(fly, grd)*0.6);
        { vec3 qf = p - uCentre;
          float fm = mix(0.36, 1.0, smoothstep(-0.7, 0.4, dot(qf.xz, uSunL.xz)/15.0 + 0.05*qf.y))*mix(0.6, 1.0, smoothstep(-9.5, -2.0, qf.y))
            *mix(0.4, 1.0, smoothstep(0.3, 0.95, length(qf.xz)/15.0 + 0.25*smoothstep(0.0, 8.0, qf.y)));
          vForm = mix(1.0, fm, (1.0 - max(fly, grd))*smoothstep(8.0, 30.0, depth)); }
        #include <fog_vertex>
      }`,fragmentShader:`
      ${Bt}
      ${ye}
      uniform vec3 uShell, uRose, uHeart, uPale; uniform float uTrans;
      varying vec2 vQ; varying vec3 vN, vVP; varying vec2 vK; varying float vForm;
      #include <fog_pars_fragment>
      void main(){
        if (psPetalMask(vQ) < 0.5) discard;
        vec3 body = mix(mix(uRose, uShell, clamp(vK.x + (vQ.y - 0.5)*0.4, 0.0, 1.0)), uPale, vK.y*(0.15 + 0.7*vK.x));
        vec3 alb = mix(mix(uHeart, uRose, vK.y), body, smoothstep(0.0, mix(0.4, 0.2, vK.y), vQ.y));
        vec3 n = normalize(vN); vec3 vd = normalize(vVP);
        if (dot(n, vd) > 0.0) n = -n;
        vec3 L = psSunDir(); float toSun = max(dot(vd, L), 0.0);
        vec3 c = alb*RECIPROCAL_PI*(psSunCol()*(0.72 + 0.38*abs(dot(n, L)))*vForm + psAmb(n)*(0.5 + 0.5*vForm));   // thin: both faces carry the sun
        c += alb*vec3(1.05, 0.62, 0.74)*RECIPROCAL_PI*psSunCol()*(uTrans*0.9*toSun*toSun*vForm);
        gl_FragColor = vec4(c, 1.0);
        #include <fog_fragment>
      }`})}async function Je(t,e={}){const z=t.rng,k=z.fork("ps-variety"),p=z.fork("ps-limbs"),M=z.fork("ps-ground"),o=z.fork("ps-strands"),L=z.fork("ps-blossoms"),T=z.fork("ps-petals"),P=z.fork("ps-atlas"),Q=Array.isArray(e.palette)&&e.palette.length>=7?e.palette:_e,H=e.hour||"morning",K=e.season||"peak",tt=e.weather||"clear",G=t.quality?.detail??1,W=O(e.density??1,.25,1.5),h=Ht(Q[0],.86),w=Ht(Q[1],.86),l=Ht(Q[2],.96),R=Ht(Q[3]),B=Ht(Q[4]),$=Ht(Q[5]),D=k.range(-.12,.14)+(K==="early"?.22:K==="late"?-.1:0);D>0?w.lerp(l,D):w.lerp(h,-D);let a=1;if(H==="moon"||H==="dawn"){const r=H==="moon"?.82:.28;for(const u of[h,w,l]){const I=.3*u.x+.55*u.y+.15*u.z;u.lerp(s(I*.96,I,I*1.1),r)}a=H==="moon"?.3:.8}else H==="afternoon"&&(a=1.25);tt==="haze"&&(a*=.6);const m={pale:h,shell:w,rose:l,heart:s(l.x*.5+R.x*.08,l.y*.32+R.y*.05,l.z*.42),twig:Gt(s(.05,.033,.034),R,.08),bark:Gt(s(.17,.14,.125),B,.15),barkRed:Gt(s(.11,.06,.055),R,.25),mossD:s(B.x*.9+.012,B.y*1.3+.035,B.z*.55),mossL:Gt($,s(.2,.34,.07),.45).multiplyScalar(.6),lichen:Gt($,h,.5).multiplyScalar(.55),rock:s(.034,.04,.046),anther:s(.78,.56,.12)};if(H==="moon")for(const r of[m.mossD,m.mossL,m.lichen]){const u=.3*r.x+.55*r.y+.15*r.z;r.lerp(s(u*.86,u*1,u*1.1),.72)}const v=s(-142,46,160);if(e.windDir){const r=e.windDir;v.set(r.x??r[0],r.y??r[1],r.z??r[2])}const n={uTime:{value:0},uClock:{value:-30},uSunGain:{value:1},uAmbGain:{value:1},uBare:{value:0},uSnow:{value:tt==="snow"?.7:0},uShed:{value:0},uStrip:{value:0},uTrans:{value:a},uLitter:{value:K==="late"?.32:K==="early"?-.25:0},uLoose:{value:K==="late"?.12:K==="early"?.012:.06},uViewH:{value:1080},uCentre:{value:s(0,10.5,0)},uShade:{value:new c.Vector4(0,0,14,.8)},uWind:{value:s(0,0,1)},uWindH:{value:s(0,0,1)},uSideV:{value:s(1,0,0)},uUpV:{value:s(0,1,0)},uSpeed:{value:e.speed??19},uLife:{value:10},uSunL:{value:s(.85,.5,-.15)},uRim:{value:H==="moon"?1:0},uTier:{value:new c.Vector2(.24,.2)}},_=r=>{const u=s(r.x,r.y,r.z);u.lengthSq()<1e-8&&u.set(0,0,1),u.normalize();let I=Math.hypot(u.x,u.z);I<.2&&(u.x+=.3,u.normalize(),I=Math.hypot(u.x,u.z)),n.uWind.value.copy(u),n.uWindH.value.set(u.x/I,u.y/I,u.z/I),n.uSideV.value.set(-u.z/I,0,u.x/I),n.uUpV.value.crossVectors(n.uSideV.value,u).normalize(),n.uUpV.value.y<0&&n.uUpV.value.negate()};_(v);const d=new c.Group;d.name="petal-storm-hero";const f=ge(xe("ps-roots:"+(t.seed??1))),S=[];for(const[r,u]of[[64,12.2],[118,10.6],[14,12.4],[-42,12.8],[-112,11.2],[172,10.8]]){const I=(r+f.range(-7,7))*Math.PI/180,A=f.range(0,100),i=f.range(.5,.9)*f.sign(),x=u*f.range(.9,1.08),y=[];for(let q=0;q<=22;q++){const ut=1.1+(x-1.1)*q/22,zt=I+i*.42*t.noise.n2(ut*.22+A,3.3)*Math.min(1,ut/5);y.push([Math.sin(zt)*ut,Math.cos(zt)*ut])}let b=0;for(let q=1;q<=22&&!(be(y[q][0],.7,y[q][1])<we+.5||q>16);q++)b=q/22;S.push({P:y,sd:A,h:f.range(.34,.5),wood:b})}const N=Ne(t.noise,M.range(0,50),S);await t.yield();const F=await Ve(t,p,N,S.filter(r=>r.wood>.12)),j=new c.Mesh(F.geometry,We(n,m));j.name="cherry-limbs",d.add(j),await t.yield();let g=0;if(e.base!==!1){const r=await De(M,t.noise,N,t.yield?()=>t.yield():null);g=r.tris;const u=new c.Mesh(r.geometry,Ee(n,m));u.name="cherry-mound",d.add(u),await t.yield()}const C=F.cand,V=new Float32Array(C.length);let at=0;for(let r=0;r<C.length;r++)at+=C[r].w,V[r]=at;const E=r=>{const u=r*at;let I=0,A=C.length-1;for(;I<A;){const i=I+A>>1;V[i]<u?I=i+1:A=i}return C[I]},et=Math.max(200,Math.round(e.strands??1650)),ht=Math.round(et*.06),bt=Math.round(et*.13),Nt=Math.round(et*.07),ft=et+ht+bt+Nt,Vt=new Float32Array(ft*4),Wt=new Float32Array(ft*4),Dt=new Float32Array(ft*4),Zt=new Float32Array(ft),Ut=new Float32Array(ft);let te=0,ee=0;const ae=n.uWindH.value,oe=n.uCentre.value,Rt=26,ne=[];for(let r=0;r<Rt;r++)ne.push({c:(r+.5+o.range(-.2,.2))/Rt*6.2832,low:o()<.62?o.range(.7,1.9):o.range(3.2,6)});const ze=(r,u,I)=>{let A=C[0],i=1e9;for(let x=0;x<C.length;x++){const y=C[x];if(y.b.y<I)continue;const b=(y.b.x-r)**2+(y.b.z-u)**2+.02*(y.b.y-I)**2;b<i&&(i=b,A=y)}return A};for(let r=0;r<ft;r++){r%400===399&&await t.yield();let u,I,A,i,x,y,b,q,ut=0;if(r<et){const X=E(o()),J=o();u=Z(X.a.x,X.b.x,J),I=Z(X.a.y,X.b.y,J)-X.r*.5,A=Z(X.a.z,X.b.z,J),q=Math.atan2(u,A)+o.range(-.75,.75),b=X.up?o.range(1.3,3.1):o.range(.7,2.3);{const gt=(Xt-.4)*Math.sqrt(Math.max(.05,1-((I-.6)/(It+.5))**2))+.5,Lt=Math.hypot(u,A);Lt+.9*b>gt&&(b=Math.max(.35,(gt-Lt)/.9))}i=u+Math.sin(q)*.9*b,x=A+Math.cos(q)*.9*b;const nt=Math.hypot(i,x),st=o(),lt=o(),mt=o();if(y=nt>10?Z(.7,2.4,st):nt>6.5?Z(1.2,5.5,st):Z(3.5,9,st),nt>8.2){let gt=Math.atan2(i,x);gt<0&&(gt+=6.2832);const Lt=ne[Math.min(Rt-1,Math.floor(gt/6.2832*Rt))];let Tt=gt-Lt.c;Tt>Math.PI&&(Tt-=6.2832),Tt<-Math.PI&&(Tt+=6.2832);const me=Y(.15,.75,Math.sin(gt)),He=Z(.4,.88,me),ve=Lt.c+Tt*He,de=Math.sin(ve)*nt,pe=Math.cos(ve)*nt,Re=Math.hypot(de-u,pe-A);q=Math.atan2(de-u,pe-A),b=O(Re/.9,.35,3.4),i=u+Math.sin(q)*.9*b,x=A+Math.cos(q)*.9*b;const Ie=Lt.low+2.4*Math.min(1,Math.abs(Tt)/(Math.PI/Rt))*(.4+.6*lt)+(nt<10?2.2*mt:0);y=Z(Ie,y,me)}}else if(r<et+ht)ut=1,i=ot+o.range(-1.45,1.45),x=-15.2+29*Math.pow(o(),1.8),y=o.range(4.7,5.8);else if(r<et+ht+bt)ut=2,i=ot+o.sign()*o.range(1.6,7.6),x=o.range(-15.6,-5.2),y=o.range(.9,2.3);else{ut=3;const X=o.range(0,6.2832),J=9.5*Math.sqrt(o());i=Math.sin(X)*J,x=Math.cos(X)*J,y=o.range(6.5,11.5)-.25*J}if(ut){const X=Math.hypot(i,x);X>15.3&&(i*=15.3/X,x*=15.3/X);const J=ze(i,x,y+(ut===3?5.5:4.2)),nt=o();u=Z(J.a.x,J.b.x,nt),I=Z(J.a.y,J.b.y,nt)-J.r*.5,A=Z(J.a.z,J.b.z,nt);const st=Math.hypot(i-u,x-A);q=st>.05?Math.atan2(i-u,x-A):o.range(0,6.2832),b=O(st/.9,.7,3.4),i=u+Math.sin(q)*.9*b,x=A+Math.cos(q)*.9*b}{const X=t.noise.n2(i*.9+3.1,x*.9-1.7),J=t.noise.n2(i*.31-5.2,x*.31+8.4);if(x>1){const lt=.6+1.2*J,mt=(i<lt?1-Y(5.6,8.6,lt-i):1-Y(8.9,10.5,i))*Y(1,3.2,x),gt=i<lt?Z(11.4,3.4,Math.pow(O((lt-i)/8.6,0,1),1.8)):Z(11.4,7.2,Y(lt,8,i));mt>0&&(y=Math.max(y,Z(y,gt+1.2*X+1.6*Math.max(0,J),mt)))}const nt=-(i+x)*.7071,st=Math.abs(i-x)*.7071;if(nt>1){const lt=Z(2.8,5.4,O(Math.hypot(i,x)/15,0,1)),mt=(1-Y(lt*.7,lt*1.12,st))*Y(1,3,nt);mt>0&&(y=Math.max(y,Z(y,9*(1-.5*(st/lt)**2)+1.1*X,mt)))}}const zt=Math.hypot(i,x),Ct=i>1.4&&i<ot-1.5&&x>-13.2&&x<-3.2&&(I<7.4||ut===2);Math.abs(i-ot)<1.5&&Math.abs(x)<19&&(y=Math.max(y,ut===1?4.7:o.range(5.6,7.5))),zt<3.2&&(y=Math.max(y,6.5)),!Ct&&i>1.4&&i<ot-1.5&&x>-13.2&&x<-3.2&&(y=Math.max(y,7.2));const kt=Ct?.02:O(I-y+b,2.2,16.5),U=O(.5+.5*((u-oe.x)*ae.x+(A-oe.z)*ae.z)/Xt+o.range(-.1,.1),0,1),it=O(o.range(.3,.92)+.25*t.noise.n2(u*.12+7,A*.12),0,1);Vt.set([u,I,A,kt],r*4),Wt.set([q,b,o.range(0,6.28),U],r*4),Dt.set([o.int(0,3)+.5,it,o.range(.85,1.25),o()],r*4);const ct=Math.max(0,Math.abs(x)-20),rt=Math.hypot(i-ot,ct);Zt[r]=te+=kt*(rt<7.5&&y<6?7:1),Ut[r]=ee+=kt}const se=(r,u,I)=>{const A=I*u;let i=0,x=ft-1;for(;i<x;){const y=i+x>>1;r[y]<A?i=y+1:x=y}return i},ie=new c.Sphere(s(0,10,0),46),Et={};let Qt=null;{const r=[0,.06,.13,.22,.36,.55,.77,1],u=[],I=[];r.forEach((x,y)=>{if(u.push(-.5,x,0,.5,x,0),y>0){const b=(y-1)*2;I.push(b,b+1,b+2,b+1,b+3,b+2)}});const A=new c.InstancedBufferGeometry;A.setAttribute("position",new c.Float32BufferAttribute(u,3)),A.setIndex(I),A.setAttribute("iA",new c.InstancedBufferAttribute(Vt,4)),A.setAttribute("iB",new c.InstancedBufferAttribute(Wt,4)),A.setAttribute("iC",new c.InstancedBufferAttribute(Dt,4)),A.instanceCount=ft,A.boundingSphere=ie,Qt=qe(P,K==="early"?.4:.14);const i=new c.Mesh(A,Ke(n,m,Qt));i.name="cherry-strands",d.add(i),Et.strands=i}await t.yield();const Mt=Math.max(500,Math.round((e.blossoms??7e3)*W*(.5+.5*G)));{const r=new Float32Array(Mt*4),u=new Float32Array(Mt*4),I=new Float32Array(Mt*4),A=new Float32Array(Mt);for(let b=0;b<Mt;b++){const q=se(Zt,te,L())*4;r.set(Vt.subarray(q,q+4),b*4),u.set(Wt.subarray(q,q+4),b*4),I.set([.05+.95*Math.pow(L(),.85),L(),L.range(.03,.17),L()],b*4),A[b]=O(Dt[q+1]+L.range(-.2,.2),0,1)}const i=new c.InstancedBufferGeometry,x=je();i.setAttribute("position",x.getAttribute("position")),i.setAttribute("normal",x.getAttribute("normal")),i.setAttribute("aQ",x.getAttribute("aQ")),i.setAttribute("iA",new c.InstancedBufferAttribute(r,4)),i.setAttribute("iB",new c.InstancedBufferAttribute(u,4)),i.setAttribute("iC",new c.InstancedBufferAttribute(I,4)),i.setAttribute("iD",new c.InstancedBufferAttribute(A,1)),i.instanceCount=Mt,i.boundingSphere=ie;const y=new c.Mesh(i,Qe(n,m));y.name="cherry-blossoms",d.add(y),Et.blossoms=y}await t.yield();const yt=Math.max(2e3,Math.round((e.petals??44e3)*W*G));{const r=new Float32Array(yt*4),u=new Float32Array(yt*4),I=new Float32Array(yt*4),A=new Float32Array(yt*4),i=new Float32Array(yt*4),x=ge(xe("ps-fallen:"+(t.seed??1))),y=[0,0,0,0],b=65,q=new Float32Array(b*b),ut=new Float32Array(b*b),zt=new Float32Array(b*b);for(let U=0;U<b;U++){for(let it=0;it<b;it++){const ct=-16+it*.5,rt=-16+U*.5;N.info(ct,rt,y);const X=t.noise.n2(ct*.16+7.7,rt*.16-3.1),J=t.noise.n2((ct*.75+rt*.66)*.11,(rt*.75-ct*.66)*.5+5);q[U*b+it]=.16+.6*Y(.1,.5,J)*Y(-.1,.35,X)-.4*y[1]-1.2*y[2],ut[U*b+it]=y[2],zt[U*b+it]=y[0]}(U&7)===7&&await t.yield()}const Ct=(U,it,ct)=>{const rt=O((it+16)*2,0,b-1.001),X=O((ct+16)*2,0,b-1.001),J=Math.floor(rt),nt=Math.floor(X),st=rt-J,lt=X-nt,mt=nt*b+J;return(U[mt]*(1-st)+U[mt+1]*st)*(1-lt)+(U[mt+b]*(1-st)+U[mt+b+1]*st)*lt};for(let U=0;U<yt;U++){const it=se(Ut,ee,T())*4;if(r.set(Vt.subarray(it,it+4),U*4),u.set(Wt.subarray(it,it+4),U*4),I.set([.04+.96*T(),T(),T(),T()],U*4),A.set([T(),T.range(.02,.2),O(Dt[it+1]+T.range(-.25,.25),0,1),T()],U*4),A[U*4+3]>=.4){let ct=0,rt=6,X=0;for(let J=0;J<5;J++){const nt=x.range(0,6.2832),st=Math.sqrt(x.range(2.6*2.6,15.6*15.6));ct=Math.sin(nt)*st,rt=Math.cos(nt)*st;const lt=.45*Math.exp(-(((st-13.2)/2.3)**2))+Ct(q,ct,rt);if(x()<lt)break}X=Ct(ut,ct,rt)>.015?N.info(ct,rt,y)[0]:Ct(zt,ct,rt),i.set([ct,X,rt,x()],U*4)}U%1e3===999&&await t.yield()}const pt=new c.InstancedBufferGeometry;pt.setAttribute("position",new c.Float32BufferAttribute([0,-.1,0,-.75,1.15,0,.75,1.15,0],3)),pt.setAttribute("iA",new c.InstancedBufferAttribute(r,4)),pt.setAttribute("iB",new c.InstancedBufferAttribute(u,4)),pt.setAttribute("iC",new c.InstancedBufferAttribute(I,4)),pt.setAttribute("iD",new c.InstancedBufferAttribute(A,4)),pt.setAttribute("iG",new c.InstancedBufferAttribute(i,4)),pt.instanceCount=yt,pt.boundingSphere=new c.Sphere(s(n.uWindH.value.x*30,32,n.uWindH.value.z*30),104);const kt=new c.Mesh(pt,$e(n,m));kt.name="cherry-petals",d.add(kt),Et.petals=kt}await t.yield();const $t=n.uWind.value.clone(),re={trunkBase:s(0,0,0),crownCentre:s(0,10.5,0),crownTop:s(0,F.topY+1,0),flyThrough:[s(ot,vt,30),s(ot,vt,15),s(ot,vt,5),s(ot,vt,-5),s(ot,vt,-15),s(ot,vt+.5,-30)],partingIn:s(ot,vt,12.7),partingOut:s(ot,vt,-12.7),secondPass:[s(-22,20,-40),s(-22,20,-15),s(-22,20,0),s(-22,20,15),s(-22,20,40)],viewpoints:{entry:{position:s(ot,-11,180),target:s(0,9,0)},under:{position:s(ot,vt,6),target:s(12,5,-3)},above:{position:s(-10,22,-78),target:s(0,9,0)},strip:{position:s(-22,20,-4),target:s(0,10,4)}},windDir:$t,windward:s(-n.uWindH.value.x,0,-n.uWindH.value.z),flockStart:s(11.5,5,1),portalSeat:{position:s(0,12,0).addScaledVector($t,215),facing:s(-n.uWindH.value.x,0,-n.uWindH.value.z)},petalCloud:{origin:s(0,10.5,0),dir:$t,speed:n.uSpeed.value,life:n.uLife.value},clearance:6},Ot=e.uHit??.66,ke=Math.max(Ot+.001,e.uEnd??.72),Ae=e.demo!==!1;let le=!1,ue=0,Yt=null,dt=-30,Pt=null,ce=0;const Pe=new c.Vector2,Ce=s(0,0,0),St=s(0,0,0),Le=new c.Quaternion,he=O(e.strip??0,0,1),fe=()=>he*O((dt-1)/5,0,1),Te=()=>Y(-1.5,2.1,dt)*(1-.36*Y(3.2,8,dt));return{object:d,radius:16,height:It,center:s(0,10,0),anchors:re,ground:!0,groundY:0,stats:{limbTris:F.tris,baseTris:g,strands:ft,blossoms:Mt,petals:yt},setProgress(r){le=!0,ue=r},setGust(r){Yt=r},setWind(r){_(r),re.windDir.copy(n.uWind.value)},setSun(r){n.uSunGain.value=r},clock:()=>dt,stripAmount:fe,liftAmount:Te,parts:Et,moundAt:(r,u)=>N(r,u),uniforms:n,update(r,u,I){n.uTime.value=u,t.renderer?.getDrawingBufferSize&&(n.uViewH.value=t.renderer.getDrawingBufferSize(Pe).y||1080),Yt!=null?dt=Yt:le?dt=O(3*(ue-Ot)/(ke-Ot),-30,60):Ae?dt=u%30-18:dt=-30,n.uClock.value=dt,n.uStrip.value=he*O((dt-1)/5,0,1)*1.2;const A=Math.max(n.uShed.value*.5,.3*fe());if(n.uBare.value=A,!Pt&&ce--<=0){ce=40;let i=d;for(;i.parent;)i=i.parent;i.traverse(x=>{!Pt&&x.isDirectionalLight&&(Pt=x)})}if(Pt&&(St.setFromMatrixPosition(Pt.matrixWorld).sub(Ce.setFromMatrixPosition(Pt.target.matrixWorld)),St.lengthSq()>1e-8)){St.normalize().applyQuaternion(d.getWorldQuaternion(Le).invert()),n.uSunL.value.copy(St);const i=Math.min(9/Math.max(St.y,.3),22);n.uShade.value.set(-St.x*i,-St.z*i,14,.8*(1-.75*A))}},dispose(){Qt?.dispose()}}}export{Bt as GLSL_LIGHT,ye as GLSL_SHAPE,Je as buildHero};
