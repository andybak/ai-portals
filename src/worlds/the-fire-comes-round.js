import*as u from"three";import{makePath as ka,clamp as bt,lerp as ht,smoothstep as _e}from"../kit/core.js";import{buildHero as Ma}from"../parts/the-fire-comes-round.js";import{buildForest as za,buildGround as Aa}from"../parts/the-fire-comes-round-forest.js";import{buildLife as Ra,layLanes as La}from"../parts/the-fire-comes-round-life.js";import{buildCastle as Fa,COURT as Ea}from"../parts/the-fire-comes-round-castle.js";const ct=(m,f)=>Math.sqrt(m*m+f*f),Sa=(m,f,U)=>Math.sqrt(m*m+f*f+U*U),_t=18e-5,Ta=2.3,Ie=Math.PI/180,Da={broadDepth:.17,broadRate:.3,seamDepth:.15,seamPeriod:[5,9],seamMax:.68,podSkin:.075,podLightOnThings:.35,torchBrightest:[1.8,.72,.09],burstBrightest:[1.4,.32,.025],torch:{rise:[1.2,2.2],stand:[7,11],standSet:[13,18],sink:4,period:[50,64]},burst:3.2,runnerSpray:.3,castleDoubled:.5,ringGlint:.43,gust:[6,10],riverRoad:[.8,.14],riverSmokeMirror:.38,groundFloor:[.015,.019,.032],animalRim:[.4,.26,.12]},We=1.3,pt=-4,q={K:We,n0:180,y:{entry:44,ride:6,flat:20,moat:-4+We*21,ring:-4+We*25},level:30,rideLevelAt:380,rideMouth:470,bend:380,turn0:{R:900,from:380},turn1:{R:260,N:960,heading:[40,110],slide:[-400,100]},run:{len:[160,480],near:135,least:130,far:170,want:380},turn2:{R:300,deg:[10,60]},lastLeg:300,ringToCastle:66*We,castleFromLine:280,cross:{from:285,from0:215,fromAir:222,keepAir:110,castle:60,keepRun:112},river:{half:[29,46],keep:21,L:58,chan:[66,52]},wander:[4.6,2.9,1.2],trail:{lanes:[-24,-11.5,11.5,24],A:2.4,L:31,A2:.9,L2:11.3},flat:{toFire:106,away:50,stop:95},water:{river:pt,moat:pt,pool:pt,bed:pt},rock:{a:[-126*We,90*We],c:[-95*We,95*We],r:40*We,top:-4+We*16},moat:{a:[-266*We,120*We],c:[-125*We,155*We],r:60*We},speed:{high:56,bed:36,flat:42,run:39,turn:42,shore:36,moat:29,court:27}},Ca=(m,f)=>{const U=q.trail;return m+U.A*Math.sin(f/U.L+.6+.13*m)+U.A2*Math.sin(f/U.L2+2.2+.4*m)},ra=(()=>{const m=q.trail,f=U=>U.toFixed(4);return`e0 + ${f(m.A)}*sin(N/${f(m.L)} + .6 + .13*e0) + ${f(m.A2)}*sin(N/${f(m.L2)} + 2.2 + .4*e0)`})(),Et=q.wander,sa=(m,f)=>Et[0]*Math.sin(m*.071+1.7*Math.sin(f*.043+.6))+Et[1]*Math.sin(f*.113+1.3*Math.sin(m*.057+2))+Et[2]*Math.sin((m+f)*.31+2*Math.sin(m*.19)),ia=(m,f)=>22*(Math.sin(m*.052+1.9*Math.sin(f*.031))*Math.sin(f*.047+1.4*Math.sin(m*.027+1))+.35*Math.sin((m-f)*.11+.7)-.62)+3.2*Math.sin(m*.41+1.3*Math.sin(f*.29+2))*Math.sin(f*.37+.7),Ba=`
#define W_LEVEL ${pt.toFixed(1)}
float wWander(vec2 p){ return ${Et[0].toFixed(2)}*sin(p.x*.071 + 1.7*sin(p.y*.043 + .6)) + ${Et[1].toFixed(2)}*sin(p.y*.113 + 1.3*sin(p.x*.057 + 2.)) + ${Et[2].toFixed(2)}*sin((p.x + p.y)*.31 + 2.*sin(p.x*.19)); }
// a place of the plan in the river's own frame: x metres to the right of the route's line, y metres along it (the
// line is straight to N ${q.n0+q.turn0.from}, then bears round on ${q.turn0.R} m); beyond the bend's reach the plan's own E, N
vec2 wLeg(vec2 en){ vec2 q = vec2(${q.turn0.R}. - en.x, en.y - ${q.n0+q.turn0.from}.); if (q.y <= 0. || q.x <= 0.) return en; return vec2(${q.turn0.R}. - length(q), ${q.n0+q.turn0.from}. + atan(q.y, q.x)*${q.turn0.R}.); }
float wIsle(vec2 p){ return 22.*(sin(p.x*.052 + 1.9*sin(p.y*.031))*sin(p.y*.047 + 1.4*sin(p.x*.027 + 1.)) + .35*sin((p.x - p.y)*.11 + .7) - .62) + 3.2*sin(p.x*.41 + 1.3*sin(p.y*.29 + 2.))*sin(p.y*.37 + .7); }
// metres outside the water at a place (under 0: water), from the plan map's fields: the drawn edge with its wander;
// in the shallows the islets stand out of it
float wWat(vec4 pm, vec2 xz){
  float w = (pm.g - .5)*160. + wWander(xz), ok = (.5 - pm.b)*160.;
  if (ok > 0.) w = max(w, min(wIsle(xz), .5*ok));
  return w;
}
// how much of a water's face mirrors, by the cosine of the look's angle to the upright (optics)
float wFres(float c){ return .07 + .93*pow(1. - clamp(c, 0., 1.), 2.7); }
`;async function Pa(m,f=()=>0,U=async()=>{},Be=[.9,.4,2.1,1]){const i=q,A=m.frontZ,Je=m.lobe.x-3200,ve=4,Ue=1601,Pe=new Float32Array(Ue);for(let p=0;p<Ue;p++)Pe[p]=A(Je+p*ve);const O=(p,x)=>{const H=(p-Je)/ve,y=Math.round(H);if(y<80||y>Ue-82)return x-A(p);let R=1/0;for(let ie=y-80;ie<=y+80;ie++){const se=Je+ie*ve-p,X=Pe[ie]-x,I=se*se+X*X;I<R&&(R=I)}const E=Math.floor(H),Y=Pe[E]+(Pe[E+1]-Pe[E])*(H-E);return x>=Y?Math.sqrt(R):-Math.sqrt(R)},wt=(p,x,H=0)=>{const y=m.lobe.x+(40+x)*p,R=m.lobe.z+1290-H;return{m:p,off:x,ox:y,oz:R,wx:E=>y+p*E,wz:E=>R-E,pe:E=>(E-y)*p,pn:E=>R-E}},te={e0:-520,n0:500,s:20,ne:131,nn:95},qe={},K=async p=>{if(qe[p])return qe[p];const x=wt(p,0),H=new Float32Array(te.ne*te.nn);for(let X=0;X<te.nn;X++){for(let I=0;I<te.ne;I++)H[X*te.ne+I]=O(x.wx(te.e0+I*te.s),x.wz(te.n0+X*te.s));X%32===31&&await U()}const y=te.e0,R=te.n0,E=te.s,Y=te.ne,ie=te.ne-1.001,se=te.nn-1.001;return qe[p]=(X,I)=>{let Q=(X-y)/E,Le=(I-R)/E;Q=Q<0?0:Q>ie?ie:Q,Le=Le<0?0:Le>se?se:Le;const P=Q|0,z=Le|0,T=Q-P,C=Le-z,S=z*Y+P,_=H[S]+(H[S+1]-H[S])*T,me=H[S+Y]+(H[S+Y+1]-H[S+Y])*T;return _+(me-_)*C},qe[p]},ce=(p,x,H)=>{const y=i.turn0.R,R=i.turn1.R,E=i.turn2.R,Y=i.n0,ie=i.turn0.from,se=i.turn1.N-Y,X=Y+ie,I=(se-ie)/y,Q=p*Ie,Le=H*Ie,P=Q+Le,z=[y-y*Math.cos(I),X+y*Math.sin(I)],T=[z[0]+R*Math.cos(I),z[1]-R*Math.sin(I)],C=[T[0]-R*Math.cos(Q),T[1]+R*Math.sin(Q)],S=[Math.sin(Q),Math.cos(Q)],_=[C[0]+x*S[0],C[1]+x*S[1]],me=[_[0]+E*Math.cos(Q),_[1]-E*Math.sin(Q)],Fe=[me[0]-E*Math.cos(P),me[1]+E*Math.sin(P)],xe=[Math.sin(P),Math.cos(P)],Ve=[Fe[0]+i.lastLeg*xe[0],Fe[1]+i.lastLeg*xe[1]],Qe=[Ve[0]+i.ringToCastle*xe[0],Ve[1]+i.ringToCastle*xe[1]],L=se+R*(Q-I),G=L+x,Z=G+E*Le,$e=Z+i.lastLeg,Ze=Ee=>{if(Ee<=ie)return[0,Y+Ee,0];if(Ee<=se){const J=(Ee-ie)/y;return[y-y*Math.cos(J),X+y*Math.sin(J),J]}if(Ee<=L){const J=I+(Ee-se)/R;return[T[0]-R*Math.cos(J),T[1]+R*Math.sin(J),J]}if(Ee<=G){const J=Ee-L;return[C[0]+J*S[0],C[1]+J*S[1],Q]}if(Ee<=Z){const J=Q+(Ee-G)/E;return[me[0]-E*Math.cos(J),me[1]+E*Math.sin(J),J]}const it=Ee-Z;return[Fe[0]+it*xe[0],Fe[1]+it*xe[1],P]};return{Nt:i.turn1.N,Nb:X,R0:y,a0:I,P1:z,H1:p,LL:x,A2:H,T1e:C,S2:_,C2:me,T2e:Fe,ring:Ve,castle:Qe,d1:S,d2:xe,h2:P,w:[0,se,L,G,Z,$e],at:Ze}},ae=i.moat,dt=[[ae.a[1],ae.c[0]+60],[ae.a[1]-60,ae.c[0]],[0,ae.c[0]],[ae.a[0]+60,ae.c[0]],[ae.a[0],ae.c[0]+60],[ae.a[1],0],[ae.a[1],ae.c[1]-60],[ae.a[1]-60,ae.c[1]],[ae.a[0],0]],d=i.turn1.R,l=i.turn2.R,re=i.run,Oe=16,ke=i.lastLeg+i.ringToCastle;let k=null,Me=0;for(const p of[1,-1]){const x=await K(p);for(const H of[0,-80,80,-160,160]){const y=(R,E)=>x(R+H,E);for(let R=i.turn1.heading[0];R<=i.turn1.heading[1];R+=5){const E=ce(R,re.len[1],i.turn2.deg[0]),Y=R*Ie,ie=E.w[1],se=E.T1e,X=E.d1,I=[],Q=[];for(let z=420;z<ie;z+=40){const T=E.at(z);I.push([T[0],T[1],0])}for(let z=0;z<=E.w[2]-ie;z+=Oe){const T=E.at(ie+z);I.push([T[0],T[1],1])}for(let z=0;z<=re.len[1];z+=Oe)Q.push([se[0]+z*X[0],se[1]+z*X[1]]);const Le=(z,T)=>{let C=1/0;Me+=I.length+T;for(const S of I){const _=y(S[0],S[1]+z);if(_<C&&(C=_,_<re.near))return _}for(let S=0;S<T;S++){const _=y(Q[S][0],Q[S][1]+z);if(_<C&&(C=_,_<re.near))return _}return C},P=z=>{const T=Math.round(z/Oe)+1;let C,S=i.turn1.slide[0],_=i.turn1.slide[1];if(Le(S,T)<re.near)return!0;if(Le(_,T)>=re.near)C=_;else{for(let L=0;L<8;L++){const G=.5*(S+_);Le(G,T)>=re.near?S=G:_=G}C=S}let me=0,Fe=0;for(const L of I){if(!L[2])continue;const G=y(L[0],L[1]+C);G<=re.far&&(me+=Oe),G<=200&&(Fe+=Oe)}for(let L=0;L<T;L++){const G=y(Q[L][0],Q[L][1]+C);G<=re.far&&(me+=Oe),G<=200&&(Fe+=Oe)}const xe=Math.min(me,re.want)+.4*Math.min(Fe-me,150)-.1*Math.abs(H);if(k&&xe<=k.score)return!1;const Ve=[se[0]+z*X[0],se[1]+z*X[1]],Qe=[Ve[0]+l*Math.cos(Y),Ve[1]-l*Math.sin(Y)];for(let L=i.turn2.deg[0];L<=i.turn2.deg[1];L+=5){const G=L*Ie,Z=Y+G,$e=[Qe[0]-l*Math.cos(Z),Qe[1]+l*Math.sin(Z)],Ze=[Math.sin(Z),Math.cos(Z)],Ee=Math.cos(Z),it=-Math.sin(Z),J=[$e[0]+ke*Ze[0],$e[1]+ke*Ze[1]],ot=y(J[0],J[1]+C);if(ot<i.castleFromLine+.5)continue;const gt=xe-Math.abs(ot-i.castleFromLine)-1.5*Math.max(0,L-30)-.25*Math.max(0,E.w[2]+z+l*G+i.lastLeg-1950);if(k&&gt<=k.score)continue;let pe=1/0;for(let He=0;He<=l*G&&pe>=re.near;He+=Oe){const ue=Y+He/l,Ye=y(Qe[0]-l*Math.cos(ue),Qe[1]+l*Math.sin(ue)+C);Ye<pe&&(pe=Ye)}for(let He=0;He<=ke&&pe>=re.near;He+=Oe){const ue=y($e[0]+He*Ze[0],$e[1]+He*Ze[1]+C);ue<pe&&(pe=ue)}for(const[He,ue]of dt){if(pe<re.near)break;const Ye=y(J[0]+He*Ze[0]+ue*Ee,J[1]+He*Ze[1]+ue*it+C)+20;Ye<pe&&(pe=Ye)}pe<re.near||(k={side:p,off:H,sh:C,H1:R,LL:z,A2:L,band:me,b200:Fe,cd:ot,score:gt})}return!1};for(let z=re.len[0];z<=re.len[1]&&!P(z);z+=40)Me>3e4&&(Me=0,await U())}}}let ze=1;k||(k={side:1,off:0,sh:-400,H1:110,LL:240,A2:40,band:0,b200:0,cd:0,score:0},ze=4);const Ae=ce(k.H1,k.LL,k.A2);let M,Re=1/0,Ne=0,rt=0,Ge=0;for(let p=0;p<3;p++){M=wt(k.side,k.off,k.sh),Re=1/0,rt=0,Ge=0;for(let x=300;x<=Ae.w[5];x+=2){const H=Ae.at(x),y=O(M.wx(H[0]),M.wz(H[1]));y<Re&&(Re=y,Ne=x),y<=i.run.far&&(rt+=2),y<=200&&(Ge+=2)}if(Re>=i.run.near-.5)break;k.sh-=i.run.near-Re+.5,await U()}const kt=qe[k.side],Ke=(p,x)=>kt(p+k.off,x+k.sh),st=O(M.wx(Ae.castle[0]),M.wz(Ae.castle[1]));return await U(),qa(m,Ae,{m:M.m,ox:M.ox,oz:M.oz,wx:M.wx,wz:M.wz,pe:M.pe,pn:M.pn,lineD:O,lineG:Ke,relief:f,rv:Be,fit:{...k,tier:ze,nearest:Re,nearestWay:Ne,castleD:st,inBand:rt,in200:Ge}},U)}async function qa(m,f,U,Be){const i=q,{wx:A,wz:Je,pe:ve,pn:Ue,lineD:Pe,lineG:O,relief:wt,rv:te}=U,[,qe,K,ce,ae,dt]=f.w,d=100,l=f.Nt;let re=K,Oe=ce,ke=!1;for(let t=qe;t<=ae;t+=4){const o=f.at(t);O(o[0],o[1])<=i.run.far+2&&(ke||(re=t,ke=!0),Oe=t)}const k={entry:0,bend:i.bend-i.n0,rideMouth:i.rideMouth-i.n0,rideLevel:i.rideLevelAt,rideEnd:qe,runIn:re,turn1End:K,runOut:Oe,turn2Start:ce,turn2End:ae,shore:dt+i.ringToCastle+i.moat.a[0],apronLip:dt+i.ringToCastle+i.rock.a[0],gate:dt-45*i.K,ring:dt},Me=f.castle[0],ze=f.castle[1],Ae=f.d2[0],M=f.d2[1],Re=Math.cos(f.h2),Ne=-Math.sin(f.h2),rt=(t,o)=>[(t-Me)*Ae+(o-ze)*M,(t-Me)*Re+(o-ze)*Ne],Ge=(t,o)=>[Me+t*Ae+o*Re,ze+t*M+o*Ne],kt=(t,o,s,h)=>{const c=Math.abs(t-.5*(s.a[0]+s.a[1]))-(.5*(s.a[1]-s.a[0])-h),D=Math.abs(o-.5*(s.c[0]+s.c[1]))-(.5*(s.c[1]-s.c[0])-h);return ct(Math.max(c,0),Math.max(D,0))+Math.min(Math.max(c,D),0)-h},Ke=(t,o)=>kt((t-Me)*Ae+(o-ze)*M,(t-Me)*Re+(o-ze)*Ne,i.moat,i.moat.r),st=(t,o)=>kt((t-Me)*Ae+(o-ze)*M,(t-Me)*Re+(o-ze)*Ne,i.rock,i.rock.r),p=t=>{const o=[];for(let s=0;s<t.length-1;s+=6){const h=t.slice(s,Math.min(t.length,s+7));let c=1/0,D=-1/0,F=1/0,w=-1/0,V=0;for(const N of h)c=Math.min(c,N[0]),D=Math.max(D,N[0]),F=Math.min(F,N[1]),w=Math.max(w,N[1]),V=Math.max(V,N[2]);o.push({seg:h,e0:c,e1:D,n0:F,n1:w,hw:V})}return o},x={e0:-832,n0:-432,s:32,n:82},H=new Uint8Array(x.n*x.n),y=(t,o)=>{const s=Math.floor((t-x.e0)/x.s),h=Math.floor((o-x.n0)/x.s);return s<0||h<0||s>=x.n||h>=x.n?0:H[h*x.n+s]},R=(t,o,s)=>{let h=d;for(const c of s){const D=t<c.e0?c.e0-t:t>c.e1?t-c.e1:0,F=o<c.n0?c.n0-o:o>c.n1?o-c.n1:0,w=h+c.hw;if(w<=0||D*D+F*F>=w*w)continue;const V=c.seg;for(let N=0;N<V.length-1;N++){const Te=V[N],de=V[N+1],$=de[0]-Te[0],le=de[1]-Te[1],ye=t-Te[0],we=o-Te[1],g=(ye*$+we*le)/Math.max($*$+le*le,1e-6),Xe=g<0?0:g>1?1:g,oe=ye-$*Xe,ge=we-le*Xe,nt=Math.sqrt(oe*oe+ge*ge)-(Te[2]+(de[2]-Te[2])*Xe);nt<h&&(h=nt)}}return h},E=(t,o)=>{const s=[],h=c=>t[bt(c,0,t.length-1)];for(let c=0;c<t.length-1;c++)for(let D=0;D<o;D++){const F=D/o,w=h(c-1),V=h(c),N=h(c+1),Te=h(c+2),de=[];for(let $=0;$<3;$++)de.push(.5*(2*V[$]+(N[$]-w[$])*F+(2*w[$]-5*V[$]+4*N[$]-Te[$])*F*F+(3*V[$]-w[$]-3*N[$]+Te[$])*F*F*F));s.push(de)}return s.push(t[t.length-1].slice()),s},Y=i.river,ie=t=>ht(Y.half[0],Y.half[1],.5+.5*Math.sin(t/97+te[0]+1.2*Math.sin(t/211+te[1]))),se=t=>(ie(t)-Y.keep)*Math.sin(t/Y.L+te[2]+.9*Math.sin(t/171+te[3]))+(t<60?(60-t)*.22*Math.sin(t/260+te[1]):0),X=f.Nb,I=f.R0,Q=(t,o)=>{if(t<=X)return[o,t];const s=(t-X)/I;return[I-(I-o)*Math.cos(s),X+(I-o)*Math.sin(s)]},Le=(t,o)=>{const s=I-t,h=o-X;return h<=0||s<=0?[t,o]:[I-ct(s,h),X+Math.atan2(h,s)*I]},P=[];for(let t=-1840;t<=l+20;t+=30){const o=Q(t,se(t));P.push([o[0],o[1],ie(t)])}const z=p(P),T=i.flat,C=.5*(T.toFire-T.away),S=[],_=ce+30;for(let t=qe-10;t<=_+30;t+=16){const o=f.at(t);S.push([o[0]-Math.cos(o[2])*C,o[1]+Math.sin(o[2])*C,.5*(T.toFire+T.away)*_e(qe-30,qe+60,t)*_e(_+50,_-40,t)+20])}const me=p(S),Fe=[];for(let t=ce-40;t<=k.shore+30;t+=20){const o=f.at(t),s=(t-ce+40)/(k.shore+70-ce);Fe.push([o[0],o[1],ht(Y.chan[0],Y.chan[1],s)+7*Math.sin(t/61+te[0])])}const xe=p(Fe),Ve=[];for(let t=qe-80;t<=k.shore;t+=12){const o=f.at(t);Ve.push([o[0],o[1],0])}const Qe=p(Ve),L=(t,o)=>R(t,o,Qe),G=(t,o,s)=>{const h=[],c=i.cross,D=[];for(let F=t;F<=o;F+=25)h.push(F);h.sort((F,w)=>Math.abs(F-s)-Math.abs(w-s));for(const F of h){const w=f.at(F),V=w[2];e:for(const N of[50,65,35,78])for(const Te of[-1,1]){const de=Math.cos(N*Ie),$=Math.sin(N*Ie)*Te,le=Math.cos(V)*de+Math.sin(V)*$,ye=-Math.sin(V)*de+Math.cos(V)*$;let we=!1,g=10;for(;g<=700;g+=10){const oe=O(w[0]-le*g,w[1]-ye*g);if(oe<c.keepAir)break;if(oe>=c.fromAir&&g>=180){we=Pe(A(w[0]-le*g),Je(w[1]-ye*g))>=c.fromAir;break}}if(!we||O(w[0]+le*150,w[1]+ye*150)<O(w[0],w[1])+20)continue;let Xe=!0;for(let oe=-g;oe<=460&&Xe;oe+=40)Xe=ct(w[0]+le*oe-Me,w[1]+ye*oe-ze)>=110*i.K+c.castle+10;if(Xe){if(D.push({w:F,E:w[0],N:w[1],dE:le,dN:ye,back:g,sense:Te,slant:N,beginsFromLine:Math.round(O(w[0]-le*g,w[1]-ye*g)),crossesFromLine:Math.round(O(w[0],w[1]))}),D.length>=40)return D;break e}}}return D},Z=G(k.rideEnd+40,k.turn2Start-20,.5*(k.runIn+k.turn2Start)),$e=G(k.turn2Start+30,k.shore-30,k.turn2End),Ze=G(k.shore+5,k.shore+115,k.shore+55),Ee=Z[0]||null,it=$e[0]||null,J=(()=>{const t=f.at(k.shore-80),o=t[2];for(const s of[25,0,45])for(const h of[-1,1]){const c=Math.cos(s*Ie),D=Math.sin(s*Ie)*h,F=Math.cos(o)*c+Math.sin(o)*D,w=-Math.sin(o)*c+Math.cos(o)*D;let V=0;for(;V<170&&O(t[0]-F*(V+10),t[1]-w*(V+10))>=i.cross.from0&&Ke(t[0]-F*(V+10),t[1]-w*(V+10))>30;)V+=10;if(V>=70&&Ke(t[0]+F*150,t[1]+w*150)>30)return{E:t[0],N:t[1],dE:F,dN:w,back:V,sense:h,slant:s}}return null})(),ot=(t,o)=>{const s=R(t,o,me);return s>=d?d:Math.max(s,T.stop-O(t,o))},gt=(t,o)=>y(t,o)&2?0:_e(40,0,R(t,o,me)),pe=t=>17.5+4*Math.sin(t*1.9+.7),He=p(E([Ge(i.moat.a[1]-50,i.moat.c[1]-12),Ge(i.moat.a[1]+10,i.moat.c[1]+150),Ge(i.moat.a[1]+130,i.moat.c[1]+560),Ge(i.moat.a[1]+180,i.moat.c[1]+1700)].map((t,o)=>[t[0],t[1],pe(o+4)]),5)),ue=(t,o,s)=>{const h=bt(.5+.5*(o-t)/s,0,1);return o+(t-o)*h-s*h*(1-h)},Ye=(t,o)=>{const s=R(t,o,xe),h=s>=d?d:Math.max(s,T.stop-O(t,o));return Math.min(ue(ue(R(t,o,z),ot(t,o),14),ue(h,Ke(t,o),14),14),R(t,o,He))},fe=(t,o)=>Math.min(-ot(t,o)-12,L(t,o)-20),vt=(t,o)=>{const s=fe(t,o);return s>0?Math.min(ia(A(t),Je(o)),.5*s):-1},Mt=(t,o)=>{let s=Ye(t,o)+sa(A(t),Je(o));if(s<0){const h=fe(t,o);h>0&&(s=Math.max(s,Math.min(ia(A(t),Je(o)),.5*h)))}return s},lt=(t,o)=>y(t,o)&1?1:_e(2.5,9,Mt(t,o));await Be();const Nt=t=>{for(let o=0;o<x.n;o++){const s=x.e0+(o+.5)*x.s,h=x.n0+(t+.5)*x.s;H[t*x.n+o]=(Ye(s,h)>58?1:0)|(R(s,h,me)>65?2:0)}};for(let t=0;t<x.n;t++)Nt(t),t%8===7&&await Be();const zt=(()=>{const t=i.cross,o=[],s=(h,c)=>(gt(h,c)>=.5?t.from:t.from0)+8;for(let h=k.runIn-40;h<=k.turn2Start+40;h+=30){const c=f.at(h),D=c[2],F=O(c[0],c[1]);for(const w of[62,72,50,80])for(const V of[-1,1]){const N=Math.cos(w*Ie),Te=Math.sin(w*Ie)*V,de=Math.cos(D)*N+Math.sin(D)*Te,$=-Math.sin(D)*N+Math.cos(D)*Te;let le=12,ye=!1,we=F;for(;le<=1e3;le+=12){const oe=c[0]-de*le,ge=c[1]-$*le,nt=O(oe,ge);if(nt<t.keepRun)break;if(nt<we&&(we=nt),le>=60&&nt>=s(oe,ge)&&lt(oe,ge)>=.9){const ut=oe-de*24,je=ge-$*24;if(ye=O(ut,je)>=s(ut,je)&&lt(ut,je)>=.9,ye)break}}if(!ye)continue;let g=20;for(;g<420&&!(lt(c[0]+de*g,c[1]+$*g)>=.9&&lt(c[0]+de*(g+30),c[1]+$*(g+30))>=.9);)g+=10;if(g>=420||O(c[0]+de*g,c[1]+$*g)<F+20)continue;let Xe=!0;for(let oe=-le-30;oe<=g+60&&Xe;oe+=30)Xe=Ke(c[0]+de*oe,c[1]+$*oe)>40;Xe&&o.push({w:h,E:c[0],N:c[1],dE:de,dN:$,back:le,on:g,sense:V,slant:w,crossesFromLine:Math.round(F),leastFromLine:Math.round(we)})}}return o})(),At=(t,o)=>{const s=ve(t),h=Ue(o),c=wt(t,o);if(y(s,h)&1)return c;const D=Ye(s,h)+sa(t,o);if(D>=9)return c;if(D<0){const F=vt(s,h);return F>0?pt+.3*_e(0,2,F):pt}return ht(c,pt,_e(9,1.5,D))},Se=(t,o,s,h)=>{const c=h[0]-s[0],D=h[1]-s[1],F=bt(((t-s[0])*c+(o-s[1])*D)/Math.max(c*c+D*D,1e-6),0,1);return ct(t-s[0]-c*F,o-s[1]-D*F)};return{...U,g:f,way:k,at:f.at,heading2:f.h2,castle:{E:Me,N:ze,x:A(Me),z:Je(ze),ax:U.m*Ae,az:-M,rx:U.m*Re,rz:-Ne},toLocal:rt,fromLocal:Ge,sdMoat:Ke,sdRock:st,sdAsh:ot,watBase:Ye,watAt:Mt,isletOK:fe,isletAt:vt,routeD:L,hwAt:ie,cAt:se,legPt:Q,legOf:Le,mouth:f.P1,a0:f.a0,cover:lt,groundAt:At,calmAt:y,segD:Se,ridePts:P,flatPts:S,chanPts:Fe,setPiece:gt,Nt:l,lineG:O,crossFly:Ee,crossFly2:it,crossFlyAll:Z,crossFly2All:$e,crossFly3All:Ze,crossRunAll:zt,lastCross:J,flatSd:(t,o)=>R(t,o,me)}}const Ht=`
uniform vec3 uAmbSky, uAmbGnd, uDuskCol, uDuskDir, uHazeCol; uniform vec2 uHaze;
uniform vec4 uPlan;              // x, z of the plan's origin in the world; z: side (1 as drawn, -1 mirrored); w unused
uniform vec4 uPlanTex;           // E, N of the plan map's corner; z: 1 / its span (m)
uniform sampler2D uPlanMap;      // r metres outside the shallows, g metres outside the water's drawn edge, b metres outside the ground where islets may stand (each signed, 160 m to the byte's range, 0.5 at the edge), a canopy carpet
uniform vec3 uZen, uMid, uHor, uGlowCol, uMoonDir; uniform vec4 uSkyK;   // uSkyK: xy unit bearing of the day's remnant, z cloud, w moon
uniform vec4 uWind;              // the wind this visit (the part's deal): xy its bearing over the land (world x, z), z its strength (1: a full wind), w how much of the air's draw toward the line is felt
uniform sampler2D uPodMap;       // THE PODS' LIGHT lying on the ground and the water under the ripe plants (0..1 by place; the forest part fills it from its own plants)
vec2 wPlan(vec3 wp){ return vec2((wp.x - uPlan.x)*uPlan.z, uPlan.y - wp.z); }
float wPod(vec2 en){ return textureLod(uPodMap, (en - uPlanTex.xy)*uPlanTex.z, 0.).r; }
// HOW RIPE the forest is at d metres from the part's line (pods swollen, seams amber): 1 at the line, falling slowly;
// the forest along the river is ripe too, the far forest less
float wRipe(float d){ return 1. - smoothstep(40., 1700., d); }
// THE FIRE'S LIGHT FAR FROM THE LINE: the part's law w falls fast (0.15 at 500 m, 0.07 at 1 km); what a dark thing
// makes of it far off is the part's own grade for far land (its round 4: w^0.2/(1 + 1.3 w) x (0.48 + 0.52
// smoothstep(0.012, 0.12, w))), here at 0.62 of it and never under w itself: 0.35 at 200 to 500 m, 0.26 at 1 km,
// 0.13 at 2 km. The wall fills a third of the sky from the river: its light reaches there
float wFar(float w){ return max(w, .62*pow(max(w, 1e-4), .2)/(1. + 1.3*w)*(.48 + .52*smoothstep(.012, .12, w))); }
vec4 wPlanMap(vec2 en){ vec2 uv = (en - uPlanTex.xy)*uPlanTex.z, e = abs(uv - .5);          // beyond the map: forest
  return mix(textureLod(uPlanMap, uv, 0.), vec4(1.), smoothstep(.492, .5, max(e.x, e.y))); }
`+Ba+`
// irradiance on a face: n its normal, Lf the part's fcrLight at the place, wrap so that backs are never black
// the sky's light at a place (w: the fire's strength there, the part's law): the dusk's blue, and near the line,
// under the fire's own smoke, the smoke's lit underside in its stead
vec3 wSkyAmb(float w){ return mix(uAmbSky, uAmbSky*.42 + uFire*.40, smoothstep(.12, .5, w)); }
vec3 wLit(vec3 n, vec4 Lf, float wrap, float gain){
  vec3 c = mix(uAmbGnd, wSkyAmb(Lf.w), .5 + .5*n.y) + uDuskCol*max(dot(n, uDuskDir), 0.);
  return c + uFire*(gain*Lf.w*max((dot(n, Lf.xyz) + wrap)/(1. + wrap), 0.));
}
// the same for the world's own dark things (plants, snags, animals): the fire's light by its far grade, and THE LIT
// SMOKE OVERHEAD as a broad soft warm light from above on the fire's side (it fills a third of the sky from the
// river; by the line the sky's own light is already the smoke's: wSkyAmb)
vec3 wLitF(vec3 n, vec4 Lf, float wrap, float gain){
  float wE = wFar(Lf.w), sm = .5 + .5*dot(n, normalize(vec3(Lf.x, 0., Lf.z)*.55 + vec3(0., .83, 0.)));
  vec3 c = mix(uAmbGnd, wSkyAmb(Lf.w), .5 + .5*n.y) + uDuskCol*max(dot(n, uDuskDir), 0.);
  return c + uFire*(gain*wE*(max((dot(n, Lf.xyz) + wrap)/(1. + wrap), 0.) + .30*sm*sm*(1. - smoothstep(.18, .55, Lf.w))));
}
float wFogAt(float dist){ float a = dist*uHaze.x*uHaze.y; return 1. - exp(-a*a); }   // (uHaze.y: the world's own dusk haze is this many times the figure given to the part: far things sit in the dusk)
// the sky's colour in a direction, without its stars (the dome draws it; water mirrors it)
vec3 wSky(vec3 d){
  float el = clamp(d.y, 0., 1.);
  vec3 c = mix(uMid, uZen, smoothstep(.10, .80, el));
  c = mix(uHor, c, smoothstep(0., .12, el));                                   // a paler band of haze to 6 or 7 degrees: a horizon all round
  vec2 az = normalize(d.xz + vec2(1e-5, 1e-5));
  c += uGlowCol*pow(max(dot(az, uSkyK.xy), 0.), 5.)*exp(-el*9.);               // what is left of the day: faint, cool, low, to one side
  return c;
}
// the stars of one size: N cells to a unit of direction, one star in a cell where its number passes thr; rad its
// disc in cells (each star a little its own size), fw the pixel's breadth in direction, gain its light
float wH13(vec3 p){ p = fract(p*.1031); p += dot(p, p.zyx + 31.32); return fract((p.x + p.y)*p.z); }
vec3 wH33(vec3 p){ p = fract(p*vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.xxy + p.yxx)*p.zyx); }
float wStarsAt(vec3 sd, float N, float thr, float rad0, float fw, float gain){
  vec3 p = sd*N, ip = floor(p);
  float h = wH13(ip + 7.), rad = max(rad0*(.65 + .7*fract(h*57.3)), fw*N*.9);
  float r = length(p - (ip + .5 + (wH33(ip) - .5)*.72));
  float mag = pow(clamp((h - thr)/max(1. - thr, 1e-3), 0., 1.), 4.)*.95 + .05;
  return step(thr, h)*mag*gain*(1. - smoothstep(rad*.25, rad, r))*min(1., rad0*rad0*1.4/max(rad*rad, 1e-9))*(.82 + .18*sin(uFcrT*(1.5 + 2.5*h) + h*40.));
}
`,la=`
float wMistAt(vec3 ro, vec3 p, float w){
  float L = length(p - ro), y0 = max(ro.y - W_LEVEL, 0.)*(1./9.), y1 = max(p.y - W_LEVEL, 0.)*(1./9.), dy = y1 - y0;
  float col = abs(dy) > .03 ? (exp(-y0) - exp(-y1))/dy : exp(-.5*(y0 + y1));
  float mp = .3 + .7*smoothstep(.3, .66, fcrN3(vec3(p.xz*(1./170.), 11.)));
  return (1. - exp(-.0058*L*col*mp))*(1. - smoothstep(.12, .22, w))*.6;
}
vec4 wAir(vec3 p, vec4 Lf, float pod){
  vec3 V = p - cameraPosition; float dist = length(V); vec3 rd = V/max(dist, 1e-3);
  float m = wMistAt(cameraPosition, p, Lf.w), h = wFogAt(dist);
  float fwd = max(dot(normalize(rd.xz + vec2(1e-5, 1e-5)), normalize(Lf.xz + vec2(1e-5, 1e-5))), 0.);
  vec3 mc = uHor*.5 + uAmbSky*.03 + uFire*(wFar(Lf.w)*(.10 + .62*fwd*fwd*fwd)) + vec3(1., .43, .07)*(.11*pod);
  return vec4((mc*m)*(1. - h) + uHazeCol*h + uFire*(.5*fcrAirGlow(cameraPosition, rd, dist)), 1. - (1. - m)*(1. - h));
}
`,Oa=`
uniform float uRideEnd;
float wVn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f); return textureLod(uNoise, (i + f + .5)/256., 0.).b; }
float wTrailE(float e0, float N){ return ${ra}; }
float wBarAt(vec2 lg, float e0, float mid, float fine){
  float wv = wVn(vec2(e0*3.1 + 7., lg.y/14.)), wv2 = wVn(vec2(e0*1.7 + 31., lg.y/9.)), show = smoothstep(.50, .64, wv + .15*(mid - .5))*smoothstep(.15, .55, sin(lg.y/6.1 + e0*2.3));
  float dq = abs(lg.x - wTrailE(e0, lg.y) - sign(e0)*3.*wv2), hwb = (.8 + 4.*smoothstep(.5, .85, wv))*(.7 + .6*wv2);
  return (hwb + .9*(fine - .5))*show - dq - 4.*(1. - show);   // (stage E: where no bar shows the water is whole: a thin line of ground lay along every file's line)
}
float wFace(vec3 ro, vec3 rd, out vec3 hp){
  float t = (W_LEVEL - ro.y)/min(rd.y, -1e-4); hp = ro + rd*t;
  vec2 en = wPlan(hp), lg = wLeg(en); float wb = wWat(wPlanMap(en), hp.xz);
  if (wb < 0. && lg.y < uRideEnd + 20.) {
    float mid = wVn(hp.xz/41. + 17.), fine = wVn(hp.xz/5.7 + 3.);
    float bar = max(max(wBarAt(lg, ${q.trail.lanes[0].toFixed(1)}, mid, fine), wBarAt(lg, ${q.trail.lanes[1].toFixed(1)}, mid, fine)), max(wBarAt(lg, ${q.trail.lanes[2].toFixed(1)}, mid, fine), wBarAt(lg, ${q.trail.lanes[3].toFixed(1)}, mid, fine)));
    wb = max(wb, mix(-1e3, min(bar, 1.4), (1. - smoothstep(uRideEnd - 60., uRideEnd + 20., lg.y))));
  }
  return wb;
}
float wDouble(vec3 hp, vec3 rd, float wat){
  float t = uFcrT, rip = smoothstep(.3, .7, .6*wVn(hp.xz/2.9 + vec2(t*.13, t*.08)) + .4*wVn(hp.xz/.9 + vec2(t*.21, -t*.16) + 3.));
  // fine ripples about five pixels long at every distance break the double into strokes (the land's own law of them)
  float px = length(hp - cameraPosition)*.0031/max(-rd.y, .06), lf = log2(max(px*5., .35)/.35), l0 = floor(lf), k0 = .35*exp2(l0);
  vec2 q = hp.xz + vec2(t*.21, -t*.16);
  float fine = mix(wVn(q/k0), wVn(q/(2.*k0) + 11.7), lf - l0);
  return clamp(1.6*wFres(-rd.y) + .2, 0., .95)*mix(1., .5 + .5*rip, .5)*mix(.42, 1., smoothstep(.28, .66, fine))*(1. - smoothstep(-1.1, -.2, wat));
}
`,ha=m=>{const f=bt(-m,0,40);return-4.6+5.6*_e(0,3.5,f)+5.2*_e(7,11,f)+5.8*_e(15,20,f)},Ha=m=>-4+q.K*(ha(m/q.K)+4),It=(m,f)=>m<.5?f[0]:m<.75?f[1]:f[2];var ja={id:"the-fire-comes-round",name:"The Fire Comes Round",category:"books",placeKind:"alien",book:"The Player of Games",author:"Iain M. Banks, 1954 to 2013",weirdness:.6,async build(m){const f=m.rng.fork("the-world"),U={};for(const e of["deal","relief","sky","near","mid","cards","atlas","litter","streaks","carpet","lanes","runners","fliers","swimmers","castle","lamps","steam","air","mist","river","under","gates"])U[e]=f.fork(e);const Be=new u.Scene,i=(e,a,n)=>new u.Vector3(e,a,n),A=async()=>{await m.yield()},Je=bt(m.quality&&m.quality.detail||1,.5,1),ve=U.deal,Ue={hour:It(ve(),["dusk","night","cloud"]),kind:It(ve(),["pods","bottles","spires"]),castle:It(ve(),["tiers","drum","ringwall"]),runners:300+12*Math.floor(ve()*6),quill:ve.range(.6,1.3),tuft:ve.range(.7,1.4),flierLanes:3+Math.floor(ve()*3),fliers:380+20*Math.floor(ve()*8),span:ve.range(4,6),swimmers:34+Math.floor(ve()*13),lightning:ve()<1/8};Ue.wind=It(ve(),["back","upright","cross"]);const Pe=U.relief,O={k:[Pe.range(1300,1700),Pe.range(1600,2200),Pe.range(700,940),Pe.range(480,640)].map(e=>Math.PI*2/e),p:[Pe.range(0,6.2832),Pe.range(0,6.2832),Pe.range(0,6.2832),Pe.range(0,6.2832)]},wt=(e,a)=>{const n=_e(0,1300,Math.max(Math.abs(e)-2300,Math.abs(a-550)-1950)),r=.45*Math.sin(e*O.k[2]*2.3+O.p[1])*Math.sin(a*O.k[3]*1.9+O.p[0])+.25*Math.sin((e+.7*a)*O.k[3]*3.1+O.p[2]);return n<=0?r:r+n*(3*Math.sin(e*O.k[0]+O.p[0])*Math.sin(a*O.k[1]+O.p[1])+1.6*Math.sin((e+.6*a)*O.k[2]+O.p[2])+.9*Math.sin((e-.8*a)*O.k[3]+O.p[3]))},te=new u.Color(.032,.05,.095),qe={forest:null},K=await Ma(m,{heightAt:wt,haze:_t,hazeColor:te,forest:(e,a)=>qe.forest?qe.forest(e,a):0,wind:Ue.wind,lightning:Ue.lightning});Be.add(K.object),await A();const ce=K.layout,ae=(()=>{const e=ce.vel||[0,24,-15],a=ct(e[0],e[2]),n=a>.001?e[0]/a:0,r=a>.001?e[2]/a:-1;return{kind:ce.wind||"back",x:n,z:r,amp:ce.wind==="upright"?.4:1,draw:ce.wind==="cross"?.3:1}})(),dt=[0,1,2,3].map(()=>U.river.range(0,6.2832)),d=await Pa(ce,wt,A,dt),{way:l,wx:re,wz:Oe}=d,ke=q.y;await A();const k=(e,a,n,r,v)=>ht(r,v,_e(a,n,e)),Me=e=>e<=l.rideLevel?k(e,q.level,l.rideLevel,ke.entry,ke.ride):e<=l.turn2Start?k(e,l.rideEnd-60,l.rideEnd+140,ke.ride,ke.flat):e<=l.shore+122?k(e,l.turn2Start,l.shore,ke.flat,ke.moat):k(e,l.shore+122,l.apronLip,ke.moat,ke.ring),ze=[],Ae=(e,a,n)=>{const r=Math.max(1,Math.ceil((a-e)/n-1e-6));for(let v=0;v<r;v++)ze.push(e+(a-e)*v/r)};Ae(0,l.rideEnd,40),Ae(l.rideEnd,l.turn1End,q.turn1.R*15*Ie),Ae(l.turn1End,l.turn2Start,40),Ae(l.turn2Start,l.turn2End,q.turn2.R*15*Ie),Ae(l.turn2End,l.ring,40),ze.push(l.ring);const M=ka(ze.map(e=>{const a=d.at(e);return[re(a[0]),Me(e),Oe(a[1])]}),{samples:1100});await A();const Re=Math.ceil(M.length/2)+1,Ne=new Float32Array(Re),rt=i(0,0,0),Ge=i(0,0,0);M.posAtDist(0,rt);for(let e=1;e<Re;e++)M.posAtDist(Math.min(M.length,e*2),Ge),Ne[e]=Ne[e-1]+ct(Ge.x-rt.x,Ge.z-rt.z),rt.copy(Ge);const kt=l.ring/Ne[Re-1],Ke=e=>{const a=bt(e/2,0,Re-1.001),n=Math.floor(a);return(Ne[n]+(Ne[n+1]-Ne[n])*(a-n))*kt},st=e=>{let a=0,n=M.length;for(let r=0;r<22;r++){const v=.5*(a+n);Ke(v)<e?a=v:n=v}return .5*(a+n)},p=e=>st(e)/M.length;await A();const x=new Map,H={x0:-7302,z0:-900,nx:2434,nz:400},y=new Uint8Array(H.nx*H.nz);let R=0;const E=(e,a)=>{const n=Math.floor(e/6),r=Math.floor(a/6),v=n-H.x0/6,W=r-H.z0/6,he=v>=0&&W>=0&&v<H.nx&&W<H.nz,B=he?W*H.nx+v:(n+8192)*16384+(r+8192);let b=he?y[B]?y[B]===2:void 0:x.get(B);if(b===void 0){const ee=(n+.5)*6,j=(r+.5)*6,ne=d.pe(ee),be=d.pn(j);b=j-ce.frontZ(ee)>40&&!(d.calmAt(ne,be)&1)&&d.watAt(ne,be)<1.5||d.sdMoat(ne,be)<64,R++,he?y[B]=b?2:1:x.set(B,b)}return b},Y=d.m,ie=(e,a=0)=>{const n=e*Ie,r=Math.cos(a*Ie);return i(Y*Math.sin(n)*r,Math.sin(a*Ie),-Math.cos(n)*r)},se=Ue.hour==="night",X=Ue.hour==="cloud",I=ie(265),Q=ie(U.sky.range(165,200),U.sky.range(48,60)),Le=se?Q.clone():ie(265,6),P={e0:-800,n0:-400,span:2500,n:256},z={...K.uniforms,uAmbSky:{value:se?new u.Color(.3,.4,.7):new u.Color(.36,.47,.78)},uAmbGnd:{value:new u.Color(.1,.1,.15)},uDuskCol:{value:se?new u.Color(.2,.26,.36):new u.Color(.1,.19,.31)},uDuskDir:{value:Le},uHazeCol:{value:te},uHaze:{value:new u.Vector2(_t,Ta)},uPodMap:{value:null},uPlan:{value:new u.Vector4(d.ox,d.oz,Y,0)},uRideEnd:{value:d.Nt},uPlanTex:{value:new u.Vector4(P.e0,P.n0,1/P.span,0)},uPlanMap:{value:null},uZen:{value:new u.Color(.012,.022,.066)},uMid:{value:new u.Color(.021,.038,.1)},uHor:{value:new u.Color(.055,.095,.185)},uGlowCol:{value:se?new u.Color(.004,.008,.012):new u.Color(.03,.072,.125)},uMoonDir:{value:Q},uSkyK:{value:new u.Vector4(I.x,I.z,X?1:0,se?1:0)},uWind:{value:new u.Vector4(ae.x,ae.z,ae.amp,ae.draw)}},T=d.g,C=T.P1,S=d.castle,_=d.segD,me=(e,a)=>{const n=d.legOf(e,a),r=n[1]<300?300-n[1]:n[1]>d.Nt?n[1]-d.Nt:0;return ct(n[0],r)},Fe=(e,a)=>{let n=Math.min(me(e,a)-150,_(e,a,C,T.T1e)-210,_(e,a,T.T1e,T.S2)-200,_(e,a,T.S2,T.T2e)-200,_(e,a,T.T2e,T.castle)-190,ct(e-S.E,a-S.N)-330*q.K);if(n>0&&n<260&&a>C[1]-100){const r=d.lineG(e,a);r<330&&(n=Math.min(n,r-330))}return n},xe=new Uint8Array(P.n*P.n*4),Ve=P.span/P.n,Qe=e=>Math.round(bt(e,0,1)*255),L=4,G=P.n/L+1,Z=new Float32Array(G*G*4),$e=62,Ze=(e,a,n,r)=>{n[r]=d.sdAsh(e,a),n[r+1]=d.watBase(e,a),n[r+2]=-d.isletOK(e,a),n[r+3]=Fe(e,a)},Ee=e=>{for(let a=0;a<G;a++)Ze(P.e0+(a*L+.5)*Ve,P.n0+(e*L+.5)*Ve,Z,(e*G+a)*4)};for(let e=0;e<G;e++)Ee(e),e%32===31&&await A();const it=(e,a,n,r,v)=>{xe[e]=Qe(.5+a/160),xe[e+1]=Qe(.5+n/160),xe[e+2]=Qe(.5+r/160),xe[e+3]=Qe(_e(8,20,n)*_e(0,28,v))},J=new Float32Array(4);let ot=0;const gt=e=>{let a=0;for(let n=0;n<G-1;n++){const r=(e*G+n)*4,v=r+4,W=r+G*4,he=W+4;let B=!0;for(const b of[r,v,W,he])if(Math.abs(Z[b])<=$e||Math.abs(Z[b+1])<=$e||Math.abs(Z[b+2])<=$e||Z[b+1]>0&&Math.abs(Z[b+3])<=$e){B=!1;break}for(let b=0;b<L;b++)for(let ee=0;ee<L;ee++){const j=((e*L+b)*P.n+n*L+ee)*4;if(B){const ne=ee/L,be=b/L,Ce=Ot=>ht(ht(Z[r+Ot],Z[v+Ot],ne),ht(Z[W+Ot],Z[he+Ot],ne),be);it(j,Ce(0),Ce(1),Ce(2),Ce(3))}else ee===0&&b===0?it(j,Z[r],Z[r+1],Z[r+2],Z[r+3]):(Ze(P.e0+(n*L+ee+.5)*Ve,P.n0+(e*L+b+.5)*Ve,J,0),it(j,J[0],J[1],J[2],J[3]))}a+=B?1:L*L}return a};for(let e=0;e<G-1;e++)ot+=gt(e),ot>=1500&&(ot=0,await A());const pe=new u.DataTexture(xe,P.n,P.n,u.RGBAFormat);pe.magFilter=pe.minFilter=u.LinearFilter,pe.wrapS=pe.wrapT=u.ClampToEdgeWrapping,pe.generateMipmaps=!1,pe.needsUpdate=!0,z.uPlanMap.value=pe;const He=new Uint8Array(512*512),ue=new u.DataTexture(He,512,512,u.RedFormat);ue.magFilter=ue.minFilter=u.LinearFilter,ue.wrapS=ue.wrapT=u.ClampToEdgeWrapping,ue.generateMipmaps=!1,ue.needsUpdate=!0,z.uPodMap.value=ue,await A();const Ye=(e,a,n,r,v)=>{let W=[];for(let b=e[0];b<=e[1]+1e-6;b+=v)W.push(b);for(const[b,ee,j]of a){W=W.filter(ne=>ne<b-j*.6||ne>ee+j*.6);for(let ne=b;ne<=ee+1e-6;ne+=j)W.push(ne)}W.sort((b,ee)=>b-ee);let he=v,B=W[0];for(;B>n;)he*=1.3,B-=he,W.unshift(Math.max(B,n));for(he=v,B=W[W.length-1];B<r;)he*=1.3,B+=he,W.push(Math.min(B,r));return W},fe=q.moat,vt=[[fe.a[0],fe.c[0]],[fe.a[1],fe.c[0]],[fe.a[1],fe.c[1]],[fe.a[0],fe.c[1]]].map(([e,a])=>d.fromLocal(e,a)),Mt=[Math.min(...vt.map(e=>e[0]))-30,Math.max(...vt.map(e=>e[0]))+30],lt=[Math.min(...vt.map(e=>e[1]))-30,Math.max(...vt.map(e=>e[1]))+30],Nt=d.oz-ce.zLo+140;let zt,At;for(let e=1,a=0;a<4;a++){zt=Ye([-230,Math.max(Mt[1]+80,700)],[[-70,C[0]+82,4.3*e],[C[0]+82,C[0]+300,12*e],[Mt[0],Mt[1],12*e]],-15e3,15e3,24*e),At=Ye([-250,Math.max(lt[1]+80,C[1]+420)],[[120,C[1]+50,10*e],[C[1]+50,C[1]+400,12*e],[lt[0],lt[1],12*e]],-9e3,Math.max(Nt,lt[1]+200),24*e);const n=(zt.length-1)*(At.length-1)*2;if(n<=51e3)break;e*=Math.sqrt(n/51e3)*1.01}const Se=zt.length,t=At.length,o=new Float32Array(Se*t*3),s=new Float32Array(Se*t*3),h=new Uint32Array((Se-1)*(t-1)*6),c=e=>{const a=Oe(At[e]);for(let n=0;n<Se;n++){const r=(e*Se+n)*3,v=re(zt[n]);o[r]=v,o[r+1]=d.groundAt(v,a),o[r+2]=a}},D=e=>{for(let a=0;a<Se;a++){const n=(e*Se+a)*3,r=Math.max(a-1,0),v=Math.min(a+1,Se-1),W=Math.max(e-1,0),he=Math.min(e+1,t-1),B=(e*Se+r)*3,b=(e*Se+v)*3,ee=(W*Se+a)*3,j=(he*Se+a)*3,ne=-(o[b+1]-o[B+1])/(o[b]-o[B]),be=-(o[j+1]-o[ee+1])/(o[j+2]-o[ee+2]),Ce=Sa(ne,1,be);s[n]=ne/Ce,s[n+1]=1/Ce,s[n+2]=be/Ce}},F=()=>{for(let e=0,a=0;e<t-1;e++)for(let n=0;n<Se-1;n++){const r=e*Se+n,v=r+Se;h[a++]=r,h[a++]=v,h[a++]=r+1,h[a++]=r+1,h[a++]=v,h[a++]=v+1}};for(let e=0;e<t;e++)c(e),e%28===27&&await A();for(let e=0;e<t;e++)D(e),e%64===63&&await A();await A(),F();const w=new u.BufferGeometry;w.setAttribute("position",new u.BufferAttribute(o,3)),w.setAttribute("normal",new u.BufferAttribute(s,3)),w.setIndex(new u.BufferAttribute(h,1)),await A();const V=(()=>{const e=d.at(l.ring);return i(re(e[0]),ke.ring,Oe(e[1]))})(),N={...z,uCastC:{value:new u.Vector4(S.x,S.z,0,0)},uCastA:{value:new u.Vector4(S.ax,S.az,S.rx,S.rz)},uRing:{value:V},uMoat:{value:new u.Vector4(.5*(fe.a[0]+fe.a[1]),.5*(fe.c[0]+fe.c[1]),.5*(fe.a[1]-fe.a[0])-fe.r,.5*(fe.c[1]-fe.c[0])-fe.r)},uBoxLo:{value:[i(0,0,0),i(0,0,0)]},uBoxHi:{value:[i(0,-1,0),i(0,-1,0)]},uStone:{value:new u.Color(.2,.2,.22)},uOutA:{value:Array.from({length:12},()=>new u.Vector4(0,0,0,0))},uOutB:{value:Array.from({length:12},()=>new u.Vector4(0,0,0,0))},uOutNight:{value:new u.Color(.14,.168,.235)},uOutLit:{value:new u.Color(.6,.48,.33)},uOutK:{value:i(0,5.6,1.45)}},Te=new u.ShaderMaterial({side:u.DoubleSide,uniforms:N,vertexShader:`
        varying vec3 vW; varying vec3 vN;
        void main(){ vW = position; vN = normal; gl_Position = projectionMatrix*viewMatrix*vec4(position, 1.); }`,fragmentShader:K.glsl.front+K.glsl.noise+K.glsl.ramp+K.glsl.ground+K.glsl.mirror+Ht+la+Ia}),de=new u.Mesh(w,Te);de.name="land",de.frustumCulled=!1,de.renderOrder=-10,Be.add(de),await A();const $=new u.ShaderMaterial({depthWrite:!1,depthTest:!0,side:u.BackSide,uniforms:z,vertexShader:`
        varying vec3 vDir;
        void main(){ vDir = position; vec4 p = projectionMatrix*vec4(mat3(viewMatrix)*position, 1.); if (abs(p.w) < 1e-4) p.w = 1e-4; gl_Position = p.xyww; }`,fragmentShader:K.glsl.front+K.glsl.noise+Ht+Na}),le=new u.Mesh(new u.BoxGeometry(2,2,2),$);le.name="sky",le.frustumCulled=!1,le.renderOrder=10,Be.add(le),Be.background=te.clone(),await A();const ye=[];for(let e=0;e<=M.length;e+=2){const a=M.posAtDist(e);a.way=Ke(e),ye.push(a)}const we={ctx:m,scene:Be,hero:K,L:ce,wind:ae,plan:d,path:M,way:l,U:z,forks:U,deal:Ue,detail:Je,pause:A,COMFORT:Da,PLAN:q,HAZE:_t,podMap:{data:He,n:512,e0:P.e0,n0:P.n0,span:P.span,tex:ue},trailE:Ca,yAt:Me,wayOfDist:Ke,distOfWay:st,routePts:ye,side:Y,ringPos:V,zoneD:Fe,rockY:Ha,rockY0:ha,TEX:P,glsl:{front:K.glsl.front,noise:K.glsl.noise,ramp:K.glsl.ramp,mirror:K.glsl.mirror,world:Ht,water:Oa,air:la}};we.lanes=await La(we);const g=await za(we);g.object&&Be.add(g.object),qe.forest=g.heightAt||null,we.forest=g,await A();const Xe=await K.takeForest();await A();const oe=await K.clearGround(E,5,.35);oe.points=R,await A();const ge=await K.clearRoute(M,8);await A();const nt=(e,a)=>d.sdMoat(d.pe(e),d.pn(a))<0,ut=[],je=d.castle;if(nt(je.x,je.z)){for(let e=0;e<200;e++){const a=e/200*6.2832,n=Math.cos(a),r=Math.sin(a);let v=0,W=1200;for(let he=0;he<18;he++){const B=.5*(v+W);nt(je.x+n*B,je.z+r*B)?v=B:W=B}ut.push({x:je.x+n*v,z:je.z+r*v})}for(let e=je.x-1008;e<=je.x+1008;e+=56)for(let a=je.z-1008;a<=je.z+1008;a+=56)d.sdMoat(d.pe(e),d.pn(a))<-12&&ut.push({x:e,z:a})}await A();const mt=K.keepBrands?await K.keepBrands(ut.length?ut:nt,61):null;await A();{const e={need:60,ok:!1,found:!!(mt&&mt.found)};if(e.found){const a=mt.map;let n=0,r=0,v=1/0,W=0,he=0;for(let j=a.x0;j<=a.x1;j+=4)for(let ne=a.z0;ne<=a.z1;ne+=4){const be=d.sdMoat(d.pe(j),d.pn(ne));if(be>140)continue;const Ce=mt.at(j,ne);be<=60?(r++,Ce>n&&(n=Ce)):(Ce>0&&be<v&&(v=be),Ce<1&&be>W&&(W=be)),++he>3e4&&(he=0,await A())}await A();let B=1/0,b=1,ee=0;for(let j=l.runIn;j<=l.runOut;j+=6){const ne=M.posAtDist(st(j)),be=d.sdMoat(d.pe(ne.x),d.pn(ne.z)),Ce=mt.at(ne.x,ne.z);be<B&&(B=be),Ce<b&&(b=Ce),Ce<.999&&(ee+=6)}Object.assign(e,{ok:r>0&&n===0,placesHanded:mt.squares,margin:mt.margin,soft:mt.soft,placesAskedWithin60:r,mostShareWithin60:n,sparksBeginAtMetresFromTheMoat:+v.toFixed(1),fullFromMetres:+W.toFixed(1),theRunByTheFire:{leastToTheMoat:+B.toFixed(1),leastToTheKeepOut:+(B-W).toFixed(1),leastShare:+b.toFixed(3),metresOfItInTheSoftEdge:ee,itsLength:Math.round(l.runOut-l.runIn),keepsItsSparks:b>=.999}})}ge.air=e}ge.openGround=oe,ge.forest=Xe;let Dt=1/0;for(let e=-3e3;e<=3e3;e+=12){const a=d.sdMoat(d.pe(e),d.pn(ce.frontZ(e)));a<Dt&&(Dt=a)}ge.moat={need:60,thePartsLine:+Dt.toFixed(1),thePartsFlamesBeforeItsLine:"none on any ground within 64 m of the moat (taken off by the part)",takenByThePart:{tongues:oe.tonguesTaken,spotFires:oe.spotsTaken,burstPlaces:oe.burstsTaken}},await A();const De=await Fa(we);if(De.object&&Be.add(De.object),we.castle=De,De.mirror&&(De.mirror.lo.forEach((e,a)=>N.uBoxLo.value[a].copy(e)),De.mirror.hi.forEach((e,a)=>N.uBoxHi.value[a].copy(e)),N.uStone.value.copy(De.mirror.color)),De.outline&&De.outline.pieces&&De.outline.pieces.length){const e=De.outline,a=Math.min(12,e.pieces.length);for(let n=0;n<a;n++){const r=e.pieces[n];r.kind==="drum"?(N.uOutA.value[n].set(r.at.x,r.at.y,r.at.z,r.fire),N.uOutB.value[n].set(r.r,r.top,0,2)):(N.uOutA.value[n].set(r.lo.x,r.lo.y,r.lo.z,r.fire),N.uOutB.value[n].set(r.hi.x,r.hi.y,r.hi.z,1))}N.uOutNight.value.copy(e.night),N.uOutLit.value.copy(e.lit),N.uOutK.value.set(a,e.gain,e.ceil)}await A();const ft=await Ra(we);ft.object&&Be.add(ft.object),we.life=ft,await A();const St=await Aa(we);Be.add(St.object),await A(),g.info&&g.info.moatLeast&&(Object.assign(ge.moat,g.info.moatLeast),ge.moat.ok=g.info.moatLeast.ok&&Dt>=60),g.info&&(ge.gates={bowedGiantsThatBurn:g.info.bowedThatBurn,ok:g.info.bowedThatBurn===0});const et=U.air,Ct=Math.round(1500*Je),Ut=new Float32Array(Ct*4),Qt=new Float32Array(Ct*4),ca=i(0,0,0);let Rt=0;const Lt=32,Wt=new Map,Zt=(e,a)=>(e+4096)*8192+(a+4096);for(const e of ye){const a=Zt(Math.floor(e.x/Lt),Math.floor(e.z/Lt));let n=Wt.get(a);n||Wt.set(a,n=[]),n.push(e)}const fa=(e,a,n)=>{const r=Math.floor((e-28)/Lt),v=Math.floor((e+28)/Lt),W=Math.floor((a-28)/Lt),he=Math.floor((a+28)/Lt);for(let B=r;B<=v;B++)for(let b=W;b<=he;b++){const ee=Wt.get(Zt(B,b));if(ee){for(const j of ee)if(Math.abs(j.y-n)<14&&ct(j.x-e,j.z-a)<28)return!0}}return!1},da=()=>{const e=et()*M.length,a=M.posAtDist(e,ca),n=a.x+et.range(-70,70),r=a.z+et.range(-70,70),v=et.range(-22,26),W=et(),he=et.range(1.5,4),B=et.range(.05,.12);if(et()>.25+.75*Math.exp(-Math.max(d.lineD(a.x,a.z),0)/420))return;const b=Math.max(d.groundAt(n,r)+1.5,a.y+v);let ee=!0;for(let j=-1;j<=1&&ee;j++)fa(n+ae.x*j*20,r+ae.z*j*20,b)&&(ee=!1);if(ee){if(d.sdMoat(d.pe(n),d.pn(r))<86){et(),et();return}Ut.set([n,b,r,W],Rt*4),Qt.set([he,B,et(),et()],Rt*4),Rt++}};for(let e=0;e<Ct*6&&Rt<Ct;e++)e%1300===1299&&await A(),da();const xt=new u.InstancedBufferGeometry;xt.setAttribute("position",new u.Float32BufferAttribute([0,0,0,0,0,0,0,0,0,0,0,0],3)),xt.setAttribute("aQ",new u.Float32BufferAttribute([-1,-1,1,-1,1,1,-1,1],2)),xt.setIndex([0,1,2,0,2,3]),xt.setAttribute("aA",new u.InstancedBufferAttribute(Ut,4)),xt.setAttribute("aB",new u.InstancedBufferAttribute(Qt,4)),xt.instanceCount=Rt;const ua=new u.ShaderMaterial({transparent:!0,depthWrite:!1,blending:u.AdditiveBlending,uniforms:{...z,uPix:K.all.uPix},vertexShader:K.glsl.front+Ht+`
        attribute vec2 aQ; attribute vec4 aA, aB; uniform float uPix; varying vec2 vQ; varying vec3 vC;
        void main(){
          float ph = fract(uFcrT*aB.x/40. + aA.w);                                   // 40 m of drift down the wind, then again (the world clock)
          vec3 c = aA.xyz; c.xz += uWind.xy*(40.*(ph - .5));
          c.x += 1.6*sin(uFcrT*.7*aB.z + aB.w*40.) + .8*sin(uFcrT*1.9 + aB.w*17.); c.y += 1.1*sin(uFcrT*.9 + aB.z*30.) - 3.*(ph - .5)*aB.w;
          vec4 Lf = fcrLight(c);
          vec4 mv = viewMatrix*vec4(c, 1.); float dist = max(length(mv.xyz), .1), s = aB.y, sz = max(s, dist*uPix*1.2);
          float str = (s*s)/(sz*sz)*smoothstep(0., .12, ph)*(1. - smoothstep(.88, 1., ph))*(1. - wFogAt(dist))*smoothstep(1.5, 5., dist);
          vC = (uAmbSky*.5 + uFire*3.*Lf.w)*.34*str;
          mv.xy += aQ*sz*vec2(1.6, 1.); gl_Position = projectionMatrix*mv; vQ = aQ;
        }`,fragmentShader:`
        varying vec2 vQ; varying vec3 vC;
        void main(){ float r2 = dot(vQ, vQ), g = exp(-r2*2.6)*max(1. - r2, 0.); if (g < .01) discard; gl_FragColor = vec4(vC*g, 0.); }`}),Bt=new u.Mesh(xt,ua);Bt.name="flecks",Bt.frustumCulled=!1,Bt.renderOrder=8,Be.add(Bt),await A();const Gt=[];for(const e of[g,De,ft,St])if(e.clearAir){for(const a of await e.clearAir(ye,2))Gt.push(a);await A()}Gt.push({kind:"the front (sheet of flame)",least:ge.nearestSheet,note:`${ge.tonguesTaken} tongues, ${ge.burstsTaken} burst places taken away by the part`});const tt=q.speed,ma=[[0,tt.high],[110,tt.high],[l.rideLevel,tt.bed],[l.rideEnd-40,tt.bed],[l.rideEnd+90,tt.flat],[l.runIn+40,tt.run],[l.turn2Start-20,tt.run],[l.turn2Start+70,tt.turn],[l.shore-46,tt.shore],[l.shore+54,tt.moat],[l.shore+150,tt.court],[l.ring,tt.court]],at=[];for(const e of ma)at.push([Math.min(Math.max(e[0],at.length?at[at.length-1][0]+30:0),l.ring),e[1]]);const Kt=e=>{for(let a=0;a<at.length-1;a++)if(e<=at[a+1][0])return ht(at[a][1],at[a+1][1],_e(at[a][0],at[a+1][0],e));return at[at.length-1][1]};let Pt=0;for(let e=1;e<M.length;e+=2)Pt+=2/Kt(Ke(e));const Yt=M.length/Pt,pa=e=>Kt(Ke(e*M.length))/Yt,Ft=(e,a)=>{let n=0;for(let r=st(e)+1;r<st(a);r+=2)n+=2/Kt(Ke(r));return n},qt=d.castle,wa=i(ht(re(0),qt.x,.5),20,ht(ce.frontZ(re(0)),qt.z,.5)),ga=p(l.rideLevel),Xt=ga,Vt=p(l.rideLevel)-p(l.rideLevel-120),Tt=i(0,0,0),yt=i(0,0,0),Jt=-Y*42*Ie,ea=Math.cos(Jt),ta=Math.sin(Jt),va=(e,a)=>{const n=a*M.length;M.posAtDist(n,Tt),M.tangentAtDist(n,yt);const r=ct(yt.x,yt.z)||1;return Tt.x+=(yt.x*ea-yt.z*ta)/r*300,Tt.z+=(yt.x*ta+yt.z*ea)/r*300,Tt.y+=14,Tt},$t=l.rideEnd-40,jt=l.turn2Start-30,aa=Math.min(l.runOut,l.turn2Start)-130,oa=l.turn2End+60,xa=i(qt.x,ke.moat+8,qt.z),ya=[{at:wa,from:-Vt*1.05,to:Xt,fade:Vt/(Xt+Vt*1.05),weight:.8},{at:va,from:p($t),to:p(jt),fade:170/(jt-$t),weight:.9},{at:xa,from:p(aa),to:p(oa),fade:Math.min(.5,150/(oa-aa)),weight:.9}],na={front:K.triangles,land:h.length/3,sky:12,forest:g.triangles||0,castle:De.triangles||0,life:ft.triangles||0,ground:St.triangles,air:Rt*2},ba={front:K.calls,land:1,sky:1,forest:g.calls||0,castle:De.calls||0,life:ft.calls||0,ground:St.calls,air:1};return{scene:Be,path:M,duration:Pt,pace:pa,style:"none",camera:{fov:62,near:.5,far:17e3,lookAhead:60,sway:0,bank:.35},pois:ya,portal:{shape:"circle",radius:Ea.ring.portal*q.K,color:"#4FE0C8",glow:.9,style:"ring",revealDistance:M.length-st(l.turn2Start-150),blendDistance:40},post:{exposure:1,bloom:{strength:.42,radius:.6,threshold:.92},grade:{saturation:1.06,contrast:1.05,shadowTint:"#060A1E",vignette:.3,grain:.02,aberration:0}},deal:{...Ue,side:Y,fit:d.fit,lobe:[ce.lobe.x,ce.lobe.z],way:l,length:M.length,duration:Pt,meanSpeed:Yt,seconds:{besideTheFire:Ft(l.runIn,l.runOut),gazeOnTheFire:Ft($t,jt),toTheWater:Ft(0,l.rideLevel),upTheRiver:Ft(l.rideLevel,l.rideEnd),turnToTheShore:Ft(l.turn2Start,l.shore),lastLeg:Ft(l.shore,l.ring)},air:Gt,tri:na,calls:ba,triangles:Object.values(na).reduce((e,a)=>e+a,0),forest:g.info,castleInfo:De.info,life:ft.info,ground:St.info,clear:ge,places:Object.fromEntries(Object.entries(l).filter(([,e])=>typeof e=="number").map(([e,a])=>[e,[Math.round(a),+p(a).toFixed(3)]]))},update(e,a,n,r){K.update(e,a,n),g.update&&g.update(e,a,n),De.update&&De.update(e,a,n),ft.update&&ft.update(e,a,n)},dispose(){K.dispose()}}}};const Ia=`
#define FIRE_LAND 2.2
uniform float uRideEnd; uniform vec4 uCastC, uCastA, uMoat; uniform vec3 uRing; uniform vec3 uBoxLo[2], uBoxHi[2]; uniform vec3 uStone;
uniform vec4 uOutA[12], uOutB[12]; uniform vec3 uOutNight, uOutLit, uOutK;   // the castle's outline: A a box's low corner or a drum's middle at its foot, w how far on the fire's side; B a box's high corner or a drum's girth and top, w 1 a box, 2 a drum; K: how many, the lit colour's gain and ceiling
varying vec3 vW; varying vec3 vN;
vec2 gDx, gDy;
// value noise from the shared texture, filtered by the pixel's footprint: far ground goes to its mean, no shimmer
float gn(vec2 p, float s){ vec2 i = floor(p), f = fract(p); f = f*f*(3. - 2.*f); return textureGrad(uNoise, (i + f + .5)/256., gDx*s/256., gDy*s/256.).b; }
// a crisp edge in a field (v against a level), as wide as the pixel allows: no soft smear under the eye
float cut(float v, float level, float k, float px){ float w = clamp(px*k, .004, .5); return smoothstep(level - w, level + w, v); }
// how much of a box a ray goes through (0..1 over the first 7 m of its way inside it: a mass's image has no stepped edge)
float boxHit(vec3 ro, vec3 rd, vec3 lo, vec3 hi){
  vec3 sg = mix(vec3(-1.), vec3(1.), step(0., rd)), inv = sg/max(abs(rd), vec3(1e-4));
  vec3 t1 = (lo - ro)*inv, t2 = (hi - ro)*inv, a = min(t1, t2), b = max(t1, t2);
  float tn = max(max(a.x, a.y), a.z), tf = min(min(b.x, b.y), b.z);
  return smoothstep(0., 7., tf - max(tn, 0.))*step(0., tf);
}
// the same for an upright drum (its middle at its foot c, its girth r, its top)
float cylHit(vec3 ro, vec3 rd, vec3 c, float r, float top){
  vec2 oc = ro.xz - c.xz; float a = max(dot(rd.xz, rd.xz), 1e-5), b = dot(oc, rd.xz), disc = b*b - a*(dot(oc, oc) - r*r);
  if (disc <= 0.) return 0.;
  float sq = sqrt(disc), t0 = (-b - sq)/a, t1 = (-b + sq)/a, iy = (rd.y < 0. ? -1. : 1.)/max(abs(rd.y), 1e-4);
  float ya = (c.y - ro.y)*iy, yb = (top - ro.y)*iy, tn = max(t0, min(ya, yb)), tf = min(t1, max(ya, yb));
  return smoothstep(0., 7., tf - max(tn, 0.))*step(0., tf);
}
// where a file of runners goes down the river (the plan's law of the files: the animals' part reads the same figures)
float trailE(float e0, float N){ return ${ra}; }
void main(){
  vec3 wp = vW; float d0 = wp.z - fcrFront(wp.x);
  if (d0 < -60.) discard;                                   // behind the line the fire's own foot and the smoke stand (the part's)
  gDx = dFdx(wp.xz); gDy = dFdy(wp.xz);
  float px = max(length(gDx), length(gDy));                 // metres of ground to a pixel
  vec3 V = wp - cameraPosition; float dist = length(V); vec3 rd = V/max(dist, 1e-3);
  vec2 en = wPlan(wp), lg = wLeg(en); vec4 pm = wPlanMap(en);
  float shal = (1. - smoothstep(-8., 10., (pm.r - .5)*160.));      // 1 in the drowned shallows and on their shores
  float wb = wWat(pm, wp.xz);                               // metres outside the water: the banks wander, the islets stand in the shallows
  vec4 Lf = fcrLight(wp);                                   // the fire's light here, by this place's distance from the line
  float wE = wFar(Lf.w), podL = wPod(en)*smoothstep(110., 260., d0);   // what a dark thing makes of it far off; the pods' amber lying here
  float big = gn(wp.xz/310., 1./310.), mid = gn(wp.xz/41. + 17., 1./41.), fine = gn(wp.xz/5.7 + 3., 1./5.7), grit = gn(wp.xz/.9 + 9., 1./.9);
  // THE BARS: here and there along each file's line the bed comes up as a bar of gravel: a short lozenge of its own length
  // and breadth, lying a little to the side of the line away from the route, with a shoal round it under the water
  // (the files run over the bars and wade between them). None is a strip: between two bars the water is whole.
  float inRide = (1. - smoothstep(uRideEnd - 60., uRideEnd + 20., lg.y))*(1. - smoothstep(240., 320., abs(lg.x))), bar = -1e3, shoal = -1e3;   // (stage E: the river's own reach and breadth only: no other water takes the river's face)
  for (int k = 0; k < 4; k++){
    float e0 = k == 0 ? ${q.trail.lanes[0].toFixed(1)} : k == 1 ? ${q.trail.lanes[1].toFixed(1)} : k == 2 ? ${q.trail.lanes[2].toFixed(1)} : ${q.trail.lanes[3].toFixed(1)};
    float wv = gn(vec2(e0*3.1 + 7., lg.y/14.), 1./14.), wv2 = gn(vec2(e0*1.7 + 31., lg.y/9.), 1./9.), show = smoothstep(.50, .64, wv + .15*(mid - .5))*smoothstep(.15, .55, sin(lg.y/6.1 + e0*2.3));   // (no bar longer than 15 m: a shoal, never a strip)
    float dq = abs(lg.x - trailE(e0, lg.y) - sign(e0)*3.*wv2), hwb = (.8 + 4.*smoothstep(.5, .85, wv))*(.7 + .6*wv2);
    bar = max(bar, (hwb + .9*(fine - .5))*show - dq - 4.*(1. - show));               // (stage E: where no bar shows the water is whole)
    shoal = max(shoal, (hwb + 3.2 + 1.5*(mid - .5))*show - dq - 6.*(1. - show));
  }
  bar = mix(-1e3, min(bar, 1.4), inRide); shoal = mix(-1e3, shoal, inRide);
  float wat = wb < 0. ? max(wb, bar) : wb;
  float onBar = step(wb, 0.)*step(0., wat);                 // land that stands in the water: a bar, an islet
  float bankK = (1. - smoothstep(1.5, 9.5, wat)), wetK = (1. - smoothstep(0., 3.5, wat));
  float under = smoothstep(3., 10., wat)*(1. - .6*shal);    // under the plants
  // ---- THE FOREST'S FLOOR: dark litter of plumes and husks, a net of roots; the fire's light comes slanting between
  // the trunks in bars, and the dusk's blue lies in the shade
  float lodC = (1. - smoothstep(.12, .45, px));
  vec2 fwd = normalize(Lf.xz + vec2(1e-4, -1e-4)); float along = dot(wp.xz, fwd), across = dot(wp.xz, vec2(-fwd.y, fwd.x));
  float bars = smoothstep(.40, .66, gn(vec2(across/4.6 + 3., along/48.), 1./4.6) + .35*(gn(vec2(across/1.5, along/17.), 1./1.5) - .5));   // soft-edged: light between trunks
  float root = lodC*(1. - smoothstep(0., .07, abs(gn(wp.xz/2.4 + 57., 1./2.4) - .5)))*cut(gn(wp.xz/7.7 + 11., 1./7.7), .45, .2, px);
  vec3 litter = mix(vec3(.040, .031, .026), vec3(.092, .070, .050), cut(fine*.5 + grit*.5, .5, .5, px)*.7 + .3*big);
  litter = mix(litter, vec3(.020, .016, .014), .7*root);
  // ---- THE BANKS: dark mud, smooth and wet toward the water, the roots' net in it
  vec3 mud = vec3(.056, .044, .037)*(.7 + .6*mid)*(1. - .55*root);
  // ---- THE BARS: dark wet gravel (no stone is drawn by itself: at this height a bar is a dark wet shoulder in the water)
  vec3 gravel = mix(vec3(.034, .031, .030), vec3(.066, .060, .055), .5*fine + .5*grit);
  // ---- THE DROWNED SHALLOWS' ISLETS AND SHORES (stage D: drowned ground, never burnt: the fire has not passed here
  // and never will): dark wet silt; strand lines of pale dead stalks that the water left, lying along the shore;
  // low mats of living growth on what stands driest. (The part's own char lies in it only where the part's law
  // puts it, by the line.)
  float plate = lodC*(1. - smoothstep(0., .05, abs(gn(wp.xz/1.7 + 71., 1./1.7) - .5)));
  float strand = (1. - smoothstep(0., .36, abs(fract(wat*.5 + .9*mid + .35*fine) - .5)))*smoothstep(.15, 1., wat)*(1. - smoothstep(3., 7.5, wat))*lodC;
  float growth = smoothstep(.50, .68, gn(wp.xz/6.3 + 37., 1./6.3) + .25*(grit - .5))*smoothstep(.5, 2.2, wat);
  vec3 silt = vec3(.042, .035, .030)*(.7 + .6*mid)*(.9 + .2*grit);                                  // dark wet silt
  silt = mix(silt, vec3(.088, .076, .058), .55*strand);
  silt = mix(silt, vec3(.030, .026, .031)*(.65 + .7*fine), .8*growth);
  silt *= .6 + .6*smoothstep(.25, .75, big*.4 + mid*.6);      // wet and drier in broad patches: never one even sheet
  vec3 alb = mix(litter, mud, bankK);
  alb = mix(alb, gravel, max(max(onBar, smoothstep(0., 2., shoal)*step(wat, 0.)), (1. - smoothstep(.3, 2.4, wat))*smoothstep(.42, .5, mid))*(1. - shal));
  alb = mix(alb, silt, shal*max(onBar, bankK));
  alb *= mix(1., .55, wetK);
  // THE RIVER'S AND THE CHANNEL'S BANKS (stage E): wet silt and roots, never one flat tone: clods and damp patches,
  // the strand lines of pale drift the water left along the shore, dark plates where the silt has dried and split;
  // a small relief of clods for the low light to rake (below)
  float bankR = bankK*(1. - shal);
  vec2 pB = wp.xz/1.9 + 31.; float clod = gn(pB, 1./1.9), damp = smoothstep(.3, .7, gn(wp.xz/13. + 5., 1./13.));
  alb = mix(alb, alb*(.5 + clod)*(.62 + .6*damp), bankR);
  alb = mix(alb, vec3(.086, .074, .056)*(.7 + .6*grit), .5*strand*bankR*(1. - onBar));
  alb = mix(alb, vec3(.018, .015, .014), .6*plate*bankR*damp);
  // WHERE FIRE MEETS GROUND: the part's own scorch, char and ember fields: on the land and on the islets of the
  // shallows; never in a water, and nowhere within 60 m of the moat (the castle's ground is never scorched)
  vec2 cq = wp.xz - uCastC.xy, lc = vec2(dot(cq, uCastA.xy), dot(cq, uCastA.zw)), mq = abs(lc - uMoat.xy) - uMoat.zw;
  float sdM = length(max(mq, 0.)) + min(max(mq.x, mq.y), 0.) - ${q.moat.r.toFixed(1)};                               // metres outside the moat's drawn edge
  float scK = smoothstep(-.4, .6, wat)*smoothstep(60., 110., sdM);
  vec4 sc = fcrScorchF(wp); sc.xyz *= scK;
  vec2 bn = fcrBurn(wp, sc)*scK;                            // the part's char (x) with its fingers and islands, and the singed margin round it (y)
  alb = mix(alb, vec3(.030, .017, .009), .85*bn.y);
  alb = mix(alb, vec3(.012, .011, .010), .97*bn.x);
  // small relief for the low light to rake: hummocks and root swells under the plants, clods, the silt's swells
  vec2 pA = wp.xz/33. + 5., pF = wp.xz/5.7 + 3., pD = wp.xz/9.3 + 13.;
  float hA = gn(pA, 1./33.), hD = gn(pD, 1./9.3);
  vec2 gH = vec2(gn(pA + vec2(.15, 0.), 1./33.) - hA, gn(pA + vec2(0., .15), 1./33.) - hA)*(1.2/(33.*.15));
  vec2 gF = vec2(gn(pF + vec2(.15, 0.), 1./5.7) - fine, gn(pF + vec2(0., .15), 1./5.7) - fine)*(.25/(5.7*.15));
  vec2 gD = vec2(gn(pD + vec2(.1, 0.), 1./9.3) - hD, gn(pD + vec2(0., .1), 1./9.3) - hD)*(1.1/(9.3*.1))*shal;
  vec2 gB = vec2(gn(pB + vec2(.2, 0.), 1./1.9) - clod, gn(pB + vec2(0., .2), 1./1.9) - clod)*(.55/(1.9*.2))*bankR*lodC;
  vec2 gg = gH*under + gF + gD + gB;
  vec3 n = normalize(normalize(vN) + vec3(-gg.x, 0., -gg.y));
  float rake = clamp(dot(n, Lf.xyz)/max(Lf.y, .04), 0., mix(1.5, 2.6, smoothstep(.2, .5, Lf.w)));   // level ground 1; a slope toward the fire more (most by the line); away from it none
  // the part's law for a plain (albedo x fire x strength x rake) at FIRE_LAND; under the crowns the fire comes in
  // bars between the trunks and the sky's light is the shade's blue
  vec3 light = mix(uAmbGnd, wSkyAmb(Lf.w), .5 + .5*n.y)*mix(1., .8, under) + uDuskCol*max(dot(n, uDuskDir), 0.)*mix(1., .3, under) + uFire*(FIRE_LAND*mix(.7*wE, Lf.w, smoothstep(.2, .45, Lf.w))*mix(.42, 1., smoothstep(15., 150., d0))*rake*mix(fcrRough(wp, Lf), 1., .5*under)*mix(1., .16 + .62*bars, under)*mix(1., .5, max(shal, onBar))) + vec3(1., .43, .07)*(1.5*podL);   // (right before the line the ground is a dark shelf with a rim, not a lit one; under the ripe plants their pods' amber lies on it)   // (wet black ash and wet gravel drink the light)
  // NO PALE FLOOR: what the fire's light gives the ground beyond a deep orange is taken back (by the value alone, as
  // on the plants' skin): ground beside the line is dark with an orange light on it, never a pale sheet
  vec3 col = alb*light; col /= 1. + 1.2*max(col.r - .22, 0.);
  col = max(col, vec3(.015, .019, .032)*(.55 + .9*fine)*(.6 + .8*clod));   // (stage E: no ground is pure black: the dusk's blue lies in the deepest shade, with the ground's grain)
  // the part's ember field, seen through a crust of char: the hot bed at the flames' feet glows in patches and
  // cracks between dark plates (an even glowing sheet reads as a pale floor)
  col += fcrEmberC(wp, sc, bn.x + .42*bn.y)*(scK*(.16 + .84*smoothstep(.40, .74, .6*fine + .4*mid)*(1. - .5*plate)));
  // wet shine on bars and banks (optics): the fire's and the sky's light glancing off wet ground
  vec3 Rg = reflect(rd, n); Rg.y = abs(Rg.y);
  col += wetK*step(0., wat)*(1. - .8*shal)*(uFire*(.30*Lf.w*pow(max(dot(Rg, Lf.xyz), 0.), 7.)) + wSky(Rg)*(.5*pow(1. - clamp(dot(-rd, n), 0., 1.), 3.)));
  if (wat < .6 + 1.7*inRide) {
    // WATER: the sky with its stars, the fire and its smoke, the pods' amber, the banks with their plants and the
    // castle, doubled in a moving face (the kit mirrors a sky only; this takes the part's light and the part's own
    // mirror). RIPPLES AT EVERY DISTANCE: slow swells of 11 m, the air's ripples of 3 m near the eye, and fine
    // ripples whose length is taken by the pixel's footprint (two neighbouring sizes of one field of the place,
    // cross-faded: about three pixels long wherever water is seen), steeper along the look than across it (optics:
    // the facets that send a low light to the eye lie along the look). So every mirrored thing is drawn out into
    // long trembling strokes, at every distance, and none hangs in the water as a slab.
    float t = uFcrT, cal = smoothstep(.02, .6, px); vec2 rp = wp.xz;
    vec2 vd = normalize(rp - cameraPosition.xz + vec2(1e-4, 0.)), vq = vec2(-vd.y, vd.x);
    float lf = log2(max(px*3.2, .35)/.35), lf0 = floor(lf), k0 = .35*exp2(lf0), k1 = 2.*k0, fk = lf - lf0;
    vec2 dr = vec2(t*.21, -t*.16), q0 = (rp + dr)/k0, q1 = (rp + dr)/k1;
    vec2 fine2 = mix(vec2(gn(q0, 1./k0), gn(q0 + 37.3, 1./k0)), vec2(gn(q1 + 11.7, 1./k1), gn(q1 + 53.1, 1./k1)), fk) - .5;
    // (the same field three times as long: about ten pixels along the look wherever water is seen; it breaks the
    // castle's doubled image into strokes that are read as strokes, not as grain)
    float lm = lf + 1.7, lm0 = floor(lm), m0 = .35*exp2(lm0), m1 = 2.*m0, fm2 = lm - lm0;
    float mid2 = mix(gn((rp + dr)/m0 + 71.3, 1./m0), gn((rp + dr)/m1 + 29.9, 1./m1), fm2) - .5;
    float a1 = gn(rp/2.9 + vec2(t*.13, t*.08), 1./2.9), a2 = gn(rp/2.9 + vec2(-t*.10, t*.12) + 19., 1./2.9);
    float l1 = gn(rp/11. + vec2(t*.05, t*.03) + 7., 1./11.), l2 = gn(rp/11. + vec2(-t*.04, t*.05) + 23., 1./11.);
    float cur = (gn(vec2(lg.x/1.7 + 13., lg.y/52. + t*.03), 1./1.7) - .5)*inRide;
    // THE RIVER'S FACE (stage E): a calm dark river. Its fine ripples are LINES, not cells: long low crests lying
    // across the stream (two fields of the place in the river's own frame, a little aslant of each other and each
    // eleven and eight times as long as it is broad, going with the air), their breadth taken by the pixel's
    // footprint as before (so they lengthen with distance). The round-celled field that broke the river's mirror
    // into blotches is all but stilled there; the drowned shallows and the lagoon keep their own face.
    float rk = max(px*2.4, .16), lr = log2(rk/.16), lr0 = floor(lr), r0 = .16*exp2(lr0), r1 = 2.*r0, fr2 = lr - lr0;
    vec2 ra = vec2(lg.x*.97 + lg.y*.24, lg.y*.97 - lg.x*.24 + t*.11), rb = vec2(lg.x*.98 - lg.y*.19, lg.y*.98 + lg.x*.19 + t*.08);
    float lnA = mix(gn(vec2(ra.x/(r0*11.) + 3.3, ra.y/r0), 1./r0), gn(vec2(ra.x/(r1*11.) + 8.1, ra.y/r1 + 5.7), 1./r1), fr2);
    float lnB = mix(gn(vec2(rb.x/(r0*8.) + 21.3, rb.y/(r0*1.3) + 9.), 1./r0), gn(vec2(rb.x/(r1*8.) + 41.9, rb.y/(r1*1.3) + 2.2), 1./r1), fr2);
    float lineS = (lnA + lnB - 1.)*inRide;
    // (stage F: THE DROWNED SHALLOWS BEFORE THE FIRE take the same cure as far as it takes the blocks out of the fire's
    // image: their celled field is brought down to four tenths and long low crests lie across the air's way. By place:
    // the waters 640 m and more from the castle's middle; within 420 m of it the lagoon and the moat keep their face)
    float cureK = (1. - inRide)*smoothstep(420., 640., length(lc));
    vec2 wn = normalize(uWind.xy + vec2(1e-4, 0.)), lw = vec2(dot(rp, vec2(-wn.y, wn.x)), dot(rp, wn));
    vec2 rc = vec2(lw.x*.97 + lw.y*.24, lw.y*.97 - lw.x*.24 + t*.11), re = vec2(lw.x*.98 - lw.y*.19, lw.y*.98 + lw.x*.19 + t*.08);
    float lnC = mix(gn(vec2(rc.x/(r0*9.) + 13.3, rc.y/r0), 1./r0), gn(vec2(rc.x/(r1*9.) + 28.1, rc.y/r1 + 15.7), 1./r1), fr2);
    float lnD = mix(gn(vec2(re.x/(r0*6.) + 61.3, re.y/(r0*1.3) + 19.), 1./r0), gn(vec2(re.x/(r1*6.) + 71.9, re.y/(r1*1.3) + 12.2), 1./r1), fr2);
    lineS += (lnC + lnD - 1.)*(1.25*cureK);
    vec2 sl = vec2(l1 - .5, l2 - .5)*.04 + vec2(a1 - .5, a2 - .5)*(.05*(1. - cal)*(1. - .6*inRide)) + fine2*(mix(.26, .035, inRide) - .155*cureK) + vec2(cur*.08*uPlan.z, 0.);
    sl = vd*dot(sl, vd) + vq*(.35*dot(sl, vq));
    sl += vd*(lineS*.15) + vq*(lineS*.02);
    vec3 nw = normalize(vec3(sl.x, 1., sl.y));
    vec3 R = reflect(rd, nw); R.y = abs(R.y) + .015; R = normalize(R);
    vec3 refl = wSky(normalize(vec3(R.x, max(R.y, .085), R.z)));             // (the sky's pale band at the horizon is steep: mirrored through the swells it lay on the water in plates; the water doubles the sky above it)
    float north = -normalize(R.xz + vec2(1e-5, 1e-5)).y;
    vec3 sdR = vec3(R.x*uPlan.z, R.y, R.z); float fwR = 1.6*px/max(dist, 1.);
    float st = wStarsAt(sdR, 104., .86, .13, fwR, 1.) + wStarsAt(sdR, 31., .93, .075, fwR, 2.6);
    refl += vec3(.86, .92, 1.)*(2.2*st*smoothstep(.02, .22, R.y)*mix(1., mix(.15, 1., smoothstep(0., .5, R.y)), smoothstep(-.34, .2, north)));
    // the smoke and the flames, doubled: the part's own mirror (what its smoke and its belt send down the mirrored ray)
    // (in the river the smoke's image is thinner: the dusk's blue and the stars stand between the lanterns' paths)
    vec4 sm = fcrSmokeMirror(wp, R)*(1. - .62*inRide); refl = refl*(1. - sm.a) + sm.rgb;
    vec4 fm = fcrFlameMirror(wp, R); refl = refl*(1. - fm.a) + fm.rgb;
    // the banks and the dark plants on them, doubled: the mirrored ray is followed 9, 26 and 60 m over the plan (the
    // plants nearest the route are doubled whole by their own part, over this)
    float hlR = max(length(R.xz), 1e-3); vec2 Rxz = R.xz/hlR, Ren = vec2(Rxz.x*uPlan.z, -Rxz.y); float tanR = R.y/hlR;
    float wA = wWat(wPlanMap(en + Ren*9.), rp + Rxz*9.), wB = wWat(wPlanMap(en + Ren*26.), rp + Rxz*26.), wC = wWat(wPlanMap(en + Ren*60.), rp + Rxz*60.);
    float wall = max(max(smoothstep(2., 8., wA)*(1. - smoothstep(21., 27., tanR*9.)), smoothstep(2., 8., wB)*(1. - smoothstep(30., 38., tanR*26.))), smoothstep(2., 8., wC)*(1. - smoothstep(33., 43., tanR*60.)));
    float bankD = smoothstep(-1.6, 0., wat)*smoothstep(.02, .5, tanR + .2);
    vec3 wallC = vec3(.012, .009, .010) + uFire*(.05*wE);
    refl = mix(refl, wallC, max(.9*wall, .7*bankD));
    // THE PODS' AMBER, DOUBLED: under the ripe plants of the banks their lanterns lie in the water as long trembling
    // amber paths (the pod map followed along the mirrored ray: a lantern hangs 6 to 36 m up, and the ripples draw
    // its image out toward the eye)
    float ap = 0.;
    for (int k = 0; k < 6; k++) {
      float tk = k == 0 ? 7. : k == 1 ? 15. : k == 2 ? 27. : k == 3 ? 45. : k == 4 ? 72. : 112., yk = tanR*tk;
      ap += wPod(en + Ren*tk)*smoothstep(3. - .2*tk, 9., yk)*(1. - smoothstep(24., 40. + .35*tk, yk))/(1. + tk*(1./45.));
    }
    refl += vec3(1., .43, .07)*(.22*min(ap, 1.6)*smoothstep(110., 260., d0));
    // the castle, doubled: its masses broken by the ripples into long pale strokes, darker than the castle itself
    vec3 lp = vec3(lc.x, wp.y, lc.y), ld = vec3(dot(R.xz, uCastA.xy), R.y, dot(R.xz, uCastA.zw));
    if (uOutK.x > .5) {
      // THE CASTLE'S OUTLINE (its part's gift): its bodies as the route sees them, the farthest first and the nearest
      // over them; each a box or a drum met by the mirrored ray (soft over the first 7 m of the ray's way inside it:
      // no stepped edge), the night's colour on the night's side and the fire's on the other, as its part gives them
      // The image is taken by a face of its own (the swells, the ten-pixel ripples and a little of the fine ones) at
      // four heights of the mirrored ray: where a ripple tips the ray over the castle the sky shows between, so the
      // image lies in long strokes across the look, soft at every edge, drawn out toward the eye, and it is darker
      // than the castle itself (0.5 of the night's colour given and 0.4 of the fire's, less where a ripple's far side faces the eye).
      if (dot(lc, lc) < 810000.) {
        // (a second ten-pixel field of the place tips the ray sideways, so that no upright edge stands straight in
        // the water; the four heights are taken a little apart sideways too, so that every edge is soft; and away
        // from the rock the ripples' far sides hold no image at all: strokes with the sky between them)
        float mid3 = mix(gn((rp + dr)/m0 + 113.7, 1./m0), gn((rp + dr)/m1 + 87.1, 1./m1), fm2) - .5;
        vec2 slc = sl*.36 + vd*(mid2*.15) + vq*(mid3*.07); vec3 Rc = reflect(rd, normalize(vec3(slc.x, 1., slc.y))); Rc.y = abs(Rc.y) + .015;
        vec3 lc0 = vec3(dot(Rc.xz, uCastA.xy), Rc.y, dot(Rc.xz, uCastA.zw)), sdc = normalize(vec3(-lc0.z, 0., lc0.x) + vec3(1e-5, 0., 0.));
        vec3 q1 = normalize(lc0 + vec3(0., -.034, 0.) + sdc*.013), q2 = normalize(lc0 + vec3(0., -.011, 0.) - sdc*.022), q3 = normalize(lc0 + vec3(0., .011, 0.) + sdc*.022), q4 = normalize(lc0 + vec3(0., .034, 0.) - sdc*.013);
        vec3 litC = uOutLit*uFire*min(uOutK.y*fcrLight(vec3(uCastC.x, 20., uCastC.y)).w, uOutK.z);
        float away = smoothstep(130., 330., length(lc)), thr = -.30 + .16*away;
        float stroke = 1. - .45*smoothstep(-.02, .2, mid2), cov = .24*smoothstep(thr, thr + .22, mid3 - .4*mid2);
        for (int k = 11; k >= 0; k--) {
          vec4 oa = uOutA[k], ob = uOutB[k];
          float h = ob.w < .5 ? 0. : ob.w < 1.5 ? boxHit(lp, q1, oa.xyz, ob.xyz) + boxHit(lp, q2, oa.xyz, ob.xyz) + boxHit(lp, q3, oa.xyz, ob.xyz) + boxHit(lp, q4, oa.xyz, ob.xyz)
            : cylHit(lp, q1, oa.xyz, ob.x, ob.y) + cylHit(lp, q2, oa.xyz, ob.x, ob.y) + cylHit(lp, q3, oa.xyz, ob.x, ob.y) + cylHit(lp, q4, oa.xyz, ob.x, ob.y);
          refl = mix(refl, mix(uOutNight*.5, litC*.4, oa.w)*stroke, h*cov);
        }
      }
    } else {
      float hit = max(boxHit(lp, ld, uBoxLo[0], uBoxHi[0]), boxHit(lp, ld, uBoxLo[1], uBoxHi[1]));
      refl = mix(refl, uStone*.62, hit*.8);
    }
    vec3 tr = uRing - wp; tr /= max(length(tr), 1e-3);
    float inGate = (1. - smoothstep(-175., -130., lp.x))*(1. - smoothstep(.25, .5, abs(lp.z)/max(-lp.x - 78., 1.)))*(1. - smoothstep(400., 640., -lp.x));   // (the ring's light lies on the water before the gate, out to some 500 m: farther off it is spent)
    // the ring's cool light: its own image, and a long path toward the eye: a column under it (by the plain mirror's
    // bearing: optics) of small glints, the ripples' facets that send its light to the eye (never a plate)
    float daz = max(dot(normalize(rd.xz + vec2(1e-5)), normalize(tr.xz + vec2(1e-5))), 0.);
    // (far down the path the glints are fewer and the wash between them is gone: a path of points, never a plate)
    float farP = smoothstep(240., 520., -lp.x), glint = smoothstep(.50 + .2*farP, .72 + .2*farP, fine2.x + .5 + .5*fine2.y);
    refl += vec3(.10, .77, .57)*1.3*inGate*(pow(max(dot(R, tr), 0.), 900.) + pow(daz, 700.)*(1. - smoothstep(.05, .75, -rd.y))*(.03*(1. - farP) + .30*glint));
    // water at night is a mirror wherever it is not looked straight down into: its own body is black-blue
    float fr = mix(wFres(dot(-rd, nw)), 1., .24);
    // the water's own body: black-blue where it is deep; by a bank and over a shoal the bed is dimly seen, with soft edges
    float depth = clamp(-wat/6., 0., 1.); depth = mix(depth, min(depth, .6), max(shal, smoothstep(-5., 4., shoal)));
    vec3 body = mix(col*.35, vec3(.011, .021, .042) + uFire*(.010*Lf.w), smoothstep(0., 1., depth));
    vec3 wcol = mix(body, refl, fr);
    // THE FIRE'S ROAD (optics): the facets of the ripples that face the fire send its light to the eye: a bright
    // narrow glitter under the wall's image and a broad soft road of orange nearer the eye
    float dR = max(dot(R, normalize(vec3(Lf.x, max(Lf.y, .12), Lf.z))), 0.);
    wcol += uFire*(wE*((.55 + .25*inRide)*pow(dR, 90.) + (.20 - .06*inRide)*pow(dR, 9.)));   // (stage E: the calm river carries the road a little stronger)
    // DRIFT on the water (by place and the world clock): husks and flecks of plume-down going with the air's ripples, each
    // a small dark body with the fire's light on its edge; a few embers among them
    float nearW = (1. - smoothstep(.09, .34, px));
    if (nearW > 0.) {
      vec2 dp = (rp + vec2(t*.21, -t*.16))/2.3, di = floor(dp); vec4 dh = textureLod(uNoise, (di + .5)/256., 0.);
      float dd = length(fract(dp) - (.25 + .5*dh.gb)), rad = (.035 + .06*dh.a);   // (stage E: fewer and smaller: flecks, never a leaf shape)
      float husk = step(.915, dh.r)*(1. - smoothstep(rad*.4, rad*.8, dd)), ember = step(.955, dh.r)*(1. - smoothstep(0., rad*.6, dd))*(.6 + .4*sin(t*(1.3 + 3.*dh.a) + dh.g*40.));
      wcol = mix(wcol, vec3(.016, .013, .012) + uFire*(.05*wE), .85*husk*nearW*(1. - step(.955, dh.r)));
      wcol += vec3(1.40, .32, .025)*(.5*ember*nearW);
    }
    // (stage E) FAR OFF on the night's side the water is lost in haze and land: no pale straight band at the horizon
    wcol = mix(wcol, vec3(.016, .017, .026) + uFire*(.012*wE), .8*smoothstep(700., 1500., dist)*(1. - smoothstep(.08, .3, Lf.w)));
    // (stage E) the river's edge is soft and wanders: a wet film over the silt, never a hard outline
    float we = wat + ((fine - .5)*1.5 + (grit - .5)*.5)*inRide, ew = .3 + px + .5*inRide;
    col = mix(col, wcol, (1. - smoothstep(-ew, ew, we)));
  }
  // THE SMOKE BEFORE THE LAND (the part's veil): flown along the wall, the ground and the water of a farther lobe lie
  // behind the smoke of a nearer one; the part's smoke is one pass on the far plane and cannot cover them
  if (d0 < 330.) { vec4 vl = fcrSmokeVeil(cameraPosition, wp); col = col*(1. - vl.a) + vl.rgb; }
  // the air between: low mist by place, the dusk's haze, the glow of the low air before the fire
  vec4 air = wAir(wp, Lf, podL); col = col*(1. - air.a) + air.rgb;
  gl_FragColor = vec4(col, 1.);
}`,Na=`
varying vec3 vDir;
void main(){
  vec3 d = normalize(vDir);
  vec3 c = wSky(d);
  float north = -normalize(d.xz + vec2(1e-5, 1e-5)).y;                // 1 toward the fire
  float cl = 0.;
  if (uSkyK.z > .5) {                                                  // high thin cloud over the fire's half of the sky, lit from below
    vec2 q = d.xz/(max(d.y, 0.) + .16);
    float n1 = fcrN3(vec3(q*1.3 + vec2(uFcrT*.002, 0.), 1.)), n2 = fcrN3(vec3(q*3.1 - vec2(0., uFcrT*.003), 4.));
    cl = smoothstep(.38, .78, n1*.65 + n2*.35)*smoothstep(-.35, .35, north)*smoothstep(0., .14, d.y);
    c = mix(c, uHor*.9 + uFire*(.035 + .11*smoothstep(-.2, 1., north)*exp(-max(d.y, 0.)*2.2)), cl*.8);
  }
  c = mix(uHazeCol, c, smoothstep(-.012, .004, d.y));                 // under the horizon: the haze of the far plain
  // STARS in three sizes: a dust of faint ones, the ordinary ones, a few great ones; crowded in places and thin in
  // others (one slow field over the dome), densest in a faint band high overhead. One in a cell of the direction,
  // never smaller than a pixel (its light thinned by the same share).
  vec3 sd = vec3(d.x*uPlan.z, d.y, d.z);
  float fw = max(length(fwidth(d)), 1e-6);
  float bd = dot(sd, vec3(.688, -.229, .688)), band = exp(-bd*bd/.030);
  float crowd = fcrN3(sd*3.3 + 5.)*.65 + fcrN3(sd*8.1 + 2.)*.35, dens = clamp(.22 + .85*band + 1.5*(crowd - .5), 0., 1.);
  float st = wStarsAt(sd, 236., mix(.95, .80, dens), .10, fw, .5) + wStarsAt(sd, 104., mix(.93, .80, dens), .12, fw, 1.) + wStarsAt(sd, 31., mix(.965, .91, dens), .065, fw, 2.6);   // (stage D: about a third as many, smaller, their brightness more unequal: a night sky, never a speckle)
  float glow = fcrAirGlow(cameraPosition, d, 1e9);
  float thin = mix(1., mix(.15, 1., smoothstep(0., .5, d.y)), smoothstep(-.34, .2, north));   // toward the fire: full at 30 degrees up, 0.15 at the horizon
  // HIGH THIN SMOKE drawn out from the fire's side over the night: it dims the stars by degrees (no edge where the
  // smoke's wall ends and the night begins) and takes a little of the fire's colour low down
  float hs = smoothstep(-.55, .45, north)*(1. - smoothstep(.12, .85, d.y))*(.35 + .65*fcrN3(vec3(d.xz*2.1/max(d.y + .3, .02) + vec2(uFcrT*.0015, 0.), 5.)));
  c = mix(c, vec3(.026, .019, .022) + uFire*(.022*exp(-max(d.y, 0.)*3.)), .42*hs*smoothstep(0., .1, d.y));
  float veil = smoothstep(-.01, .16, d.y)*thin/(1. + 14.*glow)*(1. - .85*cl)*(1. - .72*hs);    // thinned by smooth laws; never switched off
  c += vec3(.86, .92, 1.)*(2.5*st*veil) + vec3(.012, .018, .034)*(band*(.35 + crowd)*veil);    // and the band's own faint light
  float md = dot(d, uMoonDir);                                        // a full night's small pale moon
  c += uSkyK.w*(vec3(.85, .92, 1.)*1.1*smoothstep(.99990, .99996, md) + vec3(.05, .07, .10)*exp(-(1. - md)*260.));
  gl_FragColor = vec4(c, 1.);
}`;export{la as AIR_GLSL,Da as COMFORT,Oa as FACE_GLSL,q as PLAN,pt as WATER,Ht as WORLD_GLSL,ja as default,ia as isle,Pa as makePlan,Ha as rockY,ha as rockY0,Ca as trailE,sa as wander};
