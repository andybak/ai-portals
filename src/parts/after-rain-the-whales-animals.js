import*as S from"three";import{Geo as M0}from"../kit/fauna.js";const X=(n,e,t)=>n+(e-n)*t,i0=(n,e,t)=>Math.min(t,Math.max(e,n)),_=(n,e,t)=>{const o=i0((t-n)/(e-n),0,1);return o*o*(3-2*o)},F0=(n,e,t)=>new S.Color(n,e,t),k0={humpback:[[.497,.01,-.022,.022,.6],[.475,.02,-.05,.05,.6],[.44,.028,-.074,.068,.62],[.39,.036,-.096,.082,.66],[.33,.047,-.112,.094,.72],[.26,.062,-.122,.104,.8],[.18,.08,-.126,.111,.9],[.1,.095,-.121,.113,.95],[.01,.105,-.111,.108,1],[-.07,.109,-.097,.096,1],[-.14,.113,-.079,.078,1.05],[-.21,.097,-.062,.058,1.1],[-.28,.081,-.05,.04,1.15],[-.35,.067,-.042,.026,1.2],[-.41,.055,-.037,.017,1.2],[-.45,.042,-.031,.013,1.2],[-.48,.024,-.017,.013,1],[-.5,.008,-.005,.007,1]],blue:[[.498,.006,-.012,.016,.55],[.48,.012,-.03,.036,.55],[.45,.018,-.046,.05,.55],[.4,.025,-.06,.06,.6],[.33,.034,-.071,.067,.68],[.25,.044,-.077,.071,.8],[.15,.054,-.078,.072,.9],[.05,.06,-.074,.07,1],[-.05,.062,-.067,.064,1],[-.15,.06,-.057,.054,1.05],[-.25,.054,-.046,.041,1.1],[-.33,.046,-.037,.029,1.15],[-.4,.038,-.03,.019,1.2],[-.45,.03,-.024,.012,1.2],[-.48,.018,-.014,.011,1],[-.5,.006,-.004,.006,1]],sperm:[[.5,.046,-.03,.04,.5,.5],[.492,.074,-.05,.062,.45,.45],[.47,.088,-.062,.072,.42,.42],[.42,.094,-.07,.077,.45,.45],[.34,.099,-.078,.081,.5,.5],[.26,.102,-.087,.086,.6,.6],[.17,.104,-.095,.09,.7,.7],[.07,.103,-.097,.09,.8,.8],[-.03,.099,-.093,.084,.9],[-.12,.094,-.083,.072,1],[-.2,.099,-.069,.058,1.05],[-.27,.08,-.056,.044,1.1],[-.34,.066,-.046,.031,1.15],[-.4,.054,-.039,.021,1.2],[-.45,.041,-.031,.014,1.2],[-.48,.024,-.017,.012,1],[-.5,.008,-.005,.007,1]],orca:[[.5,.01,-.016,.018,.9],[.48,.034,-.04,.044,.9],[.44,.058,-.064,.068,.9],[.38,.078,-.086,.088,.95],[.3,.094,-.104,.104,1],[.2,.106,-.116,.114,1],[.1,.112,-.12,.118,1],[0,.112,-.116,.114,1],[-.1,.106,-.104,.102,1],[-.2,.094,-.086,.084,1.05],[-.29,.078,-.066,.062,1.1],[-.37,.06,-.048,.04,1.15],[-.43,.044,-.036,.024,1.2],[-.47,.03,-.024,.015,1.1],[-.5,.01,-.008,.008,1]],dolphin:[[.5,.004,-.012,.012,1],[.46,.012,-.024,.022,1],[.425,.022,-.034,.03,1],[.405,.052,-.046,.046,.9],[.36,.074,-.062,.064,.95],[.28,.09,-.082,.082,1],[.18,.1,-.096,.094,1],[.06,.104,-.1,.098,1],[-.06,.098,-.092,.09,1],[-.18,.084,-.076,.072,1.05],[-.28,.066,-.058,.052,1.1],[-.37,.048,-.042,.032,1.15],[-.44,.034,-.03,.018,1.2],[-.48,.022,-.02,.012,1.1],[-.5,.008,-.006,.006,1]]};function x0(n,e){const t=n.length,o=i0(e,0,1)*(t-1),i=Math.min(t-2,Math.floor(o)),c=o-i,l=n[Math.max(0,i-1)],u=n[i],m=n[i+1],f=n[Math.min(t-1,i+2)],a=[];for(let v=0;v<6;v++){const r=l[v]??.88,w=u[v]??.88,s=m[v]??.88,h=f[v]??.88;a.push(.5*(2*w+(s-r)*c+(2*r-5*w+4*s-h)*c*c+(3*w-r-3*s+h)*c*c*c))}return a}function g0(n,e){let t=0,o=1;for(let c=0;c<22;c++){const l=(t+o)*.5;x0(n,l)[0]>e?t=l:o=l}const i=x0(n,(t+o)*.5);return[i[1],i[2],i[3]]}function q0(n,e,t,o,i,c={}){const l={r:1,g:0,b:0},u=[],m=n.n,f=c.eb??.92;for(let s=0;s<o;s++){const[h,d,z,B,N,W]=x0(e,s/(o-1)),O=X(z,d,c.yc?c.yc(h):.5),K=[];for(let G=0;G<i;G++){const s0=G/i*Math.PI*2,L=Math.cos(s0),Z=Math.sin(s0),t0=1+(c.push?c.push(h,s0):0),D=B*t0*Math.sign(Z)*Math.pow(Math.abs(Z),L>0?W:Math.min(.95,W+.1)),Y=L>0?O+(d-O)*t0*Math.pow(L,N):O-(O-z)*t0*Math.pow(-L,f);c.paint&&c.paint(h,Y,L,D,l),K.push(n.v(D*t,Y*t,h*t,l))}u.push(K)}const a=x0(e,0),v=x0(e,1);c.paint&&c.paint(a[0],(a[1]+a[2])*.5,0,0,l);const r=n.v(0,(a[1]+a[2])*.5*t,(a[0]+a[3]*(c.noseOut??.3))*t,l);c.paint&&c.paint(v[0],(v[1]+v[2])*.5,0,0,l);const w=n.v(0,(v[1]+v[2])*.5*t,(v[0]-v[3])*t,l);for(let s=0;s<i;s++){const h=(s+1)%i;n.tri(u[0][s],r,u[0][h]),n.tri(w,u[o-1][s],u[o-1][h])}for(let s=0;s<o-1;s++)for(let h=0;h<i;h++){const d=(h+1)%i;n.quad(u[s+1][h],u[s][h],u[s][d],u[s+1][d])}return[m,n.n]}function I0(n,e,t,o,i=.5){const c=n.n,l=[],u={r:1,g:0,b:0};for(const r of e){const w=[];for(let s=0;s<t;s++){const h=s/t*Math.PI*2,d=Math.cos(h),z=Math.sin(h),B=d*r.chord*.5+(r.shift||0),N=z*r.thick*.5*(.7+.3*d);o(r.k,d,z,u),w.push(n.v(r.c.x+r.ch.x*B+r.th.x*N,r.c.y+r.ch.y*B+r.th.y*N,r.c.z+r.ch.z*B+r.th.z*N,u))}l.push(w)}const m=e.length,f=e[m-1],a=e[m-2];o(1,0,0,u);const v=n.v(f.c.x+(f.c.x-a.c.x)*i,f.c.y+(f.c.y-a.c.y)*i,f.c.z+(f.c.z-a.c.z)*i,u);for(let r=0;r<m-1;r++)for(let w=0;w<t;w++){const s=(w+1)%t;n.quad(l[r][w],l[r+1][w],l[r+1][s],l[r][s])}for(let r=0;r<t;r++)n.tri(l[m-1][r],v,l[m-1][(r+1)%t]);return[c,n.n]}const m0=(n,e,t)=>new S.Vector3(n,e,t);function C0(n,e,t,o){const i=[],c=t.n||12,l=t.z0*e,u=t.y0*e;for(let a=0;a<=c;a++){const v=a/c,r=(.004+v*t.span)*e,w=l+(t.lead-t.sweep*Math.pow(v,t.pw||1.25))*e;let s=l-(t.chord-t.lead)*e-t.back*e*Math.sin(Math.min(1,v*1.12)*Math.PI*.5)+t.notch*e*Math.exp(-v*9);t.rag&&(s+=t.rag*e*(o[a%o.length]-.5)*(.4+v));const h=Math.max(.006*e,(w-s)*(1-.82*Math.pow(v,3)));i.push({c:m0(r,u+.004*e*(1-v),w-h*.5),ch:m0(0,0,1),th:m0(0,1,0),chord:h,thick:Math.max(.0035*e,.02*e*(1-v*.85)*Math.min(1,h/(.05*e))),k:v})}const m=I0(n,i,t.m||8,(a,v,r,w)=>{w.r=.82+.18*r,w.g=r<0?1:0,w.b=.4},.35);n.anim(m,(a,v,r)=>[Math.min(1,Math.abs(a)/(t.span*e)),0,2,Math.max(0,(l+t.lead*e-r)/e)]),n.pivot(m,0,u,l+t.lead*e);const f=n.mirror(m,0);return[m[0],f[1]]}function S0(n,e,t){const o=t.droop*Math.PI/180,i=t.sweep*Math.PI/180,c=t.len*e,l=t.n||14,u=m0(Math.cos(o)*Math.cos(i),-Math.sin(o),-Math.cos(o)*Math.sin(i)),m=m0(0,0,1);m.addScaledVector(u,-m.dot(u)).normalize();const f=new S.Vector3().crossVectors(u,m).normalize(),a=m0(t.root[0]*e,t.root[1]*e,t.root[2]*e),v=[];for(let h=0;h<=l;h++){const d=h/l,z=t.shape?t.shape(d):(.6+.4*Math.sin(Math.min(1,d*1.1+.12)*Math.PI))*(1-.6*d*d*d),B=t.knobs?1+.16*Math.pow(Math.abs(Math.sin(d*Math.PI*t.knobs+.5)),1.5)*(.5+d):1,N=t.chord*e*z,W=a.clone().addScaledVector(u,(d-.06)*c).addScaledVector(m,-d*d*(t.rake??.035)*e);v.push({c:W,ch:m,th:f,chord:N*(.5+.5*B),shift:N*.25*(B-1),thick:Math.max(.004*e,t.thick*e*z*(1-.6*d)),k:d})}const r=I0(n,v,t.m||10,(h,d,z,B)=>{B.r=.84+.16*z,B.g=z<0?1:t.white??0,B.b=.2},.3),w=new S.Vector3;n.anim(r,(h,d,z)=>[i0(w.set(h,d,z).sub(a).dot(u)/c,0,1),1,1,0]),n.pivot(r,a.x,a.y,a.z);const s=n.mirror(r);return[r[0],s[1]]}function E0(n,e,t,o){const i=[],c=o.n||6,l=g0(e,o.z)[0]*t-.004*t;for(let m=0;m<=c;m++){const f=m/c,a=o.base*t*Math.pow(1-f,o.taper??.8)*(1-.25*f)+.004*t,v=o.rake*t*Math.pow(f,1.5)+o.hook*o.base*t*f*f*.6;i.push({c:m0(0,l+f*o.h*t,o.z*t-v+(o.base*t-a)*.5*(o.lean??.6)),ch:m0(0,0,1),th:m0(1,0,0),chord:a,thick:Math.max(.003*t,o.thick*t*(1-.8*f)),k:f})}const u=I0(n,i,8,(m,f,a,v)=>{v.r=.9,v.g=0,v.b=.6},.25);return n.anim(u,(m,f,a)=>[i0((f-l)/(o.h*t),0,1),0,3,0]),n.pivot(u,0,l,o.z*t),u}function c0(n,e,t,o,i=.5,c=.92){let l=0,u=1;for(let B=0;B<22;B++){const N=(l+u)*.5;x0(n,N)[0]>t?l=N:u=N}const[,m,f,a,v,r]=x0(n,(l+u)*.5),w=X(f,m,i),s=Math.cos(o),h=Math.sin(o),d=a*Math.sign(h)*Math.pow(Math.abs(h),s>0?r:Math.min(.95,r+.1)),z=s>0?w+(m-w)*Math.pow(s,v):w-(w-f)*Math.pow(-s,c);return[d*e,z*e,t*e]}function h0(n,e,t,o=0,i=.86,c=.75){const l=n.blob(e[0],e[1],e[2],t,t*c,t*1.15,F0(i,o,.8),null,5,3);return n.anim(l,()=>[0,0,0,0]),l}function A0(n,e,t,o,i,c,l){const u=c0(e,t,o,i,l);for(const m of[-1,1]){const f=n.blob(m*(u[0]-c*.25),u[1],u[2],c*.55,c,c*1.25,F0(.5,0,1),null,6,4);n.anim(f,()=>[0,0,0,0])}return[u[0]/t,u[1]/t,u[2]/t]}function K0(n){const e=new M0,t=14,o=k0.humpback,i=a=>a>.2?.52:.46,c=a=>-.056+.036*_(.1,-.35,a)-.012*_(.3,.5,a);q0(e,o,t,56,32,{yc:i,paint:(a,v,r,w,s)=>{s.r=.84+.16*Math.max(0,r),s.g=_(c(a)+.03,c(a)-.03,v),s.b=0}}),e.anim([0,e.n],()=>[0,0,0,0]);const l=.0068*t;for(let a=0;a<8;a++){const v=.478-a*.026-n()*.004;if(h0(e,c0(o,t,v,0,i(v)),l*(.85+.3*n())),a>0)for(const r of[-1,1])h0(e,c0(o,t,v+.012,r*(.55+.1*n()),i(v)),l*(.8+.3*n())),a>1&&a<7&&h0(e,c0(o,t,v-.004,r*(1.02+.08*n()),i(v)),l*(.7+.3*n()))}for(let a=0;a<7;a++){const v=.482-a*.03-n()*.005;for(const r of[-1,1])h0(e,c0(o,t,v,r*(1.72+.1*n()),i(v)),l*(.9+.3*n()),.14)}for(let a=0;a<5;a++)h0(e,c0(o,t,.47-n()*.05,(n()-.5)*.9+Math.PI,i(.45)),l*(.9+.5*n()),.8);h0(e,c0(o,t,.315,0,i(.315)),.02*t,0,.92,.5);for(const a of[-1,1])h0(e,c0(o,t,.292,a*.12,i(.29)),.011*t,0,.5,.45);E0(e,o,t,{z:-.168,h:.03,base:.085,rake:.03,hook:.5,thick:.012,n:5});for(let a=0;a<7;a++){const v=-.245-a*.03;h0(e,c0(o,t,v,0,.5),(.0085-a*7e-4)*t,0,.9,.6)}for(let a=0;a<14;a++){const v=a<9?.2+n()*.27:-.1-n()*.2,r=a<9?Math.PI+(n()-.5)*1.6:(n()-.5)*1.2,w=c0(o,t,v,r,i(v));for(let s=0;s<2;s++)h0(e,[w[0]+(n()-.5)*.25,w[1]+(n()-.5)*.12,w[2]+(n()-.5)*.3],(.0035+.003*n())*t,1,1,.9)}const u=[];for(let a=0;a<16;a++)u.push(n());C0(e,t,{z0:-.462,y0:.008,span:.168,lead:.07,sweep:.19,chord:.128,back:.085,notch:.034,rag:.014,n:13,m:8},u);const m=g0(o,.2)[2];S0(e,t,{root:[m*.84,-.086,.2],droop:36,sweep:30,len:.315,chord:.094,thick:.024,knobs:5,white:.66,n:16,m:10});const f=A0(e,o,t,.262,1.62,.0078*t,i(.262));return{geo:e.build(),L:t,eye:f,tris:e.triangles,rb:.115,fl:.168,fp:.27,pz:.2}}function D0(n){const e=new M0,t=26,o=k0.blue,i=m=>m>.2?.55:.48,c=m=>-.045+.03*_(.1,-.4,m);q0(e,o,t,68,34,{yc:i,paint:(m,f,a,v,r)=>{r.r=.85+.15*Math.max(0,a),r.g=_(c(m)+.03,c(m)-.03,f)*.55,r.b=0}}),e.anim([0,e.n],()=>[0,0,0,0]);for(let m=0;m<9;m++){const f=.47-m*.022;h0(e,c0(o,t,f,0,i(f)),(.0035+.0012*m)*t,0,.92,.55)}E0(e,o,t,{z:-.262,h:.013,base:.03,rake:.016,hook:.7,thick:.006,n:4}),C0(e,t,{z0:-.468,y0:.006,span:.118,lead:.045,sweep:.105,chord:.085,back:.03,notch:.016,n:11,m:8},[.5]);const l=g0(o,.24)[2];S0(e,t,{root:[l*.86,-.058,.24],droop:30,sweep:48,len:.135,chord:.036,thick:.01,white:0,n:10,m:8,shape:m=>(.75+.25*Math.sin(Math.min(1,m*1.2+.1)*Math.PI))*(1-.75*m*m*m)});const u=A0(e,o,t,.298,1.68,.0038*t,i(.3));return{geo:e.build(),L:t,eye:u,tris:e.triangles,rb:.072,fl:.118,fp:.1,pz:.24}}function U0(n){const e=new M0,t=14,o=k0.sperm;q0(e,o,t,54,30,{yc:f=>(f>.15,.5),eb:.75,noseOut:.12,paint:(f,a,v,r,w)=>{w.r=.84+.16*Math.max(0,v),w.g=_(-.05,-.1,a)*_(-.1,.2,f)*.35,w.b=0}}),e.anim([0,e.n],()=>[0,0,0,0]);const c=[];for(let f=0;f<=8;f++){const a=f/8,v=.455-a*.27,r=g0(o,v)[1];c.push({z:v*t,y:(r-.004-.02*(1-a)*(1-a))*t,rx:f===0?0:(.009+.02*a)*t,ry:f===0?0:(.008+.01*a)*t})}const l=e.loft(c,{sides:8,top:F0(.9,1,0),belly:F0(.8,1,0)});e.anim(l,()=>[0,0,0,0]);for(let f=0;f<6;f++){const a=-.25-f*.032;h0(e,c0(o,t,a,0,.5),(.009-f*9e-4)*t,0,.9,.6)}C0(e,t,{z0:-.462,y0:.006,span:.15,lead:.055,sweep:.125,chord:.108,back:.012,notch:.03,pw:1.05,n:10,m:8},[.5]);const u=g0(o,.13)[2];S0(e,t,{root:[u*.9,-.07,.13],droop:42,sweep:38,len:.1,chord:.056,thick:.014,white:0,n:8,m:8,shape:f=>(.7+.3*Math.sin(Math.min(1,f*1.2+.15)*Math.PI))*(1-.5*f*f*f)});const m=A0(e,o,t,.185,1.95,.0055*t,.5);return{geo:e.build(),L:t,eye:m,tris:e.triangles,rb:.1,fl:.15,fp:.09,pz:.13}}function $0(n){const e=new M0,t=6.5,o=k0.orca;q0(e,o,t,36,24,{paint:(l,u,m,f,a)=>{a.r=.85+.15*Math.max(0,m),a.g=0,a.b=0}}),e.anim([0,e.n],()=>[0,0,0,0]),E0(e,o,t,{z:.04,h:.15,base:.135,rake:.075,hook:.55,thick:.02,n:8,taper:.9}),C0(e,t,{z0:-.465,y0:.006,span:.145,lead:.06,sweep:.13,chord:.108,back:.04,notch:.022,n:8,m:8},[.5]);const i=g0(o,.2)[2];S0(e,t,{root:[i*.85,-.085,.2],droop:40,sweep:32,len:.17,chord:.092,thick:.02,white:0,n:8,m:8,rake:.01,shape:l=>Math.pow(Math.sin(Math.min(1,l*.9+.12)*Math.PI),.6)*(1-.25*l*l)});const c=A0(e,o,t,.4,1.78,.007*t,.5);return{geo:e.build(),L:t,eye:c,tris:e.triangles,rb:.118,fl:.145,fp:.15,pz:.2}}function H0(n){const e=new M0,t=2.7,o=k0.dolphin,i=u=>-.03+.02*_(.2,-.4,u);q0(e,o,t,26,14,{paint:(u,m,f,a,v)=>{v.r=.84+.16*Math.max(0,f),v.g=_(i(u)+.035,i(u)-.035,m),v.b=0}}),e.anim([0,e.n],()=>[0,0,0,0]),E0(e,o,t,{z:.03,h:.105,base:.125,rake:.075,hook:.9,thick:.014,n:5,taper:.85}),C0(e,t,{z0:-.465,y0:.004,span:.12,lead:.05,sweep:.11,chord:.088,back:.03,notch:.02,n:5,m:6},[.5]);const c=g0(o,.23)[2];S0(e,t,{root:[c*.85,-.062,.23],droop:42,sweep:40,len:.155,chord:.055,thick:.012,white:0,n:5,m:6});const l=A0(e,o,t,.385,1.7,.007*t,.5);return{geo:e.build(),L:t,eye:l,tris:e.triangles,rb:.1,fl:.12,fp:.13,pz:.23}}const Q0=`
uniform vec4 uPos[NB]; uniform vec4 uRot[NB]; uniform vec4 uMisc[NB];
uniform float uLen, uFlk, uFinTall; uniform vec4 uSwim, uFin;
attribute vec4 aAnim; attribute vec3 aPivot; attribute vec4 iA;
varying vec3 vLocal, vWorld, vN, vCol; varying vec4 vInst;
vec2 rot(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(c * v.x - s * v.y, s * v.x + c * v.y); }
vec3 place(vec3 v, vec4 R){
  v.xy = rot(v.xy, R.z);
  float c = cos(R.y), s = sin(R.y); v = vec3(v.x, v.y * c + v.z * s, -v.y * s + v.z * c);
  c = cos(R.x); s = sin(R.x); return vec3(v.x * c + v.z * s, v.y, -v.x * s + v.z * c);
}
void main(){
  int id = int(iA.x + .5);
  vec4 P = uPos[id], R = uRot[id], M = uMisc[id];
  vec3 p = position, n = normal;
  vLocal = position / uLen; vCol = color; vInst = vec4(iA.y, iA.z, M.x, iA.w);
  float kind = aAnim.z;
  // a tall fin for the male (variant 1)
  if(kind > 2.5){ float tall = iA.z * uFinTall; p.y = aPivot.y + (p.y - aPivot.y) * (1. + tall); p.z += aAnim.x * tall * .035 * uLen; }
  // flippers scull about their roots: a slow flap about the long axis with the tip trailing, and a slower sweep
  if(kind > .5 && kind < 1.5){
    vec3 d = p - aPivot; float k = aAnim.x, side = aAnim.y, ft = M.z + side * .7;
    float ang = (uFin.y + uFin.x * sin(ft - k * uFin.z)) * side;
    d.xy = rot(d.xy, ang); n.xy = rot(n.xy, ang);
    float sw = uFin.w * sin(ft * .5 + 1.3 - k * .8) * side;
    d.xz = rot(d.xz, sw); n.xz = rot(n.xz, sw);
    p = aPivot + d;
  }
  // the body's wave travels from the shoulders to the flukes and grows on the way
  float amp = uSwim.y * uLen * M.y, kz = uSwim.z;
  if(kind > 1.5 && kind < 2.5){
    float hz = aPivot.z / uLen, wh = clamp(uSwim.w - hz, 0., 1.2), ah = hz * kz + P.w;
    float slope = amp * (wh * wh * kz * cos(ah) - 2. * wh * sin(ah)) / uLen;
    float fa = -atan(slope) + uFlk * M.y * sin(ah - 1.1);
    vec3 d = p - aPivot; d.yz = rot(d.yz, fa); n.yz = rot(n.yz, fa);
    d.y += aAnim.x * aAnim.x * uLen * .03 * M.y * sin(ah - 1.9);
    p = aPivot + d; p.y += amp * wh * wh * sin(ah);
  } else {
    float zn = p.z / uLen, w = clamp(uSwim.w - zn, 0., 1.2), a = zn * kz + P.w;
    float slope = amp * (w * w * kz * cos(a) - 2. * w * sin(a)) / uLen;
    p.y += amp * w * w * sin(a);
    n = normalize(vec3(n.x, n.y - slope * n.z, n.z + slope * n.y));
  }
  // a small counter nod of the head, and the sideways bend of a turning body
  p.y += amp * .1 * sin(P.w - 1.2) * (.3 + p.z / uLen);
  p.x += .5 * R.w * p.z * p.z;
  p *= M.w;
  vec3 w3 = P.xyz + place(p, R);
  vWorld = w3; vN = place(n, R);
  gl_Position = projectionMatrix * viewMatrix * vec4(w3, 1.);
}
`,J0=`
uniform vec3 uSun, uSunCol, uSkyCol, uGroundCol, uFogCol, uTop, uBel, uEye;
uniform vec2 uFog; uniform float uLen, uWet, uRare, uTime; uniform vec4 uBlk[8];
varying vec3 vLocal, vWorld, vN, vCol; varying vec4 vInst;
float h3(vec3 p){ p = fract(p * vec3(.1031, .1030, .0973)); p += dot(p, p.yxz + 33.33); return fract((p.x + p.y) * p.z); }
float vn(vec3 p){ vec3 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h3(i), h3(i + vec3(1., 0., 0.)), f.x), mix(h3(i + vec3(0., 1., 0.)), h3(i + vec3(1., 1., 0.)), f.x), f.y),
             mix(mix(h3(i + vec3(0., 0., 1.)), h3(i + vec3(1., 0., 1.)), f.x), mix(h3(i + vec3(0., 1., 1.)), h3(i + vec3(1., 1., 1.)), f.x), f.y), f.z); }
float fbm(vec3 p){ return .5 * vn(p) + .25 * vn(p * 2.03 + 7.) + .125 * vn(p * 4.1 + 13.) + .0625 * vn(p * 8.2 + 21.); }
// the low sun reaches a place only through the gaps between the towers of the sun's side (by place, from the plan)
float sunAt(vec3 wp){
  float lit = 1., sx = abs(uSun.x) < .02 ? .02 : uSun.x;
  for(int i = 0; i < 8; i++){
    vec4 b = uBlk[i]; float t = (b.z - wp.x) / sx, zh = wp.z + uSun.z * t, yh = wp.y + uSun.y * t;
    float occ = smoothstep(b.x - 3., b.x + 3., zh) * (1. - smoothstep(b.y - 3., b.y + 3., zh)) * (1. - smoothstep(b.w - 6., b.w + 2., yh));
    lit *= 1. - occ * step(0., t);
  }
  return lit;
}
// thin pale scratches running mostly along the body
float scars(vec3 q, float dens){
  float a = vn(vec3(q.x * 260., q.y * 260. + q.z * 40., q.z * 11.)), b = vn(vec3(q.x * 30. + q.z * 190., q.y * 200., q.z * 17.) + 9.);
  return (smoothstep(1. - dens, 1. - dens * .5, a) + smoothstep(1. - dens * .6, 1. - dens * .3, b)) * .6;
}
`,z0={};z0.humpback=`
vec3 skin(vec3 q, float part, out float h){
  vec3 qs = q + vInst.x * 17.3; h = 0.;
  float n1 = fbm(qs * vec3(30., 30., 16.)), n2 = vn(qs * vec3(150., 150., 44.) + 5.), n3 = vn(qs * vec3(9., 9., 5.) + 2.);
  float fw = clamp(length(fwidth(q)) * 60., 0., 1.);
  vec3 top = uTop * (.7 + .6 * n1), bel = uBel * (.84 + .2 * n1), c;
  top *= .8 + .45 * n3;
  float rv = vn(qs * vec3(120., 120., 52.) + 4.), rings = smoothstep(.84, .89, rv) * (1. - .8 * smoothstep(.92, .96, rv));
  top = mix(top, uBel * .62, clamp(scars(qs, .07) * (1. - fw) + smoothstep(.84, .95, n2) * .3 + rings * .45 * (1. - fw), 0., 1.) * .65);
  float rk = smoothstep(.78, .84, vn(qs * vec3(9., 9., 4.) + 9.)) * (1. - smoothstep(.05, .16, abs(fract((q.y * .55 + q.z + q.x * .2) * 60. + n3 * 1.5) - .5))) * (1. - fw);
  top = mix(top, uBel * .7, rk * .42);
  h += ((n1 - .5) * .03 + (n2 - .5) * .008 + rings * .02 - rk * .012) * (1. - fw);
  if(part < .1){
    float k = smoothstep(.36, .64, vCol.g + (n3 - .5) * .75 + (n1 - .5) * .3);
    float tb = atan(q.x + 1e-6, -(q.y + .012));
    float pz = smoothstep(-.06, .05, q.z) * (1. - smoothstep(.455, .495, q.z)) * (1. - smoothstep(1.0, 1.5, abs(tb)));
    float gr = 1. - smoothstep(0., .55, abs(sin(tb * 15.)));
    gr *= pz * (1. - smoothstep(.25, .9, fwidth(tb * 15.)));
    h -= gr * .085;
    bel *= 1. - .72 * gr;
    bel = mix(bel, uTop, smoothstep(.7, .8, n1 + n2 * .3) * .5);
    c = mix(top, bel, k);
    float ym = -.008 - .04 * (1. - smoothstep(.27, .5, q.z));
    float ml = (1. - smoothstep(.0012, .0045, abs(q.y - ym))) * step(.262, q.z) * (1. - fw);
    c *= 1. - .7 * ml; h -= ml * .03;
    vec3 e = vec3(abs(q.x), q.y, q.z) - uEye; float ed = length(e * vec3(1., 1., .6));
    c *= 1. - .5 * (1. - smoothstep(.007, .02, ed)); h += .02 * (1. - smoothstep(.012, .022, ed));
  } else if(part < .3){
    float k = smoothstep(.3, .62, vCol.g + (n3 - .5) * .9 + (n1 - .5) * .35);
    c = mix(top, bel * (.9 + .1 * n2), k);
  } else if(part < .5){
    float edge = smoothstep(.0, .5, vInst.x + n3 - .35);
    float k = vCol.g * smoothstep(.38, .6, n3 * .8 + vn(qs * vec3(22., 4., 22.)) * .5 - .12 + vInst.w * .3) * edge;
    c = mix(top, bel, k);
  } else if(part < .7){
    c = top;
  } else if(part < .9){
    c = mix(top * 1.5 + .025, vec3(.8, .76, .66) * (.7 + .5 * n2), vCol.g);
    h += (n2 - .5) * .035 * (1. - fw);
  } else { c = vec3(.012); }
  return mix(c, mix(c, vec3(.72, .7, .68) * (.58 + .25 * n1 + .2 * vCol.g + .14 * n3), .82), uRare * step(.5, vInst.y) * step(part, .9));
}
`,z0.blue=`
vec3 skin(vec3 q, float part, out float h){
  vec3 qs = q + vInst.x * 11.7; h = 0.;
  float n1 = fbm(qs * vec3(44., 44., 20.)), n2 = vn(qs * vec3(170., 170., 60.) + 5.), n3 = fbm(qs * vec3(13., 13., 7.) + 3.);
  float fw = clamp(length(fwidth(q)) * 60., 0., 1.);
  float blot = smoothstep(.5, .72, n1) * (1. - smoothstep(-.1, .42, q.z)) + smoothstep(.62, .8, n1) * .5;
  vec3 c = uTop * (.72 + .5 * n3);
  c = mix(c, uBel * (.8 + .3 * n2), clamp(blot * .55 + smoothstep(.8, .95, n2) * .15, 0., 1.));
  c = mix(c, uTop * .5, (1. - smoothstep(.1, .3, n1)) * .35);
  if(part < .1){
    float tb = atan(q.x + 1e-6, -(q.y + .008));
    float pz = smoothstep(-.1, .0, q.z) * (1. - smoothstep(.46, .495, q.z)) * (1. - smoothstep(1.1, 1.6, abs(tb)));
    float gr = (1. - smoothstep(0., .55, abs(sin(tb * 30.)))) * pz * (1. - smoothstep(.25, .9, fwidth(tb * 30.)));
    h -= gr * .03; c *= 1. - .3 * gr;
    c = mix(c, uBel * (.85 + .2 * n1), vCol.g * .55);
    float ym = -.004 - .03 * (1. - smoothstep(.3, .5, q.z));
    float ml = (1. - smoothstep(.001, .0035, abs(q.y - ym))) * step(.3, q.z) * (1. - fw);
    c *= 1. - .6 * ml; h -= ml * .03;
    vec3 e = vec3(abs(q.x), q.y, q.z) - uEye; float ed = length(e * vec3(1., 1., .6));
    c *= 1. - .5 * (1. - smoothstep(.004, .011, ed));
  } else if(part > .9){ c = vec3(.012); }
  else { c = mix(c, uBel * .9, vCol.g * .3); }
  c = mix(c, uBel * .8, scars(qs, .035) * (1. - fw) * .4);
  return c;
}
`,z0.sperm=`
vec3 skin(vec3 q, float part, out float h){
  vec3 qs = q + vInst.x * 13.1; h = 0.;
  float n1 = fbm(qs * vec3(28., 28., 14.)), n2 = vn(qs * vec3(150., 150., 50.) + 5.), n3 = vn(qs * vec3(8., 8., 4.) + 2.);
  float n4 = fbm(qs * vec3(10., 10., 5.) + 17.);
  float fw = clamp(length(fwidth(q)) * 60., 0., 1.);
  vec3 c = uTop * (.6 + .8 * n1);
  if(part < .1){
    float th = atan(q.x + 1e-6, q.y), ph = th * 18. + 4. * vn(qs * vec3(6., 6., 9.)) + 2. * sin(q.z * 40.);
    float wk = (1. - smoothstep(.07, .2, q.z)) * smoothstep(-.44, -.3, q.z) * (1. - smoothstep(.4, 1.3, fwidth(ph))) * smoothstep(-.75, -.15, q.y / (length(q.xy) + 1e-5));
    float wr = sin(ph);
    h += wr * .1 * wk; c *= 1. + wk * (.5 * smoothstep(.1, .9, wr) - .55 * (1. - smoothstep(-.7, .3, wr)));
    float hd = smoothstep(.08, .28, q.z);
    c = mix(c, uBel * .6, hd * (.12 + .3 * smoothstep(.45, .8, n3)));
    float broad = smoothstep(.8, .87, vn(vec3(qs.x * 44., qs.y * 44. + qs.z * 8., qs.z * 5.) + 3.)) + smoothstep(.84, .9, vn(vec3(qs.x * 9. + qs.z * 38., qs.y * 40., qs.z * 6.) + 11.));
    c = mix(c, uBel * .85, clamp((scars(qs, .08) * .85 + scars(qs * 1.7 + 3., .05) * .6) * hd * (1. - fw) + broad * hd * .5 + smoothstep(.9, .97, n2) * hd * .5, 0., 1.));
    float blot = smoothstep(.55, .68, n4) * (.3 + .4 * (1. - smoothstep(-.06, .05, q.y))) * (1. - .6 * hd);
    c = mix(c, uBel * (.5 + .3 * n1), blot);
    float jaw = (1. - smoothstep(-.07, -.045, q.y)) * smoothstep(.14, .3, q.z) * (1. - smoothstep(.015, .05, abs(q.x)));
    c = mix(c, uBel * (.75 + .3 * n3), clamp(jaw * (.35 + .4 * n1) + vCol.g * 1.3, 0., 1.));
    vec3 e = vec3(abs(q.x), q.y, q.z) - uEye; float ed = length(e * vec3(1., 1., .6));
    c *= 1. - .5 * (1. - smoothstep(.006, .016, ed));
  } else if(part > .9){ c = vec3(.012); }
  else { c = mix(c, uBel * .7, clamp(scars(qs, .05) * .5 + smoothstep(.58, .72, n4) * .3, 0., 1.)); }
  return c;
}
`,z0.orca=`
vec3 skin(vec3 q, float part, out float h){
  vec3 qs = q + vInst.x * 7.7; h = 0.;
  float n1 = fbm(qs * vec3(30., 30., 16.)), n3 = vn(qs * vec3(10., 10., 6.) + 2.), w = 0.;
  vec3 blk = uTop * (.75 + .5 * n1), wht = uBel * (.88 + .14 * n1), c;
  if(part < .1){
    float line = -.05 + .06 * smoothstep(.36, .47, q.z) - .03 * (1. - smoothstep(.14, .3, q.z)) * smoothstep(-.02, .12, q.z)
      + .09 * (1. - smoothstep(-.15, -.03, q.z)) * smoothstep(-.36, -.2, q.z) - .02 * (1. - smoothstep(-.45, -.3, q.z));
    w = 1. - smoothstep(line - .005, line + .005, q.y + (n3 - .5) * .008);
    vec2 e = (vec2(q.y, q.z) - vec2(uEye.y + .036, uEye.z - .042)) / vec2(.021, .058);
    w = max(w, (1. - smoothstep(.8, 1.05, length(e))) * step(.03, abs(q.x)));
    float sd = (1. - smoothstep(-.07, -.035, q.z)) * smoothstep(-.22, -.12, q.z) * smoothstep(.035, .07, q.y);
    c = mix(mix(blk, vec3(.5, .53, .58) * (.8 + .3 * n1), sd * .92), wht, w);
    vec3 e3 = vec3(abs(q.x), q.y, q.z) - uEye; c *= 1. - .6 * (1. - smoothstep(.006, .014, length(e3)));
  } else if(part > .9){ c = vec3(.012); }
  else if(part > .3 && part < .5){ c = mix(blk, wht, vCol.g * smoothstep(.02, .06, abs(q.x))); }
  else { c = blk; }
  return mix(c, wht * .8, scars(qs, .03) * .3 * (1. - w));
}
`,z0.dolphin=`
vec3 skin(vec3 q, float part, out float h){
  vec3 qs = q + vInst.x * 3.9; h = 0.;
  float n1 = fbm(qs * vec3(26., 26., 14.)), n3 = vn(qs * vec3(8., 8., 5.) + 2.);
  vec3 cape = uTop * (.58 + .22 * n1), flank = uTop * (1.14 + .22 * n1), c;
  if(part < .1){
    float cl = .045 - .05 * (1. - smoothstep(-.35, .1, q.z)) + (n3 - .5) * .012;
    c = mix(flank, cape, smoothstep(cl - .012, cl + .012, q.y));
    c = mix(c, uBel * (.88 + .14 * n1), smoothstep(.42, .82, vCol.g + (n3 - .5) * .3));
    vec3 e = vec3(abs(q.x), q.y, q.z) - uEye; c *= 1. - .5 * (1. - smoothstep(.008, .02, length(e)));
    float ym = -.022; c *= 1. - .5 * (1. - smoothstep(.002, .006, abs(q.y - ym))) * step(.4, q.z);
  } else if(part > .9){ c = vec3(.012); }
  else { c = cape * 1.1; }
  return c;
}
`;const X0=`
uniform vec3 uCap;
vec3 under(vec3 x, vec3 c){ vec3 t = c * .55, d = c - t; return mix(x, t + d * (1. - exp(-max(x - t, 0.) / d)), step(t, x)); }
void main(){
  vec3 N = normalize(vN); if(!gl_FrontFacing) N = -N;
  vec3 toEye = cameraPosition - vWorld; float fd = length(toEye); vec3 Vv = toEye / max(fd, 1e-3);
  float h; vec3 alb = skin(vLocal, vCol.b, h);
  vec3 dpx = dFdx(vWorld), dpy = dFdy(vWorld); float hx = dFdx(h), hy = dFdy(h);
  vec3 r1 = cross(dpy, N), r2 = cross(N, dpx); float det = dot(dpx, r1);
  vec3 Nb = abs(det) * N - sign(det) * (hx * r1 + hy * r2);
  N = normalize(Nb + N * 1e-7);
  float eyeK = step(.9, vCol.b);
  float sv = sunAt(vWorld);
  float ndl = dot(N, uSun), dif = clamp(ndl * .72 + .28, 0., 1.); dif *= dif;
  float up = clamp(N.y * .5 + .5, 0., 1.);
  float lit = sv * clamp(ndl * 1.6 + .2, 0., 1.);
  vec3 skyFill = uSkyCol * vec3(1.31, 1.36, 1.56), paveFill = uGroundCol + uSunCol * (.03 + .07 * sv);
  vec3 amb = mix(paveFill, skyFill * (1. - .6 * lit), up * up * (3. - 2. * up));
  vec3 col = alb * (amb * (.6 + .4 * vCol.r) + uSunCol * dif * sv * vCol.r * .8);
  float fr0 = 1. - clamp(dot(N, Vv), 0., 1.), fr2 = fr0 * fr0, fr = fr2 * fr2;
  vec3 Rv = reflect(-Vv, N);
  float toSun = clamp(dot(Rv, uSun), 0., 1.), ts2 = toSun * toSun, ts8 = ts2 * ts2 * ts2 * ts2;
  // the wet film mirrors the sky; where the low sun lights the skin directly the sky's image gives way and the sun
  // shows as one narrow highlight; its key and its warm sheen work on the skin's own colour (black stays black)
  vec3 skyR = mix(uGroundCol, uSkyCol, smoothstep(-.25, .35, Rv.y)) * (1. - .6 * lit) + uSunCol * .5 * ts8 * ts8 * sv;
  float wv = sin(vLocal.z * 26. - uTime * .5 + vLocal.x * 8. + vInst.x * 20.);
  float sheen = up * up * (.3 + .7 * smoothstep(-.2, .9, wv));
  col += alb * uGroundCol * clamp(-N.y, 0., 1.) * .4 * vCol.r;
  col += alb * uSunCol * sheen * lit * .45;
  col += skyR * (.022 + .24 * fr + .085 * sheen) * uWet * (1. + eyeK * 4.);
  float gl = ts8 * ts8 * ts8 * ts8; gl *= gl * gl;
  col += uSunCol * gl * (.7 + eyeK * 4.) * sv * uWet;
  float knobK = step(.7, vCol.b) * step(vCol.b, .9);
  col += uSunCol * (.02 + alb) * fr2 * clamp(ndl + .45, 0., 1.) * sv * .72 * (1. + 1.6 * knobK);
  col += uSunCol * (.17 + .25 * alb) * pow(fr0, 1.5) * ts2 * toSun * (.3 + .7 * sv);
  col = under(col, uCap);
  float fog = smoothstep(uFog.x, uFog.y, fd);
  col = mix(col, uFogCol, clamp(fog * .92 + (1. - vInst.z), 0., 1.));
  gl_FragColor = vec4(col, 1.);
}
`,V0={humpback:{geo:K0,top:"#3d454f",bel:"#e9e6df",swim:[0,.062,3.6,.22],fin:[.2,.1,1.5,.12],hz:.19,fhz:.105,flk:.3,wet:1},blue:{geo:D0,top:"#5a7186",bel:"#aebbc4",swim:[0,.04,3.4,.2],fin:[.07,.05,1,.05],hz:.13,fhz:.07,flk:.26,wet:1},sperm:{geo:U0,top:"#6b625a",bel:"#cfc8bd",swim:[0,.035,3.2,.15],fin:[.12,.1,1,.1],hz:.07,fhz:.06,flk:.2,wet:.9},orca:{geo:$0,top:"#16181c",bel:"#f1f0ea",swim:[0,.055,3.8,.22],fin:[.1,.1,1,.08],hz:.45,fhz:.2,flk:.3,wet:1.2},dolphin:{geo:H0,top:"#555e69",bel:"#ddd6cc",swim:[0,.075,4.2,.24],fin:[.08,.1,1,.06],hz:1.25,fhz:.5,flk:.36,wet:1}},R0=["humpback","blue","sperm","orca","dolphin"];function Y0(n,e){const o=[],i=[],c=[],l=[],u=new S.Vector3,m=s=>n.getPointAt?n.getPointAt(s,u):n.pointAt(s,u);for(let s=0;s<=480;s++){const h=s/480;m(h),o.push(u.z),i.push(u.x),c.push(u.y),l.push(e?e(h):h*48)}const f=s=>{let h=0,d=480;if(s>=o[0])return[0,0];if(s<=o[480])return[479,1];for(;d-h>1;){const z=h+d>>1;o[z]>s?h=z:d=z}return[h,(o[h]-s)/Math.max(1e-6,o[h]-o[h+1])]},a=(s,h)=>{const[d,z]=f(h);return X(s[d],s[d+1],z)},v=(o[472]-o[480])/Math.max(.001,l[480]-l[472]),r=(o[0]-o[8])/Math.max(.001,l[8]-l[0]),w=[0];for(let s=1;s<=480;s++)w.push(w[s-1]+Math.hypot(i[s]-i[s-1],c[s]-c[s-1],o[s]-o[s-1]));return{N:480,zs:o,xs:i,ys:c,ts:l,z0:o[0],z1:o[480],m:s=>s>o[0]?o[0]-s:s<o[480]?w[480]+o[480]-s:a(w,s),zAt:s=>{if(s<=l[0])return o[0]+(l[0]-s)*r;if(s>=l[480])return o[480]-(s-l[480])*v;let h=0,d=480;for(;d-h>1;){const z=h+d>>1;l[z]<=s?h=z:d=z}return X(o[h],o[d],(s-l[h])/Math.max(1e-6,l[d]-l[h]))},at:(s,h)=>{let d=0,z=480;for(;z-d>1;){const N=d+z>>1;w[N]<=s?d=N:z=N}const B=i0((s-w[d])/Math.max(1e-6,w[z]-w[d]),0,1);return h[0]=X(i[d],i[z],B),h[1]=X(c[d],c[z],B),h[2]=X(o[d],o[z],B),h},x:s=>a(i,s),y:s=>a(c,s),t:s=>s>o[0]?l[0]-(s-o[0])/r:s<o[480]?l[480]+(o[480]-s)/v:a(l,s),dist:(s,h,d)=>{let z=1e9;for(let B=0;B<=480;B++){const N=i[B]-s,W=c[B]-h,O=o[B]-d,K=N*N+W*W+O*O;K<z&&(z=K)}return Math.sqrt(z)}}}const W0=(n,e,t)=>e+((n-e)%(t-e)+(t-e))%(t-e),Q=Math.PI*2;function G0(n,e){return(t,o)=>{let i=n.x(t)+e.off,c=n.y(t)+e.dy;e.abs&&(i=e.abs(t)[0],c=e.abs(t)[1]);const l=e.off>=0?1:-1;if(e.over&&(c=X(c,Math.max(c,e.over[2]),_(e.over[0],e.over[1],t))),i=X(i,l*Math.max(Math.abs(i),e.arch),_(e.out?e.out[0]:-236,e.out?e.out[1]:-268,t)),i=X(i,n.xs[0]+l*Math.max(Math.abs(e.off),e.stand??16.5),_(140,178,t)),e.tops){const u=Math.abs(i),m=c,f=_(e.near-1.5,e.near,u);if(f>0)for(const a of e.tops){const v=f*_(a[0]+e.span+30,a[0]+e.span,t)*_(a[1]-e.span-30,a[1]-e.span,t);v>0&&(c=Math.max(c,X(m,Math.max(m,a[2]+w0.air+e.hang),v)))}}o[0]=i,o[1]=c}}function B0(n,e){const t=e.lane||G0(n,e),o=[0,0],i=[0,0];return(c,l,u)=>{const m=l??0,f=l==null?0:1,a=W0(e.zMeet+e.dir*e.v*(c-e.tMeet),-520,420);t(a,o),t(a+2,i);const v=(i[0]-o[0])/2,r=(i[1]-o[1])/2;u.x=o[0],u.y=o[1]+f*e.bob*Math.sin(m*.31+e.ph*9),u.z=a,u.yaw=Math.atan2(e.dir*v,e.dir),u.pitch=Math.atan(e.dir*r)*.8,u.roll=f*e.rollA*Math.sin(m*e.rollW+e.ph*5),u.curve=0,u.swim=e.swim??1,u.phase=Q*(e.hz*m+e.ph),u.fphase=Q*(e.fhz*m+e.ph*1.7),u.fade=_(-520,-440,a)*_(420,340,a)}}const Z0={z:-292,foot:9.6,leg:2.3,base:5,rise:27.5},d0={line:26,south:-240,foot:-262,edge:-276,air:4},w0={west:[[330,262,10],[240,150,10],[115,35,10],[-8,-96,8],[-240,-262,24]],east:[[300,150,16],[150,60,14],[60,22,48],[-50,-96,18],[-130,-222,20],[-240,-262,26]],air:6,beside:6.2},O0=(n,e)=>({tops:e<0?w0.west:w0.east,hang:.3*n+.45,span:w0.beside+.55*n,near:d0.line-w0.beside-.36*n-.3});function ee(n,e,t,o,i={}){const c=p=>n.makeRng(n.hashSeed("arw-animals-"+p+":"+e)),l=c("humpbacks"),u=c("pod"),m=c("blue"),f=c("sleepers"),a=c("orcas"),v=c("dolphins"),r=Y0(t,o),w=[],s=i.arch||Z0,h=(p,g,F,y,M={})=>{w.push({kind:p,L:g,size:g/F,variant:M.variant||0,seed:M.seed??.5,reach:M.reach??g*.2,big:M.big??1,lead:!!M.lead,home:M.home||null,pool:M.pool??null,at:y})},d=p=>s.foot+s.leg+2.5+.335*p,z=p=>(p<0?34:22)+6.5,B=128,N=-113,W=B-(N+13);{const p=l(),g={...O0(14.2,1),zMeet:B+3.7,tMeet:r.t(B),off:9.65,dy:.7,arch:d(14.2),over:[N+13,-135,z(1)],v:2.8,dir:-1,bob:.35,ph:p,rollA:.06,rollW:.21,hz:.19*l.range(.92,1.08),fhz:.1};h("humpback",14.2,14,B0(r,g),{seed:l(),reach:14.2*.31});const F=G0(r,g),y={L:4.8,west:5,under:3.8,behind:4.7},M={...g,lane:(T,R)=>{F(T-y.behind,R),R[0]-=y.west,R[1]-=y.under},zMeet:g.zMeet+y.behind,ph:l(),hz:.34,fhz:.2,bob:.25,rollA:.1,rollW:.37};h("humpback",y.L,14,B0(r,M),{seed:l(),variant:1,reach:y.L*.31,big:.5})}const O=[],K=[],G=[];for(let p=0;p<6;p++)O.push(u.range(.8,1.2)),K.push(u.range(2.4,3.4));const s0=O.reduce((p,g)=>p+g,0);for(const p of[1,0]){const g=[0,1,2,3,4,5].filter(y=>y%2===p),F=g.map(y=>K[y]).sort((y,M)=>y-M);g.forEach((y,M)=>{G[y]=F[M]})}const L={every:3,low:4.5,high:6,hang:p=>.3*p+.45};if(G[0]>G[L.every]){const p=G[0];G[0]=G[L.every],G[L.every]=p}let Z=B;for(let p=0;p<6;p++){Z-=W*O[p]/s0;const g=p%L.every===0,F=p%2===1,y=g?0:u.range(10.4,12.5),M=u(),T=u.range(12.4,14.8),R=u(),$={...g?{stand:0}:O0(T,F?1:-1),zMeet:Z,tMeet:r.t(Z),off:F?y:-y,dy:g?L.hang(T)+X(L.low,L.high,M):F?X(2.2,4.4,M):X(-3,4,M),arch:d(T),over:[N+13,-135,z(F?1:-1)],v:G[p],dir:-1,bob:.35,ph:R,rollA:.06,rollW:.21,hz:.19*u.range(.92,1.08),fhz:.1};h("humpback",T,14,B0(r,$),{seed:u(),reach:T*.31})}const t0=l()<.5;for(const p of[1,-1]){const g=l.range(13,14.6),F=l.range(2.4,3.4),y=s.base+s.rise-l.range(4,7),M=l.range(15.5,17.5),T=l(),R=p*Math.min(M,d0.line-d0.air-.3-.36*g),$=p*Math.min(Math.abs(R),d0.line-w0.beside-.3-.36*g),U=Math.max(0,...(p<0?w0.west:w0.east).filter(o0=>o0[0]<N&&o0[1]>d0.south).map(o0=>o0[2])),V=Math.max(z(p),U?U+w0.air+.3*g+.45:0),H=o0=>X(y,V,_(s.z+10,-240,o0)),v0={zMeet:s.z,tMeet:r.t(p>0===t0?-262:-276),off:R,dy:0,abs:o0=>[X(R,$,_(d0.south+16,d0.south+2,o0)),H(o0)],arch:d(g),out:[d0.foot-2,s.z+10],v:F,dir:-1,bob:.35,ph:T,rollA:.06,rollW:.2,hz:.19*l.range(.92,1.08),fhz:.1};h("humpback",g,14,B0(r,v0),{seed:l(),reach:g*.31})}{const p=m(),g=34,F=4.2,y=N+m.range(-1.5,1.5),M=r.t(N)-(26-r.x(N))/F;h("blue",26,26,(T,R,$)=>{const U=R??0,V=R==null?0:1,H=W0(-2-F*(T-M),-330,330);$.x=H,$.y=g+V*.5*Math.sin(U*.23+p*9),$.z=y,$.yaw=-Math.PI/2,$.pitch=V*.02*Math.sin(U*.17+p),$.roll=V*.04*Math.sin(U*.19+p*5),$.curve=0,$.swim=1,$.phase=Q*(.13*U+p),$.fphase=Q*(.07*U+p),$.fade=_(-330,-250,H)*_(330,250,H)},{seed:m(),reach:26*.16})}const D={xMid:-73,zS:-140,zN:-210,paving:0},Y=[],f0=i.trees||j0(r).map(p=>[p[0],0,p[1],p[2],0]),u0=(p,g)=>{let F=D.paving+(i.trees?10:15.5);for(const y of f0)Math.hypot(y[0]-p,y[2]-g)<.9*y[3]+3+3.8&&(F=Math.max(F,y[1]+y[3]+3.5));return F},p0=p=>1.06*p+1,r0=p=>p+p0(11)<=34,J={r:1.5*.2*16,up:.03,trunk:1,air:.2,rows:[-48,-72,-96],z0:-165,step:10,planter:[.8,3],benches:[1.49,1.3],vents:[[-66,-185],[-90,-165]],vent:1.2},e0=(p,g)=>{for(const y of f0)if(Math.hypot(y[0]-p,y[2]-g)<J.r+J.trunk)return!1;const F=(y,M,T,R)=>Math.hypot(Math.max(0,Math.abs(p-y)-T),Math.max(0,Math.abs(g-M)-R))<J.r+J.air;for(const y of J.rows)for(let M=0;M<5;M++){const T=M%2?J.benches:J.planter;if(F(y,J.z0-J.step*M,T[0],T[1]))return!1}for(const y of J.vents)if(F(y[0],y[1],J.vent,J.vent))return!1;return!0};{const p=f.range(D.zN+5,D.zS-5),g=f.range(13,15);let F=p;for(let y=1;y<120&&!e0(r.x(F)-g,F);y++)F=i0(p+(y%2?.5:-.5)*Math.ceil(y/2),D.zN+5,D.zS-5);Y.push([r.x(F)-g,F,g])}for(let p=0;p<40;p++){const g=f(),F=f(),y=X(D.zS-3,D.zN+3,F),M=X(r.x(y)-Y[0][2]-2,D.xMid,g);Y.length<6&&Y.every(T=>Math.hypot(T[0]-M,T[1]-y)>=10)&&r0(u0(M,y))&&e0(M,y)&&Y.push([M,y])}Y.forEach(p=>{const g=p[0],F=p[1],y=u0(g,F),M=f.range(28,34),T=i0(f.range(11,16),M-19,M-13),R=Math.max(6,Math.min(T,(34-y-1)/1.06)),$=Math.max(M,y+p0(R)),U=$-R*.5,V=f(),H=f.range(.5,.8),v0=f.range(.18,.3),o0=f.range(.03,.09),b=f.range(-Math.PI,Math.PI);h("sperm",R,14,(k,E,x)=>{const q=E??0,A=E==null?0:1;x.x=g+A*.3*Math.sin(q*v0*.7+V*4),x.y=U+A*.75*Math.sin(q*H+V*7),x.z=F+A*.3*Math.cos(q*v0*.6+V*2),x.pitch=Math.PI/2-o0*(1+.5*Math.sin(q*H*.5+V)),x.yaw=V*Q+.5*Math.sin(q*v0*.5+V*3),x.roll=b+(.6+.4*V)*Math.sin(q*v0+V*6),x.curve=0,x.swim=.35,x.phase=Q*(.07*q+V),x.fphase=Q*(.05*q+V),x.fade=1},{seed:f(),reach:R*.17,home:[g,U,F],pool:D.paving+J.up})});{const p=a.range(-195,-192),g=r.t(p),F=a.range(3.8,4.6);let y=0,M=0;[[7.5,1],[6,0],[6,0],[6,0],[4.2,0]].forEach((T,R)=>{const $=a.range(.97,1.05),U=a.range(1.2,3),V=R>0&&R<4?T[0]*$:T[0],H=a.range(7.8,9.6),v0=Math.min(a.range(17,19.2),21.8-.2-.45*V);R&&(y+=(M+V)/2+U),M=V;const o0={zMeet:p-y,tMeet:g,off:H,dy:0,abs:b=>[r.x(b)+H,v0],arch:s.foot+s.leg+d0.air+.25*V,v:F,dir:1,bob:.2,ph:a(),rollA:.07,rollW:.5,hz:(R===4?.6:.42)*a.range(.94,1.06),fhz:.2};h("orca",V,6.5,B0(r,o0),{seed:a(),variant:T[1],reach:V*.2,big:.6})})}return i.rngs={rD:v},i.add=h,i.R=r,i.AR=s,oe(i),{bodies:w,R:r}}function L0(n,e,t,o){const i=[0,0,0],c=[0,0,0],l=[0,0,0],u=(o.e??.03)*Math.sign(e);return(m,f,a)=>{const v=t+e*m;n(v,i),n(v+u,c),n(v+2*u,l);const r=c[0]-i[0],w=c[1]-i[1],s=c[2]-i[2],h=l[0]-c[0],d=l[2]-c[2],z=Math.max(1e-4,Math.hypot(r,s)),B=Math.atan2(r,s);let W=Math.atan2(h,d)-B;W>Math.PI&&(W-=Q),W<-Math.PI&&(W+=Q);const O=i0(W/z,-o.maxCurve,o.maxCurve);a.x=i[0],a.y=i[1],a.z=i[2],a.yaw=B,a.pitch=i0(Math.atan2(w,z)*o.pitch,-.6,.6),a.curve=O+(o.head||0)*Math.sin(f*(o.headW||0)+t*3),a.roll=-O*o.bank+o.rollA*Math.sin(f*.4+t*5),a.swim=o.swim,a.phase=Q*(o.hz*f+t),a.fphase=Q*(o.fhz*f+t*1.3),a.fade=1}}function j0(n){const e=[];for(let t=0;t<80;t++){const o=297-t*6.6;if(o<-217)break;o>-13&&o<27||o>-135&&o<-91||t%7>=4||e.push([t%2?2.3:-2.3,o,Math.min(16,n.y(o)-5.8)])}return e}function te(n,e,t,o){const i=4*e+Q*t;let c=(n%i+i)%i;if(c<2*e){o[0]=t,o[1]=e-c;return}if(c-=2*e,c<Math.PI*t){o[0]=t*Math.cos(c/t),o[1]=-e-t*Math.sin(c/t);return}if(c-=Math.PI*t,c<2*e){o[0]=-t,o[1]=-e+c;return}c-=2*e,o[0]=-t*Math.cos(c/t),o[1]=e+t*Math.sin(c/t)}function oe(n){const{rD:e}=n.rngs,t=n.add,o=n.R,i=n.dolphins??14,c=70,l=-20,u=[],m=[],f=[],a=[],v=n.trees?n.trees.filter(h=>h[4]===0&&Math.abs(h[0])<4.5).map(h=>[h[0],h[2],h[1]+h[3]]):j0(o);for(let h=0;h<5;h++)u.push(e.range(.85,1.15)),m.push(e());const r=u.reduce((h,d)=>h+d,0),w=m.map((h,d)=>[h,d]).sort((h,d)=>h[0]-d[0]).map(h=>h[1]);let s=c;for(let h=0;h<5;h++){const d=(c-l)*u[h]/r,z=s-d,B=v.filter(p=>p[1]<=s&&p[1]>=z),N=w.indexOf(h)<2?3:2,W=e.range(1.5,1.7),O=(d/2-1.2)*e.range(.7,1),K=Math.max(.5,O-W),G=4*K+Q*W,s0=B.length?B.reduce((p,g)=>p+g[1],0)/B.length:(s+z)/2,L=i0(s0,z+O+1.2,s-O-1.2),Z=B.reduce((p,g)=>Math.max(p,g[2]),-1e9),t0=B.length?i0(o.y(L)-Z-.6,5.2,5.8):5.2,D=e.range(9.85,9.95),Y=e.range(.75,.95),f0=e()<.5?2:3,u0=e()*Q,p0=e.range(3,5),r0=(e()<.5?-1:1)*Q*p0/G,J=e()*Q;let e0=0;for(let p=0;p<3;p++){const g=e.range(2.4,3),F=e(),y=p%2?-.2:.2,M=p%2?.2:-.2,T=J-Math.sign(r0)*e0*Q/G,R=[0,0];e0+=g+.9;const U=["dolphin",g,2.7,L0((V,H)=>{te(V/Q*G,K,W,R),H[2]=L+R[1],H[0]=o.x(H[2])+D+y+R[0],H[1]=o.y(H[2])-t0+M+Y*Math.sin(V*f0+u0)},r0,T,{size:g/2.7,maxCurve:.3,pitch:1,bank:1.2,rollA:.12,swim:1,hz:1.2,fhz:.5,e:.12}),{seed:F,reach:g*.18,big:.3,lead:p===0}];p<2?f.push(U):N===3&&a.push(U)}s=z}{const h=[-29,19.5,11.5],d=h[0]+e.range(-3,3),z=h[1]+e.range(0,1),B=h[2]+e.range(-.3,.5),N=e.range(7.5,9),W=e.range(3.9,4.4),O=e.range(1.5,2.1),K=e()*Q,G=(e()<.5?-1:1)*Q/e.range(6.6,8.2),s0=e()*Q;for(let L=0;L<2;L++){const Z=e.range(2.4,3),t0=L*e.range(.2,.4),D=L*e.range(.2,.4),Y=s0-Math.sign(G)*L*e.range(.9,1.05),f0=(u0,p0)=>{const r0=u0-.25*Math.sin(2*u0);p0[2]=d+N*Math.sin(r0),p0[0]=z+t0+W*Math.cos(r0),p0[1]=B+D+O*Math.sin(2*r0+K)};f.push(["dolphin",Z,2.7,L0(f0,G,Y,{size:Z/2.7,maxCurve:.3,pitch:1,bank:1.2,rollA:.12,swim:1,hz:1.2,fhz:.5}),{seed:e(),reach:Z*.18,big:.3}])}}[...f,...a].slice(0,i).forEach(h=>t(...h))}const ne=n=>`
uniform vec3 arwSun; uniform float arwDark;
uniform vec4 arwB0[${n}]; uniform vec4 arwB1[${n}]; uniform vec4 arwB2[${n}]; uniform vec4 arwB3[${n}]; uniform vec4 arwC[${n}];
// soft cover (x) and distance along the ray (y) of one ellipsoid (centre c, unit axes d and r, half sizes s) for a ray p + v t
vec2 arwEll(vec3 p, vec3 v, vec3 c, vec3 d, vec3 r, vec3 s, float soft){
  vec3 q = p - c, u = cross(d, r);
  vec3 ql = vec3(dot(q, d), dot(q, r), dot(q, u)) / max(s, vec3(.01)), vl = vec3(dot(v, d), dot(v, r), dot(v, u)) / max(s, vec3(.01));
  float t = -dot(ql, vl) / max(dot(vl, vl), 1e-6);
  vec3 m = ql + vl * max(t, 0.);
  return vec2((1. - smoothstep(1. - soft, 1. + soft, sqrt(max(dot(m, m), 0.)))) * step(0., t), t);
}
float arwShade(vec3 wp){
  float sh = 1.;
  for(int i = 0; i < ${n}; i++){
    vec4 b0 = arwB0[i], b1 = arwB1[i], b2 = arwB2[i], b3 = arwB3[i];
    vec3 q = b0.xyz - wp; float along = dot(q, arwSun); vec3 off = q - arwSun * along;
    float rr = b0.w * 1.4 + 3., near = step(0., along) * step(dot(off, off), rr * rr) * step(.001, b2.w);
    if(near < .5) continue;
    float soft = clamp(.2 + along * .004, .2, .6);
    vec3 u = cross(b1.xyz, b2.xyz);
    float k = arwEll(wp, arwSun, b0.xyz + b1.xyz * b0.w * .2, b1.xyz, b2.xyz, vec3(b0.w * .8, b1.w, b1.w), soft).x;
    k = max(k, arwEll(wp, arwSun, b0.xyz - b1.xyz * b0.w * .5, b1.xyz, b2.xyz, vec3(b0.w * .5, b1.w * .42, b1.w * .55), soft).x);
    k = max(k, arwEll(wp, arwSun, b0.xyz - b1.xyz * b0.w * .93, b1.xyz, b2.xyz, vec3(b0.w * .14, b3.x, b1.w * .4), soft).x);
    k = max(k, arwEll(wp, arwSun, b0.xyz + b1.xyz * b3.z - u * b1.w * .6, b1.xyz, b2.xyz, vec3(b0.w * .17, b3.y, b1.w * .45), soft).x);
    sh *= 1. - k * near * b2.w * arwDark;
  }
  return sh;
}
vec4 arwMirror(vec3 wp, vec3 rd){
  vec4 res = vec4(0.); float best = 1e9;
  for(int i = 0; i < ${n}; i++){
    vec4 b0 = arwB0[i], b1 = arwB1[i], b2 = arwB2[i], b3 = arwB3[i], cc = arwC[i];
    vec3 qb = b0.xyz - wp; float tq = dot(qb, rd); vec3 ob = qb - rd * tq; float rq = b0.w * 1.3 + 1.;
    if(tq < 0. || dot(ob, ob) > rq * rq || b2.w < .001) continue;
    vec3 u = cross(b1.xyz, b2.xyz);
    vec2 k = arwEll(wp, rd, b0.xyz, b1.xyz, b2.xyz, vec3(b0.w, b1.w, b1.w), .32);
    vec2 f = arwEll(wp, rd, b0.xyz + b1.xyz * b3.z - u * b1.w * .6, b1.xyz, b2.xyz, vec3(b0.w * .17, b3.y, b1.w * .45), .32);
    float cov = max(k.x, f.x), take = step(k.y, best) * step(.02, cov) * step(.001, b2.w);
    vec3 col = mix(cc.rgb * cc.w, cc.rgb, k.x * k.x);
    res = mix(res, vec4(col, cov * b2.w), take); best = mix(best, k.y, take);
  }
  return res;
}
float arwStir(vec3 wp){
  float s = 0.;
  for(int i = 0; i < ${n}; i++){
    vec4 b0 = arwB0[i], b1 = arwB1[i];
    vec3 q = wp - b0.xyz; float rs = b0.w * 5.5 + b1.w * 2.2 + 3.;
    if(dot(q, q) > rs * rs) continue;
    float al = clamp(-dot(q, b1.xyz), -b0.w, b0.w * 5.);
    vec3 off = q + b1.xyz * al; float rad = b1.w * 2.2 + 2.5 + max(al, 0.) * .25;
    float k = (1. - smoothstep(rad * .4, rad, length(off))) * (1. - smoothstep(b0.w * 2., b0.w * 5., al));
    s = max(s, k * arwB2[i].w * arwB3[i].w);
  }
  return clamp(s, 0., 1.);
}
`,_0=`
uniform vec4 uE0[24]; uniform vec4 uE1[24]; uniform float uTime;
uniform vec3 uSun, uSunCol, uSkyCol, uFogCol; uniform vec2 uFog;
`,ae=_0+`
attribute vec4 aL; varying vec3 vC; varying vec3 vW;
void main(){
  int id = int(aL.x + .5); vec4 e0 = uE0[id], e1 = uE1[id];
  float calm = step(e1.w, 0.), wl = abs(e1.w);
  float life = fract(uTime * (.05 + .03 * aL.y) * (1. - .55 * calm) + aL.z), r7 = fract(aL.y * 7.3), r3 = fract(aL.y * 3.1);
  vec3 dir = e1.xyz, side = normalize(cross(dir, vec3(0., 1., 0.)) + vec3(1e-4, 0., 1e-4)), up = cross(side, dir);
  float ang = aL.y * 61. + (uTime * (.8 + aL.y) * (1. - .72 * calm) + life * 5.) * (r3 > .5 ? 1. : -1.);
  float rad = mix((.3 + .7 * r7) * (e0.w * .3 + 1.) * (.5 + life), e0.w * .22 + 1.2 + 2.6 * r7, calm);
  vec3 c = e0.xyz - dir * (e0.w * (.7 + .5 * r3) * (1. - calm) + (life - .5 * calm) * wl) + (side * cos(ang) + up * sin(ang)) * rad;
  c.y -= life * life * 2.6 * (1. - calm);
  float ta = uTime * (1.6 + 3. * aL.y) + aL.z * 40.;
  vec3 ax = normalize(vec3(sin(aL.y * 20.), .5, cos(aL.y * 31.)));
  vec3 lx = normalize(cross(ax, vec3(.1, 1., .2))), ly = cross(ax, lx), a1 = lx * cos(ta) + ly * sin(ta);
  float sc = aL.w * smoothstep(0., .08, life) * (1. - smoothstep(.82, 1., life)) * step(.01, e0.w);
  vec3 w = c + (a1 * position.x + ax * position.y) * sc;
  vec3 n = normalize(cross(a1, ax));
  vec3 leaf = mix(vec3(.1, .2, .05), vec3(.66, .44, .08), smoothstep(.3, .8, r7));
  vC = leaf * (uSkyCol * .9 + uSunCol * (.3 + .7 * abs(dot(n, uSun)))); vW = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}
`,se=`
uniform vec3 uFogCol; uniform vec2 uFog; varying vec3 vC; varying vec3 vW;
void main(){ float fd = length(cameraPosition - vW); gl_FragColor = vec4(mix(vC, uFogCol, smoothstep(uFog.x, uFog.y, fd) * .9), 1.); }
`,re=_0+`
attribute vec4 aM; varying vec2 vUv; varying vec3 vW, vF; varying float vK;
void main(){
  int id = int(aM.x + .5); vec4 e0 = uE0[id], e1 = uE1[id];
  float s = position.x, hand = aM.y;
  vec3 dir = e1.xyz, side = normalize(cross(dir, vec3(0., 1., 0.)) + vec3(1e-4, 0., 1e-4)), up = cross(side, dir);
  vec3 across = hand < 0. ? side : up, facing = hand < 0. ? up : side;
  float wide = e0.w * (.16 + .34 * s);
  vec3 c = e0.xyz - dir * (e0.w * 1.02 + s * e0.w * 1.8) + facing * sin(s * 4. - uTime * .7 + aM.z) * e0.w * .07 * s;
  vec3 w = c + across * position.y * wide;
  vUv = vec2(s, position.y); vW = w; vF = facing; vK = step(.01, e0.w) * aM.w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.);
}
`,ce=`
uniform vec3 uSkyCol, uSunCol, uFogCol; uniform vec2 uFog; uniform float uTime; varying vec2 vUv; varying vec3 vW, vF; varying float vK;
void main(){
  float y = clamp(abs(vUv.y), 0., 1.), e = 1. - y * y; e *= e;
  float along = smoothstep(0., .22, vUv.x) * (1. - smoothstep(.3, 1., vUv.x));
  float uneven = .62 + .38 * sin(vUv.x * 7. + vUv.y * 2.3 - uTime * .5 + vK * 9.);
  vec3 toEye = cameraPosition - vW; float fd = length(toEye), face = smoothstep(.06, .45, abs(dot(normalize(vF), toEye / max(fd, 1e-3))));
  float a = e * along * uneven * .13 * vK * face * (1. - smoothstep(uFog.x, uFog.y * .5, fd));
  gl_FragColor = vec4((uFogCol * .9 + uSkyCol * .35 + uSunCol * .1), a);
}
`,le=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.); }
`,ie=`
varying vec2 vUv;
void main(){ gl_FragColor = vec4(0., 0., 0., .5 * (1. - smoothstep(0., 1., length(vUv)))); }
`,P0=(n,e)=>n==null?new S.Color(e):n.isColor?n.clone():Array.isArray(n)?new S.Color(n[0],n[1],n[2]):new S.Color(n),he=(n,e)=>n==null?new S.Vector3(e[0],e[1],e[2]):n.isVector3?n.clone():new S.Vector3(n[0]??n.x,n[1]??n.y,n[2]??n.z),fe=[[150,240,-40,160],[35,115,-40,130],[-96,-8,-40,170],[-262,-240,-26,22],[240,700,-40,120]],ue=[[150,700,26,120],[60,150,26,180],[22,60,26,45],[-50,-8,40,150],[-96,-50,26,200],[-222,-130,26,20],[-262,-240,26,24]];async function ve(n,e={}){const t=e.env||{},o=n.core,i=new S.Group,c=o.makeRng(o.hashSeed("arw-animals-skins:"+n.seed)),l=o.makeRng(o.hashSeed("arw-animals-leaves:"+n.seed)),u=o.makeRng(o.hashSeed("arw-animals-eddy:"+n.seed)),m=he(t.sunDir,[-.608,.156,-.778]).normalize(),f=n.quality?.detail??1,a=n.vary?.density??1,v=Math.max(8,Math.min(14,Math.round(12*(.6+.4*f)*(.85+.3*(typeof a=="number"?a:1))))),{bodies:r,R:w}=ee(o,n.seed,e.path,e.timeAt,{dolphins:v,arch:e.arch,trees:e.trees}),s=(t.sunBlocks||(m.x<0?fe:ue)).slice(0,8),h=[];for(let b=0;b<8;b++){const k=s[b]||[0,0,0,-1e4];h.push(new S.Vector4(k[0],k[1],k[2],k[3]))}const d={uSun:{value:m},uSunCol:{value:P0(t.sunColor,"#ffb070")},uSkyCol:{value:P0(t.skyColor,"#8fa3c8")},uGroundCol:{value:P0(t.groundColor,"#8a7c74")},uFogCol:{value:P0(t.fogColor,"#b9a9a6")},uFog:{value:new S.Vector2(t.fogNear??120,t.fogFar??900)},uBlk:{value:h},uRare:{value:n.vary?.rare?1:0},uTime:{value:0}},z=[],B={},N=[];let W=0,O=0;for(let b=0;b<R0.length;b++){const k=R0[b],E=V0[k],x=r.filter(I=>I.kind===k);if(!x.length)continue;await n.yield();const q=E.geo(c),A=x.length,P=new S.InstancedBufferGeometry;for(const I of["position","normal","color","aAnim","aPivot"])P.setAttribute(I,q.geo.attributes[I]);P.setIndex(q.geo.index);const C=new Float32Array(A*4);x.forEach((I,n0)=>{I.slot=n0,I.G=q,C.set([n0,I.seed,I.variant,k==="humpback"?c():0],n0*4)}),P.setAttribute("iA",new S.InstancedBufferAttribute(C,4)),P.instanceCount=A;const j=()=>{const I=[];for(let n0=0;n0<A;n0++)I.push(new S.Vector4(0,-500,0,0));return I},l0={...d,uPos:{value:j()},uRot:{value:j()},uMisc:{value:j()},uLen:{value:q.L},uFlk:{value:E.flk},uFinTall:{value:k==="orca"?.95:0},uSwim:{value:new S.Vector4(...E.swim)},uFin:{value:new S.Vector4(...E.fin)},uTop:{value:new S.Color(E.top)},uBel:{value:new S.Color(E.bel)},uEye:{value:new S.Vector3(Math.abs(q.eye[0]),q.eye[1],q.eye[2])},uWet:{value:E.wet},uCap:{value:new S.Vector3(...E.cap||[40,40,40])}},b0=new S.ShaderMaterial({uniforms:l0,vertexShader:Q0,fragmentShader:J0+z0[k]+X0,defines:{NB:A},side:S.DoubleSide,vertexColors:!0});b0.extensions={derivatives:!0};const a0=new S.Mesh(P,b0);a0.frustumCulled=!1,a0.name="arw-"+k,i.add(a0),z.push(a0),B[k]={list:x,u:l0,G:q,K:E},W+=q.tris*A,O++}await n.yield();const K=[];r.forEach((b,k)=>{K.length<16&&(b.kind==="humpback"&&!b.variant||b.kind==="blue"||b.kind==="orca"&&b.variant||b.kind==="dolphin"&&b.lead)&&K.push(k)}),r.forEach((b,k)=>{K.length<22&&b.kind==="sperm"&&K.push(k)});const G={...d,uE0:{value:Array.from({length:24},()=>new S.Vector4(0,-900,0,0))},uE1:{value:Array.from({length:24},()=>new S.Vector4(0,0,1,1))},uTime:{value:0}},s0=new S.Vector3(w.x(-130)-w.x(-96),w.y(-130)-w.y(-96),-34).normalize();G.uE0.value[22].set((w.x(-130)+w.x(-96))/2,(w.y(-130)+w.y(-96))/2,-113,15),G.uE1.value[22].set(s0.x,s0.y,s0.z,-34);{const b=[[0,-.5],[.42,-.18],[.24,.05],[.4,.34],[.12,.26],[0,.55],[-.12,.26],[-.4,.34],[-.24,.05],[-.42,-.18]],k=[0,0,0],E=[];b.forEach((I,n0)=>{k.push(I[0],I[1],0),E.push(0,n0+1,(n0+1)%b.length+1)});const x=new S.InstancedBufferGeometry;x.setAttribute("position",new S.Float32BufferAttribute(k,3)),x.setIndex(E);const q=[];K.forEach((I,n0)=>{const y0=r[I],N0=Math.round((y0.kind==="blue"?40:y0.kind==="humpback"?32:y0.kind==="dolphin"?18:y0.kind==="sperm"?30:14)*(.5+.5*f));for(let T0=0;T0<N0;T0++)q.push(n0,l(),l(),l.range(.2,.33))});for(let I=0,n0=Math.round(120*(.5+.5*f));I<n0;I++)q.push(22,u(),u(),u.range(.17,.27));x.setAttribute("aL",new S.InstancedBufferAttribute(new Float32Array(q),4)),x.instanceCount=q.length/4;const A=new S.Mesh(x,new S.ShaderMaterial({uniforms:G,vertexShader:ae,fragmentShader:se,side:S.DoubleSide}));A.frustumCulled=!1,A.name="arw-leaves",i.add(A),W+=b.length*x.instanceCount,O++;const P=24,C=[],j=[];for(let I=0;I<=P;I++)C.push(I/P,-1,0,I/P,1,0),I<P&&j.push(I*2,I*2+1,I*2+2,I*2+1,I*2+3,I*2+2);const l0=new S.InstancedBufferGeometry;l0.setAttribute("position",new S.Float32BufferAttribute(C,3)),l0.setIndex(j);const b0=[];K.forEach((I,n0)=>{const y0=r[I];if(y0.kind==="humpback"||y0.kind==="blue")for(const N0 of[-1,1])b0.push(n0,N0,l()*Q,l.range(.7,1))}),l0.setAttribute("aM",new S.InstancedBufferAttribute(new Float32Array(b0),4)),l0.instanceCount=b0.length/4;const a0=new S.Mesh(l0,new S.ShaderMaterial({uniforms:G,vertexShader:re,fragmentShader:ce,side:S.DoubleSide,transparent:!0,depthWrite:!1}));a0.frustumCulled=!1,a0.renderOrder=3,a0.name="arw-mist",i.add(a0),W+=P*2*l0.instanceCount,O++}{const b=[],k=[],E=[];for(const A of r){if(A.pool==null)continue;const P=1.5*2*A.G.rb*A.L,C=b.length/3;for(const j of[[-1,-1],[1,-1],[1,1],[-1,1]])b.push(A.home[0]+j[0]*P,A.pool,A.home[2]+j[1]*P),k.push(j[0],j[1]);E.push(C,C+2,C+1,C,C+3,C+2)}const x=new S.BufferGeometry;x.setAttribute("position",new S.Float32BufferAttribute(b,3)),x.setAttribute("uv",new S.Float32BufferAttribute(k,2)),x.setIndex(E);const q=new S.Mesh(x,new S.ShaderMaterial({vertexShader:le,fragmentShader:ie,side:S.DoubleSide,transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:-1}));q.renderOrder=-1,q.name="arw-pools",i.add(q),W+=E.length/3,O++}const L=r.map((b,k)=>k).filter(b=>r[b].kind!=="dolphin"),Z=L.length,t0=()=>{const b=[];for(let k=0;k<Z;k++)b.push(new S.Vector4(0,-900,0,0));return b},D={arwSun:{value:m},arwDark:{value:.62},arwB0:{value:t0()},arwB1:{value:t0()},arwB2:{value:t0()},arwB3:{value:t0()},arwC:{value:t0()}},Y=d.uGroundCol.value,f0=d.uSkyCol.value,u0={},p0={humpback:.22,blue:.6,sperm:.5,orca:.12,dolphin:.5};for(const b of R0){const k=new S.Color(V0[b].bel);u0[b]=[k.r*(Y.r*.9+f0.r*.25),k.g*(Y.g*.9+f0.g*.25),k.b*(Y.b*.9+f0.b*.25),p0[b]]}const r0=r.map(()=>({x:0,y:0,z:0,yaw:0,pitch:0,roll:0,curve:0,phase:0,fphase:0,swim:1,fade:1,d:0})),J=new S.Vector3,e0=new S.Vector3,p=new S.Vector3,g=b=>{const k=Math.cos(b.yaw),E=Math.sin(b.yaw),x=Math.cos(b.pitch),q=Math.sin(b.pitch),A=Math.cos(b.roll),P=Math.sin(b.roll);e0.set(E*x,q,k*x);const C=A,j=P;p.set(C*k+-j*q*E,j*x,-C*E+-j*q*k)};function F(b,k,E){const x=k;E?E.getWorldPosition(J):J.set(w.xs[0],w.ys[0],w.zs[0]);const q=w.t(J.z);for(let A=0;A<r.length;A++){const P=r[A],C=r0[A],j=B[P.kind];P.at(q,x,C),j.u.uPos.value[P.slot].set(C.x,C.y,C.z,C.phase),j.u.uRot.value[P.slot].set(C.yaw,C.pitch,C.roll,C.curve),j.u.uMisc.value[P.slot].set(C.fade,C.swim,C.fphase,P.size*(.02+.98*_(0,.25,C.fade)))}G.uTime.value=x,d.uTime.value=x;for(let A=0;A<K.length;A++){const P=r[K[A]],C=r0[K[A]];g(C),G.uE0.value[A].set(C.x,C.y,C.z,C.fade>.02?P.L*.5:0),G.uE1.value[A].set(e0.x,e0.y,e0.z,P.kind==="dolphin"?5:P.kind==="sperm"?-P.L*.9:P.L*1.5)}for(let A=0;A<Z;A++){const P=L[A],C=r[P],j=r0[P],l0=C.L*.5,b0=C.G.rb*C.L;g(j),D.arwB0.value[A].set(j.x,j.y,j.z,l0),D.arwB1.value[A].set(e0.x,e0.y,e0.z,b0),D.arwB2.value[A].set(p.x,p.y,p.z,j.fade),D.arwB3.value[A].set(C.G.fl*C.L,C.G.fp*C.L,C.G.pz*C.L,C.big);const a0=u0[C.kind];D.arwC.value[A].set(a0[0],a0[1],a0[2],a0[3])}}const y=(b,k,E)=>{g(k);const x=b.G.eye,q=b.L;return[k.x+e0.x*x[2]*q+p.x*Math.abs(x[0])*q,k.y+x[1]*q+e0.y*x[2]*q,k.z+e0.z*x[2]*q+p.z*Math.abs(x[0])*q]},M={...r0[0]},T=(b,k)=>(E,x)=>(r[b].at(E,x??null,M),k?y(r[b],M):[M.x,M.y,M.z]),R=b=>r.findIndex(k=>k.kind===b),$=b=>{const k=r.filter(x=>x.kind===b),E=[0,0,0];return k.forEach(x=>{for(let q=0;q<3;q++)E[q]+=x.home[q]/k.length}),E},U={on:[8,22],off:[45,75],far:60,rest:.05},V=r.filter(b=>b.kind==="humpback"),H=[0,0,0],v0=(b,k)=>{const E=w.m(w.zAt(b));let x=U.rest;w.at(E+U.far,H);const q=[H[0]*x,H[1]*x,H[2]*x];for(const A of V){A.at(b,k??null,M);const P=w.m(M.z)-E,C=_(U.on[0],U.on[1],P)*(1-_(U.off[0],U.off[1],P));q[0]+=M.x*C,q[1]+=M.y*C,q[2]+=M.z*C,x+=C}return[q[0]/x,q[1]/x,q[2]/x]},o0={mother:T(R("humpback"),!0),blue:T(R("blue")),sleepers:$("sperm"),orcas:T(R("orca")),podAhead:v0};return F(0,0,null),{object:i,glsl:ne(Z),uniforms:D,shadowCasters:N,anchors:o0,update:F,dispose(){},triangles:W,drawCalls:O,bodies:r,route:w}}export{ee as arwCourses,ve as buildAnimals};
