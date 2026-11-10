import*as y from"three";import{clamp as ht,lerp as ke,smoothstep as Ze,makeRng as at,hashSeed as nt,makePath as X0}from"../kit/core.js";const $0=["#0E8FA8","#0B4F6C","#7FD6C8","#EDE8D6","#E3A82B","#1F3A2C","#C8421A"],f0={morning:{sun:"#FFE9C4",sunI:2.6,zen:"#2F6FC4",hor:"#CFE0EA",amb:.62},dawn:{sun:"#FFB9A0",sunI:1.1,zen:"#3B5C9E",hor:"#F2C9C2",amb:.5},afternoon:{sun:"#FFC27A",sunI:1.5,zen:"#3A6DB5",hor:"#E9D2B0",amb:.55},night:{sun:"#A9C0FF",sunI:.5,zen:"#070D22",hor:"#18274A",amb:.16}},Mt=[193.3,4.5,-143.8],ye=[.423,-.906],Le=[.906,.423];function Q0(){const c=[],f=h=>1.3+10.2*Ze(0,125,h);for(let h=0;h<=11;h++)c.push([-100,f(60-(225-h*20-5)),225-h*20]);for(let h=1;h<=9;h++){const ae=h/9*2.356,se=h/9;c.push([-45-55*Math.cos(ae),f(60+se*129.6),5-55*Math.sin(ae)])}for(let h=1;h<=16;h++){const ae=h/16,se=2.356-ae*1.92;c.push([64.6+100*Math.cos(se),11.5-(11.5-1.3)*Ze(.08,.73,ae),-104.6+100*Math.sin(se)])}for(let h=1;h<=6;h++){const ae=h*15;c.push([155.2+ye[0]*ae,1.3+Math.max(0,ae-30)*.0533,-62.3+ye[1]*ae])}return c}function Ft(c,k,f,h=1e9){let ae=1e9;for(let se=0;se<c.length-1;se++){const L=c[se],V=c[se+1];if(Math.min(L[1],V[1])>h)continue;const T=V[0]-L[0],E=V[2]-L[2],P=ht(((k-L[0])*T+(f-L[2])*E)/(T*T+E*E),0,1);ae=Math.min(ae,Math.hypot(k-L[0]-T*P,f-L[2]-E*P))}return ae}const d0=(c,k,f,h,ae,se,L)=>{const V=Math.abs(c-f)-ae+L,T=Math.abs(k-h)-se+L;return Math.min(Math.max(V,T),0)+Math.hypot(Math.max(V,0),Math.max(T,0))-L};function J0(c,k){const f=Mt[0]-ye[0]*3,h=Mt[2]-ye[1]*3,ae=(V,T)=>({along:(V-f)*ye[0]+(T-h)*ye[1],across:(V-f)*Le[0]+(T-h)*Le[1]});function se(V,T){const E=d0(V,T,-47.5,80,97.5,155,60),P=d0(V,T,87.5,-67.5,147.5,102.5,55),U=ht(.5+.5*(P-E)/30,0,1);let Q=ke(P,E,U)-30*U*(1-U);Q+=k*(8*c.n2(V*.011+3.1,T*.011)+2.5*c.n2(V*.045,T*.045+7.7));const fe=ae(V,T),ue=1-Ze(45,85,Math.abs(fe.across));return ke(Q,Math.max(Q,fe.along),ue)}function L(V,T){const E=se(V,T),P=-E,U=ae(V,T);let Q;if(P<=0){const ue=-P;Q=.03+.4*Ze(0,3.5,ue)+.07*ue+(.5+.5*c.n2(V*.06,T*.06))*.9*Ze(1,12,ue);const Pe=Math.exp(-((V+100)*(V+100))/260)*Ze(205,226,T);Q=ke(Q,-.12,Pe)}else{const ue=ht(P/82,0,1),Pe=20.6*(1-(1-ue)*(1-ue)),Ye=.25+3.5*Ze(0,14,P)+.5*Ze(20,60,P),Xe=Ze(84,124,V+.12*T);Q=-ke(Pe,Ye,Xe)+.55*c.n2(V*.035+9,T*.035)*Ze(0,12,P)+.25*c.n2(V*.11,T*.11+4)*Ze(0,6,P),Q=Math.min(Q,-.05-.02*Math.min(P,6))}const fe=1-Ze(15,23,Math.abs(U.across));if(fe>0&&U.along>-3){Q=ke(Q,.3+.05*c.n2(V*.3,T*.3)+.012*Math.max(0,U.along-20),fe*Ze(-.3,1.6,U.along));const ue=(.6+.16*c.n2(U.across*.35,5.5))*Math.exp(-(U.along*U.along)/1.7);Q=Math.max(Q,ke(-9,ue,fe))}return Q}return{sdf:se,bedAt:L,sill:ae,SX:f,SZ:h}}function Nt(){return{p:[],c:[],f:[],i:[]}}function Ve(c,k,f,h,ae,se,L,V){const T=c.p.length/3,E=[0,0,0],P=[0,0,0];for(let U=0;U<k;U++)for(let Q=0;Q<f;Q++)h(U,Q,E),c.p.push(E[0],E[1],E[2]),ae(U,Q,P),c.c.push(P[0],P[1],P[2]),c.f.push(se?se(U,Q):0);for(let U=0;U<k-1;U++)for(let Q=0;Q<f;Q++){const fe=T+U*f+Q,ue=T+U*f+(Q+1)%f,Pe=fe+f,Ye=ue+f;c.i.push(fe,Pe,ue,ue,Pe,Ye)}for(const[U,Q,fe]of[[L,0,!1],[V,k-1,!0]]){if(!U)continue;const ue=c.p.length/3;c.p.push(U[0],U[1],U[2]),ae(Q,0,P),c.c.push(P[0],P[1],P[2]),c.f.push(se?se(Q,0):0);for(let Pe=0;Pe<f;Pe++){const Ye=T+Q*f+Pe,Xe=T+Q*f+(Pe+1)%f;fe?c.i.push(Ye,ue,Xe):c.i.push(Ye,Xe,ue)}}}function m0(c){const k=new y.BufferGeometry;return k.setAttribute("position",new y.Float32BufferAttribute(c.p,3)),k.setAttribute("aCol",new y.Float32BufferAttribute(c.c,3)),k.setAttribute("aFlex",new y.Float32BufferAttribute(c.f,1)),k.setIndex(c.i),k.computeVertexNormals(),k}async function fn(c,k,f=16e3){const h=c.attributes.position.array,ae=c.index.array,se=h.length/3,L=new Float32Array(se*3);for(let V=0,T=0;V<ae.length;V+=3){const E=ae[V]*3,P=ae[V+1]*3,U=ae[V+2]*3,Q=h[U]-h[P],fe=h[U+1]-h[P+1],ue=h[U+2]-h[P+2],Pe=h[E]-h[P],Ye=h[E+1]-h[P+1],Xe=h[E+2]-h[P+2],It=fe*Xe-ue*Ye,zt=ue*Pe-Q*Xe,ft=Q*Ye-fe*Pe;L[E]+=It,L[E+1]+=zt,L[E+2]+=ft,L[P]+=It,L[P+1]+=zt,L[P+2]+=ft,L[U]+=It,L[U+1]+=zt,L[U+2]+=ft,++T===f&&(T=0,await k())}await k();for(let V=0,T=0;V<se;V++){const E=V*3,P=Math.hypot(L[E],L[E+1],L[E+2])||1;L[E]/=P,L[E+1]/=P,L[E+2]/=P,++T===6e4&&(T=0,await k())}c.setAttribute("normal",new y.BufferAttribute(L,3))}async function dn(c,k){const f=new y.BufferGeometry;return f.setAttribute("position",new y.Float32BufferAttribute(c.p,3)),await k(),f.setAttribute("aCol",new y.Float32BufferAttribute(c.c,3)),await k(),f.setAttribute("aFlex",new y.Float32BufferAttribute(c.f,1)),f.setIndex(c.i),await k(),await fn(f,k),f}const qe=c=>new y.Color(c);function Ot(c,k,f,h){const ae=h.sides||(h.near?12:7),se=h.rings||(h.near?26:9),L=[h.ax,h.ay,h.az],V=Math.abs(L[1])>.9?[1,0,0]:[0,1,0];let T=[L[1]*V[2]-L[2]*V[1],L[2]*V[0]-L[0]*V[2],L[0]*V[1]-L[1]*V[0]];const E=Math.hypot(T[0],T[1],T[2])||1;T=[T[0]/E,T[1]/E,T[2]/E];const P=[T[1]*L[2]-T[2]*L[1],T[2]*L[0]-T[0]*L[2],T[0]*L[1]-T[1]*L[0]],U=h.bend??1,Q=h.taper??.6,fe=k()*100,ue=k.range(-1,1)*h.L*.03*U,Pe=k.range(-1,1)*h.L*.022*U,Ye=k()*6.28,Xe=k.int(4,7),It=(re,le)=>{const J=ue*Math.sin(re*Math.PI),D=Pe*Math.sin(re*4+Ye)*re,de=re*h.L;return le[0]=h.x+L[0]*de+P[0]*J+T[0]*D,le[1]=h.y+L[1]*de+P[1]*J+T[1]*D,le[2]=h.z+L[2]*de+P[2]*J+T[2]*D,le},zt=(re,le)=>{const J=re*h.L,D=Math.cos(le),de=Math.sin(le);let he=h.r0*(1-Q*re)*(1+.17*f.n3(D*1.3+fe,de*1.3,J*.5));return h.near&&(he*=1+.07*f.n3(D*4+fe,de*4,J*2.1)),h.crust&&(he*=1+.12*Math.sin(le*3+J*.8+Ye)*(.6+.4*f.n3(J*.4,fe,1.7))+.07*Math.sin(le*5-J*1.9+fe)+.2*Math.max(0,f.n3(D*1.1+fe*1.3,de*1.1,J*.75))),he*(1+h.flare*Math.exp(-J/(h.r0*2.4))*(.5+.5*Math.abs(Math.sin(le*Xe*.5+Ye))))},ft=h.bone,$e=[0,0,0],Vt=(re,le,J,D,de=1)=>{const he=.84+.16*f.n3(re*.9+fe,le*.9,J*.9),me=.03*f.n3(re*.3,J*.3,fe);D[0]=ft[0]*he*de+me,D[1]=ft[1]*he*de,D[2]=ft[2]*he*de-me},Ia=re=>Math.pow(re/(se-1),1.45);let _e=[0,0,0];Ve(c,se,ae,(re,le,J)=>{const D=Ia(re),de=le/ae*6.2832;It(D,$e);let he=zt(D,de);re===se-1&&(he*=.5+.5*((le*7+Xe)%3===0?1:.35));const me=Math.cos(de)*he,Qe=Math.sin(de)*he,ee=re===se-1?(le*5+Xe)%4*.12*h.r0*3:0;J[0]=$e[0]+P[0]*me+T[0]*Qe+L[0]*ee,J[1]=$e[1]+P[1]*me+T[1]*Qe+L[1]*ee,J[2]=$e[2]+P[2]*me+T[2]*Qe+L[2]*ee,_e=J},(re,le,J)=>Vt(_e[0],_e[1],_e[2],J,re===se-1?.8:1),null,[h.x-L[0]*h.r0*.3,h.y-L[1]*h.r0*.3,h.z-L[2]*h.r0*.3],[h.x+L[0]*(h.L-.1)+P[0]*h.r0*.1,h.y+L[1]*(h.L-.1)+P[1]*h.r0*.1,h.z+L[2]*(h.L-.1)+P[2]*h.r0*.1]);const Ta=h.near?4:3,ia=h.near?5:3;for(let re=0;re<h.nRoots;re++){const le=(re+k.range(-.3,.3))/h.nRoots*6.2832,J=h.r0*(h.near?k.range(3.4,7.4):k.range(2.4,4.6))*(h.rootLen??1),D=k.range(-.55,.25),de=k.range(-.5,.5),he=h.r0*(h.near?k.range(.38,.58):k.range(.5,.78)),me=(ee,W)=>{const B=le+de*ee*ee,Se=h.r0*1.15+ee*J,ve=h.r0*.35+D*ee*ee*J,et=Math.cos(B),Ge=Math.sin(B);return W[0]=h.x+L[0]*ve+(P[0]*et+T[0]*Ge)*Se,W[1]=h.y+L[1]*ve+(P[1]*et+T[1]*Ge)*Se,W[2]=h.z+L[2]*ve+(P[2]*et+T[2]*Ge)*Se,B},Qe=[0,0,0];me(1.08,Qe),Ve(c,ia,Ta,(ee,W,B)=>{const Se=ee/(ia-1),ve=me(Se,$e),et=he*Math.pow(1-Se*.93,.8)+.015,Ge=W/Ta*6.2832,rt=Math.cos(Ge)*et,Me=Math.sin(Ge)*et*1.25,De=-Math.sin(ve),dt=Math.cos(ve);B[0]=$e[0]+L[0]*rt+(P[0]*De+T[0]*dt)*Me,B[1]=$e[1]+L[1]*rt+(P[1]*De+T[1]*dt)*Me,B[2]=$e[2]+L[2]*rt+(P[2]*De+T[2]*dt)*Me,_e=B},(ee,W,B)=>Vt(_e[0],_e[1],_e[2],B,.94),null,null,Qe)}if(!h.near&&h.nRoots){const le=[],J=[[.9,1.15],[.2,2.6],[-.3,2.3]];for(let D=0;D<8;D++)le.push(k.range(.7,1.25));Ve(c,3,8,(D,de,he)=>{const me=de/8*6.2832+Ye,Qe=h.r0*J[D][1]*(D?le[de]:1),ee=h.r0*J[D][0],W=Math.cos(me),B=Math.sin(me);he[0]=h.x+L[0]*ee+(P[0]*W+T[0]*B)*Qe,he[1]=h.y+L[1]*ee+(P[1]*W+T[1]*B)*Qe,he[2]=h.z+L[2]*ee+(P[2]*W+T[2]*B)*Qe,_e=he},(D,de,he)=>Vt(_e[0],_e[1],_e[2],he,D===1?1:.84),null,null,[h.x-L[0]*h.r0*.55,h.y-L[1]*h.r0*.55,h.z-L[2]*h.r0*.55])}const ot=h.crust?6:h.near?5:h.stubFat?4:3,Dt=h.crust?4:h.near?3:2;for(let re=0;re<h.nStubs;re++){const le=k.range(.14,.96),J=k()*6.2832;let D=k.range(h.stubLen[0],h.stubLen[1])*(1-.45*le)*(h.stubK??1);const de=zt(le,J)*k.range(.24,.36)*(h.stubFat||1);h.crust&&(D*=[1,.5,1.55,.75][re&3]);const he=Math.cos(J),me=Math.sin(J),Qe=P[0]*he+T[0]*me,ee=P[1]*he+T[1]*me,W=P[2]*he+T[2]*me;let B=Qe+L[0]*h.stubLift,Se=ee+L[1]*h.stubLift,ve=W+L[2]*h.stubLift;const et=Math.hypot(B,Se,ve);B/=et,Se/=et,ve/=et;const Ge=[0,0,0];It(le,Ge);const rt=zt(le,J)*.75,Me=Ge[0]+Qe*rt,De=Ge[1]+ee*rt,dt=Ge[2]+W*rt;h.ceilAt&&Se>.05&&(D=Math.max(.12,Math.min(D,(h.ceilAt(Me+B*D,dt+ve*D)-De)/Se)));const la=L[0]-B*(L[0]*B+L[1]*Se+L[2]*ve),Bt=L[1]-Se*(L[0]*B+L[1]*Se+L[2]*ve),qa=L[2]-ve*(L[0]*B+L[1]*Se+L[2]*ve),Ct=Math.hypot(la,Bt,qa)||1,Ae=[la/Ct,Bt/Ct,qa/Ct],ca=[Se*Ae[2]-ve*Ae[1],ve*Ae[0]-B*Ae[2],B*Ae[1]-Se*Ae[0]],mt=k.range(-.25,.25)*D;Ve(c,Dt,ot,(Wt,it,Tt)=>{const pt=Wt/(Dt-1)*.93,ha=Wt===Dt-1,Ce=it/ot*6.2832,be=mt*pt*pt;let Ht=de*(1-(h.blunt?.2:h.near?.3:.5)*pt)*(ha&&(h.near||h.blunt)?.8+.3*(it%2):1),vt=pt*D;h.crust&&(Ht=de*(Wt===0?1.55:1-.3*pt)*(ha?.45+.6*((it*3+re)%2):1),ha&&(vt+=((it*2+re)%3-1)*.11*D));const Zt=Math.cos(Ce)*Ht,Lt=Math.sin(Ce)*Ht;Tt[0]=Me+B*vt+Ae[0]*(Zt+be)+ca[0]*Lt,Tt[1]=De+Se*vt+Ae[1]*(Zt+be)+ca[1]*Lt,Tt[2]=dt+ve*vt+Ae[2]*(Zt+be)+ca[2]*Lt,_e=Tt},(Wt,it,Tt)=>Vt(_e[0],_e[1],_e[2],Tt,Wt===Dt-1?.62:.9),null,null,h.crust?[Me+B*D*.78+Ae[0]*mt*.6,De+Se*D*.78+Ae[1]*mt*.6,dt+ve*D*.78+Ae[2]*mt*.6]:h.blunt?[Me+B*D*.96+Ae[0]*mt*.86,De+Se*D*.96+Ae[1]*mt*.86,dt+ve*D*.96+Ae[2]*mt*.86]:[Me+B*D+Ae[0]*(mt+de*.3),De+Se*D+Ae[1]*(mt+de*.3),dt+ve*D+Ae[2]*(mt+de*.3)])}const Jt=[],ea=Math.max(6,Math.round(h.L/.7));for(let re=0;re<=ea;re++){const le=re/ea,J=It(le,[0,0,0]);Jt.push({x:J[0],y:J[1],z:J[2],r:h.r0*(1-Q*le),t:le})}return Jt}function p0(c,k,f,h){const ae=c.r0*(1.2+(c.nRoots?6.3:c.flare));for(let se=0;se<=12;se++){const L=se/12,V=c.x+c.ax*L*c.L,T=c.y+c.ay*L*c.L,E=c.z+c.az*L*c.L,P=se===0?ae:c.r0*(1-.6*L)+c.stubLen[1]*.8;if(T+P>h&&Ft(k,V,E,9)<f+(se===0?ae:0))return!1}return!0}const ra=`
uniform float uTime; uniform vec3 uSun, uSunU, uSunCol, uZen, uHor, uAmbZ, uAmbH; uniform float uAmb, uScat, uSnow, uDayK, uMoon, uPaleK;
uniform vec3 uW1, uW2, uW3, uSlopeFill, uOutFill; uniform vec4 uGate, uIsle; uniform vec2 uGateK; uniform float uLowT;
// late light: the sun reaches the lake only in a band that comes down the side valley (uGate: unit vector across the band,
// its offset, its half-width; uGateK: the sun's strength outside and inside it). Without a band both strengths are 1.
float sunGateH(vec2 q){ return mix(uGateK.x, uGateK.y, step(1., uGate.w) * (1. - smoothstep(.55, 1., abs(dot(q, uGate.xy) - uGate.z) / max(uGate.w, 1.)))); }
float h21(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1., 0.)), f.x), mix(h21(i + vec2(0., 1.)), h21(i + vec2(1., 1.)), f.x), f.y); }
float fbm(vec2 p){ float s = 0., a = .5; for (int i = 0; i < 4; i++) { s += a * vn(p); p = p * 2.03 + vec2(17.1, 9.2); a *= .5; } return s / .9375; }
// colour of the water column by path length, and what it does to a lit surface seen through it
vec3 waterCol(float d){ return mix(mix(uW1, uW2, smoothstep(.5, 8., d)), uW3, smoothstep(8., 22., d)); }
vec3 uwAbsorb(vec3 lit, float depth, float vy){
  float pl = depth * (.6 + .4 / max(vy, .14)), k = 1. - exp(-pl * .026);       // looked at along the water, a sunk thing lies behind a long reach of it
  vec3 wc = waterCol(pl);
  return lit * exp(-pl * vec3(.065, .015, .0105)) * (1. - k * .7) + wc * k * uScat;
}`,eo=`
float cnet(vec2 p){ float a = vn(p), b = vn(p * 1.83 + vec2(5.2, 1.3)); float r = 1. - abs(2. * a - 1.), q = 1. - abs(2. * b - 1.);
  r *= r; r *= r * r; q *= q; q *= q * q; return r + .6 * q; }
float caust(vec2 p, float t){ vec2 w = vec2(vn(p * .31 + t * .12), vn(p * .31 + 7.3 - t * .1)) * 1.5;
  return cnet(p * .62 + w + vec2(t * .13, t * .07)) + .8 * cnet(p * .95 - w * 1.2 + vec2(-t * .11, t * .14) + 9.1); }`,v0=`
uniform float uFrontZ, uHealZ, uTilt; uniform vec3 uLee; uniform vec2 uLeeR;
float gustAt(vec2 q, out float behind, out float heal, out float lee){
  float wob = (fbm(vec2(q.x * .021, uFrontZ * .004)) - .5) * 44. + (vn(vec2(q.x * .12, 2.)) - .5) * 7.;
  behind = uFrontZ + wob + uTilt * q.x - q.y;
  heal = 1. - smoothstep(-45., 45., q.y - uHealZ + (fbm(q * .016) - .5) * 70.);
  lee = uLee.z * (1. - smoothstep(.5, 1., length((q - uLee.xy) / uLeeR) + .22 * (vn(q * .045) - .5)));
  return smoothstep(-1.5, 2.5, behind) * (1. - heal) * (1. - lee);
}`,Aa=`
#include <common>
#include <fog_pars_vertex>
attribute vec3 aCol; attribute float aFlex;
uniform float uTime;
varying vec3 vL, vN, vC, vV; varying float vFlex;
void main(){
  vec3 p = position, n = normal, c = aCol;
  #ifdef K_WOOD
    // far off a standing trunk is thinner than a pixel and a half and would shimmer as a hairline: it is held to about two
    if (p.y > .6) {
      vec4 wq = modelMatrix * vec4(p, 1.); float hn = length(n.xz);
      p.xz += n.xz / max(hn, 1e-3) * (step(.35, hn) * max(0., distance(wq.xyz, cameraPosition) * .0042 - .4) * smoothstep(.6, 2., p.y));
    }
  #endif
  #ifdef K_TREE
    p = (instanceMatrix * vec4(p, 1.)).xyz; n = mat3(instanceMatrix) * n; c *= instanceColor;
    float ph = p.x * .31 + p.z * .27;
    p.x += aFlex * (sin(uTime * 1.6 + ph) * .14 + sin(uTime * 5.3 + p.y * 2.1 + p.x * 1.7) * .04);
    p.z += aFlex * (sin(uTime * 1.25 + ph * 1.3) * .11 + cos(uTime * 4.7 + p.y * 1.9 + p.z * 1.3) * .04);
  #endif
  #ifdef K_GARDEN
    float under = step(p.y, 0.), ph = p.x * 1.3 + p.z * 1.7;
    p.x += aFlex * mix(sin(uTime * 6. + ph * 3.) * .025 + sin(uTime * 1.9 + ph) * .05, sin(uTime * 1.1 + ph * .6 - aFlex * 3.) * .2 - aFlex * .25, under);
    p.z += aFlex * mix(cos(uTime * 5. + ph * 2.) * .025, cos(uTime * .9 + ph * .5 - aFlex * 2.) * .15 + aFlex * .5, under);
  #endif
  vL = p; vN = n; vC = c; vFlex = aFlex;
  if (p.y < 0.) p.y *= .75;                                   // apparent depth
  vec4 wp = modelMatrix * vec4(p, 1.);
  vV = (cameraPosition - wp.xyz) * mat3(modelMatrix);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Fa=`
