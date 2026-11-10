import*as r from"three";import{clamp as Oe,lerp as P,smoothstep as k}from"../kit/core.js";const qt=["#2f6fe0","#9fd8ff","#fff3e0","#ff8fb0","#2fb89a","#6a4a8a","#ffd23f"],H=Math.PI*2,xt=200,bt=12,Dt=7.8,I=8,ue=10,G=240,mo=640,po=400,Wt=z=>z-H*Math.round(z/H),_e=`
float h11(float n){ return fract(sin(n * 127.1) * 43758.5453); }
float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
float fb2(vec2 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + 17.1; a *= 0.5; } return s / 0.9375; }
float h31(vec3 p){ p = fract(p * vec3(0.1031, 0.1030, 0.0973)); p += dot(p, p.yzx + 33.33); return fract((p.x + p.y) * p.z); }
float vn3(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(h31(i), h31(i + vec3(1,0,0)), f.x), mix(h31(i + vec3(0,1,0)), h31(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h31(i + vec3(0,0,1)), h31(i + vec3(1,0,1)), f.x), mix(h31(i + vec3(0,1,1)), h31(i + vec3(1,1,1)), f.x), f.y), f.z); }
float fb3(vec3 p){ float a = 0.5, s = 0.0; for (int i = 0; i < 3; i++) { s += a * vn3(p); p = p * 2.07 + 11.3; a *= 0.5; } return s / 0.875; }
// the flowered drifts of a meadow: a few lobes 8 to 20 m across where the flowers thicken, each breaking up toward its edge into
// loose clumps 3 to 4 m across and single plants, with green still showing inside it (two finer turns of the same field, three
// and eight times as fine). Sines only, so the same field can be worked out on the CPU (driftAt below, kit.meadowTint; no
// grass takes it now: the blades keep the turf's own colour). fpx = metres of ground under a pixel: the finer turns go before they alias.
// A drift's edge is a clear line with clumps along it, 0.12 of the field's range wide as live's edge is, not a wash of half flower,
// half turf; and never thinner than a pixel and a half (h grows with the field's change across a pixel), so far off it softens
// and does not crawl as the eye moves
float driftF(vec2 p, float fpx){
  vec2 q = vec2(0.8 * p.x + 0.6 * p.y, 0.8 * p.y - 0.6 * p.x);
  float a = q.x * 0.13 + 1.4 * sin(q.y * 0.057 + 1.0) + 0.6, b = q.y * 0.115 + 1.4 * sin(q.x * 0.049 + 2.0) + 2.1;
  float c = sin(q.x * 0.31 + 1.1 * sin(q.y * 0.19 + 0.7)) * sin(q.y * 0.27 + 1.1 * sin(q.x * 0.23 + 3.0));
  float d = sin(q.x * 0.93 + 1.3 * sin(q.y * 0.57 + 1.9)) * sin(q.y * 0.81 + 1.3 * sin(q.x * 0.69 + 0.4));
  float e = sin(q.x * 2.6 + 1.7 * sin(q.y * 1.4 + 2.2)) * sin(q.y * 2.3 + 1.7 * sin(q.x * 1.9 + 5.1));
  float f = 0.5 + 0.34 * sin(a) * sin(b) + 0.13 * c + 0.17 * d * (1.0 - smoothstep(0.9, 2.6, fpx)) + 0.1 * e * (1.0 - smoothstep(0.3, 0.9, fpx));
  float h = max(0.06, 0.75 * fwidth(f));
  return smoothstep(0.74 - h, 0.74 + h, f);
}
`;function vo(z,v){const c=.8*z+.6*v,g=.8*v-.6*z,u=c*.13+1.4*Math.sin(g*.057+1)+.6,T=g*.115+1.4*Math.sin(c*.049+2)+2.1,J=Math.sin(c*.31+1.1*Math.sin(g*.19+.7))*Math.sin(g*.27+1.1*Math.sin(c*.23+3)),re=Math.sin(c*.93+1.3*Math.sin(g*.57+1.9))*Math.sin(g*.81+1.3*Math.sin(c*.69+.4)),Z=Math.sin(c*2.6+1.7*Math.sin(g*1.4+2.2))*Math.sin(g*2.3+1.7*Math.sin(c*1.9+5.1));return k(.68,.8,.5+.34*Math.sin(u)*Math.sin(T)+.13*J+.17*re+.1*Z)}const It=.75;function Ne(){return{p:[],c:[],m:[],idx:[],n:0}}function go(z,v,c){const g=new r.BufferGeometry;return g.setAttribute("position",new r.Float32BufferAttribute(z.p,3)),g.setAttribute("color",new r.Float32BufferAttribute(z.c,3)),g.setAttribute(v,new r.Float32BufferAttribute(z.m,c)),g.setIndex(z.idx),g}async function Et(z,v){const c=z.attributes.position.array,g=z.index.array,u=c.length,T=new Float32Array(u);for(let b=0;b<g.length;b+=3){v&&b%3e3===0&&b&&await v(.3);const B=g[b]*3,O=g[b+1]*3,L=g[b+2]*3,ee=c[O]-c[B],me=c[O+1]-c[B+1],Re=c[O+2]-c[B+2],ie=c[L]-c[B],we=c[L+1]-c[B+1],pe=c[L+2]-c[B+2],Q=me*pe-Re*we,se=Re*ie-ee*pe,He=ee*we-me*ie;T[B]+=Q,T[B+1]+=se,T[B+2]+=He,T[O]+=Q,T[O+1]+=se,T[O+2]+=He,T[L]+=Q,T[L+1]+=se,T[L+2]+=He}v&&await v();let J=1/0,re=1/0,Z=1/0,_=-1/0,q=-1/0,E=-1/0;for(let b=0;b<u;b+=3){v&&b%9e3===0&&b&&await v(1.2);const B=Math.sqrt(T[b]*T[b]+T[b+1]*T[b+1]+T[b+2]*T[b+2])||1;T[b]/=B,T[b+1]/=B,T[b+2]/=B;const O=c[b],L=c[b+1],ee=c[b+2];O<J&&(J=O),O>_&&(_=O),L<re&&(re=L),L>q&&(q=L),ee<Z&&(Z=ee),ee>E&&(E=ee)}z.setAttribute("normal",new r.BufferAttribute(T,3)),v&&await v();const oe=(J+_)/2,ae=(re+q)/2,A=(Z+E)/2;let f=0;for(let b=0;b<u;b+=3){const B=c[b]-oe,O=c[b+1]-ae,L=c[b+2]-A,ee=B*B+O*O+L*L;ee>f&&(f=ee)}return z.boundingSphere=new r.Sphere(new r.Vector3(u?oe:0,u?ae:0,u?A:0),u?Math.sqrt(f):0),z}async function nt(z,v,c,g){if(!g)return Et(go(z,v,c),null);const u=new r.BufferGeometry;return u.setAttribute("position",new r.Float32BufferAttribute(z.p,3)),await g(1.3),u.setAttribute("color",new r.Float32BufferAttribute(z.c,3)),await g(1),u.setAttribute(v,new r.Float32BufferAttribute(z.m,c)),u.setIndex(z.idx),await g(2),Et(u,g)}function Pe(z,v,c,g,u,T,J){const re=u?c:c-1,Z=T?g:g-1;for(let _=0;_<Z;_++)for(let q=0;q<re;q++){const E=(q+1)%c,oe=(_+1)%g,ae=v+_*c+q,A=v+_*c+E,f=v+oe*c+E,b=v+oe*c+q;J?z.idx.push(ae,A,f,ae,f,b):z.idx.push(ae,f,A,ae,b,f)}}async function xo(z,v={}){const c=z.rng.fork("crown-island"),g=z.noise,u=v.pause||(()=>z.yield()),T=v.rest||(()=>z.yield()),J=(v.palette&&v.palette.length>=5?v.palette:qt).map(e=>new r.Color(e));for(;J.length<7;)J.push(new r.Color(qt[J.length]));const[re,Z,_,q,E,oe,ae]=J,A=new r.Color,f={o:[c.range(0,90),c.range(0,90),c.range(0,90),c.range(0,90),c.range(0,90),c.range(0,90)],keelD:c.range(238,266),keelPow:c.range(.7,.95),tipX:c.range(-34,34),tipZ:c.range(-34,34),hum:c.range(.8,1.25),spH:c.range(57,66),spW:c.range(17.5,20),spLean:c.range(4,9)*c.sign(),sh:c.range(.42,.66),shW:c.range(8,12),strata:c.range(.13,.19),warm:c.range(0,1)};f.shX=-Math.sign(f.spLean)*c.range(8,12);const b=[];for(let e=0;e<bt;e++)b.push({a:Wt((e+.5)*H/bt+c.range(-.02,.02)),w:c.range(22,28),seed:c.range(0,50)});function B(e,o){let t=0;const a=1+1.5*k(188,154,o);for(const n of b){const i=Math.abs(Wt(e-n.a))*xt,s=n.w*.5*a;i<s*1.3+2&&(t=Math.max(t,1-k(s*.8,s*1.3+2,i)))}return t}function O(e,o){const t=Math.sin(o)*e,a=Math.cos(o)*e,n=151+5*g.fbm2(t*.012+f.o[0],a*.012+f.o[1],3);let i=2.8+f.hum*(2.4*g.fbm2(t*.021+f.o[2],a*.021,4)+4.2*Math.max(0,g.fbm2(t*.008+f.o[3],a*.008+5,3)));return i=Math.max(1.3,i)+1.5*k(185,197,e),a>0&&(i=P(i,Math.min(i,2.4),1-k(12,30,Math.abs(t)))),-5+(5+i)*k(-6,12,e-n)}function L(e,o){const t=O(e,o),a=B(o,e);return P(t,Math.min(t,-2.2),a)}function ee(e){const o=Oe((-46-e)/(f.keelD-46),0,1);return 80*Math.pow(1-o,f.keelPow)+118*Math.pow(1-Oe((-10-e)/38,0,1),2.2)}const me=48,Re=[];{const e=[];let t=0;for(let n=0;n<=600;n++){const i=P(-10,-f.keelD,n/600),s=ee(i);n&&(t+=Math.hypot(s-e[n-1].r,i-e[n-1].y)),e.push({r:s,y:i,s:t})}let a=1;for(let n=0;n<=me;n++){const i=t*Math.pow(n/me,1.08);for(;a<600&&e[a].s<i;)a++;const s=e[a-1],l=e[a],d=Oe((i-s.s)/Math.max(1e-6,l.s-s.s),0,1),p=l.r-s.r,M=l.y-s.y,h=Math.hypot(p,M)||1;Re.push({r:P(s.r,l.r,d),y:P(s.y,l.y,d),s:i,nr:-M/h,ny:p/h})}}const ie=new Float32Array(G);for(let e=0;e<G;e++){const o=e/G*H;ie[e]=o-.62/12*Math.sin(12*o-Math.PI)}const we=[132,140,146,150,153,156,159,163,168,174,180,186,191,195,198,199.6],pe=[[200.9,.2],[201.3,.5],[200.5,.8]],Q=Ne(),se=(e,o,t,a)=>{const n=.5+.5*g.fbm3(e*.013+f.o[4],o*.02,t*.013,3);return a.copy(oe).lerp(_,.3+.32*n),a.r*=1+.12*f.warm,a.b*=1-.1*f.warm,a},He=v.turfGain??1,rt=(e,o,t)=>{const a=.5+.5*g.fbm2(e*.03+f.o[5],o*.03,3);return t.copy(E).multiplyScalar(.62+.4*a),t.g+=.03*(1-a),t.r+=.02,t.b+=.05,t.multiplyScalar(He)},Ot=(v.flowerColor?new r.Color(v.flowerColor):ae.clone()).multiplyScalar(.85),Nt=(e,o,t)=>t.lerp(Ot,It*vo(e,o)),ve=(e,o,t,a,n,i,s)=>{e.p.push(o,t,a),e.c.push(n.r,n.g,n.b),e.m.push(i,s),e.n++};for(let e=0;e<we.length;e++)for(let o=0;o<G;o++){o%60===0&&await u(.7);const t=we[e],a=ie[o],n=Math.sin(a)*t,i=Math.cos(a)*t,s=L(t,a),l=B(a,t);let d=Math.max(k(197.2,199.6,t),l,k(.4,-.6,s)*.6);rt(n,i,A),s<.9&&A.lerp(_,.55*k(.9,.1,s)).multiplyScalar(P(1,.55,k(.2,-1.5,s))),d>.5&&se(n,s,i,A).multiplyScalar(l>.3?.6:1),ve(Q,n,s,i,A,d,1)}await u();for(let e=0;e<pe.length;e++)for(let o=0;o<G;o++){o%80===0&&await u(1.4);const t=ie[o],a=Math.sin(t),n=Math.cos(t),i=L(199.6,t),s=pe[e][1],l=P(i,-10,s),d=pe[e][0]+1.3*g.n3(a*60,l*.3,n*60);se(a*d,l,n*d,A),n>.8&&A.lerp(_,.65*k(.8,.9,n)),ve(Q,a*d,l,n*d,A,1,1)}const kt=new Float64Array(G);for(let e=0;e<G;e++)e%60===0&&await u(.2),kt[e]=g.ridged2(Math.sin(ie[e])*5.5+f.o[3],Math.cos(ie[e])*5.5+f.o[5],3);for(let e=0;e<=me;e++)for(let o=0;o<G;o++){o%60===0&&await u();const t=Re[e],a=ie[o],n=Math.sin(a),i=Math.cos(a),s=Oe((-46-t.y)/(f.keelD-46),0,1),l=k(0,14,t.s),d=n*t.r,p=i*t.r;let h=P(4.5,17,k(-22,-70,t.y))*(1-.6*s*s)*g.fbm3(d*.011+f.o[0],t.y*.011,p*.011+f.o[1],4)+3.2*g.fbm3(d*.05,t.y*.05+f.o[2],p*.05,3);h+=3*Math.sin(t.y*.33+3*g.n2(a*2,t.y*.02))*k(-44,-64,t.y)*(1-s);const S=kt[o],m=k(-10.3,-13,t.y)*k(-78,-44,t.y);h+=16*(S-.35)*m,h*=l;const R=Math.max(.6,t.r+t.nr*h),F=t.y+t.ny*h*(t.y>-40?1:.5),w=n*R+f.tipX*s*s,x=i*R+f.tipZ*s*s;se(w,F,x,A);const V=P(1,.62,k(150,86,t.r)*k(-80,-30,t.y))*(1-.3*k(.5,.14,S)*m);ve(Q,w,F,x,A,1,V)}await u(),Pe(Q,0,G,we.length+pe.length+me+1,!0,!1,!1),await T();const Yt=(we.length+pe.length)*G,ze=(e,o,t)=>{const a=(Yt+e*G+(o%G+G)%G)*3;return t.set(Q.p[a],Q.p[a+1],Q.p[a+2])};await z.yield();function it(e,o,t,a,n,i,s,l,d,p=12,M=8,h=0){const S=e.n,m=1.1/Math.max(n,s),R=-1+.5*h,F=h*Math.sin(o*1.7),w=h*Math.cos(a*1.3);for(let x=0;x<M;x++)for(let V=0;V<p;V++){const C=x/(M-1)*Math.PI,D=V/p*H;let U=Math.cos(C);const ke=Math.sin(C)*P(1,(h+(1-h)*Math.pow((U+1)/2,.8))*1.35,l)*(x===M-1?0:1),Se=ke*Math.sin(D),Me=ke*Math.cos(D);l&&h>0&&U<R&&(U=R+.25*(Se*F+Me*w));const Ce=(1+(l?.55:.42)*g.fbm3(o*.37+Se*n*m,t*.37+U*1.2,a*.37+Me*s*m,3))*(l?1+.16*g.n3(o+Se*2.9,t*.2+U*i*.55,a+Me*2.9):1),ge=o+Se*n*Ce,at=t+U*i*(l?1:Ce),Gt=a+Me*s*Ce;ve(e,ge,at,Gt,se(ge,at,Gt,A).multiplyScalar(d),1,d)}Pe(e,S,p,M,!0,!1,!1)}const Fe=c.fork("fangs"),W=new r.Vector3,jt=new r.Vector3;for(let e=0;e<78;e++){await u();const o=Fe.int(4,me-8),t=Fe.int(0,G-1);ze(o,t,W);const a=Math.hypot(W.x,W.z),n=k(150,95,a),i=Fe.range(5,12)+n*Fe.range(2,24),s=Fe.range(1.6,3.4)+n*Fe.range(.5,3.6);it(Q,W.x,W.y-i*.72,W.z,s,i,s,1,P(.95,.72,n),12,9,e*7%5<3?.14+.07*(e*3%5):0)}await u();const Kt=await nt(Q,"aMix",2,u);await T();const Ut=e=>f.spW*Math.pow(Oe(1-(e+5)/(f.spH+5),0,1),.75)+5*Math.exp(-(e+5)/6),Xt=e=>f.spLean*Math.pow(Math.max(e,0)/f.spH,2),St=f.spH*f.sh,Zt=Math.sign(f.shX),Ye=(e,o)=>o<-6||o>f.spH?!1:Math.abs(e-Xt(o))<Ut(o)?!0:o<St?Math.abs(e-f.shX-Zt*.36*Math.max(o,0))<f.shW*Math.pow(1-(o+5)/(St+5),.7):!1,le=128,st=64,je=new Float32Array(le);for(let e=0;e<le;e++){e%4===0&&await u();const o=e/le*H,t=Math.sin(o),a=Math.cos(o);let n=I+2;for(let l=I+2;l<92;l+=.5)Ye(t*l,ue+a*l)&&(n=l);let i=n,s=n+.5;for(let l=0;l<8;l++){const d=(i+s)/2;Ye(t*d,ue+a*d)?i=d:s=d}je[e]=Math.max(i,I+5)}for(let e=0;e<2;e++){const o=je.slice();for(let t=0;t<le;t++)je[t]=.25*o[(t+le-1)%le]+.5*o[t]+.25*o[(t+1)%le]}const Ge=Ne(),lt=new r.Vector3(0,0,0);for(let e=0;e<le;e++){await u(.6);for(let o=0;o<st;o++){const t=e/le*H,a=Math.sin(t),n=Math.cos(t),i=o/st*H,s=Math.cos(i),l=Math.sin(i),d=je[e]-I,p=Math.sign(s)*Math.pow(Math.abs(s),.85),M=Math.sign(l)*Math.pow(Math.abs(l),.8);let h=I+d*Math.pow(.5+.5*p,1.6),S=a*h,m=ue+n*h,F=P(10.5,2,Math.pow(k(-6,f.spH,m),.8))*(1+.2*g.n2(S*.06+f.o[3],m*.06))*M,w=2.3*g.fbm3(S*.05+f.o[4],m*.05,F*.05+f.o[5],4)+.8*g.fbm3(S*.21,m*.21+f.o[0],F*.21,2)+.7*Math.sin(m*1.05+2.5*g.n3(S*.04,m*.04,F*.04));const x=k(I+3.2,I+.3,h);w*=1-.75*x,h+=s*(s<0?-Math.abs(w):w),S=a*h,m=ue+n*h,F+=l*w*.8,se(S,m,F,A).multiplyScalar(P(.5,1,k(.2,2.4,m))*P(1,.5,k(I+2.6,I+.4,h))),ve(Ge,S,m,F,A,1,P(1,.72,x)),m>lt.y&&lt.set(S,m,F)}}await u(),Pe(Ge,0,st,le,!0,!0,!0),await u(2.5);const ne=c.fork("skerries"),Qt=ne.int(6,10);for(let e=0;e<Qt;e++){const o=ne.range(0,H),t=e<3?ne.range(30,50):ne.range(64,138);let a=Math.sin(o)*t,n=Math.cos(o)*t;Math.abs(a)<34&&(a=(a<0?-1:1)*ne.range(36,60));const i=ne.range(1.6,3.8)*(e<3?1.35:1);it(Ge,a,i*.25,n,i*ne.range(.9,1.5),i*ne.range(.9,2.1),i*ne.range(.9,1.5),0,1,14,9),ne.chance(.6)&&it(Ge,a+i*1.4,i*.05,n+ne.range(-i,i),i*.6,i*.7,i*.7,0,1),await u()}await u();const qe=await nt(Ge,"aMix",2,u);await u();{const e=qe.attributes.position,o=qe.attributes.normal,t=qe.attributes.color,a=qe.attributes.aMix;for(let n=0;n<e.count;n++){n%100===0&&await u(.5);const i=e.getX(n),s=e.getY(n),l=Math.hypot(i,s-ue),d=k(I+1.4,I+2.6,l)*k(I+9,I+4,l)*k(-.15,.35,g.fbm2(i*.16+f.o[2],s*.16+f.o[4],3)+.25*o.getY(n)),p=Math.max(k(.62,.9,o.getY(n))*k(1.5,4,s),.8*d*k(1.5,4,s));p<=0||(rt(e.getX(n)*4,e.getZ(n)*4,A),t.setXYZ(n,P(t.getX(n),A.r,p),P(t.getY(n),A.g,p),P(t.getZ(n),A.b,p)),a.setX(n,1-.85*p))}}await u();const Mt=new r.Vector3(-.5,.57,.65).normalize(),$t=(e,o)=>e?(e.isVector3?e.clone():new r.Vector3(e[0],e[1],e[2])).normalize():o.clone(),Ct=v.portalGlow??1,y={uTime:{value:0},uSun:{value:$t(v.sunDir,Mt)},uSunCol:{value:new r.Color(v.sunColor||"#fff1d6")},uSkyTop:{value:new r.Color(v.skyTop||re)},uSkyHor:{value:new r.Color(v.skyHorizon||Z)},uLakeHor:{value:new r.Color(v.lakeHorizon||v.skyHorizon||Z)},uLakeGain:{value:v.lakeGain??1},uBounceA:{value:Z.clone()},uBounceB:{value:q.clone()},uBounce:{value:v.bounce??1},uPortalCol:{value:new r.Color(v.portalColor||"#fff0c8")},uPortalGlow:{value:Ct},uPortalPos:{value:new r.Vector3(0,ue,0)},uFlower:{value:v.flowerColor?new r.Color(v.flowerColor):ae.clone()},uStrata:{value:f.strata},uRock:{value:oe.clone().lerp(_,.3).lerp(q,.12)},uShallow:{value:E.clone().lerp(Z,.35)},uDeep:{value:re.clone().multiplyScalar(.5).lerp(E,.25)},uWhite:{value:_.clone().lerp(new r.Color(1,1,1),.85)},uCloudShade:{value:new r.Color(v.cloudShade||"#7f96e2")},uSpire:{value:new r.Vector4(f.spH,f.spW,f.spLean,0)},uMist:{value:v.mist??1}},Ke=()=>r.UniformsUtils.clone(r.UniformsLib.fog),Jt={value:0},Pt=e=>{const o=new r.MeshStandardMaterial({vertexColors:!0,roughness:.93,metalness:0});return o.onBeforeCompile=t=>{for(const a of["uBounceA","uBounceB","uBounce","uPortalCol","uPortalGlow","uPortalPos","uFlower","uStrata"])t.uniforms[a]=a==="uPortalGlow"&&!e?Jt:y[a];t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aMix; varying vec2 vMix; varying vec3 vLP;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vMix = aMix; vLP = position;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
`+_e+`
        uniform vec3 uBounceA, uBounceB, uPortalCol, uPortalPos, uFlower; uniform float uBounce, uPortalGlow, uStrata;
        varying vec2 vMix; varying vec3 vLP; float gH;
        // ROCK NEAR THE EYE. liveRock() is the rock pattern of the live version (eval4), its lines letter for letter: every
        // stratum has its own tone and every joint is a full dark line along its whole length; the grain is three octaves of
        // lozenges (3 m by 1.05 m, 1.5 m by 0.5 m, 0.7 m by 0.25 m: brickwork between the joints) at full strength; the
        // close-range grain (cells 53 cm by 29 cm, three octaves) is in full within 26 m and gone by 80 m; radial ribs lie on
        // every face that looks down, a keel's flank included. Nothing in it is faded, swapped or left out by the size of a
        // pixel: only by distance in metres. It is the whole of the rock nearer than 49 m and has a falling share of it from
        // 49 m out to 98 m (THE HAND-OVER in the block below); beyond 98 m it is not drawn, so its own far fades (the grain
        // from 260 m, the strata from 350 m) never come into play. (P, sid, sf, vd, mott and the three weights of side,
        // ceiling and top come from the block below: the strata are laid by the same coordinates in both patterns.)
        void liveRock(vec3 P, float sid, float sf, float vd, float mott, float flatk, float ceilk, float topk, out vec3 rockC, out float gRock){
          float farK = smoothstep(350.0, 900.0, vd);
          float tone = mix(h11(sid), 0.5, 0.7 * farK), ledge = mix(smoothstep(0.0, 0.14, sf) * (1.0 - smoothstep(0.82, 1.0, sf)), 1.0, farK);
          float grain = mix(0.5, fb3(P * vec3(0.33, 0.95, 0.33)), 1.0 - smoothstep(260.0, 620.0, vd));
          float fine = mix(0.5, fb3(P * vec3(1.9, 3.4, 1.9) + 7.0), 1.0 - smoothstep(26.0, 80.0, vd));   // close-range grain
          vec2 rd = P.xz / max(length(P.xz), 1e-3);
          float rib = fb3(vec3(rd * 8.0, length(P.xz) * 0.045));
          vec3 sideC = mix(vec3(0.66, 0.58, 0.80), vec3(1.30, 1.14, 0.96), mix(tone * tone, tone, 0.45)) * (0.58 + 0.42 * ledge) * (0.72 + 0.56 * grain) * (0.88 + 0.24 * fine);
          vec3 ceilC = mix(vec3(0.82, 0.76, 0.96), vec3(1.12, 0.98, 0.98), smoothstep(0.25, 0.75, mott)) * (0.66 + 0.5 * smoothstep(0.3, 0.7, rib)) * (0.9 + 0.2 * grain);
          vec3 topC = mix(vec3(0.92, 0.80, 0.88), vec3(1.28, 1.14, 0.98), smoothstep(0.2, 0.8, mott + 0.4 * (tone - 0.5))) * (0.8 + 0.4 * grain) * (0.9 + 0.2 * fine);
          rockC = sideC * (1.0 - flatk) + ceilC * ceilk + topC * topk;
          gRock = (ledge * (1.5 + tone * 0.8) + grain * 1.3 + fine * 0.55) * (1.0 - flatk) + (rib * 1.5 + mott * 1.1 + grain * 0.7) * ceilk + (mott * 1.4 + grain * 1.1 + fine * 0.5) * topk;
        }`).replace("#include <color_fragment>",`#include <color_fragment>
        {
          float rk = vMix.x; vec3 P = vLP;
          float wv = fb3(P * 0.017);
          float sc = P.y * uStrata + wv * 3.0 + fb3(P * 0.07) * 0.7;      // bands lie near level: a slow roll, never a swirl
          float sid = floor(sc), sf = fract(sc);
          float vd = length(vViewPosition), aw = fwidth(sc), fpx = max(length(dFdx(P)), length(dFdy(P)));
          float fmn = min(length(dFdx(P)), length(dFdy(P)));     // metres to a pixel ACROSS the line of sight: how near the rock is, however steeply it is seen
          // (from here down to rockC: this version's own, smoother pattern. It is the whole of the rock beyond 98 m from the
          // eye and shares it with liveRock() from 98 m in to 49 m; nearer than 49 m none of it is drawn. So what the notes
          // below say of a face beside the lane (the mottle that takes the grain's place, the two lattices of the close-range
          // grain and its fall to a quarter, the ribs left out on a keel's flank, the terraces of a ceiling) is what this
          // pattern does by the size of a pixel, and it shows only from 49 m out, in the share this pattern has there)
          float farK = max(smoothstep(350.0, 900.0, vd), smoothstep(0.3, 0.75, aw)), bedK = 1.0 - smoothstep(1.5, 3.75, aw);     // (aw: strata to a pixel, so a rim seen edge-on never speckles)
          // the fine strata fade with distance (they would shimmer), and broad beds five strata thick take over from them: a far
          // island is still layered rock, in a few wide bands, never a smooth cone
          float sc2 = sc * 0.2 + 0.37, sf2 = fract(sc2), bed = mix(0.5, h11(floor(sc2) + 31.0), 0.75 * bedK);
          // the joint between two strata is a dark line; a slow mask of its own fades about half of every joint's length out to a
          // faint ledge, so a cliff is never ruled with lines of one even weight
          float jm = smoothstep(0.34, 0.66, vn3(P * vec3(0.045, 0.02, 0.045) + floor(sc + 0.18) * 7.3 + 3.0));
          float joint = mix(1.0, smoothstep(0.0, 0.14, sf) * (1.0 - smoothstep(0.82, 1.0, sf)), 0.28 + 0.72 * jm);
          float tone = mix(h11(sid), bed, max(farK, 0.22)), ledge = mix(joint, mix(0.75, 0.5 + 0.5 * smoothstep(0.0, 0.12, sf2) * (1.0 - smoothstep(0.86, 1.0, sf2)), bedK), farK);
          // grain fades out with distance (to its mean) before it gets smaller than a pixel: far cliffs stay clean, not speckled
          // (and by its size on screen, the fine octaves first: a cliff seen far off or edge-on is banded, never salt and pepper)
          vec3 gp = P * vec3(0.33, 0.95, 0.33);
          // (every octave is gone before its cells are under four pixels: finer than that the bump below, whose slopes are worked
          // out once for each 2 x 2 block of pixels, turns a cliff into coarse blocks, as a low-resolution texture would)
          // (and at the other end: where one cell of the grain, a lozenge 3 m by 1 m, would stand a dozen pixels tall and more, a
          // flank beside the lane, however steeply it is seen, it gives way to a broad soft mottle three times as coarse: close rock
          // is soft bands and patches, not a weave of dashes; the close-range grain below carries the fine texture there)
          float grainN = mix(mix(vn3(gp), fb3(gp), 1.0 - smoothstep(0.03, 0.1, fpx)), 0.5 + 0.6 * (vn3(gp * 0.3 + 4.0) - 0.5), 0.85 * (1.0 - smoothstep(0.05, 0.16, fmn)));
          float grain = mix(0.5, grainN, (1.0 - smoothstep(260.0, 620.0, vd)) * (1.0 - smoothstep(0.14, 0.45, fpx)));
          // close-range grain: cells 53 cm by 29 cm, for rock whose pixels hold 3 to 10 cm. Where a cell stands five pixels tall and
          // more (a keel flank within 25 m of the lane) one lattice of them reads as rows of dashes, a weave: so the field is two
          // lattices of unlike pitch laid over each other (no rows), and it fades to a quarter of its strength as the cells grow
          // on screen: the near flank is left to its bands and its mottle
          vec3 fq = P * vec3(1.9, 3.4, 1.9) + 7.0;
          float fineN = 0.5 * (vn3(fq) + vn3(fq * 0.73 + 3.1));
          float fine = mix(0.5, mix(fineN, fb3(fq), 1.0 - smoothstep(0.012, 0.035, fpx)), (1.0 - smoothstep(26.0, 80.0, vd)) * (1.0 - smoothstep(0.035, 0.1, fpx)) * (0.25 + 0.75 * smoothstep(0.03, 0.09, fmn)));
          float wny = dot(normalize(vNormal), vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]));
          float flatk = smoothstep(0.5, 0.88, abs(wny)), ceilk = flatk * step(wny, 0.0), topk = flatk - ceilk;
          vec2 rd = P.xz / max(length(P.xz), 1e-3);
          float rib = fb3(vec3(rd * 13.0, length(P.xz) * 0.11 + P.y * 0.2)), mott = fb3(P * 0.06 + 5.0);    // (the height term: no streaks drawn down a flare)
          // the ribs belong to true ceilings: on the sloping flank of a keel they run down across the strata as vertical joints (a
          // woven, brick-like wall at close range), so there they are left out while a pixel is under 7 cm of rock across and are
          // back where it is 14
          rib = mix(0.5, rib, max(smoothstep(0.8, 0.95, -wny), smoothstep(0.07, 0.14, fmn)));
          // cliffs: banded strata. Ceilings: pale stone with soft radial ribs (it is lit from below by the cloud sea).
          // Rock that faces the sky (rims, ledges): warm and light, so no island wears a slate-grey collar.
          vec3 sideC = mix(vec3(0.66, 0.58, 0.80), vec3(1.30, 1.14, 0.96), mix(tone * tone, tone, 0.45)) * (0.58 + 0.42 * ledge) * (0.72 + 0.56 * grain) * (0.88 + 0.24 * fine);
          vec3 ceilC = mix(vec3(0.82, 0.76, 0.96), vec3(1.12, 0.98, 0.98), smoothstep(0.25, 0.75, mott)) * (0.7 + 0.42 * smoothstep(0.3, 0.7, rib)) * (0.9 + 0.2 * grain);
          // seen from below the beds are a few soft terraces: each bed a faint step, lit along the edge that stands proud and in soft
          // shade on the other side, with a hair seam between (under two pixels wide at any range). A slow mask, different for each
          // seam, fades most of every seam out along its length: a worked ceiling, never a drawn maze
          float cw = max(aw, 1e-4), csd = sf - step(0.5, sf), cad = abs(csd);              // csd: signed distance to the nearest seam, in beds
          float cmask = smoothstep(0.4, 0.72, vn(P.xz * 0.045 + floor(sc + 0.5) * 3.7 + 8.0));
          float cK = ceilk * (1.0 - smoothstep(0.2, 0.5, cw)) * cmask, cline = 1.0 - smoothstep(0.0, 1.6 * cw, cad);
          float cstep = mix(-0.7, 1.0, smoothstep(-cw, cw, csd)) * exp(-cad / 0.12);
          ceilC *= (0.93 + 0.14 * tone) * (0.88 + 0.24 * fine) * (1.0 - 0.15 * cK * cline) * (1.0 + 0.1 * cK * cstep);
          vec3 topC = mix(vec3(0.92, 0.80, 0.88), vec3(1.28, 1.14, 0.98), smoothstep(0.2, 0.8, mott + 0.4 * (tone - 0.5))) * (0.8 + 0.4 * grain) * (0.9 + 0.2 * fine);
          vec3 rockC = sideC * (1.0 - flatk) + ceilC * ceilk + topC * topk;
          // THE HAND-OVER, by the fragment's distance from the eye in metres (vd): a way of drawing by distance, as the far
          // fades above are (nothing is placed, hidden or timed by it). Nearer than 49.1 m the rock is liveRock() alone:
          // crisp banded strata with the brick-like grain. From 49.1 m to 98.3 m the two patterns are mixed, one smoothstep.
          // Beyond 98.3 m the rock is this version's pattern above alone, as it was. The two distances come from the size of
          // live's grain: the finest of its three octaves has cells 0.71 m by 0.246 m (1 / 0.95 m across the bands, twice
          // divided by 2.07), and 98.3 m = 400 x 0.246 m is where one such band is one four-hundredth of the distance (about
          // the smallest detail a screen shows: further off that octave cannot be told apart and reads as speckle), 49.1 m
          // where it is one two-hundredth.
          // Why: the pattern above takes its fine detail away by the size of a pixel (fpx, fmn), not by distance. On a face
          // steeper than 60 degrees 20 m from the eye (a pixel is 2.2 cm of rock on a screen 1080 lines tall) that left 15%
          // of the grain under a soft mottle with cells 10 m by 3.5 m, a quarter of the close-range grain (3% where the face
          // is seen 75 degrees aslant), every joint down to 28% of its depth over about half its length, each stratum's tone
          // drawn 22% toward its bed's, and no ribs on a keel's flank: a smear where live is crisp.
          // (turf takes none of it: where rk is 0 the rock's colour has no weight and liveRock() is not worked out)
          float nearK = 1.0 - smoothstep(49.1, 98.3, vd);
          vec3 nearC = rockC; float nearG = 0.0;
          if (nearK > 0.0 && rk > 0.0) liveRock(P, sid, sf, vd, mott, flatk, ceilk, topk, nearC, nearG);
          rockC = mix(rockC, nearC, nearK);
          // turf: the fine fields are looked up on turned, warped coordinates (no square noise cells in the foreground) and each
          // fades to its mean before it is smaller than a pixel ALONG THE GROUND (fpx: a meadow skimmed at a low angle has pixels a
          // metre deep, and under a low sun fine noise there breaks into a checker of lit and dark pixels)
          vec2 tq = mat2(0.8, 0.6, -0.6, 0.8) * P.xz + 0.7 * vec2(vn(P.xz * 0.9 + 5.0), vn(P.xz * 0.9 + 9.0));
          float nearT = 1.0 - smoothstep(30.0, 110.0, vd), midT = (1.0 - smoothstep(90.0, 300.0, vd)) * (1.0 - smoothstep(0.5, 1.6, fpx));
          float m1 = mix(vn(P.xz * 0.11 + 1.7), fb2(P.xz * 0.11), midT);
          float m2 = mix(0.5, mix(vn(tq * 0.95 + 3.0), fb2(tq * 0.95 + 3.0), 1.0 - smoothstep(0.05, 0.16, fpx)), nearT * (1.0 - smoothstep(0.16, 0.5, fpx)));
          float closeT = smoothstep(12.0, 35.0, vd);                     // the finest field is for the middle distance: right under the camera the grass itself carries the detail
          float m3 = mix(0.5, fb2(tq * 2.3 + 2.0), (1.0 - smoothstep(30.0, 70.0, vd)) * closeT * (1.0 - smoothstep(0.04, 0.14, fpx)));
          vec3 tc = diffuseColor.rgb * (0.72 + 0.56 * m1) * (0.8 + 0.4 * m2) * (0.88 + 0.24 * m3);
          // the flowered drifts: lobes of the flower colour that break into clumps at their edges (the grass on them keeps the turf's own colour)
          tc = mix(tc, uFlower * (0.7 + 0.3 * m2), ${It.toFixed(2)} * driftF(P.xz, fpx));
          diffuseColor.rgb = mix(tc, diffuseColor.rgb * rockC, rk) * vMix.y;
          float gRock = (ledge * (1.5 + tone * 0.8) + grain * 1.3 + fine * 0.55) * (1.0 - flatk) + (rib * 1.5 + mott * 1.1 + grain * 0.7) * ceilk + (mott * 1.4 + grain * 1.1 + fine * 0.5) * topk;
          gH = mix(m2 * 0.24 + m3 * 0.14, mix(gRock + 0.3 * cK * cstep, nearG, nearK), rk);     // the bump's height is handed over with the colour (49.1 m to 98.3 m)
        }`).replace("#include <normal_fragment_maps>",`#include <normal_fragment_maps>
        {
          vec3 sp = -vViewPosition, dpx = dFdx(sp), dpy = dFdy(sp);
          float hx = dFdx(gH), hy = dFdy(gH);
          vec3 r1 = cross(dpy, normal), r2 = cross(normal, dpx);
          float det = dot(dpx, r1);
          vec3 g = sign(det) * (hx * r1 + hy * r2);
          float kb = (1.0 - 0.6 * smoothstep(0.3, 1.2, max(length(dpx), length(dpy)))) / (1.0 + length(sp) * 0.009);
          normal = normalize(abs(det) * normal - kb * g + normal * 1e-12);
        }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        {
          vec3 wn = inverseTransformDirection(normal, viewMatrix);
          float dn = clamp(0.35 - wn.y * 0.65, 0.0, 1.0);
          // light thrown up by the cloud sea: pale blue where the underside is open to it, turning pink where it is deep in
          // (under a keel, far down a root-hung flank). Downward faces GLOW with it; walls only take a tint in their shade.
          float deep = clamp((1.0 - vMix.y) * 2.7, 0.0, 1.0);
          float bk = clamp(max(smoothstep(-15.0, -190.0, vLP.y) * 0.8, deep * 0.92) + 0.14 * smoothstep(0.2, 0.9, dn), 0.0, 1.0);
          vec3 bc = mix(uBounceA, uBounceB, bk);
          float lum = dot(diffuseColor.rgb, vec3(0.3, 0.5, 0.2));
          totalEmissiveRadiance += mix(diffuseColor.rgb, vec3(lum * 1.2), 0.5) * bc * dn * uBounce * mix(0.8, 1.05, smoothstep(0.55, 1.0, dn));
          vec3 pd = uPortalPos - vLP;
          totalEmissiveRadiance += diffuseColor.rgb * uPortalCol * (uPortalGlow * min(2.4 / (1.0 + dot(pd, pd) * 0.02), 0.8));
        }`)},o},zt=Pt(!0),eo=new r.Mesh(Kt,zt),to=new r.Mesh(qe,zt),ct=[.01,14,30,50,72,94,114,130,140,146,150,153,156,160,166,174,182,190,196,199.5,201.2],Te={p:[],s:[],idx:[],n:0};for(let e=0;e<ct.length;e++)for(let o=0;o<G;o++){o%60===0&&await u();const t=ie[o],a=ct[e],n=a<196?a:P(a-3,a,k(.4,.9,B(t,199)));Te.p.push(Math.sin(t)*n,0,Math.cos(t)*n),Te.s.push(a<132?-5:L(Math.min(a,199.6),t),a<140?0:B(t,Math.min(a,199.6)))}await u(),Pe(Te,0,G,ct.length,!0,!1,!1),await u();const De=new r.BufferGeometry;De.setAttribute("position",new r.Float32BufferAttribute(Te.p,3)),De.setAttribute("aShore",new r.Float32BufferAttribute(Te.s,2)),De.setIndex(Te.idx),De.computeBoundingSphere(),await T();const Ue=`
    varying vec3 vLP; varying vec3 vCamL;
    #include <fog_pars_vertex>
    void localCam(){ vCamL = (inverse(modelMatrix) * vec4(cameraPosition, 1.0)).xyz; }`,oo=new r.ShaderMaterial({fog:!0,uniforms:{...Ke(),uTime:y.uTime,uSun:y.uSun,uSunCol:y.uSunCol,uSkyTop:y.uSkyTop,uSkyHor:y.uLakeHor,uLakeGain:y.uLakeGain,uDeep:y.uDeep,uShallow:y.uShallow,uWhite:y.uWhite,uRock:y.uRock,uPortalCol:y.uPortalCol,uPortalGlow:y.uPortalGlow,uPortalPos:y.uPortalPos,uSpire:y.uSpire},vertexShader:Ue+`
      attribute vec2 aShore; varying vec2 vShore;
      void main(){
        vLP = position; vShore = aShore; localCam();
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:_e+`
      uniform float uTime, uPortalGlow, uLakeGain; uniform vec4 uSpire;
      uniform vec3 uSun, uSunCol, uSkyTop, uSkyHor, uDeep, uShallow, uWhite, uRock, uPortalCol, uPortalPos;
      varying vec3 vLP; varying vec3 vCamL; varying vec2 vShore;
      #include <fog_pars_fragment>
      void main(){
        vec3 Vv = vCamL - vLP; float dist = length(Vv); vec3 V = Vv / dist;
        vec2 p = vLP.xz; float rr = length(p), land = vShore.x, chan = vShore.y;
        float lipk = chan * smoothstep(168.0, 200.0, rr);
        vec2 g = vec2(0.0);
        for (int i = 0; i < 7; i++) {
          float fi = float(i); vec2 d = vec2(cos(fi * 2.4 + 0.7), sin(fi * 2.4 + 0.7));
          float ph = dot(p, d) * 0.17 * pow(1.6, fi) + uTime * (0.8 + 0.3 * fi) + 1.5 * vn(p * 0.045 * (1.0 + fi) + fi * 7.3);
          g += d * cos(ph) / (1.0 + fi * 0.5) * (fi < 4.5 ? 1.0 : 1.0 / (1.0 + dist * 0.015));     // the two finest sets of ripples only near the camera
        }
        g += (vec2(vn(p * 1.4 + uTime * 0.5), vn(p * 1.4 + 9.0 - uTime * 0.4)) - 0.5) * 2.2 / (1.0 + dist * 0.02);
        float amp = 0.07 / (1.0 + dist * 0.0025) + 0.012 + 0.1 * lipk;
        vec3 Nn = normalize(vec3(-g.x * amp, 1.0, -g.y * amp));
        vec3 R = reflect(-V, Nn); R.y = abs(R.y) + 0.001; R = normalize(R);
        vec3 sky = mix(uSkyHor * 1.05, uSkyTop, pow(clamp(R.y, 0.0, 1.0), 0.6));
        float sd = max(dot(R, uSun), 0.0);
        sky += uSunCol * (pow(sd, 350.0) * 10.0 + pow(sd, 24.0) * 0.2);
        // the spire, mirrored as a camera-facing profile
        vec2 rh = R.xz; float rl = max(length(rh), 1e-3); vec2 nh = rh / rl;
        float ts = -dot(p, nh) / rl;
        if (ts > 0.0) {
          vec3 Q = vLP + R * ts; float y = Q.y, H = uSpire.x;
          vec2 perp = vec2(nh.y, -nh.x); float lat = dot(Q.xz, perp);
          float halfw = uSpire.y * pow(clamp(1.0 - (y + 5.0) / (H + 5.0), 0.0, 1.0), 0.75) + 5.0 * exp(-(y + 5.0) / 6.0);
          float thick = mix(10.5, 2.0, pow(smoothstep(-6.0, H, y), 0.8));
          float weff = length(vec2(halfw * nh.y, thick * nh.x));
          float off = lat + g.x * 1.5 - uSpire.z * pow(max(y, 0.0) / H, 2.0) * perp.x;
          float inside = step(0.0, y) * smoothstep(weff, weff - 1.5, abs(off));
          float hole = (1.0 - smoothstep(6.5, 8.5, length(vec2(lat / max(abs(nh.y), 0.05), y - 10.0)))) * smoothstep(0.35, 0.6, abs(nh.y));
          sky = mix(sky, uRock * (0.5 + 0.5 * clamp(y / H, 0.0, 1.0)), inside * (1.0 - hole) * 0.6 * (0.55 + 0.45 * smoothstep(-1.2, 1.2, g.x + g.y)));      // a broken mirror: the ripples tear it
        }
        // the portal's glow laid on the water
        vec3 pc = uPortalPos - vLP; float tp = max(dot(pc, R), 0.0); vec3 cl = pc - R * tp; float d2 = dot(cl.xz, cl.xz) * 2.2 + cl.y * cl.y * 0.5;
        sky += uPortalCol * uPortalGlow * (exp(-d2 / 45.0) * 1.9 + exp(-d2 / 400.0) * 0.08);
        float F = 0.04 + 0.96 * pow(clamp(1.0 - dot(Nn, V), 0.0, 1.0), 3.0);
        float dk = clamp(-land / 5.0, 0.0, 1.0);
        vec3 body = mix(uShallow, uDeep, smoothstep(0.08, 0.95, dk)) * (0.4 + 0.6 * max(uSun.y, 0.2)) * uLakeGain;
        body = mix(body, uShallow * 0.9, 0.5 * lipk);
        vec3 col = mix(body, sky, F);
        // foam: shoreline lap, streaks racing down the channels, white lip
        float shf = smoothstep(-1.1, -0.1, land) * (1.0 - chan) * smoothstep(0.3, 0.7, vn(p * 0.9 + uTime * 0.2) + 0.4 * sin(land * 5.0 - uTime * 1.3));
        float ang = atan(p.x, p.y);
        float st = fb2(vec2(ang * rr * 0.45, rr * 0.16 - uTime * (0.9 + 2.2 * lipk)));
        float cf = chan * smoothstep(156.0, 199.0, rr) * smoothstep(0.62 - 0.4 * lipk, 0.9 - 0.4 * lipk, st + lipk * 0.25);
        cf = max(cf, lipk * smoothstep(192.0, 200.5, rr));
        float sr = length(p / vec2(uSpire.y + 4.0, 12.5));
        float spf = smoothstep(0.86, 1.0, sr) * (1.0 - smoothstep(1.0, 1.22, sr)) * smoothstep(0.35, 0.75, vn(p * 0.6 - uTime * 0.25));
        float foam = clamp(max(max(shf * 0.8, spf * 0.6), cf), 0.0, 1.0);
        col = mix(col, uWhite * uSunCol * (0.7 + 0.75 * max(uSun.y, 0.3)), foam);
        gl_FragColor = vec4(col, 1.0);
        #include <fog_fragment>
      }`}),Ft=new r.Mesh(De,oo);await u();const ft=8,ht=36,ce={p:[],uv:[],fs:[],idx:[],n:0},Xe=e=>199.4+3.4*e,ao=e=>-.05-4.9*e*e;for(let e=0;e<bt;e++)for(let o=0;o<2;o++){await u(.8);const t=b[e],a=ce.n;for(let n=0;n<=ht;n++)for(let i=0;i<=ft;i++){const s=n/ht,l=i/ft*2-1,d=s*Dt,p=Xe(d)+o*(.8+5*s)-1.6*(1-l*l)*o,M=t.w*.5*(1+.2*s-.36*s*s)*(o?.82:1),h=t.a+l*M/p;ce.p.push(Math.sin(h)*p,ao(d),Math.cos(h)*p),ce.uv.push(l,s),ce.fs.push(t.seed+o*3.7,o,t.w),ce.n++}Pe(ce,a,ft+1,ht+1,!1,!1,!1)}await u();const Ae=new r.BufferGeometry;Ae.setAttribute("position",new r.Float32BufferAttribute(ce.p,3)),Ae.setAttribute("aUV",new r.Float32BufferAttribute(ce.uv,2)),Ae.setAttribute("aFS",new r.Float32BufferAttribute(ce.fs,3)),Ae.setIndex(ce.idx),Ae.computeBoundingSphere();const no=new r.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,side:r.DoubleSide,uniforms:{...Ke(),uTime:y.uTime,uSun:y.uSun,uSunCol:y.uSunCol,uSkyHor:y.uSkyHor,uWhite:y.uWhite},vertexShader:Ue+`
      uniform float uTime; attribute vec2 aUV; attribute vec3 aFS; varying vec2 vUV; varying vec3 vFS; varying vec2 vOut;
      void main(){
        vec3 pos = position; float v = aUV.y; vec2 od = normalize(position.xz);
        pos.xz += (vec2(od.y, -od.x) * sin(uTime * 0.31 + aFS.x) * 5.0 + od * sin(uTime * 0.23 + aFS.x * 2.0) * 4.0) * v * v;
        vLP = pos; vUV = aUV; vFS = aFS; vOut = od; localCam();
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:_e+`
      uniform float uTime; uniform vec3 uSun, uSunCol, uSkyHor, uWhite;
      varying vec3 vLP; varying vec3 vCamL; varying vec2 vUV; varying vec3 vFS; varying vec2 vOut;
      #include <fog_pars_fragment>
      void main(){
        float u = vUV.x, v = vUV.y, et = uTime - v * ${Dt.toFixed(1)};
        float n1 = fb2(vec2(u * 3.0 + vFS.x * 13.0, et * 1.5 + vFS.x * 5.0));
        float n2 = fb2(vec2(u * 9.0 + vFS.x * 7.0, et * 4.0));
        float n3 = vn(vec2(u * 26.0 + vFS.x * 3.0, et * 9.0));
        float n = n1 * 0.5 + n2 * 0.32 + n3 * 0.18;
        float edge = 1.0 - smoothstep(0.5, 1.0, abs(u) + (n2 - 0.5) * 0.5);
        // a fall close by and seen along its own sheet (the gallery, where one stands beside the lane): its strands lie one behind
        // another and close up into a flat white band. There it is thinned: more air between the strands, so it reads as water
        vec3 Vv = vCamL - vLP; float dC = max(length(Vv), 1e-3); vec3 Vn = Vv / dC;
        float facing = abs(Vn.x * vOut.x + Vn.z * vOut.y) / max(length(vOut), 1e-3);
        float glance = (1.0 - smoothstep(0.12, 0.5, facing)) * (1.0 - smoothstep(60.0, 130.0, dC));
        float er = mix(0.05, 0.7, pow(clamp(v, 0.0, 1.0), 0.75)) + 0.2 * glance * smoothstep(0.0, 0.08, v);
        float a = smoothstep(er, er + 0.13, n + (1.0 - abs(u)) * 0.12) * edge;       // distinct strands with air between them, not a veil
        a = mix(a, edge, 1.0 - smoothstep(0.0, 0.05, v));
        a *= (1.0 - smoothstep(0.64, 0.96, v)) * mix(1.0, 0.7, vFS.y) * (1.0 - 0.2 * glance);
        if (a < 0.004) discard;
        float lit = clamp(dot(normalize(vec3(vOut.x, 0.3, vOut.y)), uSun) * 0.6 + 0.5, 0.0, 1.0);
        float strand = smoothstep(0.3, 0.72, n2 * 0.55 + n3 * 0.45);
        vec3 col = mix(uSkyHor * 0.62 + 0.16, uWhite * mix(vec3(1.0), uSunCol, 0.45) * 1.32, clamp(lit * (0.42 + 0.58 * strand) + 0.14 * strand, 0.0, 1.0));
        col += mix(vec3(1.0), uSunCol, 0.4) * pow(max(dot(-Vn, uSun), 0.0), 3.0) * 0.4 * strand;
        gl_FragColor = vec4(col, a * 0.97);
        #include <fog_fragment>
      }`}),Tt=new r.Mesh(Ae,no);await T(),Tt.renderOrder=2;const Y={p:[],c:[],ps:[],idx:[],n:0},fe=c.fork("mist"),Ze=(e,o,t,a,n)=>{for(let i=0;i<4;i++)Y.p.push(e,o,t),Y.c.push(i&1?1:-1,i&2?1:-1),Y.ps.push(a,fe.range(0,1),n);Y.idx.push(Y.n,Y.n+1,Y.n+3,Y.n,Y.n+3,Y.n+2),Y.n+=4},Qe=v.seaY??-297,ro=[.22,.32,.4,.44,.42,.34,.24];for(const e of b){for(let o=0;o<7;o++){const t=-150-o*26+fe.range(-8,8),a=Xe(Math.sqrt(-t/4.9))+fe.range(-4,8),n=e.a+fe.range(-.03,.03)*(1+o*.4);Ze(Math.sin(n)*a,t,Math.cos(n)*a,22+o*8.5+fe.range(-4,8),ro[o])}for(const o of[-1,1]){const t=e.a+o*e.w*.25/xt;Ze(Math.sin(t)*202.5,-5,Math.cos(t)*202.5,fe.range(11,15),.3)}}for(let e=0;e<30;e++){const o=fe.range(0,H),t=fe.range(196,240),a=fe.range(100,160);Ze(Math.sin(o)*t,Qe+fe.range(-15,21),Math.cos(o)*t,a*.62,.07)}const $e=c.fork("feet");for(const e of b)for(let o=0;o<3;o++){const t=e.a+$e.range(-.05,.05),a=Xe(7.8)+$e.range(-10,22);Ze(Math.sin(t)*a,Qe+6+o*16+$e.range(-6,6),Math.cos(t)*a,(62-o*12+$e.range(-6,10))*.72,.3-o*.04)}const We=new r.BufferGeometry;We.setAttribute("position",new r.Float32BufferAttribute(Y.p,3)),We.setAttribute("aCorner",new r.Float32BufferAttribute(Y.c,2)),We.setAttribute("aPS",new r.Float32BufferAttribute(Y.ps,3)),We.setIndex(Y.idx);const io=new r.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...Ke(),uTime:y.uTime,uSun:y.uSun,uSunCol:y.uSunCol,uSkyHor:y.uSkyHor,uWhite:y.uWhite,uMist:y.uMist,uPink:y.uBounceB,uCloudShade:y.uCloudShade,uSeaY:{value:Qe}},vertexShader:Ue+`
      uniform float uTime; attribute vec2 aCorner; attribute vec3 aPS; varying vec2 vC; varying vec3 vPS; varying float vDist; varying float vFY;
      void main(){
        vec3 c = position; c.y += sin(uTime * 0.21 + aPS.y * 6.0) * aPS.x * 0.04;
        vLP = c; vC = aCorner; vPS = aPS; localCam();
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.0);
        vDist = -mvPosition.z;
        mvPosition.xy += aCorner * aPS.x * (1.0 + 0.06 * sin(uTime * 0.3 + aPS.y * 9.0));
        vFY = c.y + aCorner.y * aPS.x * viewMatrix[1][1];        // height of this corner: the puff fades where it sinks into the cloud sea
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:_e+`
      uniform float uTime, uMist, uSeaY; uniform vec3 uSun, uSunCol, uSkyHor, uWhite, uPink, uCloudShade;
      varying vec3 vLP; varying vec3 vCamL; varying vec2 vC; varying vec3 vPS; varying float vDist; varying float vFY;
      #include <fog_pars_fragment>
      void main(){
        float r2 = dot(vC, vC); if (r2 > 1.0) discard;
        float soft = (1.0 - r2) * (1.0 - r2);
        float n = fb2(vC * 1.7 + vPS.y * 31.0 + vec2(uTime * 0.03, uTime * 0.07));
        float a = soft * smoothstep(0.2, 0.75, n + soft * 0.35) * vPS.z * uMist * smoothstep(50.0, 200.0, vDist) * smoothstep(uSeaY - 14.0, uSeaY + 34.0, vFY);
        vec3 Vn = normalize(vCamL - vLP);
        vec3 col = mix(mix(uCloudShade, uWhite, 0.5), uWhite * mix(vec3(1.0), uSunCol, 0.18) * 1.08, clamp(vC.y * 0.55 + 0.44 + (n - 0.5) * 0.5, 0.0, 1.0));   // white heads, cloud-shade bellies
        col += vec3(0.3) * pow(max(dot(-Vn, uSun), 0.0), 2.0);
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}),ut=new r.Mesh(We,io);ut.frustumCulled=!1,ut.renderOrder=3,await u();const At=v.eyeY??Qe-60,Ie=new r.Vector2(f.tipX,f.tipZ),Je=Ie.clone().multiplyScalar(1.45),N={c:[],ps:[],sp:[],idx:[],n:0},j=c.fork("spout"),mt=(e,o,t,a,n,i)=>{for(let s=0;s<4;s++)N.c.push(s&1?1:-1,s&2?1:-1),N.ps.push(e,j.range(0,1),o),N.sp.push(t,a,n,i);N.idx.push(N.n,N.n+1,N.n+3,N.n,N.n+3,N.n+2),N.n+=4};for(let e=0;e<144;e++)mt(j.range(11,18),j.range(.62,.86),(Math.floor(e/3)+j.range(0,.9))/48,e%3*(H/3),j.range(.85,1.15),0);for(let e=0;e<40;e++)mt(j.range(9,14),j.range(.5,.7),(e+j.range(0,.9))/40,j.range(0,H),j.range(0,.45),0);for(let e=0;e<84;e++)mt(j.range(14,25),j.range(.44,.62),(e+j.range(0,.9))/84,e%2*Math.PI+j.range(-.32,.32),j.range(.58,.74),2);const Be=new r.BufferGeometry;Be.setAttribute("position",new r.Float32BufferAttribute(new Float32Array(N.n*3),3)),Be.setAttribute("aCorner",new r.Float32BufferAttribute(N.c,2)),Be.setAttribute("aPS",new r.Float32BufferAttribute(N.ps,3)),Be.setAttribute("aSp",new r.Float32BufferAttribute(N.sp,4)),Be.setIndex(N.idx),y.uSpout={value:v.spout??1};const so=new r.ShaderMaterial({fog:!0,transparent:!0,depthWrite:!1,uniforms:{...Ke(),uTime:y.uTime,uSun:y.uSun,uSunCol:y.uSunCol,uSkyHor:y.uSkyHor,uWhite:y.uWhite,uSpout:y.uSpout,uPink:y.uBounceB,uCloudShade:y.uCloudShade,uSpA:{value:new r.Vector4(Je.x,Je.y,Ie.x,Ie.y)},uSpB:{value:new r.Vector4(At,-f.keelD,-66,f.keelPow)}},vertexShader:Ue+`
      uniform float uTime; uniform vec4 uSpA, uSpB; uniform vec3 uSun;
      attribute vec2 aCorner; attribute vec3 aPS; attribute vec4 aSp;
      varying vec2 vC; varying vec3 vPS; varying float vDist; varying vec2 vSF; varying float vTr;
      void main(){
        float kind = aSp.w, s, y, r, ang, fade, size = aPS.x; vec2 ax; vTr = 0.0;
        vec2 foot = uSpA.xy, tip = uSpA.zw; float y0 = uSpB.x, y1 = uSpB.y;
        if (kind < 0.5) {                       // the rope: strands start on the bearings of the deck's three arms and turn with them
          vTr = 1.0;
          s = fract(aSp.x + uTime * 0.028);
          float e = pow(max(s, 0.0), 0.62);
          y = mix(y0, y1 + 7.0, s);
          ax = mix(foot, tip, e) + vec2(sin(uTime * 0.17 + s * 5.0), cos(uTime * 0.13 + s * 4.0)) * 4.0 * sin(3.14159 * s);
          r = mix(21.0, 3.0, e) * aSp.z;
          ang = aSp.y - 0.6 + uTime * 0.1 + 9.5 * pow(max(s, 0.0), 1.25);
          size *= mix(1.2, 0.42, e);
          fade = smoothstep(0.0, 0.05, s) * (1.0 - smoothstep(0.93, 1.0, s));
        } else {                                // the draught: what the spout brings up winds on round the keel in two bands
          s = fract(aSp.x + uTime * 0.013);
          y = mix(y1 + 3.0, uSpB.z, s);
          float tk = clamp((-46.0 - y) / max(-46.0 - y1, 1.0), 0.0, 1.0);
          size *= mix(0.5, 1.2, s);
          r = 80.0 * pow(max(1.0 - tk, 0.0), uSpB.w) + size * (0.5 + aSp.z);   // stands off the rock by more than its radius: no hard cut where puff meets stone
          ax = tip * tk * tk;
          ang = aSp.y + s * 9.4 + uTime * 0.05;
          fade = smoothstep(0.0, 0.07, s) * (1.0 - smoothstep(0.8, 1.0, s));
        }
        vec2 od = vec2(sin(ang), cos(ang));
        vec3 c = vec3(ax.x + od.x * r, y, ax.y + od.y * r);
        vLP = c; vC = aCorner; vPS = aPS; localCam();
        vSF = vec2(dot(od, uSun.xz / max(length(uSun.xz), 1e-3)), fade);
        vec4 mvPosition = modelViewMatrix * vec4(c, 1.0);
        vDist = -mvPosition.z;
        mvPosition.xy += aCorner * size * (1.0 + 0.06 * sin(uTime * 0.3 + aPS.y * 9.0));
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:_e+`
      uniform float uTime, uSpout; uniform vec3 uSun, uSunCol, uSkyHor, uWhite, uPink, uCloudShade;
      varying vec3 vLP; varying vec3 vCamL; varying vec2 vC; varying vec3 vPS; varying float vDist; varying vec2 vSF; varying float vTr;
      #include <fog_pars_fragment>
      void main(){
        float r2 = dot(vC, vC); if (r2 > 1.0) discard;
        float soft = (1.0 - r2) * (1.0 - r2);
        float n = fb2(vC * 1.9 + vPS.y * 31.0 + vec2(uTime * 0.05, -uTime * 0.09));
        float a = soft * smoothstep(0.18, 0.7, n + soft * 0.4) * vPS.z * uSpout * vSF.y * smoothstep(16.0, 64.0, vDist);
        a *= mix(0.85 * smoothstep(120.0, 270.0, vDist), 1.0, vTr);       // the draught is a sight from outside the ring; from the gallery it would lie on the keel like paste
        // a body of cloud, not a veil: the rope is white on its sunward side and on every head, in deep cloud shade on its lee
        // and bellies, so each strand turns; the draught is softer (a lilac lee, never a dark blot against the rock)
        float lit = smoothstep(0.2, 0.86, vC.y * (0.3 + 0.14 * vTr) + 0.42 + 0.1 * vTr + vSF.x * (0.44 - 0.16 * vTr) + (n - 0.5) * 0.5);
        vec3 shade = mix(uCloudShade, uWhite, 0.3 - 0.2 * vTr);
        vec3 col = mix(shade, uWhite * mix(vec3(1.0), uSunCol, 0.4) * (1.1 + 0.12 * vTr), lit);
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
      }`}),et=new r.Mesh(Be,so);et.frustumCulled=!1,et.renderOrder=3,et.name="spout",await u();let te=Ne();const tt=new r.Vector3,ye=new r.Vector3,Ee=new r.Vector3,$=new r.Color,he=new r.Color;function de(e,o,t,a,n,i,s,l,d=0,p=4){const M=te.n,h=e.length,S=Array.isArray(a);for(let m=0;m<h;m++){const R=e[Math.max(0,m-1)],F=e[Math.min(h-1,m+1)],w=m/(h-1);tt.set(F[0]-R[0],F[1]-R[1],F[2]-R[2]).normalize(),ye.set(1,0,0),Math.abs(tt.x)>.9&&ye.set(0,0,1),Ee.crossVectors(tt,ye).normalize(),ye.crossVectors(Ee,tt),S?A.copy(a[m]):A.copy(a).lerp(n,w);for(let x=0;x<t;x++){const V=x/t*H,C=o[m]*(d?1+d*Math.cos(p*V+l):1),D=Math.cos(V)*C,U=Math.sin(V)*C;ve(te,e[m][0]+ye.x*D+Ee.x*U,e[m][1]+ye.y*D+Ee.y*U,e[m][2]+ye.z*D+Ee.z*U,A,P(i,s,w*w),l)}}Pe(te,M,t,h,!0,!1,!0)}function Bt(e,o,t,a,n,i,s,l,d){const p=te.n,M=e.length;for(let h=0;h<M;h++){const S=h/(M-1),m=o[h];A.copy(n).lerp(i,S),ve(te,e[h][0]-t*m,e[h][1]-m*.25,e[h][2]-a*m,A,P(s,l,S),d),ve(te,e[h][0]+t*m,e[h][1]-m*.25,e[h][2]+a*m,A,P(s,l,S),d)}Pe(te,p,2,M,!1,!1,!1)}const X=c.fork("roots"),dt=oe.clone().lerp(new r.Color(.16,.1,.08),.6);for(let e=0;e<42;e++){await u();const o=e<30?X.int(5,19):X.int(20,33),t=X.int(0,G-1),a=X.int(5,11),n=X.range(.5,1.1);ze(o,t,W);const i=k(165,100,Math.hypot(W.x,W.z)),s=P(X.range(8,14),X.range(24,46),i);$.copy(dt),he.copy(E).lerp(q,X.range(.1,.9)).lerp(_,.25).multiplyScalar(.66);for(let l=0;l<a;l++){const d=t+l*n,p=Math.floor(d);ze(o,p,W).lerp(ze(o,p+1,jt),d-p);const M=s*X.range(.55,1.2),h=X.range(0,H),S=X.range(-2.5,2.5),m=X.range(-2.5,2.5),R=X.range(.55,1)*(.6+M/40),F=M*X.range(.015,.045),w=[],x=[];for(let V=0;V<=6;V++){const C=V/6;w.push([W.x+S*C*C+F*C*Math.sin(C*6+h),W.y+1.2-M*C,W.z+m*C*C+F*C*Math.cos(C*5+h)]),x.push(P(R,.1,Math.pow(C,.8)))}de(w,x,3,$,he,0,M*.07,h)}}const xe=c.fork("trees"),Ve=[],pt=[],Vt=(e,o,t,a)=>L(t,a)>1.5&&B(a,t)<.01&&B(a,t-7)<.01&&B(a+.03,t)<.01&&B(a-.03,t)<.01&&!(o>0&&Math.abs(e)<36);for(let e=0;e<900&&Ve.length<104;e++){e%10===0&&await u();const o=xe.range(0,H),t=xe.range(160,194),a=Math.sin(o)*t,n=Math.cos(o)*t;!Vt(a,n,t,o)||g.n2(a*.017+f.o[1],n*.017+f.o[4])<-.25||Ve.some(i=>(i.x-a)**2+(i.z-n)**2<30)||Ve.push({x:a,z:n,y:L(t,o),frond:xe.chance(.6),h:xe.range(8,16)})}for(let e=0;e<600&&pt.length<40;e++){e%10===0&&await u();const o=xe.range(0,H),t=xe.range(158,195),a=Math.sin(o)*t,n=Math.cos(o)*t;!Vt(a,n,t,o)||Ve.some(i=>(i.x-a)**2+(i.z-n)**2<64)||pt.push(new r.Vector3(a,L(t,o),n))}const lo=[new r.Color(.34,.22,.13),new r.Color(1.3,.86,.36),new r.Color(1.9,1.5,.8),new r.Color(1.5,1,.45),new r.Color(.4,.26,.2)],vt=(e,o,t,a,n,i=.5,s=1,l=0)=>{const d=n.range(0,H),p=n.range(-2.5,2.5),M=n.range(-2.5,2.5),h=n.range(.4,.75)*(.6+a/40)*s,S=a*n.range(.015,.045);$.copy(dt),he.copy(E).lerp(q,i).lerp(_,.1).multiplyScalar(.6);const m=[],R=[],F=Math.min(.1,h*.5);for(let w=0;w<=6;w++){const x=w/6;m.push([e+p*x*x+S*x*Math.sin(x*6+d),o+1.2-a*x,t+M*x*x+S*x*Math.cos(x*5+d)]),R.push(P(h,F,Math.pow(x,.8)))}if(de(m,R,3,$,he,-1e-4,-a*.07,d),l>0){const w=m[6],x=[],V=[];for(let C=0;C<5;C++){const D=C/4;x.push([w[0],w[1]+l*(.5-2.6*D),w[2]]),V.push(l*(.12+Math.sin(Math.PI*Math.pow(D,.75))*.95))}de(x,V,6,lo,null,-a*.07,-a*.07,d)}},gt=_.clone().lerp(oe,.55).multiplyScalar(.7),Lt=(e,o)=>{const t=e.h,a=o.range(0,H),n=o.range(-.22,.22)*t,i=o.range(-.22,.22)*t,s=l=>[e.x+n*l*l,e.y-.6+t*l,e.z+i*l*l];if(e.frond){de([s(0),s(.25),s(.5),s(.75),s(1)],[.055*t,.042*t,.034*t,.027*t,.012*t],5,gt,$.copy(q).multiplyScalar(.7),0,t*.035,a);const l=o.int(9,11),d=o.range(0,1);$.copy(q).lerp(oe,.12*d).lerp(_,.12),he.copy(q).lerp(_,.4+.3*d);for(let p=0;p<l;p++){const M=.48+.52*(p/(l-1)),h=s(M),S=p*2.4+a,m=t*(.62-.36*(M-.48)/.52),R=Math.sin(S),F=Math.cos(S),w=[],x=[];for(let V=0;V<=4;V++){const C=V/4,D=C*C*C;w.push([h[0]+R*m*(C-.22*D),h[1]+m*(.42*Math.sin(C*2.3)-.5*C*C+.16*D),h[2]+F*m*(C-.22*D)]),x.push(m*.2*Math.sin(Math.PI*(.12+.86*C))+.05)}Bt(w,x,F,-R,$,he,t*.035*M,t*.035*M+m*.06,a)}}else{const l=e.rich?1:0,d=t*.62,p=[e.x+n*.4,e.y-.6+d,e.z+i*.4];de([s(0),[e.x+n*.1,e.y+d*.4,e.z+i*.1],[e.x+n*.3,e.y+d*.8,e.z+i*.3],p],[.04*t,.03*t,.024*t,.02*t],l?6:4,gt,$.copy(E).multiplyScalar(.5),0,t*.02,a);const M=o.range(0,1),h=l?o.int(5,7):4,S=l?8:6,m=l?10:7;$.copy(E).multiplyScalar(.5+.16*M),he.copy(E).lerp(Z,.5).lerp(ae,.14+.26*M);const R=[];for(let w=0;w<S;w++){const x=w/(S-1),V=new r.Color().copy($).lerp(he,k(0,.22,x)*(1-.75*k(.3,.74,x)));R.push(V.multiplyScalar(P(1,.42,k(.72,.9,x))))}let F=null;for(let w=0;w<h;w++){const x=a+w*2.4,V=w===0?0:t*(.15+.035*w)*o.range(.85,1.15),C=t*(w===0?.2:P(.14,.085,w/h))*o.range(.9,1.12),D=p[0]+Math.sin(x)*V,U=p[2]+Math.cos(x)*V,ke=p[1]+(w===0?t*.02:-t*(.05+.06*w)*o.range(.8,1.2));w>0&&de([[p[0],p[1]-t*.02*w,p[2]],[P(p[0],D,.6),ke+C*2.5,P(p[2],U,.6)],[D,ke+C*2.05,U]],[.014*t,.011*t,.009*t],3,gt,$,t*.02,t*.026,a);const Se=[],Me=[];for(let Ce=0;Ce<S;Ce++){const ge=Ce/(S-1),at=Math.pow(Math.sin(Math.PI*Math.min(1,ge/.86)),.7)*(1.08-.5*k(.3,.86,ge));Se.push([D,ke+C*2.2*ge,U]),Me.push(C*Math.max(at,ge>.7?P(.24,.07,k(.7,1,ge)):.03))}de(Se,Me,m,R,null,t*.02,t*.03,a+w,.11,4),(w===0||l&&w===2)&&(F=[D,ke,U,C])}l&&F&&vt(F[0],F[1]-1.1,F[2],t*o.range(.22,.4),o,.2+.6*M,.45)}};for(let e=0;e<Ve.length;e++)await u(.55),Lt(Ve[e],xe);{const e=c.fork("vines"),o=t=>P(10.5,2,Math.pow(k(-6,f.spH,t),.8))*1.12+1.5;for(let t=0;t<34;t++){const a=t%2?1:-1,n=ue+e.range(1,15),i=Math.sqrt(Math.max(0,(I+1.3)**2-Math.min(I+1.3,Math.abs(n-7-ue))**2)),s=a*(Math.max(i,I*.55)+e.range(.4,4.5)),l=e.range(4,12),d=e.range(0,H);if(!Ye(s*1.12,n)||!Ye(s*1.12,n-l*.6))continue;const p=[],M=[];for(let h=0;h<=7;h++){const S=h/7,m=n-l*S;p.push([s+.5*Math.sin(S*5+d)*S,m,o(m)+.5*S]),M.push(P(.2,.05,S))}$.copy(dt),he.copy(E).lerp(q,e.range(.1,.8)).lerp(_,.15).multiplyScalar(.7),de(p,M,3,$,he,0,l*.03,d)}}await u();{const e=c.fork("gallery-roots");for(let o=0;o<16;o++){await u();const t=e.int(2,8),a=Math.round(e.range(205,305)/360*G),n=e.int(5,9),i=e.range(.15,.9),s=e.range(9,20);for(let l=0;l<n;l++)ze(t+l%2,a+l,W),vt(W.x,W.y-.6,W.z,s*e.range(.6,1.2),e,i,.9,e.chance(.6)?e.range(.4,.62):0)}}await u();const co=await nt(te,"aSway",2,u),wt=new r.MeshStandardMaterial({vertexColors:!0,roughness:.78,metalness:0,side:r.DoubleSide});wt.onBeforeCompile=e=>{for(const o of["uTime","uBounceA","uBounceB","uBounce"])e.uniforms[o]=y[o];e.vertexShader=e.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aSway; uniform float uTime; varying vec3 vFP; varying float vThin;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        vFP = position; vThin = step(aSway.x, -5e-5);
        transformed.xz += aSway.x * (vec2(sin(uTime * 0.9 + aSway.y), cos(uTime * 0.7 + aSway.y * 1.7)) + 0.5 * vec2(sin(uTime * 0.31 + position.x * 0.02), sin(uTime * 0.27 + position.z * 0.02)));`),e.fragmentShader=e.fragmentShader.replace("#include <common>",`#include <common>
`+_e+`
uniform vec3 uBounceA, uBounceB; uniform float uBounce; varying vec3 vFP; varying float vThin; vec3 lampE;`).replace("#include <color_fragment>",`#include <color_fragment>
        {                                                   // living skin: soft mottling and pale speckles (gourds, fronds, roots alike)
          float mo = vn3(vFP * 0.8 + 3.0), spk = smoothstep(0.7, 0.86, vn3(vFP * 2.7));
          diffuseColor.rgb *= 0.84 + 0.3 * mo;
          diffuseColor.rgb = mix(diffuseColor.rgb, diffuseColor.rgb * 1.55 + 0.05, spk * 0.5);
          // roots are thinner than a pixel from 150 m on: there they pale toward the stone behind them, so a far rim hung with
          // them is a soft fringe and never a band of dark speckle
          diffuseColor.rgb = mix(diffuseColor.rgb, vec3(0.6, 0.55, 0.7), 0.65 * vThin * smoothstep(150.0, 300.0, length(vViewPosition)));
          // a seed lantern (vertex colour above 1): an amber-to-cream glow that keeps its form, not a surface the key light can blow out
          float lmx = max(max(vColor.r, vColor.g), vColor.b), lampK = smoothstep(1.0, 1.25, lmx);
          lampE = vColor.rgb * (0.72 * lampK * (0.9 + 0.2 * mo));
          diffuseColor.rgb = mix(diffuseColor.rgb, vColor.rgb * (0.22 / max(lmx, 1e-3)), lampK);
        }`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
        totalEmissiveRadiance += diffuseColor.rgb * mix(vec3(0.16), mix(uBounceA, uBounceB, smoothstep(-15.0, -150.0, vFP.y)) * 0.6 * uBounce, smoothstep(-2.0, -10.0, vFP.y)) + lampE;
        {                                                   // a thin rim of sky light, so rounded forms turn
          float rimk = 1.0 - abs(dot(normalize(normal), normalize(vViewPosition)));
          totalEmissiveRadiance += diffuseColor.rgb * uBounceA * (rimk * rimk * rimk * 0.55);
        }`)};const fo=new r.Mesh(co,wt);await T();const be=new r.Group;be.name="crown-island",be.add(eo,to,Ft,fo,Tt,ut,et);const K=(e,o,t)=>new r.Vector3(Math.sin(o*Math.PI/180)*e,t,Math.cos(o*Math.PI/180)*e),yt=[K(335,-173,-58),K(264,-161,-62),K(205,-150,-66),K(162,-134,-68),K(143,-115,-70),K(140,-97,-70),K(151,-80,-68),K(205,-60,-62),K(262,-45,-48),K(305,-30,-28),K(318,-16,-8),K(300,-5,5),new r.Vector3(0,10,255),new r.Vector3(0,10,205),new r.Vector3(0,10,110),new r.Vector3(0,10,0)],ho=ze(me,0,new r.Vector3),_t={portalSeat:{position:new r.Vector3(0,ue,0),facing:new r.Vector3(0,0,1),radius:7,holeRadius:I},flyThrough:yt,gapIn:yt[2].clone(),gapOut:yt[7].clone(),rimCrest:new r.Vector3(0,10,205),viewpoints:{far:K(600,-168,-150),below:K(400,-172,-120),gallery:K(141,-100,-70),crest:new r.Vector3(0,12,212)},lookAt:new r.Vector3(0,ue,0),center:new r.Vector3(0,-60,0),falls:b.map(e=>{const o=new r.Vector3(Math.sin(e.a),0,Math.cos(e.a));return{angle:e.a,width:e.w,out:o,lip:o.clone().multiplyScalar(200.5),foot:o.clone().multiplyScalar(Xe(7.7)).setY(-290)}}),spireTop:lt,keelTip:ho,landSites:pt,spout:{foot:new r.Vector3(Je.x,At,Je.y),tip:new r.Vector3(Ie.x,-f.keelD,Ie.y)},lakeRadius:150,rimRadius:xt,keelRadius:80,galleryY:-68,mistY:-300,sunDirDefault:Mt.clone()};let ot=v.sunDir?y.uSun.value.clone():null,Rt=0;const uo=new r.Quaternion,Le=new r.Vector3,Ht=new r.Vector3;return{object:be,radius:215,height:372,center:_t.center.clone(),anchors:_t,uniforms:y,kit:{rockMaterial:()=>Pt(!1),floraMaterial:wt,rockTint:se,turfTint:rt,meadowTint:Nt,beginFlora(){te=Ne()},async endFlora(e){const o=te;return te=Ne(),nt(o,"aSway",2,e)},floraVertices:()=>te.n,addTree(e,o,t,a,n,i,s){Lt({x:e,y:o,z:t,h:a,frond:n,rich:s},i)},addRoot:vt,tube:de,ribbon:Bt,topHeight(e,o){const t=Math.hypot(e,o);return t>199?-999:t<133?-5:L(t,Math.atan2(e,o))}},ground:!1,groundY:-300,update(e,o,t){if(y.uTime.value=o,t&&(be.updateWorldMatrix(!0,!1),be.worldToLocal(Le.setFromMatrixPosition(t.matrixWorld)),y.uPortalGlow.value=Ct*(.45+.55*k(mo,po,Le.distanceTo(y.uPortalPos.value))),Ft.visible=Le.y>-2),!ot&&Rt<5){Rt++;let a=be;for(;a.parent;)a=a.parent;let n=null;a.traverse(i=>{!n&&i.isDirectionalLight&&(n=i)}),n&&(n.getWorldPosition(Le),n.target.getWorldPosition(Ht),Le.sub(Ht).lengthSq()>1e-6&&(ot=Le.clone().normalize()))}ot&&y.uSun.value.copy(ot).applyQuaternion(be.getWorldQuaternion(uo).invert())},dispose(){}}}export{xo as buildHero};
