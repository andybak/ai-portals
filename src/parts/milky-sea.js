import*as m from"three";import{clamp as g0,lerp as Z,smoothstep as $}from"../kit/core.js";const O0=["#B8F2D6","#5FCBA4","#124A45","#07061A","#3A3158","#020506","#FF3B2A"],o=(e,t,l)=>new m.Vector3(e,t,l),a0={k1x:.0826,k1z:-.035,w1:.698,a1:.2,k2x:-.082,k2z:-.26,w2:1.64,a2:.05};function _0(e,t,l){return a0.a1*Math.sin(e*a0.k1x+t*a0.k1z-a0.w1*l)+a0.a2*Math.sin(e*a0.k2x+t*a0.k2z-a0.w2*l+1.3)}const f0=`
uniform float uMsTime, uMsAmp;
float msSwell(vec2 p){
  return uMsAmp*0.2*sin(dot(p, vec2(0.0826,-0.0350)) - 0.698*uMsTime) + uMsAmp*0.05*sin(dot(p, vec2(-0.082,-0.26)) - 1.64*uMsTime + 1.3);
}`,u0=`
uniform vec3 uMsGlow;    // sea light from below (colour * intensity)
uniform vec3 uMsSky;     // sky fill from above
uniform vec3 uMsWave;    // x amount, y phase foot->head, z gain
uniform vec3 uMsFoot;    // sail colour at the foot
uniform vec3 uMsDusk;    // sail colour at the royals
uniform float uMsSeaY;
float msGain(float y){ float b = (y/46.0 - uMsWave.y)*4.0; return uMsWave.z*(1.0 + uMsWave.x*exp(-b*b)); }
vec3 msUnder(vec3 N, float occ, float y){
  float w = clamp(0.5 - 0.5*N.y, 0.0, 1.0); w = w*w*(3.0 - 2.0*w);
  return uMsGlow*(w*occ*msGain(y)) + uMsSky*(1.0 - w);
}
vec3 msSailCol(float y){
  float a = exp(-max(y - 6.5, 0.0)/19.5);
  return mix(uMsFoot*0.95*a, uMsDusk*1.7, smoothstep(27.0, 42.0, y))*msGain(y);
}
uniform vec4 uMsLamp[4]; // the four deck lanterns, ship space: xyz, strength
uniform vec3 uMsWarm;    // their amber
vec3 msLamps(vec3 P, vec3 N, float wrap){
  vec3 s = vec3(0.0);
  for (int i = 0; i < 4; i++) {
    vec3 d = uMsLamp[i].xyz - P; float r2 = dot(d, d);
    float nl = dot(N, d)/sqrt(max(r2, 1e-4));
    s += uMsWarm*(uMsLamp[i].w*(wrap + (1.0 - wrap)*max(nl, 0.0))/(1.0 + r2*0.06));
  }
  return s;
}
float msH(vec2 p){ p = fract(p*vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y)*p.x); }
float msN(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f*f*(3.0 - 2.0*f);
  return mix(mix(msH(i), msH(i + vec2(1.,0.)), f.x), mix(msH(i + vec2(0.,1.)), msH(i + vec2(1.,1.)), f.x), f.y);
}`,i0=-5.5;function C(e){const t=Math.abs(2*e-1);return 4.8+1.3*Math.pow(t,2.2)*(e>.5?1.3:.8)+.45*(1-$(.249,.251,e))+.55*$(.859,.861,e)}function c0(e){const t=C(e);return e<.25?t-.55:e>.86?t-.5:t-1.15}function k0(e){return e<.36?Math.pow(1-Math.pow(1-e/.36,2.4),.5):e>.5?Math.pow(Math.max(1-Math.pow(1-(1-e)/.5,2.1),0),.8):1}function T0(e,t){const l=Math.pow(Math.sin(Math.min(t/.42,1)*Math.PI/2),.45)*(1-.05*$(.62,1,t)),v=Math.pow(t,1.45),n=Math.pow($(.26,1.02,t),1.15),a=Math.pow($(.52,1,e),1.2),r=Math.pow(1-$(0,.42,e),1.5);return Z(Z(l,v,a),n,r)}function H0(e){const t=1-$(0,.42,e);return-24.5-4*Math.pow(e,1.6)+7.5*t*t}function Q(e,t,l){const v=Z(23.5,-24.5,e),n=Z(28,-28.5,e),a=Z($(.42,.95,t),Math.pow(t,1.6),$(.3,.7,e));let r=5*k0(e)*T0(e,t),i=Z(v,n,a);if(e>.5){const c=H0(t),M=1-$(.3,.46,t);r*=Z(1,$(0,3.5,i-c),M),i=Math.max(i,c)}return l.set(r,Z(i0,C(e),t),i),l}const K=e=>(28-e)/56.5;function h0(e,t){const l=g0(K(e),0,1),v=C(l);return 5*k0(l)*T0(l,g0((t-i0)/(v-i0),0,1))}function $0(e,t,l){const v=K(l);if(v<0||v>1)return 1;const n=5*k0(v),a=C(v),r=Math.abs(e);if(r>n-.08)return 1;const i=$(a-.2,a+7,t),c=$(n-3,n,r)*$(a-.3,a+1.5,t);return g0(.05+.95*Math.max(i,c*.8),0,1)}function X0(){return{p:[],n:[],c:[],a:[]}}const L0=new m.Matrix3,t0=new m.Vector3,d0=new m.Vector3,B0=new m.Quaternion,Z0=new m.Matrix4;function b(e,t,l,v,n=0,a={}){const r=t.index?t.toNonIndexed():t;l=l||Z0,L0.getNormalMatrix(l);const i=r.attributes.position,c=r.attributes.normal,M=r.attributes.uv;for(let w=0;w<i.count;w++){t0.fromBufferAttribute(i,w).applyMatrix4(l),d0.fromBufferAttribute(c,w).applyMatrix3(L0).normalize(),e.p.push(t0.x,t0.y,t0.z),e.n.push(d0.x,d0.y,d0.z);const p=a.jitter?1+a.jitter*Math.sin(t0.x*3.1+t0.y*5.7+t0.z*2.3):1;e.c.push(v.r*p,v.g*p,v.b*p),e.a.push(n,a.occ!==void 0?a.occ:$0(t0.x,t0.y,t0.z),a.uv&&M?M.getX(w):a.z||0,a.uv&&M?M.getY(w):0)}r!==t&&r.dispose(),t.dispose()}const K0=o(0,1,0),S0=new m.Vector3;function Q0(e,t){S0.subVectors(t,e);const l=S0.length()||1e-4;return B0.setFromUnitVectors(K0,S0.multiplyScalar(1/l)),new m.Matrix4().compose(o((e.x+t.x)/2,(e.y+t.y)/2,(e.z+t.z)/2),B0,o(1,l,1))}function E(e,t,l,v,n,a,r=8,i=0,c={}){b(e,new m.CylinderGeometry(n,v,1,r,1,!1),Q0(t,l),a,i,c)}function j(e,t,l,v=.08,n=v){const a=e/2,r=l/2,i=[[a-v,-r],[a,-r+v],[a,r-v],[a-v,r],[-a+v,r],[-a,r-v],[-a,-r+v],[-a+v,-r]],c=[[0,1],[t-n,1],[t,0]],M=[],w=(u,x)=>{const z=i[u%8],h=c[x][0],s=c[x][1]?0:n;return[z[0]-Math.sign(z[0])*s,h,z[1]-Math.sign(z[1])*s]};for(let u=0;u<2;u++)for(let x=0;x<8;x++){const z=w(x,u),h=w(x+1,u),s=w(x+1,u+1),k=w(x,u+1);M.push(...z,...k,...h,...h,...k,...s)}for(let u=1;u<7;u++)M.push(...w(0,2),...w(u+1,2),...w(u,2));const p=new m.BufferGeometry;return p.setAttribute("position",new m.Float32BufferAttribute(M,3)),p.computeVertexNormals(),p}const W=(e,t,l,v=0,n=1,a=1,r=1,i=0,c=0)=>new m.Matrix4().compose(o(e,t,l),new m.Quaternion().setFromEuler(new m.Euler(i,v,c)),o(n,a,r));function R0(e){const t=new m.BufferGeometry;return t.setAttribute("position",new m.Float32BufferAttribute(e.p,3)),t.setAttribute("normal",new m.Float32BufferAttribute(e.n,3)),t.setAttribute("aCol",new m.Float32BufferAttribute(e.c,3)),t.setAttribute("aAux",new m.Float32BufferAttribute(e.a,4)),t}function J0(e,t){const l={masts:[],yards:[],chains:[]},v=[{z:-14,truck:41,rake:.016+e()*.01},{z:3,truck:44,rake:.024+e()*.01},{z:19,truck:36,rake:.036+e()*.012,mizzen:!0}],n=e.range(-.12,.12);return v.forEach((a,r)=>{const i=a.truck/44,c={...a,k:i,i:r};if(c.top=a.mizzen?15.5:16.6*i,c.cap=a.mizzen?19.2:20.6*i,c.cross=a.mizzen?27:29.6*i,c.head=a.mizzen?30:33.6*i,c.off=p=>p>c.cross+.3?-.8:p>c.top+.3?-.45:0,c.at=(p,u=0)=>o(0,p,a.z+a.rake*(p-5)+u),c.yaw=a.mizzen?0:n*(r===0?1:.6)+e.range(-.04,.04),l.masts.push(c),!a.mizzen){const p=[15,22,28,35,41],u=[12,10.5,9,7.2,5.5];p.forEach((x,z)=>{const h=x*i,s=c.yaw*(1+z*.12)+e.range(-.012,.012),k=e.range(-.014,.014),T=c.at(h,c.off(h-1)-(z===0?.78:.58)),d=u[z]*(.55+.45*i),D=(U,I=1)=>o(T.x+Math.cos(s)*d*I*U,T.y+Math.sin(k)*d*I*U,T.z+Math.sin(s)*d*I*U);l.yards.push({m:c,yi:z,c:T,half:d,yaw:s,tilt:k,end:D,r:.2*Math.sqrt(d/12)+.02})})}const M=a.mizzen?4:5,w=a.mizzen?2:3;for(const p of[-1,1])for(let u=0;u<M+w;u++){const x=a.z+(a.mizzen?u<M?.6+u*.8:4.3+(u-M)*.85:u<M?.7+u*.95:6.2+(u-M)*.95),z=C(K(x));l.chains.push({m:c,sg:p,j:u,back:u>=M?u-M:-1,foot:o(p*(h0(x,z)+.34),z+.8,x),z:x,ry:z})}}),l.clewed=t.courses?t.courses==="clewed":e.chance(.25),l.bowsprit=[o(0,7.15,-24),o(0,8,-36.5)],l.jibboom=[o(0,7.85,-33.5),o(0,9,-46)],l.gaff=[o(0,14.9,19.75),o(0,20.6,29.6)],l.boom=[o(0,7.3,19.75),o(0,7.9,32.2)],l.lamp=a=>{const r=C(K(-12));return o(a*(h0(-12,r)+.5),r+.5,-12)},l}function O(e,t){const l=[],v=[],n=e.length;for(let r=0;r<n;r++)l.push(e[r].x,e[r].y,e[r].z,t[r].x,t[r].y,t[r].z);for(let r=0;r<n-1;r++)v.push(r*2,r*2+2,r*2+1,r*2+1,r*2+2,r*2+3);const a=new m.BufferGeometry;return a.setAttribute("position",new m.Float32BufferAttribute(l,3)),a.setIndex(v),a.computeVertexNormals(),a}async function C0(e,t,l,v,n){const a=[];for(let f=0;f<=68;f++)a.push(f/68);a.push(.2488,.2512,.8588,.8612,.003,.007,.011,.02,.026,.034,.98,.992,.997),a.sort((f,g)=>f-g);const r=a.length,i=22,c=2*i+1,M=[],w=[],p=[],u=o(0,0,0),x=o(0,0,0);let z=0;const h=o(0,0,0),s=o(0,0,0);for(let f=0;f<r;f++){f%6===5&&await n(),f>0&&(z+=Q(a[f],.85,h).distanceTo(Q(a[f-1],.85,s))),a[f]<=.945&&(l.hawseU=z);const g=[0];Q(a[f],1,x);for(let F=i-1;F>=0;F--)Q(a[f],F/i,u),g[i-F]=g[i-F-1]+u.distanceTo(x),x.copy(u);for(let F=-i;F<=i;F++){const N=Math.abs(F);Q(a[f],N/i,u),M.push(F<0?-u.x:u.x,u.y,u.z),w.push(z+(F<0?100:0),g[i-N])}}for(let f=0;f<r-1;f++)for(let g=0;g<c-1;g++){const F=f*c+g,N=F+c;p.push(F,N,F+1,F+1,N,N+1)}const k=new m.BufferGeometry;k.setAttribute("position",new m.Float32BufferAttribute(M,3)),k.setAttribute("uv",new m.Float32BufferAttribute(w,2)),k.setIndex(p),k.computeVertexNormals(),await n();const T=6*(c-1)*10;for(let f=0;f<p.length;f+=T){const g=new m.BufferGeometry;for(const F of["position","normal","uv"])g.setAttribute(F,k.attributes[F]);g.setIndex(p.slice(f,f+T)),b(e,g,null,t.iron,1,{occ:1,uv:!0}),await n()}k.dispose();const d={dS:[],dP:[],iS:[],iP:[],iSb:[],iPb:[],cS:[],cP:[],cSi:[],cPi:[],r0:[],r1:[],r2:[],r3:[]};for(let f=0;f<r;f++){const g=a[f];Q(g,1,u);const F=Math.max(u.x-.2,0),N=c0(g),Y=u.y,A=u.z;d.dS.push(o(F,N,A)),d.dP.push(o(-F,N,A)),d.iS.push(o(F,Y,A)),d.iSb.push(o(F,N,A)),d.iP.push(o(-F,Y,A)),d.iPb.push(o(-F,N,A)),d.cS.push(o(u.x+.07,Y+.07,A)),d.cSi.push(o(Math.max(u.x-.27,0),Y+.07,A)),d.cP.push(o(-u.x-.07,Y+.07,A)),d.cPi.push(o(-Math.max(u.x-.27,0),Y+.07,A));const H=Q(g,.8,o(0,0,0)),e0=Q(g,.835,o(0,0,0)),s0=Math.min(.13,H.x);d.r0.push(H),d.r1.push(o(H.x+s0,H.y,H.z)),d.r2.push(o(e0.x+s0,e0.y,e0.z)),d.r3.push(e0)}await n(),b(e,O(d.dS,d.dP),null,t.deck,0,{occ:.04}),b(e,O(d.iS,d.iSb),null,t.iron2,0,{occ:.05}),b(e,O(d.iPb,d.iP),null,t.iron2,0,{occ:.05}),b(e,O(d.cS,d.cSi),null,t.rail,0,{occ:1}),b(e,O(d.cPi,d.cP),null,t.rail,0,{occ:1}),b(e,O(d.cS,d.iS.map((f,g)=>o(d.cS[g].x,f.y-.1,f.z))),null,t.rail,0,{occ:1}),b(e,O(d.cP,d.iP.map((f,g)=>o(d.cP[g].x,f.y-.1,f.z))),null,t.rail,0,{occ:1}),await n();const D=f=>f.map(g=>o(-g.x,g.y,g.z));for(const f of[g=>g,D])b(e,O(f(d.r0),f(d.r1)),null,t.strake,0,{occ:1}),b(e,O(f(d.r1),f(d.r2)),null,t.strake,0,{occ:1}),b(e,O(f(d.r2),f(d.r3)),null,t.strake,0,{occ:1});await n();const U=[],I=[],P=[],G=[];for(let f=-10;f<=10;f++){const g=Math.abs(f)/10*.035,F=Math.sign(f)||1,N=(Y,A)=>{const H=Q(g,Y,o(0,0,0));return H.x=F*(H.x+A*.6),H.z+=A,H};U.push(N(.855,.03)),I.push(N(.87,.1)),P.push(N(.93,.1)),G.push(N(.945,.03))}b(e,O(U,I),null,t.gilt,0,{occ:1}),b(e,O(I,P),null,t.board,0,{occ:1,jitter:.25}),b(e,O(P,G),null,t.gilt,0,{occ:1}),await n();const B=[[],[]];for(let f=0;f<=15;f++){Q(.004+f*.0155,1,u);for(const g of[-1,1]){const F=o(g*Math.max(u.x-.1,.05),u.y+.07,u.z);E(e,F,o(F.x,F.y+.78,F.z),.045,.03,t.rail,5,0,{occ:1}),B[g<0?0:1].push(o(F.x,F.y+.8,F.z))}}const y=B[0].slice().reverse().concat(B[1]);b(e,O(y.map(f=>o(f.x*1.03,f.y,f.z+.03)),y.map(f=>o(f.x*.95,f.y+.04,f.z-.07))),null,t.rail,0,{occ:1}),b(e,O(y.map(f=>o(f.x*1.03,f.y,f.z+.03)),y.map(f=>o(f.x*1.03,f.y-.09,f.z+.03))),null,t.rail,0,{occ:1}),await n(),b(e,j(.36,6.8,.55,.07),W(0,i0-.85,23.72),t.rudder,0,{occ:1,jitter:.2});const L=[[-6.35,1.35],[-5.9,1.75],[-5.35,1.95],[-4.6,2.15],[-3.6,2.25],[-2.6,1.9],[-1.7,1.25],[-1,.7],[-.45,.45],[1.2,.38]],q=W(0,0,24.05,-.13);for(const f of[-1,1])b(e,O(L.map(g=>o(f*.13,g[0],0)),L.map(g=>o(f*.035,g[0],g[1]))),q,t.rudder,0,{occ:1,jitter:.25});b(e,O(L.map(f=>o(-.13,f[0],0)),L.map(f=>o(.13,f[0],0))),q,t.rudder,0,{occ:1}),b(e,O([o(-.13,L[0][0],0),o(-.035,L[0][0],L[0][1])],[o(.13,L[0][0],0),o(.035,L[0][0],L[0][1])]),q,t.rudder,0,{occ:1});for(const f of[-4.7,-3.3,-1.9,-.6])b(e,j(.46,.16,.95,.05),W(0,f,24),t.iron2,0,{occ:1});b(e,j(.34,.95,40.4,.06),W(0,i0-.9,3),t.iron,0,{occ:1});for(const f of[0,1,2])for(const g of[-1,1]){await n();const F=l.chains.filter(N=>N.m.i===f&&N.sg===g);for(const N of F){b(e,j(.5,.12,1.02,.04),W(N.foot.x-g*.12,N.ry-.42,N.z),t.strake,0,{occ:1});for(const Y of[0,-.62])b(e,new m.CylinderGeometry(.11,.11,.1,7),W(N.foot.x,N.foot.y+Y,N.z,0,1,1,1,0,Math.PI/2),t.mastDark,0,{occ:1})}}for(const f of[-1,1]){const g=Q(.945,.86,o(0,0,0));b(e,new m.TorusGeometry(.2,.07,6,10),W(f*(g.x+.03),g.y,g.z,f*1.25),t.rail,0,{occ:1})}}function V0(e){const t=[],l=[],v=e[0].length;for(const a of e)for(const r of a)t.push(r.x,r.y,r.z);for(let a=0;a<e.length-1;a++)for(let r=0;r<v-1;r++){const i=a*v+r,c=i+v;l.push(i,c,i+1,i+1,c,c+1)}const n=new m.BufferGeometry;return n.setAttribute("position",new m.Float32BufferAttribute(t,3)),n.setIndex(l),n.computeVertexNormals(),n}function tt(e,t,l){const v=[];for(let r=0;r<=10;r++){const i=r/10,c=t/2*Math.pow(Math.sin(Math.PI*(i*.94+.03)),.6),M=l*Math.pow(Math.sin(Math.PI*(i*.88+.06)),.35),w=[];for(let p=-7;p<=7;p++){const u=p/7*Math.PI/2;w.push(o(c*Math.sin(u),-M*Math.pow(Math.cos(u),.7),(i-.5)*e))}v.push(w)}return v}function P0(e,t,l,v,n,a,r=.12){const i=W(l,v,n,a),c=(M,w,p)=>b(e,M,i.clone().multiply(w),t.figure,3,{z:p});for(const M of[-.11,.11])c(j(.17,.88,.2,.04),W(M,0,.03),.15);c(j(.46,.66,.27,.08,.1),W(0,.84,0,0,1,1,1,-r),.6),c(new m.IcosahedronGeometry(.12,1),W(0,1.64,-r*.75),1),c(new m.CylinderGeometry(.1,.18,.09,8),W(0,1.75,-r*.75),1);for(const M of[-1,1]){const w=o(M*.26,1.42,-r*.5).applyMatrix4(i),p=o(M*.31,1.14,-.2).applyMatrix4(i),u=o(M*.2,1.08,-.46).applyMatrix4(i);E(e,w,p,.065,.055,t.figure,5,3,{z:.7}),E(e,p,u,.055,.045,t.figure,5,3,{z:.6})}}async function et(e,t,l,v,n){const a=h=>c0(K(h)),i=a(-6.9);b(e,j(4.2,2.15,6.4,.12),W(0,i,-6.9),t.house,0,{jitter:.1}),b(e,j(4.7,.12,6.9,.2,.06),W(0,i+2.15,-6.9),t.rail),E(e,o(1.3,i+2.2,-6.9+2.2),o(1.3,i+3.3,-6.9+2.2),.09,.09,t.iron2,6),b(e,j(2.6,.5,2.3,.1),W(0,a(-17.6),-17.6),t.house),b(e,j(3.2,.55,3.2,.1),W(0,a(9),9),t.house),await n();const c=a(9)+2.3;for(const h of[6.4,11.6]){b(e,j(8.4,.18,.24,.05),W(0,c,h),t.rail);for(const s of[-3.9,3.9])E(e,o(s,a(h),h),o(s,c,h),.07,.07,t.rail,6)}const M=v.chance(.3)?1:2;for(let h=0;h<M;h++){const s=(h===0?-1:1)*(M===1?v.sign():1),k=tt(6.6+v()*.6,1.95,.9),T=W(s*2.25,c+1.12,9,v.range(-.03,.03));b(e,V0(k),T,t.boat,0,{jitter:.08}),b(e,V0([k.map(d=>d[0]),k.map(d=>o(0,.22*Math.sin(Math.PI*(d[0].z/7+.5)),d[0].z)),k.map(d=>d[d.length-1])]),T,t.canvas)}await n(),b(e,j(1.7,.62,2.3,.1,.32),W(0,a(15.9),15.9),t.house),b(e,j(1.1,1.25,1.5,.1,.2),W(1.25,a(21.8),21.8),t.house);const w=a(24.3);b(e,j(.36,1.05,.36,.09,.14),W(0,w,23.25),t.wood),b(e,new m.IcosahedronGeometry(.19,1),W(0,w+1.08,23.25),t.iron2),b(e,new m.TorusGeometry(.6,.045,5,18),W(0,w+1.05,24.3),t.wood);for(let h=0;h<4;h++){const s=h*Math.PI/4;E(e,o(Math.cos(s)*.76,w+1.05+Math.sin(s)*.76,24.3),o(-Math.cos(s)*.76,w+1.05-Math.sin(s)*.76,24.3),.025,.025,t.wood,4)}b(e,j(.28,1,.4,.06),W(0,w,24.55),t.wood),b(e,j(1.7,.62,1.2,.12,.2),W(0,w,25.75),t.house),await n();const p=a(-23.4),u=[[.46,0],[.44,.12],[.27,.3],[.25,.62],[.4,.78],[.42,.95],[.3,1.02],[.001,1.04]].map(h=>new m.Vector2(h[0],h[1]));b(e,new m.LatheGeometry(u,12),W(0,p,-23.4),t.wood);for(const h of[-1,1]){const s=C(K(-25.2));E(e,o(h*2.2,s+.05,-25),o(h*3.9,s+.3,-26),.15,.13,t.rail,6)}await n();const x={helm:o(v.range(-.25,.25),w,25.05),lookout:o(v.range(-.8,.8),p,-25.6),hands:[]};P0(e,t,x.helm.x,w,x.helm.z,v.range(.3,.9),.1),await n(),P0(e,t,x.lookout.x,p,x.lookout.z,v.range(-.5,.5),.2),await n();let z=v.range(-2,1.5);for(let h=0;h<2;h++){const s=z,k=-(h0(s,C(K(s)))-.62);x.hands.push(o(k,a(s),s)),P0(e,t,k,a(s),s,Math.PI/2+v.range(-.25,.25),.26),z+=v.range(1.1,2.4),await n()}x.lamps=[[0,a(27.2)+2.05,27.2,2],[0,a(17.6)+1.95,17.6,1.3],[0,i+3,-6.9+3.75,2],[0,a(-20.6)+2.1,-20.6,1.8]].map(h=>new m.Vector4(h[0],h[1],h[2],h[3]));for(const h of x.lamps){const s=h.z===-3.1500000000000004?i+2.2:a(h.z);E(e,o(h.x,s,h.z),o(h.x,h.y-.2,h.z),.035,.03,t.iron2,5,0,{occ:1}),b(e,new m.CylinderGeometry(.06,.15,.1,6),W(h.x,h.y+.2,h.z),t.iron2,0,{occ:1}),b(e,new m.CylinderGeometry(.13,.1,.08,6),W(h.x,h.y-.19,h.z),t.iron2,0,{occ:1}),b(e,new m.CylinderGeometry(.115,.115,.32,6),W(h.x,h.y,h.z),t.amber,2,{occ:1}),await n()}for(const h of[-1,1])for(const s of[-2.1,0,2.1])b(e,j(.05,.42,.6,.01),W(h*2.11,i+1.15,-6.9+s),t.pane,2,{occ:1});for(const h of[-1,1])b(e,j(.5,.04,1.7,.01),W(h*.4,a(15.9)+.6,15.9,0,1,1,1,0,-h*.35),t.pane,2,{occ:1});return x}async function ot(e,t,l,v){for(const n of l.masts){await v();const a=.75+.25*n.k,r=(i,c)=>n.at(i,c).z;E(e,n.at(c0(K(n.z))-.1),n.at(n.cap),.42*a,.33*a,t.mast,10),b(e,j(3.3*a,.14,2.4,.4,.04),W(0,n.top,r(n.top)-.3),t.mastDark);for(const i of[-.3,.3])b(e,j(.12,.3,2.2,.03),W(i*a,n.top-.3,r(n.top)-.3),t.mastDark);b(e,j(.8,.22,1.3,.1),W(0,n.cap-.12,r(n.cap)-.25),t.mastDark),E(e,n.at(n.top-.7,-.45),n.at(n.head,-.45),.25*a,.18*a,t.spar,8);for(const i of[-.75,-.2])E(e,o(-1.3*a,n.cross,r(n.cross)+i),o(1.3*a,n.cross,r(n.cross)+i),.06,.06,t.mastDark,5);b(e,j(.5,.16,1.5,.08),W(0,n.cross-.1,r(n.cross)-.5),t.mastDark),b(e,j(.5,.18,.9,.08),W(0,n.head-.12,r(n.head)-.62),t.mastDark),E(e,n.at(n.cross-.6,-.8),n.at(n.truck,-.8),.15*a,.07,t.spar,7),b(e,new m.IcosahedronGeometry(.17,1),W(0,n.truck+.08,r(n.truck)-.8,0,1,.6,1),t.gilt)}await v();for(const n of l.yards){for(const a of[-1,1])E(e,n.c,n.end(a),n.r,n.r*.48,t.spar,8);b(e,j(.5,.36,.62,.1),W(0,n.c.y-.18,n.c.z+.3),t.mastDark)}await v(),E(e,l.bowsprit[0],l.bowsprit[1],.36,.27,t.mast,10),E(e,l.jibboom[0],l.jibboom[1],.19,.085,t.spar,8),b(e,j(.5,.75,.24,.08),W(0,l.bowsprit[1].y-.3,l.bowsprit[1].z),t.mastDark),E(e,o(0,7.75,-36.55),o(0,4.4,-36.95),.075,.05,t.spar,6),E(e,o(0,6.75,-28.5),o(0,5.75,-29.55),.3,.1,t.boat,8),E(e,l.gaff[0],l.gaff[1],.15,.085,t.spar,8),E(e,l.boom[0],l.boom[1],.19,.12,t.spar,8);for(const n of[-1,1]){const a=l.lamp(n);b(e,j(.07,.72,1,.02),W(a.x-n*.24,a.y-.38,a.z),t.iron2,0,{occ:1}),b(e,j(.5,.06,1,.02),W(a.x-n*.02,a.y-.4,a.z),t.iron2,0,{occ:1}),b(e,new m.CylinderGeometry(.1,.14,.4,8),W(a.x,a.y-.08,a.z),t.iron2,0,{occ:1}),b(e,new m.IcosahedronGeometry(.115,1),W(a.x+n*.03,a.y,a.z),n<0?t.red:t.green,2,{occ:1})}}function at(){return{p:[],uv:[],met:[],n:[],tu:[],sd:[],ph:[],idx:[]}}const R=o(0,0,0),v0=o(0,0,0),m0=o(0,0,0),j0=o(0,0,0),w0=o(0,0,0);function p0(e,t,l){const v=e.p.length/3,n=l.nu,a=l.nv,r=n+1,i=new Float32Array(r*(a+1)*3);for(let w=0;w<=a;w++)for(let p=0;p<=n;p++){t(-1+2*p/n,w/a,R);const u=(w*r+p)*3;i[u]=R.x,i[u+1]=R.y,i[u+2]=R.z}const c=(w,p,u)=>{const x=(p*r+w)*3;return u.set(i[x],i[x+1],i[x+2])},M=c(n>>1,a,R).distanceTo(c(n>>1,0,v0));for(let w=0;w<=a;w++){const p=c(n,w,R).distanceTo(c(0,w,v0))/2,u=Math.max(w,1);for(let x=0;x<=n;x++){const z=-1+2*x/n,h=w/a;m0.subVectors(c(Math.min(x+1,n),u,R),c(Math.max(x-1,0),u,v0)).normalize(),j0.subVectors(c(x,Math.min(w+1,a),R),c(x,Math.max(w-1,0),v0)),w0.crossVectors(m0,j0).normalize(),c(x,w,R),e.p.push(R.x,R.y,R.z),e.uv.push(z,h),e.met.push(z*p,h*M,p,M),e.n.push(w0.x,w0.y,w0.z),e.tu.push(m0.x,m0.y,m0.z),e.sd.push(l.seed,l.kind,l.fold,l.belly),e.ph.push(l.phase,l.flag||0)}}for(let w=0;w<a;w++)for(let p=0;p<n;p++){const u=v+w*r+p,x=u+r;e.idx.push(u,x,u+1,u+1,x,x+1)}}function F0(e,t,l,v,n={}){const a=o(0,0,0),r=o(0,0,0),i=e.clone().lerp(t,.5),c=l.clone().lerp(v,.5),M=o(0,0,0),w=n.hollow??.035,p=n.roach||0,u=n.scallop||0,x=n.sag||0;return(z,h,s)=>{const k=(z+1)/2;return a.lerpVectors(e,t,k),r.lerpVectors(l,v,k),s.lerpVectors(a,r,h),M.lerpVectors(i,c,h),s.sub(M).multiplyScalar(1-w*Math.sin(Math.PI*h)).add(M),s.y+=p*h*h*Math.pow(1-z*z,.8)+u*Math.pow(h,1.5)*(.5-.5*Math.cos(z*Math.PI*3))-x*k*Math.sin(Math.PI*h),s}}async function st(e,t,l,v,n){const a=P=>Math.max(8,Math.round(P*(.7+.3*v))),r=[];t.faClews=[],t.courseClews=[];for(const P of t.yards){const G=P.m,B=P.yi>0?t.yards.find(Y=>Y.m===G&&Y.yi===P.yi-1):null,y=P.end(-1,.95),L=P.end(1,.95);y.y-=.28,L.y-=.28;let q,f,g={roach:.3,hollow:.03},F=l.range(.85,1.2),N=l.range(.3,.62);if(B)q=B.end(-1,.93),f=B.end(1,.93),q.y+=.5,f.y+=.5;else{const Y=G.i===0?8:7.5,A=t.clewed;q=P.end(-1,A?.8:.9),f=P.end(1,A?.8:.9),q.y=f.y=A?P.c.y-3:Y,q.z+=.15,f.z+=.15,g=A?{roach:0,scallop:1.25,hollow:.01}:{roach:.9,hollow:.04},A?(F*=1.7,N*=.5):N*=1.25,t.courseClews.push(q.clone(),f.clone())}p0(e,F0(y,L,q,f,g),{nu:a(P.half>8.5?60:44),nv:a(18),kind:0,seed:l.range(1,60),fold:F,belly:N,phase:G.i*.9+P.yi*.35+l.range(-.25,.25),flag:P.yi===0&&!t.clewed||P.yi===2?1:0}),r.push({kind:0,top:y.y,foot:q.y,half:P.half}),await n()}await n();const i=(P,G,B,y={})=>{const L=t.faClews.length%2?-1:1,q=l.range(.5,.85)*L;B=B.clone(),B.x=L*l.range(.5,1)*(y.off??3.4),t.faClews.push(B),p0(e,F0(P,P,G,B,{hollow:.05,sag:y.sag??.35}),{nu:a(28),nv:a(18),kind:1,seed:l.range(1,60),fold:l.range(1.2,1.7),belly:q,phase:l.range(0,6.28),flag:0})},c=t.masts[0],M=t.masts[1],w=t.masts[2];t.stays={fore:[o(0,7.25,-29.2),c.at(c.top-.6,-.5)],foreTop:[t.bowsprit[1].clone().add(o(0,.25,.4)),c.at(c.cross-.4,-.75)],jib:[o(0,8.75,-41.3),c.at(c.head-.3,-.9)],flying:[t.jibboom[1].clone().add(o(0,.1,.15)),c.at(c.truck-5.5,-.9)],mizzen:[M.at(8.2,.5),w.at(w.top-.5,-.45)],mizzenTop:[M.at(M.top+.6,.45),w.at(w.cross-.5,-.5)]};const p=(P,G)=>P[0].clone().lerp(P[1],G);i(p(t.stays.fore,.86),p(t.stays.fore,.1),o(0,8.3,-16.6)),await n(),i(p(t.stays.foreTop,.84),p(t.stays.foreTop,.07),o(0,9,-24.5)),i(p(t.stays.jib,.82),p(t.stays.jib,.06),o(0,9.8,-30.5)),await n(),i(p(t.stays.flying,.78),p(t.stays.flying,.06),o(0,11.2,-36.5)),i(p(t.stays.mizzen,.88),p(t.stays.mizzen,.12),o(0,8,15.2)),await n(),i(p(t.stays.mizzenTop,.88),p(t.stays.mizzenTop,.1),o(0,16.6,14.8)),await n();const u=t.gaff[0].clone().add(o(0,-.2,.35)),x=t.gaff[1].clone().add(o(0,-.25,-.3)),z=t.boom[0].clone().add(o(0,.35,.35)),h=t.boom[1].clone().add(o(0,.3,-.9));p0(e,F0(u,x,z,h,{hollow:.03,sag:.25}),{nu:a(24),nv:a(16),kind:1,seed:l.range(1,60),fold:l.range(1,1.4),belly:l.range(.4,.7)*l.sign(),phase:l.range(0,6.28),flag:2}),i(w.at(w.head+1,-.2),w.at(w.top+.5,.25),t.gaff[1].clone().add(o(0,.35,-.5)),{sag:.1,off:0}),await n();const s=M.at(M.truck+.05,-.8),k=l.range(.3,1.2),T=l.range(10.5,13),d=o(Math.sin(k),0,Math.cos(k)),D=o(d.z,0,-d.x),U=o(0,0,0);t.pennant={root:s.clone(),tip:s.clone().addScaledVector(d,T*.5).add(o(0,-T*.7,0))},p0(e,(P,G,B)=>{const L=-1.05*Math.sqrt(Math.max(G,.02)),q=Z(.3,.04,G);return U.set(d.x*.5,L,d.z*.5).cross(D).normalize(),B.copy(s).addScaledVector(d,T*.5*G).addScaledVector(U,P*q),B.y-=T*.7*Math.pow(G,1.5),B},{nu:2,nv:a(36),kind:2,seed:l.range(1,60),fold:1,belly:0,phase:.5,flag:0});const I=t.gaff[1].clone().add(o(0,-.5,-.2));return p0(e,(P,G,B)=>B.set(0,I.y-(P+1)*.95-2.7*G-.25*G*(P+1),I.z+1.15*G+.12*(P+1)),{nu:6,nv:a(12),kind:2,seed:l.range(1,60),fold:.45,belly:0,phase:2,flag:1}),r}function nt(e){const t=new m.BufferGeometry;return t.setAttribute("position",new m.Float32BufferAttribute(e.p,3)),t.setAttribute("aUV",new m.Float32BufferAttribute(e.uv,2)),t.setAttribute("aMet",new m.Float32BufferAttribute(e.met,4)),t.setAttribute("aN",new m.Float32BufferAttribute(e.n,3)),t.setAttribute("aTu",new m.Float32BufferAttribute(e.tu,3)),t.setAttribute("aSd",new m.Float32BufferAttribute(e.sd,4)),t.setAttribute("aPh",new m.Float32BufferAttribute(e.ph,2)),t.setIndex(e.idx),t}function rt(){return{p:[],o:[],a:[],idx:[],n:0}}function _(e,t,l,v=.03,n=0,a=0,r=0){const i=r||(n>.02?8:1),c=Math.abs(t.x*1.7+t.y*.9+l.z*1.3+l.x*.7)%6.28;let M=t.x,w=t.y,p=t.z;for(let u=1;u<=i;u++){const x=u/i,z=Z(t.x,l.x,x),h=Z(t.y,l.y,x)-n*4*x*(1-x),s=Z(t.z,l.z,x),k=a*Math.sin(Math.PI*(u-1)/i),T=a*Math.sin(Math.PI*x),d=e.p.length/3;e.p.push(M,w,p,M,w,p,z,h,s,z,h,s),e.o.push(z,h,s,z,h,s,M,w,p,M,w,p),e.a.push(1,v,k,c,-1,v,k,c,1,-v,T,c,-1,-v,T,c),e.idx.push(d,d+1,d+2,d+2,d+1,d+3),M=z,w=h,p=s}e.n++}function lt(e,t,l){const[v,n,a]=t.masts,r=(s,k,T)=>s.clone().lerp(k,T),i=s=>h0(s,C(K(s))),c=s=>C(K(s)),M=(s,k,T,d,D,U,I)=>{const P=s.distanceTo(k);for(let G=D;G<P-U;G+=I)_(e,r(s,k,G/P),r(T,d,G/P),.018)};for(const s of t.masts){const k=.75+.25*s.k,T=d=>s.at(d,s.off(d)).z;for(const d of[-1,1]){const D=t.chains.filter(y=>y.m===s&&y.sg===d),U=D.filter(y=>y.back<0),I=y=>s.at(s.top+.7).add(o(d*.3,0,(y-2)*.07));U.forEach((y,L)=>_(e,y.foot,I(L),.045));for(const y of D)_(e,o(y.foot.x-d*.05,y.foot.y,y.z-.05),o(y.foot.x-d*.05,y.foot.y-.62,y.z+.05),.02),_(e,o(y.foot.x,y.foot.y-.62,y.z),o(y.foot.x-d*.2,y.ry-1.5,y.z),.04);M(U[0].foot,I(0),U[U.length-1].foot,I(U.length-1),1.5,1.4,.42);const P=y=>o(d*1.55*k,s.top+.1,s.at(s.top).z-.75+y*.55),G=y=>s.at(s.cross-.1,-.45).add(o(d*.22,0,(y-1)*.06));for(let y=0;y<3;y++)_(e,P(y),G(y),.035),_(e,P(y),s.at(s.top-2.3).add(o(d*.34,0,(y-1)*.1)),.035);M(P(0),G(0),P(2),G(2),.8,1,.42);for(const y of[-.75,-.2])_(e,o(d*1.3*k,s.cross,s.at(s.cross).z+y),s.at(Z(s.head,s.truck,.45),-.8).add(o(d*.1,0,0)),.025);const B=[s.at(s.cross-.4,-.45),s.at(s.head-.2,-.6),s.at(s.truck-1.8,-.8)];for(const y of D)y.back>=0&&_(e,y.foot,B[Math.min(y.back+(s.mizzen?1:0),2)].clone().add(o(d*.15,0,0)),.04)}}for(const s in t.stays)_(e,t.stays[s][0],t.stays[s][1],.05);const w=c0(K(v.z+1.2))+.5;_(e,n.at(n.top-.6,-.5),o(0,w,v.z+1.3),.055),_(e,n.at(n.cross-.4,-.75),v.at(13,.42),.045),_(e,n.at(n.head-.2,-.9),v.at(v.head-.2,-.3),.035),_(e,n.at(n.truck-2,-.9),v.at(v.truck-4,-.7),.028),_(e,a.at(a.truck-2,-.8),n.at(n.cross,.3),.03);const p=t.bowsprit[1],u=t.jibboom[1],x=o(0,4.4,-36.95);_(e,o(0,p.y-.35,p.z+.2),o(0,.9,-25.95),.06),_(e,u,x,.035),_(e,o(0,8.4,-41),x,.03);for(const s of[-1,1])_(e,x,o(s*(i(-24.6)-.05),4.6,-24.6),.035),_(e,o(0,p.y-.1,p.z),o(s*i(-25.6),5.9,-25.6),.045),_(e,u,o(s*3.9,c(-26)+.3,-26),.03,.15);for(const s of t.yards){const k=s.m,T=k.i===0,d=k.at(s.c.y+Math.min(5,s.half*.5),k.off(s.c.y+2));for(const D of[-1,1]){const U=s.end(D,.98);_(e,s.end(D,.96),d.clone().add(o(D*.15,0,-.1)),.025);let I;T?I=s.yi===4?n.at(n.head-.6,-.4):o(D*(i(.6+s.yi)+.05),c(.6+s.yi)+.35,.6+s.yi*.85):I=s.yi>=3?a.at(s.yi===4?a.head:a.cross-1,-.4):o(D*(i(21+s.yi)+.05),c(21+s.yi)+.35,21+s.yi*.8),_(e,U,I,.028,.35+.05*s.half,.1+l()*.08,10);const P=s.end(D,.93),G=s.end(D,.04),B=.5+s.half*.03;P.y-=.12,G.y-=.3,_(e,P,G,.03,B,.02,8);for(const y of[.25,.5,.75]){const L=r(P,G,y);_(e,o(L.x,L.y+.2,L.z),o(L.x,L.y-B*4*y*(1-y),L.z),.02)}}}t.clewed||t.courseClews.forEach((s,k)=>{const T=k%2?1:-1;_(e,s,o(T*i(s.z+5.5),c(s.z+5.5)+.2,s.z+5.5),.035,.5,.08),_(e,s,o(T*i(s.z-5),c(s.z-5)+.2,s.z-5),.035,.6,.08)}),t.faClews.forEach(s=>{if(Math.abs(s.x)<.01)return;const k=Math.max(s.z+4,-25.2);for(const T of[-1,1])_(e,s,o(T*Math.min(i(k)-.3,3.2),c(k)+.1,k),.028,T*s.x>0?.25:.8,.1)});const z=t.gaff[1],h=t.boom[1];_(e,r(t.gaff[0],z,.5),a.at(a.cross-.5,-.3),.03),_(e,r(t.gaff[0],z,.95),a.at(a.cross+.5,-.3),.03),_(e,r(t.boom[0],h,.97),a.at(a.cross-1.5,-.3),.028,.3,.05);for(const s of[-1,1])_(e,z,o(s*i(26.3),c(26.3)+.2,26.3),.026,.5,.14),_(e,r(t.boom[0],h,.8),o(s*.9,c0(K(26.6))+.3,26.6),.035,.1,.04);_(e,z,o(.4,c(27.5)+.2,27.5),.018,.25,.12);for(const s of t.masts)_(e,s.at(s.truck-.2,-.8),o(.5,c0(K(s.z))+1.2,s.z+.6),.016,0,.05,6)}function it(e){const t=new m.BufferGeometry;return t.setAttribute("position",new m.Float32BufferAttribute(e.p,3)),t.setAttribute("aO",new m.Float32BufferAttribute(e.o,3)),t.setAttribute("aA",new m.Float32BufferAttribute(e.a,4)),t.setIndex(e.idx),t}const x0="#include <fog_pars_vertex>",y0="#include <fog_pars_fragment>",ct=`
attribute vec3 aCol; attribute vec4 aAux;      // aux: material, sea-light occlusion, u, v
uniform float uMsTime;
varying vec3 vN, vW, vC, vL; varying vec4 vAux;
${x0}
void main(){
  vec3 p = position;
  if (aAux.x > 2.5) { float w = aAux.z; p.x += w*0.05*sin(uMsTime*0.8 + position.z*3.0); p.z += w*0.04*sin(uMsTime*0.6 + position.x*2.0); }
  vec4 wp = modelMatrix*vec4(p, 1.0);
  vW = wp.xyz; vL = p; vC = aCol; vAux = aAux; vN = mat3(modelMatrix)*normal;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ft=`
