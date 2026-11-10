import*as p from"three";import{mergeGeometries as Zt}from"three/addons/utils/BufferGeometryUtils.js";import*as Yt from"../kit/core.js";import{buildHero as Ta,makeStyle as qa,PALETTE as Da,STYLE_GLSL as Ee,STYLE_VERT_GLSL as wt,CLOTH_GLSL as mo,LIGHT_DIR as rt,ruledBox as j,ruledTube as ge,ruledRing as vo}from"../parts/sown-with-cloth.js";const{clamp:ie,lerp:Lt,smoothstep:y}=Yt,A=(_,oe,Y)=>new p.Vector3(_,oe,Y),C={x0:-210,x1:210,z0:-40,z1:380,rowDX:1.1,siteDZ:1.25,stalk:1.2,bladeL:.9,bladeW:.18},re=[110,0,610],lt=[-287.4,400,1072.4],Me={c:[-287.4,454,1072.4],r:22},Jt=-32*Math.PI/180,ae=[Math.sin(Jt),Math.cos(Jt)],xo=(_,oe,Y)=>{const ve=_-lt[0],K=oe-lt[2];return Y[0]=ve*ae[1]-K*ae[0],Y[1]=ve*ae[0]+K*ae[1],Y},Ze=(_,oe)=>lt[0]+_*ae[1]+oe*ae[0],Ye=(_,oe)=>lt[2]-_*ae[0]+oe*ae[1],eo=ae,go=Jt,mt=Me.r-2.2,yo=34,I={x:-260.2,z:1059.7,y:lt[1]},to=[Math.sin(25*Math.PI/180),Math.cos(25*Math.PI/180)],La=[273,343,453,523],Ke=La.map(_=>_*Math.PI/180),we=.74,Yo=400/512,Jo=[[0,0],[60,77],[140,177],[220,272],[300,360],[360,418],[410,460],[450,490],[480,507],[505,512]],Ba=[[0,0],[25,14],[50,34],[90,78],[150,152],[220,242],[300,330],[360,390],[410,438],[455,480],[490,504],[515,512]],Ia=[[0,0],[25,27],[50,68],[78,122],[92,145],[152,156],[174,190],[215,286],[270,380],[320,446],[360,484],[396,504],[430,512]],ea=[Jo,Ba,Jo,Ia];function ta(_,oe){if(oe>=_[_.length-1][0])return _[_.length-1][1];for(let Y=1;Y<_.length;Y++)if(oe<=_[Y][0]){const ve=_[Y-1],K=_[Y];return ve[1]+(K[1]-ve[1])*(oe-ve[0])/(K[0]-ve[0])}return 0}function Bt(_,oe,Y){const ve=(_-I.x)/we,K=(oe-I.z)/we,ht=Math.hypot(ve,K);let Ue=Math.atan2(K,ve);for(;Ue<Ke[0];)Ue+=Math.PI*2;for(;Ue>=Ke[0]+Math.PI*2;)Ue-=Math.PI*2;let he=0;for(;he<3&&Ue>=Ke[he+1];)he++;const xt=Ke[he],It=he===3?Ke[0]+Math.PI*2:Ke[he+1],qe=(Ue-xt)/(It-xt),gt=ta(ea[he],ht),Je=ta(ea[he+1&3],ht),yt=115*(1-Math.exp(-ht/230))*Math.pow(Math.max(Math.sin(Math.PI*qe),0),.85);return Y[0]=I.y-Yo*(gt+(Je-gt)*qe*qe*(3-2*qe)+yt),Y[1]=qe,Y[2]=he,Y}const Na=[[0,9,140],[0,9,170],[0,9,200],[0,7.2,253],[0,6.5,306],[2,6.6,337.4],[7.8,6.7,368.3],[14.9,7.9,398.9],[21.9,12.4,429.5],[29,17,460.2],[34.2,22,483.2],[36.7,32.6,506.7],[35.1,43.7,530.3],[29.6,53.4,553.3],[20.4,65.6,575],[10.8,82.2,596.5],[3.8,101.5,619.1],[-2.1,121.4,642],[-7.3,140.1,665],[-12,158.4,688.2],[-16.6,176.8,711.4],[-21.3,195.1,734.6],[-26.5,213.5,757.7],[-32.3,231.8,780.6],[-39.3,250.2,803.1],[-47.7,268.5,825.3],[-57.9,286.9,846.6],[-69.9,305.2,866.9],[-82.4,323.6,887],[-94.8,342,907.1],[-109.1,361.3,925.9],[-126.5,380.9,941.8],[-145.8,398.9,955.5],[-166,413.4,967.9],[-186.5,424.5,979.6],[-207,434.6,991.4],[-227,443.5,1004.1],[-245.9,450.3,1018.2],[-262.7,454,1034.9],[-271.5,454,1047],[-279.5,454,1059.7],[-287.4,454,1072.4]],Z={L:900,wHoist:80,wMid:110,wFar:116,wTail:84,fork:110},vt={r:Me.r+4.4,half:1.25,open:46},oa=Me.c[1]-vt.r,oo=_=>22*Math.log(1+Math.exp(_/22)),aa=403,bo=_=>{const oe=Math.max(_,0);return oa-.55*(oo(oe-80)-oo(-80)-(oo(oe-aa)-oo(-aa)))-2.2*(1-Math.exp(-oe/4))-.012*oe},ao=_=>-24.3*(Math.log(1+Math.exp((_-640)/90))-Math.log(1+Math.exp(-640/90)));function so(_,oe){const Y=ao(_);return oe.set(Ze(Y,-_),bo(_),Ye(Y,-_))}var Ga={id:"sown-with-cloth",name:"Sown with Cloth",category:"artists",placeKind:"wilderness",after:"Christo and Jeanne-Claude, 1935 to 2020 and 1935 to 2009",weirdness:.35,media:["air","open"],async build(_){const oe=_.vary||{},Y=_.quality?.detail??1,ve=ie(oe.density??1,.7,1.3),K=e=>Yt.makeRng(Yt.hashSeed(e+":"+_.seed)),ht=K("sheet")(),Ue=oe.hour==="dawn"||oe.hour==="golden"?"buff":oe.hour==="night"?"slate":oe.hour==="day"||ht<.5?"grey":ht<.75?"buff":"slate",he={grey:{card:"#DED6C4",pencil:1,lee:1,snow:228,chalk:1},buff:{card:"#E2D6BC",pencil:.92,lee:.9,snow:182,chalk:1.5},slate:{card:"#CDCFCA",pencil:.8,lee:1.3,snow:236,chalk:.85}}[Ue],xt=K("variation"),It=xt.pick(["gusty","gusty","steady","gale"]),qe=xt.pick(["clear","bank","ridges"]),gt=!!oe.rare,Je={steady:{k:.6,gap:68,lay:.45,width:9},gusty:{k:1,gap:76,lay:1,width:13},gale:{k:1.45,gap:150,lay:1,width:46}}[It],yt=Da.slice();yt[0]=he.card;const Se=qa({palette:yt}),ye=Se.uniforms;ye.uPencil.value=he.pencil;const pe=new p.Scene,Mo={value:1};pe.background=new p.Color(he.card);const ze=Yt.makePath(Na),W=1/ze.length,N=900,M=new Float32Array((N+1)*3);{const e=A(0,0,0);for(let a=0;a<=N;a++)ze.pointAt(a/N,e),M[a*3]=e.x,M[a*3+1]=e.y,M[a*3+2]=e.z}const ct=(e,a)=>{const r=ie(e,0,1)*N,c=Math.min(Math.floor(r),N-1),d=r-c,o=c*3;return a.set(M[o]+(M[o+3]-M[o])*d,M[o+1]+(M[o+4]-M[o+1])*d,M[o+2]+(M[o+5]-M[o+2])*d)},no=(e,a,r)=>{let c=1e18,d=0;for(let o=0;o<=N;o++){const n=M[o*3]-e,i=M[o*3+1]-a,u=M[o*3+2]-r,f=n*n+i*i+u*u;f<c&&(c=f,d=o)}return d/N},io=e=>{for(let a=0;a<=N;a++)if(M[a*3+2]>=e)return a/N;return 1},sa=(e,a,r)=>{let c=1e18,d=0;for(let o=0;o<=N;o+=2){const n=M[o*3]-e,i=M[o*3+2]-a,u=n*n+i*i;u<c&&(c=u,d=o)}return r[0]=Math.sqrt(c),r[1]=M[d*3+1],r};await _.yield();const zo=[];for(let e=0;e<=N;e+=3)Math.hypot(M[e*3]-re[0],M[e*3+2]-re[2])<300&&zo.push(A(M[e*3]-re[0],M[e*3+1],M[e*3+2]-re[2]));const fe=await Ta(_,{palette:yt,detail:Y,wind:It,style:Se,route:zo,ground:!1,sheet:!1,bayNearWidth:35,bayFarWidth:112});fe.object.position.set(re[0],re[1],re[2]),fe.object.updateMatrixWorld(!0),pe.add(fe.object),ye.uConePos.value.set(re[0],re[1],re[2]);const ro=fe.anchors.collar.clone().add(fe.object.position),lo=fe.anchors.gaze.clone().add(fe.object.position),ho=no(fe.anchors.bayNearCrossing.x+re[0],fe.anchors.bayNearCrossing.y,fe.anchors.bayNearCrossing.z+re[2]);let bt=0;{let e=1e18;for(let a=0;a<=N;a++){const r=Math.hypot(M[a*3]-re[0],M[a*3+2]-re[2]);r<e&&(e=r,bt=a/N)}}const Mt=no(fe.anchors.bayFarCrossing.x+re[0],fe.anchors.bayFarCrossing.y,fe.anchors.bayFarCrossing.z+re[2]),ko=e=>Lt(Lt(Z.wHoist/2,Z.wMid/2,y(40,260,e))+(Z.wFar-Z.wMid)/2*y(380,620,e),Z.wTail/2,y(680,Z.L-Z.fork,e));let Ce=1,We=1;const Nt=new Float32Array(N+1);{const e=[0,0];for(let a=0;a<=N;a++){if(xo(M[a*3],M[a*3+2],e),Nt[a]=-e[1],a<Math.round(Mt*N))continue;const r=e[0]-ao(-e[1]),c=ko(-e[1]);Ce===1?r>c&&(Ce=a/N):We===1&&r<c&&(We=a/N)}}await _.yield();const ce=_.noise,co=[0,0],_e=[0,0,0],et=26,fo=Math.PI*2,na=(e,a)=>e/fo*et+.55*ce.n2(Math.cos(e)*2.1+9,Math.sin(e)*2.1+a*.0045),Ao=e=>{const a=Math.sin((e%et+et)%et*12.9898+1.7)*43758.5453;return .3+.7*(a-Math.floor(a))},_o=(e,a)=>y(22,160,e)*Math.sqrt(Math.max(Math.sin(Math.PI*a),0)),Et=(e,a,r)=>{const c=(e-I.x)/we,d=(a-I.z)/we,o=Math.hypot(c,d),n=na(Math.atan2(d,c),o),i=Math.floor(n),u=1-Math.abs(2*(n-i)-1);return Math.min(2*Ao(i)*u*u-.6,1)*_o(o,r)},Fo=(e,a)=>a/54+.9*ce.n2(Math.cos(e)*1.7+3,Math.sin(e)*1.7+5),ia=(e,a,r)=>{const c=(e-I.x)/we,d=(a-I.z)/we,o=Math.hypot(c,d),n=Math.atan2(d,c),i=Fo(n,o),u=i-Math.floor(i),f=u<.78?u/.78:(1-u)/.22,l=o/18+1.3*ce.n2(Math.cos(n)*2.6+11,Math.sin(n)*2.6+2),t=l-Math.floor(l),h=((t<.7?t/.7:(1-t)/.3)-.5)*(2.6+5*(1-Math.sqrt(Math.max(Math.sin(Math.PI*r),0))))*y(9,30,o)*y(135,85,o);return(f-.5)*(6+14*(1-Math.sqrt(Math.max(Math.sin(Math.PI*r),0))))*y(28,80,o)*y(520,420,o)+h};function J(e,a){const r=y(1900,3300,a),c=e-300*r*r,d=c<0?-1:1,o=(450+38*ce.n2(a*.0016,d*3.1))*(1-.96*r*r),n=Math.abs(c)-o;let i=0;if(n>-90){const f=(190+70*ce.n2(a*.0011+5,d*7.7))*(1+2.4*r),l=n/330,t=y(0,1,l),s=y(1,1.95,l),h=ie(.3+.34*ce.fbm2(e*.0013+9,a*.0013,3)+.2*y(1.9,4.5,l),.1,.95);i=f*t*(1-s*(1-h))*(1+.24*ce.fbm2(e*.006,a*.006,3))*(1+.17*ce.n2(a*.0085+d*11,e*.0016+4))+13*y(-90,40,n)*(1-t)*(.6+.4*ce.n2(a*.02,d))}i*=y(2400,2150,Math.abs(e))*y(-1500,-1300,a)*y(3600,3350,a),xo(e,a,co);const u=-co[1];if(i>60&&u>60&&u<Z.L+60){const f=Math.abs(co[0]-ao(u));f<260&&(i=Math.min(i,bo(u)-40-80*y(60,260,u)+f*.25))}return Math.hypot(e-I.x,a-I.z)<640*we&&(Bt(e,a,_e),i=Math.max(i,_e[0]+Yo*(12*Et(e,a,_e[1])+ia(e,a,_e[1]))+2.5*ce.n2(e*.021,a*.021)*y(60,200,I.y-_e[0]))),Math.max(i,0)}const ra=(e,a)=>y(2380,2100,Math.abs(e))*y(-1500,-1280,a)*y(3590,3300,a);function Po(e,a,r,c,d,o){const n=ra(e,r),i=y(4,90,a),u=y(-.25,.55,ce.fbm2(e*.0042+3,r*.0042,3)),f=y(-225,-205,e)*y(225,205,e)*y(-55,-35,r)*y(395,375,r),l=n*(.42+.3*u*(1-.7*f)+.2*i),t=n*.42*y(.3,.75,ce.fbm2(e*.0021+40,r*.0021,2))*(.25+.75*i),s=y(.62,.02,c)*y(.02,.2,d)*n;let h=0;a>12&&d>.02&&(h=y(1.5,9,(J(e-45,r)+J(e+45,r)+J(e,r-45)+J(e,r+45))/4-J(e,r))*n);const m=a>6?y(.06,.3,(J(e+150,r)-J(e-150,r))/300)*n*(.45+.55*u):0;o[0]=ie(l+.2*d+.3*s-.2*y(.5,.95,c)*(1-m)+.3*h+.25*m,0,.85),o[1]=ie(t*(.4+.6*y(.6,-.2,c))+.95*s*s+1*h+.8*m*y(.75,.3,c),0,1);const w=a+34*ce.fbm2(e*.013,r*.013,2);return o[2]=y(he.snow,he.snow+70,w)*.9*Math.min(he.chalk,1.15)*y(-.15,.55,c)*y(.75,.3,d),o}function la(e,a,r,c,d,o){Bt(e,r,_e);const n=Et(e,r,_e[1]),i=y(0,70,a);let u=y(he.snow-10,he.snow+40,a-45*Math.max(n,0)-170*Math.min(n,0)+22*ce.n2(e*.011,r*.011));u*=1-.92*y(.34,.66,n)*y(6,30,I.y-a);const f=(e-I.x)/we,l=(r-I.z)/we,t=Math.hypot(f,l),s=Math.atan2(l,f),h=Fo(s,t),m=h-Math.floor(h),w=t/18+1.3*ce.n2(Math.cos(s)*2.6+11,Math.sin(s)*2.6+2),g=w-Math.floor(w),v=Math.max(y(.74,.84,m)*y(28,80,t),y(.66,.78,g)*y(9,30,t)*y(135,85,t))*y(.25,.6,ce.n2(e*.045+7,r*.045));u*=1-.9*v*y(6,24,I.y-a),u*=.8+.2*y(-.06,.2,c);const x=1-u,z=y(.34,-.12,c),P=y(.44,.64,.5+.5*ce.fbm2(e*.0045+11,r*.0045+a*.002,2)),B=y(.78,.4,c)*y(.2,.7,((e-I.x)*to[0]+(r-I.z)*to[1])/Math.max(Math.hypot(e-I.x,r-I.z),1));o[0]=ie(i*(x*(.5+.26*z-.3*y(.5,.9,c))+u*(.02+.2*z+.3*B))+(1-i)*.45,0,.8),o[1]=ie(i*he.lee*(x*(.12+.3*z+.75*P*(.35+.65*z)+.3*z*y(.05,-.3,n))),0,.95),o[2]=u*(.78+.22*y(-.04,.3,c))*(.95-.35*B)*Math.min(he.chalk,1.15);const $=u*i*y(.3,-.25,c);o[0]=ie(o[0]+.3*$,0,.8),o[1]=ie(o[1]+.6*he.lee*$*(.4+.6*P),0,.95),o[2]*=1-.7*$;const D=y(0,.5,((e-I.x)*to[0]+(r-I.z)*to[1])/Math.max(Math.hypot(e-I.x,r-I.z),1));if(D>0&&t>20){const Re=Math.cos(s+.03),Ie=Math.sin(s+.03),Ae=Math.cos(s-.03),Ne=Math.sin(s-.03),ot=t*we,$t=I.x+Re*ot,Ot=I.z+Ie*ot,Ht=I.x+Ae*ot,Kt=I.z+Ne*ot;Bt($t,Ot,_e);const Ut=Et($t,Ot,_e[1]);Bt(Ht,Kt,_e);const jt=Et(Ht,Kt,_e[1]),Xt=Math.hypot(rt.x,rt.z),Rt=-(Ut-jt)*2*ie(4*(-Math.sin(s)*rt.x+Math.cos(s)*rt.z)/Xt,-1,1),Le=y(.03,.32,-Rt)*D*i*y(30,100,t);o[0]=ie(o[0]+.5*Le,0,.85),o[1]=ie(o[1]+.85*he.lee*Le*(.55+.45*P),0,.95),o[2]*=(1-.95*Le)*(1-D*.72*(1-y(.03,.3,Rt)))}return o}const ha=Se.cardMaterial({contact:1,lee:he.lee,bedTone:0,smudge:.34,mass:1}),ca=Se.cardMaterial({contact:1,lee:he.lee,bedTone:0,mass:2});ye.uField.value.set((C.x1-C.x0)/2,C.z0,C.z1,1),ye.uBannerC.value.set(56,Z.L,oa,1),ye.uBannerO.value.set(lt[0],lt[2],-ae[0],-ae[1]);const Wt=[0,0,0];async function So(e,a,r,c,d,o){const n=e.length/3,i=new Float32Array(n*3),u=new Float32Array(n),f=new p.BufferGeometry;f.setAttribute("position",new p.BufferAttribute(e,3)),f.setIndex(a),await _.yield(),f.computeVertexNormals(),await _.yield();const l=f.attributes.normal.array;for(let s=0;s<n;s++){const h=l[s*3]*rt.x+l[s*3+1]*rt.y+l[s*3+2]*rt.z;r(e[s*3],e[s*3+1],e[s*3+2],h,1-l[s*3+1],Wt),i[s*3]=Wt[0],i[s*3+1]=Wt[1],i[s*3+2]=Wt[2],o&&(u[s]=o(e[s*3],e[s*3+1],e[s*3+2])),(s&1023)===1023&&await _.yield()}f.setAttribute("aTone",new p.BufferAttribute(i,3)),f.setAttribute("aBed",new p.BufferAttribute(u,1));const t=new p.Mesh(f,c);return t.frustumCulled=!1,pe.add(t,Se.outlineOf(t,d)),t}let zt=null,kt=null;const fa=(e,a)=>{let r=0,c=0;for(;r<zt.length-2&&zt[r+1]<e;)r++;for(;c<kt.length-2&&kt[c+1]<a;)c++;const d=zt[r],o=zt[r+1],n=kt[c],i=kt[c+1],u=ie((e-d)/(o-d),0,1),f=ie((a-n)/(i-n),0,1),l=J(d,n),t=J(o,n),s=J(d,i),h=J(o,i);return u+f<=1?l+u*(t-l)+f*(s-l):h+(1-u)*(s-h)+(1-f)*(t-h)};{const e=[-2400,-2180,-1980,-1790,-1610,-1450,-1310,-1200],a=[-1500,-1320,-1150,-990,-840];for(let n=0;n<=54;n++)e.push(-1100+2200*n/54);e.push(1200,1310,1450,1610,1790,1980,2180,2400);for(let n=0;n<=79;n++)a.push(n<=28?-700+1200*n/28:n<=68?500+1250*(n-28)/40:1750+350*(n-68)/11);a.push(2160,2230,2310,2400,2500,2620,2760,2920,3100,3300,3600),zt=e,kt=a;const r=e.length-1,c=a.length-1,d=new Float32Array((r+1)*(c+1)*3),o=[];for(let n=0;n<=c;n++){for(let i=0;i<=r;i++){const u=e[i],f=a[n],l=(n*(r+1)+i)*3,t=Math.hypot(u-I.x,f-I.z);d[l]=u,d[l+1]=J(u,f)-46*y(590*we,545*we,t),d[l+2]=f}(n&7)===7&&await _.yield()}for(let n=0;n<c;n++)for(let i=0;i<r;i++){const u=n*(r+1)+i,f=u+1,l=u+r+1,t=l+1;o.push(u,l,f,f,l,t)}await So(d,o,Po,ha,2.4)}await _.yield();{const r=600*we,c=new Float32Array(11701*3),d=[];c[0]=I.x,c[1]=J(I.x,I.z),c[2]=I.z;for(let o=1;o<=65;o++){const n=o>64?r:r*Math.pow(o/64,1.5);for(let i=0;i<180;i++){const u=i/180*Math.PI*2,f=I.x+Math.cos(u)*n,l=I.z+Math.sin(u)*n,t=(1+(o-1)*180+i)*3;c[t]=f,c[t+1]=J(f,l)-(o>64?44:0),c[t+2]=l}(o&3)===3&&await _.yield()}for(let o=0;o<180;o++)d.push(0,1+(o+1)%180,1+o);for(let o=0;o<64;o++)for(let n=0;n<180;n++){const i=1+o*180+n,u=1+o*180+(n+1)%180,f=i+180,l=u+180;d.push(i,u,f,u,l,f)}await So(c,d,(o,n,i,u,f,l)=>{const t=y(560*we,470*we,Math.hypot(o-I.x,i-I.z));if(la(o,n,i,u,f,l),t<1){const s=l[0],h=l[1],m=l[2];Po(o,n,i,u,f,l),l[0]+=(s-l[0])*t,l[1]+=(h-l[1])*t,l[2]+=(m-l[2])*t}return l},ca,3,(o,n,i)=>y(16,90,n)*y(575*we,500*we,Math.hypot(o-I.x,i-I.z)))}await _.yield();const uo=`
uniform vec4 uGust;      // gap between fronts (m), width of a front (m), how far it lays the blades 0..1, speed (m/s)
uniform vec4 uDevil;     // the dust devil: x, z, radius, strength (0 = none)
uniform vec2 uDevilDir;  // its heading in plan
const vec2 SW_WD = vec2(${(-ae[0]).toFixed(4)}, ${(-ae[1]).toFixed(4)});   // the wind in plan: toward astern and starboard
float fl_h(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float fl_n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(fl_h(i), fl_h(i + vec2(1., 0.)), f.x), mix(fl_h(i + vec2(0., 1.)), fl_h(i + vec2(1., 1.)), f.x), f.y); }
// how far the cloth at this place is laid over, 0..1: fronts crossing the rows on the slant, down the wind; a restless
// ground swell; the devil's spiral
float sw_gustLay(vec2 xz, float t){
  float up = -dot(xz, SW_WD), across = dot(xz, vec2(SW_WD.y, -SW_WD.x));
  float ph = (up + uGust.w * t + 34. * (fl_n(xz * .012 + vec2(3.1, t * .02)) - .5)) / max(uGust.x, 1.);
  float id = floor(ph), d = (fract(ph) - .5) * uGust.x;
  float g = (1. - smoothstep(uGust.y * .25, uGust.y, abs(d))) * (.65 + .35 * fl_h(vec2(id, 7.)));
  g *= .5 + .5 * smoothstep(.15, .55, fl_n(vec2(across * .013 + id * 5., id)));
  float base = .07 + .16 * fl_n(xz * .045 + vec2(0., t * .7));
  vec2 q = xz - uDevil.xy;
  float r = length(q);
  float ang = (r > 1e-3) ? atan(q.y, q.x) : 0.;
  float sp = (1. - smoothstep(uDevil.z * .25, uDevil.z, r)) * (.5 + .5 * sin(ang * 2. + r * .5 - t * 2.6));
  float along = dot(q, -uDevilDir), lat = dot(q, vec2(-uDevilDir.y, uDevilDir.x));
  float tr = step(0., along) * (1. - smoothstep(20., 120., along)) * (1. - smoothstep(3., 9., abs(lat - 11. * sin(along * .16))));
  return clamp(max(g * uGust.z + base, uDevil.w * max(sp, tr)), 0., 1.);
}
// R6: WHAT IS SOWN, by place (1 where cloth stands). The field is not one grid with a ruled edge: its sides fray out
// drill pass by drill pass (the outer passes are sown shorter at both ends, each by its own measure), the end toward
// the cone ends pass by pass, one drill in twenty-seven is left bare as a lane, two tracks cross the drills on the
// slant and a headland strip crosses them near the cone's end. soft = the half width over which an edge is softened:
// 0 for a blade's own site, the pixel's footprint on the ground for the far strips (so a lane a pixel cannot hold
// leaves its share of tone and does not crawl)
uniform vec4 uFieldR;    // the sown plot: half its width, z0, z1, the x of its middle
uniform float uFan;      // 1: a plot sown as a wedge, each pass shorter than the last
float fl_sown(vec2 xz, float soft){
  float row = floor(xz.x / ${C.rowDX.toFixed(3)} + .5), pass = floor(row / 9.);
  float px0 = (pass * 9. + 4.) * ${C.rowDX.toFixed(3)} - uFieldR.w;
  float side = uFieldR.x - abs(px0);
  float outK = 1. - smoothstep(0., .285 * uFieldR.x, side), fl = uFieldR.z - uFieldR.y;        // (the field: its outer 60 m; by the plot's own size)
  float zA = uFieldR.y + outK * fl * (.07 + .5 * fl_h(vec2(pass, 21.)));
  float zB = uFieldR.z - 3. - .095 * fl * fl_n(vec2(pass * .31, 8.3)) - outK * fl * (.07 + .45 * fl_h(vec2(pass, 37.)));
  zB -= uFan * .78 * (uFieldR.z - uFieldR.y) * clamp(.5 + .5 * px0 / max(uFieldR.x, 1.), 0., 1.);
  float k = smoothstep(zA - soft, zA + soft + .02, xz.y) * (1. - smoothstep(zB - soft, zB + soft + .02, xz.y)) * step(abs(px0), uFieldR.x);
  float lane = step(abs(mod(row, 27.) - 13.), .5) * (1. - smoothstep(1.2, 3.6, soft));
  float t1 = abs(dot(xz - vec2(-60., 120.), vec2(-.330, .944))), t2 = abs(dot(xz - vec2(40., 250.), vec2(.447, .894)));
  float trk = 1. - smoothstep(1.5 - soft, 1.5 + soft + .02, min(t1, t2));
  float hd = 1. - smoothstep(1.7 - soft, 1.7 + soft + .02, abs(xz.y - (uFieldR.z - 62.)));
  return k * (1. - lane) * (1. - .94 * max(trk, hd));
}
// the window of real blades about the route's own point: 1 inside, 0 outside, a hand-over band between
uniform vec3 uRouteF;
uniform vec4 uWinF;      // half width, metres behind, metres ahead, hand-over band
float sw_window(vec2 xz){
  float ex = uWinF.x - abs(xz.x - uRouteF.x), eb = xz.y - (uRouteF.z - uWinF.y), ef = (uRouteF.z + uWinF.z) - xz.y;
  return smoothstep(0., uWinF.w, ex) * smoothstep(0., uWinF.w, ef) * smoothstep(0., min(uWinF.w, 8.), eb);
}`,tt={uGust:{value:new p.Vector4(Je.gap,Je.width,Je.lay,14)},uDevil:{value:new p.Vector4(0,-900,30,0)},uDevilDir:{value:new p.Vector2(0,1)},uRouteF:ye.uRoute,uWinF:{value:new p.Vector4(110,10,180,20)},uFieldR:{value:new p.Vector4((C.x1-C.x0)/2,C.z0,C.z1,0)},uFan:{value:0}},da=`
${wt}
${uo}
uniform float uTime, uWind;
uniform vec4 uLat;       // sites across, sites along, metres ahead of the route point of the lattice's centre, hand-over band
uniform vec4 uNearWin;   // the near set's place: half width, metres behind, metres ahead; w = 1 when this mesh IS the near set
attribute vec2 iSite;
varying vec3 vP;
varying vec4 vCl;        // across (m), along (m), tone, part (0 blade, 1 stalk, 2 clip)
varying vec2 vMisc;      // seed, s
void main(){
  const float DX = ${C.rowDX.toFixed(3)}, DZ = ${C.siteDZ.toFixed(3)};
  float part = position.z, s = position.y;
  float ix = iSite.x + uLat.x * floor((uRouteF.x / DX - iSite.x) / uLat.x + .5);
  float iz = iSite.y + uLat.y * floor(((uRouteF.z + uLat.z) / DZ - iSite.y) / uLat.y + .5);
  float h1 = fl_h(vec2(ix, iz)), h2 = fl_h(vec2(iz + 17., ix + 5.));
  vec2 nom = vec2(ix * DX, iz * DZ);
  vec2 site = nom + vec2(0., (h1 - .5) * .5);
  float inF = step(abs(nom.x), uFieldR.x - .4) * step(uFieldR.y + .4, nom.y) * step(nom.y, uFieldR.z - .4) * step(.5, fl_sown(nom, 0.));
  float ex = uLat.x * DX * .5 - abs(nom.x - uRouteF.x);
  float zc = uRouteF.z + uLat.z, hl = uLat.y * DZ * .5;
  float wf = smoothstep(0., uLat.w, ex) * smoothstep(0., uLat.w, zc + hl - nom.y) * smoothstep(0., min(uLat.w, 8.), nom.y - (zc - hl));
  float zr = nom.y - uRouteF.z;
  float inN = step(abs(nom.x - uRouteF.x), uNearWin.x) * step(uNearWin.y, zr) * step(zr, uNearWin.z);
  float sc = inF * wf * mix(1. - inN, inN, uNearWin.w);
  float lay = sw_gustLay(site, uTime);
  vec3 hoist = vec3(site.x, ${C.stalk.toFixed(2)}, site.y);
  vec4 mvS = viewMatrix * vec4(hoist, 1.);
  float px = sw_px(-mvS.z);
  float droop = mix(mix(1.02, .5, clamp(uWind - .4, 0., 1.)), .05, lay) + .16 * (h2 - .5);
  vec3 dir = vec3(SW_WD.x * cos(droop), -sin(droop), SW_WD.y * cos(droop)), nrm = vec3(SW_WD.x * sin(droop), cos(droop), SW_WD.y * sin(droop));
  vec3 wide = vec3(-SW_WD.y, 0., SW_WD.x);
  float ph = h1 * 40.;
  float fa = (.05 + .06 * uWind) * (1. - .45 * lay) * (1. - .8 * smoothstep(.035, .085, px));
  float wob = sin(s * 5.5 - uTime * (13. + 6. * h2) + ph);
  vec3 p; float tone = 0.;
  if (part < .5) {
    float w = max(${C.bladeW.toFixed(2)}, 2.3 * px);
    p = hoist + dir * (s * ${C.bladeL.toFixed(2)} * sc) + nrm * (fa * s * wob * sc) + wide * ((position.x * w + sin(uTime * 2.3 + ph) * .14 * s) * sc);
    p.y = max(p.y, .06);
    tone = .36 + .5 * lay + .1 * wob * s * (1. - lay) + (h2 - .5) * .1;
  } else if (part < 1.5) {
    float nearK = 1. - smoothstep(55., 95., length(site - uRouteF.xz));
    p = vec3(site.x + position.x * max(.034, 1.5 * px) * sc * nearK, s * ${C.stalk.toFixed(2)} * sc * nearK, site.y);
  } else {
    p = hoist + vec3(position.x * .075 * sc, (s - .5) * .13 * sc, -.012);
  }
  vP = p;
  vCl = vec4(position.x * ${C.bladeW.toFixed(2)} + h1 * 3., s * ${C.bladeL.toFixed(2)} + h2 * 5., tone, part);
  vMisc = vec2(h1, position.x);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,ua=`
${Ee}
${mo}
uniform vec4 uNearWin;
varying vec3 vP;
varying vec4 vCl;
varying vec2 vMisc;
void main(){
  float fw = sw_foot(vP);
  vec3 col;
  if (vCl.w < .5) {
    float hem = (.5 - abs(vMisc.y)) * ${C.bladeW.toFixed(2)};
    col = sw_crayon(vCl.xy, clamp(vCl.z, 0., 1.), 99., vP, fw, vMisc.x, 0., 0.);
    // the near blades carry a pencil hem line
    float hl = (1. - smoothstep(max(.006, .7 * fw), max(.014, 1.6 * fw), abs(hem - .016))) * smoothstep(.02, .008, fw) * uNearWin.w;
    col = mix(col, mix(uGraphite, uCharcoal, .5), hl * .7);
  } else if (vCl.w < 1.5) {
    col = mix(uCard, mix(uGraphite, uCharcoal, .35), .92);
  } else {
    col = mix(uGraphite, uCharcoal, .8);
  }
  gl_FragColor = vec4(col, 1.);
}`,Co=(e,a)=>new p.ShaderMaterial({uniforms:{...Se.clothUniforms("turquoise"),...tt,uLat:{value:new p.Vector4(e[0],e[1],e[2],e[3])},uNearWin:{value:new p.Vector4(26.5,-8,88,a)}},vertexShader:da,fragmentShader:ua,side:p.DoubleSide,fog:!1});function Ro(e,a,r,c){const d=[],o=[],n=(f,l)=>{const t=d.length/3;for(let s=0;s<=f;s++)d.push(-.5,s/f,l,.5,s/f,l);for(let s=0;s<f;s++){const h=t+s*2;o.push(h,h+1,h+2,h+1,h+3,h+2)}};n(1,1),n(r,0),c&&n(1,2);const i=new p.InstancedBufferGeometry;i.setAttribute("position",new p.Float32BufferAttribute(d,3)),i.setIndex(o);const u=new Float32Array(e*a*2);for(let f=0,l=0;l<a;l++)for(let t=0;t<e;t++,f++)u[f*2]=t,u[f*2+1]=l;return i.setAttribute("iSite",new p.InstancedBufferAttribute(u,2)),i.instanceCount=e*a,i}const po=Math.round(72*ie(Y,.6,1)),To=po*C.siteDZ;tt.uWinF.value.set(110,10,To-10,20);const qo=new p.Mesh(Ro(200,po,1,!1),Co([200,po,To/2-10,20],0));await _.yield();const Do=new p.Mesh(Ro(50,80,3,!0),Co([50,80,40,.001],1));qo.frustumCulled=!1,Do.frustumCulled=!1,pe.add(qo,Do),await _.yield();const Lo=e=>`
${Ee}
${mo}
${uo}
varying vec3 vP;
void main(){
  float fw = sw_foot(vP);
  float fx = max(fwidth(vP.x), 1e-5), fz = max(fwidth(vP.z), 1e-5);
  // THE FOOTPRINT FILTER (S6): where the real blades stand the strip is not drawn while a pixel can hold a blade (its
  // footprint across the rows under 6 cm: a blade is 18 cm wide). Past that each row's strip comes in under its own
  // blades, a line at first, widening as the footprint grows, until at 13 cm (a blade a pixel and a half wide) the
  // rows have given way to the even drawn tone of the cloth with the pencil row lines over it; the blades then stand
  // in their own colour and no longer sparkle against the ground
  float rowIn = smoothstep(.06, .13, fx);
  ${e?"":`if (sw_window(vP.xz) > .985 && abs(vP.x / ${C.rowDX.toFixed(3)} - floor(vP.x / ${C.rowDX.toFixed(3)} + .5)) > .5 * rowIn) discard;`}
  float lay = sw_gustLay(vP.xz, uTime);
  float row = floor(vP.x / ${C.rowDX.toFixed(3)} + .5);
  float dist = length(vP.xz - uRouteF.xz);
  // THE DRILL TO THE VANISHING POINT (M4): the bare strip between rows is drawn while a pixel can hold it; where it cannot,
  // every fourth strip is drawn instead, then every sixteenth, then every sixty-fourth, each never under a pixel wide, so
  // the far field is rows running to their vanishing point and never one flat band (chosen by the pixel's footprint)
  // (ON AN OUT-PLOT, the eleventh review: a bare strip is drawn only while the cloth between two of them is some five
  // pixels and more, so from the air a plot is saturated crayon in the exact tones, ruled by a few strips of card, and
  // never a lattice of cloth and card mixed in every pixel)
  float lv = clamp(log2(max(fx, 1e-5) * ${e?"10.":"3.4"} / ${C.rowDX.toFixed(3)}) * .5, 0., 2.999);
  float l0 = floor(lv), lf = lv - l0, n0 = exp2(2. * l0), n1 = n0 * 4.;
  float q = vP.x / ${C.rowDX.toFixed(3)} - .5;
  float d0 = abs(q - floor(q / n0 + .5) * n0) * ${C.rowDX.toFixed(3)}, d1 = abs(q - floor(q / n1 + .5) * n1) * ${C.rowDX.toFixed(3)};
  float hg = max(mix(.33, .2, smoothstep(50., 200., dist)), ${e?".8":".62"} * fx);
  float g0 = 1. - smoothstep(hg - .5 * fx, hg + .5 * fx, d0), g1 = 1. - smoothstep(hg - .5 * fx, hg + .5 * fx, d1);
  float cover = 1. - max(g0 * (1. - smoothstep(${e?".1, .55":".5, 1."}, lf)), g1 * smoothstep(0., .5, lf)) * (1. - .45 * smoothstep(1.5, 3., lv));
  // THE FAR END IS STILL BEING SOWN (Q6): behind the entry the cloth ends drill pass by drill pass (nine rows a pass), each
  // at its own place, so from the summit the field's far end is a comb of strips running out into the drawn floor
  float pass = floor(row / 9.);
  float farE = smoothstep(1.5, 6., fx);                         // a pixel wider than a pass: the comb is its even tone
  float endL = min(1., (uFieldR.z - uFieldR.y) / 420.);
  float endZ = uFieldR.y + 6. + endL * (150. * fl_n(vec2(pass * .23, 4.7)) * fl_n(vec2(pass * .23, 4.7)) + 34. * mix(fl_h(vec2(pass, 5.)), .5, farE));
  float sownK = smoothstep(endZ - 17. * farE, endZ + max(2. * fz, 1.5) + 17. * farE, vP.z) * fl_sown(vP.xz, .7 * max(fx, fz));
  ${e?"":"if (sownK < (sw_window(vP.xz) > .985 ? .5 : .05)) discard;      // nothing is drawn where nothing is sown: the land itself shows (no flat grey floor at the unsown ends)"}
  cover *= sownK;
  float bz = fract(vP.z / ${C.siteDZ.toFixed(3)} + fl_h(vec2(row, 3.)));
  float rip = (bz - .5) * .34 * smoothstep(2.5, 5., ${C.siteDZ.toFixed(3)} / fz);
  float v = clamp(.4 + .46 * lay + rip + (fl_h(vec2(row, 9.)) - .5) * .06, 0., 1.);
  // far off, and from above, the field keeps its mid tone and the gust fronts cross it as pale bands at any wind's strength
  v = mix(v, ${e?".31":".36"} + .6 * clamp(lay / (.3 + .7 * uGust.z), 0., 1.), smoothstep(1.5, 5., fz));
  ${e?`// seen from the air every row of an out-plot still flutters: a ripple runs down each row by the world's clock, row out
  // of step with row, turning stretches of it from the mid tone to the shade tone and back (left out where a pixel
  // could not hold it)
  v += .085 * sin(vP.z * .35 - uTime * 3.2 + fl_h(vec2(row, 13.)) * 6.2832) * (1. - smoothstep(1.4, 3., fz));`:""}
  // UNDER THE BANNER (the eleventh review: the cloth overhead has weight) the sown cloth lies in the banner's contact
  // shade: its tones go down to the shade tone and the land's own charcoal strokes run on across it (the same strokes,
  // by the same rule and place as in the card material of the part)
  float shB = uBannerC.w * sw_bannerContact(vP);
  float tB = shB * (mix(.4, .72, 1. - smoothstep(60., 200., sw_bannerGap)) + .28 * sw_vn2(vP.xz * .013 + 4.));
  v -= .3 * smoothstep(.15, .5, tB);
  vec3 cloth = sw_crayon(vP.xz, clamp(v, 0., 1.), 99., vP, fw, fl_h(vec2(row, 1.)), 0., 0.);
  {
    float cB = dot(vP, vec3(.5, 0., -.866)) + 2.2 * (sw_vn2(vP.xz * .021) - .5) + 1.7, aB = dot(vP, vec3(.866, 0., .5)) + .35 * vP.y + 9.;
    float cT = tB + .14 * (sw_vn2(vP.xz * .028 + vP.y * .02) - .5) + .09 * (sw_vn2(vP.xz * .11 + vP.y * .07 + 5.) - .5);
    float fcB = max(fwidth(cB), 1e-5), lB = log2(fcB * 9.), iB = floor(lB);
    vec2 laid = mix(sw_laidMass(cB, aB, fcB, exp2(iB), cT, 0.), sw_laidMass(cB, aB, fcB, exp2(iB + 1.), cT, 0.), smoothstep(.25, .75, lB - iB));
    cloth = mix(cloth, uCharcoal, .66 * max(laid.x * .9, laid.y) * step(.02, shB));
  }
  ${e?`// an out-plot is cloth on the land: where nothing is sown the land itself shows; its drill lanes (every twenty-seventh
  // row, inside the sowing) are pressed in charcoal
  float laneP = step(abs(mod(row, 27.) - 13.), .5) * step(.5, fl_sown(vP.xz + vec2(2.2, 0.), 0.) * fl_sown(vP.xz - vec2(2.2, 0.), 0.)) * (1. - smoothstep(1.2, 2.4, fx));
  if (cover < .05 && laneP < .5) discard;
  vec3 ground = mix(sw_draw(vP, fw, .1, 0., 0.), sw_draw(vP, fw, .25, .7, 0.), laneP);`:"vec3 ground = sw_draw(vP, fw, .25, .6, 0.);"}
  gl_FragColor = vec4(mix(ground, cloth, cover), 1.);
}`;{const e=Math.ceil((C.x0+.4)/C.rowDX),a=Math.floor((C.x1-.4)/C.rowDX),r=a-e+1,c=8,d=new Float32Array((r+1)*(c+1)*3),o=[];for(let u=0;u<=r;u++)for(let f=0;f<=c;f++){const l=(u*(c+1)+f)*3;d[l]=(e+u-.5)*C.rowDX,d[l+1]=.92,d[l+2]=C.z0+.4+(C.z1-C.z0-.8)*f/c}for(let u=0;u<r;u++)for(let f=0;f<c;f++){const l=u*(c+1)+f,t=l+1,s=l+c+1,h=s+1;o.push(l,t,s,t,h,s)}const n=new p.BufferGeometry;n.setAttribute("position",new p.BufferAttribute(d,3)),n.setIndex(o);const i=new p.Mesh(n,new p.ShaderMaterial({uniforms:{...Se.clothUniforms("turquoise"),...tt},vertexShader:"varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }",fragmentShader:Lo(!1),side:p.DoubleSide,fog:!1}));i.frustumCulled=!1,pe.add(i);for(const[u,f,l,t,s]of[[-330,-110,430,650,0],[190,330,840,1010,0],[215,345,1050,1250,1],[250,390,130,360,0],[-800,-650,690,840,0],[-760,-630,530,680,1],[-200,-20,419,458,0],[-20,9,419,446,0],[-120,120,1420,1680,0]]){const h=Math.round((f-u)/5.5),m=Math.round((t-l)/5.5),w=new Float32Array((h+1)*(m+1)*3),g=[];for(let z=0;z<=h;z++)for(let P=0;P<=m;P++){const B=(z*(m+1)+P)*3,$=u+(f-u)*z/h,D=l+(t-l)*P/m;w[B]=$,w[B+1]=fa($,D)+.92,w[B+2]=D}for(let z=0;z<h;z++)for(let P=0;P<m;P++){const B=z*(m+1)+P,$=B+1,D=B+m+1,ke=D+1;g.push(B,$,D,$,ke,D)}const v=new p.BufferGeometry;v.setAttribute("position",new p.BufferAttribute(w,3)),v.setIndex(g);const x=new p.Mesh(v,new p.ShaderMaterial({uniforms:{...Se.clothUniforms("turquoise"),...tt,uFieldR:{value:new p.Vector4((f-u)/2,l,t,(u+f)/2)},uFan:{value:s}},vertexShader:"varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }",fragmentShader:Lo(!0),side:p.DoubleSide,fog:!1}));x.frustumCulled=!1,pe.add(x)}}await _.yield();const U=(e,a,r,c=0)=>new p.Matrix4().makeRotationY(c).setPosition(e,a,r),Bo=Se.ruledMaterial({chalk:.3,side:p.DoubleSide}),Ge=[];{const e=C.x1-C.x0,a=C.z1-C.z0,r=(C.z0+C.z1)/2;for(const c of[0,5.2,7.3]){const d=c?.16:.24,o=e/2+c,n=a/2+c,i=c?0:3.5;Ge.push(j(2*o+2*i,.05,d,U(0,.03,r-n)),j(2*o+2*i,.05,d,U(0,.03,r+n))),Ge.push(j(d,.05,2*n+2*i,U(-o,.03,r)),j(d,.05,2*n+2*i,U(o,.03,r)))}for(const c of[-1,1])for(const d of[C.z0,C.z1])Ge.push(j(.32,2.7,.32,U(c*(e/2+.9),1.35,d+(d>r?.9:-.9))),j(.5,.1,.5,U(c*(e/2+.9),2.75,d+(d>r?.9:-.9))))}const Be=[];for(let e=30;e<C.z1;e+=60)for(const a of[-1,1]){const r=a*8;Ge.push(ge(A(r,0,e),A(r,7,e),.09,7,.06),j(.9,.08,.9,U(r,.05,e)),j(1.5,.07,.07,U(r,5.6,e))),Ge.push(ge(A(r-.75,5.6,e),A(r-.75,6.05,e),.035,5),j(.5,.2,.03,U(r-.75,6.1,e-.25,Math.PI/2)));for(const c of[[.9,.7],[-.9,-.7]])Ge.push(ge(A(r,3.4,e),A(r+c[0]*2.2,0,e+c[1]*2.2),.02,4));Be.push(r,7,e)}const pa=(()=>{const e=[];for(let a=0;a<3;a++){const r=a/3*Math.PI*2,c=Math.cos(r),d=Math.sin(r);e.push(ge(A(0,0,0),A(c*.55,0,d*.55),.022,4),j(.2,.2,.2,U(c*.62,0,d*.62,-r)))}return e.push(ge(A(0,-.12,0),A(0,.1,0),.05,5)),Zt(e,!1)})(),At=new p.InstancedMesh(pa,Bo,Be.length/3);At.frustumCulled=!1;const Io=new p.Matrix4;for(let e=0;e<Be.length/3;e++)At.setMatrixAt(e,Io.makeRotationY(e).setPosition(Be[e*3],Be[e*3+1]+.12,Be[e*3+2]));pe.add(At);const wo=[];{const e=(o,n,i,u)=>{const f=[],l=[],t=[],s=[],h=[];for(let w=0;w<=i;w++){const g=w/i*Math.PI*2,v=Math.cos(g),x=Math.sin(g);if(f.push(v*n,x*n,0,v*o,x*o,0),l.push(0,0,1,0,0,1),t.push(.5,0,.5,1),s.push(1e3,n-o,0,1e3,n-o,0),w<i){const z=w*2;h.push(z,z+1,z+2,z+1,z+3,z+2)}}const m=new p.BufferGeometry;return m.setAttribute("position",new p.Float32BufferAttribute(f,3)),m.setAttribute("normal",new p.Float32BufferAttribute(l,3)),m.setAttribute("uv",new p.Float32BufferAttribute(t,2)),m.setAttribute("aSize",new p.Float32BufferAttribute(s,3)),m.setIndex(h),m.applyMatrix4(u)},a=(o,n,i,u)=>new p.Matrix4().makeRotationY(u?Math.PI:0).setPosition(o,n,i),r=(o,n,i)=>{const u=U(o,0,n,i),f=[],l=t=>{t.applyMatrix4(u),f.push(t)};l(j(8.6,.28,.9,U(0,1.05,0))),l(j(6.4,.16,2.5,U(-1,1.36,0))),l(j(.12,1.2,2.5,U(2.2,1.95,0))),l(j(1.9,1.9,2.4,U(3.35,2,0))),l(j(.06,.8,2,U(4.32,2.35,0))),l(j(.05,.5,1.5,U(4.32,1.55,0))),l(j(.2,.24,2.5,U(4.4,1.08,0))),l(j(1.3,.3,.7,U(.9,.78,0)));for(const t of[-1,1]){l(j(.95,.72,.05,U(3.6,2.42,t*1.21))),l(j(.035,1.55,.04,U(2.95,1.9,t*1.21))),l(j(.03,.035,1.12,U(3.5,1.2,t*1.21,Math.PI/2))),l(j(.22,.05,.05,U(3.15,1.95,t*1.24))),l(j(.12,.2,.06,U(4.33,1.3,t*.85,Math.PI/2)));for(let s=0;s<6;s++)l(j(.08,.6,.08,U(-3.95+s*1.16,1.74,t*1.21)));l(j(6,.06,.05,U(-1.05,2.02,t*1.21)))}for(const t of[3.3,-1.7,-3]){l(ge(A(t,.52,-1),A(t,.52,1),.07,5));for(const s of[-1.05,1.05])l(ge(A(t,.52,s-.17),A(t,.52,s+.17),.52,14)),l(e(.26,.52,14,a(t,.52,s+Math.sign(s)*.185,s<0))),l(e(0,.26,10,a(t,.52,s+Math.sign(s)*.19,s<0)))}return wo.push([o-.5,n,i,9.6,3.6]),f};Ge.push(...r(17,388.5,.12),...r(33,390.5,-.2));const c=(o,n,i)=>{const u=U(o,1.15,n,i),f=[],l=t=>{t.applyMatrix4(u),f.push(t)};for(const t of[-1,1]){l(vo(1.12,0,.06,.09,18).applyMatrix4(new p.Matrix4().makeRotationX(Math.PI/2).setPosition(0,0,t*.59))),l(e(.82,1.15,18,a(0,0,t*.635,t<0))),l(e(0,.3,10,a(0,0,t*.64,t<0)));for(let s=0;s<6;s++)l(j(.07,.56,.03,new p.Matrix4().makeRotationZ(s*Math.PI/3).multiply(new p.Matrix4().makeTranslation(0,.56,t*.63))))}l(ge(A(0,0,-.55),A(0,0,.55),.72,14));for(let t=-3;t<=3;t++)l(vo(.73,0,.03,.05,14).applyMatrix4(new p.Matrix4().makeRotationX(Math.PI/2).setPosition(0,0,t*.15)));return l(ge(A(0,0,-.7),A(0,0,.7),.12,6)),wo.push([o-.4,n,i,3.2,2.3]),f},d=K("reels");for(const[o,n]of[[9,391],[46,387],[58,392],[-22,389],[-41,392.5],[-66,388]])Ge.push(...c(o,n,d.range(-.6,.6)))}await _.yield();const No=`
uniform float uBnWind;
float bn_h(vec2 p){ p = fract(p * vec2(.1031, .1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
float bn_n(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(bn_h(i), bn_h(i + vec2(1., 0.)), f.x), mix(bn_h(i + vec2(0., 1.)), bn_h(i + vec2(1., 1.)), f.x), f.y); }
// THE LONG FOLDS of the free cloth (P3): three troughs and four crests of unequal width run the cloth's whole length side
// by side; they wander a little together and breathe in width on the way down it and never merge, split or close into
// islands. bn_g: the fold coordinate, a whole number in the bed of each trough (-1, 0, 1), a half on each crest; the
// hems ride on crests. bn_fold: the height of the fold, 0 in a trough's bed to 1 on a crest.
float bn_g(float a, float s){
  float wa = a + .15 * sin(a * 3.3 + 1.2) + .05 * sin(a * 8.1 + .4);
  return wa * (1.44 + .12 * (bn_n(vec2(s * .0043, 9.)) - .5)) + .3 * (bn_n(vec2(s * .0031, 3.)) - .5);
}
float bn_fold(float a, float s){ return .5 - .5 * cos(6.2832 * bn_g(a, s)); }
// x: displacement along the cloth's normal (m), y: the slope of its two long waves along the cloth as the tone takes it
// (the ripples move the cloth but are left out of the tone, which they would only break into spots), z: the slow roll (radians, port hem up, so
// the cloth shows its under face to the valley and to the route beside it and stands clear above the summit ridge)
// at s metres from the hoist, a = -1..1 across
vec3 bn_wave(float s, float a, float t){
  float e = smoothstep(8., 200., s) * uBnWind;
  // ON THE POUR (the cloth's first 360 to 560 m, where its line comes down at 29 degrees and levels out, and where the route passes over the hem) the waves are long swells: a
  // wave as steep as the free cloth's would stand its front upright there and cut the pour into treads and risers. The
  // two long waves and the ripples come in as the line levels out; one swell 330 m long carries the pour.
  float lev = smoothstep(360., 560., s);
  float k0 = 6.2832 / 330., k1 = 6.2832 / 172., k2 = 6.2832 / 71., k3 = 6.2832 / 27., k4 = 6.2832 / 11.5;
  float p0 = k0 * (s - 17. * t) + a * .35, A0 = 6. * smoothstep(20., 160., s) * (1. - lev) * uBnWind;
  float p1 = k1 * (s - 17. * t) + a * .5, p2 = k2 * (s - 20. * t) - a * .9 + 1.7, p3 = k3 * (s - 23. * t) + a * 1.6 + .4, p4 = k4 * (s - 26. * t) + a * 3.;
  float fine = 1. - smoothstep(260., 480., s);      // the ripples are left out where no eye comes near enough to see them
  float A1 = 11.5 * e, A2 = 4. * e, A3 = (.25 * uBnWind + 1.1 * e) * (.5 + .5 * fine) * mix(.22, 1., lev), A4 = (.1 * uBnWind + .35 * e) * fine * mix(.25, 1., lev);
  float d = A0 * sin(p0) + A1 * mix(.14, 1., lev) * sin(p1) + A2 * mix(.12, 1., lev) * sin(p2) + A3 * sin(p3) + A4 * sin(p4);
  // the tone keeps the waves' passing at their full measure on the pour too, from 60 m under the ring: light and shade
  // travel down the cloth
  float sl = (11.5 * k1 * cos(p1) + 4. * k2 * cos(p2)) * smoothstep(8., 60., s) * uBnWind;
  // the forked tail cracks every four seconds: a whip runs down the last 150 m and the points flick
  float tp = fract(t / 4.);
  float sc = ${(Z.L-150).toFixed(1)} + 165. * smoothstep(0., .5, tp);
  float q = (s - sc) / 15.;
  float whip = exp(-q * q) * 6.5 * smoothstep(${(Z.L-190).toFixed(1)}, ${(Z.L-90).toFixed(1)}, s) * (1. - smoothstep(.5, .62, tp));
  float flick = smoothstep(${(Z.L-44).toFixed(1)}, ${Z.L.toFixed(1)}, s) * 8. * smoothstep(.4, .5, tp) * (1. - smoothstep(.52, .8, tp)) * (a > 0. ? 1. : -.7);
  float roll = (.3 + .22 * sin(s / 170. - t * .13 + 1.)) * smoothstep(420., 620., s) * (1. - .75 * smoothstep(${(Z.L-230).toFixed(1)}, ${(Z.L-90).toFixed(1)}, s));   // the forked tail flies nearly flat, so its two points stand apart from below     // none over the pour and where the route crosses the hem; the greatest roll, .52, is what the clear-air check takes
  return vec3(d + whip + flick, sl - whip * q * .13, roll);
}`,Eo=A(ae[1],0,-ae[0]),wa=new p.ShaderMaterial({uniforms:{...Se.clothUniforms("emerald"),uBnWind:{value:.75+.3*Je.k},uRingC:{value:A(Me.c[0],Me.c[1],Me.c[2])},uPortB:{value:Eo}},vertexShader:`
${No}
uniform float uTime;
attribute vec3 aAc;      // level, across the cloth's own line here, to port
attribute vec4 aCl;      // across -1..1, metres from the hoist, half width here, 0
attribute vec3 aT;       // the line's own direction here, toward the tail
uniform vec3 uRingC, uPortB;   // the ring's middle; level, across the wind, to port
varying vec3 vP, vN, vT;
varying vec4 vCl;
void main(){
  float a = aCl.x, s = aCl.y;
  vec3 w = bn_wave(s, a, uTime);
  float cr = cos(w.z), sr = sin(w.z);
  vec3 across = aAc * cr + normal * sr, nrm = normal * cr - aAc * sr;
  float free = smoothstep(4., 130., s);
  // six lashings on the ring's rim (a = -1, -.6, -.2, .2, .6, 1): at each the cloth is gathered into a neck a third of its
  // width there, between them the hoist swags back and down, and the cloth bulges once between each pair for its first 26 m
  float ua = fract(a * 2.5) - .5, ua2 = 2. * abs(ua);
  float ag = (floor(a * 2.5) + .5 + ua * mix(mix(.3, 1., ua2 * ua2 * ua2), 1., smoothstep(.5, 10., s))) / 2.5;
  float lash = ua2;
  float swag = sin(lash * 1.5708);
  float relief = (bn_fold(a, s) - .5) * 5.5 * free + swag * 1.5 * smoothstep(0., 5., s) * (1. - smoothstep(8., 26., s));
  float billow = (1. - a * a) * (1.2 + 3.6 * free) * (1. + .25 * sin(uTime * .31 + s * .01));
  float sway = sin(uTime * .43 + s * .008) * 9. * smoothstep(520., 900., s);
  // the hems flutter: a short quick wave runs down each edge of the free cloth (its outermost metre and a half), port and starboard out of step
  float flut = smoothstep(.9, 1., abs(a)) * free * (1.3 * sin(s * .42 - uTime * 4.6 + sign(a) * 1.9) + .7 * sin(s * .19 - uTime * 2.3 + a * 4.));
  // the waves heave the cloth mostly up and down, so they show in its outline from the valley and from beside it
  vec3 p = position + across * (ag * aCl.z) + nrm * (.45 * w.x + relief + billow + flut) + normal * (.85 * w.x) + aAc * sway
         + aT * (4.2 * swag * (1. - smoothstep(0., 10., s))) - normal * (1.7 * swag * (1. - smoothstep(0., 14., s)));
  // S5: GATHERED UP INTO THE RING. The head of the cloth lies on an arc under the lower half of the ring's rim (hung
  // from six lashings, swagging out and back between them) and opens out from that trough into the flying sheet
  float hk = 1. - smoothstep(0., ${vt.open.toFixed(1)}, s), al = ag * ${vt.half.toFixed(2)};
  vec3 er = uPortB * sin(al) - vec3(0., cos(al), 0.);
  vec3 pr = uRingC + er * (${vt.r.toFixed(2)} + 2.2 * swag * (1. - smoothstep(0., 12., s))) + vec3(aT.x, 0., aT.z) * (s + 3.4 * swag * (1. - smoothstep(0., 10., s)));
  p = mix(p, pr, hk * hk * (3. - 2. * hk));
  nrm = normalize(mix(nrm, -er, hk));
  vP = p; vN = nrm; vT = aT; vCl = aCl;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,fragmentShader:`
${Ee}
${mo}
${No}
varying vec3 vP, vN, vT;
varying vec4 vCl;
void main(){
  float a = vCl.x, s = vCl.y, hwid = vCl.z;
  // the forked tail: a notch cut from the end
  if ((s - ${(Z.L-Z.fork).toFixed(1)}) / ${Z.fork.toFixed(1)} > abs(a) + .02) discard;
  float fw = sw_foot(vP);
  float wpx = 2. / max(fwidth(a), 1e-5);                              // the cloth's width in pixels (a slope across pixels)
  vec3 w = bn_wave(s, a, uTime);
  vec3 N = normalize(vN - vT * w.y + vec3(0., 1e-5, 0.));
  float side = gl_FrontFacing ? 1. : -1.;
  // GATHERED WHERE IT IS LASHED (Q3, and the seventh review). Three families of folds, each a coordinate of its own whose
  // whole numbers are the beds of its troughs; their tones are cross-faded by place, never cut:
  //   the LONG FOLDS of the free cloth (bn_g), from 30 m out to the tail;
  //   PIPE FOLDS, six and a half to each lashing's span, parallel in the cloth's own metres, so that in space they run
  //   out of each roped neck (where the mesh gathers the cloth) and open with it; they die away between 30 and 170 m
  //   from the ring, riding on the long folds, and are left out where they would crowd under the pixel;
  //   SWAGS, U-shaped folds hanging between two necks over the cloth's first 20 m (lower in the middle of the span).
  float ua = fract(a * 2.5) - .5;                                     // across one lashing's span: 0 at its neck, +-.5 half way to the next
  float al = ua / 2.5 * hwid;                                         // metres of cloth across from the nearest lashing
  float GL = bn_g(a, s);
  float GP = a * 16.25 + .3 * sin(a * 37. + 1.3) + .05 * sin(a * 71. + s * .03) + .16 * sin(s * .045 + a * 7.);   // pipe folds of unequal width
  float sag = sin(3.14159 * ua); sag *= sag;
  float GS = (s - 7.5 * sag) / 3.4;
  float wP = (1. - smoothstep(30., 170., s)) * (1. - smoothstep(.1, .26, fwidth(GP)));
  float wS = smoothstep(.15, .34, abs(ua)) * (1. - smoothstep(9., 21., s - 7.5 * sag)) * (1. - smoothstep(.2, .5, fwidth(GS)));
  // and, wherever the cloth is wide enough in the frame to carry them (each ten pixels and more: a slope across
  // neighbouring pixels), the MIDDLE FOLDS, four to each long fold and bedded in it, so the pipe folds of the necks run
  // on down the pour as folds and the cloth beside the eye is folds from hem to hem
  float GM = 4. * GL + .2 * sin(s * .021 + a * 9.) + .12 * sin(s * .0083 - a * 5. + 2.);
  float wM = 1. - smoothstep(.09, .2, fwidth(GM));
  float cL = cos(6.2832 * GL), cP = cos(6.2832 * GP), cS = cos(6.2832 * GS), cM = cos(6.2832 * GM);
  float cLM = mix(cL, .5 * cL + .66 * cM, wM), sLM = mix(sin(6.2832 * GL), sin(6.2832 * GM), wM);
  float cg = mix(mix(cLM, .55 * cLM + .7 * cP, wP), cS, wS);
  // the mid tone holds most of the cloth, the shade tone lies in the bed of each fold, the light tone breaks on each
  // crest; the long waves and the slow roll only nudge it, so no tone lies across the cloth and none closes into a blot
  float v = .543 - .2 * cg - .1 * smoothstep(.6, 1., cg)
          - .11 * w.y + .05 * dot(N, uLightDir) * side - .045 * sin(s / 170. - uTime * .13 + 1.);
  // where the long folds crowd under the pixel (the cloth seen nearly edge on across its width) they cannot be drawn:
  // there the cloth is laid in its mid tone alone (a slope taken across neighbouring pixels: lawful)
  float crowd = smoothstep(.16, .45, fwidth(GL));
  v = mix(v, .53, crowd * (1. - wS));
  // THE UNDER FACE IS THE SHADE FACE (the eleventh review: the cloth has weight). Seen from below the cloth is laid in
  // its shade tone, the mid tone left only on the bellies between the folds' beds, where the light comes through, and
  // the light tone only in a band along the port hem, the hem toward the light
  float under = side > 0. ? 1. : 0.;      // (the mesh is wound so that its front is the face turned to the ground)
  v += under * (-.2 + .48 * smoothstep(.9, .975, a));
  // one pencil line in each fold's bed, of uneven weight, broken where the hand lifted
  float lw = .55 + .45 * bn_n(vec2(s * .09, floor(GP + .5) * 3.7));
  float lwM = .5 + .5 * bn_n(vec2(s * .05, floor(GM + .5) * 2.3));
  float fold = max(max(max(sw_foldLine(GL, wpx) * (1. - .6 * wP), sw_foldLine(GM, wpx) * wM * lwM * (1. - .5 * wP)), sw_foldLine(GP, wpx) * wP * lw) * (1. - wS), sw_foldLine(GS, wpx) * wS * lw)
             * mix(.45, 1.15, smoothstep(40., 170., wpx)) * smoothstep(1.5, 4., s);
  // the crayon is worked four and a half times larger on a cloth this size: strokes a hand's width at the drawing's scale.
  // THE TONES MEET IN STROKES (P3): the strokes are 3 to 6 pixels wide at any distance and each carries its tone a little
  // past its neighbours (sw_comb), so every edge between two tones is strokes of both lying side by side; they run the
  // cloth's own length, along the pipe folds and the long folds alike. Where the cloth is some hundreds of pixels wide
  // (beside the eye) a stroke carries its tone less far, so no tone ends on a row of level cuts.
  sw_streak = .3;
  // Seen large (some hundreds of pixels wide) it is plainly wax on card: narrower strokes whose ends taper (sw_tip), a
  // hair of bare card along half their joins and flecks of card where the wax skipped.
  float big = smoothstep(110., 380., wpx);
  sw_comb = mix(mix(.1, .62, smoothstep(50., 190., s)), .1, crowd) * (1. - .25 * big);
  sw_strokeW = mix(1.6, 1.2, big);
  sw_wax = vec2(mix(.14, .6, big), mix(.3, .8, big));
  sw_tip = big;
  float sx = (a + (1. - smoothstep(30., 170., s)) * (GP - a * 16.25) / 16.25) * hwid;      // near the ring a stroke keeps to its pipe fold
  vec3 col = sw_crayon(vec2(sx, s) * .22, clamp(v, 0., 1.), 99., vP, fw, .37, fold, smoothstep(14., 50., wpx));   // the hem is drawn below, at this cloth's own scale
  // SHADE AND WEIGHT (Q3): stumped charcoal over the wax, soft, with the tooth in it: a touch in the bed of the deepest
  // folds, a veil on the flank of each long wave that falls away from the light, and a little more on the cloth's under face
  float deep = smoothstep(.3, .95, cg) * (.5 + .5 * smoothstep(-.4, .5, mix(sLM, sin(6.2832 * GP), wP))) * (.34 + .12 * wP) * (.55 + .45 * smoothstep(60., 200., wpx));
  float flank = smoothstep(.02, .22, -w.y * side) * .26;
  // (under the cloth the charcoal is rubbed into every fold's bed, and a veil of it lies over the whole face)
  float shadeK = (deep * (1. + .9 * under) + flank + under * (.1 + .3 * smoothstep(.1, .8, cg))) * (1. - .6 * crowd) * (.75 + .5 * sw_tooth(vec3(a * hwid * .22, s * .09, 3.), fw * .2));
  col = mix(col, uCharcoal, clamp(shadeK, 0., .58 + .16 * under));
  // and in the bed of each long fold the charcoal is pressed to its full weight: the darkest dark of the frame lies in the cloth
  col = mix(col, uCharcoal, sw_foldLine(GL, wpx) * (1. - .6 * wP) * (1. - wS) * smoothstep(40., 120., wpx) * smoothstep(1.5, 4., s));
  // THE HEM (the ninth review): on a cloth 110 m wide the hem is a turned band 1.2 m wide, ruled along both its edges (a
  // doubled pencil line), with an eyelet every 3 m along its whole length; in places the wax misses it and leaves card.
  // Every measure is floored by the pixel's footprint ACROSS the hem (fh) and ALONG the cloth (fs), each a slope taken
  // across neighbouring pixels: a line never thins under 1.6 pixels, the band never under 7.
  float hd = (1. - abs(a)) * hwid;
  // (the notch of the forked tail is hemmed like the sides: each point carries its ruled band on both its edges)
  float nk = (s - ${(Z.L-Z.fork).toFixed(1)}) / ${Z.fork.toFixed(1)};
  hd = min(hd, nk > 0. ? (abs(a) + .02 - nk) * hwid * .8 : 1e4);
  float fh = max(fwidth(hd), 1e-4), fs = max(fwidth(s), 1e-4);
  float hb = max(1.2, 7. * fh), hlw = max(.07, .8 * fh), hOn = smoothstep(1.5, 4., s);
  float hemIn = 1. - smoothstep(hb, hb + fh, hd);
  float miss = smoothstep(.5, .6, bn_n(vec2(s * .06, a > 0. ? 3.3 : 8.1))) * hemIn * hOn;
  col = mix(col, uCard, .85 * miss * (.55 + .45 * sw_tooth(vec3(a * hwid * .22, s * .09, 5.), fw * .2)));
  float hl2 = max(1. - smoothstep(hlw, hlw + fh, abs(hd - hb)), 1. - smoothstep(hlw * 1.3, hlw * 1.3 + fh, hd));
  col = mix(col, mix(uGraphite, uCharcoal, .6), .9 * hl2 * (.72 + .28 * bn_n(vec2(s * .11, 5.))) * hOn);
  // AN EYELET AT ITS TRUE SIZE (S7): 0.6 m across, every 3 m; drawn only while it is over two pixels across (fe: a
  // pixel in eyelet radii, by the footprint across the hem and along the cloth), whole from three pixels up; no floor
  float fe = max(fh, fs) / .3, l3 = length(vec2(hd - .5 * hb, (fract(s / 3.) - .5) * 3.)) / .3;
  float w3 = (1. - smoothstep(.62, 1., fe)) * hOn;
  col = mix(col, uCard, .9 * (1. - smoothstep(.68 - .5 * fe, .68 + .5 * fe, l3)) * w3);
  col = mix(col, uCharcoal, .88 * (1. - smoothstep(max(.3 - .5 * fe, 0.), .5 + .5 * fe, abs(l3 - 1.))) * w3);
  // each lashing: the gathered neck bound for its first 6 m with crossing turns of heavy rope, five each way (rope is
  // bare card between two ruled pencil edges, never under two pixels). THE CLOTH STAYS IN THE NECK (the ninth review):
  // where the crossing turns would crowd under ten pixels one family alone is ruled, five counted turns with the
  // gathered cloth between them, and the neck's pleats are pencilled three or four to a neck; where those would crowd
  // under three pixels every other turn is ruled, and further off none: the neck is then pleated cloth alone, never a
  // blank band of card.
  float neck = (1. - smoothstep(5.9, 6.3, s)) * (1. - smoothstep(4.6, 5.6, abs(al)));
  float pleat = sw_foldLine(GP * .5 + .25, wpx) * (1. - smoothstep(5., 9., s)) * (1. - smoothstep(4.6, 5.6, abs(al)));
  col = mix(col, mix(uGraphite, uCharcoal, .7), .8 * pleat);
  float alg = al * .3;
  float q1 = alg * .5 + s * .8, q2 = -alg * .5 + s * .8 + .5;
  float fr = max(max(fwidth(q1), fwidth(q2)), 1e-4);
  float one = smoothstep(.1, .2, fr), wide = smoothstep(.3, .42, fr), gone = smoothstep(.56, .76, fr);
  float d1 = abs(fract(q1) - .5), d2 = abs(fract(q2) - .5);
  float dr = mix(mix(min(d1, d2), d1, one), abs(fract(q1 * .5) - .5) * 2., wide);
  float rw = max(.16, mix(1.5, 1., one) * fr);
  float rope = (1. - smoothstep(rw, rw + fr, dr)) * (1. - gone);
  float edge = rope * mix(smoothstep(rw - 1.6 * fr, rw - .6 * fr, dr), .6, one);
  col = mix(col, mix(uCard, mix(uGraphite, uCharcoal, .3), max(edge, .12)), rope * neck);
  gl_FragColor = vec4(col, 1.);
}`,side:p.DoubleSide,fog:!1});{const c=new Float32Array(47208),d=new Float32Array(15736*3),o=new Float32Array(15736*3),n=new Float32Array(15736*3),i=new Float32Array(15736*4),u=[],f=A(0,0,0),l=A(0,0,0),t=A(0,0,0),s=A(0,0,0);for(let w=0;w<=280;w++){const g=w/280,v=Z.L*(.72*g*g+.28*g);so(v,f),so(v+.5,l),l.sub(f).normalize(),s.set(-l.z,0,l.x).normalize(),s.dot(Eo)<0&&s.negate(),t.crossVectors(s,l).normalize(),t.y<0&&t.negate();const x=Lt(Lt(Z.wHoist/2,Z.wMid/2,y(40,260,v))+(Z.wFar-Z.wMid)/2*y(380,620,v),Z.wTail/2,y(680,Z.L-Z.fork,v));(w&31)===31&&await _.yield();for(let z=0;z<=55;z++){const P=w*56+z;c[P*3]=f.x,c[P*3+1]=f.y,c[P*3+2]=f.z,d[P*3]=t.x,d[P*3+1]=t.y,d[P*3+2]=t.z,o[P*3]=l.x,o[P*3+1]=l.y,o[P*3+2]=l.z,n[P*3]=s.x,n[P*3+1]=s.y,n[P*3+2]=s.z,i[P*4]=-1+2*z/55,i[P*4+1]=v,i[P*4+2]=x,i[P*4+3]=0}}for(let w=0;w<280;w++)for(let g=0;g<55;g++){const v=w*56+g,x=v+1,z=v+55+1,P=z+1;u.push(v,z,x,x,z,P)}const h=new p.BufferGeometry;h.setAttribute("position",new p.BufferAttribute(c,3)),h.setAttribute("normal",new p.BufferAttribute(d,3)),h.setAttribute("aT",new p.BufferAttribute(o,3)),h.setAttribute("aAc",new p.BufferAttribute(n,3)),h.setAttribute("aCl",new p.BufferAttribute(i,4)),h.setIndex(u);const m=new p.Mesh(h,wa);m.frustumCulled=!1,pe.add(m)}await _.yield();const $e={pos:[],tan:[],k:[],idx:[]};function _t(e,a,r,c=.012,d=!0,o=!1){const i=$e.pos.length/3,u=e.distanceTo(a),f=a.clone().sub(e).normalize();for(let l=0;l<=10;l++){const t=l/10,s=e.y+(a.y-e.y)*t-c*u*4*t*(1-t);for(const h of[-1,1])$e.pos.push(e.x+(a.x-e.x)*t,s,e.z+(a.z-e.z)*t),$e.tan.push(f.x,f.y,f.z),$e.k.push(h,r,o?2+t:d?t:-1);if(l<10){const h=i+l*2;$e.idx.push(h,h+1,h+2,h+1,h+3,h+2)}}}for(const e of[-1,1])_t(A(e*210.4,1,C.z0),A(e*210.4,1,C.z1+.4),.07,0,!1),_t(A(e*211.3,0,C.z1+.9),A(e*211.3,3.4,C.z1+.9),.17,0,!1);_t(A(-214,1,C.z1+.4),A(214,1,C.z1+.4),.09,0,!1);{const e=[],a=(t,s)=>J(Ze(t,s),Ye(t,s))-.25,r=(t,s,h)=>A(Ze(t,h),s,Ye(t,h)),c=(t,s,h,m,w,g,v=0)=>j(t,s,h,U(Ze(m,g),w,Ye(m,g),v+Jt)),d=Me.c[1],o=Me.r+1.7,n=(t,s,h=0)=>r(Math.sin(t)*s,d-Math.cos(t)*s,h);for(const t of[-1,1]){const s=t*40,h=12,m=a(s,h),w=r(s,m,h),g=n(t*1.75,o+.6,.4),v=w.clone().lerp(g,.45),x=g.clone().sub(w).normalize();e.push(ge(w,g,1,10));for(const z of[-.35,.35])e.push(ge(v.clone().addScaledVector(x,z-.12),v.clone().addScaledVector(x,z+.12),1.7,12));e.push(ge(w.clone().addScaledVector(x,.2),w.clone().addScaledVector(x,1.5),1.5,10)),e.push(ge(g.clone().addScaledVector(x,-1.6),g.clone().addScaledVector(x,.2),1.5,10)),e.push(c(8.6,.6,8.6,s,m+.3,h));for(const z of[-3.4,3.4])for(const P of[-3.4,3.4])e.push(c(.8,.6,.8,s+z,m+.9,h+P));e.push(c(3.2,2.8,.4,s+t*2.3,m+1.8,h));for(const z of[-2.8,2.8])e.push(ge(r(s+t*3.2,m-.4,h+z),r(s+t*6.6,m+4.6,h+z),.3,6))}const i=new p.Matrix4().makeRotationX(Math.PI/2).premultiply(new p.Matrix4().makeRotationY(go)).setPosition(Me.c[0],d,Me.c[2]);e.push(vo(o,0,3,2.6,144).applyMatrix4(i));for(let t=0;t<12;t++){const s=(t+.5)/12*Math.PI*2;for(const h of[-.3,.3])e.push(j(3.9,.22,3.5,new p.Matrix4().makeRotationZ(s+h/o).setPosition(Math.cos(s+h/o)*o,Math.sin(s+h/o)*o,0).premultiply(new p.Matrix4().makeRotationY(go).setPosition(Me.c[0],d,Me.c[2]))))}{const t=new p.Mesh(new p.RingGeometry(mt-.1,o-1.45,96,1),new p.ShaderMaterial({uniforms:{...ye,uOpen:Mo},vertexShader:`
uniform float uOpen;
varying vec2 vL; varying vec3 vP;
void main(){
  // the inner edge reaches in over the veil's outer two thirds while the veil is certain to be there (uOpen 1)
  float r = length(position.xy), inner = step(r, ${mt.toFixed(2)});
  vec3 p = position * mix(1., mix(1., .34, uOpen), inner);
  vL = p.xy; vec4 wp = modelMatrix * vec4(p, 1.); vP = wp.xyz; gl_Position = projectionMatrix * viewMatrix * wp; }`,fragmentShader:`
${Ee}
varying vec2 vL; varying vec3 vP;
void main(){
  float r = max(length(vL), .5), rn = r / ${mt.toFixed(2)};
  float ang = atan(vL.y, vL.x) / 6.2832;                                   // r is never 0 here: the lens has no middle
  float fs = max(sw_short(vP), 1e-4), th = sw_tooth(vP, sw_foot(vP));
  // radial chalk strokes: 170 round the opening, each with an inner and an outer end of its own
  float c = ang * 170., id = floor(c), f = abs(fract(c) - .5), fn = fs / r * 27.;
  float h1 = sw_h11(id * 1.9 + 4.), h2 = sw_h11(id * 3.1 + 9.);
  float rIn = .3 + .42 * h1 * h1, rOut = 1.02 + .14 * h2;
  float k = smoothstep(.36, 1.08, rn);                                      // 0: closed up into chalk, 1: thin, at the steel
  float taper = clamp((rn - rIn) / .12, 0., 1.) * clamp((rOut - rn) / .1, 0., 1.);
  float w = mix(.56, .15, k) * (.7 + .3 * sw_vn2(vec2(rn * 9. + h1 * 31., id * .7))) * sqrt(taper);
  float cov = (1. - smoothstep(w - .6 * fn, w + .6 * fn, f)) * step(.001, taper);
  cov = mix(cov, 2. * w, smoothstep(.22, .42, fn));
  cov = max(cov, 1. - smoothstep(.34, .46, rn));                            // the veil's own chalk, inside
  vec3 col = mix(uCard, uChalk, clamp(cov, 0., 1.) * (.86 + .14 * th));
  // five ruled pencil circles, lighter inward, each broken where the hand lifted; never under 1.5 pixels
  float lw = max(.09, .75 * fs), pen = 0.;
  for (int i = 0; i < 5; i++) {
    float fi = float(i), rk = ${mt.toFixed(2)} * (.46 + .125 * fi) + .12 * sin(ang * 6.2832 * 3. + fi * 2.1);
    float on = smoothstep(.2, .3, sw_vn2(vec2(ang * 23. + fi * 7.3, fi)));
    pen = max(pen, (1. - smoothstep(lw, lw + fs, abs(r - rk))) * on * (.42 + .13 * fi));
  }
  // short radial pencil ticks across the circles: 64 round, each 1.5 to 3.5 m long about a circle of its own
  float c2 = ang * 64., id2 = floor(c2), g1 = sw_h11(id2 * 2.7 + 1.), g2 = sw_h11(id2 * 5.3 + 2.);
  float rt = ${mt.toFixed(2)} * (.46 + .125 * floor(g1 * 5.)), len = .75 + g2;
  float tick = (1. - smoothstep(lw, lw + fs, abs(fract(c2) - .5) * r * .0982)) * (1. - smoothstep(len, len + fs, abs(r - rt))) * step(.3, g2);
  pen = max(pen, tick * (.5 + .3 * g1));
  col = mix(col, mix(uGraphite, uCharcoal, .3), pen * (.8 + .2 * th));
  gl_FragColor = vec4(col, 1.);
}`,side:p.DoubleSide,fog:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-8}));t.position.set(Me.c[0]-eo[0]*.35,d,Me.c[2]-eo[1]*.35),t.rotation.y=go,t.frustumCulled=!1,pe.add(t)}for(let t=0;t<6;t++){const s=(-1+.4*t)*vt.half;for(let h=0;h<6;h++){const m=s+(h-2.5)*.62/o,w=.2/o;e.push(ge(n(m-w,o),n(m+w,o),2.35,10))}for(const h of[-1,1])e.push(ge(n(s+h*.05,o+1.4,-.4),n(s+h*.02,vt.r-.2,-1.6),.3,6))}const u=n(Math.PI,o+1.3),f=[[u,0,150],[u,62,96],[u,-62,96],[n(2.3,o+1.2),104,14],[n(-2.3,o+1.2),-100,14]];for(const[t,s,h]of f){const m=Ze(s,h),w=Ye(s,h),g=J(m,w)+.25,v=3.6,x=A(m,g+1.6*v,w),z=t.clone().sub(x).normalize(),P=Math.atan2(z.x,z.z);_t(x,t,.2);const B=new p.Matrix4().makeRotationY(P).setPosition(x.x,g,x.z),$=[];$.push(j(4.2*v,.5,4.2*v,U(0,-.1,0))),$.push(j(.5*v,.5*v,2.4*v,new p.Matrix4().makeRotationX(-Math.asin(ie(z.y,-.9,.9))).setPosition(0,1.6*v+z.y*3.4*v,Math.hypot(z.x,z.z)*3.4*v))),$.push(ge(A(0,0,0),A(0,1.75*v,0),.2*v,6),j(.9*v,.6*v,.25*v,U(0,1.6*v,0)));for(const D of[-1,1])$.push(ge(A(D*1.5*v,-.4,-1.3*v),A(D*1.5*v,2.3*v,-2.9*v),.13*v,6),j(.7*v,.2,.7*v,U(D*1.5*v,.14,-1.42*v)));for(const D of $)e.push(D.applyMatrix4(B))}const l=new p.Mesh(Zt(e,!1),Se.ruledMaterial({chalk:.3,heavy:1,side:p.DoubleSide}));l.frustumCulled=!1,pe.add(l)}{const e=K("squall"),a=1200,r={xc:150,w:700},c={x:24,y:750,h:320,w:92,lean:.12},d=qe==="bank"?90:qe==="ridges"?20:-40,o=qe==="clear"?.9:1,n=r.xc-r.w-130,i=r.xc+r.w+130,u=20,f=1700,l=new p.BufferGeometry,t=[],s=[];for(const[x,z]of[[n,u],[i,u],[n,f],[i,f]])t.push(Ze(x,a),z,Ye(x,a)),s.push(x,z);l.setAttribute("position",new p.Float32BufferAttribute(t,3)),l.setAttribute("aQ",new p.Float32BufferAttribute(s,2)),l.setIndex([0,1,2,1,3,2]);const h=x=>new p.ShaderMaterial({uniforms:{...ye,uSq:{value:x}},vertexShader:`
attribute vec2 aQ;
varying vec2 vQ; varying vec3 vP;
void main(){ vQ = aQ; vP = position; gl_Position = projectionMatrix * viewMatrix * vec4(position, 1.); }`,fragmentShader:`
${Ee}
uniform vec4 uSq;        // two offsets of the heads' rule, the weight of the charcoal, a lift of the upper edge (m)
#define RIFT_X ${c.x.toFixed(1)}
#define RIFT_Y ${c.y.toFixed(1)}
#define RIFT_H ${c.h.toFixed(1)}
#define RIFT_W ${c.w.toFixed(1)}
#define RIFT_LEAN ${c.lean.toFixed(2)}
#define SQ_XC ${r.xc.toFixed(1)}
#define SQ_W ${r.w.toFixed(1)}
varying vec2 vQ; varying vec3 vP;
// the torn upper edge: heaped heads, highest over the squall's middle, falling away to both hands
float sq_heads(float x){
  float a = sw_vn2(vec2(x * .0031 + uSq.x, 1.5)), b = sw_vn2(vec2(x * .0098 + uSq.y, 7.5)), c = abs(sw_vn2(vec2(x * .027 + 3., 3.1)) - .5);
  float u = (x - SQ_XC) / SQ_W;
  return 1180. + 170. * a + 90. * b - 80. * c + uSq.w + 230. * (1. - u * u);
}
// the squall's rule at a place on its sheet: x the height of its torn upper edge there, y the distance to the rift's lip
// (under 0: inside the rift), z the weight of the weather (heavy under the heads and round the rift, thinning to nothing
// toward both hands and toward its base, so the mass ends where its strokes end)
vec3 sq_field(vec2 q){
  float x = q.x, y = q.y;
  float tear = sw_vn2(q * .011) - .5, tear2 = sw_vn2(q * .043 + 7.) - .5;
  vec2 wq = q + 110. * vec2(sw_vn2(q * .0037 + 2.) - .5, sw_vn2(q * .0037 + 11.) - .5);        // torn, not rounded: the tones' rule is warped
  float top = sq_heads(x) + 40. * tear + 12. * tear2;
  float c = dot(q, vec2(.866, .5));
  // THE RIFT: a tall torn opening on the wind's line through the ring, leaning a little
  float ry = (y - RIFT_Y) / RIFT_H;
  float rx = x - (RIFT_X + RIFT_LEAN * (y - RIFT_Y) + 26. * (sw_vn2(vec2(y * .009, 5.)) - .5));
  float rw = RIFT_W * sqrt(max(1. - ry * ry, 0.)) * (.6 + .8 * sw_vn2(vec2(y * .011, 8.)));
  float dr = abs(rx) - rw + 10. * tear2 + 30. * tear + 20. * (sw_vn2(vec2(c / 9., 3.)) - .5) + (abs(ry) > 1. ? (abs(ry) - 1.) * RIFT_H : 0.);
  // the weather moves along the sheet by the world's clock (9 m a second), so the charcoal's strokes lengthen and shorten: the drawing is still being worked
  float n = sw_vn2(vec2((wq.x - uTime * 9.) * .0026 + uSq.x, wq.y * .0075)) * .6 + sw_vn2(vec2((wq.x - uTime * 9.) * .0071, wq.y * .017 + uSq.y)) * .4;
  float u = abs(x - SQ_XC) / SQ_W + .16 * tear;
  float edge = smoothstep(.5, 1.02, u), low = 1. - smoothstep(170., 420., y - 60. * tear);
  n = .5 + .46 * (n - .45) + .42 * (1. - smoothstep(10., 260., dr)) + .12 * (1. - smoothstep(0., 240., top - y)) - .85 * edge - .6 * low;
  return vec3(top, dr, n);
}
void main(){
  float x = vQ.x, y = vQ.y;
  float fw = sw_foot(vP), th = sw_tooth(vP, fw);
  float tear = sw_vn2(vQ * .011) - .5;
  vec3 F = sq_field(vQ);
  float top = F.x, dr = F.y;
  if (y > top) discard;
  // the hand's one slant: c across the strokes, a along them (metres on the sheet)
  float c = dot(vQ, vec2(.866, .5)), a = dot(vQ, vec2(-.5, .866)), fc = max(fwidth(c), 1e-5);
  float base = 250. + 90. * sw_vn2(vec2(x * .0029 + 4., 2.2)) + 30. * tear;
  float inx = 1. - smoothstep(.55, .9, abs(x - SQ_XC) / SQ_W);
  vec3 col;
  if (y < base) {
    // THE FALL OF RAIN, under the squall's base only: slanting pencil strokes in two or three falls; the land shows between the strokes
    float cr = x + .34 * (base - y), fr = max(fwidth(cr), 1e-5);
    float fall = smoothstep(.42, .6, sw_vn2(vec2(cr * .0052 + uSq.y, 3.3))) * (1. - smoothstep(.6, 1., (base - y) / max(base - 30., 1.))) * inx;
    // the rain FALLS: its strokes slide down their own slant, 10 m a second by the world's clock
    float h = sw_hatchSet(cr, (base - y) * 1.06 - uTime * 10., fr, .2 + .6 * fall) * step(.05, fall);
    if (h < .5) discard;
    col = mix(uCard, mix(uGraphite, uCharcoal, .35), .78 + .2 * th);
  } else if (dr < 0.) {
    // inside the rift: bare card, with chalk laid in long strokes at the hand's slant (a third of it) and pressed
    // along its torn lip
    float k = sw_vn2(vec2(c / (5. + 3. * fw), a / (70. + 40. * fw) + 3.));
    float lipIn = smoothstep(-16. - 4. * fw, -3., dr);
    col = mix(uCard, uChalk, max(step(.5, k), lipIn * step(.3, k)) * (.86 + .14 * th));
  } else {
    // ONE COMPACT CHARCOAL MASS, EVERY DARK LAID IN STROKES (S3; no flat shape with a smooth outline, no hatch over
    // the sky). The charcoal is laid stroke by stroke at the hand's one slant, each stroke 14 m wide on the sheet: the
    // weight of the weather is read once for each stroke, on its own centre line, so the mass ends where its strokes
    // end, each at a place of its own and tapering to a point, with bare card between and beyond them. In the cores
    // the strokes close up into pressed charcoal (the brief's charcoal itself) with hairs of card left where two
    // strokes did not meet and the card's tooth through it. Where there is no stroke there is nothing: the sky's card.
    float cs = c + 3.4 * sin(a * .008 + c * .0019) + 1.8 * sin(a * .021 + 2.);        // the strokes are a hand's: not quite parallel, not quite evenly pitched
    float SP = 14.;
    float ci = floor(cs / SP), hs = fract(sin(ci * 12.9898 + 4.1) * 43758.5453);
    vec3 Fs = sq_field(vQ + ((ci + .5) * SP - cs) * vec2(.866, .5));
    float n = Fs.z + .1 * (hs - .5) + .06 * (sw_vn2(vec2(ci * 3.7, a * .009)) - .5);
    float kM = sw_laid(cs / SP, fc / SP, (n - .3) / .12, .7 + .3 * hs);
    float kC = sw_laid(cs / SP, fc / SP, (n - .52) / .08, .92 + .6 * sw_vn2(vec2(ci * 5.3, a * .006)));
    // chalk on the lit heads: broken strokes just under the upper edge where it falls away to port, and along the rift's lip
    float lit = smoothstep(-.5, .2, (sq_heads(x) - sq_heads(x + 30.)) / 30.);
    float band = smoothstep(5., 16., top - y) * (1. - smoothstep(70., 170., top - y + 60. * tear)) * inx;
    float stroke = step(.48, sw_vn2(vec2(c / (4. + 2.6 * fw), a / (50. + 30. * fw))));
    float ck = clamp(band * lit * stroke, 0., 1.);
    if (max(max(kM, kC), ck) < .04) discard;
    vec3 mid = mix(uCard, uCharcoal, (.74 + .22 * th) * uSq.z);
    vec3 core = mix(uCharcoal, uCard, .5 * smoothstep(.74, .86, th));
    col = mix(mix(uCard, mid, kM), core, kC);
    col = mix(col, uChalk, ck * (.86 + .14 * th));
  }
  gl_FragColor = vec4(col, 1.);
}`,side:p.DoubleSide,fog:!1}),m=new p.Mesh(l,h(new p.Vector4(e.range(0,40),e.range(0,40),o,d)));m.frustumCulled=!1,m.renderOrder=-4,pe.add(m);const w=8,g=A(0,0,0),v=A(0,0,0);for(let x=0;x<w;x++){const z=x<w/2?-1:1,P=x%(w/2),B=(P+e.range(.2,.8))/(w/2),$=c.y+c.h*(.12+.72*B),D=c.x+c.lean*($-c.y)+z*c.w*1.05*Math.sqrt(Math.max(1-(($-c.y)/c.h)**2,.05)),ke=(14+52*B)*Math.PI/180,Re=z*Math.cos(ke),Ie=Math.sin(ke);let Ae=e.range(260,560);if(Ae=Math.min(Ae,(1330+d-$)/Math.max(Ie,.05),(r.w*.86-z*(D-r.xc))/Math.max(Math.abs(Re),.05)),Ae<120)continue;const Ne=a-40-3*x;g.set(Ze(D,Ne),$,Ye(D,Ne)),v.set(Ze(D+Re*Ae,Ne),$+Ie*Ae,Ye(D+Re*Ae,Ne)),_t(g,v,e.range(3.2,6.4),0,!1,!0)}}await _.yield();const ma=new p.ShaderMaterial({uniforms:{...ye},vertexShader:`
${wt}
attribute vec3 aTan, aK;   // aK: side -1 or 1, radius (m), place along the cable 0..1
varying float vC, vR, vU;
varying vec3 vP;
void main(){
  vec4 mv = viewMatrix * vec4(position, 1.);
  vec3 toEye = cameraPosition - position;
  vec3 side = cross(aTan, toEye);
  side = side / max(length(side), 1e-4);
  float hw = max(aK.y, 2.6 * sw_px(-mv.z));
  vec3 p = position + side * (aK.x * hw);
  vC = aK.x * hw; vR = aK.y; vU = aK.z; vP = p;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,fragmentShader:`
${Ee}
varying float vC, vR, vU;
varying vec3 vP;
void main(){
  float fc = max(fwidth(vC), 1e-5);
  if (abs(vC) > max(vR, .8 * fc)) discard;
  float fw = sw_foot(vP), th = sw_tooth(vP, fw);
  // one chalk glance on each cable; the rest an even pencil line
  float glance = smoothstep(.41, .42, vU) * (1. - smoothstep(.47, .48, vU));
  vec3 col = mix(mix(uGraphite, uCharcoal, .45), uChalk, glance * (.8 + .2 * th));
  if (vU > 1.5) {
    // a chalk ray (R3): a ruled stroke of chalk that tapers and breaks on the card's tooth toward its far end
    float t = clamp(vU - 2., 0., 1.);
    if (abs(vC) > max(vR * (1. - .7 * t), .8 * fc) || sw_vn2(vec2(vU * 37., vR * 9.)) < .62 * smoothstep(.35, 1., t)) discard;
    col = mix(uCard, uChalk, .84 + .16 * th);
  }
  gl_FragColor = vec4(col, 1.);
}`,side:p.DoubleSide,fog:!1}),Wo=new p.Mesh(Zt(Ge,!1),Bo);Wo.frustumCulled=!1;const ft=new p.Mesh(new p.BufferGeometry,ma);ft.geometry.setAttribute("position",new p.Float32BufferAttribute($e.pos,3)),ft.geometry.setAttribute("aTan",new p.Float32BufferAttribute($e.tan,3)),ft.geometry.setAttribute("aK",new p.Float32BufferAttribute($e.k,3)),ft.geometry.setIndex($e.idx),ft.frustumCulled=!1,pe.add(Wo,ft),await _.yield();{const e={pos:[],tan:[],k:[],idx:[]},a=K("horn-lines"),r=(i,u,f)=>{const l=i.length/3,t=e.pos.length/3;let s=a.range(0,900);for(let h=0;h<l;h++){const m=Math.max(h-1,0),w=Math.min(h+1,l-1),g=i[w*3]-i[m*3],v=i[w*3+1]-i[m*3+1],x=i[w*3+2]-i[m*3+2],z=Math.hypot(g,v,x)||1;h>0&&(s+=Math.hypot(i[h*3]-i[h*3-3],i[h*3+1]-i[h*3-2],i[h*3+2]-i[h*3-1]));const P=h===0||h===l-1?.25:h===1||h===l-2?.7:1;for(const B of[-1,1])e.pos.push(i[h*3],i[h*3+1],i[h*3+2]),e.tan.push(g/z,v/z,x/z),e.k.push(B,u,s,f*P);if(h<l-1){const B=t+h*2;e.idx.push(B,B+1,B+2,B+1,B+3,B+2)}}},c=(i,u,f)=>{const l=I.x+Math.cos(i)*u*we,t=I.z+Math.sin(i)*u*we;f.push(l+Math.cos(i)*.7,J(l,t)+.7,t+Math.sin(i)*.7)};for(let i=0;i<4;i++){const u=[];for(let f=3;f<=548;f+=5)c(Ke[i],f,u);r(u,.6,1)}await _.yield();for(let i=0;i<et;i++){const u=Ao(i);if(u<.52)continue;let f=a.range(55,120),l=(i+.5)/et*fo;const t=Math.cos(l)*ae[0]+Math.sin(l)*ae[1]>.25?.85:-(.55+.45*u),s=a.range(300,470);for(;f<s;){const h=a.range(55,170),m=[];for(let w=f-8;w<=Math.min(f+h,s)+8;w+=6){for(let g=0;g<3;g++)l=(i+.5-.55*ce.n2(Math.cos(l)*2.1+9,Math.sin(l)*2.1+w*.0045))/et*fo;Bt(I.x+Math.cos(l)*w*we,I.z+Math.sin(l)*w*we,_e),_o(w,_e[1])>.42?c(l,w,m):(m.length>=9&&r(m.slice(),.4,t),m.length=0)}m.length>=9&&r(m,.4,t),f+=h+a.range(14,40)}}await _.yield();for(let i=2;i<=8;i++)for(let u=0;u<4;u++){if(a()<.2)continue;const f=Ke[u]-a.range(.12,.42),l=Ke[u]+a.range(.12,.42),t=[];for(let s=f;s<=l;s+=.03)c(s,ie((i+.78-.9*ce.n2(Math.cos(s)*1.7+3,Math.sin(s)*1.7+5))*54,50,540),t);t.length>=9&&r(t,.35,-a.range(.6,.9))}const d=new p.ShaderMaterial({uniforms:{...ye},vertexShader:`
${wt}
attribute vec3 aTan; attribute vec4 aK;   // aK: side -1 or 1, half width (m), metres along the line, tone (negative: a lighter line that fades more with distance)
varying float vC, vH, vU, vTone;
varying vec3 vP;
void main(){
  vec4 mv = viewMatrix * vec4(position, 1.);
  vec3 toEye = cameraPosition - position;
  vec3 side = cross(aTan, toEye);
  side = side / max(length(side), 1e-4);
  float hw = (aK.w < 0. ? 2.6 : 3.3) * mix(1., 1.4, smoothstep(150., 700., -mv.z)) * sw_px(-mv.z);
  vec3 p = position + side * (aK.x * hw);
  vC = aK.x * hw; vH = hw; vU = aK.z; vP = p;
  vTone = abs(aK.w) * (1. - (aK.w < 0. ? .62 : .42) * smoothstep(450., 1500., -mv.z));
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,fragmentShader:`
${Ee}
varying float vC, vH, vU, vTone;
varying vec3 vP;
void main(){
  float fc = max(fwidth(vC), 1e-5);
  float wgt = .4 + .6 * sw_vn2(vec2(vU * .055, 3.7));          // the hand's pressure along the line
  if (abs(vC) > max(vH * wgt, .75 * fc)) discard;
  float th = sw_tooth(vP, sw_foot(vP));
  gl_FragColor = vec4(mix(uCard, mix(uGraphite, uCharcoal, .6), clamp(vTone * (.62 + .5 * wgt) * (.85 + .3 * th), 0., 1.)), 1.);
}`,side:p.DoubleSide,fog:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-6}),o=new p.BufferGeometry;o.setAttribute("position",new p.Float32BufferAttribute(e.pos,3)),o.setAttribute("aTan",new p.Float32BufferAttribute(e.tan,3)),o.setAttribute("aK",new p.Float32BufferAttribute(e.k,4)),o.setIndex(e.idx);const n=new p.Mesh(o,d);n.frustumCulled=!1,pe.add(n)}await _.yield();const Ft=[],Go=new p.ShaderMaterial({uniforms:{...ye},vertexShader:`
${wt}
attribute vec3 aSide;
attribute vec2 aW;
varying vec3 vP; varying float vTone;
void main(){
  vec4 wp = modelMatrix * vec4(position, 1.);
  vec4 mv = viewMatrix * wp;
  vec3 p = wp.xyz + normalize(mat3(modelMatrix) * aSide + vec3(0., 1e-6, 0.)) * max(aW.x, 1.15 * sw_px(-mv.z));
  vP = p; vTone = aW.y;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,fragmentShader:`
${Ee}
varying vec3 vP; varying float vTone;
void main(){
  float fw = sw_foot(vP);
  float th = sw_tooth(vP, fw);
  float wgt = .62 + .38 * sw_vn3(vP * .17);
  gl_FragColor = vec4(mix(uCard, mix(uGraphite, uCharcoal, .22), clamp(vTone * wgt * (.8 + .4 * th), 0., 1.)), 1.);
}`,side:p.DoubleSide,fog:!1}),de={pos:[],side:[],w:[],idx:[]};function De(e,a,r,c){const d=e.length/3,o=de.pos.length/3;for(let n=0;n<d;n++){const i=Math.max(n-1,0),u=Math.min(n+1,d-1);let f=e[u*3]-e[i*3],l=e[u*3+1]-e[i*3+1],t=e[u*3+2]-e[i*3+2],s=0,h=1,m=0;c&&(s=l*c[2]-t*c[1],h=t*c[0]-f*c[2],m=f*c[1]-l*c[0]);const w=Math.hypot(s,h,m)||1;s/=w,h/=w,m/=w;for(const g of[-1,1])de.pos.push(e[n*3],e[n*3+1],e[n*3+2]),de.side.push(s*g,h*g,m*g),de.w.push(a,r);if(n<d-1){const g=o+n*2;de.idx.push(g,g+1,g+2,g+1,g+3,g+2)}}}const $o=new p.CatmullRomCurve3([[420,0,1060],[352,0,800],[336,0,600],[300,0,452],[196,0,404],[60,0,401],[-122,0,404],[-252,0,372],[-304,0,250],[-322,0,0],[-300,0,-300],[-330,0,-640]].map(e=>A(e[0],e[1],e[2]))),Oe=220,ee=new Float32Array((Oe+1)*4);{const e=A(0,0,0),a=A(0,0,0),r=K("river");for(let t=0;t<=Oe;t++)$o.getPointAt(t/Oe,e),$o.getTangentAt(t/Oe,a),ee[t*4]=e.x,ee[t*4+1]=e.z,ee[t*4+2]=a.z,ee[t*4+3]=-a.x;const c=[];for(let t=0;t<7;t++)c.push({a:t<2?2.2:r.range(4,8.5),f:r.range(.05,.11),ph:r.range(0,6.28),b:t===0?-11.5:t===1?11.5:r.range(-5,5),f2:r.range(.017,.03),tone:t<2?.85:r.range(.5,.8)});for(const t of c){const s=[];for(let h=0;h<=Oe;h++){const m=h/Oe*2300,w=t.b+t.a*Math.sin(m*t.f+t.ph)*(.6+.4*Math.sin(m*t.f2+t.ph*2)),g=ee[h*4]+ee[h*4+2]*w,v=ee[h*4+1]+ee[h*4+3]*w;s.push(g,J(g,v)+.07,v)}De(s,.11,t.tone,[0,1,0])}await _.yield();{const t=[],s=[];for(let v=1560;v>=430;v-=45){let x=-400,z=1e9;for(let P=-620;P<=-250;P+=12){const B=J(P,v)+.02*Math.abs(P+400);B<z&&(z=B,x=P)}t.push(x),s.push(v)}for(let v=0;v<3;v++)for(let x=1;x<t.length-1;x++)t[x]=(t[x-1]+2*t[x]+t[x+1])/4;t.push(-262),s.push(376);const h=new p.CatmullRomCurve3(t.map((v,x)=>A(v,0,s[x]))),m=A(0,0,0),w=A(0,0,0),g=K("river-starboard");for(let v=0;v<4;v++){const x=[],z=v<2?1.6:g.range(3,6),P=v===0?-8:v===1?8:g.range(-4,4),B=g.range(.05,.1),$=g.range(0,6.28);for(let D=0;D<=150;D++){h.getPointAt(D/150,m),h.getTangentAt(D/150,w);const ke=D/150*1300,Re=P+z*Math.sin(ke*B+$),Ie=m.x+w.z*Re,Ae=m.z-w.x*Re;x.push(Ie,J(Ie,Ae)+.09,Ae)}De(x,.13,v<2?.85:g.range(.55,.8),[0,1,0])}}await _.yield();const d=[],o=K("ranges"),n=o.range(0,9),i=o.range(0,9);for(let t=0;t<=260;t++){const s=t/260*Math.PI*2,h=ce.fbm2(Math.cos(s)*2.3+n,Math.sin(s)*2.3+i,4),m=y(2.1,2.55,s)*(1-y(3.55,3.95,s));d.push(Math.cos(s)*2900,150+150*h+330*Math.pow(Math.abs(ce.n2(Math.cos(s)*1.1+i,Math.sin(s)*1.1+n)),1.6)+m*(300+160*h),700+Math.sin(s)*2900)}De(d,2.2,.5,null);const u=[],f=o.range(0,9);for(let t=0;t<=200;t++){const s=t/200*Math.PI*2,h=ce.fbm2(Math.cos(s)*3.1+f,Math.sin(s)*3.1+n,4),m=560+250*h+360*Math.pow(Math.abs(ce.n2(Math.cos(s)*1.7+n,Math.sin(s)*1.7+f)),1.5),w=y(2.1,2.55,s)*(1-y(3.55,3.95,s));u.push(Math.cos(s)*5e3,m+w*(430+260*h),700+Math.sin(s)*5e3)}De(u,3.4,.46,null);const l=K("pebbles");for(let t=0;t<Math.round(520*ve);t++){const s=l.int(0,Oe),h=l.range(-10.5,10.5),m=ee[s*4]+ee[s*4+2]*h,w=ee[s*4+1]+ee[s*4+3]*h,g=l.range(.25,.9),v=l.range(-.5,.5),x=ee[s*4+3]*-1,z=ee[s*4+2],P=x*Math.cos(v)-z*Math.sin(v),B=x*Math.sin(v)+z*Math.cos(v),$=J(m,w)+.06;De([m-P*g,$,w-B*g,m+P*g,$,w+B*g],l.range(.04,.09),l.range(.45,.9),[0,1,0])}}{const e=K("scree"),a=Math.round(1300*Y*ve);let r=0,c=0;for(;r<a&&c++<3e4;){const d=e.int(Math.round(N*io(C.z1-15)),Math.round(N*(Mt+.012))),o=e.range(0,6.283),n=Math.pow(e(),.7)*95,i=M[d*3]+Math.cos(o)*n,u=M[d*3+2]+Math.sin(o)*n;if(i>C.x0-1&&i<C.x1+1&&u>C.z0-1&&u<C.z1+1||Math.hypot(i-re[0],u-re[2])<46)continue;const f=J(i,u)+.05,l=e.range(.12,.5),t=e.chance(.6)?.52+e.range(-.3,.3):e.range(0,3.14),s=Math.cos(t)*l,h=Math.sin(t)*l;De([i-s,f,u-h,i+s,f,u+h],e.range(.035,.08),e.range(.4,.95),[0,1,0]),r++,(r&255)===0&&await _.yield()}}const Gt=fe.anchors.bayNearStake.clone().add(fe.object.position);{const e=K("bay-scree"),a=Math.round(1100*Y*ve);for(let r=0;r<a;r++){const c=e.range(0,6.283),d=Math.pow(e(),.6)*52,o=Gt.x+Math.cos(c)*d,n=Gt.z+Math.sin(c)*d,i=J(o,n)+.05,u=e.range(.14,.6),f=e.chance(.6)?.52+e.range(-.3,.3):e.range(0,3.14),l=Math.cos(f)*u,t=Math.sin(f)*u;De([o-l,i,n-t,o+l,i,n+t],e.range(.04,.09),e.range(.45,.95),[0,1,0]),(r&255)===255&&await _.yield()}}{const e=K("foot-scree"),a=Math.round(300*Y);for(let n=0;n<a;n++){const i=e.range(0,6.283),u=49+Math.pow(e(),1.8)*46,f=re[0]+Math.cos(i)*u,l=re[2]+Math.sin(i)*u,t=J(f,l)+.06,s=e.range(.3,.9)*(1+2.2*Math.pow(e(),5))*(1.25-.5*(u-49)/46),h=e.range(0,6.283),m=h+e.range(.9,1.5),w=Math.cos(h)*s,g=Math.sin(h)*s,v=Math.cos(m)*s*e.range(.4,.7),x=Math.sin(m)*s*e.range(.4,.7);De([f-w,t,l-g,f-w*.3+v,t,l-g*.3+x,f+w*.5+v*.8,t,l+g*.5+x*.8,f+w,t,l+g],e.range(.035,.06)*(1+s*.4),e.range(.55,.9),[0,1,0]),De([f-w*.8-ae[0]*.12*s,t,l-g*.8-ae[1]*.12*s,f+w*.9-ae[0]*.2*s,t,l+g*.9-ae[1]*.2*s],e.range(.07,.11)*(1+s*.5),e.range(.75,1),[0,1,0]),(n&127)===127&&await _.yield()}const r=new p.CatmullRomCurve3([[156,401],[130,444],[98,496],[72,548],[52,604],[38,664],[16,726],[-24,786],[-84,828],[-160,850],[-250,846],[-330,800],[-388,738]].map(n=>A(n[0],0,n[1]))),c=A(0,0,0),d=A(0,0,0),o=K("old-channel");for(let n=0;n<3;n++){const i=[],u=n<2?1.2:o.range(2,3.4),f=n===0?-5.5:n===1?5.5:o.range(-2,2),l=o.range(.05,.1),t=o.range(0,6.28);for(let s=0;s<=110;s++){r.getPointAt(s/110,c),r.getTangentAt(s/110,d);const h=s/110*1e3,m=(f+u*Math.sin(h*l+t))*(.55+.45*y(0,120,h)),w=c.x+d.z*m,g=c.z-d.x*m;i.push(w,J(w,g)+.08,g)}De(i,.12,n<2?.8:o.range(.5,.7),[0,1,0])}}{const e=new p.BufferGeometry;e.setAttribute("position",new p.Float32BufferAttribute(de.pos,3)),e.setAttribute("aSide",new p.Float32BufferAttribute(de.side,3)),e.setAttribute("aW",new p.Float32BufferAttribute(de.w,2)),e.setIndex(de.idx);const a=new p.Mesh(e,Go);a.frustumCulled=!1,pe.add(a)}await _.yield();const Oo=[0,0],va=(e,a)=>{let r=1e18;for(let c=0;c<=Oe;c+=2){const d=ee[c*4]-e,o=ee[c*4+1]-a,n=d*d+o*o;n<r&&(r=n)}return Math.sqrt(r)},Ho=(e,a,r)=>e>C.x0-r&&e<C.x1+r&&a>C.z0-r&&a<C.z1+r,Ko=(e,a,r)=>Math.hypot(e-re[0],a-re[2])<190+r;{const e=K("trees"),a=[],r=Math.round(60*ve);let c=0;for(;a.length<r*2&&c++<4e3;){let o,n;if(e.chance(.6)){const x=e.int(4,Oe-4),z=e.range(15,34)*(e.chance(.5)?1:-1);o=ee[x*4]+ee[x*4+2]*z,n=ee[x*4+1]+ee[x*4+3]*z}else n=e.range(-350,1150),o=(e.chance(.5)?1:-1)*e.range(372,452);if(sa(o,n,Oo),Ho(o,n,12)||Ko(o,n,8)||Oo[0]<24||va(o,n)<13)continue;const i=e.range(3,6),u=i*e.range(.5,.75),f=J(o,n),l=e.range(.35,.7),t=new p.IcosahedronGeometry(1,1),s=t.attributes.position,h=t.attributes.normal,m=e.range(0,50);for(let x=0;x<s.count;x++){const z=s.getX(x),P=s.getY(x),B=s.getZ(x),$=1+.38*ce.n3(z*1.9+m,P*1.9,B*1.9);h.setXYZ(x,z,P,B);const D=i*.78+P*$*u*.42;s.setXYZ(x,o+z*$*u-ae[0]*l*D*.5,f+D,n+B*$*u*1.15-ae[1]*l*D*.5)}const w=new p.CylinderGeometry(.045,.12,i*.8,5,3,!0),g=w.attributes.position;for(let x=0;x<g.count;x++){const z=g.getY(x)+i*.4,P=l*z*z/(i*.8)*.5;g.setXYZ(x,o+g.getX(x)-ae[0]*P,f+z,n+g.getZ(x)-ae[1]*P)}const v=(x,z,P)=>{const B=x.attributes.position.count,$=new Float32Array(B*3),D=new Float32Array(B).fill(.25);for(let ke=0;ke<B;ke++)$[ke*3]=z,$[ke*3+1]=P;return x.setAttribute("aTone",new p.BufferAttribute($,3)),x.setAttribute("aBed",new p.BufferAttribute(D,1)),x.deleteAttribute("uv"),x.index?x.toNonIndexed():x};a.push(v(t,1,.5),v(w,.95,.45)),(a.length&31)===0&&await _.yield()}for(const[o,n,i,u,f]of wo){const l=new p.PlaneGeometry(u,f,4,2).rotateX(-Math.PI/2).applyMatrix4(U(o,J(o,n)+.05,n,i)),t=l.attributes.position.count,s=new Float32Array(t*3),h=new Float32Array(t).fill(.25);for(let m=0;m<t;m++){const w=m%5>0&&m%5<4&&m>=5&&m<10;s[m*3]=w?.7:0,s[m*3+1]=w?1:0}l.setAttribute("aTone",new p.BufferAttribute(s,3)),l.setAttribute("aBed",new p.BufferAttribute(h,1)),l.deleteAttribute("uv"),a.push(l.toNonIndexed())}const d=new p.Mesh(Zt(a,!1),Se.cardMaterial({lee:1,side:p.DoubleSide}));d.frustumCulled=!1,pe.add(d)}await _.yield();{const e=K("tussocks"),a=K("bay-tussocks"),r=Math.round(150*Y*ve),c=Math.round(430*Y*ve)+r,d=5,o=c*d,n=Math.round(90*Y*ve),i=new Float32Array((o+n*d)*4),u=new Float32Array((o+n*d)*4);let f=0,l=0;for(;f<o&&l++<2e4;){let h,m;const w=f<r*d?-1:e();if(w<0){const v=a.range(0,6.283),x=4+Math.pow(a(),.7)*44;h=Gt.x+Math.cos(v)*x,m=Gt.z+Math.sin(v)*x}else if(w<.3)h=e.range(-200,200),m=e.range(381.5,396);else if(w<.7){const v=e.int(60,150),x=e.range(-17,17);h=ee[v*4]+ee[v*4+2]*x,m=ee[v*4+1]+ee[v*4+3]*x}else{const v=e.chance(.5)?1:-1,x=e.chance(.4)?e.range(1.2,4.4):e.range(8.2,17);e.chance(.75)?(h=v*(210+x),m=e.range(-45,385)):(h=e.range(-215,215),m=-40-x)}if(Ho(h,m,.8)||w>=0&&Ko(h,m,-3))continue;const g=J(h,m);for(let v=0;v<d&&f<o;v++,f++)i[f*4]=h+e.range(-.35,.35),i[f*4+1]=g,i[f*4+2]=m+e.range(-.35,.35),i[f*4+3]=e.range(.3,.75),u[f*4]=e.range(-.7,.7),u[f*4+1]=e.range(.15,.6),u[f*4+2]=e.range(0,6.28),u[f*4+3]=e.range(.5,1)}{const h=K("cone-tussocks");for(let m=0;m<n;m++){const w=h.range(0,6.283),g=58+Math.pow(h(),.8)*124,v=re[0]+Math.cos(w)*g,x=re[2]+Math.sin(w)*g,z=J(v,x);for(let P=0;P<d;P++,f++)i[f*4]=v+h.range(-.5,.5),i[f*4+1]=z,i[f*4+2]=x+h.range(-.5,.5),i[f*4+3]=h.range(.45,1),u[f*4]=h.range(-.7,.7),u[f*4+1]=h.range(.15,.6),u[f*4+2]=h.range(0,6.28),u[f*4+3]=h.range(.55,1)}}const t=new p.InstancedBufferGeometry;t.setAttribute("position",new p.Float32BufferAttribute([-.5,0,0,.5,0,0,-.5,.5,0,.5,.5,0,-.5,1,0,.5,1,0],3)),t.setIndex([0,1,2,1,3,2,2,3,4,3,5,4]),t.setAttribute("iP",new p.InstancedBufferAttribute(i,4)),t.setAttribute("iR",new p.InstancedBufferAttribute(u,4)),t.instanceCount=f;const s=new p.Mesh(t,new p.ShaderMaterial({uniforms:{...ye,...tt},vertexShader:`
${wt}
${uo}
uniform float uTime;
attribute vec4 iP, iR;
varying float vS;
void main(){
  float s = position.y;
  float lay = sw_gustLay(iP.xz, uTime) + .08 * sin(uTime * 5. + iR.z);
  float lean = iR.y + 1.5 * lay, bend = .35 * (.3 + lay) * s * s * iP.w;
  vec3 dir = normalize(vec3(SW_WD.x * lean - SW_WD.y * iR.x, 1., SW_WD.y * lean + SW_WD.x * iR.x));
  vec3 base = iP.xyz + dir * (iP.w * s) + vec3(SW_WD.x * bend, -.3 * lay * s * s * iP.w, SW_WD.y * bend);
  vec4 mv = viewMatrix * vec4(base, 1.);
  vec3 p = base + vec3(position.x * max(.03 * (1. - .7 * s), 1.25 * sw_px(-mv.z)) * 2., 0., 0.);
  vS = iR.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,fragmentShader:`
uniform vec3 uCard, uGraphite, uCharcoal;
varying float vS;
void main(){ gl_FragColor = vec4(mix(uCard, mix(uGraphite, uCharcoal, .3), vS), 1.); }`,side:p.DoubleSide,fog:!1}));s.frustumCulled=!1,pe.add(s)}await _.yield();const dt=qe==="clear"?9:10,Uo=[];{const e=K("clouds"),a=new p.InstancedBufferGeometry;a.setAttribute("position",new p.Float32BufferAttribute([-2.7,-.3,0,2.7,-.3,0,-2.7,1.5,0,2.7,1.5,0],3)),a.setIndex([0,1,2,1,3,2]);const r=new Float32Array(dt);for(let m=0;m<dt;m++)r[m]=e.int(1,90);a.setAttribute("aSeed",new p.InstancedBufferAttribute(r,1));const c=new p.ShaderMaterial({uniforms:{...ye},vertexShader:`
attribute float aSeed;
attribute mat4 aM;        // the sheet's place, facing and size
varying vec3 vP;
varying vec3 vQ;        // the sheet's own coordinates (x along it, y up), and which end faces the light
varying float vSeed;
void main(){
  vec4 wp = aM * vec4(position, 1.);
  vP = wp.xyz; vSeed = aSeed;
  vQ = vec3(position.xy, 1.5);       // the light is always drawn on the same hand of the sheet
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,fragmentShader:`
${Ee}
varying vec3 vP, vQ;
varying float vSeed;
void main(){
  float sd = floor(vSeed + .5);                          // a whole number: the same at every pixel of the sheet
  vec2 p = vec2(vQ.x * (vQ.z > 0. ? 1. : -1.), vQ.y);    // x toward the light
  float fp = max(max(fwidth(p.x), fwidth(p.y)), 1e-5);   // one pixel, in the sheet's own units (taken before the loops)
  float wn = sw_vn2(p * 3.1 + sd), wn2 = sw_vn2(p * 1.3 + sd * 5.);
  // eleven rounds (seven along the body, four heaped on it) give the cumulus its form: d = distance to the edge of them
  // all (inside < 0). Only FOUR OR FIVE of them are drawn, each as one loose pencil arc over its own top: an arc lifts
  // off at both ends, so the outline never closes, and runs on a little way inside its neighbour (the hand's overshoot)
  float d = 1e3, line = 0.;
  for (int i = 0; i < 11; i++) {
    float fi = float(i), h1, h2, r; vec2 c;
    if (i < 7) { h1 = sw_h11(sd + fi * 3.1); h2 = sw_h11(sd * 1.7 + fi * 5.3);
      c = vec2(-1.75 + 3.5 * (fi + .2 + .6 * h1) / 7., .12 + .2 * h2 - .1 * abs(fi - 3.) * .3); r = .4 + .26 * h2 + .1 * (1. - abs(fi - 3.) / 3.); }
    else { float fj = fi - 7.; h1 = sw_h11(sd * 2.3 + fj * 7.7); h2 = sw_h11(sd + 40. + fj * 2.9);
      c = vec2(-.95 + .68 * fj + .3 * (h1 - .5), .58 + .3 * h2 - .12 * abs(fj - 1.5)); r = .36 + .2 * h1; }
    vec2 q = p - c; float lq = length(q), di = lq - r;
    d = min(d, di);
    float drawn = step(i < 7 ? .3 : .12, sw_h11(sd * 3.7 + fi * 1.9));
    float ang = atan(q.x, q.y + 1e-5);                                   // 0 over the round's top, positive toward the light
    float mid = (h1 - .5) * .7, half0 = .9 + .7 * h2;                  // where the arc lies and how far it runs (radians)
    float along = 1. - smoothstep(half0 * .55, half0, abs(ang - mid));   // the pressure lifts toward both ends
    float w = (.8 + .7 * wn) * fp;                                       // half the line's width: 2 to 3 pixels in all
    line = max(line, drawn * along * (1. - smoothstep(w, w + fp, abs(di))));
  }
  // an arc is kept only on the outline of the whole (with its overshoot of a tenth of a round into its neighbour)
  line *= 1. - smoothstep(.07, .16, -d);
  float fw = sw_foot(vP), th = sw_tooth(vP, fw);
  // THE SHADED BASE: charcoal strokes at the hand's one slant, three to six pixels wide (the two pitches the pixel can
  // hold, cross-faded by its footprint), the tone read once for each stroke so the shade ends in stroke tips; heaviest
  // low in the body and on the side away from the light, none on the heads
  vec2 rq = vec2(p.x * .866 + p.y * .5, p.y * .866 - p.x * .5);          // along and across the strokes
  float body = (1. - smoothstep(-.22, .02, d)) * smoothstep(-.3, -.1, p.y) * (1. - smoothstep(.2, .78, p.y + .3 * (wn2 - .5)));
  float blot = smoothstep(.2, .7, sw_vn2(p * vec2(1.9, 2.7) + sd * 2.1));
  float tone = body * (.45 + .55 * blot) * (1. - .45 * smoothstep(-1., 1.6, p.x));
  float lvh = log2(fp * 5.), lh0 = floor(lvh), ph0 = exp2(lh0), ph1 = ph0 * 2.;
  float frq = max(fwidth(rq.y), 1e-5);
  vec2 gq = vec2(dFdx(rq.y), dFdy(rq.y)), gt = vec2(dFdx(tone), dFdy(tone));
  float tsl = dot(gt, gq) / max(dot(gq, gq), 1e-8);
  float c0 = rq.y / ph0, c1 = rq.y / ph1;
  float t0 = tone + clamp(tsl * (floor(c0) + .5 - c0) * ph0, -.3, .3) + .16 * (sw_h11(floor(c0) * 1.7 + sd) - .5);
  float t1 = tone + clamp(tsl * (floor(c1) + .5 - c1) * ph1, -.3, .3) + .16 * (sw_h11(floor(c1) * 1.7 + sd + 3.) - .5);
  float under = mix(sw_laidE(c0, frq / ph0, (t0 - .3) / .25, .46, 1.3), sw_laidE(c1, frq / ph1, (t1 - .3) / .25, .46, 1.3), smoothstep(.25, .75, lvh - lh0)) * (.7 + .5 * th);
  // one touch of chalk on the lit head: a few short strokes three to six pixels wide, laid along the rubbing just inside
  // the arcs (the two stroke widths the pixel can hold, cross-faded by its footprint)
  float lv = log2(fp * 4.5), l0 = floor(lv), pw0 = exp2(l0), pw1 = pw0 * 2.;
  float ck = mix(sw_vn2(vec2(rq.y / pw0 + sd, rq.x / (pw0 * 7.))), sw_vn2(vec2(rq.y / pw1 + sd + 5., rq.x / (pw1 * 7.))), smoothstep(.15, .85, lv - l0));
  float head = smoothstep(.3, .75, p.y) * smoothstep(-.6, .5, p.x) * smoothstep(.03, .09, -d) * (1. - smoothstep(.22, .5, -d)) * smoothstep(.36, .5, ck) * smoothstep(.2, .5, wn2);
  // the marks alone are laid on the sheet (the sky and the ranges behind show between them)
  float rubU = tone * (.5 + .6 * th) * (.6 + .4 * sw_vn2(vec2(rq.x * 1.6 + sd, rq.y * 9.)));      // the base is rubbed first (the card's tooth through it), then hatched
  float aL = line * (.72 + .28 * wn) * (.75 + .5 * th), aU = clamp(max(under * .5, rubU * .42), 0., .55), aH = head * .9 * (.6 + .6 * th);
  vec3 col = mix(uGraphite, uCharcoal, .3);
  col = mix(col, uChalk, step(max(aU, aL), aH));
  gl_FragColor = vec4(col, clamp(max(max(aU, aL), aH), 0., 1.));
}`,side:p.DoubleSide,fog:!1,transparent:!0,depthWrite:!1}),d=new p.Mesh(a,c);d.frustumCulled=!1;const o=new p.InstancedBufferAttribute(new Float32Array(dt*16),16);o.setUsage(p.DynamicDrawUsage),a.setAttribute("aM",o),a.instanceCount=dt;const n=[[-1400,600,1265,200],[-140,640,1985,185],[940,520,2215,190],[-1510,560,560,180],[1820,540,1180,190],[1500,470,330,190],[-700,700,2700,170],[-250,1150,2160,250],[-1280,1120,1530,240]];for(let m=0;m<dt;m++){let w;if(m<9){const g=n[m];w={x:g[0]+e.range(-60,60),y:g[1]+e.range(-25,25),z0:g[2]+e.range(-60,60),sx:g[3]*e.range(.9,1.08),sy:.9}}else qe==="bank"?w={x:e.range(1e3,1700),y:e.range(430,540),z0:I.z+e.range(100,900),sx:e.range(110,160),sy:.8}:w={x:e.range(560,740),y:e.range(290,350),z0:-700+(m-7)*900+e.range(-80,80),sx:e.range(72,104),sy:.62};w.sy*=w.sx*e.range(.85,1.1),Uo.push(w)}pe.add(d);const i=new p.Quaternion,u=new p.Euler(0,0,0,"YXZ"),f=A(0,0,0),l=A(1,1,1),t=new p.Matrix4,s=A(0,0,0),h=(m,w)=>{ze.pointAt(ie(w,0,1),s);for(let g=0;g<dt;g++){const v=Uo[g],x=v.z0-60*Math.sin(m*.05+g);f.set(v.x,v.y,x),l.set(v.sx,v.sy,1),u.set(Math.atan2(v.y-s.y,Math.hypot(s.x-v.x,s.z-x)),Math.atan2(s.x-v.x,s.z-x),0),i.setFromEuler(u),t.compose(f,i,l),t.toArray(o.array,g*16)}o.needsUpdate=!0};h(0,0),Ft.push((m,w,g)=>h(w,g))}await _.yield();{const e=K("dust"),a=Math.round(280*Y*ve),r=new Float32Array(a*4),c=new Float32Array(a*4);for(let n=0;n<a;n++){const i=e.int(84,156),u=e.range(-12,12);r[n*4]=ee[i*4]+ee[i*4+2]*u,r[n*4+1]=e.range(.2,1.2),r[n*4+2]=ee[i*4+1]+ee[i*4+3]*u,r[n*4+3]=e.range(.8,3.2),c[n*4]=e.range(0,1),c[n*4+1]=e.range(.1,.22),c[n*4+2]=e.range(60,150),c[n*4+3]=e.range(.8,3.2)}const d=new p.InstancedBufferGeometry;d.setAttribute("position",new p.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,-.5,.5,0,.5,.5,0],3)),d.setIndex([0,1,2,1,3,2]),d.setAttribute("iP",new p.InstancedBufferAttribute(r,4)),d.setAttribute("iR",new p.InstancedBufferAttribute(c,4)),d.instanceCount=a;const o=new p.Mesh(d,new p.ShaderMaterial({uniforms:{...ye},vertexShader:`
${wt}
uniform float uTime, uWind;
attribute vec4 iP, iR;
varying float vK;
void main(){
  float ph = fract(uTime * iR.y * (.7 + .5 * uWind) + iR.x);
  float env = sin(3.14159 * ph);
  vec3 c = iP.xyz + vec3(sin(ph * 7. + iR.x * 40.) * 2.5 + ${(-ae[0]).toFixed(4)} * ph * iR.z, iR.w * ph * ph, ${(-ae[1]).toFixed(4)} * ph * iR.z);
  vec4 mv = viewMatrix * vec4(c, 1.);
  float yaw = iR.x * 40.;
  vec3 dir = vec3(cos(yaw) * .9 + .1, .12 * sin(yaw * 3.), sin(yaw) * .35);
  vec3 p = c + dir * (position.x * iP.w * env) + vec3(0., position.y * max(.09, 2.6 * sw_px(-mv.z)) * step(.02, env), 0.);
  vK = .55 + .45 * fract(iR.x * 7.);
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,fragmentShader:`
uniform vec3 uCard, uCharcoal;
varying float vK;
void main(){ gl_FragColor = vec4(mix(uCard, uCharcoal, vK * .8), 1.); }`,side:p.DoubleSide,fog:!1}));o.frustumCulled=!1,pe.add(o)}const jo=(()=>{const e=K("devil"),a={pos:de.pos,side:de.side,w:de.w,idx:de.idx};de.pos=[],de.side=[],de.w=[],de.idx=[];for(let d=0;d<7;d++){const o=[],n=e.range(0,6.28),i=e.range(7,11),u=e.range(.5,1.4),f=d<4?150:93;for(let l=0;l<=f;l++){const t=l/150,s=40*Math.pow(t,1.25),h=(1.2+8.5*Math.pow(t,1.6))*(1+.28*Math.sin(t*31*u+n*3))+1.2*Math.sin(t*57+n),m=n+t*i*6.283;o.push(Math.cos(m)*h+2.4*Math.sin(t*5+n),s+.8*Math.sin(m*.5),Math.sin(m)*h)}De(o,d<4?.13:.32,e.range(.8,1),[0,1,0])}const r=new p.BufferGeometry;r.setAttribute("position",new p.Float32BufferAttribute(de.pos,3)),r.setAttribute("aSide",new p.Float32BufferAttribute(de.side,3)),r.setAttribute("aW",new p.Float32BufferAttribute(de.w,2)),r.setIndex(de.idx),Object.assign(de,a);const c=new p.Mesh(r,Go);return c.frustumCulled=!1,pe.add(c),c})();{const e=[-52,195],a=[-38,372],r=Math.hypot(a[0]-e[0],a[1]-e[1]);tt.uDevilDir.value.set((a[0]-e[0])/r,(a[1]-e[1])/r),Ft.push((c,d)=>{const o=ie((ye.uRoute.value.z-100)/250,0,1),n=e[0]+(a[0]-e[0])*o,i=e[1]+(a[1]-e[1])*o;jo.position.set(n+2.5*Math.sin(d*.6),gt?0:-900,i),jo.rotation.y=d*2.3,tt.uDevil.value.set(n,i,30,gt?1:0)})}await _.yield();{const a=K("cranes"),r=[],c=[],d=[],o=(b,S,T,k,F,O)=>(r.push(b,S,T),c.push(k,F,O,0),r.length/3-1),n=(b,S,T,k)=>d.push(b,S,T,b,T,k);{const b=(k,F,O)=>{const G=[];for(let E=0;E<8;E++){const X=E/8*Math.PI*2;G.push(o(Math.cos(X)*F,O+Math.sin(X)*F*.85,k,0,0,E&1?.5:0))}return G},S=[b(.52,.05,.05),b(.3,.15,.02),b(0,.2,0),b(-.32,.15,.01),b(-.58,.035,.04)];for(let k=0;k<S.length-1;k++)for(let F=0;F<8;F++)n(S[k][F],S[k][(F+1)%8],S[k+1][(F+1)%8],S[k+1][F]);const T=[[.48,.05,.075],[.78,.085,.055],[1.08,.115,.045],[1.3,.13,.04]];for(const[k,F]of[[1,0],[0,1]])for(let O=0;O<T.length-1;O++){const G=T[O],E=T[O+1];n(o(-G[2]*k,G[1]-G[2]*F,G[0],0,3,0),o(G[2]*k,G[1]+G[2]*F,G[0],0,3,1),o(E[2]*k,E[1]+E[2]*F,E[0],0,3,1),o(-E[2]*k,E[1]-E[2]*F,E[0],0,3,0))}for(const[k,F]of[[1,0],[0,1]])n(o(-.04*k,.13-.04*F,1.28,0,3,0),o(.04*k,.13+.04*F,1.28,0,3,1),o(.075*k,.14+.075*F,1.38,0,3,1),o(-.075*k,.14-.075*F,1.38,0,3,0)),d.push(o(-.07*k,.14-.07*F,1.38,0,3,.5),o(.07*k,.14+.07*F,1.38,0,3,.5),o(0,.125,1.7,0,4,.5));for(const k of[-.05,.05])for(const[F,O]of[[1,0],[0,1]])n(o(k-.022*F,-.07-.022*O,-.42,0,2,0),o(k+.022*F,-.07+.022*O,-.42,0,2,1),o(k+.018*F,-.1+.018*O,-1.52,0,2,1),o(k-.018*F,-.1-.018*O,-1.52,0,2,0)),d.push(o(k-.02*F,-.1-.02*O,-1.5,0,2,.5),o(k+.02*F,-.1+.02*O,-1.5,0,2,.5),o(k+.07*F,-.13,-1.7,0,2,.5));for(const k of[-1,1]){const F=q=>.3-.22*q*q,O=q=>-.36+.26*q*q*q;let G=null,E=null;for(let q=0;q<=4;q++){const R=q/4*.78,Q=k*(.14+1.1*R),L=o(Q,.03,F(R),R,1,0),ne=o(Q,.03,O(R),R,1,1);G!==null&&(k>0?n(G,E,ne,L):n(G,L,ne,E)),G=L,E=ne}const X=k*(.14+1.1*.78),V=F(.78),H=O(.78),se=(V-H)/5;for(let q=0;q<5;q++){const R=V-se*q,Q=R-se*.92,L=.36-.2*q,ne=.42-.03*Math.abs(q-1.5),xe=o(X,.03,R,.78,1,0),ue=o(X,.03,Q,.78,1,1),te=o(X+k*ne,.03,L-.05,1,1,1),le=o(X+k*ne,.03,L+.02,1,1,0);k>0?n(xe,ue,te,le):n(xe,le,te,ue)}}}const i=new p.InstancedBufferGeometry;i.setAttribute("position",new p.Float32BufferAttribute(r,3)),i.setAttribute("aK",new p.Float32BufferAttribute(c,4)),i.setIndex(d);const u=new Float32Array(160),f=new Float32Array(160),l=new p.InstancedBufferAttribute(u,4),t=new p.InstancedBufferAttribute(f,4),s=new Float32Array(40),h=new p.InstancedBufferAttribute(s,1);l.setUsage(p.DynamicDrawUsage),t.setUsage(p.DynamicDrawUsage),h.setUsage(p.DynamicDrawUsage),i.setAttribute("iPos",l),i.setAttribute("iDir",t),i.setAttribute("iBank",h),i.instanceCount=40;const m=new p.Mesh(i,new p.ShaderMaterial({uniforms:{...ye},vertexShader:`
uniform float uTime;
attribute vec4 aK, iPos, iDir;   // iPos: place, flying 0..1; iDir: yaw, pitch, phase, size
attribute float iBank;           // bank into the turn (radians, port wing down)
varying vec3 vP; varying vec4 vK;
void main(){
  float fly = iPos.w, T = uTime * 6.4 + iDir.z;
  vec3 p = position;
  if (aK.y > .5 && aK.y < 1.5) {          // wing: a crane's shallow beat in two straight lengths, the arm from the shoulder
    // and the hand from the wrist, the hand a little behind the arm; the tip never stands more than about 29 degrees above
    // or 18 below the shoulders, so the wings are a shallow M or a nearly flat line, never an arc. Folded on the ground.
    float w = aK.x, sx = p.x < 0. ? -1. : 1.;
    float a1 = fly * (.3 * sin(T) + .09), a2 = a1 + fly * .27 * sin(T - 1.05);
    float span = abs(p.x) - .14, s1 = min(span, .58), s2 = max(span - .58, 0.);
    p.x = sx * (.14 + (s1 * cos(a1) + s2 * cos(a2)) * mix(.1, 1., fly));
    p.y += s1 * sin(a1) + s2 * sin(a2) + (1. - fly) * .06;
    p.z -= (1. - fly) * w * .55;
  } else if (aK.y > 2.5) {                // neck and head: down to the ground to feed, stretched out in flight
    float nd = (1. - fly) * (1.2 + .3 * sin(uTime * 1.6 + iDir.z * 3.));
    vec2 q = vec2(p.z - .48, p.y - .04);
    p.z = .48 + q.x * cos(nd) + q.y * sin(nd); p.y = .04 - q.x * sin(nd) + q.y * cos(nd);
  } else if (aK.y > 1.5) {                // legs: trailing in flight, under the bird on the ground
    float ld = (1. - fly) * 1.45;
    vec2 q = vec2(p.z + .4, p.y + .06);
    p.z = -.4 + q.x * cos(ld) + q.y * sin(ld); p.y = -.06 - q.x * sin(ld) + q.y * cos(ld);
  }
  p.y -= fly * .1 * sin(T);
  // R8: a bird reads as a bird or is not drawn: where its whole span would stand under about a fortieth of the frame's
  // height (a white sliver) it is drawn down to nothing (the pixel's footprint at the bird's own depth: lawful)
  float thou = max(-(viewMatrix * vec4(iPos.xyz, 1.)).z, .05) * 2. / max(projectionMatrix[1][1] * 1000., 1e-3);
  p *= iDir.w * smoothstep(20., 30., 2.2 * iDir.w / thou);
  float cb = cos(iBank), sb = sin(iBank);
  p = vec3(p.x * cb + p.y * sb, p.y * cb - p.x * sb, p.z);
  float cp = cos(iDir.y), sp = sin(iDir.y), cy = cos(iDir.x), sy = sin(iDir.x);
  p = vec3(p.x, p.y * cp + p.z * sp, p.z * cp - p.y * sp);
  p = vec3(p.x * cy + p.z * sy, p.y, p.z * cy - p.x * sy) + iPos.xyz;
  vP = p; vK = aK;
  gl_Position = projectionMatrix * viewMatrix * vec4(p, 1.);
}`,fragmentShader:`
${Ee}
varying vec3 vP; varying vec4 vK;
void main(){
  float fw = sw_foot(vP), th = sw_tooth(vP, fw);
  vec3 chalk = mix(uCard, uChalk, .86 + .14 * th);
  vec3 col = chalk;
  float fe = max(fwidth(vK.z), 1e-4), e = min(vK.z, 1. - vK.z) / fe;
  float line = 1. - smoothstep(1., 2.2, e);
  if (vK.y < .5) col = mix(chalk, uGraphite, line * .75);
  else if (vK.y < 1.5) {                  // wing: charcoal tip, pencil edge
    float tip = smoothstep(.56, .66, vK.x + .05 * (th - .5));
    col = mix(chalk, mix(uCharcoal, uGraphite, .25), tip * (.85 + .15 * th));
    // the flight feathers: short pencil lines in from the trailing edge, and the wing's own outline
    float fq = vK.x * 13., ff = max(fwidth(fq), 1e-4);
    float feather = (1. - smoothstep(.6, 1.4, abs(fract(fq) - .5) / ff)) * smoothstep(.45, .6, vK.z) * smoothstep(.5, .25, ff);
    col = mix(col, uGraphite, max(line * .85, feather * .6) * (1. - tip));
  }
  else if (vK.y < 2.5) col = mix(uGraphite, uCharcoal, .35);
  else if (vK.y < 3.5) col = mix(chalk, uGraphite, .25 + .55 * line);
  else col = mix(uGraphite, uCharcoal, .5);
  gl_FragColor = vec4(col, 1.);
}`,side:p.DoubleSide,fog:!1}));m.frustumCulled=!1,pe.add(m);const w=[];for(let b=0;b<40;b++){let S=a.range(-150,150);S>4&&S<64&&(S+=62),Math.abs(S)<20&&(S=S<0?S-20:S+20),b===0&&(S=-24);const T=S<0?-1:1,k=T*(14+Math.abs(a.range(-70,46))*.8);w.push({gx:S,gz:a.range(383,395.5),gyaw:a.range(-3.1,3.1),delay:b===0?0:a.range(0,.05),lead:b===0?17/ze.length:a.range(30,120)/ze.length,ox:b===0?-12.5:k,oy:b===0?5:a.range(3,22),orbR:a.range(34,60),orbH:a.range(84,128),orbA:a.range(0,6.28),size:b===0?2.3:a.range(1.5,1.9),ph:a.range(0,6.28),side:T})}const g=K("crane-near");for(let b=1;b<=Math.min(8,39);b++)w[b].lead=g.range(24,50)/ze.length,w[b].ox=w[b].side*g.range(15,28),w[b].oy=g.range(2,12),w[b].delay=g.range(0,.02),w[b].size=g.range(1.7,2);const v=K("crane-climb");for(let b=1,S=0;b<40;b+=2,S++){const T=S<10;w[b].lead2=T?([20,26,22,30,34,24,28,18,25,36][S]+v.range(-1.5,1.5))/ze.length:v.range(35,100)/ze.length,w[b].lat=T?[-18,16,-20,-26,20,-23,-17.5,24,-30,-19][S]-v.range(0,1.5)*(S===1||S===4||S===7?-1:1):v.range(24,50),w[b].up2=T?[-2,4,-6,2,0,5,-4,3,-8,1][S]+v.range(-1,1):v.range(-6,12);const k=T&&S<4;w[b].latTop=k?v.range(62,76):v.range(86,150),w[b].upTop=v.range(42,64),w[b].size=T?v.range(2,2.4):v.range(1.7,2),w[b].leadRun=T?[34,30,58,44,34,52,30,27,62,40][S]/ze.length:w[b].lead2,w[b].latRun=T?[-18,26,-30,-24,22,-38,-20,38,-44,-27][S]:w[b].latTop,w[b].upRun=T?[3,-8,12,7,6,15,5,-7,10,8][S]:w[b].upTop,T&&(w[b].leadU=[18,22,26,19,24,30,20,17,28,23][S]/ze.length,w[b].latU=[-14,15,-12,-17,13,-19,-15,17,-22,-16][S],w[b].upU=[6,0,11,-3,9,14,9,-3,2,3][S])}const x=A(0,0,0),z=A(0,0,0),P=[0,0],B=(b,S)=>{if(ct(b,S),b>1){const T=(b-1)*ze.length;S.x+=eo[0]*T,S.z+=eo[1]*T}return S},$=13,D=$+1.5,ke=4,Re=2,Ie=Math.round(.06*N),Ae=Math.round(.2*N),Ne=20,ot=D+3+Ne*ze.length/N,$t=(b,S)=>{const T=Math.round(ie(b,0,1)*N),k=Math.max(0,T-Ie),F=Math.min(N,T+Ae),O=S.x,G=S.y,E=S.z;let X=1e18,V=k;for(let H=k;H<=F;H+=Re){const se=O-M[H*3],q=G-M[H*3+1],R=E-M[H*3+2],Q=se*se+q*q+R*R;Q<X&&(X=Q,V=H)}if(X<ot*ot){if(V+Re>F)for(let H=0;H<Ne&&V<N;H++){const se=V*3+3,q=O-M[se],R=G-M[se+1],Q=E-M[se+2],L=q*q+R*R+Q*Q;if(L>=X)break;X=L,V++}else if(V===k)for(let H=0;H<Ne&&V>0;H++){const se=V*3-3,q=O-M[se],R=G-M[se+1],Q=E-M[se+2],L=q*q+R*R+Q*Q;if(L>=X)break;X=L,V--}}if(X<(D+3)*(D+3)){let H=1e18,se=V,q=0;for(let R=Math.max(V-2,0),Q=Math.min(V+2,N);R<Q;R++){const L=R*3,ne=M[L+3]-M[L],xe=M[L+4]-M[L+1],ue=M[L+5]-M[L+2];let te=((O-M[L])*ne+(G-M[L+1])*xe+(E-M[L+2])*ue)/(ne*ne+xe*xe+ue*ue);te=te<0?0:te>1?1:te;const le=O-M[L]-ne*te,me=G-M[L+1]-xe*te,Te=E-M[L+2]-ue*te,je=le*le+me*me+Te*Te;je<H&&(H=je,se=R,q=te)}if(H<D*D){const R=se*3,Q=M[R]+(M[R+3]-M[R])*q,L=M[R+1]+(M[R+4]-M[R+1])*q,ne=M[R+2]+(M[R+5]-M[R+2])*q,xe=Math.max(se-1,0)*3,ue=Math.min(se+2,N)*3;let te=M[R+3]-M[xe],le=M[R+4]-M[xe+1],me=M[R+5]-M[xe+2],Te=Math.sqrt(te*te+le*le+me*me),je=M[ue]-M[R],ut=M[ue+1]-M[R+1],Fe=M[ue+2]-M[R+2],st=Math.sqrt(je*je+ut*ut+Fe*Fe);te=te/Te*(1-q)+je/st*q,le=le/Te*(1-q)+ut/st*q,me=me/Te*(1-q)+Fe/st*q,Te=Math.sqrt(te*te+le*le+me*me),te/=Te,le/=Te,me/=Te;let be=-te*le,Xe=1-le*le,Qe=-me*le;const Ve=Math.max(Math.sqrt(be*be+Xe*Xe+Qe*Qe),1e-4);be/=Ve,Xe/=Ve,Qe/=Ve;const He=1-Math.sqrt(H)/D,pt=ke*He*He,Pe=O-Q+be*pt,nt=G-L+Xe*pt,it=E-ne+Qe*pt,Dt=Math.sqrt(Pe*Pe+nt*nt+it*it);Dt>1e-4&&Math.abs(Pe*te+nt*le+it*me)<.1*Dt?(S.x=Q+Pe/Dt*D,S.y=L+nt/Dt*D,S.z=ne+it/Dt*D):(S.x=Q+be*D,S.y=L+Xe*D,S.z=ne+Qe*D)}}return S},Ot=12,Ht=30,Kt=.05,Ut=(b,S,T,k,F)=>{const O=Math.round(ie(b,0,1)*N),G=Math.max(0,O-Ie),E=Math.min(N,O+Ae);let X=1e18,V=G;for(let R=G;R<=E;R+=Re){const Q=S-M[R*3],L=k-M[R*3+2],ne=Q*Q+L*L;ne<X&&(X=ne,V=R)}if(X>=(F+3)*(F+3))return T;let H=1e18,se=0;for(let R=Math.max(V-2,0),Q=Math.min(V+2,N);R<Q;R++){const L=R*3,ne=M[L+3]-M[L],xe=M[L+5]-M[L+2];let ue=((S-M[L])*ne+(k-M[L+2])*xe)/(ne*ne+xe*xe);ue=ue<0?0:ue>1?1:ue;const te=S-M[L]-ne*ue,le=k-M[L+2]-xe*ue,me=te*te+le*le;me<H&&(H=me,se=M[L+1]+(M[L+4]-M[L+1])*ue)}const q=se+D-T;return H<F*F&&q>0?T+q*(1-y(0,F,Math.sqrt(H))):T},jt=io(C.z1+8-270),Xt=io(C.z1+12),Rt=A(ro.x,0,ro.z),Le=A(0,0,0),Qt=A(0,0,0),Tt=A(0,0,0),qt=A(0,0,0),at=A(0,0,0),Ra=(b,S,T,k)=>{const F=y(jt+b.delay,jt+b.delay+40*W,T);ct(T+b.lead,at);const O=S===0?y(Xt,Xt+70*W,T):0;let G=at.x+b.ox-O*46,E=at.y+b.oy+O*38,X=at.z+O*30;const V=y(ho-20*W+(S===0?45*W:0),ho+90*W,T),H=b.orbA+T*16;if(G+=(Rt.x+Math.cos(H)*b.orbR-G)*V,E+=(b.orbH+6*Math.sin(H*.7)-E)*V,X+=(Rt.z+Math.sin(H)*b.orbR-X)*V,b.ox<0&&V>0&&V<1&&(E+=(Ut(T,G,E,X,Ht)-E)*y(0,Kt,V*(1-V))),b.lead2){const q=y(Mt-70*W,Mt+40*W,T),R=b.leadU?1-y(Ce-60*W,Ce+60*W,T):0,Q=y(We-50*W,We+10*W,T),L=y(We-120*W,We-62*W,T),ne=y(1-125*W,1-62*W,T),xe=b.latRun<0,ue=b.lead2+(b.leadRun-b.lead2)*Q+(R>0?(b.leadU-b.lead2)*R:0);B(T+ue,x),B(T+ue-6*W,z);const te=x.x-z.x,le=x.z-z.z,me=Math.hypot(te,le)||1;ct(T,at);const Te=b.latRun+(b.latTop-b.latRun)*ne,je=b.upRun+(b.upTop-b.upRun)*ne,ut=xe?y(Ce-10*W,Ce+55*W,T)*(1-Q):0;let Fe=(b.lat+(Te-b.lat)*Q)*(1-.55*ut),st=b.up2+(je-b.up2)*L;R>0&&(Fe+=(b.latU-Fe)*R,st+=(b.upU-st)*R);let be=at.y+(x.y-at.y)*Math.max(L,R)+st;xe&&ut<=0&&R<=0&&Math.abs(Fe)<17&&(be=Math.max(be,x.y+Math.sqrt(289-Fe*Fe)));const Xe=x.x+le/me*Fe,Qe=x.z-te/me*Fe;xo(Xe,Qe,P);const Ve=-P[1],He=bo(Ve),pt=ko(Math.max(Ve,0));if(Ve>0&&be>He-32){const Pe=y(0,.35,L),nt=y(pt+12,pt+4,Math.abs(P[0]-ao(Ve)));if(Pe<1&&be>He-30&&(be-=(be-He+30)*nt*(1-Pe)),Pe>0){const it=He+16*nt;it>be&&(be+=(it-be)*y(He-32,He-20,be)*Pe)}}if(G+=(Xe-G)*q,E+=(be-E)*q,X+=(Qe-X)*q,b.leadU){const Pe=Math.sin(Math.PI*q);Fe<0?E+=20*Pe:(G+=le/me*12*Pe,X-=te/me*12*Pe)}b.leadU&&Fe<0&&q>0&&q<1&&(E=Ut(T,G,E,X,Ot)),b.bob=q}const se=Math.sin(Math.PI*F)*(1-F);return k.set(b.gx+(G-b.gx)*F+b.side*se*30,1.1*b.size+(E-1.1*b.size)*F*F*(3-2*F),b.gz+(X-b.gz)*F),F},Vt=(b,S,T,k)=>{const F=Ra(b,S,T,k);return $t(T,k),F};Ft.push((b,S,T)=>{for(let k=0;k<40;k++){const F=w[k],O=Vt(F,k,T,Le),G=F.bob||0;Vt(F,k,T+.0017,Qt);const E=Qt.x-Le.x,X=Qt.y-Le.y,V=Qt.z-Le.z,H=Math.hypot(E,V);let se=H>1e-4?Math.atan2(E,V):F.gyaw;Vt(F,k,T+.0074,Tt),Vt(F,k,T+.0091,qt);let q=Math.hypot(qt.x-Tt.x,qt.z-Tt.z)>1e-4&&H>1e-4?Math.atan2(qt.x-Tt.x,qt.z-Tt.z)-se:0;q-=Math.PI*2*Math.round(q/(Math.PI*2)),s[k]=(ie(q*6.5,-.4,.4)+.12*Math.sin(S*.7+F.ph*3)-(k===0?.42:0))*O;let R=se-F.gyaw;R-=Math.PI*2*Math.round(R/(Math.PI*2));const Q=y(0,.5,O);u[k*4]=Le.x,u[k*4+1]=Le.y+G*2.4*Math.sin(S*1.7+F.ph*5),u[k*4+2]=Le.z,u[k*4+3]=y(0,.25,O),f[k*4]=F.gyaw+R*Q,f[k*4+1]=H>1e-4?ie(Math.atan2(X,H),-.5,.5)*Q:0,f[k*4+2]=F.ph,f[k*4+3]=F.size}l.needsUpdate=!0,t.needsUpdate=!0,h.needsUpdate=!0})}await _.yield();let Xo=ho;{const e=A(0,0,0);for(let a=0;a<=N;a++)if(ct(a/N,e),e.distanceTo(ro)<150){Xo=a/N;break}}{const e=fe.swiftAir,a=fe.object.position;let r=-1,c=-1;for(let d=0;d<=N;d++){const o=M[d*3+1]-a.y;Math.hypot(M[d*3]-a.x-e.x,M[d*3+2]-a.z-e.z)<e.r+20&&o>e.y0-20&&o<e.y1+20&&(r<0&&(r=d),c=d)}if(r=Math.max(r-1,0),c=Math.min(c+1,N),c>r){const d=[];for(let o=2;o<=e.line;o++){d.length=0;for(let i=0;i<o;i++)d.push(ct((r+(c-r)*i/(o-1))/N,A(0,0,0)).sub(a));let n=0;for(let i=r;i<=c;i++){const u=Math.min(Math.floor((i-r)/(c-r)*(o-1)),o-2),f=d[u],l=d[u+1],t=l.x-f.x,s=l.y-f.y,h=l.z-f.z,m=M[i*3]-a.x-f.x,w=M[i*3+1]-a.y-f.y,g=M[i*3+2]-a.z-f.z,v=ie((m*t+w*s+g*h)/(t*t+s*s+h*h),0,1);n=Math.max(n,Math.hypot(m-t*v,w-s*v,g-h*v))}if(n<=.3)break}fe.setFlownLine(d)}}const Pt=fe.anchors.bayNearStake.clone().add(fe.object.position),Qo=Pt.clone().addScaledVector(A(re[0]-Pt.x,0,re[2]-Pt.z).normalize(),30);Qo.y=9;const St=no(Pt.x,13,Pt.z),xa=A(lo.x,105,lo.z),ga=A(0,0,0),ya=(e,a)=>ga.copy(Qo).lerp(xa,y(St-80*W,St-42*W,a)),Ct=A(0,0,0),ba=A(Me.c[0],Me.c[1],Me.c[2]),Ma=e=>{const a=ie(e,0,1)*N,r=Math.min(Math.floor(a),N-1);return Nt[r]+(Nt[r+1]-Nt[r])*(a-r)},za=e=>{const a=ie(e,0,1)*N,r=Math.min(Math.floor(a),N-1);return M[r*3+1]+(M[r*3+4]-M[r*3+1])*(a-r)},ka=A(0,0,0),Aa=e=>1-y(Ce-10*W,Ce+110*W,e),_a=(e,a)=>{const r=y(Ce-60*W,We+40*W,a),c=Ma(a),d=Aa(a);return so(Math.max(c-330+250*r,60),Ct),Ct.y+=(za(a)+62-Ct.y)*(1-r)-44*r*(1-r),d>0&&Ct.lerp(so(Math.max(c-Lt(120,190,y(Mt,Ce,a)),60),ka),d),Ct.lerp(ba,y(1-190*W,1-60*W,a))},Fa=[{at:ya,from:St-118*W,to:St+7*W,weight:.75,fade:.13},{at:lo,from:St+11*W,to:bt+24*W,weight:.85,fade:.25,arc:!0},{at:_a,from:bt+24*W,to:1-40*W,weight:.9,fade:.07,arc:!0,steady:!0}],Pa=e=>.86+(1.14-.86)*y(bt+20*W,bt+150*W,e)+(.92-1.14)*y(Ce-60*W,Ce+60*W,e)+(1-.92)*y(We-20*W,We+80*W,e),Vo=new p.Quaternion,Sa=A(1,1,1),Zo=A(0,0,0),Ca=A(0,1,0);return{scene:pe,path:ze,duration:46,pace:Pa,camera:{fov:62,near:.3,far:7e3,lookAhead:110,bank:.4},pois:Fa,portal:{shape:"circle",radius:mt,style:"ring",glow:0,halo:!1,veil:"#F3EFE4",color:"#77746E",revealDistance:yo},post:{flat:1,exposure:1,bloom:{strength:0},grade:{saturation:1,contrast:1,vignette:0,grain:0}},ride:"none",style:"none",companion:"none",update(e,a,r,c){ct(c,ye.uRoute.value),Mo.value=y(yo+2,yo+14,(1-c)*ze.length),fe.update(e,a,null),fe.setProgress(.355+(c-Xo));for(let d=0;d<Be.length/3;d++)Vo.setFromAxisAngle(Ca,a*(5.2+d%5*.7)*(.6+.5*Je.k)+d),Zo.set(Be[d*3],Be[d*3+1]+.12,Be[d*3+2]),At.setMatrixAt(d,Io.compose(Zo,Vo,Sa));At.instanceMatrix.needsUpdate=!0;for(let d=0;d<Ft.length;d++)Ft[d](e,a,c)},dispose(){fe.dispose()}}}};export{Ga as default};
