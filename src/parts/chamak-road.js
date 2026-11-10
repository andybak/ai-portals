import*as x from"three";const $e=["#0A0E26","#3A2C5C","#E3122B","#0FAE4B","#FFC21A","#1560F0","#F4F8FF"],j=205,Qe=6,ke=6.35,Ne=46,we=7.3,ge=3.3,Me=3.6,ae=Math.PI*2;function me(){const t=[],C=[],O=[],R=[],N=[],H=[],V={tile:-1,gate:0,kind:0,param:0,pivot:[0,0,0,0],tint:[1,1,1]};let k=new x.Matrix4;const W=[],_=new x.Matrix3,b=new x.Vector3,m=new x.Vector3,h=new x.Vector3,a=new x.Vector3,z=new x.Vector3,r=new x.Vector3,n=[];let u=0,s=!1,e=!0;const i=()=>{u++===0&&!s&&n.push(t.length/3)},v=()=>{--u===0&&(e=!0)},p={st:V,set(c){return Object.assign(V,c),e=!0,p},thing(c){c?(n.push(t.length/3),s=!0):(s=!1,e=!0)},push(c){W.push(k.clone()),k=k.clone().multiply(c),_.getNormalMatrix(k)},pop(){k=W.pop(),_.getNormalMatrix(k)},at(c,M,q,F=0,y=1){p.push(new x.Matrix4().compose(new x.Vector3(c,M,q),new x.Quaternion().setFromAxisAngle(new x.Vector3(0,1,0),F),new x.Vector3(y,y,y)))},v(c,M,q,F,y){e&&(!u&&!s&&n.push(t.length/3),e=!1),b.set(c[0],c[1],c[2]).applyMatrix4(k),m.set(M[0],M[1],M[2]).applyMatrix3(_).normalize(),t.push(b.x,b.y,b.z),C.push(m.x,m.y,m.z),O.push(q,F),R.push(V.tile,y===void 0?V.gate:y,V.kind,V.param);const g=V.kind;g===0||g===7?N.push(0,0,0,V.pivot[3]):g===5?N.push(V.pivot[0],V.pivot[1],0,V.pivot[3]):(h.set(V.pivot[0],V.pivot[1],V.pivot[2]),g!==4?h.applyMatrix4(k):h.transformDirection(k),N.push(h.x,h.y,h.z,V.pivot[3])),H.push(V.tint[0],V.tint[1],V.tint[2])},faceN(c,M,q){a.set(M[0]-c[0],M[1]-c[1],M[2]-c[2]),z.set(q[0]-c[0],q[1]-c[1],q[2]-c[2]),r.crossVectors(a,z);const F=r.length()||1;return[r.x/F,r.y/F,r.z/F]},tri(c,M,q,F=[0,0],y=[1,0],g=[.5,1],w){w=w||p.faceN(c,M,q),i(),p.v(c,w,F[0],F[1]),p.v(M,w,y[0],y[1]),p.v(q,w,g[0],g[1]),v()},quad(c,M,q,F,y=[0,0,1,1],g){const w=p.faceN(c,M,F[0]===c[0]&&F[1]===c[1]&&F[2]===c[2]?q:F),B=g?g[0]:void 0,L=g?g[1]:void 0,E=g?g[2]:void 0,D=g?g[3]:void 0;i(),p.v(c,w,y[0],y[1],B),p.v(M,w,y[2],y[1],L),p.v(q,w,y[2],y[3],E),p.v(c,w,y[0],y[1],B),p.v(q,w,y[2],y[3],E),p.v(F,w,y[0],y[3],D),v()},quadN(c,M,q,F,y,g,w,B,L=[0,0,1,1]){i(),p.v(c,y,L[0],L[1]),p.v(M,g,L[2],L[1]),p.v(q,w,L[2],L[3]),p.v(c,y,L[0],L[1]),p.v(q,w,L[2],L[3]),p.v(F,B,L[0],L[3]),v()},box(c,M,q,F,y,g,w="xXyYzZ",B){const L=c-F/2,E=c+F/2,D=M-y/2,K=M+y/2,Z=q-g/2,Y=q+g/2;i(),w.includes("Z")&&p.quad([L,D,Y],[E,D,Y],[E,K,Y],[L,K,Y],B),w.includes("z")&&p.quad([E,D,Z],[L,D,Z],[L,K,Z],[E,K,Z],B),w.includes("X")&&p.quad([E,D,Y],[E,D,Z],[E,K,Z],[E,K,Y],B),w.includes("x")&&p.quad([L,D,Z],[L,D,Y],[L,K,Y],[L,K,Z],B),w.includes("Y")&&p.quad([L,K,Y],[E,K,Y],[E,K,Z],[L,K,Z],B),w.includes("y")&&p.quad([L,D,Z],[E,D,Z],[E,D,Y],[L,D,Y],B),v()},panel(c,M,q,F,y,g,w,B,L){const E=(he,le,te)=>[c[0]+M[0]*he+q[0]*le+F[0]*te,c[1]+M[1]*he+q[1]*le+F[1]*te,c[2]+M[2]*he+q[2]*le+F[2]*te],D=E(0,0,0),K=E(y,0,0),Z=E(y,g,0),Y=E(0,g,0),J=E(B,B,w),ne=E(y-B,B,w),fe=E(y-B,g-B,w),de=E(B,g-B,w);i(),p.quad(J,ne,fe,de,L);const pe=V.tile;V.tile=-3,p.quad(D,K,ne,J),p.quad(K,Z,fe,ne),p.quad(Z,Y,de,fe),p.quad(Y,D,J,de),V.tile=pe,v()},lathe(c,M,q,F,y,g=1){i();for(let w=0;w<F.length-1;w++){const[B,L]=F[w],[E,D]=F[w+1],K=Math.hypot(E-B,D-L)||1,Z=-(E-B)/K,Y=(D-L)/K;for(let J=0;J<y;J++){const ne=J/y*ae,fe=(J+1)/y*ae,de=Math.cos(ne),pe=Math.sin(ne),he=Math.cos(fe),le=Math.sin(fe),te=[c+de*B,M+L,q+pe*B],be=[c+he*B,M+L,q+le*B],ie=[c+he*E,M+D,q+le*E],ce=[c+de*E,M+D,q+pe*E],se=[de*Y,Z,pe*Y],o=[he*Y,Z,le*Y],f=J/y*g,l=(J+1)/y*g,d=w/(F.length-1),T=(w+1)/(F.length-1);B<1e-4?(p.v(be,o,l,d),p.v(ce,se,f,T),p.v(ie,o,l,T)):E<1e-4?(p.v(be,o,l,d),p.v(te,se,f,d),p.v(ce,se,f,T)):p.quadN(be,te,ce,ie,o,se,se,o,[l,d,f,T])}}v()},count(){return t.length/9},elArray(){const c=t.length/3,M=new Float32Array(c*2);for(let q=0;q<n.length;q++){const F=n[q],y=q+1<n.length?n[q+1]:c;let g=1/0,w=-1/0;for(let E=F;E<y;E++){const D=t[E*3+1];D<g&&(g=D),D>w&&(w=D)}const B=(g+w)/2,L=(w-g)/2;for(let E=F;E<y;E++)M[E*2]=B,M[E*2+1]=L}return M},geometry(){const c=new x.BufferGeometry;return c.setAttribute("position",new x.Float32BufferAttribute(t,3)),c.setAttribute("normal",new x.Float32BufferAttribute(C,3)),c.setAttribute("uv",new x.Float32BufferAttribute(O,2)),c.setAttribute("aFx",new x.Float32BufferAttribute(R,4)),c.setAttribute("aPiv",new x.Float32BufferAttribute(N,4)),c.setAttribute("aCol",new x.Float32BufferAttribute(H,3)),c},*geometrySteps(c){const M=new x.BufferGeometry;return M.setAttribute("position",new x.Float32BufferAttribute(t,3)),yield,M.setAttribute("normal",new x.Float32BufferAttribute(C,3)),yield,M.setAttribute("uv",new x.Float32BufferAttribute(O,2)),yield,M.setAttribute("aFx",new x.Float32BufferAttribute(R,4)),yield,M.setAttribute("aPiv",new x.Float32BufferAttribute(N,4)),yield,M.setAttribute("aCol",new x.Float32BufferAttribute(H,3)),c&&(yield,M.setAttribute("aEl",new x.BufferAttribute(p.elArray(),2))),M}};return p}const A={flower:[0,14],heart:[14,2],peacock:[16,6],feather:[22,2],fish:[24,8],eye:[32,8],bird:[40,6],cypress:[46,6],sun:[52,6],diamonds:58,scallops:59,chevrons:60,checks:61,stripes:62,bands:63};async function Ge(t,C,O){const R=t.rng.fork("atlas"),N=2048,H=1024,V=8,k=document.createElement("canvas");k.width=k.height=N;const W=document.createElement("canvas");W.width=W.height=H;const _=k.getContext("2d"),b=W.getContext("2d"),m="#04050a",h=C[2],a=C[3],z=C[4],r=C[5],n=C[6];_.fillStyle=m,_.fillRect(0,0,N,N),b.fillStyle="rgb(0,50,0)",b.fillRect(0,0,H,H);const u=[_,b],s=(o,f)=>"rgb("+Math.round(o*255)+","+Math.round(f*255)+",0)",e=(o,f,l=0,d=.7)=>{for(let T=0;T<2;T++){const P=u[T];P.beginPath(),o(P),P.fillStyle=T?s(l,d):f,P.fill()}},i=(o,f,l,d=0,T=.7)=>{for(let P=0;P<2;P++){const S=u[P];S.beginPath(),o(S),S.strokeStyle=P?s(d,T):f,S.lineWidth=l,S.lineCap="round",S.lineJoin="round",S.stroke()}},v=(o,f,l)=>d=>{d.moveTo(o+l,f),d.arc(o,f,l,0,ae)},p=(o,f,l,d,T=0)=>P=>{P.moveTo(o+l*Math.cos(T),f+l*Math.sin(T)),P.ellipse(o,f,l,d,T,0,ae)},c=o=>f=>{f.moveTo(o[0][0],o[0][1]);for(let l=1;l<o.length;l++)f.lineTo(o[l][0],o[l][1]);f.closePath()},M=(o,f,l,d)=>c([[o,f],[l,f],[l,d],[o,d]]),q=(o,f,l,d,T,P=.55)=>S=>{const $=Math.cos(l),re=Math.sin(l),ue=-re,qe=$;S.moveTo(o,f),S.quadraticCurveTo(o+$*d*P+ue*T,f+re*d*P+qe*T,o+$*d,f+re*d),S.quadraticCurveTo(o+$*d*P-ue*T,f+re*d*P-qe*T,o,f)},F=(o,f,l,d)=>T=>{T.moveTo(o,f),T.lineTo(l,d)},y=(o,f,l)=>d=>{d.moveTo(o,f-l*.9),d.bezierCurveTo(o-l*1.5,f,o-l*.9,f+l*1.25,o,f+l*.45),d.bezierCurveTo(o+l*.9,f+l*1.25,o+l*1.5,f,o,f-l*.9)},g={mixed:[h,a,z,r],warm:[h,z,h,z,a],cool:[r,a,r,a,z]},w=o=>{const f=o.shuffle(g[O].slice()),l=[f[0]];for(const d of f)l.includes(d)||l.push(d);for(;l.length<4;)l.push(n);return l},B=o=>{const f=o%V,l=Math.floor(o/V);for(let d=0;d<2;d++){const T=u[d],P=(d?H:N)/V;T.save(),T.beginPath(),T.rect(f*P,l*P,P,P),T.clip(),T.setTransform(P/2,0,0,-P/2,(f+.5)*P,(l+.5)*P)}},L=()=>{_.restore(),b.restore()},E=o=>{for(const f of u)f.save(),o(f)},D=()=>{for(const o of u)o.restore()},K=(o,f)=>{const l=o.int(0,3),d=f[o.int(1,3)];if(l===0)e(M(-.95,-.95,.95,.95),d,1,.55),e(M(-.86,-.86,.86,.86),n,1,.5),e(M(-.82,-.82,.82,.82),m,0,.2);else if(l===1)for(let T=0;T<8;T++){const P=-.84+T*.24;for(const[S,$]of[[P,.9],[P,-.9],[.9,P],[-.9,P]])e(c([[S,$-.075],[S+.1,$],[S,$+.075],[S-.1,$]]),T%2?d:n,1,.6)}else if(l===2)for(let T=0;T<7;T++){const P=-.78+T*.26;for(const[S,$,re]of[[P,.97,-1.5708],[P,-.97,1.5708],[.97,P,3.1416],[-.97,P,0]])e(ue=>{ue.moveTo(S,$),ue.arc(S,$,.12,re-1.5708,re+1.5708),ue.closePath()},T%2?d:f[0],1,.6)}else{e(M(-.95,-.95,.95,.95),d,1,.55),e(M(-.88,-.88,.88,.88),m,0,.2);for(const[T,P]of[[1,1],[-1,1],[1,-1],[-1,-1]])e(c([[T*.88,P*.88],[T*.5,P*.88],[T*.88,P*.5]]),n,1,.6)}},Z=o=>{const f=w(o);K(o,f);const l=o.pick([5,6,8,8,10,12]),d=o.range(.45,.75),T=o()*ae,P=o.chance(.6);for(const[S,$]of[[1,1],[-1,1],[1,-1],[-1,-1]])e(q(S*.74,$*.74,Math.atan2(-$,-S)+.5,.3,.11),a,0,.6),e(q(S*.74,$*.74,Math.atan2(-$,-S)-.5,.3,.11),a,1,.6),e(v(S*.72,$*.72,.06),z,1,.8);for(let S=0;S<l;S++)e(q(0,0,T+S/l*ae,.7,2.4/l+.06,d),f[0],S%2?1:0,.75);for(let S=0;S<l;S++)i(F(0,0,Math.cos(T+S/l*ae)*.5,Math.sin(T+S/l*ae)*.5),n,.022,1,.9);if(P)for(let S=0;S<l;S++)e(q(0,0,T+(S+.5)/l*ae,.42,1.6/l+.04,.6),f[1],S%2?0:1,.85);e(v(0,0,.19),f[2]===f[0]?n:f[2],1,.95),e(v(0,0,.1),f[3],0,1);for(let S=0;S<8;S++)e(v(Math.cos(S*.785)*.145,Math.sin(S*.785)*.145,.022),m,0,.8)},Y=o=>{const f=w(o);K(o,f),e(y(0,-.05,.55),n,1,.7),e(y(0,-.05,.47),h,1,.85),e(y(0,-.02,.24),z,0,.95);for(let l=0;l<6;l++)e(v(Math.cos(l*1.047+.52)*.72,Math.sin(l*1.047+.52)*.72,.05),f[1],1,.8)},J=(o,f,l,d)=>{E(T=>{T.translate(o,f),T.rotate(d)}),e(p(0,0,l,l*1.3),a,1,.8),e(p(0,-l*.05,l*.68,l*.92),z,1,.9),e(p(0,-l*.12,l*.42,l*.56),r,0,.95),e(p(0,-l*.2,l*.18,l*.24),m,0,.8),D()},ne=o=>{const f=w(o);K(o,f);const l=o.pick([7,9,9,11]);for(let d=0;d<l;d++){const T=.12+d/(l-1)*(Math.PI-.24),P=Math.cos(T),S=Math.sin(T);i(F(0,-.32,P*.66,-.32+S*.82),d%2?a:r,.05,0,.6),J(P*.62,-.32+S*.8,.105,T-1.5708)}e(p(0,-.42,.2,.3),r,1,.9),e(p(0,-.48,.1,.17),a,0,.95),i(F(0,-.2,0,.1),r,.1,1,.9),e(v(0,.14,.085),r,1,.95),e(c([[.05,.15],[.19,.1],[.05,.08]]),z,1,1),e(v(-.02,.16,.022),n,1,1);for(let d=-1;d<=1;d++)i(F(0,.2,d*.07,.33),z,.016,0,.9),e(v(d*.07,.34,.026),z,1,1);i(F(-.07,-.7,-.09,-.8),z,.03,1,.8),i(F(.07,-.7,.09,-.8),z,.03,1,.8)},fe=o=>{for(let f=0;f<16;f++){const l=-.95+f*.1,d=.2+.3*Math.sin(f/16*2.6);i(F(0,l,d,l+.2),f%2?a:r,.035,f%3===0?1:0,.5),i(F(0,l,-d,l+.2),f%2?a:r,.035,f%3===0?1:0,.5)}i(F(0,-1,0,.3),z,.05,1,.8),J(0,.36,.44,0)},de=o=>{const f=w(o);K(o,f),o.chance(.5)?E(d=>d.scale(-1,1)):E(()=>{}),e(d=>{d.moveTo(.72,0),d.quadraticCurveTo(.2,.52,-.42,.07),d.lineTo(-.78,.4),d.lineTo(-.66,0),d.lineTo(-.78,-.4),d.lineTo(-.42,-.07),d.quadraticCurveTo(.2,-.52,.72,0)},f[0],0,.75),e(c([[.1,.24],[-.1,.52],[-.25,.2]]),f[1],1,.85),e(c([[.12,-.24],[-.05,-.46],[-.2,-.2]]),f[1],1,.85);for(let d=0;d<3;d++)for(let T=0;T<5-d;T++){const P=.22-T*.14-d%2*.07,S=(d-1)*.12;i($=>{$.arc(P,S,.07,-1.2,1.2)},d%2?n:z,.028,1,.9)}e(c([[.72,0],[.42,.2],[.36,0],[.42,-.2]]),f[2]===f[0]?n:f[2],1,.9),e(v(.47,.06,.06),n,1,1),e(v(.48,.06,.028),m,0,.8);for(let d=-1;d<=1;d++)i(F(-.5,d*.05,-.74,d*.26),n,.025,1,.9);for(let d=0;d<3;d++)e(v(.6+d*.07,.42+d*.13,.03+d*.012),r===f[0]?n:r,1,.7);D()},pe=o=>{const f=w(o);o.chance(.6)&&K(o,f);const l=o.pick([r,a,r,z]),d=o.pick([r,h,a]),T=P=>S=>{S.moveTo(-.8*P,0),S.quadraticCurveTo(0,.72*P,.8*P,0),S.quadraticCurveTo(0,-.56*P,-.8*P,0)};for(let P=0;P<9;P++){const S=.5+P/8*(Math.PI-1);i(F(Math.cos(S)*.5,Math.sin(S)*.3+.05,Math.cos(S)*.74,Math.sin(S)*.56+.05),d,.035,P%2,.6)}e(T(1),d,1,.6),e(T(.88),n,1,.8),e(v(0,.03,.3),l,0,.9),i(v(0,.03,.3),l===z?h:z,.035,1,.95);for(let P=0;P<12;P++)i(F(Math.cos(P*.5236)*.15,.03+Math.sin(P*.5236)*.15,Math.cos(P*.5236)*.26,.03+Math.sin(P*.5236)*.26),n,.014,0,1);e(v(0,.03,.14),m,0,.7),e(v(.09,.12,.05),n,1,1),i(P=>{P.moveTo(-.72,.5),P.quadraticCurveTo(0,.98,.72,.5)},f[0],.07,1,.7);for(let P=-1;P<=1;P++)e(q(P*.26,-.5,-1.5708,.24,.07),f[1],P?0:1,.7)},he=o=>{const f=w(o);K(o,f),o.chance(.5)?E(l=>l.scale(-1,1)):E(()=>{}),e(c([[-.3,.02],[-.76,.2],[-.72,-.1]]),f[1],1,.7),e(p(0,-.08,.44,.3,.15),f[0],0,.8);for(let l=0;l<5;l++)i(d=>{d.arc(.2-l*.02,-.12,.1+l*.045,-1.9,-.5)},l%2?n:m,.03,l%2,.9);e(q(.12,.02,3,.5,.15),f[2]===f[0]?n:f[2],1,.9),e(v(.4,.22,.15),f[0],0,.9),i(l=>{l.arc(.4,.22,.15,2.2,4.4)},n,.03,1,.95),e(v(.44,.26,.04),n,1,1),e(v(.45,.26,.018),m,0,.8),e(c([[.53,.26],[.7,.2],[.53,.16]]),h,1,1),i(F(-.05,-.36,-.08,-.62),h,.035,1,.8),i(F(.12,-.36,.12,-.62),h,.035,1,.8),i(F(-.6,-.66,.6,-.66),a,.05,0,.6);for(let l=0;l<4;l++)e(v(-.5+l*.34,-.56,.045),l%2?z:n,1,.8);D()},le=o=>{const f=w(o);K(o,f),e(M(-.05,-.74,.05,-.45),z,0,.6),e(l=>{l.moveTo(0,.8),l.bezierCurveTo(.14,.5,.36,-.1,.22,-.42),l.quadraticCurveTo(0,-.56,-.22,-.42),l.bezierCurveTo(-.36,-.1,-.14,.5,0,.8)},a,0,.8);for(let l=0;l<7;l++){const d=-.4+l*.16,T=.2*(1-l/8);i(P=>{P.moveTo(-T,d),P.lineTo(0,d+.1),P.lineTo(T,d)},l%2?z:n,.03,1,.95)}i(F(-.7,-.74,.7,-.74),f[0],.06,1,.6);for(const l of[-1,1]){i(F(l*.52,-.7,l*.52,-.2),a,.03,0,.6);for(let d=0;d<6;d++)e(q(l*.52,-.12,d*1.047,.16,.07),f[1],d%2,.85);e(v(l*.52,-.12,.05),z,1,1),e(q(l*.52,-.5,1.5708-l*.9,.2,.06),a,1,.7),e(v(l*.5,.42,.05),n,1,.8),e(v(l*.62,.62,.035),f[2],1,.8)}},te=o=>{const f=w(o);K(o,f);const l=o.pick([12,16,16,20,24]);for(let d=0;d<l;d++){const T=d/l*ae,P=ae/l*.52,S=d%2===0;e(c([[Math.cos(T-P)*.3,Math.sin(T-P)*.3],[Math.cos(T)*(S?.8:.62),Math.sin(T)*(S?.8:.62)],[Math.cos(T+P)*.3,Math.sin(T+P)*.3]]),S?f[0]:f[1],S?1:0,.8)}e(v(0,0,.33),n,1,.9),e(v(0,0,.27),z,1,.95),e(v(0,0,.15),f[0]===z?h:f[0],0,1);for(let d=0;d<8;d++)e(v(Math.cos(d*.785)*.21,Math.sin(d*.785)*.21,.028),h,0,1)},be=[()=>{for(let o=-2;o<3;o++)for(let f=-2;f<3;f++)for(const l of[0,.25]){const d=f*.5+l,T=o*.5+l;e(c([[d,T-.21],[d+.21,T],[d,T+.21],[d-.21,T]]),l?f+o&1?z:n:f+o&1?h:a,1,.8)}},()=>{for(let o=4;o>=-4;o--)for(let f=-3;f<=3;f++){const l=f*.4+(o&1)*.2,d=o*.25+.12;e(T=>{T.moveTo(l-.2,d),T.arc(l,d,.2,Math.PI,ae),T.closePath()},m,0,.4),e(T=>{T.moveTo(l-.17,d),T.arc(l,d,.17,Math.PI,ae),T.closePath()},[r,a,z,h][(o+8)%4],1,.85)}},()=>{for(let o=-3;o<5;o++)e(c([[-1,o*.5-.5],[-.5,o*.5],[0,o*.5-.5],[.5,o*.5],[1,o*.5-.5],[1,o*.5-.28],[.5,o*.5+.22],[0,o*.5-.28],[-.5,o*.5+.22],[-1,o*.5-.28]]),o&1?h:o>>1&1?z:n,1,.8)},()=>{for(let o=-2;o<2;o++)for(let f=-2;f<2;f++)e(M(f*.5+.02,o*.5+.02,f*.5+.48,o*.5+.48),f+o&1?h:n,1,.8)},()=>{for(let o=-4;o<4;o++)e(c([[o*.5,-1],[o*.5+.28,-1],[o*.5+2.28,1],[o*.5+2,1]]),o&1?z:a,1,.8)},()=>{e(M(-1,.36,1,.98),h,1,.8),e(M(-1,.2,1,.3),n,1,.8),e(M(-1,-.3,1,-.2),n,1,.8),e(M(-1,-.98,1,-.36),a,1,.8);for(let o=-4;o<=4;o++)e(c([[o*.25,-.15],[o*.25+.1,0],[o*.25,.15],[o*.25-.1,0]]),o&1?z:r,1,.85)}],ie=[];for(let o=0;o<14;o++)ie.push(Z);ie.push(Y,Y);for(let o=0;o<6;o++)ie.push(ne);ie.push(fe,fe);for(let o=0;o<8;o++)ie.push(de);for(let o=0;o<8;o++)ie.push(pe);for(let o=0;o<6;o++)ie.push(he);for(let o=0;o<6;o++)ie.push(le);for(let o=0;o<6;o++)ie.push(te);for(const o of be)ie.push(o);for(let o=0;o<64;o++)B(o),ie[o](R.fork("t"+o)),L(),await t.yield();const ce=new x.CanvasTexture(k);ce.colorSpace=x.SRGBColorSpace,ce.flipY=!1,ce.anisotropy=4,ce.minFilter=x.LinearMipmapLinearFilter,ce.generateMipmaps=!0;const se=new x.CanvasTexture(W);return se.colorSpace=x.NoColorSpace,se.flipY=!1,se.anisotropy=4,se.minFilter=x.LinearMipmapLinearFilter,se.generateMipmaps=!0,{texA:ce,texB:se}}const Pe=`
uniform vec3 uEye; uniform vec3 uBeamPos[2]; uniform vec3 uBeamDir; uniform float uBeamGain;
uniform vec4 uBeamLong; uniform vec4 uBeamFlood;
uniform vec3 uSkyFill; uniform vec3 uGlowCol; uniform vec3 uGlowDir;
float beamAt(vec3 P, vec3 bp, out vec3 Ld) {
  vec3 d = P - bp; float r = max(length(d), 1e-3); vec3 dir = d / r; Ld = -dir;
  float c = dot(dir, uBeamDir);
  float lng = smoothstep(uBeamLong.x, uBeamLong.y, c) * (1. - smoothstep(uBeamLong.z, uBeamLong.w, r));
  float fl = smoothstep(uBeamFlood.x, uBeamFlood.y, c) * (1. - smoothstep(uBeamFlood.z * 0.55, uBeamFlood.z, r)) * uBeamFlood.w;
  return max(lng, fl);
}
float hash21(vec2 p) { vec3 q = fract(vec3(p.xyx) * vec3(.1031, .1030, .0973)); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float vnoise(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hash21(i), hash21(i + vec2(1., 0.)), f.x), mix(hash21(i + vec2(0., 1.)), hash21(i + vec2(1., 1.)), f.x), f.y); }
`,et=`
attribute vec4 aFx; attribute vec4 aPiv; attribute vec3 aCol;
#ifdef TRUCK
attribute vec4 aTilesA; attribute vec4 aTilesB; attribute vec4 aInst; attribute vec3 aBody;
#endif
uniform float uTime; uniform float uConvoy; uniform float uPix; uniform vec3 uEyeL; uniform vec3 uEyeW; uniform vec2 uFan;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec2 vUv; varying vec4 vFx; varying vec3 vL; varying vec3 vBody;
#ifdef MIRROR
varying float vH; varying float vT; varying vec4 vEl; varying float vFw;
  #ifndef TRUCK
attribute vec2 aEl;      // the element's centre height and half height run (makeAcc.elArray)
// the mirrored height h at which a road tilted by c / 2 along the line to the eye shows a point of mirrored height H: (e + h)(h - H) = c D h
float tiltH(float H, float cD, float e) { float b = H + cD - e, r = sqrt(b * b + 4. * e * H); return b > 0. ? .5 * (b + r) : 2. * e * H / (r - b); }
  #endif
#endif
#include <fog_pars_vertex>
void main() {
  vec3 p = position; vec3 n = normal; float tile = aFx.x; float kind = aFx.z; float par = aFx.w; float ph = aPiv.w;
  vBody = vec3(1.);
#ifdef TRUCK
  float iph = aInst.x;
  if (tile > 99.5) { float s = tile - 100.;
    vec4 m0 = step(abs(vec4(s) - vec4(0., 1., 2., 3.)), vec4(.5)); vec4 m1 = step(abs(vec4(s) - vec4(4., 5., 6., 7.)), vec4(.5));
    tile = dot(aTilesA, m0) + dot(aTilesB, m1); }
  vBody = aBody;
  vec3 org = (modelMatrix * instanceMatrix * vec4(0., 2., 0., 1.)).xyz;
  float open = 1. - smoothstep(uFan.y, max(uFan.x, uFan.y + 1.), distance(org, uEyeW));
  if (kind > .5 && kind < 1.5) {
    float a = uConvoy / .64 * (1. - aInst.z) + ph; float c = cos(a), s = sin(a); vec2 r = p.yz - aPiv.yz;
    p.yz = aPiv.yz + vec2(r.x * c - r.y * s, r.x * s + r.y * c); n.yz = vec2(n.y * c - n.z * s, n.y * s + n.z * c);
  } else if (kind > 1.5 && kind < 2.5) {
    float a = -par * mix(.07, 1., open) + sin(uTime * 5. + ph * 9. + iph) * .012; float c = cos(a), s = sin(a); vec2 r = p.xy - aPiv.xy;
    p.xy = aPiv.xy + vec2(r.x * c - r.y * s, r.x * s + r.y * c); n.xy = vec2(n.x * c - n.y * s, n.x * s + n.y * c);
    float b = mix(1.2, .1, open); c = cos(b); s = sin(b); r = p.yz - aPiv.yz;
    p.yz = aPiv.yz + vec2(r.x * c + r.y * s, -r.x * s + r.y * c); n.yz = vec2(n.y * c + n.z * s, -n.y * s + n.z * c);
  } else if (kind > 2.5 && kind < 3.5) {
    float dy = aPiv.y - p.y; p.z += sin(uTime * 3.1 + ph * 6.283 + iph) * par * dy; p.x += cos(uTime * 2.3 + ph * 9. + iph) * par * .4 * dy;
  } else if (kind > 5.5) {
    float f = fract(uTime * (.8 + .5 * ph) + ph * 7. + iph);
    p = aPiv.xyz + ((p - aPiv.xyz) * sin(f * 3.1416) * 1.3 + vec3(par * f * .6, f * (1. - f) * 2.6, -f * 1.9)) * (1. - aInst.z);
  }
  p.y = p.y > 4. ? 4. + (p.y - 4.) * aInst.y : p.y;
  if (kind < .5 || kind > 1.5) {
    float a = (.011 * sin(uTime * 1.9 + iph) + .006 * sin(uTime * 4.3 + iph * 2.)) * (1. - .9 * aInst.z); float c = cos(a), s = sin(a); vec2 r = p.xy - vec2(0., .9);
    p.xy = vec2(0., .9) + vec2(r.x * c - r.y * s, r.x * s + r.y * c);
    p.y += .004 * p.z * sin(uTime * 2.7 + iph * 1.7);
  }
#endif
#ifdef USE_INSTANCING
  vec4 lp = instanceMatrix * vec4(p, 1.); vec3 ln = mat3(instanceMatrix) * n;
#else
  vec4 lp = vec4(p, 1.); vec3 ln = n;
#endif
#ifndef TRUCK
  if (kind > 3.5 && kind < 4.5) {
    vec3 toE = uEyeL - lp.xyz; float dist = length(toE);
    vec3 side = normalize(cross(aPiv.xyz, toE) + vec3(1e-5, 0., 2e-5));
    lp.xyz += side * sign(par) * max(abs(par), dist * uPix);
    ln = normalize(toE + vec3(0., 1e-4, 0.) + side * sign(par) * dist * .6);
  } else if (kind > 4.5 && kind < 5.5) {
    float w = sin(uTime * 6.5 + ph + par * 4.5) + .5 * sin(uTime * 11. + ph * 1.7 + par * 8.);
    lp.xyz += ln * w * .2 * par; lp.y -= par * par * (.12 + .08 * sin(uTime * 2.1 + ph));
  }
#endif
  vL = lp.xyz;
  vec4 wp = modelMatrix * lp; vW = wp.xyz;
#ifdef MIRROR
  vH = lp.y;
  #ifdef TRUCK
  float h = max(lp.y, 0.) * 2.4; vEl = vec4(.5, 1e3, 1e3, 1.); vFw = 1.;
#else
  // the one law of drawing out, for every wet surface and every element whatever it is: the mirror point is the design's (1.4 times the
  // height); the element's own run [Hb, Ht] is laid, by the vertex's place u in it, from where a road tilted .045 away from the eye
  // shows its foot (hb) to where one tilted .045 toward the eye shows its head (ht): about its own mirror point, along the line to the eye.
  // A foot on the road stays on its contact; an element with no run (a flat top) lies at its mirror point
  float ee = max(uEyeL.y, .25), Hb = 1.4 * max(aEl.x - aEl.y, 0.), Ht = max(1.4 * (aEl.x + aEl.y), Hb), run = Ht - Hb;
  float cD = .09 * distance(lp.xz, uEyeL.xz) * step(1e-3, run);
  float hb = tiltH(Hb, -cD, ee), ht = tiltH(Ht, cD, ee), eu = run > 1e-3 ? clamp((1.4 * max(lp.y, 0.) - Hb) / run, 0., 1.) : .5;
  float sb = Hb - hb, st = ht - Ht, eL = ht - hb, eS = sb + st;
  // 6e, an element laid by columns (the hangers' pennants, aPiv.x): its columns differ in height (the whole height at the hoist, none at
  // the tip), and laid whole by u it is a stretched picture of itself, a flag lying on the road. A wet road smears, it does not stretch:
  // each column is its own run B (1 - par) about the element's mirror point and is drawn out by the same two streaks, so it covers
  // the share k = (its run + S) / L of the laid length. With no streak that is the flat copy; with a long one every column lies nearly
  // the whole length and the pennant is a stripe that dims toward its tip
  float runC = run, k = 1., eup = eu;
  if (kind > 4.5 && kind < 5.5 && aPiv.x > .5) { runC = run * (1. - par); k = (runC + eS) / max(eL, 1e-4); eu = .5 + .5 * aPiv.y; eup = .5 + (eu - .5) * k; }
  float h = mix(hb, ht, eup);
  // its light is spread over the drawn-out length L: each end fades over that end's own streak, and a streak longer than the element
  // (or the column) is dimmer in all (4 B S / L^2): the light over the length is the flat copy's, the peak never over the source
  vEl = vec4(eu, sb > 1e-4 ? k * eL / (2. * sb) : 1e3, st > 1e-4 ? k * eL / (2. * st) : 1e3, eS > runC ? 4. * runC * eS / ((runC + eS) * (runC + eS)) : 1.);
  // dimmed once (6c): the fall-off by t is laid on an element by the share of it that is not drawn out, 1 - S / B: whole on a flat copy, none
  // once the streak is as long as the element's own run (from there the spread above is the dimming), fading between, so nothing jumps
  vFw = run > 1e-3 ? clamp(1. - eS / max(runC, 1e-4), 0., 1.) : 1.;
#endif
  float t = uEyeL.y / max(uEyeL.y + h, 1e-3);
  vT = t;
  vec3 q = vec3(mix(uEyeL.x, lp.x, t), .04, mix(uEyeL.z, lp.z, t));
  q.x += sin(q.z * 1.7 + uTime * 1.9) * .012 * h;
  if (uEyeL.y < .25) q = vec3(0., -2000., 0.);
  vL = q; wp = modelMatrix * vec4(q, 1.);
#endif
  vN = normalize(mat3(modelMatrix) * ln + vec3(0., 1e-6, 0.));
  vCol = aCol; vUv = uv; vFx = vec4(tile, aFx.y, kind, par);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,je="1.",tt=`