${f0}
${u0}
uniform float uBoot, uHawseU;
varying vec3 vN, vW, vC, vL; varying vec4 vAux;
${y0}
void main(){
  vec2 uv = vAux.zw; vec2 fw = fwidth(uv) + 1e-4;
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) N = -N;
  float mat = vAux.x; float hullM = step(0.5, mat)*(1.0 - step(1.5, mat));
  vec3 alb = vC;
  float h = vW.y - uMsSeaY - msSwell(vW.xz);
  // plating: in-and-out strakes whose lower laps catch the light, butts, rivet rows
  float sv = uv.y/1.15, row = floor(sv), fr = sv - row, outS = mod(row, 2.0);
  float fadeP = 1.0 - smoothstep(0.12, 0.5, fw.y);
  float edge = min(fr, 1.0 - fr)*1.15;
  float lap = (1.0 - smoothstep(0.0, 0.05 + fw.y, edge))*fadeP;
  float bf = 3.2 - abs(fract((uv.x + row*2.7)/6.4) - 0.5)*6.4;
  float butt = (1.0 - smoothstep(0.0, 0.03 + fw.x, bf))*(1.0 - smoothstep(0.12, 0.5, fw.x));
  vec2 rv = vec2(fract(uv.x/0.24) - 0.5, (edge - 0.1)/0.24);
  float riv = (1.0 - smoothstep(0.13, 0.22, length(rv)))*(1.0 - smoothstep(0.03, 0.1, fw.x));
  float n1 = msN(uv*vec2(0.7, 1.6)), n2 = msN(uv*3.1 + 7.0), n3 = msN(vec2(uv.x*1.9, 3.0));
  // boot-top: verdigris copper, weed and barnacle beard at the waterline
  float cop = 1.0 - smoothstep(-0.04, 0.04, vL.y - uBoot - 0.06*sin(uv.x*0.9));
  vec3 verd = mix(vec3(0.03, 0.09, 0.075), vec3(0.11, 0.26, 0.2), n1)*(0.5 + 0.8*n2);
  float weed = (1.0 - smoothstep(0.0, 0.25 + 0.5*n3, abs(vL.y - 0.05)))*smoothstep(0.3, 0.6, msN(uv*vec2(5.0, 2.0)));
  // rust weeping from the hawse pipes and scuppers
  float hx = (mod(uv.x, 100.0) - uHawseU)/0.2;
  float rust = exp(-hx*hx)*smoothstep(1.6, 1.9, uv.y)*(1.0 - smoothstep(1.9, 6.5, uv.y));
  float sx = (abs(fract(uv.x/4.7) - 0.5)*4.7 - 0.0)/0.1; sx = 2.35/0.1 - sx;
  rust += 0.6*exp(-sx*sx*0.3)*smoothstep(1.25, 1.45, uv.y)*(1.0 - smoothstep(1.45, 3.2 + 2.0*n3, uv.y))*step(0.2, n3);
  vec3 hullAlb = alb*(0.9 + 0.22*outS*fadeP)*(0.85 + 0.3*n2)*(1.0 - 0.4*butt)*(1.0 + 0.45*riv);
  hullAlb = mix(hullAlb, vec3(0.2, 0.075, 0.03)*(0.6 + 0.8*n2), clamp(rust, 0.0, 1.0)*0.85);
  hullAlb = mix(hullAlb, verd, cop); hullAlb = mix(hullAlb, vec3(0.01, 0.028, 0.02), weed*0.85);
  alb = mix(alb, hullAlb, hullM);
  N = normalize(N + vec3(0.0, -1.0, 0.0)*hullM*(lap*(0.35 + 0.5*outS) + riv*0.25));
  vec3 col = alb*msUnder(N, vAux.y, vW.y - uMsSeaY);
  col += (alb*1.25 + vec3(0.008, 0.006, 0.004))*msLamps(vL, N, 0.06)*smoothstep(0.2, 1.2, h);     // lantern light: warm pools on deck, houses, mast feet
  // under water the light is the luminous top of the sea: the upper strakes and boot-top glow
  // verdigris-jade, and the light dies with depth and as the bilge turns away, down to a black keel
  float dep = clamp(-h, 0.0, 14.0);
  float upL = clamp(0.5 + 0.5*N.y, 0.0, 1.0);
  // (the glowing layer is the top 5 m of the sea: inside it the plating takes light from every side, so the bilge
  // turns from lit to dark round its curve; under it a little still comes down past the hull's sides)
  float subL = (exp(-dep/2.6)*(0.1 + 0.9*upL) + 0.045*exp(-dep/9.0)*(0.3 + 0.7*upL))*(0.82 + 0.3*msN(vW.xz*0.11 + uMsTime*0.015));
  vec3 sub = (alb + vec3(0.002, 0.006, 0.005))*uMsGlow*msGain(0.0)*subL*3.2;
  // seen from far off under water she is a black lens against the ceiling: the lit copper only shows on the close pass
  sub *= 1.0 - 0.82*smoothstep(44.0, 60.0, distance(cameraPosition, vW))*step(cameraPosition.y, uMsSeaY);
  col = mix(sub, col, smoothstep(-0.35, 0.0, h));
  // the wet strake and the moving jade lap line
  float wob = 0.07*sin(uv.x*2.1 + uMsTime*1.7) + 0.05*sin(uv.x*5.3 - uMsTime*2.6);
  float lapl = smoothstep(-0.1, 0.0, h)*(1.0 - smoothstep(0.1 + wob, 0.2 + wob, h));
  float wet = smoothstep(-0.05, 0.05, h)*(1.0 - smoothstep(0.2, 1.3, h));
  col += hullM*uMsGlow*msGain(0.0)*(lapl*0.55*(0.7 + 0.3*sin(uv.x*9.0 + uMsTime*3.1)) + wet*0.03);
  if (mat > 1.5 && mat < 2.5) col = vC*4.0;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,I0=`
uniform float uRoll;
float msSailD(vec2 m, vec2 uv, vec4 sd, float ph){
  float u = uv.x, v = max(uv.y, 0.0), seed = sd.x, kind = sd.y, t = uRoll;
  float flagD = sd.z*pow(v, 0.8)*(0.34*sin(m.y*1.15 - t*3.1 + seed) + 0.14*sin(m.y*2.9 - t*5.3 + seed*2.0) + 0.5*v*sin(t + ph - v*2.4));
  float envV = pow(v, 0.7);
  float lf = 0.5 + 0.5*u;
  float pin = kind > 0.5 ? lf*(1.0 - 0.5*smoothstep(0.45, 1.0, u)) : 1.0 - 0.55*pow(abs(u), 6.0);      // (fore-and-aft: the folds ease toward the leech, so its edge hangs in a clean curve)
  float wob = 0.6*sin(v*2.3 + seed*5.0);
  float f = 0.16*sin(m.x*3.3 + seed*17.0 + wob) + 0.07*sin(m.x*5.9 + seed*31.0 - wob*1.7 + v*1.5) + 0.2*sin(m.x*1.45 + seed*7.0 + wob*0.5);
  f += step(0.5, kind)*(0.15*sin(m.x*2.1 + m.y*1.5 + seed*3.0) + 0.08*sin(m.x*4.3 - m.y*0.9 + seed*11.0));
  float sl = t + ph - v*1.3;
  float belly = sd.w*sin(3.14159*pow(v, 0.8))*(1.0 - 0.7*u*u)*(kind > 0.5 ? 0.55 + 0.75*sin(sl) : 0.68 + 0.62*sin(sl));
  float rip = 0.08*sin(v*11.0 - t*2.0 + m.x*0.6 + seed*3.0)*(0.4 + 0.6*cos(sl));
  float d = (f + rip)*sd.z*envV*pin + belly*(kind > 0.5 ? lf : 1.0);
  return kind > 1.5 ? flagD : d;
}`,ut=`
attribute vec2 aUV; attribute vec4 aMet; attribute vec3 aN; attribute vec3 aTu; attribute vec4 aSd; attribute vec2 aPh;
varying vec2 vUV, vPh; varying vec4 vMet, vSd; varying vec3 vN, vTu, vW;
${I0}
${x0}
void main(){
  float d = msSailD(aMet.xy, aUV, aSd, aPh.x);
  vec4 wp = modelMatrix*vec4(position + aN*d, 1.0);
  vUV = aUV; vPh = aPh; vMet = aMet; vSd = aSd; vW = wp.xyz;
  vN = mat3(modelMatrix)*aN; vTu = mat3(modelMatrix)*aTu;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,mt=`
