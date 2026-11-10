import*as T from"three";const z=N=>new T.Color(N);class f0{constructor(){this.p=[],this.n=[],this.c=[],this.k=[],this.kind=2,this.th=0}tri(p,d,y,x){const g=d[0]-p[0],C=d[1]-p[1],a=d[2]-p[2],v=y[0]-p[0],M=y[1]-p[1],P=y[2]-p[2];let b=C*P-a*M,l=a*v-g*P,F=g*M-C*v;const f=Math.hypot(b,l,F)||1;b/=f,l/=f,F/=f,this.p.push(p[0],p[1],p[2],d[0],d[1],d[2],y[0],y[1],y[2]);for(let t=0;t<3;t++)this.n.push(b,l,F),this.c.push(x.r,x.g,x.b),this.k.push(this.kind,this.th)}quad(p,d,y,x,g){this.tri(p,d,y,g),this.tri(p,y,x,g)}box(p,d,y,x,g,C,a,v=0){const M=x/2,P=g/2,b=C/2,l=Math.cos(v),F=Math.sin(v),f=(i,n,u)=>[p+i*l+u*F,d+n,y-i*F+u*l],t=[f(-M,-P,-b),f(M,-P,-b),f(M,P,-b),f(-M,P,-b),f(-M,-P,b),f(M,-P,b),f(M,P,b),f(-M,P,b)];this.quad(t[4],t[5],t[6],t[7],a),this.quad(t[1],t[0],t[3],t[2],a),this.quad(t[5],t[1],t[2],t[6],a),this.quad(t[0],t[4],t[7],t[3],a),this.quad(t[7],t[6],t[2],t[3],a),this.quad(t[0],t[1],t[5],t[4],a)}beam(p,d,y,x,g=y){let C=d[0]-p[0],a=d[1]-p[1],v=d[2]-p[2];const M=Math.hypot(C,a,v)||1;C/=M,a/=M,v/=M;let P,b,l;Math.abs(a)>.9?(P=0,b=v,l=-a):(P=-v,b=0,l=C);const F=Math.hypot(P,b,l)||1;P/=F,b/=F,l/=F;const f=b*v-l*a,t=l*C-P*v,i=P*a-b*C,n=(u,h,S)=>[u[0]+P*y*h+f*g*S,u[1]+b*y*h+t*g*S,u[2]+l*y*h+i*g*S];for(const[u,h,S,e]of[[-1,-1,1,-1],[1,-1,1,1],[1,1,-1,1],[-1,1,-1,-1]])this.quad(n(p,u,h),n(p,S,e),n(d,S,e),n(d,u,h),x);this.quad(n(p,-1,-1),n(p,1,-1),n(p,1,1),n(p,-1,1),x),this.quad(n(d,-1,-1),n(d,1,-1),n(d,1,1),n(d,-1,1),x)}prism(p,d,y,x,g,C,a=0,v=0,M=!0,P=0){for(let b=0;b<p;b++){const l=P+b/p*Math.PI*2,F=P+(b+1)/p*Math.PI*2,f=[a+d*Math.cos(l),x,v+d*Math.sin(l)],t=[a+d*Math.cos(F),x,v+d*Math.sin(F)],i=[a+y*Math.cos(l),g,v+y*Math.sin(l)],n=[a+y*Math.cos(F),g,v+y*Math.sin(F)];this.quad(f,i,n,t,C),M&&(this.tri([a,g,v],n,i,C),this.tri([a,x,v],f,t,C))}}pen(p,d,y,x,g,C,a=.45,v=4,M=0){for(let P=0;P<v;P++){const b=P/v,l=(P+1)/v,F=g*(1-a*b),f=g*(1-a*l),t=[[d-F,M+b*x],[d-f,M+l*x],[d+f,M+l*x],[d+F,M+b*x]];for(const i of[0,1,2,0,2,3])this.p.push(p,t[i][0],y),this.n.push(1,0,0),this.c.push(C.r,C.g,C.b),this.k.push(3,t[i][1])}}build(){const p=new T.BufferGeometry,d=new T.Float32BufferAttribute(this.c,3);return p.setAttribute("position",new T.Float32BufferAttribute(this.p,3)),p.setAttribute("normal",new T.Float32BufferAttribute(this.n,3)),p.setAttribute("color",d),p.setAttribute("aCol",d),p.setAttribute("aK",new T.Float32BufferAttribute(this.k,2)),p}async buildAsync(p){const d=new T.BufferGeometry,y=new T.Float32BufferAttribute(this.c,3);return await p(),d.setAttribute("position",new T.Float32BufferAttribute(this.p,3)),await p(),d.setAttribute("normal",new T.Float32BufferAttribute(this.n,3)),await p(),d.setAttribute("color",y),d.setAttribute("aCol",y),d.setAttribute("aK",new T.Float32BufferAttribute(this.k,2)),await p(),d}}const n0=z("#5e4c3a"),I0=z("#8d8a84"),y0=z("#d0481a"),X=z("#ffffff"),d0=z("#3d3226"),g0=z("#c9a05a");function L0({post:N=!0,sx:p=2,sy:d=6,spokes:y=!0,frame:x=n0,lamps:g=0,rich:C=!1,lite:a=!1,lampCap:v=!0,rings:M=[0,1],masts:P=!0,foot:b=!0}={}){const l=new f0;l.kind=0;for(let f=0;f<8;f++){l.th=f*Math.PI/4;for(let t=0;t<p;t++)for(let i=0;i<d;i++){const n=t/p-.5,u=(t+1)/p-.5,h=i/d,S=(i+1)/d;l.quad([n,h,0],[u,h,0],[u,S,0],[n,S,0],X)}}l.kind=1,l.th=0;const F=2*Math.sin(Math.PI/8);for(let f=0;f<8;f++){const t=f*Math.PI/4,i=t+Math.PI/8,n=Math.cos(t),u=Math.sin(t);if(a){const h=t+Math.PI/4,S=Math.cos(h),e=Math.sin(h),m=.022;P&&l.quad([n*(1-m),-.01,u*(1-m)],[n*(1+m),-.01,u*(1+m)],[n*(1+m),1.01,u*(1+m)],[n*(1-m),1.01,u*(1-m)],x),P&&l.quad([n+u*m,-.01,u-n*m],[n-u*m,-.01,u+n*m],[n-u*m,1.01,u+n*m],[n+u*m,1.01,u-n*m],x);for(const L of M)l.quad([n,L-.022,u],[S,L-.022,e],[S,L+.022,e],[n,L+.022,u],x)}else l.box(n,.5,u,.03,1.02,.03,x);for(const h of[0,1])y&&l.box(Math.cos(i)*Math.cos(Math.PI/8),h,Math.sin(i)*Math.cos(Math.PI/8),F,.022,.028,x,-(i+Math.PI/2)),y&&l.box(n/2,h,u/2,1,.018,.022,x,-t);if(C){const h=t+Math.PI/4;l.beam([n,.1,u],[Math.cos(h),.52,Math.sin(h)],.006,d0),l.beam([n,1,u],[0,1.2,0],.006,d0)}}if(C){l.prism(8,.17,.17,-.25,-.22,x),l.prism(8,.17,.17,-.07,-.04,x);for(let f=0;f<8;f++)l.box(Math.cos(f*Math.PI/4)*.14,-.145,Math.sin(f*Math.PI/4)*.14,.022,.17,.022,g0);for(let f=0;f<4;f++)l.box(Math.cos(f*Math.PI/2)*.3,-.03,Math.sin(f*Math.PI/2)*.3,.6,.02,.03,x,-f*Math.PI/2)}l.th=7;for(let f=0;f<g;f++){const t=(f+.5)*Math.PI*2/g;g>2?(l.prism(6,.02,.026,.012,.05,g0,Math.cos(t),Math.sin(t),!0),l.prism(6,.032,.006,.05,.062,x,Math.cos(t),Math.sin(t),!1)):l.prism(4,.045,.045,0,.085,g0,Math.cos(t),Math.sin(t),v)}if(N&&(l.kind=2,l.th=4,b&&l.prism(y?8:4,2.6,2.1,0,1.3,I0,0,0,y),l.th=0,l.prism(y?6:4,.3,.24,1.3,16.2,n0,0,0,!1),l.pen(0,16,0,3.2,.34,y0,.5,y?4:1),C)){for(const e of[4.2,9.5,13.6])l.prism(6,.36,.36,e,e+.22,z("#2c2c30"),0,0,!1);const f=[-6.6,.15,3.6],t=[-1.3,2.5,.8];l.th=6,l.beam(f,t,.42,z("#6b543a"),.07);const i=t[0]-f[0],n=t[2]-f[2],u=Math.hypot(i,n),h=-n/u*.42,S=i/u*.42;l.beam([f[0]+h,f[1]+.2,f[2]+S],[t[0]+h,t[1]+.2,t[2]+S],.04,n0,.2),l.beam([f[0]-h,f[1]+.2,f[2]-S],[t[0]-h,t[1]+.2,t[2]-S],.04,n0,.2);for(const e of[.45,.92]){const m=f[0]+i*e,L=f[1]+(t[1]-f[1])*e,E=f[2]+n*e;l.beam([m+h*1.3,0,E+S*1.3],[m+h*.9,L+.5,E+S*.9],.07,n0),l.beam([m-h*1.3,0,E-S*1.3],[m-h*.9,L+.5,E-S*.9],.07,n0)}l.box(-.4,2.05,.3,2.4,.5,1,z("#6b543a"),.5),l.th=9,l.box(-.4,2.27,.3,2.1,.08,.7,z("#cfe0e6"),.5),l.beam([-.3,2.3,.2],[0,4.6,0],.05,n0),l.kind=6;for(let e=0;e<9;e++)l.th=e/9,l.box(0,.26,0,.12,.44,.74,z("#3f3122"),Math.atan2(-n,i));l.kind=7;for(let e=0;e<4;e++)l.th=e/4,l.box(e%2*.24-.12,0,e>1?.2:-.2,.16,.5,.16,X);l.kind=2,l.th=0}return l.build()}function E0({sx:N=2,sy:p=6,cargo:d=!0,mast:y=13.6,boom:x=2.75,fold:g=!1,image:C=!1}={}){const a=new f0,v=z("#4f3d2b"),M=z("#6e563a"),P=z("#2b241e"),b=z("#8a6f4c"),l=z("#b8965c"),F=z("#F3EFE6").multiplyScalar(.8),f=[[-11,.55,.95,2.45],[-8.2,1.85,.05,1.6],[-3,2.3,-.15,1.25],[3,2.3,-.15,1.25],[8.2,1.85,.05,1.6],[11,.6,1.05,2.6]];a.kind=2;for(let i=0;i<5;i++){const[n,u,h,S]=f[i],[e,m,L,E]=f[i+1];for(const R of[-1,1]){const q=h+(S-h)*.45,k=L+(E-L)*.45;a.th=0,a.quad([n,h,R*u*.72],[e,L,R*m*.72],[e,k,R*m],[n,q,R*u],P),a.th=6,a.quad([n,q,R*u],[e,k,R*m],[e,E,R*m*1.04],[n,S,R*u*1.04],v),a.th=0,a.quad([n,S,R*u*1.04],[e,E,R*m*1.04],[e,E,R*m*.86],[n,S,R*u*.86],M)}a.th=6,a.quad([n,S-.28,-u*.9],[e,E-.28,-m*.9],[e,E-.28,m*.9],[n,S-.28,u*.9],b),a.th=0,a.quad([n,h,-u*.72],[e,L,-m*.72],[e,L,m*.72],[n,h,u*.72],P)}for(const i of[0,5]){const[n,u,h,S]=f[i];a.quad([n,h,-u*.72],[n,h,u*.72],[n,S,u*1.04],[n,S,-u*1.04],M)}d&&(a.th=8,a.quad([-6.4,1,-1.7],[1.2,1,-1.7],[.6,2.25,0],[-5.8,2.25,0],l),a.quad([-6.4,1,1.7],[1.2,1,1.7],[.6,2.25,0],[-5.8,2.25,0],l),a.tri([-6.4,1,-1.7],[-6.4,1,1.7],[-5.8,2.25,0],l),a.th=0,a.quad([1.2,1,-1.7],[3.4,1,-1.5],[2.6,1.95,0],[.6,2.25,0],F),a.quad([1.2,1,1.7],[3.4,1,1.5],[2.6,1.95,0],[.6,2.25,0],F),a.tri([3.4,1,-1.5],[3.4,1,1.5],[2.6,1.95,0],F)),a.th=6,a.box(7.3,1.95,0,2.6,1.3,2.9,M),a.th=8;for(let i=0;i<4;i++){const n=-1+i*.5,u=n+.5,h=e=>2.6+.55*(1-e*e),S=e=>e*1.65;a.quad([5.8,h(n),S(n)],[8.8,h(n),S(n)],[8.8,h(u),S(u)],[5.8,h(u),S(u)],l)}a.th=0;const t=y>8;if(g&&!C&&(a.kind=2.125,a.prism(4,.34,.3,1.95,2.5,z("#50556a"),9.7,.3,!1,.6),a.prism(4,.3,.24,2.5,3.2,z("#4668a4"),9.7,.3,!1,.6),a.prism(6,.62,.07,3.22,3.56,z("#d8b872"),9.7,.3,!1),a.kind=2),g&&(a.kind=2.25),a.beam([-1.6,1,0],[-1.6,y,0],t?.16:.12,v),g&&(a.kind=2.4),a.beam([t?-5.4:-3.6,y-(t?1.3:.75),.12],[t?5.6:3.7,y-.1-(t?0:.3),.12],.09,M),a.kind=2,a.beam([t?-5.2:-3.5,x,.12],[t?5.4:3.6,x,.12],.08,M),a.beam([9.6,2.5,.5],[14.2,.1,1.6],.07,M),g&&(a.kind=2.25),a.beam([-1.6,y-.2,0],[-10.6,2.5,0],.035,d0),a.beam([-1.6,y-.2,0],[10.6,2.6,0],.035,d0),a.kind=2,g&&!C){a.kind=2.45;for(const[n,u]of[[5.4,x],[5.45,x+3.4],[5.5,x+6.8]])a.quad([n,u-.045,.12],[n,u+.045,.12],[10.4,2.75,.2],[10.4,2.66,.2],d0);a.kind=9,a.th=14;const i=(n,u,h,S,e,m,L)=>{for(let E=0;E<e;E++){const R=E/e,q=(E+1)/e,k=(_,a0)=>{const V=h+(S-h)*_,l0=u[0]-n[0],h0=u[1]-n[1],u0=Math.hypot(l0,h0);return[n[0]+l0*_-h0/u0*V*a0,0,n[1]+h0*_+l0/u0*V*a0]},j=k(R,-1),Y=k(R,1),W=k(q,-1),U=k(q,1),J=m+(L-m)*R,e0=m+(L-m)*q;for(const[_,a0,V]of[[j,0,J],[Y,1,J],[U,1,e0],[j,0,J],[U,1,e0],[W,0,e0]])a.p.push(_[0],_[1],_[2]),a.n.push(0,1,0),a.c.push(a0,V,0),a.k.push(9,14)}};for(const n of[-1,1])i([-9.8,n*1.5],[15.5,n*3.6],.45,1.25,3,0,1);i([10.2,0],[31,0],1.5,2.5,3,.1,1),a.kind=2,a.th=0}{const i=a.k.length;if(a.pen(-1.6,y+.3,0,2.2,.26,y0,.5,3),g)for(let n=i;n<a.k.length;n+=2)a.k[n]=3.25}if(g)for(let i=0;i<a.k.length;i+=2)a.k[i]===2&&(a.k[i]=2.03);a.kind=g?5.25:5,a.th=0;for(let i=0;i<N;i++)for(let n=0;n<p;n++){const u=i/N-.5,h=(i+1)/N-.5,S=n/p,e=(n+1)/p;a.quad([u,S,0],[h,S,0],[h,e,0],[u,e,0],X)}return a.build()}function W0(){return{uTime:{value:0},uU:{value:0},uDur:{value:46},uGale:{value:1},uWind:{value:new T.Vector2(0,-1)},uSun:{value:new T.Vector3(.86,.26,-.44).normalize()},uSunCol:{value:z("#FFC88A").multiplyScalar(1.1)},uSky:{value:z("#9DB9E0").multiplyScalar(.45)},uGround:{value:z("#B8906A").multiplyScalar(.4)},uFogCol:{value:z("#EDC690")},uFogDens:{value:.0011},uShadowCol:{value:z("#3D4468")},uStraw:{value:z("#E8C078").multiplyScalar(1.6)},uTan:{value:z("#C9A468")},uLamp:{value:0},uCloudK:{value:.34},uSeed:{value:0},uHarvest:{value:0},uGust0:{value:.46},uHard:{value:0},uSide:{value:.3},uCloudE:{value:new T.Vector4(.43,.62,0,1)},uBridge:{value:new T.Vector3(-14,36,12)},uRigE:{value:3},uRigW:{value:19}}}const A0=`
attribute vec2 aK; attribute vec3 aCol; attribute vec3 iPos; attribute vec4 iDim; attribute vec4 iSpin;
uniform float uTime, uU, uDur, uGale, uShadow, uPlaneY, uMirror; uniform vec3 uSun, uBridge; uniform float uRigE, uRigW; uniform vec2 uWind;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec4 vS; varying float vG; varying vec3 vL; varying float vM; varying float vDm; varying float vO; varying float vH;
void main() {
  float d = max(uU - iSpin.z, 0.0);
  vO = 1.0; vH = 0.0;
  float q = d * d / (d + 0.012);
  float e = exp(-q / 0.07);
  float G = uDur * (0.3 * q + 0.035 * (1.0 - e));
  float gust = e * smoothstep(0.0, 0.012, d);
  float ang = iSpin.x + iSpin.y * uGale * (uTime + G);
  float dir = iSpin.y < 0.0 ? -1.0 : 1.0;
  float R = iDim.x, k = aK.x, sc = R / 7.0;
  vec3 wd = vec3(uWind.x, 0.0, uWind.y), we = vec3(-uWind.y, 0.0, uWind.x);
  vec3 p; vec3 n; float mat = aK.y; float isSail = 0.0;
  // a rig that folds for the canal's bridge (the kinds with a fraction): how far the mast stands (rigM) and the sail is
  // hoisted (rigS), from where the boat is along the canal. It sails toward -x: sail down, then mast down, before the
  // arch; mast up, then sail up, beyond it
  float rigM = 1.0, rigS = 1.0, onC = step(abs(iPos.z - uBridge.y), uBridge.z);
  if (fract(k) > 0.2) {
    float cx = iPos.x - uBridge.x;
    float cf = cx > 0.0 ? cx - uRigW : -cx - uRigE;                    // metres of water between the boat and its end of the fold
    rigM = mix(1.0, smoothstep(0.0, 9.0, cf), onC);
    rigS = mix(1.0, smoothstep(6.5, 17.0, cf), onC);
  }
  float rth = (1.0 - rigM) * 1.466, rc = cos(rth), rs = sin(rth);     // the mast lies forward at 84 degrees
  // a folding build on the canal heads the way its lane runs: yw is its heading (0 along the canal), carried in iSpin.x
  // beyond pi; every part of such a boat has a fraction in its kind, or is its wake
  float yw = (fract(k) > 0.01 || k > 8.5) ? (iSpin.x - 3.14159265) * onC : 0.0;
  float yc = cos(yw), ys = sin(yw);
  if (k < 0.5 || (k > 4.5 && k < 5.5)) {
    float rr = k < 0.5 ? R : 0.0;
    float th = ang + (k < 0.5 ? aK.y : 0.0); float c = cos(th), s = sin(th);
    float b = smoothstep(-0.28, 0.28, -dir * (c * we.x + s * we.z));
    float sv = (1.0 - b) * sin(uTime * 21.0 + iSpin.w * 40.0 + position.y * 7.0 + aK.y * 3.0) * 0.11 * (1.0 + gust);
    float psi = (1.0 - b) * 1.5708 + sv;
    vec3 sp = we * cos(psi) - wd * sin(psi);
    n = vec3(-sp.z, 0.0, sp.x);
    float sw = iDim.z, sh = iDim.w * 0.86 * mix(0.045, 1.0, rigS);    // (a lowered sail lies folded on its boom, batten on batten)
    float arc = sin(3.14159 * (position.x + 0.5));
    // a canal barge's sail (cs5) is set along its own hull, as its yard and boom are: it lies under the yard in a quartering
    // wind and while the barge turns; it bellies square off that line to leeward, and is laced to the yard and the boom
    // (hardly any belly at its head and foot, the most at half height)
    float cs5 = k > 5.1 ? onC : 0.0, lee = 1.0;
    vec3 bdir = wd;
    if (cs5 > 0.5) { sp = vec3(yc, 0.0, ys); n = vec3(-ys, 0.0, yc); lee = clamp(-dot(n, wd), -1.0, 1.0); bdir = -n * lee; }
    float prof = mix(0.55 + 0.45 * sin(3.14159 * position.y), 0.05 + 0.95 * sin(3.14159 * position.y), cs5);
    // (a boat's sail anywhere else keeps the two flat cloths it always had, hinged at the mast: the rows between are laid
    // on those two planes, and the normal runs evenly from the mast to each edge)
    float two5 = k > 5.1 ? 1.0 - cs5 : 0.0;
    float bel = b * (0.17 + 0.13 * gust) * sw * mix(arc, 1.0 - 2.0 * abs(position.x), two5) * prof * rigS;
    bel *= 1.0 + 0.12 * sin(uTime * 5.0 + iSpin.w * 30.0 + aK.y * 2.0);
    p = iPos + vec3(rr * c, iDim.y + iDim.w * 0.07 + position.y * sh, rr * s) + sp * (position.x * sw) + bdir * bel;
    // its head follows the yard, which slopes up toward the stern (the yard's line in the boat's own metres, see
    // boatGeometry): each batten row is sheared in proportion to its height, so the cloth meets the yard all along it
    p.y += cs5 * position.y * (0.473 + 1.1345 * position.x - 0.2 * (1.0 - rigS)) * sc;
    if (two5 > 0.5) n = mix(n, normalize(n - sp * (sign(position.x) * b * 0.55)), 2.0 * abs(position.x));
    else n = normalize(n + sp * (cos(3.14159 * (position.x + 0.5)) * b * 0.55 * mix(1.0, prof * lee, cs5)) + vec3(0.0, cs5 * 0.55 * cos(3.14159 * position.y) * arc * lee * b, 0.0));
    // where this sail stands on its ring, seen from the sun: 1 on the sunward side, -1 behind the other sails
    if (k < 0.5) vO = (c * uSun.x + s * uSun.z) / max(length(uSun.xz), 0.05);
    isSail = 1.0; mat = k > 5.1 ? -onC : 0.0;                           // (-1: the sail of a barge on the canal, which is seen close)
  } else if (k < 1.5) {
    float c = cos(ang), s = sin(ang);
    p = iPos + vec3(R * (position.x * c - position.z * s), iDim.y + position.y * iDim.w, R * (position.x * s + position.z * c));
    n = vec3(normal.x * c - normal.z * s, normal.y, normal.x * s + normal.z * c);
  } else if (k < 2.5) {
    // (a mill's image in its pan: the post is drawn three times as stout, so the image of the sails hangs from the foot)
    vec3 q2 = position; if (uMirror > 0.5 && uMirror < 1.1 && aK.y < 0.5) q2.xz *= 3.0;   // (1 = a mill; a boat's image is drawn with 1.2)
    if (k > 2.05 && k < 2.2) q2 = mix(vec3(9.7, 1.95, 0.3), q2, onC);   // (only the canal's barges are manned)
    else if (k > 2.425) q2 = mix(vec3(10.4, 2.7, 0.2), q2, rigS * rigM);    // the sheets are gathered in at the stern while the rig is folded
    else if (k > 2.3) q2.y -= (1.0 - rigS) * 9.4;                         // the yard comes down the mast with its sail
    else if (k > 2.2 && q2.y > 4.0) { vec2 hd = q2.xy - vec2(-1.6, 1.6); q2.xy = vec2(-1.6, 1.6) + vec2(hd.x * rc - hd.y * rs, hd.x * rs + hd.y * rc); }   // the mast's head and the stays' upper ends go over with it
    p = iPos + vec3(q2.x * yc - q2.z * ys, q2.y, q2.x * ys + q2.z * yc) * sc; n = vec3(normal.x * yc - normal.z * ys, normal.y, normal.x * ys + normal.z * yc);
  } else if (k < 3.5) {
    vec3 q3 = position;
    if (k > 3.2) { vec2 hd = q3.xy - vec2(-1.6, 1.6); q3.xy = vec2(-1.6, 1.6) + vec2(hd.x * rc - hd.y * rs, hd.x * rs + hd.y * rc); q3.xz = vec2(q3.x * yc - q3.z * ys, q3.x * ys + q3.z * yc); }
    float s = aK.y, ph = position.x * 1.7 + position.z * 2.3 + iSpin.w * 20.0;
    float calm = 1.0 - 0.65 * gust;
    float fl = sin(uTime * 14.0 - s * 3.0 + ph) * s * 0.12 * calm + sin(uTime * 23.0 - s * 6.5 + ph * 1.7) * s * 0.04;
    float dr = -0.035 * s * s * calm + sin(uTime * 9.0 - s * 2.2 + ph) * 0.05 * s;
    p = iPos + (q3 + wd * s + we * fl + vec3(0.0, dr, 0.0)) * sc;
    n = normalize(we + wd * (cos(uTime * 14.0 - s * 3.0 + ph) * 0.45) + vec3(0.0, 0.15, 0.0));
    mat = 8.0;
  } else if (k < 4.5) {
    float rl = max(length(position.xz), 1e-3); vec3 tg = vec3(-position.z, 0.0, position.x) / rl;
    float sw = sin(uTime * 3.0 + aK.y) + 0.4 * sin(uTime * 7.3 + aK.y * 2.0);
    p = iPos + (position + tg * sw * 0.38 + wd * 0.25) * sc; n = normal; mat = 0.0;
  } else if (k < 6.5) {
    float t = fract(aK.y + uTime * 0.42 * (1.0 + 0.8 * gust));
    p = iPos + (mix(vec3(-6.6, 0.15, 3.6), vec3(-1.3, 2.5, 0.8), t) + position) * sc; n = normal; mat = 6.0;
  } else if (k < 7.5) {
    float t = fract(aK.y + uTime * 1.3);
    p = iPos + (vec3(-1.25, 2.55, 0.75) + position + vec3(0.5 * t, -2.4 * t * t, -0.5 * t)) * sc; n = normal; mat = 9.0;
  } else if (k > 8.5) {
    // a wake lies on the canal's water behind a boat under way there; it has no shadow and no image, and no boat
    // anywhere else trails one (there its corners are all drawn at one point)
    p = iPos + vec3(position.x * yc - position.z * ys, position.y, position.x * ys + position.z * yc) * sc * onC * (1.0 - step(0.5, uShadow)) * (1.0 - step(0.5, uMirror)); p.y = mix(iPos.y, 0.06, onC); n = vec3(0.0, 1.0, 0.0);
  } else {
    // hung from a rail in the gale: it leans downwind in proportion to how far below the rail it hangs, swings there and
    // jostles sideways, each string in its own time
    float hs = mod(aK.y, 16.0), ph = floor(aK.y / 16.0) * 1.31 + iSpin.w * 20.0;
    float lean = 0.30 + 0.12 * gust + 0.11 * sin(uTime * 2.3 + ph) + 0.05 * sin(uTime * 5.3 + ph * 1.7);
    float side = 0.08 * sin(uTime * 3.4 + ph * 2.3);
    p = iPos + (position + wd * (hs * lean) + we * (hs * side) + vec3(0.0, hs * 0.5 * lean * lean, 0.0)) * sc; n = normal; mat = 8.0;
  }
  vec4 wp = modelMatrix * vec4(p, 1.0);
  if (uShadow > 0.5) { float h = max(wp.y - uPlaneY, 0.0); vH = h; wp.xz -= uSun.xz * (h / max(uSun.y, 0.05)); wp.y = uPlaneY; }
  vDm = 1.0;
  if (uMirror > 0.5) {
    // an image in the brine: the point is mirrored in y = 0 (rippling more the deeper it hangs) and then slid along the
    // line of sight up onto the water, so it is drawn on the surface exactly where the eye would see it and is hidden by
    // whatever stands in front
    float hy = max(wp.y, 0.0);
    wp.x += sin(hy * 1.7 + uTime * 2.6 + wp.z * 0.31) * (uMirror > 1.5 ? 0.09 : 0.03) * hy * (1.0 + 2.0 * gust);
    wp.z += sin(hy * 2.3 - uTime * 2.1 + wp.x * 0.27) * 0.02 * hy;
    wp.y = -hy;
    float kq = max(cameraPosition.y - 0.05, 0.0) / max(cameraPosition.y - wp.y, 0.5);
    vDm = 1.0 / max(kq, 0.02);
    wp.xyz = cameraPosition + (wp.xyz - cameraPosition) * kq;
  }
  vN = mat3(modelMatrix) * n;
  vW = wp.xyz; vL = p - iPos; vC = aCol; vM = mat;
  vS = vec4(1.0 - isSail, position.x + 0.5, position.y, iSpin.w); vG = gust;
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,T0=`
uniform vec3 uSun, uSunCol, uSky, uGround, uFogCol, uShadowCol, uStraw, uTan; uniform float uFogDens, uShadow, uShadowK, uLamp, uHaze, uFogK; uniform vec4 uClip;
uniform float uTime, uU, uMirror, uCloudK, uCloudM, uSeed, uHarvest, uHard, uSide, uEave, uGust0; uniform vec2 uWind; uniform vec4 uCloudE;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying vec4 vS; varying float vG; varying vec3 vL; varying float vM; varying float vDm; varying float vO; varying float vH;
float h21(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float vn(vec2 p) { vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1.0, 0.0)), f.x), mix(h21(i + vec2(0.0, 1.0)), h21(i + vec2(1.0, 1.0)), f.x), f.y); }
void main() {
  vec3 dv = cameraPosition - vW; float distS = length(dv); vec3 V = dv / max(distS, 1e-4);
  float dist = distS * vDm;                                          // an image in the brine lies further off than the water it is drawn on
  float fwB = fwidth(vS.z * 6.0);                                    // how many battens one pixel spans (taken here, outside every branch)
  float fwW = max(fwidth(vW.x), fwidth(vW.z));                       // metres of water under one pixel (for the wake's foam)
  float fwC = fwidth(vS.y * 3.0);                                    // how many of a sail's three cloths one pixel spans
  if (uMirror > 0.5) V.y = -V.y;
  float fog = 1.0 - exp(-uFogDens * uFogDens * dist * dist * uFogK);
  if (uShadow > 0.5) { if (vW.x < uClip.x || vW.x > uClip.y || vW.z < uClip.z || vW.z > uClip.w) discard;
    // under a very low sun only the foot of each mill throws a firm shadow; higher up it thins out (no rails across the pans)
    float thin = 1.0 - (1.0 - smoothstep(0.16, 0.24, uSun.y)) * smoothstep(5.0, 16.0, vH) * 0.85;
    // a thin member high above the ground throws no firm shadow (the sun is a disc): masts, rings and posts fade out with
    // their height, so the long shadows on the pans and the moat are the sails', never a fan of ruled lines
    float lineK = vS.x < 0.5 ? 1.0 : 0.8 * (1.0 - 0.9 * smoothstep(2.5, 11.0, vH));
    gl_FragColor = vec4(mix(vec3(1.0), uShadowCol, uShadowK * thin * (1.0 - fog) * lineK), 1.0); return; }
  vec3 N = normalize(vN + vec3(0.0, 1e-5, 0.0));
  vec3 col;
  if (vS.x < 0.5) {
    float fs = dot(N, V) < 0.0 ? -1.0 : 1.0;
    float ndl = dot(N * fs, uSun);
    // (under a high sun a mat seen edge-on to the light still glows a little: the light scatters through the weave)
    float lit = max(ndl, 0.0), back = max(-ndl + 0.3 * uHard, 0.0) / (1.0 + 0.3 * uHard);
    vec2 uv = vS.yz;
    float near = 1.0 - smoothstep(50.0, 220.0, dist);
    float pt = h21(floor(uv * vec2(2.0, 4.0)) + floor(vS.w * 97.0));
    vec3 alb = uTan * (0.74 + 0.36 * pt) * (pt > 0.88 ? 0.62 : 1.0);
    // battens: drawn out to 420 m, each line widening and paling as it nears a pixel's width so far sails keep their bars
    float bt = abs(fract(uv.y * 6.0 + 0.5) - 0.5);
    float bw = max(0.055, 0.6 * fwB);                                 // never thinner than a pixel and a bit
    float bk = (1.0 - smoothstep(120.0, 420.0, dist)) * (1.0 - smoothstep(0.55, 1.15, fwB));
    float bd = mix(1.0, 0.5, smoothstep(0.1, 0.5, fwB)) * bk;
    float bl = (1.0 - clamp((bw - bt) / max(fwB, 0.02) + 0.5, 0.0, 1.0) * bd) / (1.0 - min(2.0 * bw, 1.0) * bd) * (1.0 - 0.11 * bk);   // wide pale bars take as much light as thin dark ones
    bl *= mix(1.0, 0.93 + 0.07 * sin(uv.x * 80.0), near * near);
    float le = min(uv.x, 1.0 - uv.x);
    bl *= smoothstep(0.0, 0.03, le) * 0.25 + 0.75;
    bl *= 0.85 + 0.15 * smoothstep(0.0, 0.16, le);                    // luff and leech darker at any distance: every sail keeps an outline
    bl = mix(bl, 1.0, step(1.5, uMirror));                           // the tower's image in the moat carries no bars
    // a canal barge's sail is seen from close by and from above: each panel of mat sags from the batten over it (shaded
    // under the batten, catching the light where it bellies), and the three cloths it is sewn from meet in two dark
    // seams; both melt away as they near a pixel's width
    float cb = step(vM, -0.5), pf = fract(uv.y * 6.0);
    bl *= mix(1.0, 0.84 + 0.26 * (1.0 - pf) * (1.0 - pf), cb * (1.0 - smoothstep(0.25, 0.8, fwB)));
    float sm3 = abs(fract(uv.x * 3.0 + 0.5) - 0.5);
    bl *= 1.0 - 0.3 * cb * (1.0 - smoothstep(0.012, 0.03 + fwC, sm3)) * (1.0 - smoothstep(0.15, 0.5, fwC));
    float shade = (0.82 + 0.18 * sin(3.14159 * uv.x)) * (0.88 + 0.16 * uv.y);   // the belly catches the light across its curve; the foot stands in the frame's shade
    // the far side of a carousel stands in the shade of the near one, and on the tower each eave shades the heads of the sails under it
    float occ = mix(1.0, smoothstep(-0.9, 0.45, vO), uSide);
    float drop = 2.3 * uSun.y / max(length(uSun.xz), 0.2);
    occ *= 1.0 - 0.65 * uEave * smoothstep(0.88 - drop / 7.6, 0.93 - drop / 7.6, uv.y) * smoothstep(-0.35, 0.25, vO);
    col = alb * bl * (mix(uGround, uSky, 0.55) * (1.0 + 0.9 * uHard) + uSunCol * lit * mix(0.95, 1.2, uHard) * shade * occ)
        + uStraw * back * (0.3 + 0.7 * bl) * (0.6 + 0.6 * pt) * (1.0 + 0.25 * vG) * (0.35 + 0.65 * occ);
    if (cb > 0.5) {
      // THE CANAL BARGE'S SAIL IS SEEN FROM FIFTEEN METRES AND FROM ABOVE: the same mat sail as the mills' and the junks',
      // drawn for that range. Three cloths by six panels, each a patch in one of the mat's three tones (weathered brown,
      // tan, bleached straw; here and there a newer, darker panel), on both faces and in every hour; the twill of the mat;
      // every bamboo batten a dark pole with a lit lip along its upper edge. Each of these melts away by how much of it one
      // pixel spans (fwB panels, fwC cloths); the battens' bars also take the fade with distance from the eye of every sail's bars above (bk and bd: 120 to 420 m). The mat is translucent: lit from in front it is
      // brown gold, against the light it glows straw through its patches, and across the belly the one passes into the
      // other without a dark crease where the sun grazes the cloth.
      vec2 pcl = min(floor(vec2(uv.x * 3.0, uv.y * 6.0)), vec2(2.0, 5.0));
      float sdl = floor(vS.w * 97.0), t1 = h21(pcl + sdl + 3.0), t2 = h21(pcl.yx * 1.7 + sdl + 11.0);
      vec3 tone = t1 < 0.36 ? vec3(0.76, 0.70, 0.62) : t1 < 0.72 ? vec3(0.97, 0.95, 0.90) : vec3(1.16, 1.13, 1.0);
      tone *= mix(vec3(1.0), vec3(0.66, 0.60, 0.52), step(0.87, t2));
      // (sun-bleached and damp places wander over the patches; the mat's twill is a fine diagonal grain, two strands to the hand)
      float coarse = 1.0 - smoothstep(0.3, 0.9, max(fwB, fwC));
      tone *= 0.9 + 0.2 * (vn(uv * vec2(7.0, 9.0) + sdl) * 0.6 + vn(uv * vec2(23.0, 5.0) + sdl) * 0.4);
      tone = mix(vec3(0.95, 0.91, 0.83), tone, coarse);
      vec2 wc = uv * vec2(88.0, 80.0); float twl = abs(fract((wc.x + floor(wc.y)) * 0.25) - 0.5) * 2.0;
      float wk = 1.0 - smoothstep(0.3, 0.9, max(fwC * 30.0, fwB * 13.5));
      float weave = mix(1.0, (0.93 + 0.14 * twl) * (0.97 + 0.06 * mod(floor(wc.y), 2.0)), wk);
      float wrap = smoothstep(-0.3, 0.3, ndl);
      vec3 ambL = mix(uGround, uSky, 0.55) * (1.0 + 0.9 * uHard);
      vec3 front = uTan * tone * (ambL + uSunCol * (0.16 + 0.84 * max(ndl, 0.0)) * wrap * mix(0.95, 1.2, uHard) * shade);
      vec3 thru = uStraw * tone * tone * ((1.0 - wrap) * (0.42 + 0.58 * max(-ndl, 0.0)) * 0.56 * (1.0 + 0.25 * vG));
      col = (front + thru) * (weave * bl);
      float bar = clamp((bw - bt) / max(fwB, 0.02) + 0.5, 0.0, 1.0) * bd, sy = fract(uv.y * 6.0 + 0.5) - 0.5;
      float lip = clamp((sy - bw * 0.55) / max(fwB, 0.02) + 0.5, 0.0, 1.0) * clamp((bw - sy) / max(fwB, 0.02) + 0.5, 0.0, 1.0) * (1.0 - smoothstep(0.03, 0.09, fwB));
      col += bar * mix(vec3(0.30, 0.22, 0.13) * (ambL + uSunCol * (0.15 + 0.35 * wrap)), vec3(0.80, 0.66, 0.42) * (ambL * 1.3 + uSunCol * (0.25 + 0.6 * wrap)), lip);
    }
    float ly = 1.0 - uv.y;
    col += vec3(1.0, 0.56, 0.2) * uLamp * (0.10 + 1.2 * ly * ly * ly) * (0.4 + 0.6 * bl);
  } else {
    float m = vM, nr = 1.0 - smoothstep(70.0, 360.0, dist);
    vec3 alb = vC; vec3 emis = vec3(0.0); float gloss = 0.0; float sunK = 1.0;
    vec2 q = vec2(vL.x + vL.z * 0.73, vL.y);
    if (m > 0.5 && m < 1.5) {                                       // lime wash: mottle, damp foot, rain streaks, faint courses
      float mo = vn(q * 0.3) * 0.6 + vn(q * 2.0) * 0.4;
      alb *= 0.88 + 0.22 * mo;
      float damp = 1.0 - smoothstep(1.0, 4.6 + 2.2 * vn(vec2(q.x * 0.45, 2.0)), vL.y);
      alb = mix(alb, alb * vec3(0.60, 0.62, 0.60), damp * 0.75);
      float st = smoothstep(0.5, 0.85, vn(vec2(q.x * 1.6, 0.5))) * (1.0 - smoothstep(0.0, 2.0 + 7.0 * vn(vec2(q.x * 0.8, 3.0)), 21.8 - vL.y));
      alb *= 1.0 - 0.32 * st;
      float st2 = smoothstep(0.42, 0.8, vn(vec2(q.x * 1.1, 7.5))) * (1.0 - smoothstep(0.0, 1.5 + 6.5 * vn(vec2(q.x * 0.6, 9.0)), 17.3 - vL.y)) * step(vL.y, 17.3);
      alb *= 1.0 - 0.24 * st2;
      alb *= 1.0 - 0.07 * nr * smoothstep(0.42, 0.5, abs(fract(vL.y / 0.6) - 0.5));
      alb *= 0.80 + 0.20 * smoothstep(0.0, 3.0, 21.9 - vL.y);          // shade gathered under the eave
      // and the eave's own shadow (it overhangs 1.6 m), as deep as the sun is high on this face
      float ed = 1.6 * uSun.y / max(dot(N, uSun), 0.12);
      sunK = 1.0 - 0.85 * smoothstep(21.75 - ed, 22.05 - ed, vL.y) * step(vL.y, 22.4);
    } else if (m < 2.5) {                                           // tiles laid round the axis
      float ax = abs(vL.x) < 1e-4 ? 1e-4 : vL.x;
      float rb = sin(atan(vL.z, ax) * 88.0);
      alb *= 1.0 + nr * (0.45 * rb - 0.1); gloss = 0.5 + 0.5 * rb * nr;
    } else if (m < 3.5) {                                           // a lit lattice: paper panes behind dark bars
      float t = vL.x * N.z - vL.z * N.x;
      vec2 lf = abs(fract(vec2(t, vL.y) / 0.62) - 0.5);
      float pane = 1.0 - smoothstep(0.30, 0.40, max(lf.x, lf.y));
      pane = mix(0.5, pane, nr);
      alb *= 0.5 + 0.5 * pane;
      emis = vec3(1.0, 0.60, 0.26) * (1.2 + 2.6 * uLamp) * pane;
    } else if (m < 4.5) {                                           // stone: blocks in running bond, or paving seen from above
      vec2 sp = N.y > 0.6 ? vL.xz / vec2(1.3, 0.8) : q / vec2(1.3, 0.55);
      sp.x += 0.5 * floor(sp.y);
      vec2 f = abs(fract(sp) - 0.5);
      float joint = smoothstep(0.44, 0.5, max(f.x, f.y));
      alb *= (0.84 + 0.3 * h21(floor(sp))) * (0.9 + 0.2 * vn(q * 1.7));
      alb *= 1.0 - 0.38 * joint * nr;
      alb = mix(alb, alb * vec3(0.66, 0.70, 0.64), (1.0 - smoothstep(0.2, 1.6, vL.y)) * step(N.y, 0.6));   // weed line at the water
      // a paved top is never one tone: salt swept into pale drifts, darker damp where the brine was carried, worn lanes
      float top = step(0.6, N.y);
      float drift = smoothstep(0.5, 0.74, vn(vW.xz * 0.21 + 3.0) * 0.6 + vn(vW.xz * 1.3) * 0.4);
      alb = mix(alb, vec3(0.72, 0.70, 0.66) * (0.9 + 0.1 * vn(vW.xz * vec2(3.0, 14.0))), 0.6 * drift * top);
      alb *= 1.0 - 0.3 * top * smoothstep(0.55, 0.8, vn(vW.xz * 0.33 + 17.0)) * (1.0 - drift);
      alb *= 1.0 - 0.2 * top * joint * nr;
    } else if (m < 5.5) {                                           // straight tile rows running down a slope
      float co = abs(N.x) > abs(N.z) ? vL.z : vL.x;
      float rb = sin(co * 12.566);
      alb *= 1.0 + nr * (0.45 * rb - 0.1); gloss = 0.5 + 0.5 * rb * nr;
    } else if (m < 6.5) {                                           // planks
      float gr = vn(vec2(q.x * 7.0 + vL.z * 5.0, q.y * 0.5));
      alb *= 0.78 + 0.4 * gr;
      alb *= 1.0 - 0.25 * nr * smoothstep(0.4, 0.5, abs(fract((vL.x + vL.z) / 0.45) - 0.5));
    } else if (m < 7.5) {                                           // horn lantern
      emis = vec3(1.0, 0.56, 0.18) * (0.25 + 3.5 * uLamp);
    } else if (m < 8.5) {                                           // cloth: lit from either side
      float nl = dot(N, uSun);
      alb *= 0.75 + 0.25 * vn(vL.xz * 3.0 + vL.y * 5.0);
      emis = alb * uSunCol * (0.45 * abs(nl) + 0.25 * max(-nl * sign(dot(N, V)), 0.0));
    } else if (m < 9.25) {
      emis = vec3(0.55, 0.60, 0.62) * (uSky + uSunCol);
    } else if (m < 9.75) {                                          // brine in a small pan: its own tint under a sheet of sky, rippling
      float rpl = vn(vW.xz * 1.7 + vec2(0.0, uTime * 1.6)) * 0.6 + vn(vW.xz * 4.3 - vec2(uTime * 0.9, 0.0)) * 0.4;
      emis = alb * (uSky * 1.5 + uSunCol * 0.9) * (0.75 + 0.5 * rpl) + uSky * 0.55 * pow(clamp(1.0 - V.y, 0.0, 1.0), 3.0); alb = vec3(0.0);
    } else if (m < 10.5) {
      emis = vec3(1.0, 0.62, 0.28) * (0.9 + 3.0 * uLamp);
    } else if (m < 11.5) {                                          // a house's lime wash: mottle, a grey damp foot, rain streaks from the eaves, patches
      float mo = vn(q * 0.45) * 0.55 + vn(q * 2.6) * 0.45;
      alb *= 0.70 + 0.50 * mo;
      float damp = 1.0 - smoothstep(2.2, 3.3 + 1.4 * vn(vec2(q.x * 0.7, 2.0)), vL.y);
      alb = mix(alb, alb * vec3(0.56, 0.58, 0.56), damp * 0.8);
      float st = smoothstep(0.45, 0.8, vn(vec2(q.x * 2.3, 0.5))) * smoothstep(2.6, 5.6, vL.y) * step(abs(N.y), 0.5);
      alb *= 1.0 - 0.26 * st;
      alb = mix(alb, alb * vec3(0.86, 0.78, 0.66), smoothstep(0.62, 0.78, vn(q * 0.23 + 11.0)) * 0.6);      // ochre where the wash has gone
      alb *= 1.0 - 0.06 * nr * smoothstep(0.42, 0.5, abs(fract(vL.y / 0.5) - 0.5));
      // weather on every wall: long grey rain stains under the eaves and copings, green-grey lichen creeping up from the
      // foot, and here and there a patch where the plaster has fallen and the grey brick shows in courses
      float wall = step(abs(N.y), 0.5);
      float run = smoothstep(0.38, 0.75, vn(vec2(q.x * 3.1, 4.0)) * 0.6 + vn(vec2(q.x * 9.0, vL.y * 0.35)) * 0.4) * smoothstep(1.6, 4.4, vL.y);
      alb = mix(alb, alb * vec3(0.62, 0.64, 0.68), 0.42 * run * wall);
      float lich = (1.0 - smoothstep(2.0, 4.6 + 1.6 * vn(vec2(q.x * 1.3, 6.0)), vL.y)) * smoothstep(0.35, 0.7, vn(q * vec2(1.7, 0.9) + 5.0));
      alb = mix(alb, alb * vec3(0.52, 0.58, 0.46), 0.5 * lich * wall);
      float fallen = smoothstep(0.69, 0.74, vn(q * 0.42 + 23.0) * 0.8 + vn(q * 1.9) * 0.2) * wall * step(vL.y, 6.2);
      vec2 bk2 = vec2(q.x / 0.62 + 0.5 * floor(vL.y / 0.24), vL.y / 0.24), bf2 = abs(fract(bk2) - 0.5);
      vec3 brick = vec3(0.34, 0.33, 0.33) * (0.8 + 0.4 * h21(floor(bk2))) * (1.0 - 0.4 * nr * smoothstep(0.38, 0.5, max(bf2.x, bf2.y)));
      alb = mix(alb, brick, fallen * 0.9);
    } else if (m > 13.5) {                                          // a wake: foam left on the water, torn by the ripples, thinning with age and toward its edges
      float lat = abs(vC.r * 2.0 - 1.0), age = clamp(vC.g, 0.0, 1.0);
      float fz = vn(vW.xz * vec2(0.8, 1.9) + vec2(0.0, uTime * 0.7)) * 0.6 + vn(vW.xz * vec2(2.4, 4.6) - vec2(uTime * 0.9, 0.0)) * 0.4;
      fz = mix(0.42, fz, 1.0 - smoothstep(0.25, 0.9, fwW));               // (grain finer than a pixel melts into an even foam)
      if (fz > (1.0 - age * age) * (1.0 - lat * lat) * 0.92) discard;
      alb = vec3(0.0); emis = vec3(0.78, 0.77, 0.74) * (uSky + uSunCol * (uSun.y * 1.7 / (0.75 + uSun.y))) * (0.82 + 0.3 * fz);
    } else if (m > 12.5) {                                          // a woven reed mat: a twill of two tones bound on bamboo battens
      vec2 mq = abs(N.y) > 0.75 ? vL.xz : vec2((vL.x * N.z - vL.z * N.x) / max(length(N.xz), 0.2), vL.y / max(length(N.xz), 0.2));
      float wk = 1.0 - smoothstep(16.0, 70.0, dist);
      vec2 wc = mq / 0.26; float chk = mod(floor(wc.x) + floor(wc.y), 2.0);
      float strand = chk > 0.5 ? abs(fract(wc.x * 3.0) - 0.5) : abs(fract(wc.y * 3.0) - 0.5);
      alb *= mix(1.0, (0.86 + 0.26 * chk) * (0.88 + 0.24 * strand), wk);
      alb *= 0.84 + 0.3 * vn(mq * 0.7 + 3.0);                                                                   // sun-bleached and damp patches
      float bat = abs(fract(mq.y / 0.95 + 0.5) - 0.5) * 0.95;
      alb = mix(alb, vec3(0.30, 0.22, 0.13), (1.0 - smoothstep(0.035, 0.07, bat)) * nr * 0.85);
      alb *= 0.9 + 0.1 * smoothstep(0.07, 0.16, bat);
    } else {                                                        // raked salt: fine grooves round the heap, grey in the hollows, a glint on the crests
      float gr = sin(vL.y * 21.0 + vn(vec2(q.x * 0.8, vL.y * 0.6)) * 5.0);
      float gn = vn(q * 3.1) * 0.6 + vn(q * 0.6 + 4.0) * 0.4;
      alb *= (0.93 + 0.07 * gr * nr) * (0.88 + 0.2 * gn);
      alb = mix(alb, alb * vec3(0.80, 0.82, 0.92), (1.0 - smoothstep(0.0, 1.6, vL.y - 1.5)) * 0.5);
      gloss = 0.25 * nr * smoothstep(0.6, 0.9, vn(q * 9.0));
    }
    float l = max(dot(N, uSun), 0.0) * sunK;
    // a low sun wraps round and the fill is strong; at noon (uHard) the fill drops, the wrap goes and the shade turns blue
    vec3 amb = mix(uGround, uSky, N.y * 0.5 + 0.5) * mix(2.1, 1.7, uHard);
    amb = mix(amb, amb * vec3(0.74, 0.90, 1.24), uHard * (1.0 - smoothstep(0.0, 0.25, l)));
    vec3 light = amb + uSunCol * (l + mix(0.17, 0.03, uHard) * (1.0 - N.y * N.y));
    light += uGround * 1.1 * (1.0 - smoothstep(0.0, 16.0, abs(vL.y))) * (1.0 - l);        // light thrown up off the salt and the water
    light = max(light, vec3(0.12));
    vec3 Rf = reflect(-V, N);
    col = alb * light + emis + uSunCol * gloss * 0.35 * pow(max(dot(Rf, uSun), 0.0), 14.0) + (uSky + uSunCol * 0.2) * gloss * 0.22 * pow(clamp(1.0 - dot(N, V), 0.0, 1.0), 3.0);
  }
  float hz = uHaze * smoothstep(130.0, 1100.0, dist);
  col = mix(col, dot(col, vec3(0.3, 0.5, 0.2)) * vec3(0.74, 0.72, 0.90), min(1.0, 1.5 * hz)) * (1.0 - 0.25 * min(1.0, 2.0 * hz));
  fog = mix(fog, 1.0, hz * hz);
  // cloud shadows racing down the wind, the same field the pans and the dyke use
  vec2 cq = vW.xz - uSun.xz * (max(vW.y, 0.0) / max(uSun.y, 0.2));
  vec2 cw = vec2(-cq.x * uWind.y + cq.y * uWind.x, -cq.x * uWind.x - cq.y * uWind.y + uTime * 18.0) * uCloudE.w;
  float cs = smoothstep(uCloudE.x, uCloudE.y, vn(cw * 0.0042) * 0.7 + vn(cw * 0.011) * 0.3 + (vn(cw * 0.034) - 0.5) * uCloudE.z);
  col *= mix(vec3(1.0), uShadowCol * 2.4, uCloudK * uCloudM * cs);
  col = mix(col, uFogCol, fog);
  float alpha = 1.0;
  if (uMirror > 0.5) {
    // where the image may lie: on open brine only, not on a bank, a crust rim or a dry harvest pan; broken into bars by
    // the ripples, wiped out by the gust, lost with distance and when looked straight down on
    vec2 p = vW.xz;
    vec2 gq = vec2(p.x / 64.0, (p.y - 26.0) / 44.0); vec2 id = floor(gq), f = fract(gq);
    float e = min(min(f.x, 1.0 - f.x) * 64.0, min(f.y, 1.0 - f.y) * 44.0);
    float dO = min(abs(p.y - 36.0) - 12.0, max(abs(p.x) - 130.0, max(p.y + 100.0, -330.0 - p.y)));
    float open = step(dO, 0.0);
    e = mix(min(e, dO), 1.7 - dO, open);
    vec2 gid = floor(id * 0.5 + (vn(id * 0.37 + uSeed) - 0.5) * 1.6);
    float along = (p.y > 100.0 && abs(p.x) < 64.0) || (p.y < 24.0 && p.y > -106.0 && p.x > -64.0 && p.x < 128.0) ? 1.0 : 0.0;   // as in the pan shader
    float hv = uHarvest * step(h21(gid + 17.3), 0.33) * (1.0 - along) * (1.0 - open);
    vec2 pw = vec2(-p.x * uWind.y + p.y * uWind.x, -p.x * uWind.x - p.y * uWind.y);
    float d = p.y - (26.0 - 2070.0 * (uU - uGust0));
    float band = smoothstep(0.0, 6.0, d) * (1.0 - smoothstep(34.0, 120.0, d));
    float brk = vn(vec2(pw.x * 0.5, pw.y * 2.2 + uTime * 3.2)) * 0.65 + vn(vec2(pw.x * 1.7, pw.y * 6.0 + uTime * 5.0)) * 0.35;
    // close under the eye an image is all ripple: cut into dashes and melting out at each sail's own edges, never a flat pane
    float nearM = (1.0 - smoothstep(12.0, 50.0, distS)) * step(uMirror, 1.5);
    float dash = mix(0.42 + 0.58 * smoothstep(0.25, 0.6, brk), smoothstep(0.36, 0.64, brk) * 0.9, nearM);
    // the post, the masts and the rings carry steadily (a dark stem from the mill's foot down to the image of its sails)
    float stem = step(0.5, vS.x) * step(uMirror, 1.5);
    dash = mix(dash, 0.86 + 0.14 * brk, 0.8 * stem);
    alpha = mix(smoothstep(1.9, 4.4, e), smoothstep(1.3, 2.4, e), stem) * (1.0 - hv) * dash * (1.0 - 0.8 * band);
    if (vS.x < 0.5) alpha *= mix(1.0, smoothstep(0.0, 0.2, min(vS.y, 1.0 - vS.y)) * smoothstep(0.0, 0.12, min(vS.z, 1.0 - vS.z)), nearM);
    alpha *= (1.0 - smoothstep(190.0, 360.0, distS)) * (0.55 + 0.45 * (1.0 - V.y * V.y)) * mix(0.72, 0.42, smoothstep(50.0, 200.0, distS)) * (1.0 - 0.2 * open) * uMirror * (1.0 + 0.3 * stem);
    if (uMirror > 1.5) {
      // the tower's image keeps to its moat, and only its sails and lanterns carry: gold bars the ripples cut into dashes
      alpha *= 1.0 - smoothstep(-14.0, -3.0, max(abs(p.x) - 130.0, max(p.y + 100.0, -330.0 - p.y)));
      alpha *= (vS.x < 0.5 || (vM > 6.5 && vM < 7.5)) ? 0.2 + 0.8 * smoothstep(0.38, 0.62, brk) : 0.0;
      // each sail's image melts out toward its own edges and half into the moat's own tone: soft gold dashes, never patches
      if (vS.x < 0.5) {
        alpha *= smoothstep(0.0, 0.22, min(vS.y, 1.0 - vS.y)) * smoothstep(0.0, 0.15, min(vS.z, 1.0 - vS.z));
        col = mix(col, uSky + uSunCol * 0.5, 0.5 * (1.0 - 0.6 * min(uLamp, 1.0)));
      }
      alpha = min(alpha, uSun.y > 0.5 ? 0.3 : 0.5);
    }
    alpha = clamp(alpha, 0.0, 0.9);
    col *= vec3(0.80, 0.84, 0.92);
  }
  gl_FragColor = vec4(col, alpha);
}`;function F0(N,{shadow:p=!1,planeY:d=.06,clip:y=[-1e5,1e5,-1e5,1e5],haze:x=0,strength:g=.5,tan:C=null,fogK:a=1,mirror:v=!1,eave:M=0,cloud:P=1}={}){const b=new T.ShaderMaterial({uniforms:{...N,...C?{uTan:{value:z(C)}}:{},uShadow:{value:p?1:0},uMirror:{value:v===!0?1:+v||0},uShadowK:{value:g},uFogK:{value:a},uHaze:{value:x},uEave:{value:M},uCloudM:{value:P},uPlaneY:{value:d},uClip:{value:new T.Vector4(...y)}},vertexShader:A0,fragmentShader:T0,side:T.DoubleSide});return p&&(b.transparent=!0,b.depthWrite=!1,b.blending=T.MultiplyBlending,b.polygonOffset=!0,b.polygonOffsetFactor=-2,b.polygonOffsetUnits=-6),v&&(b.transparent=!0,b.depthWrite=!1,b.polygonOffset=!0,b.polygonOffsetFactor=-2,b.polygonOffsetUnits=-6),b}function M0(N,p){const d=new T.InstancedBufferGeometry;d.index=N.index;for(const a in N.attributes)d.setAttribute(a,N.attributes[a]);const y=p.length,x=new Float32Array(y*3),g=new Float32Array(y*4),C=new Float32Array(y*4);for(let a=0;a<y;a++){const v=p[a];x.set([v.x,v.y,v.z],a*3),g.set([v.R,v.y0,v.w,v.h],a*4),C.set([v.phase,v.omega,v.arrive,v.seed],a*4)}return d.setAttribute("iPos",new T.InstancedBufferAttribute(x,3)),d.setAttribute("iDim",new T.InstancedBufferAttribute(g,4)),d.setAttribute("iSpin",new T.InstancedBufferAttribute(C,4)),d.instanceCount=y,d}const z0=[{x:0,y:0,z:0,R:7,y0:0,w:1,h:1,phase:0,omega:1,arrive:9,seed:0}],N0=`
uniform float uTime, uGale; uniform vec2 uWind; varying vec3 vW; varying float vA; varying float vV;
void main() {
  float a = position.z;                                   // 0 at the staff .. 1 at the tail
  vec3 wd = vec3(uWind.x, 0.0, uWind.y), we = vec3(-uWind.y, 0.0, uWind.x);
  float w = sin(a * 9.0 - uTime * 11.0) * 0.9 + sin(a * 21.0 - uTime * 17.0) * 0.35;
  vec3 p = wd * (a * 14.0) + we * (w * a * (1.3 - 0.25 * uGale));
  p.y = position.y + sin(a * 6.0 - uTime * 7.0) * a * 0.8 - a * a * 2.0;
  vec4 wp = modelMatrix * vec4(p, 1.0); vW = wp.xyz; vA = a; vV = cos(a * 9.0 - uTime * 11.0);
  gl_Position = projectionMatrix * viewMatrix * wp;
}`,B0=`
uniform vec3 uFogCol, uSunCol, uSky; uniform float uFogDens; varying vec3 vW; varying float vA; varying float vV;
void main() {
  float dist = length(cameraPosition - vW);
  vec3 col = vec3(0.85, 0.16, 0.02) * (uSky * 1.2 + uSunCol * (0.75 + 0.35 * vV));
  float fog = 1.0 - exp(-uFogDens * uFogDens * dist * dist);
  gl_FragColor = vec4(mix(col, uFogCol, fog * 0.8), 1.0);
}`;async function G0(N,p={}){const d=p.uniforms||W0(),y=new T.Group;y.name="wind-pagoda";const x=z("#F3EFE6").multiplyScalar(.8),g=z("#33373c"),C=z("#202326"),a=z("#8d8a84"),v=z("#a39f97"),M=z("#5a4230"),P=z("#8a3a24"),b=z("#b08a3c"),l=z("#30261f"),F=z("#e6c890"),f=z("#6f6c66"),t=new f0,i=o=>{t.th=o};i(4),t.box(0,.56,-2,64,1.1,50,a),t.box(0,.22,-2,67,.44,53,a.clone().multiplyScalar(.8));const n=(o,s)=>{t.box(o,1.75,s,.36,1.3,.36,v),t.box(o,2.47,s,.52,.14,.52,a),t.prism(4,.3,.05,2.54,2.86,v,o,s,!1,Math.PI/4)},u=(o,s)=>{t.beam([o[0],2.2,o[1]],[s[0],2.2,s[1]],.11,v,.09),t.beam([o[0],1.55,o[1]],[s[0],1.55,s[1]],.07,a,.07)};for(const o of[-1,1]){const s=[2.6,5.8,9,12.2,16,19.2,22.4,25.6,28.6,31.4];for(let r=0;r<s.length;r++)n(o*s[r],22.4),r<s.length-1&&r!==3&&u([o*s[r],22.4],[o*s[r+1],22.4]);for(let r=1;r<=8;r++)n(o*31.4,22.4-r*3.3),u([o*31.4,22.4-(r-1)*3.3],[o*31.4,22.4-r*3.3]);for(let r=0;r<4;r++)t.box(o*14.1,.85-r*.26,23.3+r*.62,3.2,.3,.62,v)}await N.yield();const h=22,S=22,e=15,m=7,L=7.5,E=[];for(let o=0;o<64;o++)E.push(o/64*Math.PI*2);for(const[o,s]of[[h,S-m],[-h,S-m],[-h,-m],[h,-m]])E.push((Math.atan2(s,o)+Math.PI*2)%(Math.PI*2));E.sort((o,s)=>o-s),E.push(E[0]+Math.PI*2);const R=o=>{const s=Math.cos(o),r=Math.sin(o),c=Math.min(h/Math.max(Math.abs(s),1e-6),(r>0?S-m:m)/Math.max(Math.abs(r),1e-6));return[s*c,m+r*c]};for(let o=0;o<E.length-1;o++){const s=E[o],r=E[o+1],c=Math.cos(s),w=Math.sin(s),I=Math.cos(r),A=Math.sin(r),Q=R(s),$=R(r),G=L+1.2,B=L+1.9,D=[c*G,m+w*G],H=[I*G,m+A*G],O=[c*B,m+w*B],K=[I*B,m+A*B];i(1),t.quad([D[0],D[1],e],[Q[0],Q[1],e],[$[0],$[1],e],[H[0],H[1],e],x),i(0);const Z=o%2?a:a.clone().multiplyScalar(.84);t.quad([c*L,m+w*L,e+.3],[D[0],D[1],e+.3],[H[0],H[1],e+.3],[I*L,m+A*L,e+.3],Z),t.quad([D[0],D[1],e+.5],[O[0],O[1],e+.5],[K[0],K[1],e+.5],[H[0],H[1],e+.5],v),t.quad([D[0],D[1],e+.5],[D[0],D[1],e+.3],[H[0],H[1],e+.3],[H[0],H[1],e+.5],f),t.quad([O[0],O[1],e+.5],[O[0],O[1],e],[K[0],K[1],e],[K[0],K[1],e+.5],f),t.quad([I*L,m+A*L,e+.3],[I*L,m+A*L,2],[c*L,m+w*L,2],[c*L,m+w*L,e+.3],l),t.tri([0,m,2],[c*L,m+w*L,2],[I*L,m+A*L,2],l),o%16===15&&await N.yield()}await N.yield(),i(0);for(let o=0;o<16;o++){const s=(o+.5)/16*Math.PI*2,r=L+1.55,c=m+Math.sin(s)*r;c>5.2&&t.box(Math.cos(s)*r,c,e+.62,.42,.42,.24,b,0)}t.box(0,m+L+1,e+.5,1.5,2.3,.7,v),i(1),t.box(-h-.01,10.5,0,.5,23,30,x),t.box(h+.01,10.5,0,.5,23,30,x),t.box(0,10.5,-15,44,23,.5,x),t.box(0,22,0,44,.4,30,x);const q=h+1.6,k=e+1.6,j=h-4,Y=e-4,W=22.5,U=24.5;i(5),t.quad([-q,W,k],[q,W,k],[j,U,Y],[-j,U,Y],g),t.quad([q,W,-k],[-q,W,-k],[-j,U,-Y],[j,U,-Y],g),t.quad([q,W,k],[q,W,-k],[j,U,-Y],[j,U,Y],g),t.quad([-q,W,-k],[-q,W,k],[-j,U,Y],[-j,U,-Y],g),i(0),t.quad([-j,U,Y],[j,U,Y],[j,U,-Y],[-j,U,-Y],C),t.quad([-q,W,k],[q,W,k],[q,W-.45,k],[-q,W-.45,k],C),t.quad([-q,W,-k],[q,W,-k],[q,W-.45,-k],[-q,W-.45,-k],C),t.quad([q,W,k],[q,W,-k],[q,W-.45,-k],[q,W-.45,k],C),t.quad([-q,W,k],[-q,W,-k],[-q,W-.45,-k],[-q,W-.45,k],C),i(6),t.quad([-q,W-.45,k],[q,W-.45,k],[h,22,e],[-h,22,e],M),t.quad([q,W-.45,k],[q,W-.45,-k],[h,22,-e],[h,22,e],M),t.quad([-q,W-.45,k],[-q,W-.45,-k],[-h,22,-e],[-h,22,e],M),i(0),t.box(0,21.2,e+.2,44.6,.6,.45,P),t.box(0,20.82,e+.16,44.4,.14,.4,b);for(let o=-10;o<=10;o++)t.box(o*2.1,21.72,e+.7,.55,.42,1.3,P),t.box(o*2.1,21.72,e+1.2,.9,.3,.4,M);for(const o of[-1,1]){t.box(o*(h+.2),21.2,0,.45,.6,30.4,P);for(let s=-6;s<=6;s++)t.box(o*(h+.7),21.72,s*2.2,1.3,.42,.55,P);for(const s of[-1,1]){let r=[o*q,W-.1,s*k];for(let c=1;c<=5;c++){const w=c/5,I=[o*(q+2.6*w),W-.1+1.9*w*w,s*(k+2.6*w)];t.beam(r,I,.34-.04*c,C,.2),r=I}t.kind=4,t.th=o*2+s,t.prism(6,.34,.2,W+.5,W+1.3,b,o*(q+2.5),s*(k+2.5),!0),t.kind=2,t.th=0}}await N.yield();for(const o of[-1,1]){i(4),t.box(o*11.4,10.8,e+.22,1.1,13.2,.44,v),i(0),t.box(o*11.4,17,e+.3,1.7,.5,.6,a),t.box(o*11.4,4.5,e+.3,1.6,.6,.6,a);const s=o*16.3,r=11.6,c=2.3;for(let w=0;w<20;w++){const I=w/20*Math.PI*2,A=(w+1)/20*Math.PI*2,Q=Math.cos(I),$=Math.sin(I),G=Math.cos(A),B=Math.sin(A);i(3),t.tri([s,r,e+.06],[s+Q*c,r+$*c,e+.06],[s+G*c,r+B*c,e+.06],F),i(0),t.quad([s+Q*c,r+$*c,e+.34],[s+Q*(c+.6),r+$*(c+.6),e+.34],[s+G*(c+.6),r+B*(c+.6),e+.34],[s+G*c,r+B*c,e+.34],w%2?v:a),t.quad([s+Q*c,r+$*c,e+.34],[s+G*c,r+B*c,e+.34],[s+G*c,r+B*c,e+.06],[s+Q*c,r+$*c,e+.06],f)}t.box(s,r,e+.14,.14,c*2,.12,M),t.box(s,r,e+.14,c*2,.14,.12,M),i(5),t.quad([s-3.3,r+3.2,e+1.1],[s+3.3,r+3.2,e+1.1],[s+3,r+3.75,e],[s-3,r+3.75,e],g),i(0),t.box(s,r+3.1,e+.5,6.4,.2,1,C),i(4),t.box(s,6.6,e+.12,7.4,2.5,.24,v),i(0),t.box(s,6.6,e+.2,6.6,1.8,.2,a.clone().multiplyScalar(.86));for(let w=-2;w<=2;w++)t.prism(4,.5,.5,6.25,6.95,v,s+w*1.25,e+.2,!1,0);for(let w=0;w<7;w++)t.box(o*(13.2+w*1.15),16.5,e+.12,.4,.4,.2,b)}for(let o=-7;o<=7;o++)Math.abs(o)>1&&t.box(o*1.3,16.9,e+.12,.34,.34,.2,b);t.box(0,17.6,e+.2,44.8,.5,.7,C),t.box(0,17.2,e+.12,44.4,.26,.4,b);for(const o of[-1,1]){for(let I=0;I<3;I++){const A=o*(5+I*5.6);i(3),t.box(A,19.55,e+.08,1.7,2.1,.2,F),i(0),t.box(A,18.42,e+.16,2.3,.2,.45,v),t.box(A,19.55,e+.12,.1,2.1,.3,M),i(5),t.quad([A-1.4,20.75,e+1],[A+1.4,20.75,e+1],[A+1.2,21,e],[A-1.2,21,e],g)}i(4),t.box(o*21.1,11.5,e+.2,1.8,20.4,.5,v),t.box(o*15.6,2.5,e+.35,12.6,2.8,.7,a.clone().multiplyScalar(.8)),t.box(o*15.6,4.05,e+.4,12.9,.34,.9,v);const s=o*10.6,r=e+5.2;t.box(s,1.35,r,1.5,.5,1.5,a),t.prism(6,.42,.34,1.6,3.5,v,s,r,!1),t.box(s,3.62,r,1.4,.26,1.4,a),i(10),t.prism(6,.58,.58,3.75,4.6,F,s,r,!1),i(2),t.prism(6,1.2,.16,4.6,5.35,g,s,r,!0),i(0),t.prism(6,.16,.05,5.35,5.8,v,s,r,!0);for(let I=0;I<6;I++)t.box(s+Math.cos(I*Math.PI/3)*.58,4.17,r+Math.sin(I*Math.PI/3)*.58,.1,.86,.1,a);const c=o*17.4,w=e+6;i(4),t.box(c,1.5,w,1.1,.8,1.1,a),i(0),t.prism(6,.16,.1,1.9,11.2,M,c,w,!1),t.prism(6,.22,.22,11.2,11.55,b,c,w,!0),t.pen(c,10.4,w,5,.62,y0,.55,6),t.pen(c,9.2,w,2.6,.2,z("#f0e2c0"),.3,4),t.kind=2,t.th=0}await N.yield();const J=24,e0=10,_=o=>8.2-4*(o-(J-1))/92;i(6),t.prism(8,8.2,4.2,J-1,J+9*e0+1,M,0,0,!0,Math.PI/8);const a0=[];for(let o=0;o<9;o++){const s=o/8,r=17-8*s,c=J+o*e0,w=c+e0-1.4,I=r+2.3,A=_(c)+2.3;i(6),t.prism(8,A+.25,A+.25,c+.5,c+.8,M,0,0,!0,Math.PI/8),t.prism(8,A,A,c+.8,c+1.75,P,0,0,!1,Math.PI/8),i(0),t.prism(8,A+.1,A+.1,c+1.75,c+1.95,z("#a07850"),0,0,!1,Math.PI/8);for(let G=0;G<8;G++){const B=G*Math.PI/4,D=B+Math.PI/8,H=c+4.6,O=_(H)*Math.cos(Math.PI/8),K=2*_(H)*Math.sin(Math.PI/8);i(3),t.box(Math.cos(B)*(O+.1),H,Math.sin(B)*(O+.1),K*.62,4.4,.3,F,Math.PI/2-B),i(0),t.box(Math.cos(B)*(O+.16),H+2.35,Math.sin(B)*(O+.16),K*.72,.3,.4,P,Math.PI/2-B),t.box(Math.cos(D)*(A-.05),(c+.8+w)/2,Math.sin(D)*(A-.05),.42,w-c-.8,.42,P,-D)}i(0),t.prism(8,I+.3,I,w-.7,w+1.5,C,0,0,!1,Math.PI/8),i(2),t.prism(8,I,5.4-2.2*s,w+1.5,w+2.1,g,0,0,!0,Math.PI/8),i(6),t.prism(8,I+.25,_(w)+.2,w,w-.35,z("#6a3a28"),0,0,!1,Math.PI/8),i(0),t.prism(8,I+.32,I+.32,w+1.5,w+1.72,b,0,0,!1,Math.PI/8);for(let G=0;G<8;G++){const B=Math.PI/8+G*Math.PI/4,D=Math.cos(B),H=Math.sin(B);let O=[D*(I-1),w+1.1,H*(I-1)];for(let K=1;K<=5;K++){const Z=K/5,t0=I-1+4*Z,q0=[D*t0,w+1.1+2.3*Z*Z,H*t0];t.beam(O,q0,.36-.045*K,C,.24-.02*K),O=q0}t.kind=4,t.th=G*1.9+o*.7,t.prism(6,.34,.18,w+1.5,w+2.4,b,D*(I+2.7),H*(I+2.7),!0),t.kind=2,t.th=0}{const G=d.uWind.value,B=7.6-3*s;for(let D=0;D<8;D++){const H=Math.PI/8+D*Math.PI/4,O=I+4.1,K=Math.cos(H)*O,Z=Math.sin(H)*O,t0=w+3.2;i(0),t.prism(4,.09,.06,t0,t0+3.4,M,K,Z,!1),i(10),t.prism(5,.5,.56,t0+.5,t0+1.5,F,K,Z,!1),i(0),t.prism(5,.72,.1,t0+1.5,t0+1.85,C,K,Z,!1),Math.hypot(K+G.x*B,Z+G.y*B)>r+4.2&&Math.hypot(K+G.x*B*.5,Z+G.y*B*.5)>r+4.2&&t.pen(K,t0+2.9,Z,B,.62-.2*s,(D+o)%2?y0:z("#e2b23c"),.5,4),t.kind=2,t.th=0}}const Q=16-7*s,$=o%2?-1:1;a0.push({x:0,y:0,z:0,R:r,y0:c+.4,w:9.6-4.4*s,h:7.9-1.2*s,phase:o*1.37,omega:$*Math.PI*2/Q,arrive:(p.gustU0??.46)+.16+.06*s,seed:.13+o*.091}),await N.yield()}const V=J+9*e0+1;for(let o=0;o<5;o++)t.prism(8,1.5-o*.24,1.3-o*.24,V+o*1.6,V+o*1.6+1.1,b);t.prism(6,.16,.1,V,V+11,b,0,0,!1),await N.yield();const l0=F0(d,{tan:"#C39248",fogK:.3,eave:1,cloud:.45}),h0=await t.buildAsync(()=>N.yield());await N.yield();const u0=M0(h0,z0);await N.yield();const i0=new f0,r0=d.uSun.value,S0=Math.hypot(r0.x,r0.z)||1,o0=-r0.z/S0,s0=r0.x/S0,m0=r0.x>=0?h:-h,p0=r0.z>=0?e:-e;i0.quad([m0,1.1,-e],[m0,1.1,e],[m0,23,e],[m0,23,-e],X),i0.quad([-h,1.1,p0],[h,1.1,p0],[h,23,p0],[-h,23,p0],X),i0.quad([-q,23,-k],[q,23,-k],[q,23,k],[-q,23,k],X),i0.quad([-o0*7.6,23.1,-s0*7.6],[o0*7.6,23.1,s0*7.6],[o0*4,V,s0*4],[-o0*4,V,-s0*4],X),i0.quad([-o0*1.2,V,-s0*1.2],[o0*1.2,V,s0*1.2],[o0*.4,V+8,s0*.4],[-o0*.4,V+8,-s0*.4],X);for(let o=0;o<9;o++){const s=J+(o+1)*e0-.6,r=17-o+2.6,c=_(s)+.3;for(let w=0;w<8;w++){const I=Math.PI/8+w*Math.PI/4,A=I+Math.PI/4;i0.quad([Math.cos(I)*c,s,Math.sin(I)*c],[Math.cos(I)*r,s,Math.sin(I)*r],[Math.cos(A)*r,s,Math.sin(A)*r],[Math.cos(A)*c,s,Math.sin(A)*c],X)}}const C0=M0(i0.build(),z0),v0=new T.Mesh(u0,l0);v0.name="pagoda-static",v0.frustumCulled=!1,y.add(v0),await N.yield();const k0=M0(L0({post:!1,sx:3,sy:6,spokes:!0,frame:z("#8a6a48"),lamps:8}),a0),b0=new T.Mesh(k0,l0);b0.frustumCulled=!1,b0.name="pagoda-rings",y.add(b0),await N.yield();const w0=new f0,x0=28;for(let o=0;o<x0;o++){const s=o/x0,r=(o+1)/x0,c=1.3-.5*s,w=1.3-.5*r,I=s>.75?(s-.75)*2.6:0,A=r>.75?(r-.75)*2.6:0;w0.quad([0,I,s],[0,A,r],[0,w,r],[0,c,s],X),w0.quad([0,-c,s],[0,-w,r],[0,-A,r],[0,-I,s],X)}const P0=new T.ShaderMaterial({uniforms:d,vertexShader:N0,fragmentShader:B0,side:T.DoubleSide}),c0=new T.Mesh(w0.build(),P0);return c0.position.set(0,V+9.5,0),c0.frustumCulled=!1,c0.name="pagoda-pennant",y.add(c0),{object:y,radius:34,height:V+11,center:new T.Vector3(0,60,0),anchors:{gate:new T.Vector3(0,m,e),portal:new T.Vector3(0,m,e-2),deckY:m-2.4,top:new T.Vector3(0,V,0)},uniforms:d,rings:a0,ringGeometry:k0,staticGeometry:u0,shadowGeometry:C0,staticMesh:v0,ringMesh:b0,pennant:c0,update(o,s){p.uniforms||(d.uTime.value=s)},dispose(){},ground:!0,groundY:0}}export{f0 as GB,z0 as ONE,E0 as boatGeometry,G0 as buildHero,L0 as carouselGeometry,M0 as instanceCarousels,F0 as makeSailMaterial,W0 as makeSailUniforms};
