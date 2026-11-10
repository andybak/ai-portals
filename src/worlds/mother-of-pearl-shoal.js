import*as h from"three";import{makePath as Ft,makeRng as St,clamp as Ee,lerp as Q,smoothstep as A}from"../kit/core.js";import*as Oe from"../kit/fx.js";import{buildHero as At,lacquerGLSL as Kt}from"../parts/mother-of-pearl-shoal.js";const be=40,kt=14,ae=Math.PI*2,ge=Math.PI/180,Pe=["#050506","#E2B13C","#B8B85E","#DCE0E3","#3FD9A0","#7B5CE0","#D8442B"],c=(a,e,t)=>new h.Vector3(a,e,t),Se=c(23,-80,-151),I=c(23,-60,-151),Ye=c(-74,-16,-220),Ne=c(-.396,.766,-.507).normalize(),Ze=c(0,0,-75),Xe=(a,e,t,l)=>A(e,e+l,a)*(1-A(t-l,t,a)),_t=(a,e,t,l=c())=>l.set(I.x-e*Math.cos(a*ge),I.y+t,I.z-e*Math.sin(a*ge));function jt(){const a=6-11*Math.pow(.5531914893617021,2),e=[[0,6,0],[0,6,-20],[0,6,-38],[0,6,-53],[0,a,-66],[0,-5,-76.5],[0,-22,-89],[0,-40,-101],[0,-52.5,-112],[0,-58.6,-123],[0,-60,-134],[0,-60,-143]].map(n=>c(n[0],n[1],n[2])),t=17;for(let n=0;n<t;n++){const m=n*322/(t-1),f=Ee((m-90)/232,0,1),y=Math.exp(-Math.pow((m-80)/22,2));e.push(_t(m,23+11*f-2*y,-18*f))}const l=c(Ne.x,0,Ne.z).normalize(),r=e[e.length-1].clone(),s=45;e.push(r.clone().addScaledVector(l,20),r.clone().addScaledVector(l,41));for(const n of[12.5,25,37.5])e.push(r.clone().addScaledVector(l,41+s*Math.sin(n*ge)).setY(r.y+s*(1-Math.cos(n*ge))));for(const n of[-60,-45,-30,-15,0])e.push(Ye.clone().addScaledVector(Ne,n));return e}const le={pass:22.5,bite:24,gone:25.5},Ot=6,Nt=3.5,Qt=[[-1.5,-50,27,-119],[-1,-33,25.5,-104.5],[-.5,-15,23.6,-88],[-.22,-6,22.6,-78.5],[0,0,null,null],[.3,12,18.8,-69.4],[.5,27,14.5,-70.2],[.67,43,11.2,-74.2],[.84,55,9.6,-80.4],[1,62,8.8,-85.6],[1.13,70,6.6,-88.4],[1.24,82,3.6,-88.2],[1.36,100,1.8,-85.2],[1.5,110,1.2,-80.8],[1.7,115,.8,-77.2],[1.9,118,.6,-72.8],[2.1,120,1,-67.8],[2.3,122,2,-62],[2.5,124,3.5,-55.2],[2.7,126,5.5,-47.4],[2.85,128,7.5,-40.6],[3,130,9.5,-33]],Ut=-.3,it=[-106,-94],et={flex:1.3,k:.22,off:[le.bite-.7,le.bite-.1]},ut=36,Ht=a=>.3*A(le.pass+.3,le.bite-.4,a),Yt={funnel:[.475,.545],eat:[.632,.636],river:[.5925,.885],ring:[.63,.755]},dt=[{u:.4,rise:5.2},{u:.4265,rise:-5.6},{u:.4475,rise:6.4}],Qe=[[.95,-8.5,-20,1],[1.9,9.5,-31.5,1],[2.7,-11,-41,1],[3.4,8,-49,1],[4.2,-9,-58.5,1],[4.9,9,-67,1],[5.6,-12,-76,1],[6.5,10,-84,1],[.2,4.5,-25,1],[3.9,5.5,-75,1],[4.3,-4.5,-80,1],[2.3,-3.5,-58,1],[6.2,-5.2,-75,2],[6.32,5.4,-77,2],[6.55,1.5,-82.5,2]],mt=5.4,Dt=1,Xt=[.685,.72,.755,.79],$t=.1,Jt=.25,lt=[.1,.2,.68,.84],Et=[7.6,.4],Zt=2.8,tt=c(.472,.643,.604).normalize(),Pt=c().crossVectors(tt,Ne).normalize();function ea(a){const e=c(),t=c(),l=(n,m,f)=>(a.pointAt(n,e),a.tangentAt(n,t),t.y=0,t.normalize(),c(e.x+t.x*m-t.z*mt,e.y-f,e.z+t.z*m+t.x*mt)),r=[c(I.x,I.y+9,I.z),null];for(const n of Xt)r.push(l(n,0,Dt));r.push(l(.79,19,Dt+1.2));const s=Ye.clone().addScaledVector(tt,-27).addScaledVector(Ne,-24);return r.push(r[6].clone().lerp(s,.5).add(c(0,-5,0)),s,Ye.clone().addScaledVector(tt,-11.2)),r[1]=r[0].clone().lerp(r[2],.52).add(c(0,2.5,0)),r}const Ke={t0:1,t1:.9,w2:.626,w3:.664,zw:.04,lift:2,hold:.6,foot:.3},ta=[[.428,0],[.452,.15],[.475,.2],[.55,.53],[.585,.55]],at=(a,e)=>{if(e<=a[0][0])return a[0][1];for(let t=0;t<a.length-1;t++)if(e<=a[t+1][0])return Q(a[t][1],a[t+1][1],(e-a[t][0])/(a[t+1][0]-a[t][0]));return a[a.length-1][1]},aa=(a,e)=>(at(a,e-.014)+at(a,e-.007)+at(a,e)+at(a,e+.007)+at(a,e+.014))/5;function oa(a){const e=a.length,t=c(),l=c(),r=c(),s=c(),n=c(),m=c(),f=c(),y=ea(a),x=a.pointAt(le.pass/be),b=a.tangentAt(le.pass/be),S=Math.atan2(x.z-I.z,x.x-I.x),g=Math.hypot(x.x-I.x,x.z-I.z),q=Math.sign((x.x-I.x)*b.z-(x.z-I.z)*b.x)||1,G=(u,B,O)=>c(I.x+B*Math.cos(S+q*u*ge),O,I.z+B*Math.sin(S+q*u*ge)),K=Qt.map(u=>[le.pass+u[0],G(u[1],u[2]===null?g-Ot:u[2],u[3]===null?x.y-Nt:u[3])]),P=((u,B,O)=>{const F=new h.CatmullRomCurve3(u.map(J=>J[1]),!1,"centripetal");F.arcLengthDivisions=600;const ee=u.length,se=[0],ce=40,ke=c(),we=c();let me=0;for(let J=0;J<ee-1;J++){F.getPoint(J/(ee-1),ke);for(let Y=1;Y<=ce;Y++)F.getPoint((J+Y/ce)/(ee-1),we),me+=ke.distanceTo(we),ke.copy(we);se.push(me)}const ne=me,Be=[F.getPointAt(0),F.getTangentAt(0),F.getPointAt(1),F.getTangentAt(1)],pe=J=>{if(J<=u[0][0])return(J-u[0][0])*B;if(J>=u[ee-1][0])return ne+(J-u[ee-1][0])*O;let Y=0;for(;Y<ee-2&&J>u[Y+1][0];)Y++;return Q(se[Y],se[Y+1],(J-u[Y][0])/(u[Y+1][0]-u[Y][0]))};return{len:ne,D:J=>(pe(J-.12)+2*pe(J)+pe(J+.12))/4,at:(J,Y)=>J<=0?Y.copy(Be[0]).addScaledVector(Be[1],J):J>=ne?Y.copy(Be[2]).addScaledVector(Be[3],J-ne):F.getPointAt(J/ne,Y)}})(K,30,60),i=P.D,v=P.at,o=P.len,d=(u,B,O,F,ee=C(u))=>{const se=P.D(u);P.at(se-7.5*ee,B),P.at(se,O),P.at(se+7.5*ee,F);const ce=et.flex*(1-A(et.off[0],et.off[1],u));if(ce>.001){f.subVectors(F,B).normalize();const ke=f.y;f.multiplyScalar(-ke),f.y+=1,f.lengthSq()<1e-4&&f.set(1,0,0),B.addScaledVector(f.normalize(),ce*Math.sin(se*et.k+.6))}},z=c(),p=c(),w=c(),M=c(),E=c(),D=c(),k=(u,B,O,F=C(u))=>{d(u,z,p,w,F),O.subVectors(w,z).multiplyScalar(.5),M.addVectors(z,w).multiplyScalar(.5).sub(p);const ee=Math.max(O.length(),.001);return M.multiplyScalar(Math.min(1,.3*ee/Math.max(M.length(),.001))),O.multiplyScalar(7.5*F/ee*B).addScaledVector(M,B*B).add(p)};let T=NaN,_=1;const C=u=>{if(u===T)return _;const B=Ht(u);let O=1+B;if(B>0)for(let F=0;F<3;F++)O=1+B*(1-.833*A(.5,1,(k(u,.773,D,O).y-Se.y)/ut));return T=u,_=O,O},W=u=>(k(u,.773,E).y-Se.y)/ut,N=P.D(le.bite),he=u=>A(N-17,N-3,P.D(u)),re=u=>he(u)*(u>le.bite?1-A(.5,.82,W(u)):1);let oe=le.bite,fe=le.gone;for(let u=0;u<30;u++){const B=.5*(oe+fe);W(B)<.5?oe=B:fe=B}const Ge=.5*(oe+fe),ve=Ge/be,Ae=u=>A(it[0],it[1],k(u,.8,E).y),U={whaleD:i,whaleAt:v,whaleLen:o,river:y,whalePose:k,whaleABC:d,whaleBig:C,whaleJaw:re,whaleGape:he,whaleLit:Ae,whaleOn:u=>Ae(u)*(1-A(le.gone-.5,le.gone,u)),mouthH:W,release:Ge,gazeDir(u,B){const O=u*e;a.posAtDist(O,t),a.posAtDist(O+kt,l),B.subVectors(l,t).normalize();const F=(.72*A(.155,.225,u)-.3*A(.345,.385,u)+aa(ta,u))*(1-A(Ke.w2,Ke.w3,u));U.focus(u,s).sub(t).normalize(),B.multiplyScalar(1-F).addScaledVector(s,F).normalize();const ee=.45*Xe(u,ve,.7,.03);ee>.001&&(s.subVectors(y[2],t).normalize(),B.multiplyScalar(1-ee).addScaledVector(s,ee).normalize());const se=.5*A(ve,.705,u)+.3*A(.78,.86,u);return s.subVectors(Ye,t).normalize(),B.multiplyScalar(1-se).addScaledVector(s,se).normalize(),B},gazeAt(u,B){return U.gazeDir(u,r),a.posAtDist(u*e,B),B.addScaledVector(r,40)},stage(u,B){const O=u*be,F=Ee(O,le.bite,le.bite+Ke.hold);return k(F,Ke.zw,B),B.y+=Ke.lift,B.lerp(m.set(Se.x,Se.y+4,Se.z),Ke.foot)},sink(u){return A(le.pass-Ke.t0,le.pass+Ke.t1,u*be)},focus(u,B){const O=U.sink(u);return B.set(I.x,I.y-3*A(.47,.54,u),I.z),O>.001?B.lerp(U.stage(u,n),O):B}};return U.slash=dt.map(u=>{const B=a.pointAt(u.u),O=U.gazeDir(u.u,c()),F=19,ee=B.clone().sub(I),se=ee.dot(O),ce=se*se-(ee.lengthSq()-F*F),ke=ce>0?-se-Math.sqrt(ce):-se,we=B.clone().addScaledVector(O,ke).sub(I).normalize(),me=a.tangentAt(u.u);for(let Y=0;Y<30&&B.distanceTo(s.copy(we).multiplyScalar(F).add(I))<5.7;Y++)we.addScaledVector(me,.02).normalize();const ne=a.tangentAt(u.u);ne.addScaledVector(we,-ne.dot(we)).normalize();const Be=c(0,1,0);Be.addScaledVector(we,-Be.dot(we)).normalize();const pe=ne.multiplyScalar(10.1).addScaledVector(Be,u.rise),J=pe.length();return{u:u.u,n0:we,v:pe.normalize(),omega:J/F,R:F}}),U.slashPos=(u,B,O)=>{const F=U.slash[u],ee=F.omega*B,se=Xe(B,-2,2,.75);return O.copy(F.n0).multiplyScalar(Math.cos(ee)).addScaledVector(F.v,Math.sin(ee)).multiplyScalar(Q(25.5,F.R,se)).add(I)},U}const sa=`
uniform vec3 uMoon, uFreq; uniform float uGain, uSwap, uBelly, uHairW, uHairK, uRim, uDepthK;
varying vec3 vNv, vPv, vOp, vNw, vPw; varying vec2 vUv; varying vec4 vSt; varying float vDim;
void main(){
  if (vDim < 0.004) discard;
  vec3 Nv = normalize(vNv); if (!gl_FrontFacing) Nv = -Nv;
  float dist = length(vPv); vec3 Vv = -vPv / max(dist, 1e-3);
  float px = length(fwidth(vOp)) * 0.7;
  float dia = max(lqHair((vUv.x + vUv.y) * uFreq.x, 1.1), lqHair((vUv.x - vUv.y) * uFreq.x, 1.1));
  float ray = lqHair(vUv.y * uFreq.y, uHairW), rayS = lqHair(vUv.x * uFreq.z, 1.3);
  float key = dot(Nv, normalize(vec3(-0.55, 0.65, 0.52))) * 0.5 + 0.5;
  float rim = smoothstep(0.55, 0.95, 1.0 - abs(dot(Nv, Vv)));
  vec3 gold = lqGold(Nv, Vv, vOp, px);
  // the whale is always drawn side-on (its section faces the lens), so its roundness is painted from the body uv
  // (uv.y: 0 the back .. 3 the belly's keel): green-gold along the back, full gold on the flank, amber shadow under the belly
  // (the back and the upper flank keep their gold; the amber comes in below the flank's mid-line and deepens to the
  // keel, so the belly third of the body lies in shadow and the body reads round)
  // (the belly's amber is a painted shadow: it takes little of the key, so it reads as shade whichever way the animal lies)
  float shade = uBelly * smoothstep(1.1, 2.1, vUv.y);
  gold = mix(gold, LQ_AMBER * (0.72 - 0.3 * smoothstep(1.9, 3.0, vUv.y)) * (0.85 + 0.2 * key) + gold * 0.06, shade);
  gold = mix(gold, gold * vec3(0.5, 1.0, 0.36) + LQ_GREENGOLD * 0.45, uBelly * 0.9 * (1.0 - smoothstep(0.1, 1.05, vUv.y)));
  // a rim of pale leaf along the edges that face the key (upper left): the hero stands off the dark in raking light
  gold += (LQ_GOLD * 0.75 + LQ_SILVER * 0.3) * uRim * rim * smoothstep(-0.15, 0.6, dot(Nv.xy, vec2(-0.647, 0.763))) * (1.0 - 0.85 * shade);
  vec3 silver = lqSilver(vUv * 26.0, 0.5 + 0.62 * key) + LQ_SILVER * 0.25 * rim;
  float sw = mix(vSt.w, 1.0 - vSt.w, uSwap);
  vec3 col = mix(gold, silver, clamp(sw, 0.0, 1.0)) * (1.0 - uHairK * max(dia * vSt.y, ray * vSt.z));
  float part = vSt.x;
  vec3 sail = mix(LQ_VERMILION * (0.62 + 0.5 * key), LQ_GOLD * 1.15, rayS * 0.9) + LQ_GOLD * 0.5 * smoothstep(0.9, 1.0, vUv.y);
  col = mix(col, sail, step(abs(part - 1.0), 0.5));
  col = mix(col, LQ_SMOKE * 0.3 + LQ_SILVER * 0.4 * rim, step(abs(part - 3.0), 0.5));
  vec3 Nsh = normalize(vNw + (hash33(vec3(floor(vUv * 9.0), 1.0)) - 0.5) * 0.8);   // an inlay of small pieces, each its own tilt
  float lit; vec3 sh = lqShell(Nsh, normalize(cameraPosition - vPw), uMoon, hash12(floor(vUv * 9.0)), lit) * 1.25;
  sh *= 1.0 - 0.85 * smoothstep(0.55, 0.7, length(vUv - 0.5)) * (1.0 - smoothstep(0.8, 0.9, length(vUv - 0.5)));
  col = mix(col, sh, step(abs(part - 4.0), 0.5));
  // THE MOUTH (part 5). vSt.z: 0 the gullet and the cheek web by the hinge (shadow), 1 the palate (dim amber, its comb a
  // ghost), over 1 the baleen; vSt.y 1 marks the floor, a deep bowl: darkest along its keel and toward the gullet, with
  // the gold of the rolled lip running a little way down its slopes. Dark amber all through, never black, never a flat panel.
  float mz = min(vSt.z, 1.0), bal = clamp((vSt.z - 1.0) * 2.0, 0.0, 1.0) * step(4.5, part), flr = vSt.y * step(4.5, part);
  float comb = lqHair(vUv.x * 4.5, 1.5) * smoothstep(0.1, 0.7, abs(vUv.y - 1.0));
  float deepM = 0.3 + 0.7 * smoothstep(3.3, 6.8, vUv.x);
  vec3 mouth = LQ_AMBER * (0.25 + (0.3 + 0.3 * key) * mz) * deepM + LQ_GOLD * mz * 0.06 * comb;
  float rimL = smoothstep(0.86, 1.0, abs(vUv.y - 1.0));
  vec3 bowlC = LQ_AMBER * (0.17 + 0.2 * key + 0.5 * rimL) * deepM + LQ_GOLD * 0.4 * rimL * rimL * (0.4 + 0.6 * deepM) + LQ_AMBER * 0.1 * lqHair(vUv.y * 4.0, 1.4) * deepM;
  mouth = mix(mouth, bowlC, flr);
  // the baleen: a comb of gold plates 0.4 m apart, each a tooth that tapers to a point at its hanging tip; between the
  // teeth the comb is open (cut away), so the dark bowl shows through it
  float bt = clamp(vUv.y * 5.0, 0.0, 1.0), cfw = max(fwidth(vUv.x) * 2.5, 1e-4);
  float bw = 0.42 * (1.0 - 0.8 * bt * bt) + 0.02, bd = abs(fract(vUv.x * 2.5) - 0.5);
  if (bal > 0.5 && bd > bw + 0.5 * cfw) discard;
  mouth = mix(mouth, mix(LQ_AMBER * 1.1, LQ_GOLD * (0.85 + 0.4 * key), smoothstep(0.0, 0.5, (bw - bd) / max(bw, 1e-3))) * (1.0 - 0.3 * bt), bal);
  col = mix(col, mouth, step(abs(part - 5.0), 0.5));
  gl_FragColor = vec4(lqDepth(col * uGain * vDim, dist * uDepthK), 1.0);
}`;function vt(a,e,t){return new h.ShaderMaterial({side:h.DoubleSide,fog:!1,uniforms:{uGain:{value:1},uSwap:{value:0},uBelly:{value:0},uRim:{value:0},uDepthK:{value:1},uHairW:{value:1.1},uHairK:{value:.88},uFreq:{value:c(14,8,14)},...t},vertexShader:`
      attribute vec4 aSt; attribute vec4 aW;
      varying vec3 vNv, vPv, vOp, vNw, vPw; varying vec2 vUv; varying vec4 vSt; varying float vDim;
      ${e}
      void main(){
        vOp = position; vUv = uv; vSt = aSt;
        vec3 p = position, n = normal; float dim = 1.0;
        place(p, n, dim);
        vDim = dim; vPw = p; vNw = n;
        vec4 mv = viewMatrix * vec4(p, 1.0); vPv = mv.xyz; vNv = normalize(mat3(viewMatrix) * n);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:a+sa})}class pt{constructor(){this.p=[],this.uv=[],this.st=[],this.w=[],this.f=[],this.idx=[]}v(e,t,l,r,s,n,m,f){return this.p.push(e,t,l),this.uv.push(r,s),this.st.push(n[0],n[1],n[2],n[3]),this.w.push(m[0],m[1],m[2],m[3]),f?this.f.push(f[0],f[1],f[2]):this.f.push(e,t,l),this.p.length/3-1}loft(e,t){for(let l=0;l<e.length-1;l++){const r=e[l],s=e[l+1],n=r.length,m=t?n:n-1;for(let f=0;f<m;f++){const y=(f+1)%n;this.idx.push(r[f],s[f],r[y],r[y],s[f],s[y])}}}fan(e,t){for(let l=0;l<t.length-1;l++)this.idx.push(e,t[l],t[l+1])}build(e){const t=new h.BufferGeometry;return t.setAttribute("position",new h.Float32BufferAttribute(this.p,3)),t.setAttribute("uv",new h.Float32BufferAttribute(this.uv,2)),t.setAttribute("aSt",new h.Float32BufferAttribute(this.st,4)),t.setAttribute("aW",new h.Float32BufferAttribute(this.w,4)),e&&t.setAttribute("aFold",new h.Float32BufferAttribute(this.f,3)),t.setIndex(this.idx),t.computeVertexNormals(),t}}function Le(a,e){let t=0;for(;t<a.length-2&&a[t+1][0]>e;)t++;const l=a[t],r=a[t+1],s=A(0,1,Ee((l[0]-e)/(l[0]-r[0]),0,1));return[Q(l[1],r[1],s),Q(l[2],r[2],s),Q(l[3],r[3],s)]}const $e=(a,e,t,l)=>{const r=Math.cos(a),s=(e+t)*.5;return[l*Math.sin(a),s+(r>0?e-s:s-t)*r]},_e=[[7.5,.1,-.2,.06],[6.9,.36,-.6,.34],[5.6,.6,-.92,.56],[4,.84,-1.14,.7],[2.4,1.02,-1.27,.76],[.4,1.1,-1.3,.76],[-1.6,1.04,-1.14,.68],[-3.5,.84,-.8,.5],[-5,.6,-.5,.3],[-6.2,.38,-.3,.15],[-7.1,.22,-.18,.09]],rt=[.08,3.4];async function na(a){const e=new pt,t=rt[1],l=36,r=(o,d)=>{const[z,p,w]=Le(_e,d),M=(z+p)*.5,E=o>M?(o-M)/Math.max(z-M,.001):(M-o)/Math.max(M-p,.001);return w*Math.sqrt(Math.max(1-E*E,0))},s=(o,d)=>A(.47,.66,o/Math.PI)*A(-2.6,-.4,d),n=[];for(let o=0;o<=30;o++){const d=Q(t,-7.1,o/30),[z,p,w]=Le(_e,d),M=[];for(let E=0;E<l;E++){const D=E/l*ae,k=D>Math.PI?ae-D:D,[T,_]=$e(D,z,p,w),C=s(k,d),W=Math.abs(k/Math.PI-.43)<.02?.55*A(-6.5,-4.5,d):0,N=.62*A(.08,.17,k/Math.PI)*(1-A(.36,.47,k/Math.PI))*A(-6.4,-4.8,d);M.push(e.v(T,_,d,d,k/Math.PI*3,[0,N,Math.max(C,W),.3*A(.7,.95,k/Math.PI)*(1-C*.6)],[0,C,A(-2.5,-7.1,d),0]))}n.push(M)}e.loft(n,!0),await a();{const[o,d,z]=Le(_e,t),p=e.v(0,(o+d)*.5,t-.5,0,1,[5,0,0,0],[0,0,0,0]),w=[];for(let M=0;M<=l;M++){const[E,D]=$e(M/l*ae,o,d,z);w.push(e.v(E*.97,D*.97,t,0,1,[5,0,0,0],[0,0,0,0]))}e.fan(p,w)}const m=26,f=12,y=28,x=14,b=[],S=[],g=[],q=[];for(let o=0;o<=m;o++){const d=Q(t,7.5,o/m),[z,p,w]=Le(_e,d),M=(z+p)*.5,E=z-.36*(z-p),D=Math.acos(Ee((E-M)/Math.max(z-M,.001),-1,1)),k=w*Math.sin(D),T=[],_=[],C=[],W=[],N=[1,0,0,0],he=D/Math.PI*3;for(let $=0;$<=f;$++){const U=Q(-D,D,$/f),[u,B]=$e(U,z,p,w);T.push(e.v(u,B,d,d,Math.abs(U)/Math.PI*3,[0,.55*A(.07,.16,Math.abs(U)/Math.PI)*(1-A(6,7.3,d)),0,0],[0,0,0,0]))}for(let $=0;$<=x;$++){const U=$/x;_.push(e.v(Q(k,-k,U),E+(.1+.16*w)*Math.sin(Math.PI*U),d,d,U*2,[5,0,1,0],[0,0,0,0]))}const re=Math.min(.17,.5*k),oe=[[1.5,-.9],[1.1,.35],[.45,.8],[-.05,.5]],fe=k-1.5*re,Ge=E-.9*re;for(const $ of oe)C.push(e.v(k-$[0]*re,E+$[1]*re,d,d,he,[0,0,0,0],N));for(let $=0;$<=y;$++){const U=Q(D,ae-D,$/y),u=U>Math.PI?ae-U:U,[B,O]=$e(U,z,p,w),F=s(u,d);C.push(e.v(B,O,d,d,u/Math.PI*3,[0,0,F*(1-.5*A(6,7.5,d)),.3*A(.7,.95,u/Math.PI)*(1-F*.6)],[1-F*(1-A(t,t+3.2,d)),F*(1-A(4.6,7.35,d)),0,0]))}for(let $=3;$>=0;$--)C.push(e.v(-(k-oe[$][0]*re),E+oe[$][1]*re,d,d,he,[0,0,0,0],N));const ve=.5*(E-p),Ae=.25*(1-A(4.6,7.35,d))*A(t,t+.8,d);for(let $=0;$<=x;$++){const U=$/x,u=Math.sin(Math.PI*U);W.push(e.v(Q(-fe,fe,U),Ge-ve*Math.pow(u,.7),d,d,U*2,[5,1,.16,0],[1,Ae*u,0,0]))}b.push(T),S.push(_),g.push(C),q.push(W)}e.loft(b,!1),e.loft(S,!1),e.loft(g,!1),e.loft(q,!1),await a();for(const o of[-1,1]){const d=[];for(let z=0;z<=16;z++){const p=z/16,w=Q(t,7.5,p),[M,E,D]=Le(_e,w),k=(M+E)*.5,T=M-.36*(M-E),_=Math.acos(Ee((T-k)/Math.max(M-k,.001),-1,1)),C=D*Math.sin(_),W=(.1+1*p)*(1-A(.8,1,p))+.03;d.push([e.v(o*C*.98,T+.03,w,w,0,[5,0,1.5,0],[0,0,0,0]),e.v(o*C*.8,T-W,w-.18*W,w,.2,[5,0,1.5,W],[0,0,0,0])])}e.loft(d,!1)}for(const o of[-1,1]){const d=[];for(let z=0;z<=8;z++){const p=z/8,w=Q(t-.3,t+1.4,p),[M,E,D]=Le(_e,Math.max(w,t)),k=(M+E)*.5,T=M-.36*(M-E),_=Math.acos(Ee((T-k)/Math.max(M-k,.001),-1,1)),C=D*Math.sin(_)*.9;d.push([e.v(o*C,T-.02,w,w,1,[5,0,0,0],[0,0,0,0]),e.v(o*C,T-.05,w,w,1.62,[5,0,0,0],[1,0,0,0])])}e.loft(d,!1)}for(const o of[-1,1]){const d=[];for(let p=0;p<=7;p++){const w=p/7,M=o*2.25*w,E=-6.5-1.05*Math.pow(w,1.2),D=-7.25-.42*Math.sin(Math.min(1,w*1.1)*Math.PI*.5)-.1*w,k=[];for(let T=0;T<=2;T++){const _=Q(E,Math.min(D,E-.02),T/2);k.push(e.v(M,.02+o*M*.3+.05*(1-w)*(T===1?1:0),_,_,w*4.4,[0,0,.9,0],[0,0,1,0]))}d.push(k)}e.loft(d,!1);const z=[];for(let p=0;p<=8;p++){const w=p/8,M=1.8*(1-.74*w*w)*(.62+.38*Math.min(1,w*3.5)),E=[];for(let D=0;D<=5;D++){const k=D/5;E.push(e.v(o*(.62+1.35*w+.07*Math.sin(Math.PI*k)*(1-w)),-.72-.82*w-.05*Math.sin(Math.PI*k),2.35-2.5*w-M*(k-.3),w,1+k*.667+1.25*(1-w)*(1-w),[0,0,.9,0],[0,0,0,w]))}z.push(E)}e.loft(z,!1);{const E=e.v(o*(r(.36,2.9)+.05),.36,2.9,.5,.5,[4,0,0,0],[0,0,0,0]),D=[];for(let k=0;k<=16;k++){const T=k/16*ae,_=.36+.3*Math.sin(T),C=2.9+.3*1.12*Math.cos(T);D.push(e.v(o*(r(_,C)+.02),_,C,.5+.86*Math.cos(T),.5+.86*Math.sin(T),[4,0,0,0],[0,0,0,0]))}e.fan(E,D)}for(const p of[0,1]){const w=[];for(let M=p?0:-5;M<=28;M++){const E=M/28,D=Math.max(0,-M/5),k=E>=0?Q(t,7.44,E):t-.62*D,[T,_]=Le(_e,Math.max(k,t)),C=T-.36*(T-_)-.34*D*D-(p?.035:0),W=(.075-.05*Math.max(E,0)*Math.max(E,0))*(1-.7*D);w.push([e.v(o*(r(C+W,k)+.016),C+W,k,E,0,[3,0,0,0],[p,0,0,0]),e.v(o*(r(C-W,k)+.016),C-W,k,E,1,[3,0,0,0],[p,0,0,0])])}e.loft(w,!1)}}{const o=[];for(let d=0;d<=6;d++){const z=d/6,p=-3-1.3*z,w=Le(_e,p)[0],M=.62*Math.pow(Math.sin(Math.PI*Math.min(1,z*1.25)*.8),.8)*(1-z*.6);o.push([e.v(0,w-.05,p,p,0,[0,0,.8,0],[0,0,.3,0]),e.v(0,w+M,p-.5*M,p,.6,[0,0,.8,0],[0,0,.3,0])])}e.loft(o,!1)}await a();const G=e.build(!1);await a();const K=G.attributes.position,L=G.attributes.normal,P=G.attributes.aSt,i=new Map,v=o=>Math.round(K.getX(o)*500)+","+Math.round(K.getY(o)*500)+","+Math.round(K.getZ(o)*500);for(let o=0;o<K.count;o++){if(P.getX(o)>.5)continue;const d=v(o),z=i.get(d)||[0,0,0];z[0]+=L.getX(o),z[1]+=L.getY(o),z[2]+=L.getZ(o),i.set(d,z)}await a();for(let o=0;o<K.count;o++){if(P.getX(o)>.5)continue;const d=i.get(v(o)),z=Math.hypot(d[0],d[1],d[2])||1;L.setXYZ(o,d[0]/z,d[1]/z,d[2]/z)}return G}const wt=[[1.5,.005,-.005,.004],[.86,.045,-.05,.022],[.62,.17,-.17,.058],[.3,.235,-.235,.085],[0,.24,-.245,.09],[-.4,.2,-.2,.078],[-.8,.13,-.13,.052],[-1.1,.06,-.06,.028],[-1.27,.035,-.035,.018]];function ia(){const a=new pt,e=14,t=[];for(let r=0;r<=26;r++){const s=Q(1.5,-1.27,Math.pow(r/26,.9)),[n,m,f]=Le(wt,s),y=[],x=A(.5,-1.4,s);for(let b=0;b<e;b++){const S=b/e*ae,g=S>Math.PI?ae-S:S,[q,G]=$e(S,n,m,f);y.push(a.v(q,G,s,s,g/Math.PI*.5,[0,A(.9,.6,s),0,.85*A(.55,.8,g/Math.PI)*A(.9,.6,s)],[0,0,x,0]))}t.push(y)}a.loft(t,!0);const l=[];for(let r=0;r<=28;r++){const s=r/28,n=Q(.56,-.8,s),m=Le(wt,n)[0],f=1*Math.pow(Math.sin(Math.PI*Math.pow(s,.8)),.55)*(1-.32*s)*(1-.07*Math.abs(Math.sin(s*40))),y=[];for(let x=0;x<=4;x++){const b=x/4;y.push(a.v(0,m-.02+f*b,n-.22*f*b,s,b,[1,0,0,0],[b,f,A(.5,-1.4,n),0]))}l.push(y)}a.loft(l,!1);for(const r of[-1,1]){const s=[];for(let S=0;S<=6;S++){const g=S/6,q=r*.6*Math.pow(g,.85),G=-1.22-.36*g*g,K=.16*(1-.85*g);s.push([a.v(0,q,G,g,0,[0,0,1,0],[0,0,1,0]),a.v(0,q*.93,G-K,g,.2,[0,0,1,0],[0,0,1,0])])}a.loft(s,!1);const n=[];for(let S=0;S<=4;S++){const g=S/4;n.push([a.v(r*(.07+.05*g),-.14-.3*g,.42-.42*g,g,0,[0,0,1,0],[0,0,0,0]),a.v(r*(.07+.05*g),-.16-.3*g,.34-.5*g+.06*g,g,.12,[0,0,1,0],[0,0,0,0])])}a.loft(n,!1);const m=r>0?-.86:-.7,f=Le(wt,m),y=r>0?f[0]:f[1];a.loft([[a.v(0,y,m,0,0,[0,0,1,0],[0,0,.6,0]),a.v(0,y,m-.25,.2,0,[0,0,1,0],[0,0,.7,0])],[a.v(0,y+r*.13,m-.1,0,.13,[0,0,1,0],[0,0,.6,0]),a.v(0,y+r*.03,m-.3,.2,.1,[0,0,1,0],[0,0,.7,0])]],!1);const x=a.v(r*.064,.05,.6,.5,.5,[4,0,0,0],[0,0,0,0]),b=[];for(let S=0;S<=8;S++){const g=S/8*ae;b.push(a.v(r*.058,.05+.04*Math.sin(g),.6+.04*Math.cos(g),.5+.5*Math.cos(g),.5+.5*Math.sin(g),[4,0,0,0],[0,0,0,0]))}a.fan(x,b)}return a.build(!1)}const la=[[.52,.004,-.004,.004],[.36,.03,-.03,.026],[.3,.065,-.06,.058],[.2,.055,-.06,.052],[.05,.1,-.11,.1],[-.12,.105,-.115,.105],[-.3,.06,-.07,.07],[-.52,.012,-.012,.05]];function ra(a){const e=new pt,t=8,l=[];for(let s=0;s<=9;s++){const n=Q(.52,-.52,s/9),[m,f,y]=Le(la,n),x=[];for(let b=0;b<t;b++){const[S,g]=$e(b/t*ae,m,f,y);x.push(e.v(S,g,n,n,b/t,[0,0,0,A(.24,.12,n)],[0,0,0,0]))}l.push(x)}e.loft(l,!0);const r=a?.72:1;for(const s of[-1,1]){const n=(m,f,y,x)=>{const b=[];for(let S=0;S<=y;S++){const g=Q(m,f,S/y),q=s*(.08+1.02*g),G=.1+.1*Math.sin(Math.min(1,g*2)*Math.PI*.5)-.34*Math.max(0,g-.5)*(g-.5)*4*.5,K=r*(.26-.1*g)*(1-Math.pow(g,5))+.015,L=.03+.05*Math.sin(g*Math.PI),P=[];for(let i=0;i<=2;i++){const v=i/2,o=G-K*v;P.push(e.v(q,L+.012*Math.sin(Math.PI*v),o,g,v,[x,0,x===0?.7:0,1],[s*g,0,0,0],[s*(.08+.1*g+.05*v),.04,.12-1.05*g-K*.3*v]))}b.push(P)}e.loft(b,!1)};n(0,.72,6,0),n(.72,1,3,3)}return e.build(!0)}const Bt=`
uniform vec3 uDisc; uniform vec3 uMoonKind;   // x crescent 0..1, y maria 0..1, z sun rays 0..1
// q: disc coordinates (|q| <= 1), aa: one pixel in q units. A leaf disc with crinkle, seams and engraved maria.
vec3 moonLeaf(vec2 q, float aa){
  float r = length(q), m = 1.0 - smoothstep(1.0 - aa * 1.5, 1.0, r);
  float cut = smoothstep(0.96 - aa * 1.5, 0.96, length(q - vec2(-0.36, 0.14)));
  m *= mix(1.0, cut, uMoonKind.x);
  float cr = vnoise(q * 9.0) * 0.6 + vnoise(q * 23.0) * 0.4;
  float nm = vnoise(q * 2.3 + 4.0) * 0.7 + vnoise(q * 5.0 + 9.0) * 0.3;
  float maria = smoothstep(0.5, 0.56, nm) * uMoonKind.y;
  vec3 leaf = uDisc * (1.22 + 0.38 * cr) * (1.0 - 0.4 * maria);
  leaf *= 1.0 - 0.5 * uMoonKind.y * (1.0 - smoothstep(0.008 + aa, 0.02 + aa * 2.0, abs(nm - 0.5)));
  vec2 g = abs(fract(q * 2.5 + 0.5) - 0.5);
  leaf *= 1.0 - 0.16 * (1.0 - smoothstep(0.0, 0.03 + aa * 2.0, min(g.x, g.y)));
  float an = (abs(q.x) + abs(q.y) > 1e-4) ? atan(q.y, q.x) : 0.0;
  float ray = 1.0 - smoothstep(0.1, 0.22 + aa * 12.0, abs(fract(an * 3.8197) - 0.5));
  leaf *= 1.0 - 0.45 * uMoonKind.z * ray * smoothstep(0.32, 0.4, r);
  leaf *= 1.0 - 0.5 * uMoonKind.z * (1.0 - smoothstep(0.0, 0.02 + aa * 2.0, abs(r - 0.32)));
  return leaf * m;
}`,Lt=`
float swellH(vec2 p, float t){ return 0.22 * sin(p.x * 0.11 + t * 0.7) + 0.16 * sin(p.y * 0.17 - t * 0.55 + p.x * 0.05) + 0.08 * sin((p.x + p.y) * 0.31 + t * 1.1); }
vec2 swellS(vec2 p, float t){
  float a = cos(p.x * 0.11 + t * 0.7), b = cos(p.y * 0.17 - t * 0.55 + p.x * 0.05), c = cos((p.x + p.y) * 0.31 + t * 1.1);
  return vec2(0.0242 * a + 0.008 * b + 0.0248 * c, 0.0272 * b + 0.0248 * c);
}`,Ct=`
// one hairline of a coordinate c whose screen footprint is fc (taken outside): at least 1.3 px, fades when unresolved
float hairW(float c, float fc, float w0){ float d = abs(fract(c) - 0.5), w = max(w0, 0.65 * fc); return (1.0 - smoothstep(w, w + fc, d)) * (1.0 - smoothstep(0.28, 0.5, fc)); }
float hairF(float c, float fc){ return hairW(c, fc, 0.04); }
// sprinkled dust: one soft grain per cell, thrown anywhere in it (no rows), kept while it covers a fraction of a pixel
float speck(vec2 p, float cell, float thr, float pxw){
  vec2 id = floor(p / cell), f = fract(p / cell) - 0.5; vec2 h = hash22(id + 11.3);
  float r = length(f - (h - 0.5) * 0.62), s = 0.1 + 0.1 * h.x, aa = pxw / cell;
  return step(thr, hash12(id + 3.9)) * (1.0 - smoothstep(s, s + aa + 0.04, r)) * min(1.0, s / max(aa, 1e-3));
}
// a grain of sprinkled dust: a speck that exists only while it is a grain on screen (it leaves before it is a blob)
float grain(vec2 p, float cell, float thr, float pxw){ return speck(p, cell, thr, pxw) * (1.0 - smoothstep(1.5, 3.0, 0.15 * cell / pxw)); }
// nashiji at any distance: four sizes of grain that hand over to one another, so there are no rows and no blobs
float sprinkleK(vec2 xz, float pxw, float k4){   // k4: the share of the coarsest (14 m) grains
  vec2 r = vec2(0.8 * xz.x - 0.6 * xz.y, 0.6 * xz.x + 0.8 * xz.y);
  return grain(xz, 0.7, 0.5, pxw) + grain(r + 17.3, 2.0, 0.42, pxw) + grain(xz + 41.1, 5.5, 0.36, pxw) + k4 * grain(r - 23.7, 14.0, 0.3, pxw);
}
float sprinkle(vec2 xz, float pxw){ return sprinkleK(xz, pxw, 1.0); }
// seigaiha: overlapping wave scales in cell units (rows 0.25 apart, the nearest row in front wins), three engraved
// rings to a scale. dpx, dpy: the screen derivatives of p. fc: the rings' footprint in ring spacings. w0: the line's
// half-width in ring spacings.
float seigaiha(vec2 p, vec2 dpx, vec2 dpy, float w0, out float fc){
  float dsc = 2.0; vec2 dv = vec2(0.0, 1.0);
  for (int k = 0; k < 4; k++) {
    float row = floor(p.y / 0.25) - 1.0 + float(k), off = 0.5 * mod(row, 2.0);
    vec2 ctr = vec2(floor(p.x - off + 0.5) + off, row * 0.25), v = p - ctr; float d = length(v) * 2.0;
    if (d < 1.0 && dsc > 1.5) { dsc = d; dv = v / max(length(v), 1e-4); }
  }
  fc = (abs(dot(dv, dpx)) + abs(dot(dv, dpy))) * 5.0;
  return dsc < 1.5 ? hairW(dsc * 2.5, fc, w0) : 0.0;
}`,ca=`
float netM(vec2 xz, float cs, float t) {
  vec2 cp = xz * (3.14159 / cs) + cs * 1.7;
  float ca = cp.x + 1.25 * sin(cp.y * 0.63 + t * 0.33) + 0.55 * sin(cp.y * 1.7 - t * 0.21 + cp.x * 0.4);
  float cb = cp.y + 1.25 * sin(cp.x * 0.57 - t * 0.29) + 0.55 * sin(cp.x * 1.9 + t * 0.17 - cp.y * 0.3);
  return min(abs(sin(ca)), abs(sin(cb)));
}`;async function ha(a,e,t){const l=new h.PlaneGeometry(2,2,127,127);await t(),l.rotateX(-Math.PI/2),await t();const r=[];for(let f=0;f<16;f++)r.push(new h.Vector4(0,0,-1,0));const s={uTime:{value:0},uCenter:{value:c()},uMoonAir:{value:e.moonAir.clone()},uSeen:{value:e.moonSeen.clone()},uSx:{value:e.seenX.clone()},uSy:{value:e.seenY.clone()},uMoonTan:{value:Math.tan(e.moonRadius)},uDisc:{value:e.discColor.clone()},uMoonKind:{value:e.moonKind.clone()},uFoil:{value:e.foilColor.clone()},uCell:{value:e.cell},uGate:{value:Ye.clone()},uRing:{value:r},uBoil:{value:c(Ze.x,Ze.z,9)},uRain:{value:e.rain},uBreeze:{value:e.breeze},uSpread:{value:e.spread},uRoof:{value:e.roofColor.clone()},uRoofK:{value:1},uAboveK:{value:1},uClimb:{value:0}},n=new h.ShaderMaterial({uniforms:s,side:h.DoubleSide,fog:!1,transparent:!0,depthWrite:!0,blending:h.CustomBlending,blendSrc:h.OneFactor,blendDst:h.OneMinusSrcAlphaFactor,blendEquation:h.AddEquation,vertexShader:Lt+`
      uniform float uTime; uniform vec3 uCenter; varying vec3 vW;
      void main(){
        vec2 gq = position.xz, q = sign(gq) * pow(abs(gq), vec2(2.2)) * 900.0;
        vec3 w = vec3(uCenter.x + q.x, 0.0, uCenter.z + q.y);
        w.y = swellH(w.xz, uTime) * (1.0 - smoothstep(150.0, 420.0, length(q)));
        vW = w; gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,fragmentShader:a+Oe.GLSL_VALUE_NOISE+Bt+Lt+Ct+ca+`
      uniform float uTime, uMoonTan, uCell, uRain, uBreeze, uSpread, uRoofK, uAboveK, uClimb; uniform vec3 uMoonAir, uSeen, uSx, uSy, uFoil, uBoil, uGate, uRoof; uniform vec4 uRing[16];
      varying vec3 vW;
      void main(){
        vec3 toEye = cameraPosition - vW; float dist = length(toEye); vec3 V = toEye / max(dist, 1e-3);
        vec2 xz = vW.xz, dxz = dFdx(xz), dyz = dFdy(xz);
        float pxw = max(length(abs(dxz) + abs(dyz)) * 0.7, 1e-4);
        vec2 sl = swellS(xz, uTime);
        bool above = uAboveK > 0.5;   // decided once per frame in update() (a uniform, never a per-fragment test: no hairline at the horizon under antialiasing)
        // ---- shared: rings (plunges in gold, rain in silver)
        float ringG = 0.0;
        for (int i = 0; i < 16; i++) {
          vec2 rv = xz - uRing[i].xy; float age = uRing[i].z, r = length(rv), R1 = 0.4 + 2.3 * pow(max(age, 0.0), 0.7);
          vec2 rd = rv / max(r, 1e-3); float fr = (abs(dot(rd, dxz)) + abs(dot(rd, dyz))) * 0.8 + 1e-4, th = max(0.03 + 0.012 * age, 1.1 * fr);
          float a = (1.0 - smoothstep(th, th + fr, abs(r - R1))) + 0.7 * (1.0 - smoothstep(th, th + fr, abs(r - R1 * 0.55)));
          a += 0.4 * (1.0 - smoothstep(0.0, R1 * 0.3 + 0.05, r)) * (1.0 - smoothstep(0.0, 0.8, age));
          ringG += a * step(0.0, age) * smoothstep(0.0, 0.12, age) * (1.0 - smoothstep(2.6, 5.5, age)) * uRing[i].w * clamp((0.03 + 0.012 * age) / (1.1 * fr), 0.2, 1.0);
        }
        ringG = min(ringG, 1.1);
        vec2 rc = floor(xz / 5.0); vec2 rh = hash22(rc + 31.7);
        vec2 rcv = xz - (rc + 0.3 + 0.4 * rh) * 5.0; float rage = fract(uTime / 2.4 + rh.x) * 2.4, rr = length(rcv);
        vec2 rdv = rcv / max(rr, 1e-3); float frr = (abs(dot(rdv, dxz)) + abs(dot(rdv, dyz))) * 0.8 + 1e-4, rth = max(0.045, 1.1 * frr);
        // sparse silver hairline rings within 60 m: the width is measured along the ring's own radius, and a ring thinner
        // than its pixel dims instead of swelling, so nothing gathers into a white band toward the horizon
        float rainR = uRain * (1.0 - smoothstep(rth, rth + frr, abs(rr - (0.15 + 0.85 * rage)))) * (1.0 - smoothstep(0.6, 2.2, rage)) * step(0.5, rh.y)
                    * clamp(0.045 / (1.2 * frr), 0.0, 1.0) * (1.0 - smoothstep(25.0, 70.0, dist)) * 0.6;
        // from below: about a dozen faint hairline rings (1.5 px) in 14 m cells, never discs
        vec2 rc2 = floor(xz / 14.0); vec2 rh2 = hash22(rc2 + 5.3);
        float rage2 = fract(uTime / 3.2 + rh2.x) * 3.2, rr2 = length(xz - (rc2 + 0.25 + 0.5 * rh2) * 14.0);
        float rainB = uRain * (1.0 - smoothstep(0.75 * pxw, 1.5 * pxw, abs(rr2 - (0.3 + 1.1 * rage2)))) * (1.0 - smoothstep(0.8, 2.6, rage2)) * step(0.7, rh2.y);
        // the direction of the portal, taken once (never a zero vector, also at the instant the lens reaches its centre)
        vec3 gv = uGate - cameraPosition; vec3 gd = gv / max(length(gv), 1e-3);
        // ---- refraction terms (used from below; computed here so derivatives stay outside the branch)
        vec3 I = -V;
        vec2 rip = sl * 3.0 + 0.012 * vec2(sin(dot(xz, vec2(0.9, 0.4)) + uTime * 1.4), sin(dot(xz, vec2(-0.5, 1.1)) - uTime * 1.1));
        vec3 Nd = normalize(vec3(rip.x, -1.0, rip.y));
        float cosi = max(-dot(I, Nd), 0.0), kk = 1.0 - 1.777 * (1.0 - cosi * cosi);
        // the window's own measure (over 0 inside the flat-water circle), with a slow wobble
        float cf = max(I.y + 0.007 * sin(dot(xz, vec2(0.05, 0.031)) + uTime * 0.6) + 0.005 * sin(dot(xz, vec2(-0.027, 0.06)) - uTime * 0.45), 0.0);
        float kf = 1.0 - 1.777 * (1.0 - cf * cf);
        float fwk = max(fwidth(kf) * 1.2, 1e-4);                             // (the footprint of the window's rim, taken outside the branch)
        vec3 col = vec3(0.0); float alpha = 0.0;
        if (above) {
          // seigaiha: overlapping wave scales, the nearest row in front wins
          vec2 p = (xz + vec2(0.1, 0.34) * uTime + sl * 14.0) / uCell;
          float fc; float line = seigaiha(p, dxz / uCell, dyz / uCell, 0.04, fc);
          float sunK = uMoonKind.z;                                         // the gold-leaf sun: its sea burns (scales drawn further out and brighter near the lens, a clearer pool)
          line *= 1.0 - smoothstep(0.07 + 0.04 * sunK, 0.2 + 0.08 * sunK, fc);   // beyond some 45 m (60 m under the sun) the scales give way to round dust: never dashes
          float pw = hash12(floor(xz / 0.035) + 1.7);                       // gold powder along the lines
          vec3 Nw = normalize(vec3(-sl.x * 3.0, 1.0, -sl.y * 3.0));
          vec3 hv = normalize(uMoonAir + V);
          float gl = smoothstep(0.86 + 0.1 * pw, 0.9 + 0.1 * pw, dot(Nw, hv) + 0.12 * (pw - 0.5));
          vec3 gold = LQ_GOLD * (0.34 + 0.26 * pw + 0.55 * gl) * line * (1.0 + 0.7 * sunK * (1.0 - smoothstep(10.0, 40.0, dist)));   // (under the sun the nearest rows are as bright as the foil flakes)
          // sprinkled dust where the lines are too fine, and far away
          float dust = speck(xz, 0.4, 0.86, pxw) * smoothstep(0.05, 0.2, fc) * (1.0 - smoothstep(30.0, 90.0, dist))
                     + speck(xz + 7.7, 2.2, 0.8, pxw) * smoothstep(18.0, 32.0, dist) * (1.0 - smoothstep(36.0, 62.0, dist));
          gold += LQ_GOLD * 0.75 * dust;
          // far water (beyond some 70 m) carries only ROUND dust: a grain lying on the water would be a dash at that slant, so the
          // far dust is laid in the lens's own angles (bearing, depression), thinning away well short of the horizon
          float dep = max(V.y, 0.0), azV = (abs(V.x) + abs(V.z) > 1e-4) ? atan(-V.x, V.z) : 0.0, azM = atan(uMoonAir.x, -uMoonAir.z);
          vec2 dc = vec2(azV, dep * 1.3) / 0.009, did = floor(dc), df = fract(dc) - 0.5; vec2 dh = hash22(did + 77.7);
          float farDust = step(0.6, hash12(did + 3.1)) * (1.0 - smoothstep(0.08 + 0.12 * dh.y, 0.17 + 0.17 * dh.y, length(df - (dh - 0.5) * 0.55)))
                        * smoothstep(0.006, 0.016, dep) * (1.0 - smoothstep(0.09, 0.18, dep)) * smoothstep(26.0, 48.0, dist);
          gold += LQ_GOLD * 0.55 * farDust * (0.45 + 0.55 * dh.x);
          gold += LQ_GOLD * 0.4 * uBreeze * speck(xz + vec2(uTime * 1.6, uTime * 0.4), 0.3, 0.9, pxw) * (1.0 - smoothstep(20.0, 60.0, dist));
          // the boil: shell-coloured disturbed rings
          vec2 bv = xz - uBoil.xy; float rb = length(bv), an = (abs(bv.x) + abs(bv.y) > 1e-4) ? atan(bv.y, bv.x) : 0.0;
          float cb = rb * 1.1 - uTime * 1.3 + 0.5 * sin(an * 5.0 + rb * 0.8);
          float bl = hairF(cb, max(pxw * 1.1, 1e-4)) * (1.0 - smoothstep(uBoil.z * 0.55, uBoil.z * 1.25, rb)) * (1.0 - smoothstep(0.2, 0.5, pxw));   // (far off its rings would be level dashes)
          vec3 boil = mix(LQ_SHELL_A, LQ_SHELL_B, 0.5 + 0.5 * sin(an * 3.0 + rb * 0.7 - uTime * 0.6)) * 0.85 * bl;
          // the foil path: square leaf flakes that catch the moon in turn
          float fxw = abs(dxz.x) + abs(dyz.x), fzw = abs(dxz.y) + abs(dyz.y);
          vec2 cs = vec2(max(0.5, exp2(ceil(log2(max(fxw, 1e-4) * 3.0)))), max(0.5, exp2(ceil(log2(max(fzw, 1e-4) * 1.6)))));
          vec2 fid = floor(xz / cs), ff = fract(xz / cs); vec2 fh = hash22(fid + cs * 7.31);
          vec2 tilt = sl * 2.5 + (fh - 0.5) * vec2(uSpread * 0.3, uSpread * 0.9) + 0.07 * vec2(sin(uTime * (0.7 + fh.x) + fh.y * 6.283), cos(uTime * (0.6 + fh.y) + fh.x * 6.283));
          vec3 nf = normalize(vec3(-tilt.x, 1.0, -tilt.y));
          float mr = dot(reflect(-V, nf), uMoonAir);
          float flake = smoothstep(0.985, 0.994, mr);
          vec2 ee = min(ff, 1.0 - ff), fa = vec2(fxw, fzw) / cs;
          flake *= smoothstep(0.05, 0.05 + fa.x, ee.x) * smoothstep(0.05, 0.05 + fa.y, ee.y);
          flake *= 1.0 - smoothstep(45.0, 110.0, dist);                     // far off a square flake is a dash on the horizon: there the path is flecks (below)
          vec3 foil = uFoil * (0.7 + 0.55 * hash12(fid + 5.5)) * flake;
          // THE FAR PATH AND THE HORIZON. Beyond the flakes the moon's path is irregular round flecks laid in the lens's own
          // angles (bearing, depression), so they are grains on screen at any distance, each twinkling in its own time;
          // no haze anywhere: the flecks thin away short of the horizon, which stays hard, black sky on black lacquer
          float daz = azV - azM; daz -= 6.2832 * floor(daz / 6.2832 + 0.5);
          vec2 ac = vec2(daz, dep * 1.4) / 0.0085, aid = floor(ac), af = fract(ac) - 0.5; vec2 ah = hash22(aid + 41.7);
          float atw = 0.5 + 0.5 * sin(uTime * (0.7 + 2.2 * ah.x) + ah.y * 6.2832);
          float fleckF = step(0.52, hash12(aid + 9.1)) * (1.0 - smoothstep(0.1 + 0.16 * ah.y, 0.2 + 0.2 * ah.y, length(af - (ah - 0.5) * 0.5))) * smoothstep(0.35, 0.8, atw);
          fleckF *= exp(-daz * daz / (0.0032 + 0.02 * uSpread * uSpread)) * smoothstep(0.002, 0.012, dep) * (1.0 - smoothstep(0.035, 0.085, dep));
          foil += uFoil * (0.5 + 0.7 * ah.x) * fleckF;
          // THE POOL: under the disc its light lies on the water as one soft warm pool (a wash of amber under the scales,
          // which burn a little brighter inside it), widest near the lens and drawn out toward the disc; no edge anywhere
          float poolW = exp(-daz * daz / 0.2) * smoothstep(0.03, 0.2, dep) * (1.0 - smoothstep(0.3, 0.75, dep)) * (0.75 + 0.5 * vnoise(xz * 0.06 + vec2(uTime * 0.05, 3.0)));
          poolW *= 0.4 + 0.6 * uMoonKind.z;                                 // (full for the gold sun; a moon's pool is fainter)
          gold = gold * (1.0 + (0.6 + 0.5 * sunK) * poolW) + (LQ_AMBER * 0.8 + uFoil * 0.2) * (0.2 + 0.06 * sunK) * poolW;
          col = lqDepth(gold + boil, dist) + lqDepth(foil, min(dist, 240.0) * 0.22) + lqDepth(LQ_GOLD * 1.25 * ringG * (1.0 - smoothstep(55.0, 115.0, dist)) + LQ_SILVER * 0.8 * rainR, dist * 0.5);   // a far ring would be a dash on the horizon
          // the lacquer is clear enough to carry the birds' doubles, but closes over the far portal so it is not given away
          alpha = mix(1.0, 0.66, smoothstep(0.06, 0.09, length(cross(I, gd))));
        } else {
          // THE ROOF. From below the sea is LIGHT, never ornament: Snell's window overhead is a pool of cut leaf (kirikane:
          // cool silver slivers, one in four of them gold) that rocks with the swell, densest round the moon's disc, and
          // the leaf itself has no edge: it thins away through a wide ragged margin, runs on as a glitter path toward the
          // moon's side and lies in loose drifts far out, then fine dust, then dark; the pattern never ends on a line.
          // The one line on the roof is the brief's silver hairline round the window's true rim (hair, below).
          // (The ground below is warm gold wave scales: the two share no tone and no motif.)
          float wn = vnoise(xz * 0.019 + vec2(uTime * 0.012, 3.0)) * 0.62 + vnoise(xz * 0.061 - uTime * 0.016) * 0.38;
          float kfn = kf + 0.62 * (wn - 0.5);
          float inside = smoothstep(-0.1, 0.34, kfn);
          // the moon stands lifted inside the window (drawn whole, a licence: true refraction would crush it on the rim)
          // the disc is one round leaf that rocks as a whole: the swell under the lens shifts and squashes it a little
          vec2 rock = swellS(cameraPosition.xz, uTime);
          vec2 q = vec2(dot(I, uSx), dot(I, uSy)) / (uMoonTan * 0.8) * (1.0 + vec2(rock.x, -rock.x) * 2.5) + rock * 5.0;
          vec3 sky = moonLeaf(q, 0.03) * step(0.0, dot(I, uSeen)) * 1.25;
          float lq = length(q), gdot = dot(I, gd);
          // the leaf: slivers of cut leaf laid along the swell's crests (across the moon's bearing, the way glitter lies on
          // water), riding the swell, in two sizes that hand over to one another so a sliver holds a few pixels at any distance
          float fp = max(length(dxz), length(dyz)), lg = log2(max(fp * 3.0, 0.5)), l0 = floor(lg), lf = smoothstep(0.35, 1.0, lg - l0);
          float gl0 = 0.0, gl1 = 0.0, gold0 = 0.0, gold1 = 0.0;
          vec2 ih = I.xz / max(length(I.xz), 1e-3), mh = uSeen.xz / max(length(uSeen.xz), 1e-3);
          vec2 xs = xz + sl * 16.0, xr = vec2(dot(xs, vec2(-mh.y, mh.x)) / 2.4, dot(xs, mh));
          // where the leaf lies: the window and its ragged margin (down to some 20 degrees above level), the path toward the moon, far drifts
          float win = smoothstep(-0.62, 0.22, kfn);
          float pathM = smoothstep(0.55, 0.97, dot(ih, mh)) * (1.0 - win) * (0.55 + 0.45 * wn);
          float drift = smoothstep(0.5, 0.72, vnoise(xz * 0.0075 + vec2(7.0, uTime * 0.008)) * 0.6 + wn * 0.4);
          float mN = exp(-lq * lq / 64.0), mW = exp(-lq * lq / 480.0);          // round the disc (some 23 degrees), and its wide skirt
          // THE NET OF LIGHT: the swell's own caustic, seen on the sea's skin, brushed in silver powder: wavy strokes that
          // swell and thin, fade in and out and drift with the swell (never a closed mesh, never a ruled line). Two
          // sizes of mesh hand over with distance so a mesh stays some 8 to 12 degrees wide.
          vec2 nw = xz + sl * 22.0 + 14.0 * vec2(vnoise(xz * 0.02 + 3.1), vnoise(xz * 0.02 + 17.7));
          float nfar = smoothstep(36.0, 50.0, dist);
          float brush = 0.3 + 1.4 * vnoise(xz * 0.07 + vec2(uTime * 0.03, 5.0));
          float seg = smoothstep(0.3 + 0.1 * uClimb, 0.62 + 0.06 * uClimb, vnoise(xz * 0.045 - vec2(3.0, uTime * 0.04)));   // (on the climb the strands break up a little more: strokes that thin to dust, never one long cable)
          float md = dot(I, uSeen), pool = smoothstep(0.6, 0.95, md), lace = uClimb * mix(0.85, 1.0, smoothstep(0.3, 0.8, md));   // (lace: on the climb every seam is drawn fine, a hairline 2-4 px with a sharp core and next to no halo, toward the disc and away from it alike: lace, never ropes)
          float m0 = netM(nw, 6.5, uTime), m1 = netM(nw, 17.0, uTime), m00 = netM(nw + 3.7, 2.9, uTime), w0 = 0.042 * brush * (1.0 - 0.3 * (1.0 - smoothstep(16.0, 30.0, dist))) * (1.0 - mix(0.4, 0.62, nfar) * lace);   // (m00: a third, finer mesh for the last climb, where the roof is 15 to 30 m off)
          float a0 = max(fp * 0.77, 0.02), a1 = max(fp * 0.3, 0.02), a00 = max(fp * 1.72, 0.02), nnear = 1.0 - smoothstep(mix(16.0, 24.0, uClimb), mix(30.0, 45.0, uClimb), dist);   // (on the climb the finest mesh carries the roof out to 45 m)
          // (a0, a1, a00: one pixel in each mesh's own measure; on the climb a seam's core is held to half a pixel a side, so a strand near the lens is 2-4 px across with its soft edge, never a rope)
          float w0a = mix(w0, min(w0, 0.5 * a0), uClimb), w0b = mix(w0, min(w0, 0.5 * a1), uClimb), w0c = mix(w0, min(w0, 0.5 * a00), uClimb);
          float ln0 = (1.0 - smoothstep(w0a, w0a + a0, m0)) * min(1.0, w0a / a0 + 0.3), ln1 = (1.0 - smoothstep(w0b, w0b + a1, m1)) * min(1.0, w0b / a1 + 0.3);
          float ln00 = (1.0 - smoothstep(w0c, w0c + a00, m00)) * min(1.0, w0c / a00 + 0.3);
          float line = (mix(mix(ln0, ln1, nfar), ln00, nnear) + 0.2 * (1.0 - 0.94 * lace) * mix(mix(1.0 - smoothstep(w0, w0 + 0.22, m0), 1.0 - smoothstep(w0, w0 + 0.22, m1), nfar), 0.5 * (1.0 - smoothstep(w0, w0 + 0.14, m00)), nnear)) * (0.1 + 0.9 * seg);
          float glow = mix(mix(1.0 - smoothstep(0.0, 0.5, m0), 1.0 - smoothstep(0.0, 0.5, m1), nfar), 1.0 - smoothstep(0.0, 0.5, m00), nnear) * seg;
          // THE CLIMB (uClimb: u 0.69-0.8, the pull-up). Looking steeply up, a net is a loud lattice, so for the last
          // fifth the light on the roof is re-drawn as BRUSH STROKES: two families of wavy strokes that never cross (a slow
          // noise gives each place to one family or to neither, so there is no cell to close), each stroke broken into
          // tapered dashes of its own, never wider than 4 px. They gather into a pool round the disc and along its
          // glitter path (from overhead out through the disc), and thin to loose dim dashes, then dust, elsewhere.
          vec2 cv = xz - cameraPosition.xz, mp = vec2(-mh.y, mh.x); float camD = max(-cameraPosition.y, 4.0), alongM = dot(cv, mh);
          float acr = dot(cv, mp) / (0.2 * camD + 0.1 * max(alongM, 0.0));
          float pathIn = exp(-acr * acr) * smoothstep(-0.3 * camD, 0.5 * camD, alongM);
          float gather = max(pool, 0.6 * pathIn);
          vec2 sw2 = xz + sl * 22.0 + 2.2 * vec2(vnoise(xz * 0.05 + 3.1), vnoise(xz * 0.05 + 17.7)) + 0.4 * vec2(vnoise(xz * 0.16 - 5.0), vnoise(xz * 0.16 + 11.0));
          // both families lie ALONG the glitter path (B 20 degrees off A, so they never weave a mesh): each is the level
          // lines of one gently warped coordinate (a stroke bends, it never wriggles), 3.5 m apart; A2 is A at twice the
          // count, shown only in the pool round the disc (same direction, so it never crosses A)
          vec2 dB = vec2(0.643 * mp.x - 0.766 * mp.y, 0.766 * mp.x + 0.643 * mp.y), pB = vec2(-dB.y, dB.x);   // (B lies 50 degrees off A: two directions of sliver; each place holds one family only, so they never weave)
          // (round the disc family A swings into loose arcs about the place where the disc stands on the roof, like cut
          // leaf laid by hand round a moon; further out it straightens; one scalar field, so its strokes never cross)
          vec2 dfoot = cameraPosition.xz + uSeen.xz * (camD / max(uSeen.y, 0.2)); float rhoD = length(sw2 - dfoot);
          float arcW = 0.8 * exp(-rhoD / (1.6 * camD + 12.0));
          // (each family bends in long slow curves: its coordinate is warped by two and a half stroke spacings over some 45 m)
          float cA = mix(dot(sw2, mp), rhoD, arcW) / 3.5 + 2.6 * vnoise(sw2 * 0.022 + 1.7) + 0.3 * vnoise(sw2 * 0.07 + 9.0) + uTime * 0.035;
          float cB = dot(sw2, dB) / 3.5 + 2.4 * vnoise(sw2 * 0.019 - 7.3) + 0.3 * vnoise(sw2 * 0.06 + 31.0) - uTime * 0.03;
          float cA2 = cA * 2.0 + 0.37;
          // (the footprints are taken here, inside the roof's branch: the branch is on a uniform, so the derivative is defined)
          float fcA = max(fwidth(cA), 1e-4), fcB = max(fwidth(cB), 1e-4), fcA2 = 2.0 * fcA;
          float sel = vnoise(xz * 0.021 + vec2(11.0, uTime * 0.01)), thrS = mix(0.68, 0.43, gather), alA = dot(sw2, mh), alB = dot(sw2, pB);
          // every stroke has its own dash length (0.6 to 1.7 of the mean): long and short mixed, never one ruled measure
          float lenA = 0.3 + 0.55 * hash12(vec2(floor(cA), 3.7)), lenB = 0.26 + 0.5 * hash12(vec2(floor(cB), 8.1));
          float segA = smoothstep(thrS, thrS + 0.2, vnoise(vec2(alA * lenA + floor(cA) * 7.3, floor(cA) * 1.7)));
          float segB = smoothstep(thrS, thrS + 0.2, vnoise(vec2(alB * lenB + floor(cB) * 5.9, floor(cB) * 2.3 + 40.0)));
          float segA2 = smoothstep(thrS + 0.08, thrS + 0.28, vnoise(vec2(alA * 0.6 + floor(cA2) * 3.1, floor(cA2) * 2.9 + 80.0)));
          float wdS = 0.02 * (0.5 + brush);
          // a sliver is 1-2 px wide (0.6 to 0.9 of a pixel a side and a soft pixel), tapers to nothing toward the ends of its dash, and goes out before it is unresolved
          float hwA = clamp(wdS, 0.6 * fcA, 0.9 * fcA) * segA * segA, hwB = clamp(wdS, 0.6 * fcB, 0.9 * fcB) * segB * segB, hwA2 = clamp(wdS, 0.6 * fcA2, 0.9 * fcA2) * segA2 * segA2;
          float lnA = (1.0 - smoothstep(hwA, hwA + fcA, abs(fract(cA) - 0.5))) * segA * (1.0 - smoothstep(0.14, 0.3, fcA));
          float lnB = (1.0 - smoothstep(hwB, hwB + fcB, abs(fract(cB) - 0.5))) * segB * (1.0 - smoothstep(0.14, 0.3, fcB));
          float lnA2 = (1.0 - smoothstep(hwA2, hwA2 + fcA2, abs(fract(cA2) - 0.5))) * segA2 * (1.0 - smoothstep(0.14, 0.3, fcA2));
          float wSA = smoothstep(0.5, 0.58, sel), wSB = 1.0 - smoothstep(0.38, 0.46, sel);
          float strokes = wSA * max(lnA, 0.8 * lnA2 * smoothstep(0.4, 0.8, gather)) + wSB * lnB;
          // the roof never ends on a line: it thins away through a wide ragged margin (some 4 to 18 degrees above level)
          float farM = smoothstep(0.07, 0.31, I.y + 0.1 * (wn - 0.5) + 0.06 * (drift - 0.5));
          // (on the climb the cut leaf no longer traces the light's lines: it lies scattered, gathered only by the disc)
          float leafT = 1.0 - 0.6 * uClimb;
          float dens = clamp((0.008 + 0.04 * drift) * (1.0 - 0.5 * uClimb) + 0.5 * mN * (1.0 - 0.85 * uClimb) + mix((0.55 * line + 0.22 * glow) * (0.1 + 0.3 * win + 0.34 * mW + 0.3 * pathM), 0.05 * gather, uClimb), 0.0, 0.9) * (0.2 + 0.8 * farM);
          float tsw = dot(sl, vec2(70.0, 55.0));
          { float cs = exp2(l0), row = floor(xr.y / cs); vec2 xc = vec2(xr.x / cs + fract(row * 0.618), xr.y / cs), fid = floor(xc), ff = fract(xc); vec2 fh = hash22(fid + cs * 7.31); float fk = hash12(fid + 5.5 + cs);
            float ra = (fh.x - 0.5) * 2.6 * uClimb; vec2 fr = ff - 0.5; fr = vec2(fr.x * cos(ra) - fr.y * sin(ra), fr.x * sin(ra) + fr.y * cos(ra));   // on the climb each sliver is turned its own way (up to 75 degrees): scattered leaf, never ruled rows
            float tx = abs(fr.x) / 0.44, e = (0.22 - 0.1 * fh.y) * leafT * (1.0 - tx * tx) - abs(fr.y);
            float tw = 0.5 + 0.5 * sin(fh.x * 6.2832 + tsw * (0.6 + fh.y) + uTime * (0.5 + 0.8 * fk));
            gl0 = step(1.0 - dens, fk) * smoothstep(0.0, fp / cs + 0.02, e) * (0.1 + 0.9 * smoothstep(0.4, 0.9, tw)); gold0 = step(0.75 - 0.33 * uClimb, fract(fk * 13.0 + fh.x)); }
          { float cs = exp2(l0 + 1.0), row = floor(xr.y / cs); vec2 xc = vec2(xr.x / cs + fract(row * 0.618), xr.y / cs), fid = floor(xc), ff = fract(xc); vec2 fh = hash22(fid + cs * 7.31); float fk = hash12(fid + 5.5 + cs);
            float ra = (fh.x - 0.5) * 2.6 * uClimb; vec2 fr = ff - 0.5; fr = vec2(fr.x * cos(ra) - fr.y * sin(ra), fr.x * sin(ra) + fr.y * cos(ra));   // on the climb each sliver is turned its own way (up to 75 degrees): scattered leaf, never ruled rows
            float tx = abs(fr.x) / 0.44, e = (0.22 - 0.1 * fh.y) * leafT * (1.0 - tx * tx) - abs(fr.y);
            float tw = 0.5 + 0.5 * sin(fh.x * 6.2832 + tsw * (0.6 + fh.y) + uTime * (0.5 + 0.8 * fk));
            gl1 = step(1.0 - dens, fk) * smoothstep(0.0, fp / cs + 0.02, e) * (0.1 + 0.9 * smoothstep(0.4, 0.9, tw)); gold1 = step(0.75 - 0.33 * uClimb, fract(fk * 13.0 + fh.x)); }
          vec3 leafB = mix(uRoof, mix(uRoof, LQ_GOLD * 1.1, 0.6), uClimb);          // on the climb even the cool leaf is warmed (no grey smears)
          vec3 leafC = mix(leafB, LQ_GOLD * 1.15, gold0) * gl0 * (1.0 - lf) + mix(leafB, LQ_GOLD * 1.15, gold1) * gl1 * lf;
          // brightest in the window and on the moon's path; calm round the portal; the disc itself is left clear
          float calm = 1.0 - 0.88 * smoothstep(0.8, 0.94, gdot);
          // ... and on the climb the hush is measured in ring widths: within one ring's width of the wreath nothing on the
          // roof is brighter than a third of it, and the dark opens out again by one and a half
          float rho = min(14.6 / max(length(gv), 15.0), 0.36), tang = sqrt(max(1.0 - gdot * gdot, 0.0)) / max(gdot, 0.05);
          float nearG = (1.0 - smoothstep(1.15 * rho, 3.0 * rho, tang)) * step(0.0, gdot);
          calm = min(calm, mix(1.0, 1.0 - 0.93 * nearG, uClimb));
          vec3 roof = leafC * mix(0.4 + 0.45 * win + 1.3 * mN + 0.6 * mW + 0.55 * pathM, 0.22 + 1.3 * mN + 0.55 * pool + 0.4 * pathIn, uClimb);
          // the climb's colours: pearl (the film's own colour for the angle the lens sees the water at: green overhead,
          // teal, violet toward the margin) over leaf, running to warm gold in the disc's pool and round the ring
          vec3 pearl = mix(uRoof, lqRamp(1.25 * (1.0 - abs(I.y)) + 0.3 * (wn - 0.5)) * 1.35, mix(0.5, 0.82, uClimb * (1.0 - pool)));
          vec3 strokeC = mix(pearl, LQ_GOLD * 1.25, clamp(0.3 + 0.5 * pool + 0.55 * nearG, 0.0, 0.92));
          // THE NET OF LIGHT STAYS ON THE CLIMB (it is what makes the roof the underside of water): whole toward the margin,
          // where it lies foreshortened as ripples, and at six tenths overhead, where its seams are laid broad and soft
          // in gold (toward the disc) and pearl (away from it) with a glow in every seam: rippling cells, never a scribble
          float netKeep = mix(1.0, 0.6, smoothstep(0.42, 0.75, I.y));
          // (its colour on the climb: gold toward the disc only; on the side away from the disc it is cool pearl-silver with a
          // breath of the shell's green, at half strength: never the film's violet, which over gold reads as mauve veins)
          float goldK = clamp(0.9 * smoothstep(0.2, 0.8, md) + 0.35 * mW * smoothstep(-0.1, 0.5, md), 0.0, 0.9);
          vec3 netC = mix(uRoof, mix(mix(LQ_SILVER * 0.85, lqRamp(0.16) * 1.15, 0.3), LQ_GOLD * 1.2, goldK), uClimb);
          roof += netC * line * (1.0 + 1.0 * lace) * (0.1 + 0.32 * win + 0.7 * mW + 0.45 * pathM) * (0.5 + 0.7 * vnoise(xz * 1.3 + 9.0)) * uRoofK * (1.0 - uClimb * (1.0 - netKeep * mix(0.5, 1.0, goldK)));
          roof += netC * glow * glow * 0.09 * (0.25 + 0.5 * win + 0.6 * mW) * uRoofK * uClimb * (1.0 - 0.9 * lace);
          // the climb's strokes (slivers among the net's cells, at seven tenths now that the net carries the roof)
          roof += strokeC * strokes * (0.14 + 0.6 * gather) * (0.6 + 0.5 * vnoise(xz * 1.3 + 9.0)) * uClimb * (0.25 + 0.75 * uRoofK) * 0.7;
          // the disc is left clear; a crescent's dark side is not: the roof's light shows through it
          // (lqE: the distance from the LIT leaf in disc radii, 1 on its edge: for a crescent that is the disc less its cut)
          float lcut = length(q - vec2(-0.36, 0.14)), cutM = smoothstep(0.915, 0.96, lcut), litM = mix(1.0, cutM, uMoonKind.x);
          float lqE = 1.0 + mix(lq - 1.0, max(lq - 1.0, 0.96 - lcut), uMoonKind.x);
          roof *= smoothstep(0.95, 1.25, lqE);
          roof += mix(uRoof, mix(strokeC, LQ_GOLD * 1.1, 0.45), uClimb) * 0.5 * sprinkleK(xz, pxw * (1.0 - 0.6 * uClimb), 1.0 - uClimb) * (0.12 + 0.88 * win) * (0.35 + 0.65 * wn) * mix(0.3 + 1.6 * glow, (0.16 + 1.3 * gather) * (0.25 + 0.75 * uRoofK), uClimb);          // fine dust between the leaf (a smaller footprint passed in gives finer grains: pin-points on the climb, and no 14 m tier there)
          // the disc glows into the roof: a halo of fine dust and soft light round it (it is never a pasted circle)
          // (a crisp disc: the soft light close round it is slight, and a soft broken ring of light stands half a radius
          // off it; a crescent wears its halo round its LIT leaf, and the roof's dust shows through its dark side: never an eclipse)
          vec3 halo = uDisc * (exp(-max(lqE - 0.9, 0.0) * 0.5) * (0.07 + 0.3 * sprinkleK(xz + 3.3, pxw * 0.5, 0.0)) + 0.13 * exp(-max(lqE - 0.96, 0.0) * 2.6)
                    + 0.1 * exp(-(lq - 1.5) * (lq - 1.5) / 0.03) * (0.5 + vnoise(q * 3.0 + 7.0)) * (1.0 - uMoonKind.x)) * smoothstep(0.9, 1.02, lqE) * step(0.0, md) * (0.5 + 0.5 * uClimb);
          // THE WINDOW'S EDGE (the brief): a silver hairline about 1.5 px wide round Snell's window, wobbling with the
          // swell (kf is 0 on the rim); it lies over the leaf's ragged margin, leaves the disc clear and dims to nothing
          // where it would cross the portal
          float hair = (1.0 - smoothstep(0.5, 1.2, abs(kf) / fwk)) * (1.0 - smoothstep(0.95, 0.985, gdot)) * smoothstep(0.95, 1.25, lqE);
          col = sky + (lqDepth(roof, dist * 0.16) * farM + halo) * calm + LQ_SILVER * 0.45 * hair * calm
              + (LQ_GOLD * 0.9 * ringG + LQ_SILVER * 0.24 * rainB * calm) * inside + 0.0 * kk;
          // the lacquer closes over the sky inside the window (and behind the disc); outside it stays open for the shoal's double
          alpha = max(inside, step(lq, 1.0) * step(0.0, dot(I, uSeen)) * litM);
        }
        gl_FragColor = vec4(col, alpha);
      }`}),m=new h.Mesh(l,n);return m.frustumCulled=!1,m.renderOrder=5,m.name="lacquer-sea",{object:m,uniforms:s,rings:r}}const ot=-138,xt=[[-13,-7,1.3,1,-3,2],[10,20,3.4,.55,4.5,-2],[-27,12,1,.95,6,-2],[21,-48,1.5,.6,.8,-.5],[49,-46,2.8,.68,-.6,3.2],[41,-15,2.8,.73,-4.1,3],[74,-2,1.2,.67,-2.6,-2.7],[42,17,4.2,.94,3.3,-.1],[62,38,2.8,.82,.3,.8],[22,39,1,.54,-1.3,2.3],[15,64,2.8,.6,4.5,3.1],[-11,49,2.3,.92,4.4,-.3],[-35,67,1.5,.74,.8,-.5],[-38,35,1.5,.9,-4.6,.4],[-74,15,2.3,.66,-3,-1.5],[-47,-9,2.8,.54,-1.6,-1.4],[-53,-31,1.2,.53,-4.3,.6],[-32,-39,2.8,.55,-1.5,-2.2],[-21,-70,2.8,.69,-5.6,1.5],[1,-49,1,.75,2.6,-1.2]],Tt=[[-41,-16,-255,1.5,1.6,2,1],[-22,-16,-270,3.2,1.1,-4,-2],[-8,-16,-246,1,1.4,5,2]];function Rt(a,e,t){const l=Math.atan2(a.x,-a.z)+e*ge,r=Math.asin(Ee(a.y,-1,1))+t*ge;return c(Math.sin(l)*Math.cos(r),Math.sin(r),-Math.cos(l)*Math.cos(r))}function fa(a,e){const t=e.range(-5,5),l=e.range(-5,5),r=[];for(const s of xt)r.push({p:c(I.x+s[0]+t+e.range(-3.5,3.5),I.y,I.z+s[1]+l+e.range(-3.5,3.5)),hw:s[2]*e.range(.85,1.2),gain:s[3],group:0,dir:Rt(a,s[4]+e.range(-1.5,1.5),s[5]+e.range(-1,1))});for(const s of Tt)r.push({p:c(s[0]+e.range(-3,3),s[1],s[2]+e.range(-3,3)),hw:s[3]*e.range(.85,1.2),gain:s[4],group:1,dir:Rt(a,s[5]+e.range(-1.5,1.5),s[6]+e.range(-1,1))});for(const s of r)s.land=c(s.p.x-s.dir.x*(s.p.y-ot)/s.dir.y,ot,s.p.z-s.dir.z*(s.p.y-ot)/s.dir.y);return r}const It=xt.length+Tt.length;function ua(a,e,t,l){const r=new h.PlaneGeometry(3600,3600,1,1);r.rotateX(-Math.PI/2);const s=e.moonWater,n=l.map(x=>new h.Vector4(x.land.x,x.land.z,Math.max(x.hw,2.2)*3.4,Math.min(1,x.gain))),m=new h.Vector2(s.x,s.z).normalize(),f={uTime:{value:0},uCenter:{value:c()},uMoonW:{value:e.moonWater.clone()},uAxis:{value:new h.Vector2(I.x,I.z)},uDir:{value:t},uGnd:{value:1},uLand:{value:n},uMh:{value:m},uStretch:{value:1/Math.max(s.y,.3)},uPool:{value:1},uShaft:{value:1},uShaft2:{value:0}},y=new h.Mesh(r,new h.ShaderMaterial({uniforms:f,fog:!1,side:h.DoubleSide,transparent:!0,depthWrite:!1,blending:h.AdditiveBlending,vertexShader:`
      uniform vec3 uCenter; varying vec3 vW;
      void main(){ vW = vec3(uCenter.x + position.x, ${ot.toFixed(1)}, uCenter.z + position.z); gl_Position = projectionMatrix * viewMatrix * vec4(vW, 1.0); }`,fragmentShader:a+Oe.GLSL_VALUE_NOISE+Ct+`
      uniform float uTime, uDir, uGnd, uStretch, uPool, uShaft, uShaft2; uniform vec3 uMoonW; uniform vec2 uAxis, uMh; uniform vec4 uLand[${It}]; varying vec3 vW;
      void main(){
        vec3 toEye = cameraPosition - vW; float dist = length(toEye); vec3 V = toEye / max(dist, 1e-3);
        vec2 xz = vW.xz, dxz = dFdx(xz), dyz = dFdy(xz);
        float pxw = max(length(abs(dxz) + abs(dyz)) * 0.7, 1e-4);
        vec2 v = xz - uAxis; float r = max(length(v), 1.0), r2 = r * r;
        float th = ((abs(v.x) + abs(v.y) > 1e-3) ? atan(v.y, v.x) : 0.0) + uDir * uTime * 0.02;
        // log-polar: conformal, so the scales stay round; 30 to a ring closes the lattice exactly
        float k = 30.0 / 6.2832;
        vec2 p = vec2(th * k, log(r) * k);
        vec2 dpx = k / r2 * vec2(v.x * dxz.y - v.y * dxz.x, dot(v, dxz)), dpy = k / r2 * vec2(v.x * dyz.y - v.y * dyz.x, dot(v, dyz));
        float fc; float line = seigaiha(p, dpx, dpy, 0.03, fc);
        float pch = smoothstep(0.3, 0.5, vnoise(xz * 0.0085 + vec2(uTime * 0.005, 7.0)) * 0.65 + vnoise(xz * 0.024 - uTime * 0.007) * 0.35);
        // THE POOL: under the shoal the ground is bare lacquer out to some 70 m, with only the finest dust and the
        // brush lines that cross it, so the ball stands over a dark pool and the rosette is its border
        float heart = smoothstep(26.0, 70.0, r);
        // ... and the pool is a place on the ground, the same from every eye: calm fine dust within 25 m of the point
        // under the shoal's axis, feathered to the full scales by 56 m (uPool: while the shoal stands over it)
        float hush = (1.0 - smoothstep(25.0, 56.0, r)) * uPool;
        // the moon's sheen: the ground is level, so the glint sits where the half-vector stands upright
        vec3 hv = uMoonW + V; hv = hv / max(length(hv), 1e-3);
        float gl = smoothstep(0.86, 0.985, hv.y);
        // WHERE A SHAFT REACHES THE GROUND it lays a soft pool of light, for every shaft, all along the flight: the wave
        // scales are lit there (also inside the bare heart) with dust in them; drawn out along the moon's azimuth, rocking a
        // little, each as strong as its shaft (uShaft: the fan; uShaft2: the three beside the last climb)
        float land = 0.0;
        for (int i = 0; i < ${It}; i++) {
          vec2 lv = xz - uLand[i].xy; float al = dot(lv, uMh); vec2 lp = lv + uMh * al * (1.0 / uStretch - 1.0);
          land += uLand[i].w * (i < ${xt.length} ? uShaft : uShaft2) * (1.0 - smoothstep(0.3, 1.0, length(lp) / uLand[i].z));
        }
        land = min(land, 1.0) * (0.8 + 0.2 * sin(uTime * 0.7 + xz.x * 0.05));
        float lit = min(gl + 0.85 * land + 0.22 * smoothstep(0.45, 0.8, vnoise(xz * 0.011 + vec2(uTime * 0.02, -3.0))), 1.25);
        float drift = smoothstep(0.3, 0.7, vnoise(xz * 0.013 + vec2(3.1, uTime * 0.01)));
        float fine = grain(xz, 0.7, 0.5, pxw) + grain(xz.yx + 17.3, 2.0, 0.42, pxw);
        float calm = max(heart, 0.9 * land) * (1.0 - 0.94 * hush);
        float dust = mix(0.4 * fine, sprinkle(xz, pxw), calm) * (0.1 + 0.9 * drift) * (1.0 - 0.6 * pch * calm) * (1.0 + 1.3 * land);
        line *= 1.0 - smoothstep(0.16, 0.34, fc);            // scales too fine to draw give way to the dust: never a smear
        // warm gold, as bright as the sea's own scales where the light lands (the old ground was a dim amber brown)
        vec3 tone = mix(LQ_AMBER * 2.1, LQ_GOLD, 0.5 + 0.4 * min(lit, 1.0));
        vec3 col = tone * ((0.44 + 0.78 * lit) * line * (0.25 + 0.75 * pch) * calm + (0.42 + 0.6 * lit) * dust);
        // a fine gold thread rings the bare heart
        float fr = (abs(dot(v, dxz)) + abs(dot(v, dyz))) / r + 1e-4;
        col += LQ_GOLD * 0.4 * (1.0 - smoothstep(max(0.12, 1.1 * fr), max(0.12, 1.1 * fr) + fr, abs(r - 10.0))) * clamp(0.12 / (1.1 * fr), 0.25, 1.0);
        col = lqDepth(col * uGnd, dist * 0.3) * (1.0 - smoothstep(420.0, 700.0, dist));
        gl_FragColor = vec4(col, 1.0);
      }`}));return y.frustumCulled=!1,y.renderOrder=-1,y.name="deep-ground",{object:y,uniforms:f}}function da(a,e,t){const l=[],r=[],s=[],n=[],m=[];for(const[S,g]of t.entries()){const q=g.dir,G=c(g.p.x+q.x*(-1.5-g.p.y)/q.y,-1.5,g.p.z+q.z*(-1.5-g.p.y)/q.y),K=(-1.5-ot)/q.y,L=l.length/3,P=1-A(1.2,2.6,g.hw);for(let i=0;i<=6;i++)for(const v of[-1,1]){const o=i/6;l.push(G.x-q.x*K*o,G.y-q.y*K*o,G.z-q.z*K*o),r.push(-q.x,-q.y,-q.z),s.push(o*K,v),n.push(g.hw*(Q(.7,.62,P)+Q(1.1,1.4,P)*o),g.gain,S*7.31,g.group)}for(let i=0;i<6;i++){const v=L+i*2;m.push(v,v+1,v+2,v+1,v+3,v+2)}}const y=new h.BufferGeometry;y.setAttribute("position",new h.Float32BufferAttribute(l,3)),y.setAttribute("aAxis",new h.Float32BufferAttribute(r,3)),y.setAttribute("uv",new h.Float32BufferAttribute(s,2)),y.setAttribute("aK",new h.Float32BufferAttribute(n,4)),y.setIndex(m);const x={uTime:{value:0},uGain:{value:1},uGain2:{value:0},uTint:{value:new h.Color(Pe[1]).lerp(e.foilColor,.22).multiplyScalar(.4+.6*e.moonKind.z)},uKeep:{value:new h.Vector4(I.x,I.y,I.z,24)},uKeepK:{value:0}},b=new h.Mesh(y,new h.ShaderMaterial({uniforms:x,fog:!1,side:h.DoubleSide,transparent:!0,depthWrite:!1,blending:h.AdditiveBlending,vertexShader:`
      attribute vec3 aAxis; attribute vec4 aK; uniform float uTime, uGain, uGain2;
      varying vec2 vQ; varying vec3 vK, vW; varying float vDist;
      void main(){
        vec4 mv = viewMatrix * vec4(position, 1.0);
        vec3 t = mat3(viewMatrix) * aAxis, sd = cross(t, mv.xyz); sd = sd / max(length(sd), 1e-4);
        mv.xyz += sd * uv.y * aK.x;
        vQ = vec2(uv.x, uv.y * aK.x); vK = vec3(aK.x, aK.y * mix(uGain, uGain2, aK.w), aK.z); vDist = length(mv.xyz);
        vW = position + (sd * mat3(viewMatrix)) * (uv.y * aK.x);        // this point of the shaft in the world (the view's turn undone)
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:a+Oe.GLSL_VALUE_NOISE+`
      uniform float uTime, uKeepK; uniform vec3 uTint; uniform vec4 uKeep; varying vec2 vQ; varying vec3 vK, vW; varying float vDist;
      // a mote: one fine grain per cell; pmax dims a grain thinner than its pixel, pmin takes it away before it is a blob
      float dustAt(vec2 p, float cell, float thr, float pmax, float pmin, float seed){
        vec2 id = floor(p / cell), f = fract(p / cell) - 0.5; vec2 h = hash22(id + seed);
        float r = length(f - (h - 0.5) * 0.6), sz = 0.06 + 0.05 * h.x, aa = pmax / cell;
        return step(thr, hash12(id + seed + 3.9)) * (1.0 - smoothstep(sz, sz + aa + 0.03, r)) * min(1.0, sz / max(aa, 1e-3)) * (1.0 - smoothstep(1.0, 1.9, 0.12 * cell / pmin));
      }
      void main(){
        float c = clamp(vQ.y / max(vK.x, 1e-3), -1.0, 1.0), prof = 1.0 - c * c; prof = prof * prof * (0.55 + 0.45 * prof);      // a peaked, feathered section: nothing at the edge, no rim, no flat pane (c: across the shaft, held to its own range)
        float fqx = fwidth(vQ.x), fqy = fwidth(vQ.y), pmax = max(max(fqx, fqy), 1e-4), pmin = max(min(fqx, fqy), 1e-4);
        // the light itself: a few soft threads that run the length of the shaft, wander slowly across it and come and go
        float th1 = vnoise(vec2(c * 3.4 + vK.z, vQ.x * 0.03 - uTime * 0.05)), th2 = vnoise(vec2(c * 8.0 - vK.z, vQ.x * 0.075 + uTime * 0.035));
        float threads = 0.25 + 1.5 * th1 * (0.45 + 0.55 * th2);
        vec2 p = vec2(vQ.x + uTime * 0.5, vQ.y + 0.25 * sin(vQ.x * 0.4 + uTime * 0.6 + vK.z));     // the motes sink slowly and drift a little
        float d = dustAt(p, 0.22, 0.55, pmax, pmin, vK.z) + 0.6 * dustAt(p + 9.1, 0.5, 0.5, pmax, pmin, vK.z + 1.7) + 0.25 * dustAt(p + 31.7, 1.0, 0.55, pmax, pmin, vK.z + 4.3);
        // SEEN ALONG ITS OWN LENGTH (any shaft, anywhere on the flight: by the angle of the sight line to its axis, whose
        // sine is pmin / pmax: from 56 degrees off the axis, in full within 30; the last climb looks up three of them)
        // a mote would smear into a cobble and the veil would stand as a pane between two straight sides. There the
        // motes go, at most a third of the veil is kept, and what is kept is a loose sheaf of threads: it falls away
        // from the axis over the whole half-width, and the threads' own pattern cuts its outline (toward the sides only
        // the strongest threads are left, each ending where it thins), so no side is a line
        float along = smoothstep(1.2, 2.0, pmax / pmin), e = 1.0 - abs(c);
        float sheaf = smoothstep(0.0, 1.0, e) * smoothstep(0.0, 0.3, th1 * (0.45 + 0.55 * th2) - mix(0.5, 0.1, e));
        d *= 1.0 - along;
        float veil = threads * (1.0 - along * (1.0 - 0.333 * sheaf));
        // thick and thin along its length (it is never one even bar), a slow shimmer, and it dies away with depth
        float band = 0.35 + 0.65 * smoothstep(0.2, 0.75, vnoise(vec2(vQ.x * 0.034 - uTime * 0.045, vK.z * 1.7))) + 0.12 * sin(uTime * 0.55 + vK.z * 2.0 + vQ.x * 0.05);
        float fall = 2.1 * exp(-vQ.x / 75.0) + 0.08;
        float ends = smoothstep(0.0, 9.0, vQ.x);
        vec3 col = uTint * (0.26 * veil + 0.6 * d) * prof * band * fall * ends * vK.y;
        col *= smoothstep(5.0, 16.0, vDist) * (1.0 - 0.72 * smoothstep(58.0, 112.0, vDist));     // nothing beside the lens; faint far off (the fan is twenty: only the near handful stand as shafts)
        // hushed round the shoal itself, in the world: by how far this point of the shaft is from the shoal's own centre
        // (full within uKeep.w m of it, none beyond twice that), the same from every side
        col *= 1.0 - uKeepK * (1.0 - smoothstep(uKeep.w, 2.0 * uKeep.w, distance(vW, uKeep.xyz)));
        gl_FragColor = vec4(lqDepth(col, vDist * 0.45), 1.0);
      }`}));return b.frustumCulled=!1,b.renderOrder=6,b.name="gold-shafts",{object:b,uniforms:x}}function ma(a,e,t,l){const r=[],s=[],n=[],m=c();for(const[b,S,g,q,G,K]of l)for(let L=0;L<g;L++){m.set(t.gauss(),t.gauss()*.7+G,t.gauss()).normalize().multiplyScalar(q*(.25+.75*t())*(t.chance(.2)?1.6:1)),r.push(S.x+t.gauss()*.8,S.y+t.gauss()*.8,S.z+t.gauss()*.8,b+.25*t()*t());const P=t();s.push(m.x,m.y,m.z,P),n.push(Q(K[0],K[1],P*13.7%1))}const f=new h.InstancedBufferGeometry;f.setAttribute("position",new h.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),f.setIndex([0,1,2,0,2,3]),f.setAttribute("aE",new h.InstancedBufferAttribute(new Float32Array(r),4)),f.setAttribute("aV",new h.InstancedBufferAttribute(new Float32Array(s),4)),f.setAttribute("aSz",new h.InstancedBufferAttribute(new Float32Array(n),1)),f.instanceCount=r.length/4;const y={uU:{value:0},uTime:{value:0},uPx:{value:.003},uMoon:{value:e.moonWater.clone()}},x=new h.Mesh(f,new h.ShaderMaterial({uniforms:y,fog:!1,side:h.DoubleSide,vertexShader:`
      attribute vec4 aE, aV; attribute float aSz; uniform float uU, uTime, uPx; varying vec2 vC; varying vec3 vN, vW; varying float vPh, vDim;
      void main(){
        float sd = aV.w, tau = uU * ${be}.0 - aE.w, t = max(tau, 0.0);
        vec3 P = aE.xyz + aV.xyz * (1.0 - exp(-t * 1.7)) / 1.7 + vec3(0.0, -0.4 * t, 0.0);
        P.xz += 0.35 * vec2(sin(t * 1.3 + sd * 40.0), cos(t * 1.1 + sd * 70.0)) * smoothstep(0.3, 2.5, t);
        float alive = smoothstep(0.0, 0.15, tau) * (1.0 - smoothstep(6.5, 10.5, tau));
        // a tumbling leaf: its face turns about an axis of its own
        vec3 ax = normalize(vec3(sin(sd * 91.0), 0.4 * cos(sd * 57.0), cos(sd * 91.0)));
        vec3 e1 = normalize(cross(ax, vec3(0.0, 1.0, 0.0))), e2 = cross(ax, e1);
        float ang = sd * 44.0 + (1.6 + 3.2 * fract(sd * 7.3)) * uTime;
        vec3 N = e1 * cos(ang) + e2 * sin(ang), Wd = cross(N, ax);
        // its own size, never under 1.4 px (a fleck thinner than that dims instead) and never over 7 px half-width;
        // beside the lens it fades out
        float dc = distance(P, cameraPosition), lo = 1.4 * uPx * dc;
        alive *= smoothstep(1.2, 2.5, dc);
        float sz = min(max(aSz, lo), 7.0 * uPx * dc) * alive;
        vec3 w = P + (ax * position.x * 1.5 + Wd * position.y) * sz;
        vC = position.xy; vN = N; vW = w; vPh = sd; vDim = clamp(aSz / max(lo, 1e-5), 0.45, 1.0);
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,fragmentShader:a+`
      uniform vec3 uMoon; varying vec2 vC; varying vec3 vN, vW; varying float vPh, vDim;
      void main(){
        float e = 1.0 - dot(vC, vC); if (e < 0.0) discard;
        vec3 toEye = cameraPosition - vW; float dist = length(toEye), lit;
        vec3 col = lqShell(normalize(vN), toEye / max(dist, 1e-3), uMoon, vPh, lit) * 1.35 + LQ_SILVER * 0.3 * (1.0 - smoothstep(0.0, 0.3, e));
        gl_FragColor = vec4(lqDepth(col * vDim, dist * 0.6), 1.0);
      }`}));return x.frustumCulled=!1,x.name="shed-scales",{object:x,uniforms:y}}function va(a,e,t,l){const r=new h.Group;r.name="sky";const s={uDir:{value:e.moonAir.clone()},uMx:{value:e.moonX.clone()},uMy:{value:e.moonY.clone()},uSize:{value:1500*Math.tan(e.moonRadius)},uDisc:{value:e.discColor.clone()},uMoonKind:{value:e.moonKind.clone()}},n=new h.Mesh(new h.PlaneGeometry(2,2),new h.ShaderMaterial({uniforms:s,fog:!1,depthWrite:!1,depthTest:!0,side:h.DoubleSide,vertexShader:`uniform vec3 uDir, uMx, uMy; uniform float uSize; varying vec2 vQ;
      void main(){ vQ = position.xy; vec3 w = cameraPosition + uDir * 1500.0 + (uMx * position.x + uMy * position.y) * uSize; gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0); }`,fragmentShader:a+Oe.GLSL_VALUE_NOISE+Bt+`varying vec2 vQ;
      void main(){ float aa = max(fwidth(vQ.x), 1e-4); vec3 c = moonLeaf(vQ, aa); if (c.r + c.g + c.b < 0.002) discard; gl_FragColor = vec4(c * 1.3, 1.0); }`}));n.frustumCulled=!1,n.renderOrder=-2,r.add(n);const m=Math.round(e.stars*l),f=m+Math.round((e.haze||0)*l);let y=null;const x={uPx:{value:.003},uGain:{value:e.starGain}};if(f>0){const b=new Float32Array(f*4),S=c(),g=c(.82,.4,-.375).normalize(),q=c(0,1,0).addScaledVector(g,-g.y).normalize(),G=c().crossVectors(g,q),K=[];if(f>m)for(let P=0;P<7;P++)K.push([t.range(-2.6,2.6),(3+3.2*P+t.range(-1,1))*ge,t.range(.5,1),t.range(.007,.016),t()*ae]);for(let P=m;P<f;P++){const i=K[P%7],v=i[0]+i[2]*t.gauss()*.5,o=Math.max(.02,i[1]+i[3]*t.gauss()+.012*Math.sin((v-i[0])*5+i[4]));S.set(Math.sin(v)*Math.cos(o),Math.sin(o),-Math.cos(v)*Math.cos(o)),S.dot(e.moonAir)>.988&&(S.y+=.14,S.normalize()),b[P*4]=S.x,b[P*4+1]=S.y,b[P*4+2]=S.z,b[P*4+3]=t()*t()}for(let P=0;P<m;P++){const i=t.range(-1.9,1.6),v=t.gauss()*.17*(1+.5*Math.abs(t.gauss()));S.copy(q).multiplyScalar(Math.cos(i)).addScaledVector(G,Math.sin(i)).multiplyScalar(Math.cos(v)).addScaledVector(g,Math.sin(v)).normalize(),(S.y<.03||S.dot(e.moonAir)>.93)&&S.set(-.5+.2*t(),.5+.4*t(),-.6*t()).normalize(),b[P*4]=S.x,b[P*4+1]=S.y,b[P*4+2]=S.z,b[P*4+3]=t()*t()}const L=new h.InstancedBufferGeometry;L.setAttribute("position",new h.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),L.setIndex([0,1,2,0,2,3]),L.setAttribute("aDir",new h.InstancedBufferAttribute(b,4)),L.instanceCount=f,y=new h.Mesh(L,new h.ShaderMaterial({uniforms:x,fog:!1,depthWrite:!1,transparent:!0,blending:h.AdditiveBlending,vertexShader:`attribute vec4 aDir; uniform float uPx; varying vec2 vC; varying float vB;
        void main(){ vC = position.xy; vB = aDir.w; vec4 mv = viewMatrix * vec4(cameraPosition + aDir.xyz * 1400.0, 1.0);
          mv.xy += position.xy * (1.1 + 1.7 * aDir.w) * uPx * (-mv.z); gl_Position = projectionMatrix * mv; }`,fragmentShader:a+`uniform float uGain; varying vec2 vC; varying float vB;
        void main(){ float r = length(vC), a = (1.0 - smoothstep(0.25, 1.0, r)); gl_FragColor = vec4(mix(LQ_AMBER * 1.6, LQ_GOLD, 0.35 + 0.65 * vB) * a * a * (0.35 + 0.95 * vB) * uGain, 1.0); }`})),y.frustumCulled=!1,y.renderOrder=-3,r.add(y)}return{object:r,moonU:s,dustU:x}}function pa(a,e,t,l,r,s,n){const m=ra(e.cast===1),f=[],y=Math.round(40*l);for(let i=0;i<y;i++){const v=i<5?t.range(48,62):t.range(12,46),o=t.chance(.82)?1:-1;f.push([v,t.range(11,30)-(i<5?4:0),t()*ae,o*t.range(9,12.5)/v,0,0,0,0,t.range(.92,1.12),t(),0])}for(const i of Qe)f.push([t.range(14,30),t.range(16,26),t()*ae,t.range(.3,.5),i[1],i[2],i[0],i[3],1.05,t(),i[3]===2?e.cast===1?52:30:t.range(9,13)]);for(const i of wa){const v=f[y+i],o=xa;v[3]=-n.range(o.ahead[0],o.ahead[1]),v[2]=n.range(-o.side,o.side),v[1]=n.range(o.up[0],o.up[1]),v[0]=-n.range(o.speed[0],o.speed[1]),v[8]=1.5}const x=f.length;if(r)for(let i=0;i<200;i++){const v=t()*ae,o=22*Math.sqrt(t());f.push([t.range(14,40),t.range(16,30),t()*ae,t.range(.25,.5),ct.x+o*Math.cos(v),ct.z+o*Math.sin(v),t.range(23.9,25.4),1,1.1,t(),t.range(34,44)])}const b=f.length+x,S=new Float32Array(b*4),g=new Float32Array(b*4),q=new Float32Array(b*4);for(let i=0;i<b;i++){const v=i>=f.length,o=f[v?i-f.length:i];S.set([o[0],o[1],o[2],o[3]],i*4),g.set([o[4],o[5],o[6],o[7]],i*4),q.set([v?1:0,o[8],o[9],o[10]],i*4)}const G=new h.InstancedBufferGeometry;G.index=m.index;for(const i of["position","normal","uv","aSt","aW","aFold"])G.setAttribute(i,m.getAttribute(i));G.setAttribute("aA",new h.InstancedBufferAttribute(S,4)),G.setAttribute("aB",new h.InstancedBufferAttribute(g,4)),G.setAttribute("aC",new h.InstancedBufferAttribute(q,4)),G.instanceCount=b;const K={uTime:{value:0},uU:{value:0},uAbove:{value:1},uBoil:{value:Ze.clone()},uDive:{value:s.clone()},uMoon:{value:e.moonWater.clone()}},L=vt(a,`
    attribute vec4 aA, aB, aC; attribute vec3 aFold;
    uniform float uTime, uU, uAbove; uniform vec3 uBoil, uDive;
    vec3 wheelPos(float t){
      float a = aA.z + t * aA.w, r = aA.x * (1.0 + 0.16 * sin(a * 2.0 + aC.z * 9.0));
      return vec3(uBoil.x + r * cos(a), aA.y + 2.0 * sin(a * 1.3 + aC.z * 20.0), uBoil.z + 10.0 + r * 0.85 * sin(a));
    }
    vec3 plungePos(float tau){
      vec3 E = vec3(aB.x, 0.0, aB.y);
      vec3 D = aB.w > 1.5 ? uDive : normalize(vec3(-0.12 * sign(aB.x), -1.0, -0.36));
      if (tau < 0.0) { float s = clamp(-tau / 1.5, 0.0, 1.0); vec3 S = E - D * 27.0 * (0.5 * s * s + 0.5 * s); S.z += 9.0 * s * s; return S; }
      float dmax = max(aC.w, 1.0), v0 = aB.w > 1.5 ? 19.0 : 17.0;
      vec3 P = E + D * dmax * (1.0 - exp(-tau * v0 / dmax));
      float upk = smoothstep(1.3, 3.4, tau);
      P.y += upk * upk * (dmax * 0.8 + 2.0); P.xz += D.xz * upk * 12.0 + vec2(sign(aB.x + 0.01) * 6.0 * upk, 0.0);
      return P;
    }
    vec3 glidePos(float t, float tau){
      return vec3(aA.z + 0.5 * sin(t * 0.7 + aC.z * 20.0), aA.y + 0.5 * sin(t * 0.9 + aC.z * 31.0), aA.w + aA.x * (aB.z + tau));
    }
    vec3 birdPos(float t, float tau){
      vec3 w = aA.x < 0.0 ? glidePos(t, tau) : wheelPos(t);
      if (aB.w < 0.5) return w;
      return mix(w, plungePos(tau), smoothstep(-3.2, -1.5, tau));
    }
    void place(inout vec3 p, inout vec3 n, out float dim){
      float tau = uU * ${be}.0 - aB.z, plunger = step(0.5, aB.w);
      vec3 P = birdPos(uTime, tau), f = birdPos(uTime + 0.08, tau + 0.08) - P;
      f = f / max(length(f), 1e-4);
      vec3 ref = abs(f.y) > 0.97 ? vec3(0.0, 0.0, -1.0) : vec3(0.0, 1.0, 0.0);
      vec3 r = normalize(cross(f, ref)), u = cross(r, f);
      float fold = plunger * smoothstep(-1.55, -1.0, tau) * (1.0 - smoothstep(1.5, 2.6, tau));
      float bank = clamp(aA.w * 1.6, -0.5, 0.5) * (1.0 - plunger * smoothstep(-3.2, -1.5, tau)) * step(0.0, aA.x);
      vec3 r2 = r * cos(bank) + u * sin(bank); u = u * cos(bank) - r * sin(bank); r = r2;
      float as = abs(aW.x), glide = smoothstep(-0.2, 0.5, sin(uTime * 0.45 + aC.z * 31.0));
      float ang = (0.12 + 0.55 * (1.0 - 0.75 * glide) * sin(uTime * 6.5 + aC.z * 50.0 - as * 1.2)) * as;
      vec3 q = p; q.y += as * 1.1 * sin(ang); q.x *= mix(1.0, cos(ang), step(0.001, as));
      q = mix(q, aFold, fold);
      float size = aC.y * 1.4;
      vec3 w = P + (r * q.x + u * q.y + f * q.z) * size;
      vec3 nn = normalize(r * n.x + u * n.y + f * n.z);
      dim = 1.0 - plunger * smoothstep(3.0, 3.5, tau);
      if (aC.x > 0.5) { w.y = -w.y; nn.y = -nn.y; dim *= uAbove * step(0.3, P.y) * 0.9; }
      p = w; n = nn;
    }`,K);L.uniforms.uSwap.value=e.cast===1?1:0,L.uniforms.uFreq.value.set(0,9,0);const P=new h.Mesh(G,L);return P.frustumCulled=!1,P.name="gannets",{object:P,uniforms:K,count:b}}const wa=[4,5,6],xa={ahead:[12,24],side:5,up:[9,13],speed:[8.5,10.5]},ct=c(-25.6,0,-191);async function ga(a,e,t,l,r,s,n){const m=[],f=[],y=[],x=[],b=[],S=(i,v)=>{const o=i.length,d=m.length/3,z=c();for(let p=0;p<o;p++){z.subVectors(i[Math.min(o-1,p+1)],i[Math.max(0,p-1)]).normalize();for(const w of[-1,1])m.push(i[p].x,i[p].y,i[p].z),f.push(z.x,z.y,z.z),y.push(p/(o-1),w),x.push(v[0],v[1],v[2],v[3]);if(p<o-1){const w=d+p*2;b.push(w,w+1,w+2,w+1,w+3,w+2)}}},g=Math.round(24*Ee(l,.8,1.2));for(let i=0;i<g;i++){const v=i%3===0,o=e()*ae,d=e.range(1.9,3.6)*(e.chance(.5)?1:-1),z=v?e.range(14,30):e.range(42,86),p=v?e.range(-50,-32):e.range(-42,4),w=e.range(-10,10),M=e.range(-10,14),E=e.range(1.5,5),D=e.range(2,5),k=e()*ae;let T=0;for(let C=0;C<4;C++){let W=1e9;for(let N=0;N<=20;N++){const he=N/20,re=o+d*he,oe=z+M*he;W=Math.min(W,t.distanceTo(I.x-oe*Math.cos(re),I.y+p+w*he-T,I.z-oe*Math.sin(re)))}if(W>10)break;T+=9}const _=[];for(let C=0;C<=150;C++){const W=C/150,N=o+d*W,he=z+M*W+E*Math.sin(W*D*3+k);_.push(c(I.x-he*Math.cos(N),I.y+p+w*W-T+E*.6*Math.sin(W*D*2.1+k*2),I.z-he*Math.sin(N)))}S(_,[v?.3:0,e(),e.range(9,15),e.range(.14,.24)*(v?1.4:1)]),await n()}await n();const q=(i,v,o,d,z,p,w)=>{const M=d===2?s:c(-.12*Math.sign(i),-1,-.36).normalize(),E=[];for(let D=0;D<=p;D++)E.push(c(i,0,v).addScaledVector(M,z*D/p));S(E,[w?1.5:1,o,(d===2?19:17)/z,w?.14:.1])};for(const i of Qe)q(i[1],i[2],i[0],i[3],i[3]===2?30:11,22);if(r){const i=e.fork("rare-threads");for(let v=0;v<56;v++){const o=i()*ae,d=27*Math.sqrt(i());q(ct.x+d*Math.cos(o),ct.z+d*Math.sin(o),i.range(23.9,25.4),1,i.range(52,74),14,!0)}}await n();{const i=e.fork("under-lines"),v=c(),o=c(),d=c(),z=c();for(let p=0;p<18;p++){const w=.5+.39*(p/18)+i.range(-.01,.01),M=i.range(.1,.16),E=-i.range(1.5,15),D=i.range(6.5,15),k=i.range(.8,2.6),T=i.range(3,7),_=i()*ae,C=[];for(let W=0;W<=100;W++){const N=W/100,he=Math.min(w+M*N,.9);t.pointAt(he,v),t.tangentAt(he,o),d.set(-o.z,0,o.x).normalize(),z.crossVectors(o,d).normalize(),z.y>0&&z.negate();const re=E*(1+.5*N)+k*Math.sin(N*T+_),oe=D*(1+.3*N)+k*.6*Math.cos(N*T*.7+_);C.push(c(v.x+d.x*re+z.x*oe,v.y+z.y*oe,v.z+d.z*re+z.z*oe))}S(C,[.3,i(),i.range(6,9),i.range(.2,.32)]),await n()}}await n();{const i=e.fork("climb-lines"),v=c(),o=c(),d=c(),z=c();for(let p=0;p<5;p++){const w=.79+.035*(p%3)+(p>2?.015:0),M=.17-.03*(p%3),E=p>2?-(18+6*(p-3)):-(8+3.2*p),D=8+2.4*p+i.range(0,2),k=i.range(.7,1.6),T=i.range(3,6),_=i()*ae,C=[];for(let W=0;W<=100;W++){const N=W/100,he=w+M*N;t.pointAt(he,v),t.tangentAt(he,o),d.set(-o.z,0,o.x).normalize(),z.crossVectors(o,d).normalize(),z.y>0&&z.negate();const re=E*(1+.25*N)+k*Math.sin(N*T+_),oe=D*(1+.2*N)+k*.6*Math.cos(N*T*.7+_);C.push(c(v.x+d.x*re+z.x*oe,v.y+z.y*oe,v.z+d.z*re+z.z*oe))}S(C,[.3,i(),i.range(5,7),i.range(.24,.34)]),await n()}}await n();{const i=e.fork("pool-lines");for(let v=0;v<3;v++){const o=i()*ae,d=i.range(5,22)*(v%2?1:-1),z=i.range(95,125),p=I.y-i.range(44,56),w=i.range(4,9),M=i.range(2,4),E=i()*ae,D=[],k=Math.cos(o),T=Math.sin(o);for(let _=0;_<=120;_++){const C=_/120,W=(C-.5)*z,N=d+w*Math.sin(C*M+E);D.push(c(I.x+k*W-T*N,p+2.5*Math.sin(C*3+E),I.z+T*W+k*N))}S(D,[.49,v/3+i.range(-.05,.05),i.range(7.5,9.5),i.range(.5,.7)])}}await n();const G=new h.BufferGeometry;G.setAttribute("position",new h.Float32BufferAttribute(m,3)),G.setAttribute("aTan",new h.Float32BufferAttribute(f,3)),G.setAttribute("uv",new h.Float32BufferAttribute(y,2)),G.setAttribute("aK",new h.Float32BufferAttribute(x,4)),G.setIndex(b);const K={uTime:{value:0},uU:{value:0},uPx:{value:.003}},L=new h.ShaderMaterial({uniforms:K,fog:!1,side:h.DoubleSide,transparent:!0,depthWrite:!1,blending:h.AdditiveBlending,vertexShader:`
      attribute vec3 aTan; attribute vec4 aK; uniform float uTime, uU, uPx;
      varying vec2 vUv; varying vec3 vI; varying float vDist;
      void main(){
        float s = uv.x, inten = 0.0, wet = 0.0, taper = 1.0;
        if (aK.x < 0.5) {
          float h = fract(uTime / aK.z + aK.y) * 1.7, back = h - s, tail = 3.6 / aK.z * 1.7;
          inten = step(0.0, back) * exp(-max(back, 0.0) / max(tail * 0.45, 1e-3)) * (1.0 - smoothstep(tail, tail * 1.5, back));
          wet = exp(-max(back, 0.0) * 60.0); taper = 0.35 + 0.65 * exp(-max(back, 0.0) * 8.0);
          inten *= smoothstep(0.0, 0.04, s) * (1.0 - smoothstep(0.96, 1.0, s));
        } else {
          float tau = uU * ${be}.0 - aK.y, h = 1.0 - exp(-max(tau, 0.0) * aK.z);
          float ts = -log(max(1.0 - min(s, 0.999), 1e-3)) / max(aK.z, 1e-3), age = tau - ts;
          inten = step(0.0, age) * step(s, h) * (0.3 + 0.7 * exp(-max(age, 0.0) * 0.5)) * (1.0 - smoothstep(9.0, 22.0, age));
          wet = exp(-max(age, 0.0) * 5.0); taper = 0.5 + 0.5 * wet;
        }
        vec4 mv = viewMatrix * vec4(position, 1.0);
        vec3 t = mat3(viewMatrix) * aTan, sd = cross(t, mv.xyz); sd = sd / max(length(sd), 1e-4);
        float d = length(mv.xyz), w0 = aK.w * taper, wmin = 1.15 * uPx * d, w = max(w0, wmin);
        mv.xyz += sd * uv.y * w;
        vUv = uv; vDist = d; vI = vec3(inten * clamp(w0 / max(wmin, 1e-5), 0.4, 1.0) * (1.0 + 3.0 * min(aK.x, 0.5) * step(aK.x, 0.5) + 1.2 * step(1.25, aK.x)), wet, 0.0);
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:a+`
      varying vec2 vUv; varying vec3 vI; varying float vDist;
      void main(){
        float a = 1.0 - vUv.y * vUv.y; a *= a;
        vec3 col = mix(LQ_AMBER * 1.5, LQ_GOLD, 0.25 + 0.75 * vI.y) * (0.55 + 0.9 * vI.y) * vI.x * a;
        col *= smoothstep(0.6, 3.0, vDist);
        gl_FragColor = vec4(lqDepth(col, vDist * 0.6), 1.0);
      }`}),P=new h.Mesh(G,L);return P.frustumCulled=!1,P.renderOrder=7,P.name="brush-lines",{object:P,uniforms:K}}function ya(a,e,t,l){const r=[],s=[],n=(b,S,g,q,G,K)=>{const L=q===2?t:c(-.12*Math.sign(b),-1,-.36).normalize();for(let P=0;P<G;P++){const i=e.chance(.4)?1:0,v=e()*ae,o=Math.sqrt(e());if(r.push(b,S,g,e()),i)s.push(Math.cos(v)*o*2.6*K,e.range(3,7.5),Math.sin(v)*o*2.6*K,1);else{const d=e.range(.5,q===0?14:9)*K;s.push(L.x*d+Math.cos(v)*o*1.3*K,L.y*d,L.z*d+Math.sin(v)*o*1.3*K,0)}}};for(const b of Qe)n(b[1],b[2],b[0],b[3],64,1);n(l.x,l.z,l.sec,0,220,2.4);const m=r.length/4,f=new h.InstancedBufferGeometry;f.setAttribute("position",new h.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),f.setIndex([0,1,2,0,2,3]),f.setAttribute("aE",new h.InstancedBufferAttribute(new Float32Array(r),4)),f.setAttribute("aV",new h.InstancedBufferAttribute(new Float32Array(s),4)),f.instanceCount=m;const y={uU:{value:0},uPx:{value:.003},uGain:{value:1}},x=new h.Mesh(f,new h.ShaderMaterial({uniforms:y,fog:!1,transparent:!0,depthWrite:!1,blending:h.AdditiveBlending,vertexShader:`
      attribute vec4 aE, aV; uniform float uU, uPx; varying vec2 vC; varying vec3 vK;
      void main(){
        float tau = uU * ${be}.0 - aE.z - 0.05 * aE.w, t = max(tau, 0.0);
        vec3 P = vec3(aE.x, 0.0, aE.y);
        if (aV.w > 0.5) { P += vec3(aV.x * t, aV.y * t - 4.9 * t * t, aV.z * t) * 0.9; }
        else { P += aV.xyz * (1.0 - exp(-t * 2.6)); P.y += 0.9 * (1.0 - exp(-t * 0.5)) * (0.4 + aE.w); }   // rises like a bubble, then is caught
        float alive = step(0.0, tau) * (aV.w > 0.5 ? step(0.0, P.y) : 1.0 - smoothstep(12.0, 24.0, tau));
        vec4 mv = viewMatrix * vec4(P, 1.0); float d = max(-mv.z, 0.01);
        float sz = max(0.035 + 0.05 * aE.w, 1.2 * uPx * d);
        mv.xy += position.xy * sz * alive;
        vC = position.xy; vK = vec3(tau, d, alive * clamp((0.035 + 0.05 * aE.w) / max(1.2 * uPx * d, 1e-5), 0.3, 1.0));
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:a+`
      uniform float uGain; varying vec2 vC; varying vec3 vK;
      void main(){
        float r = length(vC), a = (1.0 - smoothstep(0.3, 1.0, r)) * uGain;
        vec3 col = mix(LQ_GOLD * 1.3, LQ_AMBER * 1.1, smoothstep(0.8, 5.0, vK.x)) * a * vK.z * smoothstep(0.5, 2.0, vK.y) * (0.3 + 0.7 * smoothstep(0.0, 0.5, vK.x));
        gl_FragColor = vec4(lqDepth(col, vK.y * 0.7), 1.0);
      }`}));return x.frustumCulled=!1,x.renderOrder=8,x.name="dust-bursts",{object:x,uniforms:y}}function ba(a,e,t){const r=new Float32Array(800);for(let f=0;f<200;f++){const y=e()*ae,x=8.5*Math.sqrt(e());r.set([Ze.x+x*Math.cos(y),Ze.z+x*Math.sin(y),e(),e()],f*4)}const s=new h.InstancedBufferGeometry;s.setAttribute("position",new h.Float32BufferAttribute([-.5,-.5,0,.5,-.5,0,.5,.5,0,-.5,.5,0],3)),s.setIndex([0,1,2,0,2,3]),s.setAttribute("aS",new h.InstancedBufferAttribute(r,4)),s.instanceCount=200;const n={uTime:{value:0},uMoon:{value:t.moonWater.clone()}},m=new h.Mesh(s,new h.ShaderMaterial({uniforms:n,fog:!1,side:h.DoubleSide,vertexShader:`
      attribute vec4 aS; uniform float uTime; varying vec2 vQ; varying vec3 vN, vW; varying float vPh;
      void main(){
        float T = 0.8 + 0.9 * aS.w, cyc = uTime / T + aS.z, k = floor(cyc), t = fract(cyc);
        float act = step(0.45, fract(sin(k * 12.9898 + aS.w * 78.233) * 43758.5453));
        float hgt = (0.25 + 0.75 * aS.z) * act, y = 4.0 * hgt * t * (1.0 - t) - 0.18;
        float a = aS.w * 6.283 + k * 2.4, tip = (0.5 - t) * 2.2 * act, spin = t * 6.283 * act + aS.z * 6.283;
        vec3 fw = normalize(vec3(cos(a) * cos(tip), sin(tip), sin(a) * cos(tip)));
        vec3 sd = normalize(cross(fw, vec3(0.0, 1.0, 0.0)) + vec3(0.0, 1e-4, 0.0)), up = cross(sd, fw);
        vec3 b = sd * cos(spin) + up * sin(spin);
        vec3 w = vec3(aS.x, y, aS.y) + fw * (t - 0.5) * 0.9 * act + (fw * position.x + b * position.y * 0.42) * 0.42;
        vQ = position.xy; vN = cross(fw, b); vW = w; vPh = aS.z;
        gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
      }`,fragmentShader:a+`
      uniform vec3 uMoon; varying vec2 vQ; varying vec3 vN, vW; varying float vPh;
      void main(){
        float x = vQ.x + 0.5, e = 0.5 * sin(3.1416 * clamp(x, 0.0, 1.0)) * (0.55 + 0.45 * x) - abs(vQ.y);
        if (e < 0.0) discard;
        vec3 toEye = cameraPosition - vW; float dist = length(toEye), lit;
        vec3 col = lqShell(normalize(vN), toEye / max(dist, 1e-3), uMoon, vPh, lit) * 1.3;
        col += LQ_SILVER * 0.25 * (1.0 - smoothstep(0.0, 0.08, e));
        gl_FragColor = vec4(lqDepth(col, dist * 0.6), 1.0);
      }`}));return m.frustumCulled=!1,m.name="boil-chips",{object:m,uniforms:n}}const za=[{name:"full moon",elev:8.5,radius:3.5,disc:"#DCE0E3",discGain:1,kind:[0,1,0],foil:"#DCE0E3",cell:4.6,spread:.5,stars:4e3,starGain:1,rain:0,breeze:0,shell:0,cast:0},{name:"gold-leaf sun",elev:9,radius:4.3,disc:"#E2B13C",discGain:1.12,kind:[0,0,1],foil:"#E2B13C",cell:2.5,spread:.72,stars:0,haze:3200,starGain:.95,rain:0,breeze:1,shell:1,cast:1},{name:"crescent and rain",elev:10,radius:3.6,disc:"#DCE0E3",discGain:1.05,kind:[1,.6,0],foil:"#DCE0E3",cell:3.4,spread:.6,stars:7e3,starGain:1.25,rain:1,breeze:0,shell:2,cast:0},{name:"low moon",elev:6,radius:3.8,disc:"#DCE0E3",discGain:1,kind:[0,1,0],foil:"#DCE0E3",cell:5.4,spread:.42,stars:4e3,starGain:.9,rain:0,breeze:0,shell:0,cast:0}];function Ma(a,e){let t=a.pick([0,0,1,2,3]);e.hour==="golden"?t=1:e.hour==="dawn"?t=2:e.hour==="night"&&t===1&&(t=a.pick([0,3]));const l={...za[t],index:t},r=a.fork("raden");r();const s=r();l.shell=s<.5?0:s<.75?1:2,l.sailfish=a.int(7,12);const n=1.5*ge,m=l.elev*ge,f=Math.acos(Math.cos(m)/1.333);l.moonAir=c(Math.sin(n)*Math.cos(m),Math.sin(m),-Math.cos(n)*Math.cos(m)).normalize(),l.moonWater=c(Math.sin(n)*Math.cos(f),Math.sin(f),-Math.cos(n)*Math.cos(f)).normalize(),l.moonX=c().crossVectors(c(0,1,0),l.moonAir).normalize(),l.moonY=c().crossVectors(l.moonAir,l.moonX).normalize();const y=Math.max(f+5*ge,48*ge);return l.azSeen=n,l.elSeen=y,l.moonSeen=c(Math.sin(n)*Math.cos(y),Math.sin(y),-Math.cos(n)*Math.cos(y)).normalize(),l.seenX=c().crossVectors(c(0,1,0),l.moonSeen).normalize(),l.seenY=c().crossVectors(l.moonSeen,l.seenX).normalize(),l.moonRadius=l.radius*ge,l.discColor=new h.Color(l.disc).multiplyScalar(l.discGain),l.foilColor=new h.Color(l.foil).multiplyScalar(1.15),l.roofColor=new h.Color(t===1?"#F0E8C4":"#B9D2EC").multiplyScalar(1.25),l.moonKind=c(l.kind[0],l.kind[1],l.kind[2]),l}var Da={id:"mother-of-pearl-shoal",name:"The Mother-of-Pearl Shoal",category:"ocean",weirdness:.35,media:["air","underwater"],async build(a){const e=a.rng,t=a.quality?.detail??1,l=a.vary||{},r=Ee(l.density??1,.7,1.3),s=!!l.rare,n=Ma(e.fork("lacquer"),l),m=new h.Scene;m.background=new h.Color(Pe[0]);const f=jt();await a.yield();const y=Ft(f);await a.yield();const x=oa(y);await a.yield();const b=Kt(Pe,n.shell),S={value:0};let g=.13;for(let H=0;H<200;H++)if(y.pointAt(H/200*.3).y<0){g=H/200*.3;break}const q=y.pointAt(g),G=y.tangentAt(g+.05).normalize(),K=c(),L=await At(a,{palette:Pe,shell:n.shell,density:Q(.8,1,(r-.7)/.6),moonDir:n.moonWater,keys:Yt,gain:1.5});L.object.position.copy(Se),L.object.updateMatrixWorld(!0),m.add(L.object),L.setRiverSpline(x.river.map(H=>H.clone().sub(Se)));const P=L.makeMirror(0,.4);await a.yield();const i=[],v=70,o=60,d=[230,150],z=110,p=10,w=[[0,.3,.5],[1,.5,-.75],[.62,-.4,1.25],[.8,.9,1.1]];for(const[H,j]of w.entries()){const te=await At({...a,rng:e.fork("far"+H)},{palette:Pe,shell:n.shell,count:3600,density:1,chipLength:.16,moonDir:n.moonWater,gain:.5,fray:1,loose:.7,heart:1,ghost:.95});te.mid.visible=!1,te.ringCore.visible=!1,te.core.visible=!1,te.setFunnel(j[0]),te.chips&&(te.chips.material.uniforms.uGain.value=3.2);const V=(v+o*H)*ge,X=d[H%2],ie=X/z;te.object.rotation.set(j[1],0,j[2]),te.object.scale.setScalar(ie),te.object.position.set(I.x+X*Math.cos(V),-(20*ie+p),I.z+X*Math.sin(V)).sub(K.set(0,20*ie,0).applyEuler(te.object.rotation)),te.object.updateMatrixWorld(!0),m.add(te.object),i.push(te),await a.yield()}const M=await ha(b,n,()=>a.yield());m.add(M.object),await a.yield();const E=fa(n.moonWater,St(a.seed+9241)),D=ua(b,n,L.uniforms.uDirs.value.x,E);m.add(D.object),await a.yield();const k=da(b,n,E);m.add(k.object),await a.yield();const T=va(b,n,e.fork("sky"),t);m.add(T.object),await a.yield();const _=pa(b,n,e.fork("birds"),r,s,G,a.core.makeRng(a.core.hashSeed("greeters:"+a.seed)));m.add(_.object),await a.yield();const C=n.sailfish,W=ia();await a.yield();const N=new h.InstancedBufferAttribute(new Float32Array(C*4),4);N.setUsage(h.DynamicDrawUsage),W.setAttribute("aInst",N);const he={uTime:S,uMoon:{value:n.moonWater.clone()}},re=vt(b,`
      attribute vec4 aInst; uniform float uTime;
      void place(inout vec3 p, inout vec3 n, out float dim){
        p.y -= aW.y * aW.x * (1.0 - aInst.x);
        p.x += aW.x * 0.06 * aInst.x * sin(p.z * 7.0 - aInst.y * 0.6);
        p.x += aW.z * aW.z * 0.2 * sin(aInst.y + p.z * 3.2);
        p = (instanceMatrix * vec4(p, 1.0)).xyz; n = normalize(mat3(instanceMatrix) * n); dim = aInst.z;
      }`,he);re.uniforms.uFreq.value.set(15,10,15),re.uniforms.uGain.value=1.08;const oe=new h.InstancedMesh(W,re,C);oe.frustumCulled=!1,oe.name="sailfish",m.add(oe);const fe=e.fork("sailfish"),Ge=[];for(let H=0;H<C;H++)Ge.push({up:H%2===0,y:H%2===0?fe.range(7,18):fe.range(-18,-9),a0:fe()*ae,dir:fe.chance(.7)?1:-1,speed:fe.range(5,8),seed:fe()*40,size:fe.range(1.45,1.75)});{const H=fe()*ae,j=fe.range(-5,5),te=fe.range(.5,1.3);for(let V=3;V<C;V++){const X=Ge[V];V%3!==0&&(X.a0=H+fe.gauss()*te),X.y=Ee(X.y*fe.range(.55,1.08)+j,-19,19)}}await a.yield();const ve={uA:{value:c()},uB:{value:c(0,0,1)},uC:{value:c(0,0,2)},uJaw:{value:0},uPleat:{value:0},uStroke:{value:0},uShow:{value:1},uDeep:{value:new h.Vector2(it[0],it[1])},uYaw:{value:0},uBig:{value:1},uFluke:{value:1.15},uFin:{value:1.2},uMoon:{value:n.moonWater.clone()}},Ae=vt(b,`
      uniform vec3 uA, uB, uC; uniform vec2 uDeep; uniform float uJaw, uPleat, uStroke, uShow, uYaw, uBig, uFluke, uFin;
      void place(inout vec3 p, inout vec3 n, out float dim){
        p.y += aSt.w * step(4.5, aSt.x) * (1.0 - smoothstep(0.1, 0.55, uJaw));   // the baleen hangs only in an open mouth
        // the gape bows the lower jaw out into a pouch, from nothing at the hinge (no step there) to its widest at
        // mid-jaw and in again to the chin; the rostrum stays a blade; the normals follow the bow
        float bow = 1.0 + uJaw * (0.1 * smoothstep(0.5, 4.0, p.z) + 0.6 * aW.x * smoothstep(${rt[1].toFixed(2)}, 5.4, p.z) * (1.0 - 0.45 * smoothstep(6.0, 7.5, p.z)));
        p.x *= bow; n.x /= bow;
        p.y *= 1.0 + 0.3 * uJaw * smoothstep(-3.0, 2.0, p.z);
        // the throat pouch balloons, in the rest pose (before the jaw swings), so it is round about the jaw's own line
        vec2 o = vec2(p.x, p.y + 0.1); o = o / max(length(o), 1e-3);
        float pb = aW.y * uPleat; p.xy += o * pb * 1.0; p.y -= pb * 0.7;
        float ja = aW.x * uJaw * 0.9, c = cos(ja), s = sin(ja); vec2 h = vec2(${rt[0].toFixed(2)}, ${rt[1].toFixed(2)}), d = p.yz - h;
        p.yz = h + vec2(d.x * c - d.y * s, d.y * c + d.x * s); n.yz = vec2(n.y * c - n.z * s, n.z * c + n.y * s);
        // as on a panel, the tail is drawn turned about the body's own line (uFluke: part-way while it climbs, a little
        // more for the bite, so both flukes stand clear), and the pectorals hang well below the belly's line (uFin)
        // (and swung half a radian about the body's upright, so one fluke trails and the other leads: the pair is seen
        // three-quarter on, a broad shallow V with a near blade and a far one, never a fish's upright tail)
        float fy = 0.5 * aW.z * aW.z, fyc = cos(fy), fys = sin(fy); vec2 fq = vec2(p.x, p.z + 6.9);
        p.x = fq.x * fyc - fq.y * fys; p.z = -6.9 + fq.x * fys + fq.y * fyc; n.xz = vec2(n.x * fyc - n.z * fys, n.x * fys + n.z * fyc);
        float ta = uFluke * aW.z * aW.z, tcs = cos(ta), tsn = sin(ta);
        p.xy = vec2(p.x * tcs - p.y * tsn, p.x * tsn + p.y * tcs); n.xy = vec2(n.x * tcs - n.y * tsn, n.x * tsn + n.y * tcs);
        p.y -= aW.w * uFin; p.x *= 1.0 + 0.25 * aW.w * uFin;
        p.y += aW.z * aW.z * 0.9 * sin(uStroke) + aW.w * 0.3 * sin(uStroke * 0.5 + 1.0);
        p.xy *= uBig;                                                   // the lunge is drawn a third larger (uA, uC are sampled further apart to match)
        float z = clamp(p.z / 7.5, -1.3, 1.3);
        vec3 hf = (uC - uA) * 0.5, bend = (uA + uC) * 0.5 - uB;
        // the body never folds: its curve is held to a gentle arc (three tenths of its half-length) and it keeps its
        // whole length where the route turns under it (the same law places the mouth, in update)
        float hl = max(length(hf), 1e-3); bend *= min(1.0, 0.3 * hl / max(length(bend), 1e-3)); hf *= 7.5 * uBig / hl;
        vec3 Q = uB + hf * z + bend * z * z, T = hf + 2.0 * bend * z; T = T / max(length(T), 1e-3);
        vec3 S = cameraPosition - Q; S -= T * dot(S, T); S = S / max(length(S), 1e-3);
        vec3 D = cross(T, S);
        // uYaw turns the belly (and the open mouth) toward the lens for the lunge; 0 is the panel's side view
        float cy = cos(uYaw), sy = sin(uYaw); vec3 S2 = S * cy + D * sy; D = D * cy - S * sy; S = S2;
        p = Q + S * p.x + D * p.y; n = normalize(S * n.x + D * n.y + T * n.z);
        // it is lit by its own height: black lacquer in the deep, amber as it rises, full gold above (uDeep, world y), so
        // it comes up out of the dark head first and its tail is still dim when its head is at the throat
        dim = uShow * smoothstep(uDeep.x, uDeep.y, p.y);
      }`,ve);Ae.uniforms.uFreq.value.set(2.2,4.125,0),Ae.uniforms.uGain.value=1.12,Ae.uniforms.uBelly.value=1,Ae.uniforms.uRim.value=1,Ae.uniforms.uDepthK.value=.45,Ae.uniforms.uHairW.value=1.3,Ae.uniforms.uHairK.value=.7,await a.yield();const $=new h.Mesh(await na(()=>a.yield()),Ae);$.frustumCulled=!1,$.name="whale",m.add($),await a.yield();const U=await ga(b,e.fork("lines"),y,r,s,G,()=>a.yield());m.add(U.object),await a.yield();const u=ya(b,e.fork("bursts"),G,{x:q.x,z:q.z,sec:g*be});m.add(u.object),await a.yield();const B=ba(b,e.fork("boil"),n);m.add(B.object),await a.yield();const O=ma(b,n,St(a.seed+4177),[[le.bite-.32,c(Se.x,Se.y+.5,Se.z),320,9,-.2,[.09,.19]],[le.bite-.05,c(Se.x,Se.y+6,Se.z),520,15,.15,[.09,.19]],...dt.map((H,j)=>[H.u*be+.12,x.slashPos(j,.12,c()),240,5,-.2,[.012,.025]])]);m.add(O.object),await a.yield();const F=Oe.makeParticles({rng:e.fork("dust"),preset:"dust",fog:!1,time:S,count:Math.round(2600*t*r),box:[40,26,40],colors:[Pe[1],Pe[2],"#8A4B12"],velocity:[.02,-.15,.01],velocityRandom:[.05,.06,.05],size:[.026,.058],intensity:1.5});m.add(F.object),await a.yield();const ee=Oe.makeParticles({rng:e.fork("scales"),preset:"petals",fog:!1,time:S,count:Math.round(3400*t),box:[34,26,34],colors:[Pe[4],Pe[5],Pe[3]],velocity:[.03,-.38,.02],velocityRandom:[.12,.14,.12],turbulence:[.25,.1,.5],size:[.05,.09],lightDir:[n.moonWater.x,n.moonWater.y,n.moonWater.z]});m.add(ee.object),await a.yield();const se=n.rain>0?Oe.makeParticles({rng:e.fork("rain"),preset:"rain",fog:!1,time:S,count:Math.round(2600*t),colors:[Pe[3],Pe[3],Pe[3]],intensity:.7}):null;se&&m.add(se.object);const ce=c(),ke=c(),we=c(),me=c(),ne=c(),Be=c(),pe=c(),J=c(),Y=c(),qt=c(),gt=new h.Vector2,yt=new h.Matrix4,je=c(),Ve=c(),st=c(),Ue=c(),Sa=y.length,bt=L.riverRide,Je=x.river,ht=Je.length,Gt=(H,j,te)=>{const V=Ee(H,0,1)*(ht-1),X=Math.min(Math.floor(V),ht-2),ie=V-X,De=ie*ie,We=De*ie,Re=Je[Math.max(X-1,0)],ye=Je[X],xe=Je[X+1],Ie=Je[Math.min(X+2,ht-1)],He=2*We-3*De+1,R=We-2*De+ie,Z=3*De-2*We,ue=We-De,ze=6*De-6*ie,Te=3*De-4*ie+1,Fe=3*De-2*ie;return te.set(ze*(ye.x-xe.x)+.5*Te*(xe.x-Re.x)+.5*Fe*(Ie.x-ye.x),ze*(ye.y-xe.y)+.5*Te*(xe.y-Re.y)+.5*Fe*(Ie.y-ye.y),ze*(ye.z-xe.z)+.5*Te*(xe.z-Re.z)+.5*Fe*(Ie.z-ye.z)),j.set(He*ye.x+.5*R*(xe.x-Re.x)+Z*xe.x+.5*ue*(Ie.x-ye.x),He*ye.y+.5*R*(xe.y-Re.y)+Z*xe.y+.5*ue*(Ie.y-ye.y),He*ye.z+.5*R*(xe.z-Re.z)+Z*xe.z+.5*ue*(Ie.z-ye.z))},Vt=H=>2.5+9.5*Math.pow(Math.max(H,0),1.7),ft=[c(),c(),c(),c(),c(),c()],Wt=[2.7,2.2,2.7,2.7,2.4,3];return{scene:m,path:y,duration:be,style:"none",ride:"none",camera:{fov:62,near:.3,far:3e3,lookAhead:kt,sway:.8,bank:.8},pois:[{at:(H,j)=>x.gazeAt(j,qt),from:-.5,to:1.5,weight:1,fade:.01}],portal:{shape:"circle",radius:7,color:"#F2D98A",tilt:!0,revealDistance:130,glow:.8},post:{exposure:1,bloom:{strength:.25,radius:.5,threshold:.9},grade:{saturation:1,contrast:1,tint:"#ffffff",shadowTint:"#000000",vignette:0,grain:0,aberration:0}},_choreo:x,_mood:n,update(H,j,te,V){const X=V*be;S.value=j,me.setFromMatrixPosition(te.matrixWorld);const ie=me.y>.22*Math.sin(me.x*.11+j*.7)+.16*Math.sin(me.z*.17-j*.55+me.x*.05)+.08*Math.sin((me.x+me.z)*.31+j*1.1);a.renderer.getDrawingBufferSize(gt);const De=2/(te.projectionMatrix.elements[5]*Math.max(gt.y,1));M.uniforms.uTime.value=j,M.uniforms.uRoofK.value=Q(.34,1,A(.64,.74,V)),M.uniforms.uAboveK.value=ie?1:0,M.uniforms.uClimb.value=Math.max(A(.72,.8,V),A(.29,.53,te.getWorldDirection(we).y)),M.uniforms.uCenter.value.set(me.x,0,me.z);{const R=n.azSeen+24*ge*A(.68,.84,V),Z=Math.cos(n.elSeen),ue=M.uniforms.uSeen.value;ue.set(Math.sin(R)*Z,Math.sin(n.elSeen),-Math.cos(R)*Z),M.uniforms.uSx.value.set(ue.z,0,-ue.x).normalize(),M.uniforms.uSy.value.crossVectors(ue,M.uniforms.uSx.value)}D.object.visible=!ie,D.uniforms.uTime.value=j,D.uniforms.uCenter.value.set(me.x,0,me.z),D.uniforms.uGnd.value=Q(.6,1,A(.22,.32,V));const We=x.whaleOn(X),Re=A(g-.01,g+.03,V)*(1-.5*We)*(1-A(.63,.69,V));k.object.visible=!ie,k.uniforms.uTime.value=j,k.uniforms.uGain.value=Re,k.uniforms.uGain2.value=A(.74,.82,V);{const R=x.sink(V);x.focus(V,Ve),k.uniforms.uKeep.value.set(Ve.x,Ve.y,Ve.z,Q(L.radius+4,15,R)),k.uniforms.uKeepK.value=Q(.8,.9,R)*(1-A(.64,.69,V))}D.uniforms.uShaft.value=Math.min(1,Re*1.4),D.uniforms.uShaft2.value=k.uniforms.uGain2.value,D.uniforms.uPool.value=1-A(.63,.69,V),T.object.visible=ie,T.dustU.uPx.value=De,P.visible=!ie,L.object.visible=me.y<1.5;for(const R of i)R.object.visible=!ie,R.update(H,j,te);ee.setOpacity(ie?0:1);for(let R=0;R<Qe.length;R++)M.rings[R].set(Qe[R][1],Qe[R][2],X-Qe[R][0],1);M.rings[15].set(q.x,q.z,X-g*be,1.4),L.setProgress(V),L.setSwell(1+.14*(1-A(.255,.315,V))),L.update(H,j,te);const ye=L.uniforms.uFunnel.value,xe=We*x.whaleBig(X);if(xe>0)for(let R=0;R<6;R++)x.whalePose(X,-1+.4*R,ft[R]);for(let R=0;R<C;R++){const Z=Ge[R];let ue,ze,Te=1;if(R<3){const de=(V-dt[R].u)*be;x.slashPos(R,de,ne),x.slashPos(R,de+.06,ce),Y.subVectors(ce,ne).normalize(),pe.subVectors(ne,I).normalize();const Me=Xe(de,-1.4,2.5,.5);if(Me>.01?(x.slashPos(R,de-1.25,ke),L.setKeepOut(R,ne,ke,2.35*Me)):L.clearKeepOut(R),ue=Q(.25,1,Xe(de,-2.2,2,.6)),ze=de*14+Z.seed,je.setScalar(1.45),V>.66&&(Te=1-A(.66,.7,V)+A(.72,.78,V),V>.71)){const Ce=R===1?-1:1,qe=Z.a0+R*2.1+Ce*j*.3,nt=19.5+2.4*R,zt=Math.cos(qe),Mt=Math.sin(qe);we.copy(Pt).multiplyScalar(zt).addScaledVector(tt,Mt),ne.copy(Ye).addScaledVector(we,nt).addScaledVector(Ne,1.5*R-1.5),Y.copy(Pt).multiplyScalar(-Mt*Ce).addScaledVector(tt,zt*Ce),pe.copy(Ne),ce.crossVectors(Y,pe).dot(we)<0&&pe.negate(),ue=1,ze=j*8+Z.seed,je.setScalar(2.2)}}else{const de=Ee((Z.y+20)/36,0,1),Me=Math.sqrt(Math.max(400-Z.y*Z.y,9))+4.2,Ce=Q(Me,Vt(de)+5.5,ye)+9*A(.64,.8,V),qe=Z.a0+Z.dir*j*Z.speed/22;ne.set(I.x+Ce*Math.cos(qe),I.y+Z.y+1.2*Math.sin(j*.4+Z.seed),I.z+Ce*Math.sin(qe)),Y.set(-Math.sin(qe)*Z.dir,.12*Math.cos(j*.4+Z.seed),Math.cos(qe)*Z.dir).normalize(),pe.set(Math.cos(qe),0,Math.sin(qe));const nt=1-A(.19,.27,V);ue=Math.max(.3+.7*Math.max(0,Math.sin(j*.5+Z.seed)),ye*(1-A(.62,.7,V)),nt),ze=j*8+Z.seed,je.setScalar(Z.size*(1+.75*nt))}const Fe=R-3;if(Fe>=0&&Fe<4){const de=Ee((L.uniforms.uRiver.value-($t+Jt*Fe)*bt.spread)/bt.dur,0,1);if(de>0){const Me=A(lt[0],lt[1],de),Ce=.35*Math.sin(j*.6+Z.seed);Gt(de,Ve,st),Ue.set(-st.z,0,st.x),Ue.lengthSq()<1e-6&&Ue.set(1,0,0),Ue.normalize(),Ve.addScaledVector(Ue,Et[0]+Et[1]*Fe-mt),Ve.y+=Zt+Ce,ne.lerp(Ve,Me),Y.lerp(st.normalize(),Me).normalize(),pe.lerp(Ue.negate(),Me),ue=Q(ue,1,Me),je.setScalar(Q(je.x,1.5,Me)),Te=1-A(lt[2],lt[3],de)}}if(xe>0)for(let de=0;de<6;de++){ce.subVectors(ne,ft[de]);const Me=ce.length(),Ce=Wt[de]*xe+1.9*je.x*We;Me<Ce&&ne.copy(ft[de]).addScaledVector(Me>.001?ce.multiplyScalar(1/Me):ce.set(0,1,0),Ce)}pe.addScaledVector(Y,-pe.dot(Y)).normalize(),J.crossVectors(Y,pe),yt.makeBasis(pe,J,Y).scale(je).setPosition(ne),oe.setMatrixAt(R,yt),N.setXYZW(R,ue,ze,Te,0)}oe.instanceMatrix.needsUpdate=!0,N.needsUpdate=!0;const Ie=1*Xe(V,.36,.5,.02)+1.7*Xe(V,.42,.487,.014);Ie>.01?(y.pointAt(V,ne),y.tangentAt(V,Be),ce.copy(ne).addScaledVector(Be,-3),ke.copy(ne).addScaledVector(Be,9),L.setKeepOut(3,ce,ke,Ie)):L.clearKeepOut(3);const He=X>le.pass-1.6&&X<le.gone+.25;if(ve.uShow.value=He?1:0,He){const R=x.whaleD(X),Z=x.whaleJaw(X),ue=x.whaleGape(X),ze=X-le.bite,Te=x.whaleBig(X);ve.uBig.value=Te,x.whaleABC(X,ve.uA.value,ve.uB.value,ve.uC.value),ve.uJaw.value=Math.max(.03,Z),ve.uPleat.value=ue*(1-.45*A(.6,1.4,ze)),ve.uYaw.value=Ut*A(-.7,-.1,ze)*(1-A(.3,.7,ze)),ve.uFin.value=1.2+.8*A(.2,.7,ze),ve.uStroke.value=R*et.k+.6+j*.8,ve.uFluke.value=Q(.75,1,A(-.7,-.1,ze)),x.whalePose(X,.773,ce),L.setMouth(ce,4.8*Z*Te),ue>0&&L.setEaten(((x.whalePose(X,1,ke).y-Se.y)/ut+.04)/.56*ue)}else L.setMouth(ce.set(0,-1e4,0),0);_.uniforms.uTime.value=j,_.uniforms.uU.value=V,_.uniforms.uAbove.value=ie?1:0,U.uniforms.uTime.value=j,U.uniforms.uU.value=V,U.uniforms.uPx.value=De,u.uniforms.uU.value=V,u.uniforms.uPx.value=De,u.uniforms.uGain.value=1-.34*A(.14,.17,V),O.uniforms.uU.value=V,O.uniforms.uPx.value=De,O.uniforms.uTime.value=j,O.object.visible=!ie,B.uniforms.uTime.value=j,F.update(H,j,te),ee.update(H,j,te),se&&(se.setOpacity(ie?1:0),se.update(H,j,te))},dispose(){}}}};export{Da as default};