${u0}
${I0}
uniform float uMsTime;
varying vec2 vUV, vPh; varying vec4 vMet, vSd; varying vec3 vN, vTu, vW;
${y0}
float msPatch(vec2 uvm, vec2 c, vec2 size, float fx){ vec2 q = abs(uvm - c) - size; return 1.0 - smoothstep(-fx, fx, max(q.x, q.y)); }
void main(){
  vec2 m = vMet.xy; float half_ = max(vMet.z, 0.05), drop = max(vMet.w, 0.3);
  float u = vUV.x, v = vUV.y, seed = vSd.x, kind = vSd.y;
  float fx = fwidth(m.x) + 1e-4, fy = fwidth(m.y) + 1e-4, fxy = max(fx, fy);
  float sq = 1.0 - step(0.5, kind), flg = step(1.5, kind);
  // normal of the folded cloth
  float e = 0.07, d0 = msSailD(m, vUV, vSd, vPh.x);
  float dx = (msSailD(m + vec2(e, 0.0), vUV + vec2(e/max(half_, 0.5), 0.0), vSd, vPh.x) - d0)/e;
  float dy = (msSailD(m + vec2(0.0, e), vUV + vec2(0.0, e/drop), vSd, vPh.x) - d0)/e;
  vec3 n0 = normalize(vN + vec3(1e-5, 0.0, 0.0)), tu = normalize(vTu + vec3(0.0, 0.0, 1e-5)), tv = cross(n0, tu);
  vec3 N = normalize(n0 - tu*dx - tv*dy);
  float face = dot(N, cameraPosition - vW) >= 0.0 ? 1.0 : -1.0;
  float sN = N.y*face;
  float lit = 2.0*max(0.5 - 0.5*sN, 0.7*(0.5 + 0.5*sN));           // thin canvas: the lit face shows through
  lit = clamp(1.0 + (lit - 1.0)*1.9, 0.4, 1.3);
  float sh = clamp(0.95 - 0.5*abs(dx) + 0.2*dx*face, 0.22, 1.1);  // fold flanks fall into shadow
  float foot = mix(mix(0.74, 1.0, v), mix(0.55, 1.0, pow(max(v, 0.0), 1.4)), sq);
  // cloths, seams, tabling, bolt rope
  float cl = m.x/0.6 + seed, fadeX = 1.0 - smoothstep(0.1, 0.32, fx);
  float sf = abs(fract(cl + 0.5) - 0.5)*0.6;
  float seam = (1.0 - smoothstep(0.018, 0.022 + fx, sf))*fadeX;
  float tone = 0.9 + 0.2*msH(vec2(floor(cl + 0.5), seed))*fadeX;
  float ex = (1.0 - abs(u))*half_, ey1 = (1.0 - v)*drop, eMin = min(ex, min(m.y*1.3, ey1));
  float tab = 1.0 - smoothstep(0.22, 0.25 + fxy, eMin);
  float bolt = 1.0 - smoothstep(0.035, 0.05 + fxy, min(ex, ey1));
  // reef bands and pattering reef points
  float hasReef = sq*step(0.5, vPh.y), y1 = drop*0.24, y2 = drop*0.42, fadeY = 1.0 - smoothstep(0.1, 0.3, fy);
  float band = max(1.0 - smoothstep(0.07, 0.09 + fy, abs(m.y - y1)), 1.0 - smoothstep(0.07, 0.09 + fy, abs(m.y - y2)))*hasReef;
  float ry = m.y - (m.y > y2 ? y2 : y1), cid = floor(cl);
  float pin = smoothstep(0.0, 0.03, ry)*(1.0 - smoothstep(0.42, 0.5, ry));
  float px = (fract(cl) - 0.5)*0.6 + 0.07*sin(uMsTime*2.6 + cid*1.7 + seed)*ry*2.0;
  float pts = (1.0 - smoothstep(0.014, 0.02 + fx, abs(px)))*pin*hasReef*fadeX;
  // buntlines drawn across the lit canvas
  float bu = u;
  float bd = min(abs(abs(bu) - 0.3), abs(abs(bu) - 0.66))*half_;
  float bunt = (1.0 - smoothstep(0.02, 0.03 + fx, bd))*sq*(1.0 - smoothstep(0.25, 0.7, fx));
  // patches and weathering
  vec2 uvm = vec2(u*half_, v*drop);
  vec2 c1 = vec2((msH(vec2(seed, 1.0))*1.3 - 0.65)*half_, (0.25 + 0.6*msH(vec2(seed, 2.0)))*drop);
  vec2 c2 = vec2((msH(vec2(seed, 3.0))*1.3 - 0.65)*half_, (0.2 + 0.7*msH(vec2(seed, 4.0)))*drop);
  float p1 = msPatch(uvm, c1, vec2(0.55, 0.8), fxy), p1i = msPatch(uvm, c1, vec2(0.49, 0.74), fxy);
  float p2 = msPatch(uvm, c2, vec2(0.9, 0.5), fxy), p2i = msPatch(uvm, c2, vec2(0.84, 0.44), fxy);
  float patchTone = (1.0 - 0.3*(p1 - p1i) - 0.14*p1i)*(1.0 - 0.3*(p2 - p2i) + 0.1*p2i);
  float stain = 0.86 + 0.2*msN(m*0.55 + seed*10.0) - 0.12*msN(vec2(m.x*2.6 + seed, m.y*0.22));
  float detail = (1.0 - 0.32*seam)*tone*(1.0 - 0.2*tab)*(1.0 - 0.5*bolt)*(1.0 - 0.28*band)*(1.0 - 0.55*pts)*(1.0 - 0.7*bunt)*patchTone*stain;
  // flags: darker bunting, the ensign with a canton
  float canton = flg*step(0.5, vPh.y)*step(u, 0.0)*step(v, 0.5);
  detail = mix(detail, (0.55 - 0.3*canton)*stain, flg);
  vec3 base = msSailCol(vW.y - uMsSeaY)*0.86*foot*lit*(0.92 + 0.16*msH(vec2(seed, 9.0)));
  vec3 col = mix(base*0.13 + vec3(0.002, 0.004, 0.008), base, sh)*detail;
  col += 0.36*detail*(0.55 + 0.45*sh)*msLamps(vW, N*face, 0.6);      // the lanterns warm the feet of the lower sails
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`,pt=`
attribute vec3 aO; attribute vec4 aA;      // other end of the segment; side, width * direction, sway, phase
uniform float uMsTime, uResY;
varying float vAl, vY;
${x0}
void main(){
  vec3 off = vec3(sin(uMsTime*0.9 + aA.w), 0.2*sin(uMsTime*1.3 + aA.w*2.0), cos(uMsTime*0.7 + aA.w*1.3))*aA.z;
  vec4 wp = modelMatrix*vec4(position + off, 1.0); vY = wp.y;
  vec4 mvPosition = viewMatrix*wp; vec4 mo = modelViewMatrix*vec4(aO + off, 1.0);
  float dist = max(-mvPosition.z, 0.05);
  vec2 dir = (mo.xy/max(-mo.z, 0.05) - mvPosition.xy/dist)*sign(aA.y);
  dir = dir/max(length(dir), 1e-6);
  float px = dist*2.0/(projectionMatrix[1][1]*max(uResY, 1.0));
  float w = abs(aA.y), ww = max(w, 1.5*px); vAl = w/ww;
  mvPosition.xy += vec2(-dir.y, dir.x)*aA.x*ww*0.5;
  gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ht=`
${u0}
varying float vAl, vY;
${y0}
void main(){
  float y = vY - uMsSeaY, occ = clamp((y - 4.5)/7.0, 0.12, 1.0);
  gl_FragColor = vec4(uMsGlow*msGain(y)*0.085*occ + uMsSky*0.1, vAl);
  #include <fog_fragment>
}`,dt=`
attribute vec2 aC; attribute vec3 aCol; uniform float uMsTime; varying vec2 vC; varying vec3 vCol;
void main(){
  vC = aC; vCol = aCol*(0.93 + 0.07*sin(uMsTime*6.3 + aCol.g*40.0));
  vec4 mv = modelViewMatrix*vec4(position, 1.0); mv.xy += aC*1.8;
  gl_Position = projectionMatrix*mv;
}`,vt=`
varying vec2 vC; varying vec3 vCol;
void main(){
  float r2 = dot(vC, vC), edge = 1.0 - smoothstep(0.55, 1.0, r2);
  gl_FragColor = vec4(vCol*(3.4*exp(-r2*90.0) + 1.1*exp(-r2*14.0) + 0.22*exp(-r2*3.2))*edge, 1.0);
}`,wt=`
${f0}
uniform float uMsSeaY;
varying vec3 vW; varying float vFade;
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.0);
  wp.y = uMsSeaY + msSwell(wp.xz) + 0.04;
  vW = wp.xyz;
  vFade = (1.0 - smoothstep(0.72, 1.0, abs(position.x)/75.0))*(1.0 - smoothstep(0.78, 1.0, abs(position.z - 14.0)/95.0));
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,xt=`
${f0}
${u0}
uniform mat4 uShipInv; uniform vec4 uSt0, uSt1; uniform vec3 uLampP, uLampS, uColP, uColS; uniform vec2 uGate; uniform float uRefl;
varying vec3 vW; varying float vFade;
vec2 msStack(vec3 q, vec3 R, vec4 st){
  float rz = abs(R.z) < 1e-3 ? 1e-3 : R.z, t = (st.x - q.z)/rz;
  vec3 hp = q + R*t;
  float f = clamp((hp.y - st.y)/max(st.z - st.y, 1.0), 0.0, 1.0), hw = mix(st.w, st.w*0.46, f);
  float mk = step(0.0, t)*(1.0 - smoothstep(hw - 2.5, hw + 1.5, abs(hp.x)))*smoothstep(st.y - 1.0, st.y + 1.0, hp.y)*(1.0 - smoothstep(st.z - 2.5, st.z + 0.5, hp.y));
  return vec2(mk, hp.y);
}
float msStreak(vec2 P, vec2 F, vec2 C, float t){
  vec2 d = C - F; d = d/max(length(d), 1e-3);
  vec2 r = P - F; float a = dot(r, d), b = dot(r, vec2(-d.y, d.x));
  b += (0.42*sin(a*0.9 - t*2.0) + 0.16*sin(a*2.7 + t*3.0))*clamp(a/15.0, 0.0, 1.0);
  float w = 0.42 + 0.045*max(a, 0.0);
  return exp(-b*b/(w*w))*smoothstep(0.2, 2.5, a)*(1.0 - smoothstep(12.0, 24.0, a))*(0.65 + 0.35*sin(a*4.0 - t*5.0));
}
void main(){
  vec3 q = (uShipInv*vec4(vW, 1.0)).xyz; float tt = uMsTime;
  // slick of calmer, darker water hugging the hull; dark wake band astern
  float f = pow(abs(q.x)/5.3, 2.2) + pow(abs(q.z + 0.3)/29.5, 2.6);
  float d = (pow(max(f, 1e-4), 0.42) - 1.0)*5.3;
  float nz = msN(vW.xz*0.35 + tt*0.05), nz2 = msN(vW.xz*1.3 - tt*0.1);
  float slick = 1.0 - smoothstep(0.0, 3.2 + 2.2*nz, d);
  float wz = q.z - 24.0, ww = 3.6 + 0.08*max(wz, 0.0);
  float wx = q.x + 1.5*sin(wz*0.07 + 1.0)*clamp(wz/30.0, 0.0, 1.0);
  float wake = exp(-wx*wx/(ww*ww))*smoothstep(0.0, 8.0, wz)*(1.0 - smoothstep(30.0, 58.0, wz))*(0.55 + 0.45*nz2);
  float dark = clamp(slick*0.62 + wake*0.42, 0.0, 0.8);
  // the sail stacks mirrored in rippled water (analytic: ray against each mast's sail plane)
  vec3 Vd = normalize(vW - cameraPosition);
  vec2 rp = vec2(sin(vW.x*2.1 + tt*1.4 + sin(vW.z*1.3)) + 0.6*sin(vW.x*4.7 - tt*2.1 + vW.z*3.3), sin(vW.z*1.9 - tt*1.2 + sin(vW.x*1.1)) + 0.6*sin(vW.z*5.1 + tt*1.8 - vW.x*2.7));
  vec3 Nw = normalize(vec3(rp.x*0.045, 1.0, rp.y*0.045));
  vec3 R = reflect(Vd, Nw); R.y = abs(R.y);
  vec3 Rs = mat3(uShipInv)*R;
  vec2 s0 = msStack(q, Rs, uSt0), s1 = msStack(q, Rs, uSt1);
  vec2 s = s0.x > s1.x ? s0 : s1;
  float rx = abs(Rs.x) < 1e-3 ? 1e-3 : Rs.x, tf = -q.x/rx; vec3 hp = q + Rs*tf;
  float jib = smoothstep(-46.0, -41.0, hp.z)*(1.0 - smoothstep(-17.5, -15.5, hp.z))*smoothstep(8.0, 9.5, hp.y)*(1.0 - smoothstep(-2.5, 0.0, hp.y - (9.5 + (hp.z + 46.0)*0.7)));
  float spk = smoothstep(19.5, 20.5, hp.z)*(1.0 - smoothstep(29.0, 31.5, hp.z))*smoothstep(7.2, 8.2, hp.y)*(1.0 - smoothstep(-1.5, 0.5, hp.y - (15.0 + (hp.z - 19.5)*0.55)));
  float faM = step(0.0, tf)*max(jib, spk)*0.75;
  float om = 1.0 - clamp(dot(-Vd, Nw), 0.0, 1.0), fres = 0.04 + 0.96*om*om*om*om*om;
  float above = step(uMsSeaY, cameraPosition.y);
  vec3 add = (msSailCol(s.y)*s.x + msSailCol(hp.y)*faM*(1.0 - s.x))*fres*uRefl*above;
  // sidelight streaks reach toward the eye
  add += (uColP*msStreak(vW.xz, uLampP.xz, cameraPosition.xz, tt)*uGate.x + uColS*msStreak(vW.xz, uLampS.xz, cameraPosition.xz, tt + 1.7)*uGate.y)*above;
  gl_FragColor = vec4(add*vFade, dark*vFade);
}`,yt=`
${f0}
uniform float uMsSeaY;
varying vec3 vW;
${x0}
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.0);
  wp.y = uMsSeaY + msSwell(wp.xz)*(1.0 - smoothstep(600.0, 1500.0, length(position.xz)));
  vW = wp.xyz;
  vec4 mvPosition = viewMatrix*wp; gl_Position = projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,bt=`
${u0}
uniform float uMsTime; uniform vec3 uLane;
varying vec3 vW;
${y0}
float msFbm(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a*msN(p); p = p*2.03 + 17.3; a *= 0.5; } return s; }
void main(){
  vec2 p = vW.xz; float t = uMsTime, dist = length(vW - cameraPosition);
  vec2 q = vec2(msFbm(p/210.0 + t*0.002), msFbm(p/210.0 + 5.2 - t*0.002));
  float f = msFbm(p/95.0 + 2.4*q + vec2(0.0, 3.1));
  float mask = smoothstep(0.43, 0.57, f)*(0.75 + 0.25*smoothstep(0.3, 0.7, msFbm(p/23.0 - q*1.5)));
  float cat = 1.0 - 0.3*smoothstep(0.5, 0.7, msFbm(p/55.0 + t*0.03 + 9.0));
  float near = 1.0 - smoothstep(60.0, 260.0, dist);
  float rip = 1.0 - 0.16*near*(msN(p*1.7 + vec2(t*0.6, 0.0)) + 0.6*msN(p*4.3 - vec2(0.0, t*0.9)) - 0.6);
  vec3 col = mix(uLane, uMsFoot*0.66, mask)*cat*rip*uMsWave.z;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;async function zt(e,t={}){const l=e.rng,v=e.quality?.detail??1,a=(Array.isArray(t.palette)&&t.palette.length>=7?t.palette:O0).map(S=>new m.Color(S)),r=(S,V,X)=>new m.Color().setRGB(S,V,X),i={iron:r(.042,.046,.052),iron2:r(.06,.062,.066),deck:r(.07,.06,.05),rail:r(.17,.15,.12),strake:r(.1,.105,.11),gilt:r(.5,.4,.2),board:r(.36,.33,.27),wood:r(.2,.14,.09),house:r(.42,.42,.4),boat:r(.62,.62,.58),canvas:r(.4,.38,.32),rudder:r(.016,.024,.022),mast:r(.5,.48,.42),mastDark:r(.12,.11,.1),spar:r(.36,.3,.2),figure:r(.025,.025,.03),red:a[6].clone(),green:new m.Color(t.starboardGreen||"#2BFF8A"),amber:r(.95,.5,.15),pane:r(.2,.1,.028)},c={uMsTime:{value:0},uMsGlow:{value:a[0].clone().lerp(a[1],.45).multiplyScalar(1.6)},uMsSky:{value:a[3].clone().multiplyScalar(.3)},uMsWave:{value:o(0,0,t.glow??1)},uMsFoot:{value:a[0].clone().lerp(a[1],.28)},uMsDusk:{value:a[4].clone()},uMsSeaY:{value:0},uRoll:{value:0},uMsWarm:{value:r(1,.47,.12)},uMsLamp:{value:[0,1,2,3].map(()=>new m.Vector4(0,-99,0,0))},uMsAmp:{value:t.swell===!1?0:typeof t.swell=="number"?t.swell:1}},M=()=>m.UniformsUtils.clone(m.UniformsLib.fog),w=(S,V,X={},o0={})=>new m.ShaderMaterial({vertexShader:S,fragmentShader:V,uniforms:{...M(),...c,...X},fog:!0,side:m.DoubleSide,...o0}),p=async()=>{e.yield&&await e.yield()},u=new m.Group;u.name="milky-sea-barque";const x=new m.Group;x.name="ship",u.add(x);const z=J0(l.fork("rig"),t);await p();const h=X0();await C0(h,i,z,l.fork("hull"),p),await p();const s=await et(h,i,z,l.fork("deck"),p);t.lanterns!==!1&&s.lamps.forEach((S,V)=>c.uMsLamp.value[V].copy(S)),await p(),await ot(h,i,z,p),await p();const k=R0(h);await p();const T=new m.Mesh(k,w(ct,ft,{uBoot:{value:l.range(.45,.85)},uHawseU:{value:z.hawseU||55}}));x.add(T),await e.yield?.();const d=at();await st(d,z,l.fork("sails"),v,p),await p();const D=nt(d);await p();const U=new m.Mesh(D,w(ut,mt));x.add(U),await e.yield?.();const I=rt();lt(I,z,l.fork("ropes")),await p();const P={uResY:{value:1080}},G=new m.Mesh(it(I),w(pt,ht,P,{transparent:!0,depthWrite:!1}));G.renderOrder=3,G.frustumCulled=!1,x.add(G),await p();const B=z.lamp(-1),y=z.lamp(1),L=[],q=[],f=[],g=[[B,i.red],[y,i.green],...s.lamps.map(S=>[S,r(.62,.3,.085)])];for(const[S,V]of g)for(const X of[[-1,-1],[1,-1],[1,1],[-1,1]])L.push(S.x,S.y,S.z),q.push(X[0],X[1]),f.push(V.r,V.g,V.b);const F=new m.BufferGeometry;F.setAttribute("position",new m.Float32BufferAttribute(L,3)),F.setAttribute("aC",new m.Float32BufferAttribute(q,2)),F.setAttribute("aCol",new m.Float32BufferAttribute(f,3)),F.setIndex(g.flatMap((S,V)=>[0,1,2,0,2,3].map(X=>V*4+X)));const N=new m.Mesh(F,new m.ShaderMaterial({vertexShader:dt,fragmentShader:vt,uniforms:{uMsTime:c.uMsTime},transparent:!0,depthWrite:!1,blending:m.AdditiveBlending}));N.renderOrder=4,N.frustumCulled=!1,x.add(N),await e.yield?.();const Y=z.masts[0],A=z.masts[1],H={uShipInv:{value:new m.Matrix4},uSt0:{value:new m.Vector4(Y.z-.5,8,Y.truck-.5,11.4)},uSt1:{value:new m.Vector4(A.z-.5,7.5,A.truck-.5,11.6)},uLampP:{value:B.clone()},uLampS:{value:y.clone()},uColP:{value:i.red.clone().multiplyScalar(3.5)},uColS:{value:i.green.clone().multiplyScalar(2.2)},uGate:{value:new m.Vector2(1,1)},uRefl:{value:.5}};let e0=null;if(t.contact!==!1){const S=new m.PlaneGeometry(150,190,38,48);S.rotateX(-Math.PI/2),S.translate(0,0,14),e0=new m.Mesh(S,new m.ShaderMaterial({vertexShader:wt,fragmentShader:xt,uniforms:{...c,...H},side:m.DoubleSide,transparent:!0,depthWrite:!1,blending:m.CustomBlending,blendEquation:m.AddEquation,blendSrc:m.OneFactor,blendDst:m.OneMinusSrcAlphaFactor,blendSrcAlpha:m.ZeroFactor,blendDstAlpha:m.OneFactor,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2})),e0.renderOrder=2,e0.frustumCulled=!1,u.add(e0)}await p();let s0=null;if(t.sea!==!1){const S=[0];for(let J=1;J<=44;J++)S.push(J*2.5);for(;S[S.length-1]<3200;)S.push(S[S.length-1]*1.17);const V=72,X=[],o0=[];S.forEach(J=>{for(let n0=0;n0<V;n0++){const l0=n0/V*Math.PI*2;X.push(Math.cos(l0)*J,0,Math.sin(l0)*J)}});for(let J=0;J<S.length-1;J++)for(let n0=0;n0<V;n0++){const l0=J*V+n0,z0=J*V+(n0+1)%V;o0.push(l0,z0,l0+V,z0,z0+V,l0+V)}const r0=new m.BufferGeometry;r0.setAttribute("position",new m.Float32BufferAttribute(X,3)),r0.setIndex(o0),s0=new m.Mesh(r0,w(yt,bt,{uLane:{value:a[2].clone().lerp(a[1],.22)}})),s0.frustumCulled=!1,s0.renderOrder=-.5,u.add(s0)}const W0=(t.rollDeg??4)*Math.PI/180,A0=l.range(0,6.28);let b0=null;const G0=new m.Vector2,M0=o(0,0,0);function N0(S,V,X){c.uMsTime.value=V;const o0=b0!==null?b0:V*a0.w1+A0;c.uRoll.value=o0,u.updateWorldMatrix(!0,!1);const r0=u.matrixWorld.elements;c.uMsSeaY.value=r0[13],x.position.y=.8*c.uMsAmp.value*_0(r0[12],r0[14],V),x.rotation.set(W0*.25*Math.sin(o0*.83+1.1),0,W0*(Math.sin(o0)+.1*Math.sin(2.3*o0+1))),u.updateMatrixWorld(!0),H.uShipInv.value.copy(x.matrixWorld).invert(),H.uLampP.value.copy(B).applyMatrix4(x.matrixWorld),H.uLampS.value.copy(y).applyMatrix4(x.matrixWorld),X&&(M0.setFromMatrixPosition(X.matrixWorld).applyMatrix4(H.uShipInv.value),H.uGate.value.set($(1.5,5,-M0.x),$(1.5,5,M0.x))),e.renderer&&(e.renderer.getDrawingBufferSize(G0),P.uResY.value=G0.y)}N0(0,0,null);const D0=S=>o(S[0],S[1],S[2]),U0={portalSeat:{position:o(0,7.2,-146),normal:o(0,0,1),radius:7},flyThrough:[[-20,0,36],[-19,10,16],[-17,20,0],[-6,25,-5.5],[8,28,-5.5],[25.9,32.8,-.9],[36.5,36.6,10.4],[40,42,35.4],[40,44.1,46.35],[36.8,45.5,54.1],[29,46.9,57.35],[21.2,48.1,54.1],[18,49.2,46.35],[15.5,51.5,22.3],[12.5,52,10],[10,48.5,-13],[6.6,29,-45],[1.8,10.2,-75],[0,7.5,-91],[0,7.2,-114],[0,7.2,-146]].map(D0),slot:{center:o(0,26.5,-5.5),halfGap:7},viewpoints:{underKeel:o(-36,-12,64),surfaceBreak:o(-20,.6,36),portSide:o(-19,10,16),slot:o(-6,25,-5.5),quarter:o(40,42,35.4),top:o(12.5,52,10),bowsprit:o(0,30,-50)},trucks:z.masts.map(S=>S.at(S.truck,-.8)),mainTop:o(0,18,3),foredeck:o(0,10,-10),sidelights:{port:B.clone(),starboard:y.clone()},lamps:s.lamps.map(S=>o(S.x,S.y,S.z)),hawse:Q(.945,.86,o(0,0,0)).multiply(o(-1,1,1)),stern:o(0,5.6,28),stem:o(0,7,-28.5),jibBoomEnd:z.jibboom[1].clone(),keel:o(0,i0,0),helm:s.helm,lookout:s.lookout,railHands:s.hands,pennantTip:z.pennant.tip,wakeEnd:o(0,0,80),waterline:{length:53,beam:10}},q0=30,E0=46,Y0=o(0,19,-3);return{object:u,ship:x,radius:q0,height:E0,center:Y0,anchors:U0,update:N0,setRollPhase(S){b0=S??null},setGlow(S){c.uMsWave.value.z=S},setGlowWave(S,V){c.uMsWave.value.x=S,c.uMsWave.value.y=V},swellHeight:_0,swellGLSL:f0,uniforms:c,clewed:z.clewed,toWorld(S,V=o(0,0,0)){return V.copy(S).applyMatrix4(x.matrixWorld)},dispose(){},ground:!s0,groundY:-.3}}export{zt as buildHero};