#include <common>
#include <fog_pars_fragment>
${ra}
${eo}
uniform vec3 uBone, uAmber, uJade, uGold, uScar, uMoss, uAlgae;
varying vec3 vL, vN, vC, vV; varying float vFlex;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  #ifdef K_ISLE
    // (the islet's steps are cut square: the face's own normal, not the rounded one of its vertices, tells tread from riser)
    vec3 Nf = normalize(cross(dFdx(vL), dFdy(vL)) + vec3(0., 1e-6, 0.)); if (Nf.y < 0.) Nf = -Nf;
    N = normalize(mix(N, Nf, .45) + vec3(0., .5, 0.));      // the islet's steep skirt takes some of its crown's light (a pale pedestal, not a dark plug), and its steps still read
  #endif
  vec3 V = normalize(vV + vec3(0., 1e-5, 0.));
  float depth = max(-vL.y, 0.), under = step(vL.y, 0.), wl = exp(-abs(vL.y) * 7.);
  vec3 alb = vC;
  #ifdef K_BED
    float n1 = fbm(vL.xz * .043), n2 = fbm(vL.xz * .11 + 31.), n3 = fbm(vL.xz * .85), sp = vn(vL.xz * 4.3);
    vec3 marl = uBone * (.3 + .26 * n3) * vec3(.94, 1., .97);
    marl = mix(marl, uAmber * mix(1., 1.5, smoothstep(5., 17., depth)), smoothstep(.5, .64, n1) * .8);
    marl = mix(marl, uJade, smoothstep(.53, .68, n2) * .75);
    marl *= (.8 + .4 * sp) * mix(1., 1.4, smoothstep(4., 13., depth));     // (round 12) the deep floor is WHITE marl: under the felled forest it stays pale enough to carry the trunks' shadows and its amber and jade
    vec2 lc = floor(vL.xz * 1.6); float lr = h21(lc);                    // sunken leaves
    float ld = length(fract(vL.xz * 1.6) - .5 - .25 * (vec2(h21(lc + 5.), h21(lc + 9.)) - .5));
    marl = mix(marl, mix(uGold, uScar, step(.5, h21(lc + 2.))) * .7, step(.955, lr) * smoothstep(.22, .16, ld));
    // (round 11) THE OUTLET (world: within 60 m of the rim that holds the lake, at (-100, 246)) is travertine, never mud:
    // cream and gold rimstone terraces under clear water, a white lip on every one, and the bank beside it the same stone
    float outK = 1. - smoothstep(24., 62., length(vL.xz - vec2(-100., 246.)));
    // (round 12) ITS FLOOR IS THE SHOAL'S OWN RIMSTONE, pool for pool: the same cells the world paints on the outlet tongue
    // (the same warp and hash in world coordinates, so a pool that lies across the join of the two meshes at z = 242 is one
    // pool), each 3 m by 1.5 m, turquoise over pale marl, held by a pale dam. (It was the level lines of a noise: from
    // 1.3 m up one long mauve swirl, 'a stretched texture'.)
    vec3 travO = marl;
    if (outK > .002) {
      vec2 rpO = vL.xz * vec2(.3, .62) + vec2(vn(vL.xz * .33), vn(vL.xz * .33 + 5.)) * 1.2, riO = floor(rpO), rfO = fract(rpO); float O1 = 9., O2 = 9.;
      for (int j = -1; j <= 1; j++) for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j)), r = g + vec2(h21(riO + g + 3.), h21(riO + g + 19.)) * .76 + .12 - rfO; float dd = dot(r, r);
        if (dd < O1) { O2 = O1; O1 = dd; } else if (dd < O2) O2 = dd;
      }
      float rdO = sqrt(O2) - sqrt(O1), dO = length(vV), wdO = .05 + dO * .004;                // (the dams widen and dim with distance: never a net of dots)
      float damO = smoothstep(wdO, wdO * .4, rdO) * min(1., .16 / wdO), poolO = smoothstep(.14, .5, rdO);
      float knO = vn(vL.xz * 15.) * .55 + vn(vL.xz * 37. + 9.) * .45, nrO = 1. - smoothstep(5., 16., dO);
      travO = uBone * vec3(.62, .57, .42) * (.74 + .2 * n3 + .5 * (knO - .5) * nrO) * mix(vec3(1.), vec3(1.06, .9, .6), smoothstep(.4, .7, n1 * .5 + .5 * vn(vL.xz * .6 + 5.)));
      travO = mix(travO, uW1 * .7 + uBone * .14, poolO * .6);                                // the pools are turquoise, as on the shoal above them
      travO *= 1. - .25 * smoothstep(wdO * 1.6, wdO, rdO) * (1. - damO);                      // a dark seam under each dam
      travO = mix(travO, uBone * .9, damO * .9);
    }
    marl = mix(marl, travO, outK);
    vec3 bank = mix(vC * (.7 + .6 * n3), travO, outK * .8);
    // (round 12) the banks of the outlet are the same mossed travertine as the shoulders of the shoal they run into: moss in
    // drifts from a hand above the water, the stone showing between them (they were one flat cream either side of the water)
    bank = mix(bank, uMoss * (.55 + .7 * n2) * mix(vec3(1.), vec3(1.25, 1.1, .7), smoothstep(.45, .7, vn(vL.xz * .31 + 2.))), outK * smoothstep(.1, .45, vL.y) * smoothstep(.3, .52, n3 * .45 + .55 * vn(vL.xz * .23 + 17.)) * .85);
    float lit2 = step(.72, h21(floor(vL.xz * 3.1))) * smoothstep(.3, .2, length(fract(vL.xz * 3.1) - .5));   // leaf litter
    float bfar = smoothstep(40., 140., length(vV));                      // far off the litter is no red band: moss and pale sedge in patches, a wider pale hair
    bank = mix(bank, mix(uGold, uScar, h21(floor(vL.xz * 3.1) + 4.)) * .8, lit2 * smoothstep(.15, .6, vL.y) * .85 * (1. - .85 * bfar));
    bank = mix(bank, mix(uMoss * .8, uBone * vec3(.66, .6, .42), smoothstep(.4, .62, n1)) * (.7 + .6 * n2), bfar * .75 * smoothstep(.05, .5, vL.y));
    bank = mix(bank, uBone * (.62 + .3 * n3) * vec3(1., .97, .9), exp(-max(vL.y, 0.) * mix(8., 3., bfar)) * .8);         // the white hair of shoreline
    bank = mix(bank, vec3(.8, .84, .9), uSnow * smoothstep(.2, .7, vL.y) * (.55 + .45 * n3));
    alb = mix(bank, marl, under);
    #ifdef K_ISLE
      // The islet is travertine, rimstone all the way down: every built step is a tread holding a shallow pool behind a white
      // lip over a riser draped cream and amber, and fine terracettes follow the contours between the steps. Dry, it is cream
      // with a white rim at the waterline and moss on its crown. (uIsle.w: its brightness by the hour.)
      float iw = vn(vL.xz * .8 + 3.), trI = fract(vL.y * mix(4.6, 1.5, under) + .8 * iw + .25 * vn(vL.xz * 3.7 + 9.));
      float lipI = smoothstep(0., .1, trI) * (1. - smoothstep(.1, .32, trI)), creI = 1. - smoothstep(0., .45, trI);
      // (vFlex: 1 along the outer edge of a tread, the lip its pool stands behind, and at the top of the riser under it)
      float flatI = smoothstep(.55, .8, Nf.y), edgeI = flatI * smoothstep(.66, .93, vFlex + .16 * (iw - .5)), drapI = (1. - flatI) * (.4 + .6 * vFlex);
      float pitI = 1. - smoothstep(.2, .38, vn(vL.xz * 8. + vL.y * 6.) * .6 + vn(vL.xz * 21. + 5.) * .4);
      vec3 travI = uBone * (.5 + .16 * n3 + .1 * sp) * mix(vec3(1.), vec3(1.04, .9, .68), smoothstep(.42, .7, n1 * .6 + .5 * iw));
      travI = mix(travI, uBone * vec3(.52, .39, .22) * (.66 + .34 * sp + .5 * vn(vL.xz * 5.3)), drapI * mix(.6, .85, under));            // drapery on the risers, in streaks, darkest under each lip
      travI *= (1. - .35 * pitI) * (1. + flatI * (.3 * lipI - .22 * creI));
      travI = mix(travI, uBone * .86, max(lipI * .4 * flatI, edgeI * .92));                                             // the white lips
      vec3 poolI = mix(travI, uW1 * .8 + .1, .5 * flatI * (1. - lipI) * (1. - edgeI));                                 // the pools on the treads: pale turquoise over white
      vec2 lcI = floor(vL.xz * 3.1);
      vec3 crownI = vC * (.7 + .6 * n3);
      crownI = mix(crownI, mix(uGold, uScar, h21(lcI + 4.)) * .8, lit2 * step(.62, h21(lcI + 7.)) * .85);              // a few fallen leaves, not a speckle
      crownI = mix(crownI, vec3(.8, .84, .9), uSnow * (.55 + .45 * n3));
      vec3 dryI = mix(travI, uW1 * .5 + .32, .34 * flatI * (1. - edgeI) * smoothstep(.3, .6, iw + .3 * n3));              // a film of water stands behind some of the dry lips too
      dryI = mix(dryI, crownI, smoothstep(.74, 1., vL.y + .2 * n3) * .9);
      dryI = mix(dryI, uBone * .86, exp(-max(vL.y, 0.) * 4.) * .9 * (1. - .45 * flatI));                               // the white rim at the waterline
      // (round 11) seen from the turn, 17 m off, the islet is rimstone you could count: every terracette a pale lip over a
      // dark crease, amber and umber drapery down the risers with a shadow under each lip, cushions of moss and a scatter of
      // fallen leaves on the treads, and the wet treads shining (wetI, below)
      float nrI = 1. - smoothstep(45., 110., length(vV));
      dryI *= 1. + nrI * (.34 * lipI - .3 * creI) * (1. - flatI * .5);
      dryI *= 1. - nrI * .42 * (1. - flatI) * smoothstep(.55, 1., vFlex);
      dryI = mix(dryI, uBone * vec3(.4, .27, .13) * (.7 + .6 * sp), nrI * (1. - flatI) * smoothstep(.5, .72, vn(vL.xz * 2.3 + 11.)) * .55);
      float mossI = flatI * (1. - edgeI) * smoothstep(.5, .58, vn(vL.xz * 1.3 + 7.) * .6 + vn(vL.xz * 3.7 + 2.) * .4) * (1. - smoothstep(.74, 1., vL.y + .2 * n3));
      dryI = mix(dryI, uMoss * (.55 + .7 * vn(vL.xz * 9.)) * (.8 + .4 * n3), mossI * .85 * nrI);
      float leafI = lit2 * flatI * (1. - edgeI) * step(.3, h21(lcI + 7.)) * (1. - mossI);
      dryI = mix(dryI, mix(uGold, uScar, step(.6, h21(lcI + 4.))) * .85, leafI * .9 * nrI);
      float wetI = flatI * (1. - edgeI) * smoothstep(.3, .6, iw + .3 * n3) * (1. - mossI) * (1. - under) * nrI;
      float i1 = vn(vL.xz * 1.7 + 13.), netI = smoothstep(.86, .98, 1. - abs(2. * i1 - 1.)) * flatI * (1. - edgeI) * nrI;      // small dams on every tread, a pool behind each
      dryI = mix(dryI, uBone * .9, netI * .5 * (1. - mossI));
      poolI = mix(poolI, uW1 * .62 + uBone * .12, .34 * flatI * (1. - edgeI) * nrI * smoothstep(.3, .9, abs(2. * i1 - 1.)));
      poolI = mix(poolI, uBone * .92, netI * .7);
      poolI *= 1. - nrI * .3 * (1. - flatI) * smoothstep(.55, 1., vFlex);
      alb = mix(dryI, poolI, under) * uIsle.w;
    #endif
  #endif
  #ifdef K_WOOD
    float g = fbm(vec2(vL.x * 2.3 + vL.y * 3.1, vL.z * 2.3 - vL.y * 1.7)), g2 = vn(vL.xz * 9. + vL.y * 7.);
    float ndW = (1. - smoothstep(5., 22., length(vV))) * uPaleK;      // within a stone's throw of the lens sunk wood is bone, not mint
    vec3 crust = alb * (.8 + .32 * g) * (.9 + .15 * g2);
    float algK = smoothstep(.2, .9, N.y) * (.3 + .5 * g) * .86 * (.3 + .7 * smoothstep(.4, .62, fbm(vec2(vL.x * .9 - vL.z * .6, vL.z * .9 + vL.x * .6) + 3.))) * (1. - .5 * ndW);
    crust = mix(crust, uAlgae * 1.15, algK) * mix(.74, 1., smoothstep(3., 9., depth));   // (algae in drifts along the upper side, bone between them)   // wood near the surface is not paper white
    float nd = 1. - smoothstep(3., 10., length(vV));          // under the lens: crust lobes with dark seams, and algae in the hollows
    vec3 wv = vL + vec3(sin(uTime * 1.9 + vL.z * 2.7 + vL.x * 1.1), 0., cos(uTime * 1.5 + vL.x * 3.1 - vL.z * .9)) * (.035 * nd * under);   // (the pattern swims a little: it is seen through rippled water)
    float lobe = fbm(vec2(wv.x * 6.5 + wv.y * 4., wv.z * 6.5 - wv.y * 3.)), pit = vn(wv.xz * 27. + wv.y * 21.), lobe2 = vn(vec2(wv.x * 15. - wv.y * 9., wv.z * 15. + wv.y * 8.));
    float seam = max(smoothstep(.05, .0, abs(lobe - .5)), .7 * smoothstep(.06, .0, abs(lobe2 - .5)));
    crust *= mix(1., (.6 + .7 * pit) * (1. - .55 * seam) * (.82 + .36 * smoothstep(.35, .7, lobe2)), nd);
    crust = mix(crust, mix(vec3(dot(crust, vec3(.3, .5, .2))), crust, .55) * vec3(1.06, 1., 1.02), nd * .7 * uPaleK);          // (under the lens the algae's green gives way to grey bone)
    crust = mix(crust, uAlgae * (.6 + .5 * pit), nd * smoothstep(.56, .68, lobe) * .4);
    crust = mix(crust, crust * vec3(.5, .42, .3), nd * smoothstep(.62, .8, vn(wv.xz * 3.1 + wv.y * 2.3 + 7.)) * .5);          // patches where the crust has flaked to dark wood
    {                                                           // the crust's lobes stand out of the wood: their relief takes the light
      float hb = (lobe * .62 + lobe2 * .38) * nd * under, hbx = dFdx(hb), hby = dFdy(hb);
      vec3 dpx = dFdx(vL), dpy = dFdy(vL), r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
      N = normalize(N * max(abs(det), 1e-7) - (hbx * r1 + hby * r2) * (sign(det) * .11) + vec3(0., 1e-7, 0.));
    }
    vec3 dry = alb * vec3(.66, .65, .63) * (.7 + .5 * g) * (.82 + .3 * g2);
    dry = mix(dry, uMoss * (.7 + .6 * g2), smoothstep(.25, .8, N.y + .5 * g - .25) * max(smoothstep(2.6, .2, vL.y), vFlex * .8) * .9);   // (vFlex 1: the arch, mossed along its whole upper side)
    float stand0 = 1. - smoothstep(.3, .65, abs(N.y)), stand = max(stand0, vFlex), ndd = 1. - smoothstep(14., 42., length(vV)), al = mix(vL.y, vL.x * .8 + vL.y * .45, vFlex);
    float cq = mix(N.x * 3.7 + N.z * 2.3 + vL.x * .9 + vL.z * .6 + vL.y * .2, N.y * 3.7 + N.z * 3.1 + vL.z * .9 + vL.y * .25, vFlex);   // (the grain winds round the shaft)
    float ck = vn(vec2(cq * 1.6, al * .33)), ck2 = vn(vec2(cq * 6.5 + 3., al * 1.1));   // weathered standing wood: long cracks, fine grain, lost bark in plates
    dry *= mix(1., (1. - .5 * smoothstep(.07, .0, abs(ck - .5))) * (.86 + .28 * ck2) * (.9 + .2 * smoothstep(.45, .62, vn(vec2(cq * .7 + 9., al * .22)))), stand * ndd);
    dry = mix(dry, dry * vec3(.5, .41, .34), smoothstep(.5, .62, vn(vec2(cq * .8 + 9., al * .21))) * stand * .7 * (1. - smoothstep(60., 140., length(vV))));   // plates of bark not yet fallen
    float spir = fract(atan(N.z, N.x + 1e-5) * .15915 + vL.y * .085 + vL.x * .013 + .05 * (ck - .5));   // one deep check winds up every shaft the lens passes
    dry *= 1. - (.62 * smoothstep(.022, .004, abs(spir - .5)) + .25 * smoothstep(.34, .5, vn(vec2(cq * 2.3, al * 3.1))) * smoothstep(.75, .9, vn(vec2(cq * .9 + 5., al * .5)))) * stand0 * (1. - smoothstep(12., 30., length(vV)));
    dry *= 1. - .3 * smoothstep(1.5, .35, vL.y) * stand;                  // damp wood over the water
    dry = mix(dry, alb, exp(-max(vL.y, 0.) * 4.) * .85);                  // crust to the waterline
    dry = mix(dry, vec3(.82, .86, .92), uSnow * smoothstep(.45, .85, N.y) * smoothstep(.15, .5, vL.y) * .85);
    alb = mix(dry, crust, under);
  #endif
  #ifdef K_GARDEN
    alb *= .8 + .4 * vn(vL.xz * 7. + vL.y * 5.);
    {   // (round 11) moss is tufts, not a smooth green lump: bright star tips over dark crevices at the scale of a finger,
        // coarser clumps over them; the cushion's skin takes the light tuft by tuft. Within 30 m of the lens, out of the water
      float gnk = (1. - smoothstep(9., 34., length(vV))) * (1. - smoothstep(.03, .25, vFlex)) * (1. - under);
      float tfA = vn(vL.xz * 19. + vL.y * 13.), tfB = vn(vL.xz * 47. + vL.y * 31. + 3.), tfC = vn(vL.xz * 5.3 + vL.y * 4.1 + 9.);
      alb *= mix(1., (.5 + .62 * tfA) * (.72 + .5 * tfB) * (.8 + .4 * tfC) * 1.12, gnk);
      alb = mix(alb, alb * vec3(1.3, 1.25, .7), gnk * smoothstep(.6, .8, tfB) * .6);
      N = normalize(N + vec3(tfA - .5, 0., vn(vL.zx * 19. + 7.) - .5) * (.9 * gnk));
    }
    // (the island's own shrubs and sedge, at (-41, -35.5), keep the hour's key with its trees and its stone: uIsle.w)
    float isG = (1. - smoothstep(8.5, 11., length(vL.xz - vec2(-41., -35.5)))) * (1. - uIsle.w);
    alb = mix(alb, vec3(dot(alb, vec3(.3, .55, .15))) * vec3(.7, .85, 1.25), min(1., isG * 1.3)) * (1. - .5 * isG);
    alb = mix(alb, vec3(.82, .86, .92), uSnow * (1. - under) * smoothstep(.1, .75, N.y) * .8);
  #endif
  #ifdef K_TREE
    alb *= (.6 + .75 * vn(vL.xz * 1.3 + vL.y * 1.9) * vn(vL.zx * 3.7 - vL.y * 2.3) * 1.6) * (.6 + .4 * smoothstep(-.7, .4, N.y));
  #endif
  float sd = dot(N, mix(uSun, uSunU, under)), ndl = max(sd, 0.);
  #if defined(K_GARDEN) || defined(K_TREE)
    ndl = ndl * .65 + .35 * max(sd * .5 + .5, 0.) + .3 * max(-sd, 0.) * max(dot(-V, uSun), 0.);   // leaves pass light
  #endif
  vec3 amb = mix(uAmbH * .45, uAmbZ, N.y * .5 + .5) * uAmb;
  #ifdef K_GARDEN
    // moss and sedge out of the water glow in raking and back light (a garden is never a dark hull on the lake)
    ndl = mix(ndl, ndl * .5 + .34 + .5 * max(-sd, 0.), 1. - under); amb *= mix(2.1, 1., under);
  #endif
  #ifdef K_ISLE
    // the island's pale ground takes the sky's fill as warm grey (not a blue slab under a low sun), and a low sun still grazes it
    amb = mix(amb, vec3(dot(amb, vec3(.3, .5, .2))) * vec3(1.08, 1., .9), uIsle.y * (1. - under)) * mix(1., uIsle.z, 1. - under);   // (by the hour: under the moon and in dawn's shade it stays the blue of the sky's light)
    ndl = mix(ndl, ndl * .55 + .45 * smoothstep(-.2, .5, sd), 1. - under);
  #endif
  #ifdef K_WOOD
    ndl = mix(ndl * .75 + .25 * (sd * .5 + .5), ndl, under); amb *= mix(2.5, 1., under);   // (dry wood in shade is still bone: a root plate against the bright mist is never a dark hull)
    amb = mix(amb, vec3(dot(amb, vec3(.3, .5, .2))) * vec3(1.04, 1., .97), .62 * (1. - under));   // dry bone wood takes the sky's fill as grey: a limb's upper side is not a blue ribbon
  #endif
  float cf = under * mix(.45, 1., 1. - smoothstep(4.5, 11., depth)) * (1. - smoothstep(18., 24., depth)) * smoothstep(0., .5, depth);
  float ca = caust((vL.xz + uSunU.xz / max(uSunU.y, .2) * depth) * mix(1., .62, smoothstep(6., 18., depth)), uTime);   // a wider, softer net on the deep wood
  #ifdef K_WOOD
    // Sunk wood is bone gone aqua, paler than the water round it. Only the trunks hung up 1.5-5 m under pass one (x -100, z 30-120),
    // seen along the water from a few metres off, are dimmer and waterlogged: pale and level they read as panes lying on the surface.
    float hung = under * (1. - smoothstep(16., 24., abs(vL.x + 100.))) * smoothstep(30., 40., vL.z) * (1. - smoothstep(112., 122., vL.z))
      * smoothstep(1., 1.8, depth) * (1. - smoothstep(4.5, 7., depth));
    float cnetK = mix(1., mix(.36 + 1.6 * ca, .3 + 1.15 * ca, hung), cf);   // the caustic net shows on the wood
  #else
    float cnetK = mix(1., .68 + .85 * ca, cf);
  #endif
  float sgate = sunGateH(vL.xz);
  #ifdef K_ISLE
    sgate = max(sgate, uIsle.x);     // the islet stands in the open: by day the low sun reaches it over the stand
  #endif
  vec3 sunL = uSunCol * ndl * mix(1., exp(-depth * .015) * cnetK, under) * sgate;
  #ifdef K_TREE
    sunL *= .55 + .45 * smoothstep(-.2, .9, vFlex + vn(vL.xz * .08));       // crowns shade their own insides
  #endif
  vec3 col = alb * (sunL + amb * mix(1., 1.25 + .5 * ca * cf, under));
  #ifdef K_BED
    // (round 12) the travertine of the outlet, floor and banks, takes the same fill of sky light as the travertine of the
    // shoal it runs into (uOutFill: the world's own term for its travertine in shade). In a look whose lake lies in shade
    // the two were lit by different sums: the shoal pale, the outlet beside it one flat violet band.
    col += alb * uOutFill * outK;
  #endif
  #ifdef K_ISLE
    {                                                             // the wet treads of the islet shine: the sky lies on them, and the sun where it reaches
      float fI = 1. - max(V.y, 0.), sI = max(dot(reflect(-V, vec3(0., 1., 0.)), uSun), 0.); fI *= fI; sI *= sI; sI *= sI; sI *= sI; sI *= sI;
      col = mix(col, mix(uHor, uZen, .6) * (.55 + .45 * uDayK), wetI * (.12 + .5 * fI));
      col += uSunCol * (sI * sI * wetI * sgate * .6);
    }
  #endif
  #ifdef K_WOOD
    float rnd = mix(mix(.3, 1., smoothstep(-.45, .5, N.y)), mix(.3, 1., smoothstep(-.3, .8, N.y)), nd);        // a sunk log is round: light comes down the water, so its top is pale, its flanks fall off and its underside is dark
    col += alb * waterCol(depth * .5 + .5) * min(uScat, .7) * (.6 * rnd * under) * mix(1., .4, max(nd * uPaleK, ndW));                       // the glow of the water column itself falls on it from above
    float edge = 1. - abs(dot(N, V)), rim = 1. - .34 * smoothstep(.72, 1., edge);   // a thin dark rim only (the top of a log seen along the water stays pale); under the lens its flanks fall off sooner (rnd): a round thing
    col *= mix(1., rnd * mix(rim, (1. - .5 * edge - .25 * edge * edge) * .68, hung), under);
    col += alb * (uW1 * .16 * uDayK + uSunCol * .07 * sunGateH(vL.xz)) * (vFlex * max(-N.y, 0.) * (1. - under));   // the water's light on the underside of the arch
  #endif
  float dEff = depth;
  #ifdef K_WOOD
    // deep wood is seen through a shorter, clearer reach than the floor it lies on (the tangle stays bone-pale from the turn); the hung trunks keep the long reach
    dEff *= mix(.6 * (.75 + .25 / max(V.y, .3)) / (.6 + .4 / max(V.y, .14)), .82, hung);
  #endif
  #ifdef K_BED
    dEff *= mix(1., .7, smoothstep(5., 17., depth));              // the deep floor keeps its marl and its patches
  #endif
  col = mix(col, uwAbsorb(col, dEff, V.y), under);
  #ifdef K_WOOD
    // never darker than the water: in the low-sun and moon looks, and on every shaded flank, sunk wood keeps about twice the glow of the water round it
    float plF = depth * (.6 + .4 / max(V.y, .14));
    // (round 12: twice the water's glow on its upper side only; its flanks fall to the water's own tone and its underside below it: a round, solid thing, not a pane of pale glass)
    col = max(col, (waterCol(plF) * .6 + uW1 * .25) * ((1. - exp(-plF * .026)) * min(uScat, .66) * 2.1 * mix(1., .5, nd * uPaleK) * mix(.24, 1., smoothstep(-.2, .6, N.y)) * under * (1. - .7 * hung)));
  #endif
  #if defined(K_WOOD) || defined(K_GARDEN)
    float ndl2 = 1. - smoothstep(5., 22., length(vV));
    col *= mix(vec3(1.), mix(vec3(1.), uW1 * 1.55, .5 - .4 * ndl2 * uPaleK), under * smoothstep(0., 1.1, depth) * (1. - .85 * smoothstep(4., 11., depth)));   // the first metre of water already casts shallow wood turquoise
    { float lw = dot(col, vec3(.3, .55, .15)); col = mix(col, lw * vec3(1.1, 1.02, .9), .7 * ndl2 * uPaleK * under * (1. - smoothstep(2.5, 6., depth))); }   // under the lens it is bone: warm grey-white crusted wood, not mint
    #ifdef K_WOOD
      // (round 12) and from the turn, 11 m up: the upper side of every sunk trunk within ten metres of the surface is bone white
      // where the algae has not dusted it green-gold (the water tints it, it does not turn it to mint glass)
      { float lw2 = dot(col, vec3(.3, .55, .15)); col = mix(col, lw2 * vec3(1.12, 1.05, .93) * 1.08, .5 * uPaleK * under * smoothstep(.05, .7, N.y) * (1. - algK) * (1. - smoothstep(6., 12., depth)) * (1. - hung)); }
    #endif
  #endif
  gl_FragColor = vec4(col, 1.);
  #include <fog_fragment>
}`,g0=`
float gSoft = 0.;     // how soft the far skylines are drawn: 0 for the backdrop ring, a little in the water (round 11: the image of a mountain in the lake has a soft, wavering edge)
vec3 skyCol(vec3 R){
  float h = max(R.y, 0.), md = max(dot(R, uSun), 0.); vec3 c = mix(uHor, uZen, pow(h, .38)) + uSunCol * uMoon * (5. * smoothstep(.9978, .9988, md) + .25 * pow(md, 300.));   // the moon rides in the mirror
  float ci = fbm(vec2(atan(R.x, -R.z + 1e-5) * 1.4 + h * 2., h * 26.));
  return mix(c, uHor * 1.1 + .05 * uDayK, smoothstep(.55, .95, ci) * .14 * smoothstep(.06, .3, h));
}
vec3 farLand(vec2 d, float ty, float az, out float cov){
  float sf = .5 + .5 * dot(-d, normalize(uSun.xz + vec2(1e-5, 0.)));
  vec3 lightS = mix((vec3(.22, .3, .46) + uZen * .25) * uDayK, uSunCol * .95 + .05 * uDayK, smoothstep(.3, .75, sf));
  float pk = max(uSky.w * max(0., 1. - pow(abs(az) / uPeakW, .85)), uSky.w * .62 * max(0., 1. - pow(abs(az + uPeakW * .7) / (uPeakW * .9), .9))) * (.9 + .2 * vn(vec2(az * 40., 2.)));
  vec3 snow = mix(uSunCol * .95 + .1 * uDayK, vec3(.45, .58, .85) * (uAmb + .35) * uDayK, smoothstep(-.03, .05, az + .06 * (vn(vec2(ty * 70., az * 30.)) - .5)));
  snow = mix(vec3(.3, .33, .4) * (.5 + uAmb) * uDayK, snow, smoothstep(.45, .7, ty / max(pk, 1e-3) + .25 * vn(vec2(az * 90., ty * 50.))));
  float cp = smoothstep(-gSoft, gSoft + .006, pk - ty);
  vec3 c = mix(snow, uHor, .2);
  float az2 = az - 1.64, nt = exp(-az2 * az2 / .05);                // the side valley that opens in the west slope, and the peak at its head
  float pk2 = uSky.w * .8 * max(0., 1. - pow(abs(az2) / (uPeakW * .62), .85)) * (.9 + .2 * vn(vec2(az * 40., 5.)));
  cp = max(cp, smoothstep(-gSoft, gSoft + .006, pk2 - ty));
  float sl = (uSky.z + (uSky.y - uSky.z) * pow(abs(d.x), 1.5)) * (.8 + .4 * fbm(vec2(az * 2.2 + 4., 1.7))) * (1. - .74 * nt);
  float f = ty / max(sl, 1e-3);
  float tex = vn(vec2(az * 260., ty * 330.)), mid = fbm(vec2(az * 55., ty * 80.)), big = fbm(vec2(az * 5. + 3., ty * 7.));
  vec3 sc = uSpruce * (1.5 + 1.4 * tex);
  float larch = smoothstep(.42, .6, f + .3 * (big - .5)) * (1. - smoothstep(.74, .86, f)) * smoothstep(.42, .6, mid * .6 + tex * .4);
  float birch = (1. - smoothstep(.04, .3, f)) * smoothstep(.45, .62, mid * .6 + tex * .4);
  sc = mix(sc, uGold * vec3(1., .82, .6) * (.5 + .45 * tex), max(larch * .9, birch * .75));
  sc = mix(sc, vec3(.36, .37, .41) * (.7 + .5 * mid), smoothstep(.78, .9, f + .12 * (mid - .5)));
  sc = mix(sc, vec3(.9, .93, 1.), smoothstep(.9, .98, f + .1 * (mid - .5)) * .8);
  float cl = 1. - .4 * smoothstep(.52, .68, fbm(vec2(az * 2.6 + uTime * .012, ty * 3.5 - uTime * .008)));
  sc = mix(sc * (lightS + uSlopeFill * 1.5) * cl * 1.15, uHor * .8, .16 + .2 * smoothstep(0., .9, f));
  float cs = smoothstep(-gSoft, gSoft + .006, sl - ty);
  c = mix(c, sc, cs); cov = max(cp, cs);
  return c;
}`,to=`
#include <common>
${ra}
uniform vec4 uSky; uniform float uPeakW; uniform vec3 uSpruce, uGold;
${g0}
varying vec3 vL;
void main(){
  float hl = max(length(vL.xz), 1e-3); vec2 d = vL.xz / hl; float ty = vL.y / hl, cov;
  vec3 c = farLand(d, ty, atan(d.x, -d.y + 1e-5), cov);
  if (cov < .01) discard;
  gl_FragColor = vec4(c, cov);
}`,y0=`
#include <common>
#include <fog_pars_vertex>
varying vec3 vL, vV;
void main(){
  vL = position; vec4 wp = modelMatrix * vec4(position, 1.);
  vV = (cameraPosition - wp.xyz) * mat3(modelMatrix);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ao=`
#include <common>
#include <fog_pars_fragment>
${ra}
${v0}
uniform float uPeakW, uEndZ; uniform vec4 uSky, uPortal; uniform vec3 uSnagA, uSnagB, uPortalCol; uniform vec2 uPortalN;
uniform vec3 uBone, uGold, uScar, uSpruce, uGreen;
varying vec3 vL, vV;
float boxExit(vec2 p, vec2 d, vec2 c, vec2 h){
  vec2 q = p - c, s = vec2(d.x >= 0. ? 1. : -1., d.y >= 0. ? 1. : -1.);
  vec2 t = (h - s * q) / max(abs(d), vec2(1e-4));
  return max(min(t.x, t.y), 0.);
}
bool inBox(vec2 p, vec2 c, vec2 h){ vec2 q = abs(p - c); return q.x < h.x && q.y < h.y; }
float shoreDist(vec2 p, vec2 d){
  vec2 ca = vec2(-47.5, 80.), ha = vec2(97.5, 155.), cb = vec2(87.5, -67.5), hb = vec2(147.5, 102.5);
  float t = 0.;
  if (inBox(p, ca, ha)) { t = boxExit(p, d, ca, ha); vec2 p1 = p + d * (t + .5); if (inBox(p1, cb, hb)) t += .5 + boxExit(p1, d, cb, hb); }
  else if (inBox(p, cb, hb)) { t = boxExit(p, d, cb, hb); vec2 p1 = p + d * (t + .5); if (inBox(p1, ca, ha)) t += .5 + boxExit(p1, d, ca, ha); }
  return t;
}
${g0}
// what still water shows: shore trees (parallax-correct against the lake outline), valley slopes, the peak, sky
vec3 mirror(vec3 R, vec2 P){
  float hl = max(length(R.xz), 1e-4); vec2 d = R.xz / hl; float ty = R.y / hl;
  float az = atan(d.x, -d.y + 1e-5), sf = .5 + .5 * dot(-d, normalize(uSun.xz + vec2(1e-5, 0.))), cov;
  vec3 lightS = mix((vec3(.22, .3, .46) + uZen * .25) * uDayK, uSunCol * .95 + .05 * uDayK, smoothstep(.3, .75, sf));
  gSoft = .012;
  vec3 c = skyCol(R) * .9, fl = farLand(d, ty + (vn(vec2(az * 36., ty * 16.)) - .5) * .022, az, cov);
  c = mix(c, fl, cov);
  // (round 12: over the outlet tongue, north of the lake's own outline, the shore is measured from the lake's edge: looking
  // down the lake from the shoal's crest the far shore is 400 m off, not 13)
  float t = shoreDist(vec2(P.x, min(P.y, 233.)), d) + 13.; vec2 hit = P + d * t;
  // the shore trees' image: a ragged line of separate crowns (never a level band), lit like the trees themselves: where the
  // low sun does not reach the shore they are in shade, and so is their image
  float Ht = uSky.x * (.42 + .5 * vn(hit * .13) + .55 * vn(hit * .37 + 3.)) * (.66 + .34 * vn(hit * 1.1 + 8.)), tyT = Ht / t, k = vn(hit * .1 + 11.) * .7 + vn(hit * .47 + 2.) * .3, k2 = vn(hit * .23 + 5.) * .65 + vn(hit * .61 + 9.) * .35;
  vec3 tc = mix(uGold, uScar, smoothstep(.56, .68, k2) * step(k, .7));
  tc = mix(tc, uGreen, smoothstep(.68, .8, k2)) * (.55 + .5 * vn(hit * .8 + 4.));
  tc = mix(tc, uSpruce * 1.3, smoothstep(.42, .66, k) * .9);
  tc = mix(tc, mix(uGold * .7, uSpruce * 1.5, .5), .35);
  float inB = step(1., uGate.w) * (1. - smoothstep(.55, 1., abs(dot(hit, uGate.xy) - uGate.z) / max(uGate.w, 1.))), bs = mix(uLowT, 1., inB);
  vec3 shadeS = (vec3(.22, .3, .46) + uZen * .25) * uDayK + uSlopeFill * .8;
  tc = mix(tc, uSpruce * 1.6 + vec3(.01, .025, .04), .5 * (1. - bs));      // (in shade the image is spruce-dark and blue, crown by crown: never a flat red band)
  tc *= (mix(shadeS * 1.15, lightS, bs) * .8 + uGold * .25 * uDayK * (1. - smoothstep(.3, .75, sf)) * bs) * (.5 + .5 * clamp(ty / max(tyT, 1e-3), 0., 1.)) * (.5 + 1. * vn(hit * 1.1));
  float rag = vn(vec2(az * 330., ty * 90.)) * .6 + vn(vec2(az * 900., ty * 260.)) * .4;       // leaf-sized breaks along the crown line
  c = mix(c, tc, smoothstep(-.06 * tyT, .32 * tyT + .003, tyT - ty + (rag - .5) * .3 * tyT));
  return mix(c, uBone * (.5 + uAmb) * (uSunCol * .5 + .5 * uDayK), smoothstep(.75 / t, .4 / t, ty));
}
float snag(vec3 S, vec2 P, vec2 d, float ty){
  vec2 w = S.xy - P; float al = dot(w, d), pe = abs(w.x * d.y - w.y * d.x), h = ty * al;
  float r = S.z * (1. - .6 * clamp(h / 16., 0., 1.)) + .04 + al * .0015;
  return step(0., al) * step(h, 16.3) * smoothstep(r, r * .7, pe);
}
float spark(vec2 q, float f){ vec2 w = vec2(uTime * .19, -uTime * .43) * f; q.x *= .5; return vn(q * f + w) * vn(q * f * .44 - w * .6 + 3.7); }   // glints lie along the wavelets, across the wind
float hgt(vec2 q, float gust, float lod, float calm){
  float h = .07 * vn(q * .2 + vec2(uTime * .05, uTime * .03)) + .018 * vn(q * .95 - uTime * .1);
  h += gust * lod * (.1 * vn(q * vec2(2.3, 1.1) + vec2(0., -uTime * 1.7)) + .045 * vn(q * vec2(5.3, 2.7) + vec2(uTime * .3, -uTime * 2.4)));
  for (int i = 0; i < 4; i++) {                                // rings where fish rise
    float tt = uTime * .22 + float(i) * .37, id = floor(tt), ph = fract(tt);
    vec2 c = (vec2(h21(vec2(id, float(i) + .5)), h21(vec2(float(i) + 7.5, id))) - .5) * vec2(190., 170.) + vec2(10., -20.);
    float r = length(q - c) - ph * 6.;
    h += calm * .035 * sin(r * 7.) * exp(-abs(r) * 1.1) * (1. - ph) * (1. - ph);
  }
  return h;
}
void main(){
  float dist = length(vV); vec3 V = vV / max(dist, 1e-3); vec2 q = vL.xz;
  float behind, heal, lee, gust = gustAt(q, behind, heal, lee);
  // (pass two: the calm returns as ONE front that travels from the head of the lake, heal in gustAt; nothing stills by the clock)
  float calm = 1. - gust;
  float lod = 1. - smoothstep(50., 240., dist), e = .16;
  float h0 = hgt(q, gust, lod, calm), hx = hgt(q + vec2(e, 0.), gust, lod, calm), hz = hgt(q + vec2(0., e), gust, lod, calm);
  vec3 N = normalize(vec3(h0 - hx, e, h0 - hz));
  float cosv = clamp(dot(N, V), .02, 1.), om = 1. - cosv, F = .02 + .98 * om * om * om * om * om;
  vec3 R = reflect(-V, N); R.y = abs(R.y) + .004; R = normalize(R);
  vec3 mir = mirror(R, q);
  float hl = max(length(R.xz), 1e-4); vec2 d = R.xz / hl; float ty = R.y / hl;
  float sg = max(snag(uSnagA, q, d, ty), snag(uSnagB, q, d, ty));
  mir = mix(mir, uBone * (.45 + .5 * uAmb) * (uSunCol * .5 + .5 * uDayK), sg);
  float pd = dot(uPortal.xz - q, uPortalN), pr = dot(R.xz, uPortalN);     // the gate's ring of light, doubled in the water
  if (pd > 1. && pr > 1e-3) {
    float sH = pd / pr; vec3 H = vec3(q.x, 0., q.y) + R * sH;
    float rr = length(vec2(dot(H.xz - uPortal.xz, vec2(-uPortalN.y, uPortalN.x)), H.y - uPortal.y)) / uPortal.w;
    mir += uPortalCol * ((1. - smoothstep(.8, 1.08, rr)) * .75 + .5 * exp(-max(rr - 1., 0.) * 2.2)) * smoothstep(.5, 1.5, H.y) * (1. - smoothstep(150., 320., sH));
  }
  vec3 skyG = skyCol(normalize(vec3(R.x, R.y + .3, R.z)));
  // (round 11: behind the gust the water is a window at a level gaze too, not a sheen: less of the sky lies on it)
  float ov = 1. - max(V.y, 0.), ov2 = ov * ov, Fg = .03 + .5 * ov2 * ov2 * ov2;
  float Ac = max(F, mix(.55, .8, smoothstep(10., 45., dist)) * smoothstep(4., 9., dist));
  // (round 12) THE OUTLET SHELF (world: within 20-34 m of the rim at (-100, 246); a hand of water over cream travertine): the
  // pale floor shone through the mirror and washed the doubled peak and forest out of it. There the water is a window for
  // the first three metres under the nose and a full mirror from six.
  Ac = mix(Ac, max(F, .92 * smoothstep(2.6, 6., dist)), 1. - smoothstep(20., 34., length(q - vec2(-100., 246.))));
  // over the shallow shelf the pale bed outshines the mirror near the lens: the window stays open under the nose, the mirror holds further out
  // (round 11: they are wavelets lying across the way to the gate, long and narrow, coming from the sill: in world
  // coordinates, along and across the gate's own axis; never round patches of sky)
  vec2 rq = vec2(dot(q, vec2(-uPortalN.y, uPortalN.x)), dot(q, uPortalN));
  float rpl = smoothstep(.47, .72, vn(vec2(rq.x * .5, rq.y * 2.1) + vec2(uTime * .15, uTime * .8)) * .55 + vn(vec2(rq.x * 1.4, rq.y * 5.6) + vec2(-uTime * .25, uTime * 1.5)) * .3 + vn(q * 1.3 + vec2(uTime * .35, -uTime * .5)) * .15);   // (but ripples still cross it: patches of sky slide over the sunk logs)
  float gateK = smoothstep(30., 70., length(q - uPortal.xz));
  float shelfW = smoothstep(96., 122., q.x + .12 * q.y) * (1. - smoothstep(mix(7., 12., gateK), mix(24., 44., gateK), dist));
  Ac = mix(Ac, max(F * mix(.4, .25, gateK), rpl * mix(.3, .16, gateK)), shelfW);
  float A = mix(Fg, Ac, calm);
  vec3 refl = mix(mix(skyG, mir, .18), mir, calm);
  float g1 = smoothstep(.5, .75, spark(q, 24.)) * (1. - smoothstep(10., 40., dist));
  float g2 = smoothstep(.5, .75, spark(q, 8.)) * smoothstep(8., 36., dist) * (1. - smoothstep(55., 150., dist));
  float g3 = smoothstep(.5, .75, spark(q, 2.6)) * smoothstep(50., 140., dist) * .6;
  float steep = smoothstep(.16, .5, V.y), sp = g1 * (1. - .7 * smoothstep(.1, .3, V.y)) + (g2 + g3) * (1. - .85 * steep), gl = gust * sp * (.02 + .34 * ov * ov * ov);
  float sr = max(dot(reflect(-V, N), uSun), 0.), s2 = sr * sr; s2 *= s2; s2 *= s2; s2 *= s2; s2 *= s2;
  // the glitter behind the gust is blue (the sky's, never a pale sheet); the sun's own is a narrow path under the sun
  float saz = max(dot(d, normalize(uSun.xz + vec2(1e-5, 0.))), 0.), sunPath = smoothstep(.955, .9985, saz);
  vec3 add = (uHor * .22 + uZen * 1.05 + uSunCol * .55 * (1. - uDayK)) * gl * (.62 + .38 * steep) + uSunCol * s2 * s2 * (.25 + gust * 2.5 * sp) * sunGateH(q) * (1. - .7 * gust * smoothstep(.12, .34, V.y)) * mix(1., .25 + .75 * sunPath, gust) * (1. - .7 * shelfW);   // (and the sun's image is no pale smear over the shelf's window)   // (looked down into, the window is not hidden behind the sun's glitter)
  float line = exp(-max(behind, 0.) / 9.) * smoothstep(-2., 1., behind) * (1. - heal) * (1. - lee);
  refl = mix(refl, uW3 * .3, line * .9); A = mix(A, .9, line * .85); add *= 1. - line * .9;
  // (round 12) at its outlet end the level water thins out over the last metre and a half: the mirror dissolves into the
  // sheet that breaks over the shoal's crest, it is not cut off by a line
  float endK = 1. - smoothstep(uEndZ - 1.6, uEndZ - .1, q.y); A *= endK; add *= endK;
  vec3 col = refl * A + add;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      float ff = 1. - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      float ff = smoothstep(fogNear, fogFar, vFogDepth);
    #endif
    col = mix(col, fogColor * A, ff);
  #endif
  gl_FragColor = vec4(col, A);
}`,no=`
#include <common>
attribute vec3 aCol; uniform float uTime;
varying vec3 vC, vS, vN; varying float vAb, vH;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  float hn = length(normal.xz);                                 // (held to two pixels far off, like the trunk it mirrors)
  float dcam = distance(wp.xyz, cameraPosition);
  wp.xz += normal.xz / max(hn, 1e-3) * (step(.35, hn) * max(0., dcam * .0042 - .4));
  float y = max(wp.y, 0.), cy = max(cameraPosition.y, .3), t = cy / (cy + y);
  vec3 S = cameraPosition + (vec3(wp.x, -y, wp.z) - cameraPosition) * t;
  float w = min(y, 16.) * .014 * (1. - .75 * smoothstep(50., 150., dcam));   // the image wanders more the higher the thing it mirrors; far off it holds still, a clean double
  S.x += w * sin(uTime * 1.3 + wp.z * .9 + y * 1.7); S.z += w * cos(uTime * 1.1 + wp.x * .8 + y * 1.3);
  S.y = .02;
  vAb = wp.y; vH = y; vS = S; vC = aCol; vN = mat3(modelMatrix) * normal;
  gl_Position = cameraPosition.y > .3 ? projectionMatrix * viewMatrix * vec4(S, 1.) : vec4(2., 2., 2., 1.);
}`,oo=`
#include <common>
#include <fog_pars_fragment>
${ra}
${v0}
varying vec3 vC, vS, vN; varying float vAb, vH;
void main(){
  if (vAb < .02) discard;
  vec3 Vv = cameraPosition - vS; float dist = length(Vv); vec3 V = Vv / max(dist, 1e-3);
  float behind, heal, lee, gust = gustAt(vS.xz, behind, heal, lee);
  float calm = 1. - gust;
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.));
  float sd = dot(N, uSun), ndl = max(sd, 0.) * .75 + .25 * (sd * .5 + .5);
  vec3 col = vC * vec3(.66, .65, .63) * (uSunCol * ndl * sunGateH(vS.xz) + mix(uAmbH * .45, uAmbZ, N.y * .5 + .5) * uAmb * 1.7);
  col = mix(col, col * uW1 * 1.5, .3) * .92;                  // the water keeps a little of the light
  float ov = 1. - max(V.y, 0.), F = .02 + .98 * ov * ov * ov * ov * ov;
  float aC = max(F, .76 * smoothstep(4., 9., dist));
  vec2 rel = vS.xz - cameraPosition.xz; float rad = length(rel), acr = atan(rel.y, rel.x + 1e-5) * rad;
  float streak = smoothstep(.3, .62, vn(vec2(acr * .9, rad * 4.5 - uTime * 1.4)) * .7 + vn(vec2(acr * 2.3, rad * 11. + uTime * 2.)) * .3);
  float aG = (.1 + .62 * ov * ov * ov) * streak * exp(-vH * .05);
  float A = mix(aG, aC, calm) * smoothstep(.02, .3, vAb);
  if (A < .01) discard;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col = mix(col, fogColor, 1. - exp(-fogDensity * fogDensity * dist * dist));
    #else
      col = mix(col, fogColor, smoothstep(fogNear, fogFar, dist));
    #endif
  #endif
  gl_FragColor = vec4(col * A, A);
}`,x0=`
attribute vec4 aFish;    // shoal index, lag (m), side (m), up (m)
attribute vec2 aFish2;   // phase, length (m)
uniform vec4 uShoal[3];  // centre xyz, rotation
uniform vec4 uShoalR[3]; // half the loop's length (m), the trunk's slope along it (rise per metre), angular speed, y of the trunk's upper side at its middle
void fishFrame(out vec3 c, out vec3 tg, out vec3 nr, out float shY){
  int i = int(aFish.x + .5); vec4 S = uShoal[i], Q = uShoalR[i];
  // the loop is long and narrow (half a metre either side of the trunk's line) and tilted as the trunk is tilted, so the
  // shoal hangs over the wood from end to end and every fish's shadow falls on the trunk's upper side
  float th = uTime * Q.z + aFish.y / (.5 * (Q.x + .55)) + .25 * sin(uTime * .31 + aFish2.x) * aFish.z / Q.x, rise = Q.y * Q.x * cos(th);
  float cr = cos(S.w), sr = sin(S.w); vec2 e = vec2(Q.x * cos(th), .55 * sin(th)), t2 = normalize(vec2(-Q.x * sin(th), .55 * cos(th)));
  e = vec2(e.x * cr - e.y * sr, e.x * sr + e.y * cr); t2 = vec2(t2.x * cr - t2.y * sr, t2.x * sr + t2.y * cr);
  tg = vec3(t2.x, 0., t2.y); nr = vec3(-t2.y, 0., t2.x); shY = Q.w + rise;
  c = S.xyz + vec3(e.x, 0., e.y) + nr * aFish.z + vec3(0., rise + aFish.w + .12 * sin(uTime * .7 + aFish2.x * 3.), 0.);
  c.y = min(max(c.y, shY + .1), -.14);     // (never in the wood it hangs over, never out of the water)
}`,so=`
#include <common>
#include <fog_pars_vertex>
uniform float uTime;
${x0}
varying vec3 vL, vN, vV; varying float vBelly;
void main(){
  vec3 c, tg, nr; float shY; fishFrame(c, tg, nr, shY);
  vec3 q = position; float tail = .5 - q.x;
  q.z += sin(uTime * 9. + aFish2.x * 6.28 - q.x * 5.) * .09 * tail * tail * 2.;
  vec3 p = c + aFish2.y * (tg * q.x + vec3(0., q.y, 0.) + nr * q.z);
  vN = tg * normal.x + vec3(0., normal.y, 0.) + nr * normal.z; vBelly = position.y; vL = p;
  if (p.y < 0.) p.y *= .75;
  vec4 wp = modelMatrix * vec4(p, 1.); vV = (cameraPosition - wp.xyz) * mat3(modelMatrix);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ro=`
#include <common>
#include <fog_pars_fragment>
${ra}
varying vec3 vL, vN, vV; varying float vBelly;
void main(){
  vec3 N = normalize(vN + vec3(0., 1e-5, 0.)); if (!gl_FrontFacing) N = -N;
  vec3 V = normalize(vV + vec3(0., 1e-5, 0.));
  // (round 13: in the top half metre of water a carp's back is dark olive: a dark stroke over white wood, as the deep ones are once the water has taken their light)
  vec3 alb = mix(vec3(.78, .76, .66), mix(vec3(.3, .33, .27), vec3(.07, .085, .075), 1. - smoothstep(.45, .85, -vL.y)), smoothstep(-.02, .09, vBelly));
  vec3 col = alb * (uSunCol * max(dot(N, uSun), 0.) + mix(uAmbH * .45, uAmbZ, N.y * .5 + .5) * uAmb * 1.3);
  gl_FragColor = vec4(uwAbsorb(col, max(-vL.y, 0.), V.y), 1.);
  #include <fog_fragment>
}`,b0=`
#include <common>
#include <fog_pars_vertex>
uniform float uTime; uniform vec3 uSunU;
varying vec2 vUv; varying float vStr;
#ifdef K_INST
${x0}
#else
attribute float aStr;
#endif
void main(){
  vec3 p = position; vUv = uv; vStr = 1.;
  #ifdef K_INST
    vec3 c, tg, nr; float shY; fishFrame(c, tg, nr, shY);
    c -= uSunU * (c.y - shY) / max(uSunU.y, .2);
    p = c + aFish2.y * (tg * position.x * 1.25 + nr * position.z * .6); vStr = .8;
  #else
    vStr = aStr;
  #endif
  if (p.y < 0.) p.y *= .75;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,w0=`
#include <common>
#include <fog_pars_fragment>
varying vec2 vUv; varying float vStr;
void main(){
  vec2 q = vUv * 2. - 1.; float a = (1. - smoothstep(.25, 1., abs(q.y))) * (1. - smoothstep(.8, 1., abs(q.x))) * vStr;
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      a *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      a *= 1. - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(mix(vec3(1.), vec3(.4, .52, .6), a), 1.);
}`,io=`
#include <common>
#include <fog_pars_vertex>
attribute vec4 aLeaf;    // x, z, rotation, size
attribute vec2 aLeaf2;   // colour pick, phase
uniform float uTime, uFrontZ, uHealZ, uTilt;
varying vec2 vUv; varying float vPick;
void main(){
  vec2 c = aLeaf.xy; float ph = aLeaf2.y * 6.28;
  float push = smoothstep(0., 40., uFrontZ + uTilt * c.x - c.y) * smoothstep(-40., 60., c.y - uHealZ + 90.);
  c += vec2(sin(uTime * .05 + ph), cos(uTime * .043 + ph * 1.7)) * .7 + vec2(-.3, 1.) * (4.5 + 3. * aLeaf2.x) * push;
  float rot = aLeaf.z + uTime * .03 * (aLeaf2.x - .5) + push * 2.5 * (aLeaf2.y - .5), cr = cos(rot), sr = sin(rot);
  vec4 wp0 = modelMatrix * vec4(c.x, 0., c.y, 1.);
  float dc = distance(cameraPosition, wp0.xyz), sz = aLeaf.w * min(1. + dc * .012, .3 + dc * .06);   // (under the lens a leaf is a leaf: a hand's breadth, not a plate)
  vec2 o = vec2(position.x * cr - position.z * sr, position.x * sr + position.z * cr) * sz;
  vec3 p = vec3(c.x + o.x, .015 + .012 * sin(uTime * 1.3 + ph * 5.) + position.y * sz, c.y + o.y);
  vUv = uv; vPick = aLeaf2.x;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,lo=`
#include <common>
#include <fog_pars_fragment>
uniform vec3 uSun, uSunCol, uAmbZ; uniform float uAmb; uniform vec3 uGold, uScar, uGreen;
varying vec2 vUv; varying float vPick;
void main(){
  vec2 q = vUv * 2. - 1.; float r = length(q), an = atan(q.y, q.x + 1e-5), ca = cos(an);
  // a maple leaf (five pointed lobes, the middle one longest) or a birch leaf (an oval drawn out to a point), each with a stalk
  float mp = abs(cos(an * 2.5)), maple = (.3 + .68 * mp * mp * mp) * (.62 + .38 * smoothstep(-1., .6, ca));
  float birch = .5 * (1. - .16 * ca) / max(.52, sqrt(max(1. - .72 * ca * ca, .05))) * (1. + .42 * smoothstep(.75, 1., ca));
  float lobe = mix(maple, min(birch, .98), step(.55, vPick)), stalk = step(abs(q.y), .045) * step(q.x, 0.) * step(-.95, q.x);
  if (r > lobe && stalk < .5) discard;
  vec3 alb = vPick < .3 ? uScar : (vPick < .82 ? uGold : uGreen);
  alb *= (.75 + .5 * fract(vPick * 7.3)) * (.72 + .28 * smoothstep(.0, .09, abs(q.y))) * (.8 + .3 * smoothstep(.2, 1., r / max(lobe, .05)) * step(.5, fract(vPick * 3.7)));   // a dark midrib; some curl pale at the edge
  gl_FragColor = vec4(alb * (uSunCol * (uSun.y * .8 + .25) + uAmbZ * uAmb), 1.);
  #include <fog_fragment>
}`,co=`
#include <common>
#include <fog_pars_vertex>
varying vec2 vUv; varying vec3 vV;
void main(){
  vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.); vV = cameraPosition - wp.xyz;
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,ho=`
#include <common>
#include <fog_pars_fragment>
${ra}
varying vec2 vUv; varying vec3 vV;   // uv.x = metres across the sill, uv.y = metres along (pool > 0, lip ~0, lake < 0)
void main(){
  float ac = vUv.x, al = vUv.y; vec3 V = normalize(vV + vec3(0., 1e-5, 0.));
  float thread = smoothstep(.16, .42, vn(vec2(ac * .7, 3.3)) + .25 * vn(vec2(ac * 2.6, 8.)));
  float lip = 1. - smoothstep(.1, .9, al), foot = smoothstep(-1.3, -1.9, al);
  float lace = vn(vec2(ac * 5., al * 2.2 + uTime * 3.4)) * .6 + vn(vec2(ac * 13., al * 5. + uTime * 5.5)) * .4;
  float w = lip * (1. - foot) * thread * smoothstep(.2, .55, lace + .3 * thread);
  float foam = foot * (1. - smoothstep(-4.2, -2., al) * 0. ) * smoothstep(-4.6, -2.2, al) * smoothstep(.35, .7, vn(vec2(ac * 2.3 + uTime * .2, al * 2.3 - uTime * .9)) + .3 * thread);
  float ov = 1. - max(V.y, 0.), fr = .04 + .7 * ov * ov * ov;
  float flow = vn(vec2(ac * 1.3, al * .5 + uTime * .45));
  // (round 11: the pool behind the sill lies in the shade of the spruces behind the gate and carries their dark image, the
  // sky only in slips along its ripples: never one flat pale band under the ring)
  float slip = smoothstep(.4, .72, vn(vec2(ac * .55 + uTime * .08, al * 5.5 + uTime * .35)) * .65 + vn(vec2(ac * 1.7 - uTime * .1, al * 13. - uTime * .5)) * .35);
  vec3 pool = mix(uW1 * .5, mix(uHor, uZen, .45) * mix(.34, .82, slip), fr) * (.85 + .3 * flow);
  float edge = 1. - smoothstep(17., 21., abs(ac));
  float ap = (1. - lip) * (.45 + .45 * fr) * edge;
  vec3 white = (uSunCol * (.5 + .5 * uSun.y) + uAmbZ * uAmb) * 1.4;
  float a = clamp(ap + w + foam * .8, 0., 1.) * edge;
  vec3 col = mix(pool, white, clamp((w + foam * .8) / max(a, 1e-3), 0., 1.));
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`;async function fo(c,k={}){const f=c.rng.fork?c.rng.fork("peacock-lake"):c.rng,h=c.noise,ae=c.quality?.detail??1,se=(k.palette&&k.palette.length>=7?k.palette:$0).map(qe),[L,V,T,E,P,U,Q]=se,fe=f0[k.hour]||f0.morning,ue=k.season||"peak",Pe=k.tint||(ue==="june"?"emerald":f.pick(["peacock","peacock","emerald","patched"])),Ye=ht(k.density??.6,0,1),Xe=new y.Vector3(...k.sunDir||[-.877,.469,.108]).normalize(),It=qe(k.sunColor||fe.sun).multiplyScalar((k.sunIntensity??fe.sunI)/Math.PI),zt=Math.hypot(Xe.x,Xe.z)||1e-4,ft=zt/1.33,$e=new y.Vector3(Xe.x/zt*ft,Math.sqrt(1-ft*ft),Xe.z/zt*ft),Vt=qe(k.skyColor||fe.zen),Ia=qe(k.horizonColor||fe.hor),_e={treeHeight:19,slopeTan:.62,axisTan:.1,peakTan:.27,peakWidth:.2,...k.skyline||{}},Ta=k.gustU??.37,ia=k.healU??.8,ot=(e,a,t)=>e.clone().lerp(a,t),Dt=T.clone(),Jt=L.clone(),ea=V.clone();Pe==="emerald"&&(Dt.offsetHSL(-.035,0,.02),Jt.offsetHSL(-.07,0,0),ea.offsetHSL(-.05,0,0)),Pe==="patched"&&(Jt.offsetHSL(.035,0,0),ea.offsetHSL(.03,0,0));const re=ue==="june"?qe("#4F8A2E"):ot(P,qe("#7FA02C"),.6),le=ue==="june"?qe("#6FA23A"):P,J=ue==="june"?qe("#D77FA0"):Q,D=ot(U,qe("#8FA32B"),.62),de=ot(P,qe("#5F8F3A"),.55).multiplyScalar(.7),he={uTime:{value:0},uSun:{value:Xe},uSunU:{value:$e},uSunCol:{value:It},uZen:{value:Vt},uHor:{value:Ia},uAmbZ:{value:k.ambientSky?qe(k.ambientSky):Vt},uAmbH:{value:k.ambientHorizon?qe(k.ambientHorizon):Ia},uDayK:{value:k.dayK??(k.hour==="night"?.2:1)},uMoon:{value:k.hour==="night"?1:0},uAmb:{value:(k.ambient??fe.amb)/Math.PI*1.6},uSnow:{value:k.snow??(ue==="snow"?1:0)},uScat:{value:k.scatter??(fe.sunI*.22+fe.amb*.5)*.75},uW1:{value:Dt},uW2:{value:Jt},uW3:{value:ea},uBone:{value:E},uGold:{value:le},uScar:{value:J},uSpruce:{value:U},uGreen:{value:re},uAmber:{value:ot(P,Q,.25).multiplyScalar(Pe==="patched"?.75:.5)},uJade:{value:ot(T,U,.5).multiplyScalar(Pe==="patched"?1:.75)},uMoss:{value:D},uAlgae:{value:de},uFrontZ:{value:0},uHealZ:{value:-400},uTilt:{value:f.range(.12,.34)*f.sign()},uLee:{value:new y.Vector3(-62,-4,1)},uLeeR:{value:new y.Vector2(66,80)},uGate:{value:new y.Vector4(...k.shaft?[k.shaft.perp[0],k.shaft.perp[1],k.shaft.offset,k.shaft.half]:[1,0,0,0])},uOutFill:{value:new y.Color(...k.outletFill||[0,0,0])},uGateK:{value:new y.Vector2(k.shaft?k.shaft.out:1,k.shaft?k.shaft.in:1)},uLowT:{value:k.lowSun??1},uPaleK:{value:k.paleK??.8},uIsle:{value:new y.Vector4(...k.isleRock||[.7,.8,1.3,1])},uSlopeFill:{value:new y.Color(...k.slopeFill||[0,0,0])}},me=(e,a,t={},o={},n={})=>new y.ShaderMaterial({uniforms:{...y.UniformsUtils.clone(y.UniformsLib.fog),...he,...o},vertexShader:e,fragmentShader:a,defines:t,fog:!0,...n});await c.yield();const Qe=new y.Group;Qe.name="peacock-lake";const ee=(e,a=0)=>(e.frustumCulled=!1,e.renderOrder=a,Qe.add(e),e),W=J0(h,f.range(.75,1.15)),B=Q0(),Se=B;await c.yield();const ve=-205,et=295,Ge=-230,rt=k.zMax??295,Me=120,De=Math.round((rt-Ge)/4.1667),dt=(et-ve)/Me,la=(rt-Ge)/De,Bt=new Float32Array((Me+1)*(De+1)),qa=new Float32Array((Me+1)*(De+1)),Ct=new Float32Array((Me+1)*(De+1)*3),Ae=new Float32Array((Me+1)*(De+1)*3),ca=E.clone().multiplyScalar(.8),mt=D.clone().multiplyScalar(.8),Wt=ot(U,P,.3).multiplyScalar(.7),it=new y.Color;for(let e=0;e<=De;e++){for(let a=0;a<=Me;a++){const t=e*(Me+1)+a,o=ve+a*dt,n=Ge+e*la,s=W.bedAt(o,n);Bt[t]=s,qa[t]=W.sdf(o,n),Ct[t*3]=o,Ct[t*3+1]=s,Ct[t*3+2]=n;const i=Ze(.1,.7,s+.3*h.n2(o*.09,n*.09)),r=Ze(1.2,3.2,s+.8*h.n2(o*.05+5,n*.05));it.copy(ca).lerp(mt,i).lerp(Wt,r),Ae[t*3]=it.r,Ae[t*3+1]=it.g,Ae[t*3+2]=it.b}(e&1)===0&&await c.yield()}await c.yield();const Tt=[];for(let e=0;e<De;e++)for(let a=0;a<Me;a++){const t=e*(Me+1)+a,o=t+1,n=t+Me+1,s=n+1;Tt.push(t,n,o,o,n,s)}await c.yield();const pt=new y.BufferGeometry;pt.setAttribute("position",new y.BufferAttribute(Ct,3)),pt.setAttribute("aCol",new y.BufferAttribute(Ae,3)),pt.setAttribute("aFlex",new y.BufferAttribute(new Float32Array((Me+1)*(De+1)),1)),pt.setIndex(Tt),await c.yield(),await fn(pt,c.yield),await c.yield();const ha=ee(new y.Mesh(pt,me(Aa,Fa,{K_BED:1}))),Ce=(e,a)=>{const t=ht((e-ve)/dt,0,Me-.001),o=ht((a-Ge)/la,0,De-.001),n=Math.floor(t),s=Math.floor(o),i=t-n,r=o-s,l=s*(Me+1)+n;return ke(ke(Bt[l],Bt[l+1],i),ke(Bt[l+Me+1],Bt[l+Me+2],i),r)};await c.yield();const be=Nt(),Ht=[],vt=[],Zt=(e=f)=>{const a=e.range(.88,1.04),t=e.range(-.03,.03);return[E.r*a+t,E.g*a,E.b*a-t*1.5]},Lt=(e,a,t,o,n,s={},i=f)=>{const r=Math.cos(t),l=Math.sin(t),u=e-r*o/2,p=a-l*o/2,v=e+r*o/2,m=a+l*o/2;if(W.sdf(u,p)>-1.5||W.sdf(v,m)>-1.5)return null;const M=s.buttY??Ce(u,p)+n*(s.near?1.25:1.1),g=s.topY??Ce(v,m)+n*.45+(s.prop||0),S=Math.hypot(o,g-M);return{x:u,y:M,z:p,ax:(v-u)/S,ay:(g-M)/S,az:(m-p)/S,L:S,r0:n,near:!!s.near,flare:s.near?1:.85,nRoots:s.near?i.int(7,9):5,nStubs:s.nStubs??(s.near?i.int(9,13):i.int(6,10)),stubLen:[.7,3],stubLift:.45,bone:Zt(i)}},mn=(e,a=f)=>{const t=Ot(be,a,h,e);return Ht.push({o:e,s:t,rs:a}),t},ua=(e,a=40,t=f)=>{for(let o=0;o<a;o++){const n=e();if(n&&p0(n,B,7.5,-.4))return mn(n,t)}return null},pn=Math.round(45+25*Ye),M0=Math.round(pn*.24),z0=5,k0=Math.round(pn*.14),L0=Math.round(15+4*Ye),S0=9,vn=X0((k.approach||[]).map(e=>[e[0],e[1],e[2]]).concat(B)),fa=vn.pointAt(.885),Pa=vn.tangentAt(.885);await c.yield();const gn=Math.hypot(Pa.x,Pa.z)||1,ta=[Pa.x/gn,Pa.z/gn],_a=[-ta[1],ta[0]],yn=Math.cos(.2618),xn=Math.sin(.2618),gt=[_a[0]*yn+ta[0]*xn,_a[1]*yn+ta[1]*xn],bn=[fa.x+_a[0]*7,fa.z+_a[1]*7],Ga=[bn[0]-gt[0]*1.22,bn[1]-gt[1]*1.22],wn={...Lt(Ga[0]+gt[0]*5.1,Ga[1]+gt[1]*5.1,Math.atan2(-gt[1],-gt[0]),12,.5,{near:!0,buttY:-.02,topY:.24}),nStubs:5},Je=mn(wn);await c.yield();let We=0;{const e=Ga[0]+gt[0]*1.22,a=Ga[1]+gt[1]*1.22;for(let t=0;t<Je.length;t++)Math.hypot(Je[t].x-e,Je[t].z-a)<Math.hypot(Je[We].x-e,Je[We].z-a)&&(We=t)}We=ht(We,2,Je.length-2),wn.perch=We;const Mn=(e,a)=>e&&(e.y+=a,e.stubLen=[1.4,4.6],e.stubFat=1.9,e.stubK=.42,e.blunt=!0,e),kt=at(nt("peacock-tangle:"+(c.seed??0)));for(let e=0;e<L0;e++)ua(()=>{const a=e%2===1,t=(a?42:-10)+kt.gauss()*(a?22:24),o=(a?-12:-36)+kt.gauss()*(a?13:17);if(W.sdf(t,o)>-16||t+.12*o>82)return null;const n=Lt(t,o,kt()*6.283,kt.range(16,30),kt.range(.5,.78),{prop:kt.chance(.4)?kt.range(.6,2.6):0,nStubs:6},kt);return n&&Mn(n,kt.chance(.3)?kt.range(.8,2.4):0)},40,kt),await c.yield();for(let e=0;e<S0;e++)ua(()=>{const a=28+(e+f())*19,t=-100+f.sign()*f.range(7,34);return W.sdf(t,a)>-14?null:Mn(Lt(t,a,f()*6.283,f.range(14,26),f.range(.45,.66),{prop:f.chance(.4)?f.range(.5,2):0,nStubs:6}),0)}),await c.yield();await c.yield();let zn=9;for(let e=0;e<M0;e++){const a=e<7,t=()=>{const o=f.range(95,225),n=f.range(-165,25),s=W.sdf(o,n);if(o+.12*n<100||s>-7)return null;const i=Ft(B,o,n),r=zn>0&&i<22,l=f.range(14,24),u=f.range(.32,.5),p=f()*6.283,v=Lt(o,n,p,l,u,{near:r,buttY:a?f.range(-.45,.1):void 0,prop:f.chance(.3)?f.range(.3,.9):0});return v&&r&&p0(v,B,7.5,-.4)&&zn--,v};for(let o=0,n=null;o<6&&!n;o++)n=ua(t,10),await c.yield()}for(let e=0;e<z0;e++)ua(()=>{const a=f.sign(),t=196-e*36+f.range(-10,10),o=-100+a*f.range(9.5,15),n=f.range(25,30),s=f.range(.36,.45),i=(f.chance(.5)?1.5708:-1.5708)+f.range(-.3,.3),r=Math.cos(Math.asin(ht(17/n,0,.9)))*n,l=o-Math.cos(i)*r,u=t-Math.sin(i)*r;return W.sdf(l,u)>-20?null:Lt((o+l)/2,(t+u)/2,i,r,s,{topY:f.range(.5,1.7)})},60),await c.yield();await c.yield();for(let e=0;e<k0;e++)await c.yield(),ua(()=>{const a=f.range(-140,230),t=f.range(-165,228),o=W.sdf(a,t);return o>-6||o<-34?null:Lt(a,t,f()*6.283,f.range(14,26),f.range(.3,.48),{buttY:f.chance(.3)?f.range(-.4,.1):void 0})});await c.yield();const Ut=[1,-1].map(e=>[Mt[0]-ye[0]*11+Le[0]*7.8*e,Mt[2]-ye[1]*11+Le[1]*7.8*e]),j=at(nt("peacock-gate:"+(c.seed??0))),kn=[],Ln=[],Sn=(e,a,t,o,n,s,i=2)=>{let r=e[0];for(const F of e)Math.abs(F.y-a)<Math.abs(r.y-a)&&(r=F);const l=Math.cos(t),u=Math.sin(t),p=-u,v=l,m=r.x+l*r.r*.55,M=r.z+u*r.r*.55,g=j.range(.3,.55)*o,S=j.range(.08,.3)*o,d=j.range(-.25,.25)*o,z=j.range(.8,.98),x=[0,0,0],b=(F,N)=>(N[0]=m+l*o*F+p*d*F*F,N[1]=r.y-g*Math.sin(F*2.36)+S*F*F*F,N[2]=M+u*o*F+v*d*F*F,N),G=F=>n*(1-.78*F)+.018,R=6,I=5;Ve(be,R,I,(F,N,K)=>{const te=F/(R-1),ie=N/I*6.2832,ge=G(te)*(1+.18*Math.sin(ie*2+F));b(te,x),K[0]=x[0]+p*Math.cos(ie)*ge,K[1]=x[1]+Math.sin(ie)*ge,K[2]=x[2]+v*Math.cos(ie)*ge},(F,N,K)=>{const te=z*(.86+.14*((F*3+N)%2));K[0]=s[0]*te,K[1]=s[1]*te,K[2]=s[2]*te},null,null,b(1.04,[0,0,0]));for(let F=0;F<i;F++){const N=j.range(.3,.85),K=b(N,[0,0,0]),te=j.range(.35,.9)*(1-.4*N),ie=j.sign(),ge=j.range(-.9,.25),je=j.range(.1,.6),A=G(N)*.6,C=p*ie*.7+l*je,O=ge,Y=v*ie*.7+u*je,X=Math.hypot(C,O,Y),$=[K[0]+C/X*te,K[1]+O/X*te,K[2]+Y/X*te];Ve(be,2,3,(H,ce,ne)=>{const we=ce/3*6.2832,Fe=A*(H?.5:1),Ie=H*.55;ne[0]=K[0]+($[0]-K[0])*Ie+l*Math.cos(we)*Fe,ne[1]=K[1]+($[1]-K[1])*Ie+Math.sin(we)*Fe,ne[2]=K[2]+($[2]-K[2])*Ie+u*Math.cos(we)*Fe},(H,ce,ne)=>{ne[0]=s[0]*z*.9,ne[1]=s[1]*z*.9,ne[2]=s[2]*z*.9},null,null,$)}const _=b(.42,[0,0,0]);return _[1]+=G(.42),_},Ua=[];for(let e=0;e<Ut.length;e++){const[a,t]=Ut[e],o=Ce(a,t)-.3,n=f.range(-.035,.035),s=f.range(-.035,.035),i=Math.hypot(n,1,s),r=(16+f.range(-.8,1.2)-o)*i,l={x:a,y:o,z:t,ax:n/i,ay:1/i,az:s/i,L:r,r0:.62+.06*e,near:!0,flare:.9,nRoots:6,nStubs:30,stubLen:[.5,1.4],stubLift:-.32,bone:Zt()};Ot(Nt(),f,h,l);const u={...l,nStubs:8,stubLen:[.5,1.3],stubFat:1.3},p=Ot(be,j,h,u),v=e===0?1:-1,m=Math.atan2(-Le[1]*v*.8-ye[1]*.6,-Le[0]*v*.8-ye[0]*.6),M=Math.atan2(Le[1]*v,Le[0]*v);kn.push(Sn(p,7+.5*e,m,2.05,.26,u.bone,1));for(let b=0;b<11;b++){const G=b/10,R=7.6+7.4*G+j.range(-.3,.3);let I=b*2.4+j.range(-.5,.5)+e;const _=Math.cos(I-Math.atan2(-Le[1]*v,-Le[0]*v));Sn(p,R,I,ke(3.2,1.4,G)*j.range(.8,1.1)*(_>.3?.55:1),ke(.24,.13,G),u.bone,G<.7?2:1)}let g=p[0];for(const b of p)Math.abs(b.y-9.2)<Math.abs(g.y-9.2)&&(g=b);const S=Math.cos(M)*.45-ye[0]*.12,d=Math.sin(M)*.45-ye[1]*.12,z=Math.hypot(S,1,d),x={x:g.x+Math.cos(M)*g.r*.35,y:g.y-.5,z:g.z+Math.sin(M)*g.r*.35,ax:S/z,ay:1/z,az:d/z,L:j.range(4.4,5.6),r0:g.r*.62,near:!0,flare:.3,nRoots:0,nStubs:4,stubLen:[.5,1.2],stubFat:1.3,stubLift:-.3,bone:u.bone,sides:7,rings:9,bend:1.6};Ot(be,j,h,x),Ln.push([g.x+Math.cos(M)*(g.r*.9+.12),g.y+.25,g.z+Math.sin(M)*(g.r*.9+.12),M]),Ua.push({o:u,s:p}),await c.yield()}await c.yield();const An=Math.atan2(Le[1],Le[0]),Fn=[];for(let e=0;e<8;e++){const a=e%2?1:-1,t=a*f.range(12.8,21),o=f.range(-1,.5),n=f.range(4.5,7.5),s=f.range(.2,.3),i=An+f.range(-.45,.45)+(f.chance(.5)?Math.PI:0),r=W.SX+Le[0]*t+ye[0]*o,l=W.SZ+Le[1]*t+ye[1]*o,u=f.range(.55,.8)+(e>5?.35:0),p=f.range(-.06,.06),v={x:r-Math.cos(i)*n/2,y:u-p*n/2,z:l-Math.sin(i)*n/2,ax:Math.cos(i)*Math.cos(p),ay:Math.sin(p),az:Math.sin(i)*Math.cos(p),L:n,r0:s,near:!1,flare:.7,nRoots:e%3===0?5:0,nStubs:f.int(2,5),stubLen:[.2,.8],stubLift:.4,bone:Zt()};Fn.push({o:v,s:Ot(be,f,h,v)})}await c.yield();const da=at(nt("peacock-jam:"+(c.seed??0))),ja=[];for(const[e,a,t,o,n,s,i,r]of[[14.5,-1.2,9,.38,.15,1,.03,0],[10.6,-2.2,8,.34,.9,1.15,.16,5],[-13.5,-1.5,10,.4,-.25,.95,-.02,0],[-15.5,-2.6,8.5,.33,1.1,1.3,-.2,5],[-19,-.6,7.5,.36,3.44,1.3,.05,0],[19.5,-.5,8,.35,-.5,1.25,-.08,0],[17,-3.4,11,.42,.5,.85,.12,6],[-9.3,-3.2,7,.3,1.35,1,-.22,0]]){const l=An+n+da.range(-.06,.06),u=da.range(.9,1.04),p=da.range(-.03,.03),v=W.SX+Le[0]*e+ye[0]*a,m=W.SZ+Le[1]*e+ye[1]*a,M={x:v-Math.cos(l)*Math.cos(i)*t/2,y:s-Math.sin(i)*t/2,z:m-Math.sin(l)*Math.cos(i)*t/2,ax:Math.cos(l)*Math.cos(i),ay:Math.sin(i),az:Math.sin(l)*Math.cos(i),L:t,r0:o,near:!1,flare:.8,nRoots:r,nStubs:da.int(4,7),stubLen:[.3,1.1],stubLift:.4,stubFat:1.3,bone:[E.r*u+p,E.g*u,E.b*u-p*1.5],crust:!0,sides:9,rings:12,taper:.7,bend:.4};ja.push({o:M,s:Ot(be,da,h,M),cx:v,cy:s+o*.95,cz:m}),ja.length%3===0&&await c.yield()}await c.yield();const In=at(nt("peacock-laid:"+(c.seed??0))),ma=[];let oe=In,pa=!1;const A0=(e,a)=>Ft(B,e,a,9)<7.8?-.3:9,ze=(e,a,t,o={})=>{const n=Math.hypot(a[0]-e[0],a[1]-e[1],a[2]-e[2]),s=oe.range(.9,1.05),i=oe.range(-.03,.03),r={x:e[0],y:e[1],z:e[2],ax:(a[0]-e[0])/n,ay:(a[1]-e[1])/n,az:(a[2]-e[2])/n,L:n,r0:t,near:!!o.near,flare:o.near?1:.85,nRoots:o.near?oe.int(6,8):5,nStubs:o.nStubs??oe.int(8,11),stubLen:o.stubLen||[.7,2.4],stubLift:.45,stubFat:o.stubFat??(o.near?void 0:1.4),bone:[E.r*s+i,E.g*s,E.b*s-i*1.5],bend:.3,rootLen:o.rootLen??.6,ceilAt:A0,sap:!!o.sap,sapK:o.sapK,sides:o.near?12:7,rings:o.near?22:9,crust:!!o.near,taper:o.near?.7:.6,garden:o.garden,own:pa,stubK:o.stubK,blunt:o.blunt};ma.push({o:r,s:Ot(be,oe,h,r)})},Ya={nStubs:6,stubK:.45,stubFat:1.9,blunt:!0},Ne=(e,a,t)=>[-100+e,a,t],yt=(e,a,t)=>[-100+e,Math.max(a,W.bedAt(-100+e,t)+.7),t];ze(Ne(-7.5,-2.6,134),Ne(-12,-1.6,112),.6,{near:!0,rootLen:.4}),ze(Ne(8,-2.9,127),Ne(13.5,-1.7,104),.56,{near:!0,rootLen:.4}),ze(yt(-13,-9.5,118),yt(10,-7.2,110),.6,{rootLen:.5}),ze(Ne(7,-4.6,108),Ne(16,-2.8,88),.58,{rootLen:.5}),ze(yt(14,-10.5,101),yt(-9,-7.8,93),.62,{rootLen:.5}),ze(yt(-18,-15.3,136),Ne(-7,-6.2,121),.66,{rootLen:1}),ze(yt(20,-15.3,108),Ne(7.5,-6,117),.64,{rootLen:1}),ze(yt(-6,-15.5,96),yt(1,-9.5,113),.6,{rootLen:1}),await c.yield();const Ke=[0];for(let e=1;e<B.length;e++)Ke.push(Ke[e-1]+Math.hypot(B[e][0]-B[e-1][0],B[e][2]-B[e-1][2]));const qt=(e,a,t,o)=>{const n=Ke[36]+e;let s=1;for(;s<B.length-1&&Ke[s]<n;)s++;const i=B[s-1],r=B[s],l=Ke[s]-Ke[s-1],u=(n-Ke[s-1])/l,p=(r[0]-i[0])/l,v=(r[2]-i[2])/l;return[ke(i[0],r[0],u)+p*a-v*t,o,ke(i[2],r[2],u)+v*a+p*t]},Tn=[[-62,[-5,-10,-2.6],[5,9,-1.3],.5,0,0],[-54.5,[3,6.3,-.3],[-4,-9,-1.55],.5,1,1],[-47.5,[-6,-12,-1.9],[7,8,-1],.55,1,0],[-40.5,[6,9.5,-1.8],[-5,-10,-1.05],.5,1,0],[-33,[1,-6.3,-.15],[-3,9.5,-2.6],.46,1,1],[-26,[5,10,-2],[-4,-9,-1.4],.5,1,0],[-19.5,[-5,-11,-2],[5,8,-1.35],.52,1,0],[-10,[1,-6.3,-.1],[-2,7,-2.4],.45,1,1],[-2,[6,8.5,-1.9],[-5,-10,-1],.5,1,0],[6,[-5,-11,-1.8],[6,9,-1.1],.54,1,0],[14,[5,10,-1.9],[-5,-9,-1.2],.5,0,0],[23,[-4,-10,-2],[6,9,-1.3],.52,0,0],[33,[6,9,-2.1],[-5,-9.5,-1.5],.5,0,0],[44,[-5,-9,-2.2],[5,8.5,-1.7],.48,0,0]];for(let e=0;e<Tn.length;e++){const[a,t,o,n,s,i]=Tn[e];ze(qt(a,t[0],t[1],t[2]),qt(a,o[0],o[1],o[2]),n,{near:!!s,sap:!!i,garden:!!i,stubLen:s?[.6,2]:[.7,2.4]}),await c.yield()}await c.yield(),oe=j,ze(Ne(-7,-1.8,84),Ne(-12,-3,66),.62,{near:!0,rootLen:.45}),ze(Ne(7.5,-4.4,96),Ne(12,-2.2,72),.6,{rootLen:.5}),ze(Ne(-7.5,-1.9,56),Ne(-11.5,-3.2,37),.6,{near:!0,rootLen:.45}),await c.yield(),ze(yt(10,-9,52),yt(-7,-7,36),.58,{rootLen:.5}),ze(Ne(-9.4,0,91),Ne(-27,-10.5,82),.52,{near:!0,sap:!0,sapK:1.25,rootLen:.62,garden:!0}),ze(Ne(9.5,-.05,62),Ne(28,-11,68),.5,{near:!0,sap:!0,sapK:1.25,rootLen:.62,garden:!0}),await c.yield(),ze(Ne(8,-2.4,46),Ne(12,-3.6,24),.6,{near:!0,rootLen:.45}),ze(yt(9,-8.5,24),yt(-5,-7,2),.6,{rootLen:.5}),ze(Ne(-10.6,0,27),Ne(-29,-11,20),.5,{near:!0,sap:!0,sapK:1.2,rootLen:.6,garden:!0}),await c.yield();const F0=[[52,[-4,-11,-1.9],[5,9.5,-1.15],.52,1],[59.5,[5,10.5,-1.7],[-4,-10,-1],.5,1],[66.5,[-3,-11.5,-1.6],[4,9,-.95],.5,1],[72.5,[3,12.5,-1.5],[-3,-10.5,-.9],.46,0]],qn=[];for(const[e,a,t,o,n]of F0){const s=qt(e,a[0],a[1],a[2]),i=qt(e,t[0],t[1],t[2]),r=Math.hypot(i[0]-s[0],i[1]-s[1],i[2]-s[2]);ze(s,i,o,{near:!!n,stubLen:n?[.6,2]:[.7,2.4]}),qn.push([(s[0]+i[0])/2,(s[1]+i[1])/2+o*.8,(s[2]+i[2])/2,Math.atan2(i[2]-s[2],i[0]-s[0]),r,(i[1]-s[1])/r]),await c.yield()}oe=at(nt("peacock-moss:"+(c.seed??0))),pa=!0;for(const[e,a]of[[-66,-6.2],[-44,-6.4],[-29,6.2],[-2,6.2],[15,-6.2],[26.5,6.2],[39,-6.4]])ze(qt(e,0,a,-.12),qt(e+oe.range(3,7),0,a*oe.range(2.3,2.8)*1.3,-3.4),oe.range(.46,.54),{near:!0,sap:!0,garden:!0,rootLen:.7,stubLen:[.5,1.6]}),await c.yield();for(const[e,a,t]of[[-40,8.8,.75],[-16,-9.4,.6],[4,9.2,.8],[31,-9,.65]])ze(qt(e-4,0,a*2.7,-4.4),qt(e,0,a,t),oe.range(.42,.5),{near:!0,rootLen:.6,stubLen:[.5,1.5]}),await c.yield();oe=j,pa=!1,oe=at(nt("peacock-isle:"+(c.seed??0)));{const e=(t,o,n=0)=>[t,W.bedAt(t,o)+.6+n,o],a=[[-46,-61,0,-19,-45,.2,.64],[-21,-65,0,-37,-45,1.5,.58],[-13,-59,0,9,-45,.3,.62],[3,-63,.2,-13,-42,1.7,.56],[-50,-51,0,-27,-59,1.1,.56],[-31,-67,0,-5,-61,.9,.6],[-7,-51,2.2,-29,-53,.4,.54],[15,-57,0,-1,-48,1.3,.54],[-58,-62,0,-40,-52,2,.5]];for(let t=0;t<a.length;t++){const o=a[t];ze(e(o[0],o[1],o[2]),e(o[3],o[4],o[5]),o[6],{rootLen:.9,stubLen:[1.2,4],...Ya}),t%3===2&&await c.yield()}}oe=j;const Z=at(nt("peacock-stand:"+(c.seed??0))),va=Nt(),Na=[],Pn=[],_n=[[-113,76,19,1,0],[-87,52,22,1,1],[-112.5,30,16,1,0],[-108.5,6,21,1,0],[-91.5,5,24,1,2],[-83.4,-18.5,22,1,0],[-72.3,-33.2,25,1,0],[-57,-38.4,23,1,3],[-22.3,-33.8,21,1,0],[-104.2,-16.6,17,1,0],[-89.6,-40.9,22,1,0],[-72,-55.2,16,1,0],[-49.5,-57.8,24,1,0],[-38,-57.5,18,1,0],[-24,-56.5,19,1,0],[-4.8,-44.8,21,1,0],[-60,-12,20,0,0],[-48,-22,4,2,0],[-35,-12,22,0,0],[-66,3,16,0,0],[-52,8,19,3,0],[-40,-28,13,0,0],[-28,-6,17,0,0],[-58,22,15,0,0],[-42,24,3.2,2,0],[-74,-12,12,0,0],[-30,14,16,0,0],[-20,-18,20,3,0],[-12,2,14,0,0],[-70,20,18,0,0],[21.7,-31.2,20,1,0],[41.1,-22.9,23,1,4],[62.1,-19.6,17,1,0],[86.2,-23.4,20,1,0],[4.4,-12.6,22,1,0],[23.9,-2.4,18,1,0],[45,3.6,24,1,0],[66.9,5.4,19,1,0],[85.5,3.4,21,1,0],[30,12,15,0,0],[48,18,19,3,0],[62,24,13,0,0],[20,22,17,0,0],[75,16,3.5,2,0],[38,30,12,0,0],[56,9,4.5,2,0],[108,3,18,1,5],[119.3,-9.2,15,1,0],[136.5,-14,17,1,0],[154,-27,20,1,0],[176,-47,15,0,0],[94.3,-51.9,19,0,0],[118.5,-78.3,22,0,0],[139.2,-100.4,16,0,0],[160.3,-124.6,18,0,0],[190.9,-100.8,17,0,0],[202.7,-109.7,13,0,0],[106,-64,13,0,0],[128,-90,17,3,0]],Ue=at(nt("peacock-stand2:"+(c.seed??0))),Gn=(e,a,t,o,n,s,i,r)=>{const l=Math.cos(a),u=Math.sin(a),p=-u,v=l,m=e.x+l*e.r*.55,M=e.z+u*e.r*.55,g=Z.range(.28,.6)*t,S=Z.range(.05,.3)*t,d=Z.range(-.25,.25)*t,z=Z.range(.8,.98),x=[0,0,0],b=(_,F)=>(F[0]=m+l*t*_+p*d*_*_,F[1]=e.y-g*Math.sin(_*2.36)+S*_*_*_,F[2]=M+u*t*_+v*d*_*_,F),G=_=>o*(1-.78*_)+.018,R=(_,F,N)=>{const K=z*(.86+.14*((_*3+F)%2));N[0]=n[0]*K,N[1]=n[1]*K,N[2]=n[2]*K};Ve(be,i,s,(_,F,N)=>{const K=_/(i-1),te=F/s*6.2832,ie=G(K)*(1+.18*Math.sin(te*2+_));b(K,x),N[0]=x[0]+p*Math.cos(te)*ie,N[1]=x[1]+Math.sin(te)*ie,N[2]=x[2]+v*Math.cos(te)*ie},R,null,null,b(1.04,[0,0,0])),Ve(va,3,3,(_,F,N)=>{const K=_/2,te=F/3*6.2832,ie=G(K)*1.15;b(K,x),N[0]=x[0]+p*Math.cos(te)*ie,N[1]=x[1]+Math.sin(te)*ie,N[2]=x[2]+v*Math.cos(te)*ie},R,null,null,b(1.04,[0,0,0]));for(let _=0;_<r;_++){const F=Z.range(.3,.85),N=b(F,[0,0,0]),K=Z.range(.35,.9)*(1-.4*F),te=Z.sign(),ie=Z.range(-.9,.25),ge=Z.range(.1,.6),je=G(F)*.6,A=p*te*.7+l*ge,C=ie,O=v*te*.7+u*ge,Y=Math.hypot(A,C,O),X=[N[0]+A/Y*K,N[1]+C/Y*K,N[2]+O/Y*K];Ve(be,2,3,($,H,ce)=>{const ne=H/3*6.2832,we=je*($?.5:1),Fe=$*.55;ce[0]=N[0]+(X[0]-N[0])*Fe+l*Math.cos(ne)*we,ce[1]=N[1]+(X[1]-N[1])*Fe+Math.sin(ne)*we,ce[2]=N[2]+(X[2]-N[2])*Fe+u*Math.cos(ne)*we},($,H,ce)=>{ce[0]=n[0]*z*.9,ce[1]=n[1]*z*.9,ce[2]=n[2]*z*.9},null,null,X)}const I=b(.45,[0,0,0]);return I[1]+=G(.45),I};for(let e=0;e<_n.length;e++){const[a,t,o,n,s]=_n[e],i=n===1?.7:2.2;let r=a+Z.range(-i,i),l=t+Z.range(-i,i);const u=Z.range(.9,1.12),p=Z.range(.9,1.05),v=Z.range(-.03,.03),m=Z()*6.283,M=Z.range(0,1);if(Ft(B,r,l)<6.8&&(r=a,l=t),W.sdf(r,l)>-4.5||Ft(B,r,l)<6.8)continue;const g=o*(n===2?1:u),S=Ce(r,l)-.5,d=-S,z=d/(g+d);let x=n===3?.2+.16*M:.012+.05*M*M,b=Math.cos(m)*x,G=Math.sin(m)*x;(Ft(B,r+b*(g+d),l+G*(g+d))<7.2||W.sdf(r+b*(g+d),l+G*(g+d))>-2)&&(b=-b,G=-G),Ft(B,r+b*(g+d),l+G*(g+d))<7.2&&(b*=.1,G*=.1);const R=Math.hypot(b,1,G),I=n===1,_=n===2?.62+.3*M:I?.5+.26*Z():.36+.2*Z(),F=[E.r*p+v,E.g*p,E.b*p-v*1.5],N={x:r-b*d,y:S,z:l-G*d,ax:b/R,ay:1/R,az:G/R,L:(g+d)*R,r0:_/(1-.6*z),near:I,flare:.5,nRoots:0,nStubs:n===2?4:I?9:5,stubLen:I?[.5,1.7]:[.5,1.4],stubLift:-.28,stubFat:I?void 0:1.3,bone:F,sides:I?8:6,rings:I?13:8,bend:.55},K=Ot(be,Z,h,N),te=A=>{let C=K[0];for(const O of K)Math.abs(O.y-A)<Math.abs(C.y-A)&&(C=O);return C};if(I){const A=K[K.length-1],C=2+Math.floor(Ue()*2);for(let O=0;O<C;O++){const Y=Ue()*6.283,X=A.x+Math.cos(Y)*A.r*.5,$=A.z+Math.sin(Y)*A.r*.5,H=Ue.range(.5,1.5),ce=A.r*Ue.range(.3,.45),ne=[X+Math.cos(Y)*.12*H,A.y+H,$+Math.sin(Y)*.12*H];Ve(be,2,4,(we,Fe,Ie)=>{const Te=Fe/4*6.2832,He=ce*(we?.55:1);Ie[0]=X+(ne[0]-X)*we*.5+Math.cos(Te)*He,Ie[1]=A.y-.6+(H+.6)*we*.5,Ie[2]=$+(ne[2]-$)*we*.5+Math.sin(Te)*He},(we,Fe,Ie)=>{const Te=.8+.15*we;Ie[0]=F[0]*Te,Ie[1]=F[1]*Te,Ie[2]=F[2]*Te},null,null,ne)}if(Ue()<.34&&g>15){const O=te(g*Ue.range(.5,.62)),Y=Ue()*6.283,X=Math.cos(Y)*.42,$=Math.sin(Y)*.42,H=Math.hypot(X,1,$),ce=Ue.range(3.6,5.6),ne={x:O.x+Math.cos(Y)*O.r*.35,y:O.y-.5,z:O.z+Math.sin(Y)*O.r*.35,ax:X/H,ay:1/H,az:$/H,L:ce,r0:O.r*.6,near:!0,flare:.3,nRoots:0,nStubs:3,stubLen:[.4,1.1],stubFat:1.3,stubLift:-.3,bone:F,sides:6,rings:7,bend:1.6};Ft(B,ne.x+ne.ax*ce,ne.z+ne.az*ce)>7&&Ot(be,Ue,h,ne)}if(Ft(B,r,l)<15){const O=6+Math.floor(Ue()*3);for(let Y=0;Y<O;Y++){const X=te(1.3+(Y+Ue())/O*Math.min(g*.6,9)),$=Ue()*6.283,H=Ue()<.3?Ue.range(1.1,1.9):Ue.range(.3,.8),ce=X.r*Ue.range(.17,.3),ne=Ue.range(-.3,.45),we=Math.hypot(1,ne),Fe=Math.cos($)/we,Ie=ne/we,Te=Math.sin($)/we,He=X.x+Math.cos($)*X.r*.8,bt=X.z+Math.sin($)*X.r*.8,At=[He+Fe*H,X.y+Ie*H,bt+Te*H];if(Ft(B,At[0],At[2])<6.9)continue;const Ee=-Math.sin($),tt=Math.cos($),ut=Ie*tt,wt=Te*Ee-Fe*tt,_t=-Ie*Ee,Za=Ue.range(.78,.98);Ve(be,3,5,(sa,Qt,Gt)=>{const Et=sa*.46,hn=Qt/5*6.2832,h0=ce*(1-.45*Et)*(1+.2*Math.sin(hn*2+Y)),u0=Math.cos(hn)*h0,un=Math.sin(hn)*h0;Gt[0]=He+Fe*H*Et+Ee*u0+ut*un,Gt[1]=X.y+Ie*H*Et+wt*un,Gt[2]=bt+Te*H*Et+tt*u0+_t*un},(sa,Qt,Gt)=>{const Et=Za*(.84+.16*((sa+Qt)%2));Gt[0]=F[0]*Et,Gt[1]=F[1]*Et,Gt[2]=F[2]*Et},null,null,At)}}}const ie=[];for(let A=0;A<K.length;A++)K[A].y>-.4&&(ie.length===0||K[A].y-ie[ie.length-1].y>2.6||A===K.length-1)&&ie.push(K[A]);ie.length>1&&Ve(va,ie.length,6,(A,C,O)=>{const Y=ie[A],X=C/6*6.2832,$=Y.r*(A===ie.length-1?.6:1.05);O[0]=Y.x+Math.cos(X)*$,O[1]=Math.max(Y.y,0),O[2]=Y.z+Math.sin(X)*$},(A,C,O)=>{O[0]=F[0],O[1]=F[1],O[2]=F[2]},null,null,null);const ge=n===2?0:I?4:2;let je=null;for(let A=0;A<ge;A++){const C=(A+Z.range(.1,.9))/ge,O=g*(.36+.6*C),Y=A*2.4+m+Z.range(-.5,.5),X=te(O),$=Gn(X,Y,ke(3.4,1.3,C)*Z.range(.75,1.15)*(I?1:.8),X.r*Z.range(.3,.42),F,I?4:3,I?5:3,I?2:1);A===0&&(je=$)}if(s){const A=te(Math.min(g*.42,7.5)),C=(()=>{let Y=1e9,X=0,$=0;for(let H=0;H<B.length;H++){const ce=Math.hypot(B[H][0]-r,B[H][2]-l);ce<Y&&(Y=ce,X=B[H][0],$=B[H][2])}return[X,$]})(),O=Gn(A,Math.atan2(C[1]-l,C[0]-r)+Z.range(-.5,.5),2.1,.2,F,4,5,1);Pn.push(new y.Vector3(O[0],O[1]+.06,O[2]))}Na.push({o:N,s:K,x:r,z:l,H:g,kind:n,near:I,top:K[K.length-1],wl:te(0)}),await c.yield()}await c.yield(),oe=at(nt("peacock-raft:"+(c.seed??0))),pa=!0;const Xa=[],$a=[];for(let a=0;a<20;a++){const t=(a+oe.range(.1,.9))/20,o=a%2===1,n=a>>1,s=ke(14,124,t),i=ke(-16,-9,t)+oe.gauss()*(o?9:14)+((n+a)%2?-5:5),r=(n*7.2+(o?4.8:2.4)+oe.range(-.5,.5))%6.283,l=oe.range(17,29),u=o?oe.range(.62,.9):oe.range(.52,.74),p=Math.cos(r)*l/2,v=Math.sin(r)*l/2,m=s-p,M=i-v,g=s+p,S=i+v;if(W.sdf(m,M)>-9||W.sdf(g,S)>-9)continue;const d=o?oe.range(-5.6,-3.1):oe.range(-9.5,-6.8),z=oe.range(-1.3,1.3),x=Math.min(-2.2,Math.max(d-z,Ce(m,M)+u*1.15)),b=Math.min(-2.2,Math.max(d+z,Ce(g,S)+u*.8));ze([m,x,M],[g,b,S],u,{rootLen:o?1.25:1,stubLen:[1.4,4.4],...Ya}),o&&Xa.push([s,(x+b)/2+u,i,r,l,(b-x)/l]),o&&await c.yield()}oe=at(nt("peacock-turn:"+(c.seed??0)));for(let a=0;a<11;a++){const t=(a+oe.range(.1,.9))/11,o=ke(-70,2,t)+oe.gauss()*4,n=ke(-62,-72,Math.sin(t*3.1416))+oe.gauss()*6+((a>>1)%2?7:-7),s=(a*2.4+oe.range(-.5,.5))%6.283,i=oe.range(17,28),r=oe.range(.6,.86),l=Math.cos(s)*i/2,u=Math.sin(s)*i/2,p=o-l,v=n-u,m=o+l,M=n+u;if(W.sdf(p,v)>-9||W.sdf(m,M)>-9||Math.hypot(o+41,n+35.5)<21)continue;const g=oe.range(-5.4,-3),S=oe.range(-1.2,1.2),d=Math.min(-2.4,Math.max(g-S,Ce(p,v)+r*1.15)),z=Math.min(-2.4,Math.max(g+S,Ce(m,M)+r*.8));ze([p,d,v],[m,z,M],r,{rootLen:1.2,stubLen:[1.4,4.4],...Ya}),$a.push([o,(d+z)/2+r,n,s,i,(z-d)/i]),a%3===2&&await c.yield()}oe=Z,pa=!1;{const e=oe;oe=at(nt("peacock-drift:"+(c.seed??0)));for(const[a,t,o,n,s,i]of[[-106.5,253,-103.3,246,.26,0],[-93.2,249.5,-96.4,241,.3,0],[-105.6,243.5,-103.6,236,.24,0],[-96,236.5,-97.4,225,.32,1],[-104.8,235.5,-101.8,223.5,.3,1],[-108.5,231,-110.5,214,.34,2]]){const r=i===2?Ce(a,t)+s*1.1:s-.13,l=i?Ce(o,n)+s*.8:s*.8-.13;ze([a,r,t],[o,l,n],s,{near:i===0,rootLen:.2,stubLen:[.3,.9],nStubs:4,blunt:!0}),ma.pop()}oe=e,await c.yield()}const q=at(nt("peacock-arch:"+(c.seed??0))),lt=[],Nn=[];{const e=[[-126.6,Math.min(-9,Ce(-126.6,4)+.9),4],[-122.6,-1.8,3.3],[-118.6,7.5,2.5],[-112.5,15,1.2],[-105,18.8,-.2],[-97,18.9,-1.4],[-89.5,15.2,-2.2],[-84,8.6,-2.6],[-80.6,1.8,-2.7],[-78.6,-3.6,-2.4],[-77.6,-8.5,-2]],a=e.length,t=(d,z)=>{const x=ht(d,0,1)*(a-1),b=Math.min(a-2,Math.floor(x)),G=x-b,R=e[Math.max(b-1,0)],I=e[b],_=e[b+1],F=e[Math.min(b+2,a-1)];for(let N=0;N<3;N++)z[N]=.5*(2*I[N]+(_[N]-R[N])*G+(2*R[N]-5*I[N]+4*_[N]-F[N])*G*G+(3*I[N]-R[N]-3*_[N]+F[N])*G*G*G);return z},o=q()*100,n=q.range(1.02,1.1),s=[E.r*n,E.g*n,E.b*n*.97],i=[0,0,0],r=[0,0,0],l=d=>{t(d-.004,i),t(d+.004,r);let z=r[0]-i[0],x=r[1]-i[1],b=r[2]-i[2];const G=Math.hypot(z,x,b)||1;z/=G,x/=G,b/=G;let R=-x,I=z,_=0;const F=Math.hypot(R,I)||1;return R/=F,I/=F,{c:t(d,[0,0,0]),t:[z,x,b],n:[R,I,_],b:[x*_-b*I,b*R-z*_,z*I-x*R]}},u=d=>ke(1.28,.4,Math.pow(d,.85))*(1+.5*Math.exp(-d*40)),p=46,v=12,m=[];for(let d=0;d<p;d++)m.push(l(d/(p-1)));let M=[0,0,0];Ve(be,p,v,(d,z,x)=>{const b=m[d],G=d/(p-1),R=z/v*6.2832,I=Math.cos(R),_=Math.sin(R),F=u(G)*(1+.16*h.n3(I*1.2+o,_*1.2,G*22)+.06*h.n3(I*3.5+o,_*3.5,G*70))*(1+.1*Math.abs(Math.sin(R*2.5+G*9)));x[0]=b.c[0]+(b.n[0]*I+b.b[0]*_)*F,x[1]=b.c[1]+(b.n[1]*I+b.b[1]*_)*F,x[2]=b.c[2]+(b.n[2]*I+b.b[2]*_)*F,M=x},(d,z,x)=>{const b=.86+.16*h.n3(M[0]*.8+o,M[1]*.8,M[2]*.8);x[0]=s[0]*b,x[1]=s[1]*b,x[2]=s[2]*b},()=>1,m[0].c,m[p-1].c);for(let d=0;d<p;d++){const z=m[d],x=d/(p-1);lt.push({x:z.c[0],y:z.c[1],z:z.c[2],r:u(x),t:x,n:z.n,b:z.b,tg:z.t})}await c.yield();const g=(d,z,x,b,G,R)=>{const I=l(d),_=Math.cos(z),F=Math.sin(z),N=I.n[0]*_+I.b[0]*F+I.t[0]*.35,K=I.n[1]*_+I.b[1]*F+I.t[1]*.35,te=I.n[2]*_+I.b[2]*F+I.t[2]*.35,ie=Math.hypot(N,K,te)||1,ge=N/ie,je=K/ie,A=te/ie,C=u(d)*.7,O=I.c[0]+ge*C,Y=I.c[1]+je*C,X=I.c[2]+A*C,$=Math.hypot(ge,A)||1,H=-A/$,ce=ge/$,ne=-je*ce,we=A*H-ge*ce,Fe=je*H,Ie=q.range(.82,1),Te=x>3?6:4,He=[0,0,0],bt=(Ee,tt)=>(tt[0]=O+ge*x*Ee,tt[1]=Y+je*x*Ee-G*x*Ee*Ee,tt[2]=X+A*x*Ee,tt),At=(Ee,tt,ut)=>{const wt=Ie*(.84+.16*((Ee+tt)%2))*(Ee===Te-1?.7:1);ut[0]=s[0]*wt,ut[1]=s[1]*wt,ut[2]=s[2]*wt};Ve(be,Te,5,(Ee,tt,ut)=>{const wt=Ee/(Te-1),_t=tt/5*6.2832,Za=b*(1-.5*wt)*(1+.2*Math.sin(_t*2+Ee))*(Ee===Te-1?.55+.45*(tt*3%2):1),sa=Math.cos(_t)*Za,Qt=Math.sin(_t)*Za,Gt=Ee===Te-1?tt*2%3*.1*b*3:0;bt(wt+Gt/x,He),ut[0]=He[0]+H*sa+ne*Qt,ut[1]=He[1]+we*Qt,ut[2]=He[2]+ce*sa+Fe*Qt},At,()=>1,null,bt(.98,[0,0,0])),R&&Ve(va,3,3,(Ee,tt,ut)=>{const wt=tt/3*6.2832,_t=b*(1-.25*Ee)*1.1;bt(Ee/2,He),ut[0]=He[0]+H*Math.cos(wt)*_t,ut[1]=Math.max(0,He[1]+Math.sin(wt)*_t),ut[2]=He[2]+ce*Math.cos(wt)*_t},At,null,null,null),Nn.push({t:d,tip:bt(1,[0,0,0]),mid:bt(.5,[0,0,0]),rb:b})};for(let d=0;d<15;d++){const z=.13+.05*d+q.range(-.015,.015),x=z>.62,b=(d%2?1:-1)*q.range(.5,1.5)+(d%5===4?3.14:0);g(z,b,x?q.range(2.6,5.2):d%4===1?q.range(2.2,3.4):q.range(.7,1.6),u(z)*q.range(.2,.3),x?q.range(.18,.4):q.range(0,.15),x||d%4===1)}const S=lt.filter(d=>d.y>-.6);Ve(va,S.length,8,(d,z,x)=>{const b=S[d],G=z/8*6.2832,R=Math.cos(G),I=Math.sin(G),_=b.r*1.04;x[0]=b.x+(b.n[0]*R+b.b[0]*I)*_,x[1]=Math.max(b.y+(b.n[1]*R+b.b[1]*I)*_,0),x[2]=b.z+(b.n[2]*R+b.b[2]*I)*_},(d,z,x)=>{x[0]=s[0],x[1]=s[1],x[2]=s[2]},null,null,null)}await c.yield();const Pt=new y.BufferGeometry;Pt.setAttribute("position",new y.Float32BufferAttribute(be.p,3)),await c.yield(),Pt.setAttribute("aCol",new y.Float32BufferAttribute(be.c,3)),await c.yield(),Pt.setAttribute("aFlex",new y.Float32BufferAttribute(be.f,1)),await c.yield(),Pt.setIndex(be.i),await c.yield(),await fn(Pt,c.yield),await c.yield();const ga=me(Aa,Fa,{K_WOOD:1},{},{side:y.DoubleSide}),jt=be.i,xt=be.p,On=[],Bn=[],Cn=[],Kn=[],Rn=[];for(let e=0;e<jt.length;e+=3){e%12e3===11997&&await c.yield();const a=jt[e]*3,t=jt[e+1]*3,o=jt[e+2]*3,n=Math.max(xt[a+2],xt[t+2],xt[o+2]),s=Math.max(xt[a],xt[t],xt[o])<-62&&Math.min(xt[a+2],xt[t+2],xt[o+2])>12;(Math.max(xt[a+1],xt[t+1],xt[o+1])>-.45?On:n>60?s?Kn:Bn:s?Rn:Cn).push(jt[e],jt[e+1],jt[e+2])}await c.yield();const Oa=e=>{const a=new y.BufferGeometry;for(const t in Pt.attributes)a.setAttribute(t,Pt.attributes[t]);return a.setIndex(e),a};Pt.setIndex(On),ee(new y.Mesh(Pt,ga));const I0=ee(new y.Mesh(Oa(Bn),ga)),T0=ee(new y.Mesh(Oa(Cn),ga)),q0=ee(new y.Mesh(Oa(Kn),ga)),P0=ee(new y.Mesh(Oa(Rn),ga));await c.yield();const Qa=[],En=[],Vn=[],Dn=[],_0=$e.x/$e.y,G0=$e.z/$e.y;for(const{o:e,s:a}of Ht.concat(ma)){const t=Math.hypot(e.ax,e.az)||1,o=-e.az/t,n=e.ax/t;let s=-1;for(let i=0;i<a.length;i+=2){const r=a[i];if(r.y>-.3){s=-1;continue}const l=Math.max(0,r.y-Ce(r.x,r.z)),u=r.x-_0*l,p=r.z-G0*l,v=r.r*(i===0?3.2:1.35)+.2+l*.15,m=ht(1-l*.07,.42,1),M=Qa.length/3;for(const g of[-1,1]){const S=u+o*v*g,d=p+n*v*g;Qa.push(S,Ce(S,d)+.13,d),En.push(i/(a.length-1),g*.5+.5),Vn.push(m)}s>=0&&Dn.push(s,s+1,M,s+1,M+1,M),s=M}}const ya=new y.BufferGeometry;ya.setAttribute("position",new y.Float32BufferAttribute(Qa,3)),ya.setAttribute("uv",new y.Float32BufferAttribute(En,2)),ya.setAttribute("aStr",new y.Float32BufferAttribute(Vn,1)),ya.setIndex(Dn);const Wn={transparent:!0,depthWrite:!1,side:y.DoubleSide,blending:y.CustomBlending,blendEquation:y.AddEquation,blendSrc:y.ZeroFactor,blendDst:y.SrcColorFactor};ee(new y.Mesh(ya,me(b0,w0,{},{},Wn)),1),await c.yield();let Re=Nt(),w=f;const pe=(e,a,t,o,n,s)=>(Re.p.push(e,a,t),Re.c.push(o.r*n,o.g*n,o.b*n),Re.f.push(s),Re.p.length/3-1),N0=D.clone().multiplyScalar(.95),Hn=ot(D,P,.35),xa=ot(P,qe("#A8B45A"),.55).multiplyScalar(.85),Zn=ot(U,qe("#3E7A3A"),.55),Un=ot(U,qe("#7FB04A"),.6),jn=ot(de,qe("#7FA83A"),.5),st=qe("#4A3A2A"),Be=(e,a,t,o,n,s=1,i=null)=>{const r=w.chance(.5)?N0:Hn,l=i||r,u=w.range(.75,1.1)*s,p=w.range(.7,1.3),v=w()*6.28;Ve(Re,3,6,(m,M,g)=>{const S=v+M/6*6.2832,d=m*.5,z=o*Math.cos(d)*(1+.2*Math.sin(M*2.3+v));g[0]=e+Math.cos(S)*z*p,g[1]=a-.06+n*Math.sin(d),g[2]=t+Math.sin(S)*z/p},(m,M,g)=>{const S=u*(.7+.2*m);g[0]=l.r*S,g[1]=l.g*S,g[2]=l.b*S},null,null,[e,a-.06+n*.95,t])},Yt=at(nt("peacock-sprays:"+(c.seed??0))),Ba=(e,a,t,o,n,s)=>{for(let i=0;i<9;i++){const r=Yt()*6.283,l=o*1.15*Math.sqrt(Yt()),u=e+Math.cos(r)*l,p=t+Math.sin(r)*l,v=a+o*Yt.range(-.4,.95),m=Yt()*6.283,M=ht(o*.44,.09,.17)*Yt.range(.8,1.25),g=M*.3,S=Math.cos(m),d=Math.sin(m),z=Yt.range(-.6,.35),x=s*Yt.range(.7,1.25),b=pe(u-d*g,v,p+S*g,n,x*.78,.8),G=pe(u+d*g,v,p-S*g,n,x*.78,.8),R=pe(u+S*M,v+z*M,p+d*M,n,x*1.18,1.1);Re.i.push(b,G,R)}},ct=(e,a,t,o,n)=>{for(let s=0;s<o;s++){const i=w()*6.283,r=w.range(.25,1),l=n*w.range(.6,1),u=.022+l*.02,p=Math.cos(i),v=Math.sin(i),m=w.range(.8,1.15),M=pe(e-v*u,a,t+p*u,xa,m*.7,0),g=pe(e+v*u,a,t-p*u,xa,m*.7,0),S=e+p*l*.16*r,d=t+v*l*.16*r,z=pe(S-v*u*.7,a+l*.58,d+p*u*.7,xa,m,.5),x=pe(S+v*u*.7,a+l*.58,d-p*u*.7,xa,m,.5),b=pe(e+p*l*.55*r,a+l*(1-.25*r),t+v*l*.55*r,xa,m*1.2,1.2);Re.i.push(M,g,z,g,x,z,z,x,b)}},Kt=(e,a,t,o)=>{const n=w.range(-.08,.08)*o,s=w.range(-.08,.08)*o,i=Math.max(3,Math.round(o*3.4)),r=w()*6.28,l=w.range(.85,1.15),u=pe(e-.025,a-.1,t,st,1,0),p=pe(e+.025,a-.1,t+.02,st,1,0),v=pe(e,a-.1,t-.03,st,1,0),m=pe(e+n,a+o,t+s,Un,1,1);Re.i.push(u,p,m,p,v,m,v,u,m);for(let M=0;M<i;M++){const g=(M+.4)/i,S=a+o*(.14+.8*g),d=o*.34*(1-g*.82)+.03,z=e+n*g,x=t+s*g,b=d*.5,G=pe(z,S+d*.42,x,Zn,.6*l,.3+.5*g);let R=-1,I=-1;for(let _=0;_<10;_++){const F=r+M*.7+_/10*6.2832,N=d*(_%2?.5:1)*w.range(.85,1.15),K=pe(z+Math.cos(F)*N,S-(_%2?b*.3:b),x+Math.sin(F)*N,_%2?Zn:Un,l*(_%2?.7:1.05),.5+.7*g);I>=0?Re.i.push(G,I,K):R=K,I=K}Re.i.push(G,I,R)}},O0=-.37,B0=.93,C0=(e,a,t,o)=>{const n=w()*6.283,s=w.range(.05,.11),i=w.range(.7,1.15),r=Math.cos(n)*s,l=Math.sin(n)*s;let u=-1;for(let p=0;p<=4;p++){const v=p/4,m=e+O0*o*v*v*.9,M=a+o*(.75*v-.3*v*v),g=t+B0*o*v*v*.9,S=1-.7*v,d=pe(m-r*S,M,g-l*S,jn,i*(.6+.6*v),v),z=pe(m+r*S,M,g+l*S,jn,i*(.6+.6*v),v);u>=0&&Re.i.push(u,u+1,d,u+1,z,d),u=d}},Yn=({o:e,s:a})=>{const t=Math.hypot(e.ax,e.az)<.2?0:1;let o=w.int(2,3),n=!1;for(let s=0;s<a.length;s++){const i=a[s],r=i.y+i.r*.92;if(r>.07&&t){if(n=!0,e.perch!==void 0&&s>=e.perch-1)continue;w.chance(.85)&&Be(i.x+w.range(-.1,.1),r,i.z+w.range(-.1,.1),i.r*w.range(.7,1.15)+.12,w.range(.08,.2)),w.chance(.5)&&ct(i.x+w.range(-.15,.15),r+.03,i.z+w.range(-.15,.15),w.int(4,7),w.range(.35,.8)),o>0&&w.chance(.2)&&(Kt(i.x,r+.08,i.z,w.range(.7,1.5)),o--,vt.push(new y.Vector3(i.x,r,i.z)))}else if(r<-.5&&r>-8.5&&s%3===1&&w.chance(.75))for(let l=0;l<2;l++)C0(i.x+w.range(-.2,.2),r-.1,i.z+w.range(-.2,.2),Math.min(w.range(1,2.6),(-r-.12)/.47))}if(e.y+e.r0*2>.1&&e.nRoots){n=!0;for(let s=0;s<4;s++){const i=w()*6.283,r=e.r0*w.range(.3,1.6);Be(e.x+Math.cos(i)*r*.5,Math.max(.1,e.y+e.r0*w.range(1,1.9)),e.z+Math.sin(i)*r*.5,w.range(.25,.5),w.range(.1,.22))}ct(e.x,Math.max(.12,e.y+e.r0*1.7),e.z,7,w.range(.5,.9)),(w.chance(.7)||e.sap)&&Kt(e.x+w.range(-.2,.2),Math.max(.15,e.y+e.r0*1.8),e.z+w.range(-.2,.2),(e.sap?w.range(1.3,1.7):w.range(.8,1.5))*(e.sapK||1))}n&&!vt.some(s=>Math.hypot(s.x-e.x,s.z-e.z)<3)&&vt.push(new y.Vector3(e.x+e.ax*e.L*(e.ay>.2?1:0),.3,e.z+e.az*e.L*(e.ay>.2?1:0)))};for(const e of Ht.concat(Fn))w=e.rs||f,Yn(e);w=f,await c.yield();{const e=w;w=at(nt("peacock-perch:"+(c.seed??0)));for(let a=0;a<Je.length;a++){const t=Je[a],o=t.y+t.r*.92;o<.07||a===We||a===We-1||(a>We?Be(t.x+w.range(-.08,.08),o,t.z+w.range(-.08,.08),t.r*w.range(.75,1.1)+.1,w.range(.07,.15)):a===We-3&&(Be(t.x,o,t.z,t.r*1.1+.12,.16),Kt(t.x,o+.1,t.z,1.45)))}w=e}const K0=vt.length,R0=at(nt("peacock-own:"+(c.seed??0)));for(const e of ma)w=e.o.own?R0:In,Yn(e);w=f;const E0=vt.splice(K0);w=Z;const Rt=qe("#2c5a27"),ba=P.clone().multiplyScalar(.95),wa=Q.clone().multiplyScalar(.95),Xn=(e,a,t,o,n)=>{for(let s=0;s<10;s++){const i=Z()*6.283,r=o*Z.range(.08,.5),l=o*Z.range(.35,1),u=o*Z.range(.16,.25),p=Z.range(.75,1.2),v=Math.cos(i),m=Math.sin(i),M=e+v*r,g=t+m*r,S=a+l,d=pe(e-.02,a-.05,t,st,1,0),z=pe(e+.02,a-.05,t+.02,st,1,0),x=pe(M,S-u*.6,g,st,1,.5);Re.i.push(d,z,x),Ba(M,S,g,u,n,p)}};for(let e=0;e<Na.length;e++){const a=Na[e],t=a.wl,o=a.near||a.kind===2?5:2;for(let n=0;n<o;n++){const s=(n+Z.range(-.4,.4))/o*6.283,i=t.r*Z.range(.95,1.2);Be(t.x+Math.cos(s)*i,Z.range(.03,.55),t.z+Math.sin(s)*i,Z.range(.3,.55),Z.range(.14,.26),Z.range(.7,1.1),n%2?Rt:null)}if(o>3)for(let n=0;n<2;n++){const s=Z()*6.283;ct(t.x+Math.cos(s)*t.r*1.25,.1,t.z+Math.sin(s)*t.r*1.25,6,Z.range(.5,1))}if(a.kind===2){const n=a.top,s=n.r*1.2;for(let i=0;i<4;i++){const r=Z()*6.283,l=s*Z.range(0,.7);Be(n.x+Math.cos(r)*l,n.y-.15,n.z+Math.sin(r)*l,s*Z.range(.55,.9),Z.range(.2,.34),Z.range(.8,1.15),i===1?Rt:null)}ct(n.x,n.y+.05,n.z,7,Z.range(.6,.95)),Kt(n.x-.15,n.y+.1,n.z+.1,Z.range(1.3,1.9)),Xn(n.x+s*.5,n.y+.1,n.z-s*.3,Z.range(1,1.4),e%3===0?wa:ba)}e%12===11&&await c.yield()}w=at(nt("peacock-moss2:"+(c.seed??0)));{const e=(t,o,n,s,i)=>{for(let r=0;r<10;r++){const l=w()*6.283,u=s*w.range(.08,.5),p=s*w.range(.35,1),v=s*w.range(.16,.25),m=w.range(.75,1.2),M=Math.cos(l),g=Math.sin(l),S=t+M*u,d=n+g*u,z=o+p,x=pe(t-.02,o-.05,n,st,1,0),b=pe(t+.02,o-.05,n+.02,st,1,0),G=pe(S,z-v*.6,d,st,1,.5);Re.i.push(x,b,G),Ba(S,z,d,v,i,m)}},a=E.clone().multiplyScalar(.82);for(const{o:t}of ma){if(!t.garden)continue;const o=t.r0*3.4,n=Math.max(.6,t.y+t.r0*2.3),s=t.x+t.ax*t.r0*.4,i=t.z+t.az*t.r0*.4;for(let r=0;r<14;r++){const l=w()*6.283,u=o*Math.sqrt(w())*.92,p=n*1.3*(1-.72*u/o);Be(s+Math.cos(l)*u,Math.max(.05,p*w.range(.6,1)),i+Math.sin(l)*u,w.range(.5,.9)*1.3,w.range(.3,.55)*1.2,w.range(.8,1.2),r%4===0?Rt:null)}for(let r=0;r<5;r++){const l=r/5*6.283+w.range(-.5,.5);ct(s+Math.cos(l)*o*.95,.04,i+Math.sin(l)*o*.95,6,w.range(.5,.9))}for(let r=0;r<3;r++){const l=w()*6.283,u=o*w.range(.1,.5),p=(r===0?w.range(1.5,1.9):w.range(.9,1.4))*1.35,v=s+Math.cos(l)*u,m=i+Math.sin(l)*u;Kt(v,n*.82,m,p)}e(s+w.range(-.5,.5)*o,n*.6,i+w.range(-.5,.5)*o,w.range(1,1.4)*1.3,w.chance(.5)?wa:ba);for(let r=0;r<7;r++){const l=r/7*6.283+w.range(-.35,.35),u=o*w.range(1,1.18);Be(s+Math.cos(l)*u,.02,i+Math.sin(l)*u,w.range(.3,.55),w.range(.07,.13),1,a)}await c.yield()}}await c.yield();for(const e of ja){for(let a=1;a<e.s.length;a+=2){const t=e.s[a];w.chance(.7)&&Be(t.x+w.range(-.1,.1),t.y+t.r*.9,t.z+w.range(-.1,.1),t.r*w.range(.9,1.4)+.1,w.range(.12,.26),w.range(.8,1.2),a%4===1?Rt:null)}w.chance(.6)&&ct(e.cx+w.range(-1,1),.7,e.cz+w.range(-1,1),7,w.range(.6,1))}await c.yield();for(let e=-23;e<=23;e+=1.3){if(Math.abs(e)<6.6||!w.chance(.72))continue;const a=w.range(-.5,.6),t=W.SX+Le[0]*e+ye[0]*a,o=W.SZ+Le[1]*e+ye[1]*a,n=Math.max(.2,Ce(t,o));Be(t,n+.02,o,w.range(.45,.95),w.range(.16,.34),w.range(.8,1.2),w.chance(.35)?Rt:null),w.chance(.3)&&ct(t+.3,n+.1,o,6,w.range(.5,.9))}await c.yield(),w=q;{const e=qe("#b4c2a0"),a=qe("#6f8a4a"),t=(n,s)=>[n.x+n.n[0]*n.r*.88+n.b[0]*s,n.y+n.n[1]*n.r*.88+n.b[1]*s,n.z+n.n[2]*n.r*.88+n.b[2]*s];for(let n=2;n<lt.length-2;n++){const s=lt[n];if(s.y<.5)continue;const i=ht(s.n[1],0,1);for(let r=0;r<2;r++)if(q()<.25+.6*i){const l=t(s,q.range(-.55,.55)*s.r);Be(l[0]+q.range(-.3,.3),l[1],l[2],s.r*q.range(.4,.75),q.range(.14,.3),q.range(.8,1.2),q()<.35?Rt:null)}if(i>.6&&q()<.3){const r=t(s,q.range(-.3,.3)*s.r);ct(r[0],r[1]+.04,r[2],6,q.range(.5,.95))}}for(const n of[.34,.45,.58]){const s=lt[Math.round(n*(lt.length-1))],i=t(s,q.range(-.2,.2));Kt(i[0],i[1]+.05,i[2],q.range(1.5,2.6))}for(const[n,s]of[[.4,ba],[.52,wa]]){const i=lt[Math.round(n*(lt.length-1))],r=t(i,q.range(-.4,.4)*i.r),l=q.range(1.1,1.6);for(let u=0;u<10;u++){const p=q()*6.283,v=l*q.range(.08,.5),m=l*q.range(.35,1),M=l*q.range(.16,.25),g=q.range(.75,1.2),S=Math.cos(p),d=Math.sin(p),z=r[0]+S*v,x=r[2]+d*v,b=r[1]+m,G=pe(r[0]-.02,r[1]-.05,r[2],st,1,0),R=pe(r[0]+.02,r[1]-.05,r[2]+.02,st,1,0),I=pe(z,b-M*.6,x,st,1,.5);Re.i.push(G,R,I),Ba(z,b,x,M,s,g)}}for(let n=1;n<lt.length;n++){const s=lt[n-1],i=lt[n];if(s.y>0==i.y>0)continue;const r=s.y/(s.y-i.y),l=ke(s.x,i.x,r),u=ke(s.z,i.z,r),p=ke(s.r,i.r,r)*1.15;for(let v=0;v<7;v++){const m=(v+q.range(-.4,.4))/7*6.283;Be(l+Math.cos(m)*p,q.range(.03,.5),u+Math.sin(m)*p,q.range(.3,.6),q.range(.14,.26),q.range(.7,1.1),v%2?Rt:null)}for(let v=0;v<3;v++){const m=q()*6.283;ct(l+Math.cos(m)*p*1.2,.1,u+Math.sin(m)*p*1.2,6,q.range(.6,1.1))}}const o=(n,s,i,r,l)=>{const u=q()*6.283,p=Math.cos(u)*l,v=Math.sin(u)*l,m=q.range(.75,1.15),M=q()<.3?a:e,g=q.range(-.12,.12),S=q.range(-.12,.12);let d=-1;for(let z=0;z<=4;z++){const x=z/4,b=1-.85*x,G=n+g*r*x*x,R=s-r*x,I=i+S*r*x*x,_=x*x*2.4,F=pe(G-p*b,R,I-v*b,M,m*(.7+.45*x),_),N=pe(G+p*b,R,I+v*b,M,m*(.7+.45*x),_);d>=0&&Re.i.push(d,d+1,F,d+1,N,F),d=F}};for(let n=4;n<lt.length-3;n++){const s=lt[n];if(s.y<3.2)continue;const i=s.n[1]>=0?1:-1;for(let r=0;r<2;r++)if(q()<.62){const l=q.range(-.7,.7)*s.r,u=s.y-Math.abs(s.n[1])*s.r*.8;o(s.x-s.n[0]*i*s.r*.8+s.b[0]*l+q.range(-.4,.4),u,s.z+s.b[2]*l,Math.min(q.range(.9,3.8),u-.6),q.range(.09,.24))}}for(const n of Nn)if(n.mid[1]>3&&n.rb>.12)for(const s of[n.mid,n.tip])s[1]>2.5&&o(s[0],s[1]-n.rb*.5,s[2],Math.min(q.range(.8,2.6),s[1]-.6),q.range(.08,.18))}await c.yield(),await c.yield();const xe={x:-41,z:-35.5,r:7.5,trees:[]};{const e=q()*50,a=m=>xe.r*(1+.13*Math.sin(m*2+e)+.08*Math.sin(m*5+e*3)+.05*Math.sin(m*9+e*7)),t=[1.04,.8,.56,.32],o=[[.42,.438],[.62,.638],[.82,.838]],n=(m,M)=>1+.05*Math.sin(m*4+M*2.1+e)+.03*Math.sin(m*7+M*3.7+e*2),s=(m,M)=>{const g=Math.atan2(M,m),S=Math.hypot(m,M)/a(g);let d=t[3];for(let z=0;z<3;z++){const x=n(g,z);if(S<o[z][1]*x){d=ke(t[z],t[z+1],Ze(o[z][0]*x,o[z][1]*x,S));break}}return d+.04*h.n2(m*.3+e,M*.3)+.12*(1-Ze(0,.4,S))};xe.heightAt=(m,M)=>s(m-xe.x,M-xe.z);const i=Nt(),r=[[1.02,-.22],[1.12,-.36],[1.15,-1.2],[1.33,-1.38],[1.37,-2.6],[1.62,-2.82],[1.67,-4.5],[2,-4.8],[2.06,-7.4],[2.48,-7.8],[2.56,-11.6],[3.05,-12.2],[3.3,-21]],l=8,u=40,p=E.clone().multiplyScalar(.95);let v=[0,0,0];Ve(i,l+r.length,u,(m,M,g)=>{const S=M/u*6.2832;let d,z=1;if(m<l){const R=m-1>>1;d=m===0?.2:m===l-1?.985:o[R][m-1&1]*n(S,R)}else{const R=Math.floor((m-l+1)/2);d=r[m-l][0],z=1+.07*Math.sin(S*5+R*1.9+e)+.045*Math.sin(S*8+R*3.3+e*2)}const x=a(S)*d*z,b=Math.cos(S)*x,G=Math.sin(S)*x;g[0]=xe.x+b,g[2]=xe.z+G,g[1]=m<l?s(b,G):Math.max(r[m-l][1]+.3*h.n2(b*.2,G*.2+e),Ce(g[0],g[2])-.3),v=g},(m,M,g)=>{const S=m<3?Ze(.78,1.08,v[1]+.12*h.n2(v[0]*.5,v[2]*.5)):0;it.copy(p).lerp(Hn,S*.75),g[0]=it.r,g[1]=it.g,g[2]=it.b},m=>m&1,[xe.x,s(0,0),xe.z],null),await c.yield(),ee(new y.Mesh(await dn(i,c.yield),me(Aa,Fa,{K_BED:1,K_ISLE:1},{},{side:y.DoubleSide}))),await c.yield();for(const[m,M,g,S]of[[-1.6,-2.4,0,12.5],[2.9,.8,0,11],[-3.7,2.4,0,9.5],[.9,-4.3,1,9],[-4.6,-1,1,7.6],[3.6,-2.9,1,8.4],[.4,3.7,1,7],[4.7,2.9,2,8],[-1.6,5,2,5.6]]){const d=xe.x+m+q.range(-.4,.4),z=xe.z+M+q.range(-.4,.4),x=S*q.range(.92,1.08),b=xe.heightAt(d,z),G=Math.atan2(z-xe.z,d-xe.x),R={x:d,y:b,z,kind:g,h:x,out:G,yaw:q()*6.283};xe.trees.push(R)}for(let m=0;m<16;m++){const M=q()*6.283,g=xe.r*q.range(.1,.86),S=xe.x+Math.cos(M)*g,d=xe.z+Math.sin(M)*g;Be(S,xe.heightAt(S,d)+.02,d,q.range(.4,.9),q.range(.14,.3),q.range(.8,1.15),m%3===0?Rt:null)}for(let m=0;m<14;m++){const M=q()*6.283,g=xe.r*q.range(.7,.98),S=xe.x+Math.cos(M)*g,d=xe.z+Math.sin(M)*g;ct(S,xe.heightAt(S,d),d,7,q.range(.6,1.2))}for(let m=0;m<5;m++){const M=q()*6.283,g=xe.r*q.range(.55,.85),S=xe.x+Math.cos(M)*g,d=xe.z+Math.sin(M)*g,z=xe.heightAt(S,d),x=q.range(1.2,1.9),b=m%2?wa:ba;for(let G=0;G<12;G++){const R=q()*6.283,I=x*q.range(.08,.55),_=x*q.range(.35,1),F=x*q.range(.16,.25),N=q.range(.75,1.2),K=Math.cos(R),te=Math.sin(R),ie=S+K*I,ge=d+te*I,je=z+_,A=pe(S-.02,z-.05,d,st,1,0),C=pe(S+.02,z-.05,d+.02,st,1,0),O=pe(ie,je-F*.6,ge,st,1,.5);Re.i.push(A,C,O),Ba(ie,je,ge,F,b,N)}}}w=f,await c.yield();const $n=[],V0=Re,Ja=qe("#2c5a27");Re=Nt(),Ua.forEach(({o:e,s:a},t)=>{for(let l=0;l<11;l++){const u=l/11*6.283+f.range(-.2,.2),p=e.r0*f.range(.85,1.15);Be(e.x+Math.cos(u)*p,f.range(.1,.42),e.z+Math.sin(u)*p,f.range(.22,.4),f.range(.1,.2))}for(let l=0;l<3;l++){const u=f()*6.283;ct(e.x+Math.cos(u)*e.r0*1.1,.25,e.z+Math.sin(u)*e.r0*1.1,6,f.range(.4,.8))}const o=f.range(4.8,6.6);let n=a[0];for(const l of a)Math.abs(l.y-o)<Math.abs(n.y-o)&&(n=l);const s=t===0?1:-1,i=n.x+Le[0]*s*n.r*.8,r=n.z+Le[1]*s*n.r*.8;Be(i,n.y,r,.42,.2),Be(i-ye[0]*.3,n.y-.12,r-ye[1]*.3,.3,.16),Kt(i+Le[0]*s*.12,n.y+.12,r+Le[1]*s*.12,f.range(1.15,1.5)),ct(i,n.y+.1,r,6,.55)}),Re=V0,w=j,Ua.forEach(({o:e,s:a},t)=>{let o=a[0];for(const l of a)Math.abs(l.y)<Math.abs(o.y)&&(o=l);for(let l=0;l<22;l++){const u=l/22*6.283*2+j.range(-.25,.25),p=l%5===0?j.range(.5,1.25):0,v=j.range(.02,.4)+p,m=o.r*(p?1:j.range(1.05,1.75));Be(o.x+Math.cos(u)*m,v,o.z+Math.sin(u)*m,p?j.range(.22,.36):j.range(.3,.62),j.range(.12,.26),j.range(.75,1.15),l%3===0?Ja:null)}for(let l=0;l<9;l++){const u=l/9*6.283+j.range(-.3,.3),p=o.r*j.range(1.3,1.9);ct(o.x+Math.cos(u)*p,.1,o.z+Math.sin(u)*p,7,j.range(.6,1.2))}{const l=j()*6.283;Xn(o.x+Math.cos(l)*o.r*1.5,.25,o.z+Math.sin(l)*o.r*1.5,j.range(.9,1.3),t?wa:ba)}const n=Ln[t],s=Math.cos(n[3]),i=Math.sin(n[3]);Be(n[0],n[1],n[2],.6,.3,1,Ja),Be(n[0]-i*.35,n[1]-.15,n[2]+s*.35,.42,.22,.85,Ja),Be(n[0]+i*.3,n[1]-.2,n[2]-s*.3,.4,.2,.75),Kt(n[0],n[1]+.15,n[2],j.range(2.3,2.8)),ct(n[0]+s*.25,n[1]+.12,n[2]+i*.25,7,.7);const r=kn[t];Be(r[0],r[1]-.05,r[2],.3,.1,.7),$n.push(new y.Vector3(r[0],r[1]+.06,r[2]))}),w=f,await c.yield(),ee(new y.Mesh(await dn(Re,c.yield),me(Aa,Fa,{K_GARDEN:1},{},{side:y.DoubleSide}))),await c.yield();const aa=Nt(),en=[[.34,.05,.05],[.1,.095,.105],[-.2,.07,.07],[-.4,.022,.02]];Ve(aa,4,4,(e,a,t)=>{const o=a/4*6.2832;t[0]=en[e][0],t[1]=Math.cos(o)*en[e][1]-.01,t[2]=Math.sin(o)*en[e][2]},(e,a,t)=>{t[0]=t[1]=t[2]=1},null,[.5,0,0],null);const na=aa.p.length/3;aa.p.push(-.4,0,0,-.52,.11,0,-.52,-.1,0,.05,.085,0,-.18,.06,0,-.1,.15,0),aa.i.push(na,na+1,na+2,na+3,na+4,na+5);const Ca=new y.BufferGeometry;Ca.setAttribute("position",new y.Float32BufferAttribute(aa.p,3)),Ca.setIndex(aa.i),Ca.computeVertexNormals();const Ka=Math.max(60,Math.round(300*ae)),oa=new Float32Array(Ka*4),tn=new Float32Array(Ka*2),D0=[[-12,-36],[141,-53],[Mt[0]-ye[0]*13,Mt[2]-ye[1]*13]].map(([e,a])=>[e+f.range(-4,4),a+f.range(-4,4)]),an=[],Ra=[],Ma=[];D0.forEach(([e,a],t)=>{const o=Ce(e,a),n=Math.max(o+(t===0?3:1.7),t===0?-6.5:-3.4);an.push(new y.Vector4(e,n,a,f()*6.283)),Ra.push(new y.Vector4(f.range(6.5,10)*(t===2?.6:1),f.range(3,5)*(t===2?.7:1),f.range(.1,.16)*f.sign(),o+.75)),Ma.push(new y.Vector3(e,n,a))});{const e=i=>{let r=1;for(;r<B.length-1&&Ke[r]<i;)r++;const l=(i-Ke[r-1])/(Ke[r]-Ke[r-1]);return[ke(B[r-1][0],B[r][0],l),ke(B[r-1][2],B[r][2],l)]},a=(i,r)=>{const l=e(r);let u=null,p=1e9;for(const v of i){const m=Math.hypot(v[0]-l[0],v[2]-l[1]);m<p&&(p=m,u=v)}return u||[l[0],-4.5,l[1],0,20,0]},t=(i,r,l)=>{let u=null,p=1e9;for(let v=r;v<=l;v+=2){const m=e(v);for(const M of i){const g=Math.hypot(M[0]-m[0],M[2]-m[1]);g<p&&(p=g,u=M)}}return u},o=t($a,Ke[11],Ke[20])||a($a,.5*(Ke[11]+Ke[20])),n=t(Xa,Ke[20],Ke[36])||a(Xa,.5*(Ke[20]+Ke[36])),s=a(qn,Ke[36]+87);[o,s,n].forEach((i,r)=>{const l=r===1?Math.min(-.3,i[1]+.42):Math.min(-1.2,i[1]+1),u=(l-i[1])/Math.max($e.y,.2),p=i[0]+$e.x*u,v=i[2]+$e.z*u;an[r].set(p,l,v,i[3]),Ra[r].set(Math.min(11,i[4]*.4),ht(i[5],-.12,.12),Ra[r].z,i[1]+.05),Ma[r].set(p,l,v)})}const Xt=[0,0,0],Ea=[0,0,0];for(let e=0;e<Ka;e++)Xt[e%3]++;Ea[1]=Xt[0],Ea[2]=Xt[0]+Xt[1];const Va=Ea.slice();for(let e=0;e<Ka;e++){const a=e%3,t=Ea[a]++;oa[t*4]=a,oa[t*4+1]=f.gauss()*2.6,oa[t*4+2]=f.gauss()*1.1*.42,oa[t*4+3]=ht(f.gauss()*.32,-.7,.7),tn[t*2]=f(),tn[t*2+1]=f.range(.24,.4)*2.5,oa[t*4+3]*=.5}const Qn=(e,a)=>{const t=new y.InstancedBufferGeometry,o=oa.subarray(Va[a]*4,(Va[a]+Xt[a])*4),n=tn.subarray(Va[a]*2,(Va[a]+Xt[a])*2);t.index=e.index;for(const s in e.attributes)t.setAttribute(s,e.attributes[s]);return t.setAttribute("aFish",new y.InstancedBufferAttribute(o,4)),t.setAttribute("aFish2",new y.InstancedBufferAttribute(n,2)),t.instanceCount=Xt[a],t},Jn={uShoal:{value:an},uShoalR:{value:Ra}},St=new y.BufferGeometry;St.setAttribute("position",new y.Float32BufferAttribute([-.5,0,-.5,.5,0,-.5,-.5,0,.5,.5,0,.5],3)),St.setAttribute("uv",new y.Float32BufferAttribute([0,0,1,0,0,1,1,1],2)),St.setIndex([0,2,1,1,2,3]);const W0=me(so,ro,{},Jn,{side:y.DoubleSide}),H0=me(b0,w0,{K_INST:1},Jn,Wn),nn=[];for(let e=0;e<3;e++)nn.push([ee(new y.Mesh(Qn(Ca,e),W0)),ee(new y.Mesh(Qn(St,e),H0),1)]);await c.yield();const on=k.surfZ??rt,sn=new y.BufferGeometry,za=32,rn=Math.round((on-Ge)/15.44),e0=[],ka=[],t0=[];for(let e=0;e<=rn;e++)for(let a=0;a<=za;a++){const t=ve+(et-ve)*a/za,o=Ge+(on-Ge)*e/rn;e0.push(t,0,o),ka.push(Math.abs(t+100)<62&&o>200?-1:W.sdf(t,o))}for(let e=0;e<rn;e++)for(let a=0;a<za;a++){const t=e*(za+1)+a,o=t+1,n=t+za+1,s=n+1;Math.min(ka[t],ka[o],ka[n],ka[s])<13&&t0.push(t,n,o,o,n,s)}sn.setAttribute("position",new y.Float32BufferAttribute(e0,3)),sn.setIndex(t0);const a0={uSky:{value:new y.Vector4(_e.treeHeight,_e.slopeTan,_e.axisTan,_e.peakTan)},uPeakW:{value:_e.peakWidth},uSnagA:{value:new y.Vector3(Ut[0][0],Ut[0][1],.55)},uSnagB:{value:new y.Vector3(Ut[1][0],Ut[1][1],.6)},uPortal:{value:new y.Vector4(Mt[0],Mt[1],Mt[2],k.portalRadius??6.5)},uPortalN:{value:new y.Vector2(ye[0],ye[1])},uPortalCol:{value:qe(k.portalColor||"#bfe6ff").multiplyScalar(1.1)},uEndZ:{value:on}},Z0=ee(new y.Mesh(sn,me(y0,ao,{},a0,{transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:y.DoubleSide})),2);await c.yield();const U0=ee(new y.Mesh(await dn(va,c.yield),me(no,oo,{},{},{transparent:!0,depthWrite:!1,premultipliedAlpha:!0,side:y.DoubleSide})),2.4);await c.yield();const Da=Math.round(1500*(ue==="late"?2.2:ue==="june"?.3:1)*ae),La=new Float32Array(Da*4),ln=new Float32Array(Da*2),Sa=[];for(let e=0;e<16;e++)for(let a=0;a<30;a++){const t=f.range(-140,230),o=f.range(-165,230),n=W.sdf(t,o);if(n<-3&&n>-45){Sa.push([t,o,f.range(2,6.5)]);break}}for(const e of vt)f.chance(.6)&&Sa.push([e.x+f.range(-2,2),e.z+f.range(1,4),f.range(1.2,3)]);for(let e=0;e<Da;e++){let a=0,t=0;for(let o=0;o<20;o++){if(e%5<3&&Sa.length){const n=Sa[(e*7+o)%Sa.length];a=n[0]+f.gauss()*n[2],t=n[1]+f.gauss()*n[2]*.7}else a=f.range(-145,235),t=f.range(-170,235);if(W.sdf(a,t)<-.8)break}La[e*4]=a,La[e*4+1]=t,La[e*4+2]=f()*6.283,La[e*4+3]=f.range(.16,.3),ln[e*2]=f(),ln[e*2+1]=f(),e%100===0&&await c.yield()}const $t=new y.InstancedBufferGeometry;$t.index=St.index,$t.setAttribute("position",St.attributes.position),$t.setAttribute("uv",St.attributes.uv),$t.setAttribute("aLeaf",new y.InstancedBufferAttribute(La,4)),$t.setAttribute("aLeaf2",new y.InstancedBufferAttribute(ln,2)),$t.instanceCount=Da;const n0=me(io,lo,{},{},{side:y.DoubleSide});ee(new y.Mesh($t,n0),3);const o0=e=>{const a=e.length,t=new Float32Array(a*4),o=new Float32Array(a*2),n=new y.InstancedBufferGeometry;for(let i=0;i<a;i++){const r=e[i];t[i*4]=r[0],t[i*4+1]=r[1],t[i*4+2]=r[2],t[i*4+3]=r[3],o[i*2]=r[4],o[i*2+1]=r[5]}n.index=St.index,n.setAttribute("position",St.attributes.position),n.setAttribute("uv",St.attributes.uv),n.setAttribute("aLeaf",new y.InstancedBufferAttribute(t,4)),n.setAttribute("aLeaf2",new y.InstancedBufferAttribute(o,2)),n.instanceCount=a;const s=new y.Mesh(n,n0);return s.frustumCulled=!1,s.renderOrder=3,s};{const e=[];for(let a=0;a<130;a++)e.push([-100+j.gauss()*2.6,75+j.gauss()*5,j()*6.283,j.range(.17,.3),j(),j()]);for(let a=0;a<70;a++){const t=qt(j.range(34,80),0,j.gauss()*4.5,0);e.push([t[0],t[2],j()*6.283,j.range(.16,.28),j(),j()])}ee(o0(e),3)}const s0=[],r0=[],i0=[],Wa=[[40,.7],[26,.7],[14,.7],[6,.7],[2,.7],[.9,.71],[.3,.72],[-.2,.66],[-.7,.42],[-1.1,.18],[-1.5,.045],[-2.4,.03],[-4.6,.03]];for(let e=0;e<Wa.length;e++)for(let a=0;a<=42;a++){const t=a-21,o=Wa[e][0];s0.push(W.SX+Le[0]*t+ye[0]*o,Wa[e][1],W.SZ+Le[1]*t+ye[1]*o),r0.push(t,o)}for(let e=0;e<Wa.length-1;e++)for(let a=0;a<42;a++){const t=e*43+a,o=t+1,n=t+43,s=n+1;i0.push(t,n,o,o,n,s)}const Ha=new y.BufferGeometry;if(Ha.setAttribute("position",new y.Float32BufferAttribute(s0,3)),Ha.setAttribute("uv",new y.Float32BufferAttribute(r0,2)),Ha.setIndex(i0),ee(new y.Mesh(Ha,me(co,ho,{},{},{transparent:!0,depthWrite:!1,side:y.DoubleSide})),3),await c.yield(),k.backdrop!==!1){const e=ue==="snow"?.35:0,a=qe("#E8EEF5"),t=[],o=Nt(),n=new y.IcosahedronGeometry(1,1),s=new y.IcosahedronGeometry(1,0),i=(A,C,O,Y,X,$,H,ce)=>{const ne=A.attributes.position,we=o.p.length/3;for(let Fe=0;Fe<ne.count;Fe++){const Ie=ne.getX(Fe),Te=ne.getY(Fe),He=ne.getZ(Fe),bt=1+.3*h.n3(Ie*1.9+ce,Te*1.9,He*1.9),At=(.5+.5*Te)*(.85+.3*h.n3(Ie*3+ce,Te*3,He*3));o.p.push(C+Ie*X*bt,O+Te*$*bt,Y+He*H*bt),o.c.push(.5+.55*At,.5+.55*At,.5+.55*At),o.f.push(.35+.65*(.5+.5*Te)),o.i.push(we+Fe),t.push(Ie,Te/($/X),He)}};Ve(o,3,5,(A,C,O)=>{const Y=C/5*6.2832,X=.02-A*.006;O[0]=Math.cos(Y)*X+A*.012,O[1]=A*.24,O[2]=Math.sin(Y)*X},(A,C,O)=>{O[0]=O[1]=O[2]=.3},()=>0);const r=o.p.length/3;i(n,0,.62,0,.25,.4,.25,3.1),i(s,.17,.46,.08,.17,.2,.17,7.7),i(s,-.13,.5,-.14,.17,.22,.17,12.3),i(s,-.05,.42,.17,.15,.17,.15,21.9);const l=m0(o),u=Nt(),p=l.attributes.normal;for(let A=0;A<t.length/3;A++){const C=Math.hypot(t[A*3],t[A*3+1],t[A*3+2])||1;p.setXYZ(r+A,t[A*3]/C,t[A*3+1]/C,t[A*3+2]/C)}for(let A=0;A<7;A++){const C=A/7,O=.2+.8*Math.pow(C+1/7,.85),Y=.1+.74*C,X=.2*(1-C*.86),$=u.p.length/3;u.p.push(0,O,0),u.c.push(.45,.45,.45),u.f.push(.5*C);for(let H=0;H<8;H++){const ce=H/8*6.2832+A*.5,ne=X*(H%2?.72:1.08);u.p.push(Math.cos(ce)*ne,Y-(H%2?0:.035),Math.sin(ce)*ne);const we=H%2?.7:1.15;u.c.push(we,we,we),u.f.push(.3+.7*C),u.i.push($,$+1+H,$+1+(H+1)%8)}}const v=m0(u),m=me(Aa,Fa,{K_TREE:1},{},{side:y.DoubleSide}),M=Math.round(250*(.6+.4*ae)),g=Math.round(230*(.6+.4*ae)),S=new y.InstancedMesh(l,m,M),d=new y.InstancedMesh(v,m,g),z=new y.Matrix4,x=new y.Quaternion,b=new y.Vector3,G=new y.Vector3,R=new y.Vector3(0,1,0),I=new y.Color;let _=0,F=0;for(let A=0;A<9e3&&(_<M||F<g);A++){const C=f.range(ve+6,et-6),O=f.range(Ge+6,rt-6),Y=W.sdf(C,O);if(Y<3.5||Y>43)continue;const X=W.sill(C,O);if(Math.abs(C+100)<24&&O>195||Math.abs(X.across)<27&&X.along>-6)continue;const $=Y>12&&f.chance(Y>26?.8:.4);if($?F>=g:_>=M)continue;const H=$?f.range(15,27):f.range(11,19),ce=H*f.range(.9,1.3);if(b.set(C,Ce(C,O)-.3,O),x.setFromAxisAngle(R,f()*6.283),G.set(ce,H,ce*f.range(.85,1.15)),z.compose(b,x,G),$)I.copy(U).multiplyScalar(f.range(1.6,2.6)).lerp(a,e*1.4),d.setMatrixAt(F,z),d.setColorAt(F++,I);else{const ne=f();I.copy(ne<.56?le:ne<.78?J:ne<.9?re:ot(le,J,.5)).multiplyScalar(f.range(.8,1.2)).offsetHSL(f.range(-.015,.015),0,0).lerp(a,e),S.setMatrixAt(_,z),S.setColorAt(_++,I)}A%1500===0&&await c.yield()}S.count=_,d.count=F,S.instanceMatrix.needsUpdate=!0,d.instanceMatrix.needsUpdate=!0,ee(S),ee(d),n.dispose(),s.dispose();const N=[],K=[],te=2600;for(let A=0;A<=72;A++){const C=A/72*6.2832;N.push(Math.cos(C)*te,-40,Math.sin(C)*te,Math.cos(C)*te,2080,Math.sin(C)*te),A<72&&K.push(A*2,A*2+1,A*2+2,A*2+1,A*2+3,A*2+2)}const ie=N.length/3,ge=te*.7;for(const[A,C]of[[ve,Ge],[et,Ge],[et,rt],[ve,rt],[-ge,-ge],[ge,-ge],[ge,ge],[-ge,ge]])N.push(A,2,C);for(let A=0;A<4;A++){const C=ie+A,O=ie+(A+1)%4;K.push(C,O,C+4,O,O+4,C+4)}const je=new y.BufferGeometry;je.setAttribute("position",new y.Float32BufferAttribute(N,3)),je.setIndex(K),ee(new y.Mesh(je,me(y0,to,{},a0,{side:y.DoubleSide,transparent:!0,depthWrite:!1})),-.5)}await c.yield();const Oe=(e,a,t)=>new y.Vector3(e,a,t),j0={portalSeat:{position:Oe(Mt[0],Mt[1],Mt[2]),facing:Oe(-ye[0],0,-ye[1]),radius:6.5,tiltDeg:3},gate:Ut.map(([e,a])=>Oe(e,0,a)),sill:Oe(W.SX,.72,W.SZ),flyThrough:Se.map(e=>Oe(e[0],e[1],e[2])),outlet:Oe(-100,0,232),entry:Oe(-100,1.3,225),viewpoints:{mirror:{position:Oe(-100,1.3,150),target:Oe(-100,.6,60)},turnTop:{position:Oe(-45,16,-50),target:Oe(5,-8,-8)},shelf:{position:Oe(138,1.3,-34),target:Oe(157,.6,-56)}},tangle:Oe(4,-19,-12),pheasantPerch:{position:Oe(Je[We].x,Je[We].y+Je[We].r*.9,Je[We].z),from:Oe(Je[We-1].x,Je[We-1].y+Je[We-1].r*.9,Je[We-1].z),radius:Je[We].r,facing:Oe(-gt[0]*.94-ta[0]*.34,0,-gt[1]*.94-ta[1]*.34),abeam:Oe(fa.x,fa.y,fa.z),log:Oe(gt[0],0,gt[1])},duckPerches:$n,shoals:Ma,emergent:vt.concat(E0),standPerches:Pn,stand:Na.map(e=>Oe(e.x,e.H,e.z)),island:xe,arch:lt.map(e=>Oe(e.x,e.y,e.z))},l0=(e,a)=>{he.uFrontZ.value=e,he.uHealZ.value=a},c0=e=>{l0(132+(e-Ta)*1500,e<ia?-400:-260+(e-ia)*2e3),he.uLee.value.set(-66,-4,1-Ze(.525,.565,e)),he.uLeeR.value.set(56,80)},cn=[-160,-62,12,240,-21,0],Y0=(e,a,t,o,n,s)=>{const i=a>-.45,r=i&&t<145;let l=!1;for(let u=0;u<8&&!l;u++)l=(cn[u&1]-e)*o+(cn[4+(u>>2&1)]-a)*n+(cn[2+(u>>1&1)]-t)*s>0;I0.visible=i,q0.visible=i&&l,T0.visible=r,P0.visible=r&&l;for(let u=0;u<3;u++){const p=Math.hypot(Ma[u].x-e,Ma[u].z-t)<75;nn[u][0].visible=p,nn[u][1].visible=p}Z0.visible=i,U0.visible=i,ha.visible=!(a<-14&&t>352)};return c0(k.progress??.283),{object:Qe,radius:14,height:34,center:Oe(8,8.5,-14),anchors:j0,ground:!1,groundY:0,extent:{minX:-150,maxX:240,minZ:-175,maxZ:240},lake:{sdf:W.sdf,bedAt:W.bedAt,level:0,sillLevel:.7},uniforms:he,setProgress:c0,setLens:Y0,setGust:l0,makeLeaves:o0,tint:Pe,update(e,a){he.uTime.value=a},dispose(){}}}export{fo as buildHero,fn as normalsInSteps};