uniform sampler2D tA; uniform sampler2D tB; uniform float uTime; uniform float uTapeGain; uniform float uArch; uniform vec3 uEyeL; uniform float uMirrorK;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec2 vUv; varying vec4 vFx; varying vec3 vL; varying vec3 vBody;
#ifdef MIRROR
varying float vH; varying float vT; varying vec4 vEl; varying float vFw; uniform float uSnowK;
#endif
${Pe}
#include <fog_pars_fragment>
void main() {
#ifdef MIRROR
#ifndef OPEN
  bool offDeck = abs(vL.x) > 5.62 || abs(vL.z) > 218.;      // off the deck: decided here, cut below, after the last derivative of a mirror (a derivative taken after a discard is not defined)
#endif
#endif
  vec3 Ng = normalize(vN + vec3(0., 1e-6, 0.));
  vec3 V = normalize(uEye - vW + vec3(0., 1e-5, 0.));
#ifndef MIRROR
  if (dot(Ng, V) < 0.) Ng = -Ng;
#endif
  vec3 N = Ng;
  float tile = vFx.x; vec3 base = vCol; float tape = 0.; float hgt = .5;
  vec2 uv = vUv;
#ifdef MIRROR
  // wet tarmac draws a reflection out along the line of sight: beyond a few metres every column of the picture slips
  // by its own amount, so a mirrored pattern smears into streaks of its colours and is never a second copy of the thing
  vec2 dm = vL.xz - uEyeL.xz; float dml = length(dm); float mang = atan(dm.x, abs(dm.y) + 1e-3);
  float stk = vnoise(vec2(mang * 70., dml * .1 + 3.));
  float colv = vnoise(vec2(mang * 113., 7.)), sk = smoothstep(1., 5., dml);
  uv += (vec2(stk, colv) - .5) * vec2(.12, .9) * sk;
  uv.y = mix(uv.y, floor(uv.y) + .15 + .7 * colv, .88 * sk);      // along its length a streak holds one band of the pattern's colours
#endif
  // what a mirror needs from the pixels beside this one is taken here, on every pixel, inside no branch and above the mirror's cut: the width of the
  // tesserae's grid (uv is not written again below) and the atlas's gradient (the other materials take the emboss's derivatives further down, above their own cut)
  vec2 q = vec2(uv.x + uv.y, uv.x - uv.y) * 15.; vec2 fw = fwidth(q);
  vec2 gx = dFdx(vUv) * vec2(.125, -.125), gy = dFdy(vUv) * vec2(.125, -.125);
#ifdef MIRROR
  #ifndef OPEN
  if (offDeck) discard;      // a mirror takes no derivative below this line: a copy's pixel off the deck leaves here, before the atlas is read
  #endif
#endif
#ifdef CUTOUT
  bool cut = false;      // the two cuts below are decided where they stand and made after the last derivative (the emboss): the pixels beside a cut read its height
#endif
  if (tile > -.5) {
    float t = floor(tile + .5); vec2 cell = vec2(mod(t, 8.), floor(t / 8.));
    vec2 f = mix(fract(uv), uv, step(abs(uv - .5), vec2(.5))); f = clamp(f, .012, .988);
    vec2 auv = (cell + vec2(f.x, 1. - f.y)) / 8.;
#ifdef MIRROR
    gx *= 6.; gy *= 6.;      // a mirrored pattern is read blurred: bands of its colours, never a second copy of the motif
#endif
    vec3 c = textureGrad(tA, auv, gx, gy).rgb; vec4 d = textureGrad(tB, auv, gx, gy);
    base = c * vCol; tape = smoothstep(.3, .7, d.r); hgt = d.g;
#ifdef CUTOUT
    // motifs painted straight on rock: the tile's black ground is cut away; kind 7 is an eye whose lid follows the eye's distance
    bool lidded = false;
    if (vFx.z > 6.5) {
      vec2 ac = abs(uv - .5);
      if (max(ac.x, ac.y) > .405 || ac.x + ac.y > .66) cut = true;      // an eye on a boulder carries no square frame
      float dE = distance(uEye, vW); float ph = fract(uTime * .09 + vFx.w);
      float cl = max(1. - smoothstep(6., 15., dE), smoothstep(95., 135., dE));
      cl = max(cl, smoothstep(.93, .955, ph) * (1. - smoothstep(.965, .99, ph)));
      // the lid comes down inside the almond only, so a closed eye is a sleeping eye: lid, gold lash line, brow and lashes
      float ax = (uv.x - .5) / .4; float arc = max(1. - ax * ax, 0.);
      float yT = .5 + .18 * arc, yB = .5 - .14 * arc, lidY = max(mix(.7, .3, cl), yB);
      if (abs(ax) < 1. && uv.y < yT && uv.y > lidY) {
        vec3 lidC = textureLod(tA, (cell + vec2(.5, .331)) / 8., 0.).rgb;
        float kl = uv.y - lidY;
        base = (lidC * .5 + .012) * vCol; tape = 0.; hgt = .6 + .3 * arc * smoothstep(0., .12, kl);
        if (kl < .03) { base = vec3(1., .55, .05); tape = 1.; hgt = .9; }
        lidded = true;
      }
    }
    if (d.g < .3 && !lidded) cut = true;
#endif
  } else if (tile > -1.5) { base = vCol; }
  else if (tile > -2.5) { base = vCol; tape = 1.; hgt = .8; }
  else if (tile > -3.5) { base = vec3(.018, .018, .022) * vCol; }
  else { base = vBody * vCol; }
  // tesserae: a diamond grid in tile space; the grout and the glitter fade out as cells shrink below a pixel
  vec2 id = floor(q); vec2 fq = fract(q);
  float aa = clamp(1. - max(fw.x, fw.y) * 1.4, 0., 1.);
#ifdef MIRROR
  #ifdef CUTOUT
  if (cut) discard;      // (a mirror with the cut-out, which no material here makes: its cuts are made here, a mirror takes no derivative below)
  #endif
#endif
  float h1 = hash21(id), h2 = hash21(id + 17.31), h3 = hash21(id + 43.7);
  float grout = smoothstep(0., .1, min(min(fq.x, 1. - fq.x), min(fq.y, 1. - fq.y)));
  float groutF = mix(.84, grout, aa);
  float grime = .72 + .28 * vnoise(uv * 3.3 + vL.yz * .37);
#ifndef MIRROR
  // emboss: hammered relief from the height channel plus dimples
  float H = hgt + .22 * vnoise(uv * 19.) * (1. - tape) + tape * (h1 - .5) * .25 * aa;
  vec3 dpx = dFdx(vW), dpy = dFdy(vW); float dhx = dFdx(H), dhy = dFdy(H);
#ifdef CUTOUT
  if (cut) discard;      // the last derivative is taken: the cuts are made here, before the light is worked out
#endif
  vec3 r1 = cross(dpy, Ng), r2 = cross(Ng, dpx); float det = dot(dpx, r1);
  vec3 grad = sign(det) * (dhx * r1 + dhy * r2);
  N = normalize(abs(det) * Ng - .045 * grad + Ng * 1e-7);
#endif
  vec3 L0, L1; float b0 = beamAt(vW, uBeamPos[0], L0), b1 = beamAt(vW, uBeamPos[1], L1);
  float gate = 1.;
  if (vFx.y > .001) { float thr = vFx.y + (h2 - .5) * .1; gate = smoothstep(thr - .015, thr + .015, uArch * 1.12); }
  b0 *= uBeamGain * gate; b1 *= uBeamGain * gate;
  float bsum = .5 * (b0 + b1);
  float lam = .5 * (b0 * max(dot(N, L0), 0.) + b1 * max(dot(N, L1), 0.));
  float spec = .5 * (b0 * pow(max(dot(N, normalize(L0 + V)), 0.), 60.) + b1 * pow(max(dot(N, normalize(L1 + V)), 0.), 60.));
  vec3 paint = (base * grime * (1.05 * lam + .14 * bsum) + vec3(.8, .88, 1.) * spec * .3 * (.3 + base)) * mix(1., .5, smoothstep(150., 430., distance(uEye, vW)));
  float wid = 1. + 8. * h1;
  float lobe = .5 * (b0 * exp(-(1. - dot(V, L0)) * 240. / wid) + b1 * exp(-(1. - dot(V, L1)) * 240. / wid));
  float ent = smoothstep(.02, .4, abs(dot(Ng, V)));
  vec3 hv = normalize(vec3(h1, h2, h3) - .5 + vec3(0., 0., 1e-3));
  float glit = smoothstep(.8, 1., abs(dot(hv, normalize(V + N * .35)))) * aa;
  vec3 tcol = base * (.82 + .18 * grime) + vec3(.035);
  // tape within arm's length keeps its colour instead of clipping to white
  vec3 tapeC = tcol * uTapeGain * (lobe * (.75 + 1.7 * glit) + bsum * (.16 + .5 * glit)) * ent * groutF * mix(.55, 1., smoothstep(2., 10., distance(uEye, vW))) * mix(1., .6, smoothstep(30., 90., distance(uEye, vW)))
    * mix(1., mix(1., .4, smoothstep(150., 400., distance(uEye, vW))), step(3.5, vFx.z) * step(vFx.z, 4.5));      // far hangers (ribbons) are held down so they do not wash the convoy out from the air
  vec3 lit = mix(paint, tapeC, tape);
  vec3 fill = uSkyFill * (.5 + .5 * N.y) * (.5 + .5 * grime);
  float rim = 1. - abs(dot(N, V)); rim *= rim * rim;
  fill += uGlowCol * (.22 * rim + .3 * pow(max(dot(N, uGlowDir), 0.), 2.)) * (.6 + .4 * tape);
  vec3 col = lit + fill;
#ifdef MIRROR
  vec3 Vl = normalize(uEyeL - vL + vec3(0., 1e-4, 0.));
  float fres = mix(.3, 1., pow(1. - clamp(Vl.y, 0., 1.), 2.));
  // the breaks along a streak are the road's own (6b): its wet patches and tyre tracks (ROAD_FRAG's own field, at this place of the road:
  // on the deck the very patches; on the curved road the same field in world metres, tracks left out) and its ripple (the road's ripple
  // scale and drift, as noise: no period). They are fixed to the road and slide with it; live's constants are kept
  vec2 pr = vL.xz; float rn2 = vnoise(pr * vec2(1.3, .4)), wetM = smoothstep(.25, .7, vnoise(pr * vec2(.35, .09) + 3.) * .7 + rn2 * .3);
  #ifndef OPEN
  { float tw = mix(5., 14., uSnowK), t1 = abs(pr.x - 3.6) - 1.05, t2 = abs(pr.x + 2.4) - 1.05; wetM = clamp(wetM + (exp(-t1 * t1 * tw) + exp(-t2 * t2 * tw)) * .45, 0., 1.); }
  #endif
  float rr = vnoise(pr * vec2(2.3, 1.1) + vec2(.55, -.48) * uTime), rough = 1. - rn2;
  col = max(lit, 0.) * ${je} * fres * (.62 + .38 * (2. * rr - 1.)) * uMirrorK;
  col *= wetM * 1.5 * (.4 + .9 * rr);
  col = min(col, max(lit, 0.));                      // 6d: a mirror gives back at most the light of what it mirrors
  #ifdef TRUCK
  // 6g: a truck's flank is one flat copy; broken only by the road's patches (a metre and more wide) it lay as a hard-edged pane (6b to 6e).
  // The trucks keep live's own columns: by the angle from the eye, the line along which a wet road draws a reflection out (upright in
  // the picture), whole columns drop out and every column ends at its own length: ragged streaks. (6f had columns along the lane,
  // which hatched the copies beside the eye aslant.) The brightening factor is capped at 1, so the bound above holds
  col *= smoothstep(.2, .7, stk) * min(1., 1.5 * (.4 + .9 * vnoise(vec2(mang * 190., 3.))));
  col *= 1. - smoothstep(.5, 1., vH / mix(1., 10., colv * colv));
  col *= 1. - smoothstep(5.2, 5.62, abs(vL.x));
  col *= mix(1., .4, smoothstep(2.2, 7., vH));      // the trucks' copies keep their own flat shape and these fall-offs; the level, the breaks and the bound above are every copy's
  #else
  // the one fall-off of every wet surface (gorge road, bazaar, deck): a streak is drawn out from under its source over the share
  // 1 - t of the way to the eye and is that much dimmer: t ^ c, c the column's own roughness (a smooth column mirrors whole, the
  // roughest falls by t), so the streaks end ragged. Since 6b the roughness is the road's own patch noise, not a column's.
  // No height and no distance is typed: what stands higher mirrors further out toward the eye, longer and so fainter
  col *= pow(clamp(vT, 1e-4, 1.), rough * vFw);
  // the element's light spread over its drawn-out length (see JEWEL_VERT)
  col *= vEl.w * min(1., min(vEl.x * vEl.y, (1. - vEl.x) * vEl.z));
    #ifndef OPEN
  col *= 1. - smoothstep(5.2, 5.62, abs(vL.x));
    #endif
  #endif
  #ifdef USE_FOG
    #ifdef FOG_EXP2
      col *= exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
    #else
      col *= 1. - smoothstep(fogNear, fogFar, vFogDepth);
    #endif
  #endif
  gl_FragColor = vec4(max(col, 0.), 1.);
#else
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
#endif
}`,Ye=`
varying vec3 vW; varying vec3 vL;
#include <fog_pars_vertex>
void main() {
#ifdef ROADUV
  vL = vec3(uv.x, 0., uv.y);
#else
  vL = position;
#endif
  vec4 wp = modelMatrix * vec4(position, 1.); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`,Xe=`
uniform float uTime; uniform vec3 uSkyTop; uniform vec3 uSkyLow; uniform mat3 uNrm; uniform float uWetK; uniform float uSnowK; uniform float uDryK;
uniform vec4 uPortalPos; uniform vec3 uPortalN; uniform vec3 uPortalCol; uniform float uMirrorK;
varying vec3 vW; varying vec3 vL;
${Pe}
#include <fog_pars_fragment>
void main() {
  vec3 V = normalize(uEye - vW + vec3(0., 1e-5, 0.));
  vec2 p = vL.xz; float dist = length(uEye - vW);
  float wn2 = vnoise(p * vec2(1.3, .4));
  float wet = smoothstep(.25, .7, vnoise(p * vec2(.35, .09) + 3.) * .7 + wn2 * .3);
  float tw = mix(5., 14., uSnowK); float t1 = abs(p.x - 3.6) - 1.05, t2 = abs(p.x + 2.4) - 1.05;
  float tracks = exp(-t1 * t1 * tw) + exp(-t2 * t2 * tw);
  float wetP = clamp(wet + tracks * .45, 0., 1.);      // the patches and tracks themselves, for the mirrors' breaks
  wet = wetP * uWetK * (1. - .8 * uSnowK);
  float snw = uSnowK * clamp(.4 + .9 * vnoise(p * vec2(.9, .35) + 11.) - tracks * .42, 0., 1.);      // snow lies between the ruts; the ruts show dark wet road
  float fade = clamp(1. - dist / 90., 0., 1.);
  vec2 rp = p * vec2(2.3, 1.1);
  vec3 nl = vec3(0., 1., 0.);
  nl.x += (sin(rp.x * 3.1 + uTime * 1.7 + sin(rp.y * 1.3 + uTime) * 2.) * .03 + (vnoise(p * 9.) - .5) * .09 * (1. - wet)) * fade;
  nl.z += (sin(rp.y * 2.7 - uTime * 1.3 + sin(rp.x * 1.9) * 2.) * .02 + (vnoise(p * 9. + 31.) - .5) * .09 * (1. - wet)) * fade;
  // wind-packed drifts: fine relief in the snow
  nl.x += (vnoise(p * 6.) - .5) * .12 * snw * fade; nl.z += (vnoise(p * 6. + 17.) - .5) * .12 * snw * fade;
  vec3 N = normalize(uNrm * nl);
  vec3 L0, L1; float b0 = beamAt(vW, uBeamPos[0], L0) * uBeamGain, b1 = beamAt(vW, uBeamPos[1], L1) * uBeamGain;
  float lam = .5 * (b0 * max(dot(N, L0), 0.) + b1 * max(dot(N, L1), 0.));
  float agg = vnoise(p * 23.) * vnoise(p * 61. + 7.);
  vec3 alb = vec3(.05, .052, .06) * (.8 + .4 * vnoise(p * 2.7)) * mix(1., .7, wet);
  // a dry night: pale dust on the road, warmer and lighter, and it mirrors nothing
  alb = mix(alb, vec3(.09, .08, .07) * (.7 + .6 * vnoise(p * 2.7)) * (.75 + .5 * agg), uDryK);
  // the warm pool our own lamps lay on the road: the unlit road stays darker than the lit ellipse
  vec3 col = alb * vec3(1., .9, .72) * (lam * 5. + (.04 + .05 * uDryK) * (b0 + b1));
  // snow scatters the beam back even at a grazing angle: warm white near the cab, falling to the sky's blue beyond 40 m
  float lamS = .5 * (b0 * sqrt(max(dot(N, L0), 0.)) + b1 * sqrt(max(dot(N, L1), 0.))) * mix(1., .4, smoothstep(12., 55., dist));
  vec3 snowAlb = vec3(.62, .64, .7) * (.8 + .2 * agg) * (.82 + .36 * vnoise(p * vec2(1.9, .7) + 5.));
  vec3 snowC = snowAlb * (vec3(1., .92, .78) * lamS * 1.7 + (uSkyLow * .55 + uSkyTop * .45) * 1.1 + uGlowCol * .25 * max(dot(N, uGlowDir) + .4, 0.));
  col = mix(col, snowC, snw);
  // wet grit throws back a little of the beam as fine glitter
  vec2 gid = floor(p * 14.); float gh = hash21(gid);
  float gl = step(.975, gh) * smoothstep(.75, 1., abs(dot(normalize(vec3(hash21(gid + 3.1), .6, hash21(gid + 9.7)) - vec3(.5, 0., .5)), V)));
  col += vec3(.9, .95, 1.) * gl * (b0 + b1) * .5 * fade * .3 * (.3 + agg);
  // each flake a spark: snow glitter that shifts with the angle of view
  vec2 gid2 = floor(p * 22.); float gh2 = hash21(gid2 + 5.3);
  float gl2 = step(.9, gh2) * smoothstep(.8, 1., abs(dot(normalize(vec3(hash21(gid2 + 1.7), .5, hash21(gid2 + 6.1)) - vec3(.5, 0., .5)), V)));
  col += vec3(1., .97, .9) * gl2 * 3. * snw * (b0 + b1) * .5 * fade;
  // the road mirror: sky fill and the afterglow, by fresnel
  vec3 R = reflect(-V, N); float f = .03 + .97 * pow(1. - clamp(dot(N, V), 0., 1.), 5.);
  vec3 sky = mix(uSkyLow, uSkyTop, smoothstep(0., .6, abs(R.y))) + uGlowCol * (pow(max(dot(R, uGlowDir), 0.), 8.) * 1.2 + pow(max(dot(R, uGlowDir), 0.), 2.) * .5);
  col += sky * f * (.2 + .8 * wet) * (1. - uDryK) * (1. - .85 * snw);
  col += uSkyFill * .1;
  // the portal's own streak. The mirrored eye's ray is carried to the portal's plane, which it meets at the mirrored height hy (the
  // share 1 / s of the way). 6c: the road's ripple is laid as what it is, the tilt of the law of drawing out: each road point is tilted
  // by its own ripple, c = .09 (2 r - 1) (.09 = 2 x .045, the road's largest tilt; r the ripple noise at the road's scale and drift), and
  // shows the point of the portal that tilt gives, (e + h)(h - H) = c D h. The streak is on where that point (H / 1.4 over the deck:
  // the design's 1.4) lies in the disc, so the tongue is whole where every tilt sees the disc and breaks up toward the eye, where only
  // the steeper ripples still reach it. Its light: the level, the copies' fresnel and fall-off, the road's own wet patches and tracks;
  // largest factor = the level. Nothing where the look has no mirror
  float pa = dot(uEye.xz - uPortalPos.xz, uPortalN.xz), pb = dot(vW.xz - uPortalPos.xz, uPortalN.xz), eh = uEye.y - vW.y;
  if (uMirrorK * (uPortalCol.r + uPortalCol.g + uPortalCol.b) > 0. && pb > 0. && pa > pb + .5 && eh > .25) {
    float ps = pa / (pa - pb), hy = eh * (ps - 1.);
    vec2 hit = uEye.xz + ps * (vW.xz - uEye.xz);
    float rr = vnoise(rp + vec2(.55, -.48) * uTime);
    // 6d: a pixel of wet road holds every ripple tilt at once, so the streak's strength there is the SHARE of the tilts c in
    // [-.09, .09] whose mirrored point (hy (1 - c k), k = D / (e + h)) lies in the disc; 6c took the one tilt of the ripple noise
    // (a sheet with a cut edge). Whole where every tilt sees the disc, thinning toward the eye and toward the disc's sides; the
    // ripple only stirs it (.8 to 1)
    float dx = length(hit - uPortalPos.xz), cy = uPortalPos.y - vW.y;
    if (dx < uPortalPos.w && hy > 0.) {
      float sx = sqrt(uPortalPos.w * uPortalPos.w - dx * dx), kk = max(length(hit - uEye.xz) / (eh + hy), 1e-4);
      float c0 = (1. - 1.4 * (cy + sx) / hy) / kk, c1 = (1. - 1.4 * max(cy - sx, 0.) / hy) / kk;
      float pm = clamp((min(c1, .09) - max(c0, -.09)) / .18, 0., 1.);
      if (pm > 0.) {
        float fr = mix(.3, 1., pow(1. - clamp(V.y, 0., 1.), 2.));
        col += uPortalCol * (pm * ${je} * fr * uMirrorK * wetP * (.8 + .2 * rr) * pow(clamp(1. / ps, 1e-4, 1.), 1. - wn2));
      }
    }
  }
  gl_FragColor = vec4(max(col, 0.), 1.);
  #include <fog_fragment>
}`;function ot(t,C,O){const R=x.UniformsLib.fog,N=(k,W={})=>new x.ShaderMaterial({uniforms:{...x.UniformsUtils.clone(R),...t,tA:{value:C.texA},tB:{value:C.texB}},vertexShader:et,fragmentShader:tt,defines:k,fog:!0,side:x.DoubleSide,...W}),H={side:x.BackSide,transparent:!0,depthWrite:!1,blending:x.AdditiveBlending,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2},V={jewel:N({}),truck:N({TRUCK:1}),truckMirror:N({TRUCK:1,MIRROR:1},H),mirror:N({MIRROR:1},H),road:new x.ShaderMaterial({uniforms:{...x.UniformsUtils.clone(R),...t},vertexShader:Ye,fragmentShader:Xe,fog:!0}),...O?{mirrorOpen:N({MIRROR:1,OPEN:1},H),cutout:N({CUTOUT:1}),roadPath:new x.ShaderMaterial({uniforms:{...x.UniformsUtils.clone(R),...t},vertexShader:Ye,fragmentShader:Xe,fog:!0,defines:{ROADUV:1}})}:{}};return O&&(V.mirrorGorge=N({MIRROR:1,OPEN:1},H),V.mirrorGorge.uniforms.uMirFade={value:1}),V}function*at(t,C,O){const R=(r,n=1)=>{const u=new x.Color(r);return[u.r*n,u.g*n,u.b*n]},N=R(O[2]),H=R(O[3]),V=R(O[4]),k=R(O[5]),W=R(O[6],.9),_=[N,V,H,k,W],b=r=>t.set(Object.assign({tile:-1,gate:0,kind:0,param:0,pivot:[0,0,0,0],tint:[1,1,1]},r)),m=(r,n,u,s,e,i,v)=>{r>0?t.quad([n,e,s],[n,e,u],[n,i,u],[n,i,s],v):t.quad([-n,e,u],[-n,e,s],[-n,i,s],[-n,i,u],v)},h=(r,n,u,s,e,i,v,p)=>{r>0?t.panel([n,e,s],[0,0,-1],[0,1,0],[1,0,0],s-u,i-e,v,p):t.panel([-n,e,u],[0,0,1],[0,1,0],[-1,0,0],s-u,i-e,v,p)},a=r=>[r,r*.97,r*.92];b({tile:-3}),t.box(0,.95,-.1,1.7,.4,8.6);for(const r of[3.05,-1.75,-3.15])t.box(0,.64,r,2.4,.22,.22,"xXYzZ");b({tile:107,tint:a(.7)}),t.box(1.22,1.02,.55,.5,.5,1.5),b({tile:106,tint:a(.8)}),m(1,1.48,-.2,1.3,.8,1.26,[0,.27,3,.73]);for(const r of[3.05,-1.75,-3.15])for(const n of[-1,1]){const u=n*1.2,s=.64,e=.64,i=.37,v=.27,p=10,c=C()*ae;for(let M=0;M<p;M++){const q=M/p*ae,F=(M+1)/p*ae,y=(L,E,D)=>[u+D*n,s+Math.cos(L)*E,r+Math.sin(L)*E],g=(L,E,D)=>[E*n,Math.cos(L)*D,Math.sin(L)*D],w=(L,E,D,K,Z,Y,J,ne)=>{n>0?t.quadN(L,E,D,K,Z,Y,J,ne):t.quadN(E,L,K,D,Y,Z,ne,J)};b({tile:-3,kind:1,pivot:[u,s,r,c],tint:[1.6,1.6,1.7]}),w(y(F,e,-v),y(q,e,-v),y(q,e,v),y(F,e,v),g(F,0,1),g(q,0,1),g(q,0,1),g(F,0,1)),w(y(F,i,v+.03),y(F,e,v),y(q,e,v),y(q,i,v+.03),g(F,.9,.4),g(F,.7,.7),g(q,.7,.7),g(q,.9,.4)),b({tile:M%2?-2:-4,kind:1,pivot:[u,s,r,c],tint:M%2?W:[.9,.9,.9]});const B=[u+(v+.1)*n,s,r];n>0?t.tri(y(F,i,v+.03),y(q,i,v+.03),B,[0,0],[.3,0],[.15,.3]):t.tri(y(q,i,v+.03),y(F,i,v+.03),B,[0,0],[.3,0],[.15,.3])}}yield;for(const r of[-1,1])for(const[n,u]of[[3.05,1.9],[-2.45,3.3]])b({tile:A.checks,tint:a(.75)}),t.box(r*1.3,1.42,n,.58,.08,u,"xXYzZy",[0,0,1,u*1.7]),b({tile:-2,tint:(r>0,N)}),m(r,1.6,n-u/2,n+u/2,1.3,1.46,[0,0,u*.5,.08]);b({tile:106,tint:a(.85)}),t.box(0,.98,4.56,3.2,.36,.16,"Z",[0,.25,5,.75]),b({tile:-3}),t.box(0,.98,4.5,3.2,.36,.14,"xXYy");const z=(r,n,u,s,e,i,v,p)=>{const c=C(),M=-i*.035,q=e*.035;b({tile:-2,kind:3,param:p,pivot:[r,n,u,c],tint:W}),t.quad([r-M,n-s,u-q],[r+M,n-s,u+q],[r+M,n,u+q],[r-M,n,u-q],[0,0,.04,s*.5]),b({tile:-2,kind:3,param:p,pivot:[r,n,u,c],tint:v});const F=.11,y=n-s-.1;t.quad([r,y-.14,u],[r+i*-F,y,u+e*F],[r,y+.14,u],[r-i*-F,y,u-e*F],[0,0,.12,.12])};for(let r=0;r<15;r++)z(-1.5+r*.214,.8,4.64,.2+r%2*.1,0,1,_[r%2?0:r%4?1:4],.35);yield;{const r=(i,v)=>[[-1.18*v,1.15],[-1.18*v,1.95],[-.86*v,2.3-(1-v)*.5],[.86*v,2.3-(1-v)*.5],[1.18*v,1.95],[1.18*v,1.15]].map(p=>[p[0],p[1],i]),n=r(3.3,1),u=r(4.42,.9),s=[101,106,107,106,101],e=[[0,0,1,1],[0,.3,2,.7],[0,0,1,1],[0,.3,2,.7],[0,0,1,1]];for(let i=0;i<5;i++)b({tile:s[i],tint:a(.9)}),t.quad(u[i],n[i],n[i+1],u[i+1],e[i]);b({tile:106,tint:a(.8)}),t.quad(u[0],u[5],u[4],u[1],[0,0,2,1]),t.quad(u[1],u[4],u[3],u[2],[0,0,2,.4]);for(const i of[-1,1]){b({tile:-2,tint:[.8,.82,.78]});for(let v=0;v<8;v++){const p=v*.785,c=p+.785;t.tri([i*.78+Math.cos(p)*.2,1.62+Math.sin(p)*.2,4.46],[i*.78+Math.cos(c)*.2,1.62+Math.sin(c)*.2,4.46],[i*.78,1.62,4.52],[0,0],[.1,0],[.05,.1])}}}yield,b({tile:106,tint:a(.85)}),t.box(0,2.25,2.4,3,2.2,1.8,"xX",[0,0,3,3.6]),b({tile:106,tint:a(.85)}),t.box(0,2.25,2.4,3,2.2,1.8,"Z",[0,0,3,1.2]),t.box(0,2.25,2.4,3,2.2,1.8,"Y",[0,0,3,1.8]),b({tile:107,tint:a(.95)}),t.quad([-.55,3.365,2.95],[.55,3.365,2.95],[.55,3.365,1.85],[-.55,3.365,1.85]);for(const r of[-1,1]){b({tile:102,tint:a(.95)}),h(r,1.5,1.62,3.18,1.22,2.42,.05,.04),b({tile:-3,tint:[.7,.9,1.6]}),m(r,1.515,1.7,3.1,2.52,3.2),b({tile:-2,tint:V}),m(r,1.52,1.62,3.18,2.44,2.5,[0,0,.8,.03]),m(r,1.52,1.62,3.18,3.22,3.3,[0,0,.8,.03]),b({tile:A.scallops,tint:a(.95)}),m(r,1.522,1.7,3.1,2.98,3.2,[0,.38,2.5,.62]),b({tile:107,tint:a(.95)}),m(r,1.519,2.2,2.6,2.545,2.945);for(let n=0;n<5;n++){const u=1.86+n*.27,s=r*1.535,e=(n*.37+(r>0?.2:.6))%1;b({tile:-2,kind:3,param:.3,pivot:[s,2.98,u,e],tint:_[(n+(r>0?0:2))%4]}),t.quad([s,2.76,u],[s,2.85,u+.055],[s,2.98,u],[s,2.85,u-.055],[0,0,.06,.1])}b({tile:A.sun[0]+1,tint:[1,.85,.5]}),t.quad([r*1.62,2.55,3.36],[r*1.86,2.75,3.36],[r*1.62,2.95,3.36],[r*1.38,2.75,3.36]),b({tile:-3}),t.box(r*1.56,2.75,3.33,.12,.05,.05)}b({tile:-3,tint:[.7,.9,1.6]}),t.quad([-1.38,2.4,3.31],[1.38,2.4,3.31],[1.38,3.2,3.31],[-1.38,3.2,3.31]),b({tile:106,tint:a(.9)}),t.quad([-1.5,2.3,3.32],[1.5,2.3,3.32],[1.5,2.42,3.32],[-1.5,2.42,3.32],[0,.4,6,.6]),b({tile:-2,tint:N}),t.quad([-.05,2.4,3.325],[.05,2.4,3.325],[.05,3.2,3.325],[-.05,3.2,3.325],[0,0,.05,.4]);for(let r=0;r<11;r++){const n=-1.25+r*.25,u=C(),s=_[r%4];b({tile:-2,kind:3,param:.3,pivot:[n,3.2,3.33,u],tint:s}),t.quad([n,2.86,3.33],[n+.06,2.98,3.33],[n,3.2,3.33],[n-.06,2.98,3.33],[0,0,.06,.1])}yield,b({tile:-4,tint:a(.8)}),t.box(0,2.7,-1.5,3,2.6,6,"xXzZy");for(const r of[-1,1]){b({tile:106,tint:a(.75)}),m(r,1.51,-4.5,1.5,1.42,1.9,[0,.14,6,.86]),b({tile:A.scallops,tint:a(.95)}),m(r,1.51,-4.5,1.5,3.78,4,[0,.38,8,.62]);for(let n=0;n<4;n++){const u=-4.42+n*1.48;b({tile:100+(n+(r>0?0:1))%2,tint:a(.92+.08*C())}),h(r,1.5,u,u+1.4,1.96,3.72,.06,.05)}for(let n=0;n<5;n++){const u=-4.46+n*1.48;b({tile:-2,tint:n%2?V:W}),m(r,1.57,u-.035,u+.035,1.94,3.76,[0,0,.035,.9])}for(let n=0;n<12;n++)z(r*1.53,1.42,-4.3+n*.5,.22+n%3*.07,r,0,_[(n+(r>0?1:0))%3],.3);for(let n=0;n<7;n++){const u=-4.2+n*.9;b({tile:-2,tint:_[n%4]}),t.tri([r*1.5,4,u-.2],[r*1.5,4,u+.2],[r*1.56,4.42,u],[0,0],[.2,0],[.1,.2])}}yield,b({tile:105,tint:a(.9)}),t.panel([1.36,1.6,-4.5],[-1,0,0],[0,1,0],[0,0,-1],2.72,2.3,.07,.06),b({tile:106,tint:a(.8)}),t.quad([1.5,1.05,-4.52],[-1.5,1.05,-4.52],[-1.5,1.4,-4.52],[1.5,1.4,-4.52],[0,.25,5,.75]);for(let r=0;r<9;r++)z(-1.4+r*.35,1.05,-4.54,.25,0,-1,_[r%3],.3);{const u=(s,e)=>3.98+Math.sin(s/4*Math.PI)*(.55+.25*Math.sin(e*1.7+.4))*Math.sin(Math.min(1,(e+.35)/1.2)*1.5708)*Math.sin(Math.min(1,(7-e+.35)/1.2)*1.5708);for(let s=0;s<7;s++)for(let e=0;e<4;e++){const i=c=>-1.46+c/4*2.92,v=c=>-4.46+c/7*5.9,p=(e===1||e===2)&&s>=1&&s<=4;b(p?{tile:100+[1,0,7,3][(e+s)%4],tint:a(.85)}:{tile:-1,tint:s%3===1?[.025,.035,.055]:[.018,.023,.038]}),t.quad([i(e),u(e,s),v(s)],[i(e),u(e,s+1),v(s+1)],[i(e+1),u(e+1,s+1),v(s+1)],[i(e+1),u(e+1,s),v(s)],p?[0,0,1,1]:[e/4,s/7,(e+1)/4,(s+1)/7]),s>0&&(b({tile:-2,tint:s%2?V:W}),t.quad([i(e),u(e,s)+.03,v(s)-.05],[i(e),u(e,s)+.03,v(s)+.05],[i(e+1),u(e+1,s)+.03,v(s)+.05],[i(e+1),u(e+1,s)+.03,v(s)-.05],[0,0,.06,.4]))}}yield;{const r=[[3.3,3.34,1.5],[3.62,4.15,1.62],[3.92,5.05,1.76],[4.1,5.95,1.88],[4.08,6.3,1.9]],n=6,u=e=>6.28+.72*Math.pow(1-Math.abs(e),.75)+.1*Math.cos(e*9.42),s=(e,i,v)=>{const p=e/n*2-1,c=r[i];let M=c[1],q=c[0];return i===4&&(M=u(p),q-=(M-6.3)*.12),[p*c[2],M,q-(v?.22+i*.05:0)]};for(let e=0;e<4;e++)for(let i=0;i<n;i++){let v,p;if(e===0)v=106,p=[i*.5,.2,i*.5+.5,.8];else if(e<3){v=103;const c=i<3?i:i-3;p=[c/3,(e-1)/2,(c+1)/3,e/2]}else{v=104;const c=i%2;p=[c/2,.08,(c+1)/2,.92]}b({tile:v,tint:a(.97)}),t.quad(s(i,e),s(i+1,e),s(i+1,e+1),s(i,e+1),p),b({tile:e===0||e===3?106:107,tint:a(.7)}),t.quad(s(i+1,e,1),s(i,e,1),s(i,e+1,1),s(i+1,e+1,1),e===0||e===3?[i*.5,.2,i*.5+.5,.8]:[1-(i+1)/n,(e-1)/2,1-i/n,e/2])}b({tile:-2,tint:V});for(let e=0;e<n;e++)t.quad(s(e,4),s(e+1,4),s(e+1,4,1),s(e,4,1),[0,0,.3,.1]);for(const e of[-1,1]){const i=e>0?n:0;for(let q=0;q<4;q++)b({tile:-2,tint:q%2?N:W}),e>0?t.quad(s(i,q),s(i,q,1),s(i,q+1,1),s(i,q+1),[0,0,.1,.4]):t.quad(s(i,q,1),s(i,q),s(i,q+1),s(i,q+1,1),[0,0,.1,.4]);const v=[e*1.5,3.34,1.5],p=[e*1.5,4,1.5],c=[e*1.52,4.75,1.2];b({tile:104,tint:a(.9)});const M=q=>[q[0],q[1],q[2]-.2];e>0?(t.quad(M(s(i,0)),v,p,M(s(i,1)),[1,0,0,.35]),t.quad(M(s(i,1)),p,c,M(s(i,2)),[1,.35,0,.7]),t.tri(M(s(i,2)),c,M(s(i,3)),[1,.7],[0,.7],[.9,1])):(t.quad(v,M(s(i,0)),M(s(i,1)),p,[0,0,1,.35]),t.quad(p,M(s(i,1)),M(s(i,2)),c,[0,.35,1,.7]),t.tri(c,M(s(i,2)),M(s(i,3)),[0,.7],[1,.7],[.1,1]))}for(const e of[-.92,-.5,.5,.92])b({tile:-2,tint:e*e>.5?N:H}),t.lathe(e*1.9,u(e)-.05,3.96,[[.05,0],[.11,.16],[.03,.3],[0,.62]],5,.3);for(let e=0;e<12;e++)z(-1.4+e*.255,3.36,3.36,.14,0,1,_[(e+1)%4],.4)}yield;for(const r of[-1,1]){const u=s=>4+1.55*Math.pow(1-s,1.4)+.1*Math.abs(Math.sin(s*6*Math.PI))+.12;for(let s=0;s<6;s++){const e=s/6,i=(s+1)/6,v=1.5-e*3.2,p=1.5-i*3.2,c=r*1.53;b({tile:104,tint:a(.95)}),t.quad([c,4,v],[c,4,p],[c,u(i),p],[c,u(e),v],[e*1.5,.05,i*1.5,.95]),b({tile:-2,tint:s%2?V:N}),t.quad([c-r*.05,u(e),v],[c-r*.05,u(i),p],[c+r*.07,u(i)+.03,p],[c+r*.07,u(e)+.03,v],[0,0,.06,.3])}for(let s=0;s<9;s++){const e=r*(1+.45*C()),i=-3.85-.3*C(),v=C(),p=.035+.03*C();b({tile:-2,kind:6,param:(C()-.5)*1.2,pivot:[e,.22,i,v],tint:[.75,.82,.95]}),t.quad([e,.22-p,i],[e+p,.22,i],[e,.22+p,i],[e-p,.22,i],[0,0,.04,.04])}}for(let n=0;n<6;n++){const u=n/6,s=(n+1)/6,e=i=>4+.85*Math.sin(i*Math.PI)+.06;b({tile:107,tint:a(.9)}),t.quad([1.4-u*2.8,4,-4.5],[1.4-s*2.8,4,-4.5],[1.4-s*2.8,e(s),-4.5],[1.4-u*2.8,e(u),-4.5],[u,.05,s,.95])}yield;{b({tile:-2,tint:k}),t.lathe(0,6.92-.05,3.9+.12,[[0,0],[.16,.12],[.2,.32],[.1,.56],[.06,.8],[.1,.92],[0,1.02]],6,.4),b({tile:-2,tint:V}),t.tri([0-.04,6.92+.86,3.9+.2],[0+.04,6.92+.86,3.9+.2],[0,6.92+.8,3.9+.42],[0,0],[.1,0],[.05,.1]);for(let e=-1;e<=1;e++)t.tri([0+e*.05-.02,6.92+.95,3.9+.1],[0+e*.05+.02,6.92+.95,3.9+.1],[0+e*.09,6.92+1.2,3.9+.06],[0,0],[.1,0],[.05,.1]);const s=[0,6.92,3.9-.08];for(let e=0;e<2;e++){const i=e?8:11,v=e?1.25:1.9,p=e?.3:.36;for(let c=0;c<i;c++){const M=(c/(i-1)*2-1)*1.42,q=s[2]-.02-e*.03-c%2*.012;b({tile:A.feather[0]+(c+e)%2,kind:2,param:M,pivot:[s[0],s[1],s[2],C()],tint:[1,1,1]}),t.quad([0-p*.25,6.92,q],[0+p*.25,6.92,q],[0+p,6.92+v,q],[0-p,6.92+v,q])}}}}function it(t){const C=O=>t.set(Object.assign({tile:-1,gate:0,kind:0,param:0,pivot:[0,0,0,0],tint:[1,1,1]},O));for(const O of[-1,1]){const R=(N,H,V,k,W,_)=>{O>0?t.quad([N,k,V],[N,k,H],[N,W,H],[N,W,V],_):t.quad([-N,k,H],[-N,k,V],[-N,W,V],[-N,W,H],_)};C({tile:106}),R(1.51,-4.5,1.5,1.42,1.9,[0,.14,6,.86]),C({tile:A.scallops}),R(1.51,-4.5,1.5,3.78,4,[0,.38,8,.62]);for(let N=0;N<4;N++){const H=-4.42+N*1.48;C({tile:100+(N+(O>0?0:1))%2}),R(1.56,H,H+1.4,1.96,3.72)}C({tile:102}),R(1.55,1.62,3.18,1.22,2.42),C({tile:-4}),R(1.5,1.5,3.3,2.42,3.34),R(1.18,3.3,4.42,1.15,1.95),C({tile:104}),R(1.6,1.4,3.6,3.4,5.4)}C({tile:106}),t.quad([-1.6,.8,4.64],[1.6,.8,4.64],[1.6,1.16,4.64],[-1.6,1.16,4.64],[0,.25,5,.75]),t.quad([-1.06,1.15,4.42],[1.06,1.15,4.42],[1.06,1.95,4.42],[-1.06,1.95,4.42],[0,0,2,1]),C({tile:103}),t.quad([-1.7,4.15,3.7],[0,4.15,3.7],[0,5.95,4.1],[-1.9,5.95,4.1]),t.quad([0,4.15,3.7],[1.7,4.15,3.7],[1.9,5.95,4.1],[0,5.95,4.1]),C({tile:104}),t.quad([-1.9,5.95,4.1],[1.9,5.95,4.1],[1.2,6.7,4.05],[-1.2,6.7,4.05],[0,.08,3,.92]),C({tile:105}),t.quad([1.36,1.6,-4.56],[-1.36,1.6,-4.56],[-1.36,3.9,-4.56],[1.36,3.9,-4.56]);for(let O=0;O<7;O++){const R=(O/6*2-1)*1.42;C({tile:A.feather[0]+O%2,kind:2,param:R,pivot:[0,6.92,3.82,.3]}),t.quad([-.1,6.92,3.8],[.1,6.92,3.8],[.42,8.82,3.8],[-.42,8.82,3.8])}}function*Ce(t,C,O,R,N){const H=(y,g=1)=>{const w=new x.Color(y);return[w.r*g,w.g*g,w.b*g]},V=H(C[2]),k=H(C[3]),W=H(C[4]),_=H(C[5]),b=H(C[6],.9),m=y=>t.set(Object.assign({tile:-1,gate:0,kind:0,param:0,pivot:[0,0,0,0],tint:[1,1,1]},y)),h=y=>R?y:0,a=3.5,z=44,r=-Math.asin(ge/we),n=Math.PI-2*r,u=y=>r+y/z*n,s=y=>((y>Math.PI/2?Math.PI-y:y)-r)/(Math.PI/2-r),e=(y,g,w)=>[Math.cos(y)*g,ge+Math.sin(y)*g,w],i=y=>{const g=Math.cos(y),w=Math.sin(y);let B=13/Math.max(Math.abs(g),1e-4);return w>1e-4&&(B=Math.min(B,(25-ge)/w)),w<-1e-4&&(B=Math.min(B,ge/-w)),B},v=we+1.5,p=we+2.4;for(let y=0;y<z;y++){const g=u(y),w=u(y+1),B=h(.04+.5*s(g)),L=h(.04+.5*s(w));m({tile:-2,tint:[V,b,k,b][y%4]}),t.quad(e(g,we,a+.3),e(g,v-.06,a+.3),e(w,v-.06,a+.3),e(w,we,a+.3),[0,0,.75,.45],[B,B,L,L]),m({tile:-3}),t.quad(e(g,v-.06,a+.3),e(g,v,a),e(w,v,a),e(w,v-.06,a+.3)),m({tile:A.scallops,tint:[1,1,1]}),t.quad(e(g,v,a),e(g,p,a),e(w,p,a),e(w,v,a),[.1,y*.5,.9,y*.5+.5],[B+h(.04),B+h(.06),L+h(.06),L+h(.04)]);const E=(g+w)/2,D=Math.abs(E-Math.PI/2)<1.02,K=Math.max(i(g),p+.3),Z=Math.max(i(w),p+.3);if(m({tile:-3}),t.quad(e(w,p,a),e(g,p,a),e(g,K,a),e(w,Z,a)),D){m({tile:A.feather[0]+y%2});const Y=h(.6),J=h(1);t.quad(e(w,p+.15,a+.06),e(g,p+.15,a+.06),e(g,K,a+.06),e(w,Z,a+.06),[.3,0,.7,1],[Y,Y,J,J])}else{const Y=(w-g)*.12;m({tile:y%2?-2:-1,tint:y%2?W:H(C[5],.6)});const J=B+h(.1),ne=B+h(.25);t.quad(e(w-Y,p+.15,a+.06),e(g+Y,p+.15,a+.06),e(g+Y,K,a+.06),e(w-Y,Z,a+.06),[0,0,.5,(K-p)*.5],[J,J,ne,ne])}y%6===5&&(yield)}yield;const c=(y,g,w,B,L,E,D)=>{m({tile:L}),t.quad([-w,y,a+B],[w,y,a+B],[w,g,a+B],[-w,g,a+B],[0,.2,E,.8],[D,D,D,D]),m({tile:-3}),t.quad([-w,g,a+B],[w,g,a+B],[w,g,a-.2],[-w,g,a-.2]),t.quad([-w,y,a],[w,y,a],[w,y,a+B],[-w,y,a+B])};c(25,26.3,13.3,.5,A.chevrons,10,h(.9)),m({tile:-3}),t.quad([-10.5,26.3,a],[10.5,26.3,a],[10.5,36,a],[-10.5,36,a]);const M=[A.cypress,A.fish,A.sun,A.fish,A.cypress],q=[A.flower,A.bird,A.peacock,A.bird,A.flower];for(let y=0;y<5;y++){const g=-9.9+y*4;let w=h(.93);m({tile:M[y][0]+O.int(0,M[y][1]-1),gate:w}),t.panel([g,26.8,a],[1,0,0],[0,1,0],[0,0,1],3.8,4.1,.14,.1),w=h(.97),m({tile:q[y][0]+O.int(0,q[y][1]-1),gate:w}),t.panel([g,31.3,a],[1,0,0],[0,1,0],[0,0,1],3.8,4.1,.14,.1),y===2&&(yield)}yield,c(36,37,10.9,.45,A.diamonds,9,h(1)),m({tile:-3}),t.quad([-7.7,37,a],[7.7,37,a],[7.7,43,a],[-7.7,43,a]);const F=A.eye[0]+O.int(0,A.eye[1]-1);m({tile:F,gate:h(1.03)}),t.panel([-6.9,37.6,a],[1,0,0],[0,1,0],[0,0,1],5,5,.16,.1),t.panel([1.9,37.6,a],[1,0,0],[0,1,0],[0,0,1],5,5,.16,.1,[1,0,0,1]),m({tile:A.heart[0]+O.int(0,1),gate:h(1.03)}),t.panel([-1.5,38.6,a],[1,0,0],[0,1,0],[0,0,1],3,3,.16,.1);{const w=B=>43.6+2.6*Math.pow(1-Math.abs(B),.8)+.35*Math.cos(B*6*Math.PI);for(let B=0;B<12;B++){const L=B/12*2-1,E=(B+1)/12*2-1;m({tile:A.sun[0]+B%3,gate:h(1.06)}),t.quad([L*8.2,43,a+.3],[E*8.2,43,a+.3],[E*8.2,w(E),a+.3],[L*8.2,w(L),a+.3],[B%2*.5,.1,B%2*.5+.5,.9]),m({tile:-2,tint:W}),t.quad([L*8.2,w(L),a+.3],[E*8.2,w(E),a+.3],[E*8.2,w(E),a-.4],[L*8.2,w(L),a-.4],[0,0,.5,.3])}m({tile:-3}),t.quad([-8.2,43,a-.2],[8.2,43,a-.2],[8.2,43,a+.3],[-8.2,43,a+.3])}if(!N)for(const y of[-1,1])m({tile:A.bands,tint:[1,1,1],gate:h(.95)}),t.lathe(y*11.9,26.3,a-1.3,[[1.25,0],[1.25,7.5]],8,3),m({tile:-2,tint:(y>0,k),gate:h(1)}),t.lathe(y*11.9,33.8,a-1.3,[[1.25,0],[1.6,.3],[1.9,1.3],[1.6,2.5],[.8,3.5],[.25,4.2],[.12,5.6],[.3,5.9],[0,6.4]],8,2)}function*Ze(t,C,O,R,N){const H=(m,h=1)=>{const a=new x.Color(m);return[a.r*h,a.g*h,a.b*h]},V=m=>t.set(Object.assign({tile:-1,gate:0,kind:0,param:0,pivot:[0,0,0,0],tint:[1,1,1]},m));t.at(0,0,R,0),yield*Ce(t,C,O,N,!1),t.pop(),yield,t.at(0,0,R,Math.PI),yield*Ce(t,C,O,!1,!1),t.pop(),yield,t.at(0,0,R,0);const k=44,W=-Math.asin(ge/we),_=Math.PI-2*W;for(let m=0;m<k;m++){const h=W+m/k*_,a=W+(m+1)/k*_,z=n=>{const u=n>Math.PI/2?Math.PI-n:n;return N?.04+.5*(u-W)/(Math.PI/2-W):0},r=(n,u)=>[Math.cos(n)*we,ge+Math.sin(n)*we,u];V({tile:m%2?A.diamonds:A.checks,tint:[.55,.55,.55]}),t.quad(r(a,3.8),r(h,3.8),r(h,-3.8),r(a,-3.8),[0,0,.5,4],[z(a),z(h),z(h),z(a)]),m%12===11&&(yield)}yield;const b=[A.flower,A.sun,A.fish,A.bird,A.cypress,A.peacock];for(const m of[-1,1]){V({tile:-3}),m>0?t.quad([13,0,3.5],[13,0,-3.5],[13,25,-3.5],[13,25,3.5]):t.quad([-13,0,-3.5],[-13,0,3.5],[-13,25,3.5],[-13,25,-3.5]);for(let h=0;h<5;h++)for(let a=0;a<2;a++){const z=b[(a+h*2)%6];V({tile:z[0]+O.int(0,z[1]-1)}),m>0?t.panel([13,.9+h*4.8,3.2-a*3.3],[0,0,-1],[0,1,0],[1,0,0],3.1,4.3,.14,.1):t.panel([-13,.9+h*4.8,-3.2+a*3.3],[0,0,1],[0,1,0],[-1,0,0],3.1,4.3,.14,.1),a===1&&h%3===2&&(yield)}V({tile:-3});for(const[h,a,z]of[[10.5,26.3,36],[7.7,37,43]])m>0?t.quad([h,a,3.5],[h,a,-3.5],[h,z,-3.5],[h,z,3.5]):t.quad([-h,a,-3.5],[-h,a,3.5],[-h,z,3.5],[-h,z,-3.5]);V({tile:A.sun[0]+O.int(0,5)}),m>0?t.panel([10.5,28.4,2.9],[0,0,-1],[0,1,0],[1,0,0],5.8,5.8,.14,.1):t.panel([-10.5,28.4,-2.9],[0,0,1],[0,1,0],[-1,0,0],5.8,5.8,.14,.1),V({tile:-2,tint:H(C[4])}),t.lathe(m*ke,45.2,0,[[1,0],[1,.8],[.5,1.5],[.2,2.6],[.45,3],[0,3.6]],6,2),V({tile:-1,tint:[.03,.035,.05]}),t.box(m*10,-8,0,7,16,8.4,"xXzZ"),V({tile:A.checks});for(const h of[4.22,-4.22]){const a=h>0?1:-1;t.quad([m*10-3.5*a,-1.4,h],[m*10+3.5*a,-1.4,h],[m*10+3.5*a,-.1,h],[m*10-3.5*a,-.1,h],[0,0,5,.5])}yield}V({tile:-3}),t.quad([-13,25,3.5],[13,25,3.5],[13,25,-3.5],[-13,25,-3.5]),t.quad([-10.5,36,3.5],[10.5,36,3.5],[10.5,36,-3.5],[-10.5,36,-3.5]),t.quad([-7.7,43,3.5],[7.7,43,3.5],[7.7,43,-3.5],[-7.7,43,-3.5]),V({tile:-2,tint:H(C[2])}),t.lathe(0,46,0,[[.9,0],[1.3,.6],[.9,1.6],[.3,2.4],[.2,4.2],[.5,4.6],[0,5.4]],6,2),V({tile:-1,tint:[.03,.035,.05]}),t.box(0,-8.3,0,13,15.4,8.4,"zZ"),t.pop()}function*nt(t,C,O){const R=(k,W=1)=>{const _=new x.Color(k);return[_.r*W,_.g*W,_.b*W]},N=k=>t.set(Object.assign({tile:-1,gate:0,kind:0,param:0,pivot:[0,0,0,0],tint:[1,1,1]},k)),H=j+14,V=[A.diamonds,A.chevrons,A.scallops,A.stripes,A.diamonds,A.checks];for(const k of[-1,1]){for(let b=-22;b<22;b++){const m=Math.max(-H,b*10),h=Math.min(H,b*10+10),a=(h-m)/1.25,z=V[((b+44)*7+(k>0?0:3))%6],r=.85+.15*O(),n=(s,e,i,v)=>{k>0?t.quad([s,e,m],[s,e,h],[s,i,h],[s,i,m],v):t.quad([-s,e,h],[-s,e,m],[-s,i,m],[-s,i,h],v)},u=(s,e,i,v)=>{k>0?t.quad([s,e,h],[s,e,m],[s,i,m],[s,i,h],v):t.quad([-s,e,m],[-s,e,h],[-s,i,h],[-s,i,m],v)};N({tile:A.checks,tint:[r,r,r]}),n(5.62,0,.26,[0,0,a,.5]),N({tile:z,tint:[r,r,r]}),n(5.8,.3,1.25,[0,.02,a,.98]),u(6,.3,1.25,[0,.02,a,.98]),N({tile:-2,tint:R(C[6],.8)}),t.quad([k*5.78,1.25,k>0?h:m],[k*6.02,1.25,k>0?h:m],[k*6.02,1.25,k>0?m:h],[k*5.78,1.25,k>0?m:h],[0,0,.12,a*.6]),N({tile:-3}),t.quad([k*5.62,.26,k>0?h:m],[k*5.8,.3,k>0?h:m],[k*5.8,.3,k>0?m:h],[k*5.62,.26,k>0?m:h]),N({tile:-1,tint:R(C[5],.12)}),u(6.4,-2.6,.3),N({tile:A.sun[0]+(b+44)%6,tint:[r*.5,r*.5,r*.5]}),k>0?t.panel([6.4,-2.45,m+6.3],[0,0,-1],[0,1,0],[1,0,0],2.6,2.6,.08,.06):t.panel([-6.4,-2.45,m+3.7],[0,0,1],[0,1,0],[-1,0,0],2.6,2.6,.08,.06),N({tile:-3}),t.quad([k*6,.3,k>0?h:m],[k*6.4,.3,k>0?h:m],[k*6.4,.3,k>0?m:h],[k*6,.3,k>0?m:h]),(b+22)%11===10&&(yield)}yield,N({tile:-1,tint:R(C[5],.1)}),t.box(k*6.1,-6.2,0,.5,.5,2*j,"xXyY");for(let b=-20;b<20;b++){const m=b*10+5;for(const[h,a,z,r]of[[m-5,-2.6,m-5,-6.2],[m-5,-6.2,m,-2.6],[m,-2.6,m+5,-6.2]]){const n=new x.Vector3(0,r-a,z-h).normalize();for(const i of[-1,1])N({tile:-1,kind:4,param:.11*i,pivot:[n.x,n.y,n.z,0],tint:R(C[5],.1)});const u=[k*6.1,a,h],s=[k*6.1,r,z],e=t.st;e.param=-.11,t.v(u,[k,0,0],0,0),t.v(s,[k,0,0],0,1),e.param=.11,t.v(s,[k,0,0],1,1),e.param=-.11,t.v(u,[k,0,0],0,0),e.param=.11,t.v(s,[k,0,0],1,1),t.v(u,[k,0,0],1,0)}}yield;const W=(b,m,h)=>{for(let a=0;a<b.length-1;a++){const z=b[a],r=b[a+1];for(let n=0;n<h;n++){const u=n/h*ae,s=(n+1)/h*ae,e=c=>[Math.cos(c),Math.sin(c)*.97,-Math.sin(c)*.24*Math.sign(z[1]-r[1]||1)*0],i=e(u),v=e(s),p=(c,M)=>[c[0]+M[0]*m,c[1]+M[1]*m,c[2]];t.quadN(p(z,i),p(z,v),p(r,v),p(r,i),i,v,v,i,[n/h,a,(n+1)/h,a+1])}}};N({tile:A.bands,tint:[.95,.95,.95]});const _=[];for(let b=0;b<=82;b++){const m=-j+b*5;_.push([k*ke,6+(Ne-6.6)*(m/j)*(m/j),m])}W(_.slice(0,42),.34,6),yield,W(_.slice(41),.34,6),yield;for(const b of[-1,1]){const m=[];for(let h=0;h<=6;h++){const a=h/6;m.push([k*ke,45.4-44.2*a,b*(j+78*a)])}W(m,.34,6),N({tile:-1,tint:[.03,.035,.05]}),t.box(k*ke,-1,b*(j+80),3,5,6),N({tile:A.bands,tint:[.95,.95,.95]}),yield}}yield,N({tile:-3}),t.quad([-6,-.3,-H],[6,-.3,-H],[6,-.3,H],[-6,-.3,H]),N({tile:-1,tint:R(C[5],.1)});for(let k=-20;k<=20;k++)t.box(0,-1.5,k*10,12.4,2.2,.5,"yzZ")}function*st(t,C,O){const R=(k,W=1)=>{const _=new x.Color(k);return[_.r*W,_.g*W,_.b*W]},N=[R(C[2]),R(C[4]),R(C[3]),R(C[5]),R(C[6],.62)],H=k=>t.set(Object.assign({tile:-1,gate:0,kind:0,param:0,pivot:[0,0,0,0],tint:[1,1,1]},k)),V=O.shuffle([0,1,2,3,4]);for(let k=0;k<=40;k++)for(const W of[-1,1]){const _=-200+k*10,b=6+(Ne-6.6)*(_/j)*(_/j)-.2,m=W*ke,h=b-.3,a=t.st;H({tile:A.bands,kind:4,pivot:[0,1,0,0]});const z=[m,.3,_],r=[m,b,_],n=h/2.4,u=[0,0,1];a.param=-.075,t.v(z,u,.2,0),a.param=.075,t.v(z,u,.8,0),t.v(r,u,.8,n),a.param=-.075,t.v(z,u,.2,0),a.param=.075,t.v(r,u,.8,n),a.param=-.075,t.v(r,u,.2,n),H({tile:-2,tint:N[1]}),t.lathe(m-W*.44,1.25,_,[[.14,0],[.2,.18],[.08,.36],[0,.62]],5,.3);const s=Math.min(1.45,(h-2.6)/6),e=O()*ae;for(let i=0;i<6;i++){const v=2.3+i*s,p=N[V[(i+k)%5]],c=.95,M=.36,q=e+i*1.3,F=_+.02,y=(g,w)=>[m+.08+g*c,v+w*M*(1-g),F+g*.2];t.thing(!0);for(let g=0;g<3;g++){const w=g/3,B=(g+1)/3;H({tile:-2,kind:5,pivot:[1,0,0,q],tint:p});const L=(E,D)=>{a.param=E,a.pivot[1]=D,t.v(y(E,D),[0,0,1],E*.5,D*.2+.2)};g<2?(L(w,-1),L(B,-1),L(B,1),L(w,-1),L(B,1),L(w,1)):(L(w,-1),L(1,0),L(w,1))}t.thing(!1)}W>0&&k%8===7&&(yield)}}async function lt(t,C={}){const O=t.rng.fork("chamak-road-hero"),R=Array.isArray(C.palette)&&C.palette.length>=7?C.palette:$e,N=["mixed","warm","cool"].includes(C.convoy)?C.convoy:O.pick(["mixed","mixed","mixed","warm","cool"]),H=O.pick(["mixed","mixed","peacock","fish","eye"]),V=Math.max(1,Math.min(60,C.trucks||40)),k=Array.isArray(C.parked)?C.parked:[],W=V+k.length,_=!C.beam,b=new x.Group;b.name="chamak-road-hero";const m=(I,U=1)=>{const X=new x.Color(I);return new x.Vector3(X.r*U,X.g*U,X.b*U)},h=I=>Math.cos(I*Math.PI/180),a=C.beam||{},z={uEye:a.uEye||{value:new x.Vector3(0,3,260)},uBeamPos:a.uBeamPos||{value:[new x.Vector3(-1,1.6,260),new x.Vector3(1,1.6,260)]},uBeamDir:a.uBeamDir||{value:new x.Vector3(0,0,-1)},uBeamGain:a.uBeamGain||{value:1},uBeamLong:a.uBeamLong||{value:new x.Vector4(h(23),h(8),110,150)},uBeamFlood:a.uBeamFlood||{value:new x.Vector4(h(72),h(48),38,.75)},uSkyFill:{value:m(R[0],1.6).add(new x.Vector3(.002,.003,.006))},uSkyTop:{value:m(R[0],1)},uSkyLow:{value:m("#1B2350",1)},uGlowCol:{value:m(R[1],.5)},uGlowDir:{value:new x.Vector3(-.57,.06,-.82).normalize()},uTime:{value:0},uConvoy:{value:0},uPix:{value:.001},uEyeL:{value:new x.Vector3(0,3,260)},uFan:{value:new x.Vector2(70,14)},uTapeGain:{value:2.4},uArch:{value:0},uNrm:{value:new x.Matrix3},uMirrorK:{value:1},uWetK:{value:1},uSnowK:{value:0},uDryK:{value:0},uMirFade:{value:0},uPortalPos:{value:new x.Vector4(0,3,-j,7)},uPortalN:{value:new x.Vector3(0,0,1)},uPortalCol:{value:new x.Vector3(0,0,0)}};z.uEyeW=z.uEye;const r=await Ge(t,R,N),n=ot(z,r,!!C.world);await t.yield();const u=me();for(const I of at(u,O.fork("truck"),R))await t.yield();const s=async(I,U)=>{const X=I.geometrySteps(U);let Q;for(await t.yield();!(Q=X.next()).done;)await t.yield();return Q.value},e=await s(u);await t.yield();const i=me();it(i);const v=i.geometry();await t.yield();const p=new Float32Array(W*4),c=new Float32Array(W*4),M=new Float32Array(W*4),q=new Float32Array(W*3),F=I=>I[0]+O.int(0,I[1]-1),y={mixed:[R[2],R[3],R[5],R[4],"#101526",R[2],R[5]],warm:[R[2],R[4],R[2],"#2a0b10",R[3]],cool:[R[5],R[3],R[5],"#0b1430",R[4]]}[N],g=O.fork("convoy");for(let I=0;I<W;I++){const U=H==="peacock"?A.peacock:H==="fish"?A.fish:H==="eye"?A.eye:null,X=()=>g.pick([A.flower,A.flower,A.sun,A.bird,A.cypress,A.fish,A.peacock,A.heart]),Q=ve=>ve[0]+g.int(0,ve[1]-1);p[I*4]=Q(U&&g.chance(.6)?U:A.fish),p[I*4+1]=Q(g.pick([A.flower,A.flower,A.bird,A.cypress,A.sun])),p[I*4+2]=Q(A.eye),p[I*4+3]=Q(U&&g.chance(.5)?U:g.pick([A.peacock,A.peacock,A.sun,A.flower])),c[I*4]=Q(g.pick([A.sun,A.flower,A.heart,A.eye])),c[I*4+1]=Q(X()),c[I*4+2]=58+g.int(0,5),c[I*4+3]=Q(g.pick([A.flower,A.heart,A.sun])),M[I*4]=g()*40,M[I*4+1]=g.range(.82,1.2),g(),M[I*4+2]=I<V?0:1,M[I*4+3]=g();const oe=new x.Color(g.pick(y)),G=g.range(.5,.85);q[I*3]=oe.r*G+.004,q[I*3+1]=oe.g*G+.004,q[I*3+2]=oe.b*G+.006}const w=new x.InstancedBufferAttribute(p,4),B=new x.InstancedBufferAttribute(c,4),L=new x.InstancedBufferAttribute(M,4),E=new x.InstancedBufferAttribute(q,3);for(const I of[e,v])I.setAttribute("aTilesA",w),I.setAttribute("aTilesB",B),I.setAttribute("aInst",L),I.setAttribute("aBody",E);const D=new x.InstancedMesh(e,n.truck,W);D.frustumCulled=!1,D.name="convoy";const K=new x.InstancedMesh(v,n.truckMirror,W);K.frustumCulled=!1,K.instanceMatrix=D.instanceMatrix,K.renderOrder=3,b.add(D,K);const Z=Math.floor(O()*1e9),Y=async(I,U)=>{const X=new x.Mesh(await s(I),n.jewel);X.frustumCulled=!1,X.name=U,b.add(X),await t.yield()},J=me();for(const I of Ze(J,R,t.core.makeRng(Z),-j,!0))await t.yield();await Y(J,"bridge-far-tower");const ne=me();for(const I of Ze(ne,R,O.fork("near"),j,!1))await t.yield();await Y(ne,"bridge-near-tower");const fe=me();for(const I of nt(fe,R,O.fork("span")))await t.yield();await Y(fe,"bridge");const de=me();for(const I of st(de,R,O.fork("hangers")))await t.yield();const pe=await s(de,!0);await t.yield();const he=new x.Mesh(pe,n.jewel);he.frustumCulled=!1,b.add(he);const le=new x.Mesh(pe,n.mirror);le.frustumCulled=!1,le.renderOrder=3,b.add(le);const te=me();te.at(0,0,-j,0);for(const I of Ce(te,R,t.core.makeRng(Z),!0,!0))await t.yield();te.pop(),await t.yield(),te.at(0,0,j,Math.PI);for(const I of Ce(te,R,O.fork("nm"),!1,!0))await t.yield();te.pop(),await t.yield();{const I=Q=>te.set(Object.assign({tile:-1,gate:0,kind:0,param:0,pivot:[0,0,0,0],tint:[.925,.925,.925]},Q)),U=j+14,X=[A.diamonds,A.chevrons,A.scallops,A.stripes,A.diamonds,A.checks];for(const Q of[-1,1]){for(let oe=-22;oe<22;oe++){const G=Math.max(-U,oe*10),ve=Math.min(U,oe*10+10),_e=(ve-G)/1.25,Ue=(ye,Te,Ae,Ke)=>{Q>0?te.quad([ye,Te,G],[ye,Te,ve],[ye,Ae,ve],[ye,Ae,G],Ke):te.quad([-ye,Te,ve],[-ye,Te,G],[-ye,Ae,G],[-ye,Ae,ve],Ke)};I({tile:A.checks}),Ue(5.62,0,.26,[0,0,_e,.5]),I({tile:X[((oe+44)*7+(Q>0?0:3))%6]}),Ue(5.8,.3,1.25,[0,.02,_e,.98])}await t.yield()}}const be=await s(te,!0);await t.yield();const ie=new x.Mesh(be,n.mirror);ie.frustumCulled=!1,ie.renderOrder=3,b.add(ie);const ce=new x.PlaneGeometry(11.24,2*(j+14),2,44);ce.rotateX(-Math.PI/2);const se=new x.Mesh(ce,n.road);se.frustumCulled=!1,se.name="wet-deck",b.add(se),await t.yield();const o=130-Me,f=new x.Vector3(130,0,j),l=35*Math.PI/180,d={x:Me,y:0,z:0,heading:0},T=(I,U)=>{if(I<=0)return U.x=Me,U.y=0,U.z=j+I,U.heading=0,U;const X=Math.min(I/o,l),Q=I-X*o;return U.x=f.x-o*Math.cos(X)+Math.sin(X)*Q,U.y=0,U.z=f.z+o*Math.sin(X)+Math.cos(X)*Q,U.heading=X,U},P=typeof C.laneAt=="function"?C.laneAt:T,S=new x.Matrix4,$=new x.Quaternion,re=new x.Vector3,ue=new x.Vector3,qe=new x.Vector3(0,1,0);let xe=null,Fe=null;const Ve=I=>{const U=V*13;for(let X=0;X<V;X++){let Q,oe=1;if(xe!==null)Q=390-(398.6+13*X-6/21*xe);else{let ve=((13*X+6*I)%U+U)%U-U/2;Q=ve-j,oe=1-t.core.smoothstep(j+3,j+9,Math.abs(ve))}let G=d;xe!==null?(G=P(Q,d)||d,G.z<0&&(oe=1-t.core.smoothstep(j+3,j+9,-G.z))):(G.x=Me,G.y=0,G.z=j+Q,G.heading=0),re.set(G.x,G.y||0,G.z),$.setFromAxisAngle(qe,G.heading||0),ue.set(oe,oe,oe),S.compose(re,$,ue),D.setMatrixAt(X,S)}D.instanceMatrix.needsUpdate=!0,z.uConvoy.value=xe!==null?6/21*xe:6*I};for(let I=0;I<k.length;I++){const U=k[I];re.set(U.x,U.y||0,U.z),$.setFromAxisAngle(qe,U.heading||0),ue.set(1,1,1),S.compose(re,$,ue),D.setMatrixAt(V+I,S)}Ve(0);const Be=typeof C.view=="string"?C.view:"whole",Ie={whole:{radius:290,height:50,center:new x.Vector3(0,12,0)},mid:{radius:20,height:12,center:new x.Vector3(1.5,4,10)},arch:{radius:30,height:26,center:new x.Vector3(0,13,-j+6)},near:{radius:7,height:6,center:new x.Vector3(2.6,4,0)},drive:{radius:7,height:2.6,center:new x.Vector3(-4.4,2,0)},approach:{radius:15,height:2.6,center:new x.Vector3(-7.3,2,-j+18)}},Le=Ie[Be]||Ie.whole,De=Be==="drive"||Be==="approach",Ee=new x.Matrix4,ze=new x.Vector3,We=new x.Vector3,Re=new x.Vector3,Se=new x.Vector3,Oe=new x.Vector2,He=new x.Vector3(-Math.sin(l),.07,-Math.cos(l)).normalize(),Je=new x.Vector3(0,3,-j),ee=(I,U,X)=>new x.Vector3(I,U,X);return{object:b,radius:Le.radius,height:Le.height,center:Le.center,span:{length:2*j,deckWidth:2*Qe,towerHeight:Ne,radius:290,height:50},ground:!1,groundY:-90,uniforms:z,cast:N,theme:H,kit:{mats:n,tex:r,makeAcc:me,T:A,GLSL_BEAM:Pe},anchors:{portalSeat:{position:ee(0,3,-j),facing:ee(0,0,1),radius:7},flyThrough:[ee(0,3,j+60),ee(0,3,j),ee(0,3,100),ee(0,3,0),ee(0,3,-100),ee(0,3,-180),ee(0,3,-j)],nearArch:ee(0,ge,j),farArch:ee(0,ge,-j),entry:ee(0,0,j+14),bend:{centre:f.clone(),radius:130,sweep:l},viewpoints:{reveal:{position:ee(23.5,3,279.6),target:ee(0,10,100)},midspan:{position:ee(0,3,0),target:ee(2.5,4,-80)},approach:{position:ee(0,3,-120),target:ee(0,5,-j)}},truckLane:{x:Me,from:ee(Me,0,-j),to:ee(Me,0,j)},owlPerch:ee(-ke,12,80),river:ee(0,-90,0)},setTravel(I){xe=I},setProgress(I){xe=I*800},setArch(I){Fe=I},update(I,U,X){if(b.updateMatrixWorld(),Ee.copy(b.matrixWorld).invert(),z.uNrm.value.setFromMatrix4(b.matrixWorld),z.uTime.value=U,_&&X){ze.setFromMatrixPosition(X.matrixWorld),X.getWorldDirection(We),Re.setFromMatrixColumn(X.matrixWorld,0).normalize(),Se.setFromMatrixColumn(X.matrixWorld,1).normalize(),z.uEye.value.copy(ze),z.uBeamDir.value.copy(We),z.uBeamPos.value[0].copy(ze).addScaledVector(Re,-1).addScaledVector(Se,-1.4),z.uBeamPos.value[1].copy(ze).addScaledVector(Re,1).addScaledVector(Se,-1.4),re.copy(ze).applyMatrix4(Ee);const Q=Math.max(0,Math.abs(re.z)-j),oe=Math.hypot(re.x,re.y,Q),G=Math.max(120,oe*1.25+70);De||(z.uBeamLong.value.set(h(50),h(22),G,G*1.7+40),z.uBeamFlood.value.set(h(82),h(55),70,.7),z.uFan.value.set(Math.max(70,oe*1.3+30),Math.max(14,oe*.75))),C.afterglowDir||z.uGlowDir.value.copy(He).transformDirection(b.matrixWorld)}else C.afterglowDir||z.uGlowDir.value.copy(He).transformDirection(b.matrixWorld);C.afterglowDir&&z.uGlowDir.value.copy(C.afterglowDir).normalize(),z.uEyeL.value.copy(z.uEye.value).applyMatrix4(Ee),X&&(t.renderer.getDrawingBufferSize(Oe),z.uPix.value=.85*2/(Math.max(X.projectionMatrix.elements[5],.1)*Math.max(Oe.y,1))),Fe!==null?z.uArch.value=Fe:_&&!De?z.uArch.value=t.core.clamp(.62+.6*Math.sin(U*.25+3.6),0,1):z.uArch.value=1-t.core.smoothstep(25,150,z.uEyeL.value.distanceTo(Je)),Ve(U)},dispose(){r.texA.dispose(),r.texB.dispose()}}}export{Pe as GLSL_BEAM,A as TILES,lt as buildHero,me as makeAcc};
