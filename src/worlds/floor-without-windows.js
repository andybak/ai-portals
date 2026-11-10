import*as x from"three";import{makePath as W0,clamp as Ze,smoothstep as Do}from"../kit/core.js";import{buildHero as R0,P as F,RUNS as se,lineAt as we,heightAt as N0,linePoints as Ia,FOG_ABOVE as pt,GLSL_WAVE as it,GLSL_NIGHT as ao,GLSL_SLAB as Wa,GLSL_BRACKET as C0,GLSL_CARPET as F0,TIDE_SHADE as jo,TIDE_LEVEL as Ra,TIDE_TRAINS as wt,tideH as B0,tideSlope as k0,adriftDealStages as T0,STAIR as rt,fleetLampsInto as H0,runAtZ as xt,HERO_SHOULDERS as P0,STACK_PROUD as q0,WEAVE as Wt}from"../parts/floor-without-windows.js";const G0=["#3f7fd6","#84449a","#1fa3b8","#c9457a","#ee6666"],de={hw:7,h:8},Na=[1.2,.97,.68],q=(e,o=1)=>{const a=new x.Color(e);return[a.r*o,a.g*o,a.b*o]},oe=q("#f4f3ee"),Xe=q("#d9dad6"),Ca=q("#f4f3ee",.62),Rt=q("#1c2028"),fe=5,gt=4.4,Ce=.35,Fa=q("#e9dfcb"),Un=q("#2b3038"),Fe={len:100,deep:24,glass:F.LOBBY.glassS-F.LOBBY.glassN,z0:F.LOBBY.glassS,zN:F.LOBBY.glassS-100},_o=[0,0,0,0];function yt(){const e=[],o=[],a=[],r=[],u=[],n=[];return{quad(t,s,l,c,i,b=_o){for(const y of[0,1,2,0,2,3]){const w=t[y],h=Array.isArray(s[0])?s[y]:s,v=Array.isArray(c[0])?c[y]:c,m=Array.isArray(i[0])?i[y]:i,f=Array.isArray(l[0])?l[y]:l;e.push(w[0],w[1],w[2]),o.push(h[0],h[1],h[2]),a.push(f[0],f[1],f[2]),r.push(v[0],v[1],v[2],v[3]),u.push(m[0],m[1],m[2]),n.push(b[0],b[1],b[2],b[3])}},tri(t,s,l,c,i){for(let b=0;b<3;b++){const y=t[b];e.push(y[0],y[1],y[2]),o.push(s[0],s[1],s[2]),a.push(l[0],l[1],l[2]),r.push(c[0],c[1],c[2],c[3]),u.push(i[0],i[1],i[2]),n.push(0,0,0,0)}},get triangles(){return e.length/9},build(){const t=new x.BufferGeometry;return t.setAttribute("position",new x.Float32BufferAttribute(e,3)),t.setAttribute("normal",new x.Float32BufferAttribute(o,3)),t.setAttribute("color",new x.Float32BufferAttribute(a,3)),t.setAttribute("aC",new x.Float32BufferAttribute(r,4)),t.setAttribute("aP",new x.Float32BufferAttribute(u,3)),t.setAttribute("aS",new x.Float32BufferAttribute(n,4)),t},async buildLong(t){const s=new x.BufferGeometry;return s.setAttribute("position",new x.Float32BufferAttribute(e,3)),await t.yield(),s.setAttribute("normal",new x.Float32BufferAttribute(o,3)),await t.yield(),s.setAttribute("color",new x.Float32BufferAttribute(a,3)),await t.yield(),s.setAttribute("aC",new x.Float32BufferAttribute(r,4)),await t.yield(),s.setAttribute("aP",new x.Float32BufferAttribute(u,3)),await t.yield(),s.setAttribute("aS",new x.Float32BufferAttribute(n,4)),s}}}function Nt(e,o,a,r,u=Rt,n=oe){const t=o-a,s=e-a,l=[],c=y=>Math.asin((y-t)/a),i=y=>[s+a*Math.cos(y),t+a*Math.sin(y)];l.push({a:[0,0],b:[e-.96,0],part:0,col:u},{a:[e-.96,0],b:[e-.06,0],part:0,col:r||u}),l.push({a:[e-.06,0],b:[e-.06,.5],part:1,col:oe,low:!0},{a:[e-.06,.5],b:[e,.5],part:1,col:oe,low:!0});let b;if(t>fe)l.push({a:[e,.5],b:[e,fe],part:1,col:n,low:!0},{a:[e,fe],b:[e,t],part:1,col:oe}),b=c(t+.35),l.push({a:[e,t],b:i(b),part:2,col:oe});else{l.push({a:[e,.5],b:[e,t],part:1,col:n,low:!0});const y=c(t+.35);b=c(fe),l.push({a:[e,t],b:i(y),part:2,col:oe,low:!0},{a:i(y),b:i(b),part:3,col:oe,low:!0})}for(let y=0;y<5;y++)l.push({a:i(b+(Math.PI/2-b)*y/5),b:i(b+(Math.PI/2-b)*(y+1)/5),part:3,col:oe,smooth:[s,t]});return l.push({a:[s,o],b:[0,o],part:4,col:oe}),l.headD=t>fe?e:s+a*Math.cos(c(fe)),l.hw=e,l}function D0(e,o,a){const r=[];return a&&r.push({a:[-.06,e],b:[-.06,e+.5],part:1,col:oe,low:!0},{a:[-.06,e+.5],b:[0,e+.5],part:1,col:oe,low:!0}),r.push({a:[0,e+(a?.5:0)],b:[0,fe],part:1,col:oe,low:!0},{a:[0,fe],b:[0,o],part:1,col:oe}),r.headD=0,r.hw=0,r}function Ba(e,o,a){let r=null,u=a;for(const n of e){const t=Math.abs(n.q-o);t<u&&(u=t,r=n)}return r?[r.x,r.z,r.ci,r.kind]:_o}function ct(e,o,a,r,u,n,t=[],s=[],l=null){const c=(w,h)=>[w[0]-w[3]*h[0]*r,h[1],w[1]+w[2]*h[0]*r],i=(w,h,v)=>w[4]===-1?[h,v[0]*r,w[1]-w[0],w[3]-w[2]]:[h,v[0]*r,w[0]+w[1],w[2]+w[3]],b=w=>{let h=0;for(const v of n){const m=w<v[0]?v[0]-w:w>v[1]?w-v[1]:0;h=Math.max(h,1-Do(0,.7,m))}return 1-.2*h},y=u[u.length-1];for(let w=0;w<a.length-1;w++){const h=a[w],v=a[w+1],m=(h+v)/2,f=o(h),g=o(v),L=n.some(p=>m>p[0]&&m<p[1]),M=n.some(p=>p[2]==="full"&&m>p[0]&&m<p[1]),B=Ba(t,m,7.5),I=Ba(s,m,3);for(const p of u){if(p.low&&L||M&&p.part!==0&&p.part!==4)continue;const O=(X,J)=>{let Y,ie;p.smooth?(Y=p.smooth[0]-J[0],ie=p.smooth[1]-J[1]):(Y=-(p.b[1]-p.a[1]),ie=p.b[0]-p.a[0]);const re=Math.hypot(Y,ie)||1;return[-X[3]*Y/re*r,ie/re,X[2]*Y/re*r]};let H=p.colAt?p.colAt(h):p.col,U=p.colAt?p.colAt(v):p.col;const j=p.low&&p.part===1&&n.length>0;if(j){const X=b(h),J=b(v);H=[H[0]*X,H[1]*X,H[2]*X],U=[U[0]*J,U[1]*J,U[2]*J]}e.quad([c(f,p.a),c(g,p.a),c(g,p.b),c(f,p.b)],[O(f,p.a),O(g,p.a),O(g,p.b),O(f,p.b)],p.colAt||j?[H,U,U,H]:p.col,[i(f,h,p.a),i(g,v,p.a),i(g,v,p.b),i(f,h,p.b)],[[p.part,f[2],f[3]],[p.part,g[2],g[3]],[p.part,g[2],g[3]],[p.part,f[2],f[3]]],p.part===0?B:p.part<3.5?I:_o)}if(M){const p=y.a,O=[u.hw,y.a[1]];e.quad([c(f,p),c(g,p),c(g,O),c(f,O)],[0,-1,0],oe,[i(f,h,p),i(g,v,p),i(g,v,O),i(f,h,O)],[4,f[2],f[3]])}else if(L){const p=u.hw,O=u.headD,H=[O,fe],U=[p+Ce,fe],j=[p-.06,0],X=[p+Ce,0];e.quad([c(f,H),c(g,H),c(g,U),c(f,U)],[0,-1,0],Ca,[i(f,h,H),i(g,v,H),i(g,v,U),i(f,h,U)],[1,f[2],f[3]]),e.quad([c(f,j),c(g,j),c(g,X),c(f,X)],[0,1,0],Xe,[i(f,h,j),i(g,v,j),i(g,v,X),i(f,h,X)],[0,f[2],f[3]],B)}}for(const w of n)for(const h of[0,1]){if(w[2]==="full"||l&&!l(w[h]))continue;const v=w[h],m=o(v),f=u.hw,g=h?-1:1,L=[f-.06,0],M=[f+Ce,0],B=[f+Ce,fe],I=[u.headD,fe];e.quad([c(m,L),c(m,M),c(m,B),c(m,I)],[m[2]*g,0,m[3]*g],Ca,[i(m,v,L),i(m,v,M),i(m,v,B),i(m,v,I)],[1,m[2],m[3]])}}function ka(e,o,a,r,u=[]){const n=new Set,t=l=>{l>e&&l<o&&n.add(Math.round(l*1e3)/1e3)},s=Math.max(1,Math.ceil((o-e)/a));for(let l=0;l<=s;l++)n.add(Math.round((e+(o-e)*l/s)*1e3)/1e3);for(const l of r)for(const c of l)t(c[0]),t(c[1]),c[2]!=="full"&&(t(c[0]-.7),t(c[1]+.7));for(const l of u){const c=l.map(i=>i.q).sort((i,b)=>i-b);for(let i=0;i<c.length;i++)t(c[i]-2),t(c[i]+2),i>0&&t((c[i]+c[i-1])/2)}return[...n].sort((l,c)=>l-c)}const Ke=["#ff6b7a","#a05ad0","#3d6fe6","#22c7c7","#f1efe9","#149fb0"].map(e=>q(e)),We=[0,0,0,0],j0=Ke.concat([q("#ffe2b0"),q("#ffffff"),q("#cfd6dc")]);function no(e,o,a,r,u,n,t,s,l={}){const c=-o[3]*a,i=o[2]*a,b=o[2],y=o[3],w=l.off||0,h=l.y0===void 0?-.02:l.y0,v=u/2,m=(O,H,U)=>[o[0]+b*(O+w)+c*(r+H),U,o[1]+y*(O+w)+i*(r+H)],f=[5.3,b,y],g=(O,H)=>[O,H,n,v],L=g(-v,0),M=g(v,0),B=g(-v,n),I=g(v,n);e.quad([m(-v,0,h),m(v,0,h),m(v,n,h),m(-v,n,h)],[0,1,0],l.floor||[Xe[0]*.55+s[0]*.45,Xe[1]*.55+s[1]*.45,Xe[2]*.55+s[2]*.45],[L,M,I,B],f),e.quad([m(-v,0,t),m(v,0,t),m(v,n,t),m(-v,n,t)],[0,-1,0],oe,[L,M,I,B],f),e.quad([m(-v,n,h),m(v,n,h),m(v,n,t),m(-v,n,t)],[-c,0,-i],s,[B,I,I,B],f);const p=l.wall||[s[0]*.86+.08,s[1]*.86+.08,s[2]*.86+.08];e.quad([m(-v,0,h),m(-v,n,h),m(-v,n,t),m(-v,0,t)],[b,0,y],p,[L,B,B,L],f),e.quad([m(v,0,h),m(v,n,h),m(v,n,t),m(v,0,t)],[-b,0,-y],p,[M,I,I,M],f),l.front&&e.quad([m(-v,0,h),m(v,0,h),m(v,0,t),m(-v,0,t)],[c,0,i],l.wall||oe,[L,M,M,L],f)}const He=q("#c9cdd2"),Ta=q("#8f959d");function _0(e,o,a,r,u,n,t,s=1,l=u+.1,c=null){const i=-o[3]*a,b=o[2]*a,y=o[2],w=o[3],h=u/2,v=o[0]+i*r,m=o[1]+b*r,f=[0,0,v+m,s*l],g=[6,y,w],L=[-i,0,-b],M=(j,X,J)=>[o[0]+y*j+i*(r-J),X,o[1]+w*j+b*(r-J)],B=j=>[t[0]*j,t[1]*j,t[2]*j],I=(j,X,J,Y,ie,re)=>e.quad([M(j,J,ie),M(X,J,ie),M(X,Y,ie),M(j,Y,ie)],L,re,f,g),p=.5,O=.07,H=2.55;I(-h,-h+p,0,n,O,B(1)),I(h-p,h,0,n,O,B(1)),I(-h+p,h-p,n-p,n,O,B(.94)),I(-h+p,h-p,H-p/2,H+p/2,O,B(1)),I(-h+p,h-p,0,.62,O,B(1));for(const[j,X]of[[.62,H-p/2],[H+p/2,n-p]])I(-h+p,h-p,j,X,0,B(.86)),e.quad([M(-h+p,X,O),M(h-p,X,O),M(h-p,X,0),M(-h+p,X,0)],L,B(.55),f,g),e.quad([M(-h+p,j,0),M(h-p,j,0),M(h-p,j,O),M(-h+p,j,O)],L,B(1.08),f,g),e.quad([M(-h+p,j,O),M(-h+p,j,0),M(-h+p,X,0),M(-h+p,X,O)],L,B(.7),f,g),e.quad([M(h-p,j,0),M(h-p,j,O),M(h-p,X,O),M(h-p,X,0)],L,B(.96),f,g);I(-h+.12,h-.12,.06,.52,O+.012,He);const U=s>0?-h+.62:h-.62;if(I(U-.05,U+.05,1,3.2,O+.13,He),e.quad([M(U-.05,1,O),M(U-.05,1,O+.13),M(U-.05,3.2,O+.13),M(U-.05,3.2,O)],L,Ta,f,g),e.quad([M(U+.05,1,O+.13),M(U+.05,1,O),M(U+.05,3.2,O),M(U+.05,3.2,O+.13)],L,Ta,f,g),c){const j=s>0?h-p-.8:-h+p+.25,X=[7,y,w];for(const[J,Y]of[[.9,H-p/2-.28],[H+p/2+.28,n-p-.28]])e.quad([M(j,J,.004),M(j+.55,J,.004),M(j+.55,Y,.004),M(j,Y,.004)],L,c,f,X)}return[v,m]}const V0=`
varying vec3 vW;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,$0=`
varying vec3 vW; uniform float uFogKIn;
void main(){
  vec3 toEye = cameraPosition - vW;
  float dist = length(toEye);
  vec3 v = toEye / max(dist, 1e-3);
  float fres = pow(clamp(1. - abs(v.x), 0., 1.), 4.), hb = (vW.y - 4.6) / 1.4, band = exp(-hb * hb);
  float a = min(.03 + .2 * fres * (.45 + .55 * band), .2) * exp(-dist * uFogKIn * .5);
  gl_FragColor = vec4(vec3(.86, .93, 1.), a);
}`;function Yn(e,o,a,r,u,n){const t=(s,l)=>[o[0]-o[3]*s,l,o[1]+o[2]*s];e.quad([t(-a,r),t(a,r),t(a,u),t(-a,u)],[-o[2],0,-o[3]],n,We,[5,o[2],o[3]])}function so(e,o,a,r,u,n,t,s,l=[-1,1]){const c=(f,g)=>[o[0]+o[2]*f,g,o[1]+o[3]*f],i=[o[3],0,-o[2]],b=[1,o[2],o[3]],y=()=>[0,0,o[0]+o[1],0];n<0&&e.quad([c(-a,n),c(a,n),c(a,0),c(-a,0)],i,s,y(),b),t>r&&e.quad([c(-a,r),c(a,r),c(a,t),c(-a,t)],i,s,y(),b);for(const f of l)e.quad([c((a-.07)*f,0),c((a+.01)*f,0),c((a+.01)*f,.5),c((a-.07)*f,.5)],i,s,y(),b);const w=r-u,h=f=>Math.asin(Ze((f-w)/u,-1,1)),v=[0,h(w+.35)];let m=v[1];w<=fe&&(m=h(fe),v.push(m));for(let f=1;f<=5;f++)v.push(m+(Math.PI/2-m)*f/5);for(const f of l)for(let g=0;g<v.length-1;g++){const L=v[g],M=v[g+1],B=(a-u)*f,I=r-u;e.tri([c(a*f,r),c(B+u*Math.cos(L)*f,I+u*Math.sin(L)),c(B+u*Math.cos(M)*f,I+u*Math.sin(M))],i,s,y(),b)}}function Vo(e,o,a,r,u,n,t,s,l=5){const c=[l,1,0];e.quad([[o,u,n],[a,u,n],[a,u,t],[o,u,t]],[0,1,0],s,We,c),e.quad([[o,r,n],[a,r,n],[a,u,n],[o,u,n]],[0,0,-1],s,We,c),e.quad([[o,r,t],[a,r,t],[a,u,t],[o,u,t]],[0,0,1],s,We,c),e.quad([[o,r,n],[o,r,t],[o,u,t],[o,u,n]],[-1,0,0],s,We,c),e.quad([[a,r,n],[a,r,t],[a,u,t],[a,u,n]],[1,0,0],s,We,c)}const Ae={rest:.3,other:1/4,cove:[3/4,1/2],ceil:[1/2,1/4,de.hw-F.COVE],wall:[5/8,de.h-F.COVE],floor:3/8,line:5/2,mirror:1/8,lamp:1/2},Ha=(()=>{const o=Array.from({length:360},(r,u)=>(1-Math.abs(Math.sin((u+.5)/360*Math.PI)))**3);let a=0;for(let r=0;r<360;r++)for(let u=0;u<360;u++)a+=Math.min(o[r]+o[u],1);return a/(360*360)})(),K0=`
${it}
attribute vec4 aC; attribute vec3 aP; attribute vec4 aS;
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec4 vC; varying vec3 vP; varying vec4 vS;
void main(){
  vec4 w = modelMatrix * vec4(position, 1.);
  vS = aS;
  // a door's leaf (part 6) slides along its wall by the doors' wave at its own place
  if (aP.x > 5.5) w.xz += aP.yz * aC.w * doorOpen(aC.z);
  vW = w.xyz; vN = normal; vCol = color; vC = aC; vP = aP;
  gl_Position = projectionMatrix * viewMatrix * w;
}`,bt=`
float lit(float d){
  float s = pow(clamp(d, 0., .9), 2.2), A = 1. - .983729 * s, B = .0245786 - .432951 * s, C = .000090537 + .238081 * s;
  return .663 * (-B + sqrt(max(B * B + 4. * A * C, 0.))) / (2. * A);
}
vec3 lit3(vec3 d){ return vec3(lit(d.r), lit(d.g), lit(d.b)); }
// (the same curve forwards, the same five numbers: the shade at which the eye reads a light x)
float shadeOf(float x){
  float y = max(x, 0.) / .663;
  return pow(clamp((y * (y + .0245786) - .000090537) / (y * (.983729 * y + .432951) + .238081), 0., 1.), 1. / 2.2);
}
`,Pa=`
// (the ray o + t d against the box from a to b: x the metres to it, 1e9 where it is missed; y the face it meets: 1
// its top, 0 a face that looks at the room's front, -1 a flank)
vec2 boxAt(vec3 o, vec3 d, vec3 a, vec3 b){
  vec3 dd = vec3(abs(d.x) < 1e-4 ? 1e-4 : d.x, abs(d.y) < 1e-4 ? 1e-4 : d.y, abs(d.z) < 1e-4 ? 1e-4 : d.z);
  vec3 t0 = (a - o) / dd, t1 = (b - o) / dd, tn = min(t0, t1), tf = max(t0, t1);
  float n = max(max(tn.x, tn.y), tn.z), f = min(min(tf.x, tf.y), tf.z);
  if (f <= max(n, 0.)) return vec2(1e9, 0.);
  return vec2(n, n == tn.y ? 1. : n == tn.z ? 0. : -1.);
}
// (against a ball of radius r about c: x the metres to it, y how far its skin looks up where the ray meets it)
vec2 ballAt(vec3 o, vec3 d, vec3 c, float r){
  vec3 oc = o - c;
  float b = dot(oc, d), h = b * b - dot(oc, oc) + r * r;
  if (h <= 0.) return vec2(1e9, 0.);
  float t = -b - sqrt(h);
  if (t <= 0.) return vec2(1e9, 0.);
  return vec2(t, (oc.y + d.y * t) / r);
}
// (a box's tone by its face: the top lightest, the front plain, a flank in shade)
float faceTone(float f){ return f > .5 ? 1. : f > -.5 ? .76 : .6; }
// the place of the room's own light: the desk's lamp, the standing lamp, the doorway
vec3 roomLight(float hw, float dp, float kind){
  return kind < .5 ? vec3(-.52 * hw, 2., dp - 1.9) : kind < 1.5 ? vec3(.5 * hw, 2.8, dp - 1.8) : vec3(-.52 * hw, 1.8, dp - .3);
}
// (a clipped tree in a tub at (x, z): a pale tub, a crown of two rounds, deeper green below and in its waist)
vec4 treeAt(vec3 o, vec3 d, float x, float z, float tb, vec4 got){
  vec2 h = boxAt(o, d, vec3(x - .42, 0., z - .42), vec3(x + .42, .8, z + .42));
  if (h.x < got.w) got = vec4(vec3(.9, .89, .85) * faceTone(h.y), h.x);
  h = ballAt(o, d, vec3(x, 1.72, z), .8);
  if (h.x < got.w) got = vec4(mix(vec3(.16, .42, .26), vec3(.42, .72, .46), .5 + .5 * h.y), h.x);
  h = ballAt(o, d, vec3(x, 2.72, z), .55);
  if (h.x < got.w) got = vec4(mix(vec3(.18, .46, .28), vec3(.45, .75, .5), .5 + .5 * h.y), h.x);
  return got;
}
// o, d: the eye's ray in the room's frame; hw, dp: the room's half width and its depth; tm: the metres to the room's
// own face on this ray; c2: the cabinet's colour; cw: the colour of the room beyond a doorway. Gives the colour of
// the thing the ray meets and, in w, the metres to it (tm where it meets none); glow: the light that thing gives.
vec4 roomThings(vec3 o, vec3 d, float hw, float dp, float tm, float kind, vec3 c2, vec3 cw, out vec3 glow){
  vec4 got = vec4(0., 0., 0., tm);
  float xl = -.52 * hw, xr = .5 * hw, hl = min(1.05, hw + xl - .1);
  glow = vec3(0.);
  vec2 h;
  if (kind < .5) {
    h = boxAt(o, d, vec3(xl - hl, 0., dp - 2.5), vec3(xl + hl, 1.25, dp - 1.3));
    if (h.x < got.w) got = vec4(vec3(.88, .84, .75) * faceTone(h.y), h.x);
    h = boxAt(o, d, vec3(xl - .3, 1.7, dp - 2.2), vec3(xl + .3, 2.25, dp - 1.6));
    if (h.x < got.w) { got = vec4(1., .9, .7, h.x); glow = vec3(1., .8, .46) * 1.1; }
    vec4 tr = treeAt(o, d, xr, dp - 1.9, tm, got);
    if (tr.w < got.w) { got = tr; glow = vec3(0.); }
  } else if (kind < 1.5) {
    float hc = min(1.3, hw + xl - .1);
    h = boxAt(o, d, vec3(xl - hc, 0., dp - .8), vec3(xl + hc, 1.4, dp));
    if (h.x < got.w) got = vec4(h.y > .5 ? vec3(.88, .84, .75) : c2 * (h.y > -.5 ? .86 : .62), h.x);
    h = boxAt(o, d, vec3(xr - .12, 0., dp - 1.92), vec3(xr + .12, 2.5, dp - 1.68));
    if (h.x < got.w) got = vec4(vec3(.74, .75, .78) * faceTone(h.y), h.x);
    h = boxAt(o, d, vec3(xr - .4, 2.45, dp - 2.2), vec3(xr + .4, 3.15, dp - 1.4));
    if (h.x < got.w) { got = vec4(1., .9, .7, h.x); glow = vec3(1., .8, .46) * 1.1; }
  } else {
    vec4 tr = treeAt(o, d, xr, dp - 1.9, tm, got);
    if (tr.w < got.w) got = tr;
    // (the doorway: where the ray goes through it, it meets the jamb, the floor beyond or the lit wall beyond)
    float tw = (dp - o.z) / d.z;
    vec2 pw = o.xy + d.xy * tw;
    if (got.w >= tm && tw <= tm + .01 && abs(pw.x - xl) < .7 && pw.y < 3.1) {
      vec2 pj = o.xy + d.xy * (tw + .3 / d.z), pb = o.xy + d.xy * (tw + 3. / d.z);
      vec3 cb = abs(pj.x - xl) > .7 || pj.y > 3.1 ? vec3(.8, .8, .82) * (pj.y > 3.1 ? .6 : .7) : pb.y < 0. ? cw * .5 : cw * (.8 + .12 * pb.y / 3.);
      got = vec4(cb, tm - .01); glow = cw * .28;
    }
  }
  return got;
}
`,$o=`
vec3 wellAir(vec3 c, vec3 w, float dist, float glow){
  float hz = pow(clamp((-40. - w.y) / 54., 0., 1.), 1.3) * (1. - .4 * glow);
  c = mix(c, lit3(vec3(.76, .84, .95)), hz);
  return mix(c, vec3(.83), 1. - exp(-dist / 1400.));
}
`,U0=`
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying vec4 vC; varying vec3 vP; varying vec4 vS;
uniform vec3 uFogIn, uLeaf; uniform float uFogKIn;
uniform vec4 uSec, uLat;
uniform vec3 uSpill[9];
${it}${bt}${ao}${Wa}${F0}
// THE LIGHTS' ONE LAW IN A SHELL, by place and clock: where a front of the wave passes, a light swells from its rest
// to its whole. A FLOWN CORRIDOR'S CEILING (the loggia corridor's, the link's) CARRIES NO LIGHT FITTING: no bar,
// strip, panel, disc or lamp, flush or hung. ITS LIGHT IS ITS COVE'S: the glow line at the spring of each cove
// rests at three tenths of its light and is whole where a front passes that metre of the corridor; the white faces
// about it take their shares of it (see COVE), and its walls' lamps swell with it. HALL TWO'S CEILING CARRIES NO
// LIGHT EITHER: nothing in that hall's shell goes by the wave. A room's own ceiling carries slim bars in the weave.
#define REST ${Ae.rest.toFixed(2)}
// the bracket lamps of this shell's two walls, for the floor's mirror: (metres along, the wall's side times the metres
// of plain wall the lamp has to either side; 0: none), and the lamps' height
uniform vec2 uLampW[64]; uniform float uLampY;
// an open street's great doorway at its end (metres along to its plane, its half width, its height, the tower's half
// width there) and the ring that stands in it (its middle's height, its radius; 0: none)
uniform vec4 uGate; uniform vec2 uRing; uniform vec3 uSto[10];
// (the flown corridor's right-hand wall is glass from its metre 0 to this one; -1: no glass)
uniform float uGalQ;
// an open street: its own length (its doors stand from 6 m on, every 14 m, to 9 m before its end), a pool in its
// floor (from, to, half width; 0: none), and its lamp standards (round nine: the first one's metres along, their
// pitch, their metres either side of the axis; pitch 0: none)
uniform float uOpenL; uniform vec3 uPool, uStd;
// (the link: 1: its floor is the tide hall's carpet, laid level; the carpet's two blues and its pale lines' colour)
uniform float uCarpet; uniform vec3 uBlueA, uBlueB, uSeam;
// (a cove's light where the place's number in the wave is q)
float coveL(float q){ return REST + (1. - REST) * waveHump(q); }
// how far the opening that lights this face stands open: a door by the doors' wave at its own place, a bay always, a
// niche a little
float spillOpen(){ return vS.w < .5 ? 0. : vS.w < 1.5 ? doorOpen(vS.x + vS.y) : vS.w < 2.5 ? 1. : .4; }
// (the cove's light at the metre s along this corridor, for a face that lies at its metre vC.x: vC.z is the place's
// number in the wave there, vC.w its change with each metre along)
float coveAt(float s){ return coveL(vC.z + (s - vC.x) * vC.w); }
// (a white face's shade as the eye reads it, where it takes the share g of a cove's light k: see COVE)
float coveShade(float g, float k){ return shadeOf(lit(.9) * (${Ae.other.toFixed(4)} + g * k)); }
vec3 floorAlbedo(vec2 p, float fw){ return vCol; }
void main(){
  float part = vP.x, H = uSec.y;
  vec3 toEye = cameraPosition - vW;
  float dist = length(toEye);
  vec3 v = toEye / max(dist, 1e-3), col;
  #ifdef HALL
  vec2 a = vW.xz, T = vec2(1., 0.), Nr = vec2(0., 1.);
  #else
  vec2 a = vC.xy, T = normalize(vP.yz + vec2(1e-5, 0.)), Nr = vec2(-T.y, T.x);
  #endif
  vec2 fwa = fwidth(a), dq = dFdx(vW.xz), dr = dFdy(vW.xz);
  float fa = max(length(fwa), .01), fw = sqrt(abs(dq.x * dr.y - dq.y * dr.x) + 1e-8);
  // (Kc: the cove's light at this metre of a flown corridor. A hall's shell and an open street's take none of it)
  #if defined(HALL) || defined(OPEN)
  float Kc = 0.;
  #else
  float Kc = coveL(vC.z);
  #endif
  // tone is the shade as the eye reads it (0.55 to 0.95 on white); add is light on top of it
  float tone = .8;
  vec3 alb = vCol, add = vec3(0.);
  if (part < .5) {
    // the floor: its own colour, a shade at the foot of the walls, the light of the rooms that open on it. A
    // corridor's polished stone takes its share of the cove's light and gives back what stands over it; the link's
    // carpet lies as the tide's own does where the swell is level, and gives back nothing
    float ao = 1.;
    #ifndef HALL
    ao = .66 + .34 * smoothstep(0., 1.5, uSec.x - abs(a.y));
    #endif
    alb = floorAlbedo(a, fw);
    #ifdef HALL
    tone = .62;
    #else
    tone = coveShade(${Ae.floor.toFixed(4)}, Kc) * ao;
    if (uCarpet > .5) {
      // THE LINK'S FLOOR IS CARPETED IN THE TIDE HALL'S BLUE (round eleven f), level and still, from the well's bridge
      // to the hall's mouth: THE TIDE'S OWN CARPET (the part's carpetWeave: its two blues in a faint check of 3 m, its
      // grid of pale lines, its pile's grain, all on the hall's own lattice in space, so that the lines run on into
      // the hall), in the shade the tide's carpet has where the swell is level (the part's TIDE_SHADE). The band at
      // the wall's foot is the carpet's border, in its own colour.
      vec3 cw = carpetWeave(vW.xz, dq, dr);
      alb = (alb + (uBlueB - uBlueA) * (cw.x - .5)) * cw.z;
      alb = mix(alb, uSeam * ${(jo.seam[0]+jo.seam[1]/2).toFixed(4)} / ${Ra.toFixed(5)}, cw.y * ${jo.seam[2].toFixed(2)});
      tone = shadeOf(${Ra.toFixed(5)}) * ao;
    }
    #endif
    // the room's light on the floor before its opening: a pool that comes and goes with the leaf
    float so = spillOpen();
    vec3 sc3 = uSpill[int(vS.z + .5)];
    float rs = vS.w > 1.5 && vS.w < 2.5 ? 6.5 : 3.6, gain = .1, sat = .7;
    #ifndef HALL
    #ifndef OPEN
    // (on the black floor each room throws its own colour as a soft patch before its opening)
    gain = .16; sat = .86;
    #endif
    #endif
    float dd = length(vW.xz - vS.xy) / rs, pool = so * (1. - dd * dd) * (1. - dd * dd) * step(dd, 1.);
    #ifndef HALL
    #ifndef OPEN
    {
      // (round seven: A SOFT-EDGED PATCH OF THE ROOM'S LIGHT lies on the black floor before its opening, strongest at
      // the threshold, gone 3.4 m out and a metre beyond the opening's own width: no edge anywhere in it)
      vec2 rel = vW.xz - vS.xy;
      float alw = abs(dot(rel, T)), acr = abs(dot(rel, Nr)), hwd = vS.w > 1.5 && vS.w < 2.5 ? 6. : 2.2;
      pool = so * (1. - smoothstep(hwd - 1.3, hwd + .95, alw)) * (1. - smoothstep(.2, 4.4, acr));
      pool *= pool * (3. - 2. * pool) * .5 + .5;
    }
    #endif
    #endif
    // (a yellow, lime or warm white light lies on the floor as a pale cool sheen: no dim yellow or warm white lies on
    // a dark floor, where it would read brown; the rose, cyan, violet and coral rooms keep their own colour there)
    float yel = clamp((min(sc3.r, sc3.g) - sc3.b) * 3.3, 0., 1.);
    sc3 = mix(sc3, vec3(dot(sc3, vec3(.3, .55, .15))) * vec3(.9, .97, 1.12), yel);
    alb = mix(alb, sc3, sat * pool); tone += gain * pool;
    vec3 r = reflect(-v, vec3(0., 1., 0.));
    #ifndef HALL
    #ifndef OPEN
    // A CRISP BLACK MIRROR (round six): polished black stone. What gives light over it stands in it SHARP, each edge
    // as fine as the pixel and no wider: the glow line at each cove's spring (faint: COVE.mirror), every bracket
    // lamp's shade with its scallop on the wall, each door's coloured light; each by its own light at its own metre
    // of the corridor. The plain white of ceiling and walls comes back only as one even faint sheen: no blur, no
    // smear, no broad grey or white streak. (The link's carpet gives back nothing.)
    if (uCarpet < .5) {
      float R = (.07 + .62 * pow(clamp(1. - v.y, 0., 1.), 2.5)) * uSec.w;
      // the eye's ray, turned at the floor, meets a wall or, over the walls' heads, the ceiling: sdw the wall's side,
      // tw the metres to it, hy the height there, sw the metres along
      float rl = dot(r.xz, Nr), sdw = rl >= 0. ? 1. : -1., tw = (uSec.x * sdw - a.y) / (abs(rl) > 1e-4 ? rl : 1e-4 * sdw), hy = max(r.y, .06) * tw, sw = a.x + dot(r.xz, T) * tw;
      float onWall = step(hy, H - .1), es = max(.75 * fwidth(sw), .012), eh = max(.75 * fwidth(hy), .012);
      // (round nine: where the ray would meet THE GLASS it goes on out into the great hall: the dark slab and its
      // weave of light stand in the floor, sharp; a low ray meets the court's far range first: a dim glow of its lit bays)
      float glz = onWall * step(0., sdw) * step(0., sw) * step(sw, uGalQ);
      vec2 pS = vW.xz + r.xz * (96. / max(r.y, .06));
      vec2 slG = slabLights(pS, dFdx(pS), dFdy(pS));
      vec3 outM = mix(SLAB_NEAR * 1.6 + SLAB_LIGHT * slG.x + SLAB_BLUE * slG.y, vec3(.07, .09, .2), step(max(r.y, .06) * (tw + 24. / max(abs(rl), 1e-3)), 5.));
      onWall *= 1. - glz;
      float gl = onWall * (1. - smoothstep(.175 - eh, .175 + eh, abs(hy - (H - 1.825))));
      vec3 lampM = vec3(0.);
      if (onWall > .5) for (int i = 0; i < 64; i++) {
        vec2 L = uLampW[i];
        float dx = sw - L.x, dy = hy - uLampY, fr = abs(L.y);
        if (L.y * sdw <= 0. || abs(dx) > 3.2) continue;
        // (round seven: THE FLOOR STAYS BLACK: a lamp's scallop comes back small and pale close round its shade, never
        // as a broad warm band, which on black stone would read as a brown floor)
        float wv = .35 + .4 * abs(dy), g = exp(-dx * dx / (wv * wv)) * exp(-abs(dy) / (dy > 0. ? .6 : .9)) * (1. - smoothstep(fr - .6, fr, abs(dx)));
        float sh = (1. - smoothstep(.25 - es, .25 + es, abs(dx))) * (1. - smoothstep(.3 - eh, .3 + eh, abs(dy)));
        // (the lamp swells with the cove at its own metre)
        lampM += (vec3(.58, .52, .42) * .45 * g * (1. - sh) + vec3(1., .82, .56) * 2.4 * sh) * (${Ae.lamp.toFixed(2)} + ${(1-Ae.lamp).toFixed(2)} * waveHump(vC.z + (L.x - vC.x) * vC.w));
      }
      add = R * (mix(vec3(lit(.56)) * .2, outM, glz) + vec3(1., .95, .86) * (lit(.9) * ${(Ae.line*Ae.mirror).toFixed(4)}) * coveAt(sw) * gl + lampM);
    }
    #endif
    #ifdef OPEN
    // AN OPEN STREET IN THE GREAT HALL'S NIGHT (round nine): NO SKY AND NO KEY LIGHT: light comes only from things.
    // It is paved in stone, tiles of 1.5 m with their joints, deep blue between the lights, never black. A WARM POOL
    // lies under every lamp standard (uStd); before every open door its room's colour lies on the paving; at the
    // foot of each wall a slot of light is set in the floor, the lights' wave running along it toward the tower.
    // THE GREAT DOORWAY AT THE STREET'S END POURS ITS WARM WHITE LIGHT DOWN THE PAVING, a broad path 120 m long,
    // never blown out: the tiles keep their joints in it. A POOL (uPool) is still water in a pale kerb: A DARK
    // MIRROR in which the doorway, the tower's pile of lit storeys and the slab with its weave of light stand; the
    // stone itself has a faint polish in which the slab's lights lie.
    {
      float rT = dot(r.xz, T), rN = dot(r.xz, Nr), sdw = rN >= 0. ? 1. : -1.;
      float tw = (uSec.x * sdw - a.y) / (abs(rN) > 1e-4 ? rN : 1e-4 * sdw), hyw = r.y * tw;
      float tg = rT > 1e-4 ? (uGate.x - a.x) / rT : 1e9, hyg = r.y * tg, acg = a.y + rN * tg;
      float tS = 96. / max(r.y, .03);
      vec2 pS = vW.xz + r.xz * tS;
      vec2 slG = slabLights(pS, dFdx(pS), dFdy(pS));
      vec3 seen = mix(SLAB_NEAR, SLAB_FAR, smoothstep(200., 3200., tS)) + SLAB_LIGHT * slG.x + SLAB_BLUE * slG.y;
      float eg = max(.75 * fwidth(acg), .02), eh = max(.75 * fwidth(hyg), .02);
      if (tw < tg && hyw < H) {
        // (a wall: deep blue, warm where the doorway's light lies on it)
        float wash = exp(-max(uGate.x - a.x - rT * tw, 0.) / 36.);
        seen = lit3(mix(vec3(.2, .26, .5), vec3(.58, .51, .44), wash) * (.75 + .25 * hyw / H));
      } else if (tg < 1e8 && hyg < 96. && abs(acg) < uGate.w) {
        // (the tower's pile as it stands: its plates dark, each storey lit in its own colour; the doorway's room: its
        // wall of warm light)
        float inDoor = (1. - smoothstep(uGate.y - eg, uGate.y + eg, abs(acg))) * (1. - smoothstep(uGate.z - eh, uGate.z + eh, hyg));
        float hs = hyg - uGate.z - 2., fl = floor(max(hs, 0.) / 10.), plate = hs < 0. ? 0. : 1. - smoothstep(2. - eh, 2. + eh, hs - 10. * fl);
        vec3 sto = lit3(mix(uSto[int(clamp(hs < 0. ? 0. : fl + 1., 0., 9.))], vec3(1.), .2) * .84);
        seen = mix(mix(sto, lit3(vec3(.2, .26, .5)), max(plate, .3 * smoothstep(.5, 3., eh))), vec3(1.05, .9, .66), inDoor);
        // (round ten: the ring's own image is drawn here no more: in the stone's polish it lay on the paving before
        // the gate as a faint ring)
      }
      // the paving
      vec2 tj = (.5 - abs(fract(a / 1.5) - .5)) * 1.5;
      float jw = max(fa, .02), jt = max(clamp((.03 - tj.x) / jw + .5, 0., 1.), clamp((.03 - tj.y) / jw + .5, 0., 1.)) * clamp(.06 / jw, 0., 1.);
      vec3 stone = vec3(.62, .64, .72) * (1. - .34 * jt) * ao;
      float sk = uStd.x + uStd.y * floor((a.x - uStd.x) / max(uStd.y, 1.) + .5), d2s = (a.x - sk) * (a.x - sk) + (abs(a.y) - uStd.z) * (abs(a.y) - uStd.z);
      float gp = (exp(-d2s / 10.) + .3 * exp(-d2s / 70.)) * step(.5, uStd.y) * step(0., sk) * step(sk, uOpenL) * (.8 + .4 * waveHump(vC.z));
      float dg = max(uGate.x - a.x, 0.), path = (1. - smoothstep(.7 * uGate.y, 1.25 * uGate.y + .12 * dg, abs(a.y))) * exp(-dg / 55.) * (1. - smoothstep(90., 125., dg));
      vec3 pav = stone * min(vec3(.14, .19, .42) + vec3(1., .84, .56) * .75 * min(gp, 1.) + vec3(1., .9, .7) * .6 * path, vec3(1.2, 1.1, 1.));
      pav = mix(pav, sc3 * (1. - .15 * jt), .55 * pool);
      // (the pool: its kerb 0.5 m broad, its water a dark mirror with long low ripples)
      float dpl = max(max(uPool.x - a.x, a.x - uPool.y), abs(a.y) - uPool.z), ep = max(fa, .03);
      float water = (1. - smoothstep(-ep, ep, dpl)) * step(.5, uPool.z), kerb = (1. - smoothstep(.5 - ep, .5 + ep, dpl)) * step(.5, uPool.z) - water;
      float rip = (sin(a.x * 1.7 + a.y * .6 - uTime * .8) + sin(a.x * 1.1 - a.y * 1.4 + uTime * .6)) * (1. - smoothstep(.2, 1., fa));
      pav = mix(pav, vec3(.5, .54, .68) + vec3(1., .9, .7) * .4 * path, kerb);
      vec3 wat = mix(lit3(vec3(.055, .08, .21)), seen, .5 + .5 * pow(clamp(1. - v.y, 0., 1.), 3.)) * (1. + .06 * rip);
      float Rp = (.02 + .3 * pow(clamp(1. - v.y, 0., 1.), 3.)) * uSec.w;
      tone = 0.; alb = vec3(1.);
      add = mix(lit3(min(pav, vec3(.92))) + seen * Rp * .3, wat, water);
      float k7 = waveHump(vC.z), d7 = abs(abs(a.y) - (uSec.x - .52));
      add += (vec3(1., .93, .8) * (.5 + 1.9 * k7) * (1. - smoothstep(.2 - fa, .2 + fa, d7)) + vec3(1., .88, .66) * (.03 + .1 * k7) * exp(-d7 * d7 / 1.2)) * (1. - water);
    }
    #endif
    #endif
  } else if (part < 1.5) {
    // a wall, with a dark soft line where it meets the floor. A hall's takes an even wash from its white ceiling: a
    // fifth of a shade at the ceiling, falling down the wall
    float yy = max(H - vW.y, 0.), foot = .2 * (1. - smoothstep(0., 1.1, vW.y));
    tone = .57 + .07 * smoothstep(0., H, vW.y) + .2 / (1. + .03 * yy * yy) - foot;
    #ifndef HALL
    #ifndef OPEN
    // (A CORRIDOR'S WALL IS WHITE WITH SHADING: brightest at the cove's spring, a shade deeper toward the floor: its
    // share of the cove's light at the spring, half of that share ${Ae.wall[1].toFixed(0)} m under it; never blown out, so that each
    // bracket lamp's warm scallop stays plain on it)
    alb *= vec3(.975, .985, 1.01);
    float ys = max(H - ${F.COVE.toFixed(1)} - vW.y, 0.);
    tone = coveShade(${Ae.wall[0].toFixed(4)} / (1. + ys * ys / ${(Ae.wall[1]*Ae.wall[1]).toFixed(1)}), Kc) - foot;
    {
      // (round eight: THE PANELLING OF PALE ASH: panels 3 m wide and two high, a fine dark joint between them, each
      // panel a breath lighter or deeper than its neighbour)
      float ash = step(.06, vCol.r - vCol.b) * step(.5, vW.y);
      float jx = (.5 - abs(fract(a.x / 3.) - .5)) * 3., jy = abs(vW.y - 2.55), jw = max(fa, .004), jh = max(fwidth(vW.y), .004);
      float joint = max(clamp((.018 - jx) / jw + .5, 0., 1.) * clamp(.05 / jw, 0., 1.), clamp((.018 - jy) / jh + .5, 0., 1.) * clamp(.05 / jh, 0., 1.));
      float pn = fract(sin(floor(a.x / 3.) * 27.619 + step(2.55, vW.y) * 37.7) * 24634.6345 + cos(floor(a.x / 3.) * 41.233 + step(2.55, vW.y) * 13.171) * 7919.137);
      tone *= 1. - ash * (.16 * joint - .035 * (pn - .5));
    }
    #endif
    #endif
    // the wash of an open door's light from across the corridor
    float so = spillOpen();
    if (so > 0. && vS.w < 2.5) {
      vec2 rel = vW.xz - vS.xy;
      float acr = dot(rel, normalize(vN.xz + vec2(1e-5))), al2 = max(dot(rel, rel) - acr * acr, 0.) / (vS.w > 1.5 ? 36. : 4.4);
      float wash = so * (1. - al2) * (1. - al2) * step(al2, 1.) * (1. - smoothstep(.3, 5.2, vW.y)) * step(3., abs(acr));
      alb = mix(alb, uSpill[int(vS.z + .5)], .72 * wash); tone += .05 * wash;
    }
    #ifdef OPEN
    // under no ceiling (round nine) A STREET'S WALL STANDS IN THE GREAT HALL'S NIGHT: deep blue stone, paler toward
    // its top, a shade at its foot; THE GREAT DOORWAY'S WARM LIGHT lies on it for 80 m from the tower's foot; the
    // line of light over the door heads (uSec.z) washes it, its pulses running. No light of a sun, no shade of one.
    float hy = vW.y - uSec.z, hk = smoothstep(0., uSec.y, vW.y), wash = exp(-max(uGate.x - a.x, 0.) / 36.);
    vec3 wc = mix(vec3(.22, .28, .54), vec3(.62, .54, .45), .72 * wash) * mix(.8, 1., hk) * (1. - .22 * (1. - smoothstep(0., 1.1, vW.y)));
    wc += vec3(.3, .26, .16) * (.3 + .7 * waveHump(vC.z)) * exp(-abs(hy) / .9);
    tone = 0.; alb = vec3(1.); add = lit3(min(wc, vec3(.88)));
    #endif
  } else if (part < 2.5) {
    // the glow line at the cove's spring: THE COVE'S OWN LAMP, by the lights' one law at its metre of the corridor:
    // at a front ${Ae.line.toFixed(1)} whole whites, between fronts three tenths of that
    tone = 0.; add = vec3(1., .95, .86) * (lit(.9) * ${Ae.line.toFixed(2)}) * Kc;
    #ifdef OPEN
    add = vec3(1., .93, .8) * (.62 + .9 * waveHump(vC.z));
    #endif
  } else if (part < 3.5) {
    // the cove: lit from the glow line below, falling off toward the ceiling
    tone = coveShade(mix(${Ae.cove[0].toFixed(4)}, ${Ae.cove[1].toFixed(4)}, smoothstep(0., .85, clamp(-vN.y, 0., 1.))), Kc);
  } else if (part > 6.5) {
    // a thing that gives light (a lamp's shade, a ring lamp)
    tone = 0.; add = vCol * 2.2;
  } else if (part > 4.5) {
    // plain things (a room's faces, a column, a kerb) and a door's leaf: lit from above, walls paler toward the top
    float up = vN.y;
    tone = up > .5 ? .88 : up < -.5 ? .97 : (.74 + .2 * smoothstep(0., 6., vW.y)) * (.92 + .08 * dot(vN, vec3(.45, 0., .89)));
    if (part > 5.2 && part < 5.4) {
      // A ROOM'S FLOOR AND WALLS ARE NEVER ONE FLAT TONE (round four). vC: metres along the wall from the room's
      // middle, metres in from its front, its depth, its half width
      float din = clamp(vC.y / max(vC.z, .5), 0., 1.), ax = abs(vC.x) / max(vC.w, .5);
      // (round ten: A FURNISHED ROOM IS SHADED BY ITS OWN LAMP, which stands on its desk 1 m to one hand of its
      // middle, half way in, 2.8 m up: warm and bright near it, a shade deeper toward the corners)
      vec3 dlp = vec3(vC.x + 1., vW.y - 2.8, vC.y - (.5 * vC.z + .3));
      float lgR = step(vC.w, 3.) * step(3., vC.z), lg = exp(-dot(dlp, dlp) / 20.);
      // (a niche is shaded by the lamp on its own back wall, 4.6 m up)
      vec3 dln = vec3(vC.x, vW.y - 4.6, vC.y - vC.z);
      float lgN = step(vC.z, 3.) * exp(-dot(dln, dln) / 7.);
      if (up > .5) {
        // the carpet: tiles of 0.9 m laid as a check of two near tones, a darker border along the walls; the room's
        // light lies in a pool in its middle and the floor falls to shade toward the back and into the corners
        vec2 tl = vC.xy / .9, tw = fwidth(tl);
        float chk = mod(floor(tl.x) + floor(tl.y), 2.) - .5, fade = 1. - smoothstep(.2, .8, max(tw.x, tw.y));
        float edge = min(min(vC.w - abs(vC.x), vC.y + .4), vC.z - vC.y);
        tone = .86 * (1. + .11 * chk * fade) * (1. - .17 * (1. - smoothstep(.4, .55, edge))) * (1.05 - .3 * din * din - .1 * ax * ax);
        tone += .07 * exp(-(ax * ax * 2.5 + (din - .45) * (din - .45) * 7.));
        tone = mix(tone, tone * (.8 + .34 * lg), lgR); alb *= 1. + lgR * vec3(.2, .1, -.04) * lg;
      } else if (up > -.5) {
        // a wall: a skirting 0.28 m high, panel joints every 2.4 m down a side wall, shade toward the back; the back
        // wall is brightest in its middle
        float isBack = step(vC.z - vC.y, .01), jd = (.5 - abs(fract(vC.y / 2.4) - .5)) * 2.4, jw = max(fwidth(vC.y), .004);
        float joint = clamp((.022 - jd) / jw + .5, 0., 1.) * clamp(.07 / jw, 0., 1.) * (1. - isBack);
        tone *= (1. - .13 * joint) * (1. - .3 * (1. - smoothstep(.26, .3, vW.y))) * mix(1.04 - .24 * din, .93 + .1 * exp(-ax * ax * 3.), isBack);
        // (a furnished room's wall: a dado 1.15 m high in a deeper tone, a pale rail on it)
        float dado = lgR * (1. - isBack) * (1. - smoothstep(1.15, 1.15 + max(fwidth(vW.y), .004), vW.y)), rail = lgR * (1. - isBack) * (1. - smoothstep(.04, .04 + max(fwidth(vW.y), .004), abs(vW.y - 1.19)));
        tone = mix(tone, tone * (.76 + .4 * lg), lgR) * (1. - .14 * dado) + .08 * rail; alb *= 1. + lgR * vec3(.22, .12, -.04) * lg;
        tone *= 1. - step(vC.z, 3.) * (.24 - .42 * lgN); alb *= 1. + vec3(.2, .1, -.04) * lgN;
      } else {
        // its ceiling (round eight; round eleven c): SLIM BARS OF LIGHT IN THE WEAVE, one to a cell 4.5 m broad and 3 m
        // deep: each 2 m long and 0.56 m broad, across the room in one cell and from front to back in the next, the
        // same wave over them (a narrow room has one file of cells, down its middle; no bar's middle stands nearer a
        // wall than 1.3 m, so that none touches one). No round light.
        float ci = vC.w < 3.15 ? 0. : floor(vC.x / 4.5), cs = vC.w < 3.15 ? 0. : (ci + .5) * 4.5, cj = floor(vC.y / 3.), cd = (cj + .5) * 3., sw = max(length(fwidth(vC.xy)), .004);
        vec2 qr = vec2(vC.x - cs, vC.y - cd), qb = abs(mod(ci + cj, 2.) < .5 ? qr : qr.yx) - vec2(1., .28);
        float face = (1. - smoothstep(-sw, sw, max(qb.x, qb.y))) * step(1.3, cd) * step(cd, vC.z - 1.3) * step(1.3, vC.w - abs(cs)), kr = waveHump(vW.x + vW.z);
        tone = .9 * (1. - face); add = vec3(1., .98, .94) * (1.05 + 2.3 * kr * sqrt(max(kr, 0.))) * face;
      }
    }
  } else {
    // the ceiling
    #ifdef HALL
    // (HALL TWO'S CEILING CARRIES NO LIGHT (round eleven f): plain white; round the great opening a shade deeper: its
    // thickness is felt before the reveal is seen)
    tone = .66 * (1. - .14 * uLat.z * (1. - smoothstep(42., 48., length(a - vec2(-98., -292.)))));
    // (round eleven) THE SEA'S LIGHT ON THE CEILING: the swell throws the hall's light back up. The ceiling takes the
    // carpet's blue as a pale cast, and on it plays A NET OF WHITER LIGHT, as under a bridge over water: two families
    // of soft curved lines about 7 m apart that cross and drift (by place and clock), strongest in a band over every
    // crest of the long swell, which runs with the crest (the tide's own first train). Far off, where a pixel
    // reaches over the net, ITS OWN MEAN (${Ha.toFixed(4)}: NET_MEAN, counted from this law). A ceiling over a sea is never
    // plain white.
    {
      float t1 = ${wt[0].kx.toFixed(5)} * a.x + ${wt[0].kz.toFixed(5)} * a.y - ${wt[0].w.toFixed(5)} * uTime + ${wt[0].ph.toFixed(2)};
      float sea = smoothstep(-.2, 1., sin(t1));
      vec2 q = a / 2.2;
      float tt = uTime * .45;
      float c1 = sin(q.x + .6 * q.y + tt + 1.3 * sin(.9 * q.y - .35 * q.x + .7 * tt));
      float c2 = sin(1.1 * q.y - .55 * q.x - .8 * tt + 1.3 * sin(.8 * q.x + .3 * q.y + .5 * tt));
      float n1 = 1. - abs(c1), n2 = 1. - abs(c2);
      float net = min(n1 * n1 * n1 + n2 * n2 * n2, 1.);
      net = mix(net, ${Ha.toFixed(4)}, smoothstep(1.2, 4.5, fa)) * (.4 + .6 * sea);
      alb = mix(alb, vec3(.42, .62, 1.), .6 * (1. - net));
      tone *= 1. + .08 * net;
    }
    #else
    // (A FLOWN CORRIDOR'S CEILING IS PLAIN BETWEEN ITS COVES (round eleven f): no light fitting stands in it. It takes
    // its share of the cove's light: the cove's own at the cove's head, a quarter less of that ${Ae.ceil[2].toFixed(0)} m in from it;
    // where the ceiling runs out to the glass (part 4.2) A SOFT COVE OF LIGHT lies along the glass's head, in the
    // cove's own share at its spring and by its law)
    float din = max(uSec.x - ${F.COVE.toFixed(1)} - abs(a.y), 0.), cove = part > 4.1 ? exp(-max(uSec.x - a.y, 0.) / .55) : 0.;
    tone = coveShade(mix(${Ae.ceil[0].toFixed(4)} * (1. - ${Ae.ceil[1].toFixed(4)} * smoothstep(0., ${Ae.ceil[2].toFixed(1)}, din)), ${Ae.cove[0].toFixed(4)}, .85 * cove), Kc);
    #endif
  }
  col = alb * lit(tone) + add;
  #ifdef OPEN
  // (an open street stands in the great hall's air)
  gl_FragColor = vec4(nightAir(col, cameraPosition, -toEye), 1.);
  #else
  gl_FragColor = vec4(mix(col, uFogIn, 1. - exp(-dist * uFogKIn)), 1.);
  #endif
  // EVERY CEILING IS ONE-SIDED: an eye that stands above a ceiling (or any face that looks down) does not see it
  if ((vN.y < -.5 || (part > 2.5 && part < 4.5)) && cameraPosition.y > vW.y + .2) discard;
}`;function lo(e,o,a,r,u,n,t){return new x.ShaderMaterial({uniforms:{uLampW:{value:Array.from({length:64},()=>new x.Vector2(0,0))},uLampY:{value:3.9},uGate:{value:new x.Vector4(1e6,0,0,0)},uRing:{value:new x.Vector2(0,0)},uGalQ:{value:-1},uOpenL:{value:0},uCarpet:{value:0},uBlueA:{value:new x.Vector3},uBlueB:{value:new x.Vector3},uSeam:{value:new x.Vector3},uPool:{value:new x.Vector3(0,0,0)},uStd:{value:new x.Vector3(0,0,0)},uSto:{value:Array.from({length:10},()=>new x.Vector3(.16,.33,.78))},uTime:e,uSky:t,uSec:{value:new x.Vector4(...o)},uLat:{value:new x.Vector4(...a||[0,0,0,0])},uFogIn:{value:new x.Vector3(...q("#f4f3ee",.92))},uFogKIn:{value:r},uSpill:{value:j0.map(s=>new x.Vector3(...s))},uLeaf:{value:new x.Vector3(...n||oe)}},defines:a?{HALL:1}:u?{OPEN:1}:{},vertexColors:!0,side:x.DoubleSide,vertexShader:K0,fragmentShader:U0})}const Je=(()=>{const e=F.LOBBY,o=e.x1-F.CW,a=Math.round((o-e.x0)/6),r=(o-e.x0)/a;return{n:a,pitch:r,w:.6*r,h:.6*e.h,deep:2.2,at:u=>e.x0+(u+.5)*r}})(),Y0=8,Pe={hw:.75,gap:.45,bench:1.2,first:3,every:4,least:2};Pe.hb=Pe.hw+Pe.gap+Pe.bench;const qa=(()=>{const e=F.LOBBY,o=Pe.hb,a=[],r=[];for(let n=0;n<=se.mouth;n+=.5)r.push(we(n));const u=(n,t,s)=>Math.min(...r.map(l=>Math.hypot(Math.max(n-l[0],0,l[0]-t),Math.max(s-o-l[1],0,l[1]-s-o))));for(let n=Pe.first;e.z0+6*n+o<e.z1;n+=Pe.every){const t=e.z0+6*n,s=e.x0+6;let l=Math.floor((e.x1-s)/6);for(;l>=Pe.least&&u(s,s+6*l,t)<Y0;)l--;l>=Pe.least&&a.push({x0:s,x1:s+6*l,z:t})}return a})();function Q0(){const e=F.LOBBY,o=[],a=[],r=[],u=e.h,n=F.CH,t=(L,M,B)=>{for(const I of[0,1,2,0,2,3])o.push(L[I][0],L[I][1],L[I][2]),a.push(M[0],M[1],M[2]),r.push(B)},s=(L,M,B,I,p,O,H=1)=>t([[L,I,M],[L,I,B],[L,p,B],[L,p,M]],[O,0,0],H),l=(L,M,B,I,p,O,H=1)=>t([[M,I,L],[B,I,L],[B,p,L],[M,p,L]],[0,0,O],H),c=(L,M,B,I,p,O,H)=>t([[M,L,I],[B,L,I],[B,L,p],[M,L,p]],[0,O,0],H),i=Je,b=e.z0-i.deep,y=[0,n,i.h,u],w=[e.x0];for(let L=0;L<i.n;L++)w.push(i.at(L)-i.w/2,i.at(L)+i.w/2);w.push(e.x1-F.CW,e.x1);for(let L=0;L+1<w.length;L++)c(0,w[L],w[L+1],e.z0,e.z1,1,0),c(u,w[L],w[L+1],e.z0,e.z1,-1,2);for(let L=0;L<3;L++){const M=y[L],B=y[L+1];s(e.x0,e.z0,e.z1,M,B,1),s(e.x1,e.glassS,e.z1,M,B,-1),L>0&&s(e.x1,e.z0,e.glassN,M,B,-1);for(let I=0;I+1<w.length;I++){l(e.z1,w[I],w[I+1],M,B,-1);const p=I%2===1&&I<2*i.n,O=I===w.length-2;(p?L===2:!O||L>0)&&l(e.z0,w[I],w[I+1],M,B,1),p&&L<2&&(l(b,w[I],w[I+1],M,B,1,5),s(w[I],b,e.z0,M,B,1,5),s(w[I+1],b,e.z0,M,B,-1,5))}}for(let L=0;L<i.n;L++)c(i.h,w[2*L+1],w[2*L+2],b,e.z0,-1,5),c(0,w[2*L+1],w[2*L+2],b,e.z0,1,5);const h=(L,M,B,I,p,O)=>{s(L,p,O,B,I,-1,3),s(M,p,O,B,I,1,3),O-p<1?(l(p,L,M,B,I,-1,3),l(O,L,M,B,I,1,3)):(c(I,L,M,p,O,1,3),c(B,L,M,p,O,-1,3))};for(let L=0;L<=Math.round((e.glassS-e.glassN)/e.bay);L++){const M=e.glassS-L*e.bay;h(e.x1-.03,e.x1+.03,0,u,M-.03,M+.03)}h(e.x1-.04,e.x1+.04,0,.1,e.glassN,e.glassS),h(e.x1-.04,e.x1+.04,u-.1,u,e.glassN,e.glassS),h(e.x1-.03,e.x1+.03,n-.03,n+.03,e.glassN,e.glassS);const v=we(0),m=-v[3],f=v[2];t([[v[0]-18*m,-16,v[1]-18*f],[v[0]+18*m,-16,v[1]+18*f],[v[0]+18*m,-.03,v[1]+18*f],[v[0]-18*m,-.03,v[1]-18*f]],[-f,0,m],4);const g=new x.BufferGeometry;return g.setAttribute("position",new x.Float32BufferAttribute(o,3)),g.setAttribute("normal",new x.Float32BufferAttribute(a,3)),g.setAttribute("aK",new x.Float32BufferAttribute(r,1)),g}const Z0=`
attribute float aK;
varying vec3 vW; varying vec3 vN; varying float vK;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normal; vK = aK; gl_Position = projectionMatrix * viewMatrix * w; }`,X0=`
varying vec3 vW; varying vec3 vN; varying float vK;
uniform vec3 uFogIn;
${it}${bt}${ao}${Wa}
const vec4 LB = vec4(${F.LOBBY.x0.toFixed(1)}, ${F.LOBBY.z0.toFixed(1)}, ${F.LOBBY.x1.toFixed(1)}, ${F.LOBBY.z1.toFixed(1)});
const float LH = ${F.LOBBY.h.toFixed(1)}, GN = ${F.LOBBY.glassN.toFixed(1)}, GS = ${F.LOBBY.glassS.toFixed(1)};
const vec2 HERO = vec2(${F.CORE.x.toFixed(1)}, ${F.CORE.z.toFixed(1)});
// (the north wall's rank: its pitch, a niche's height and depth; the floor's bands: their breadth)
const float NP = ${Je.pitch.toFixed(4)}, NH = ${Je.h.toFixed(2)}, ND = ${Je.deep.toFixed(2)}, BW = 1.5;
const vec3 STONE = vec3(.9, .885, .86);
// THE CEILING'S LIGHTS (round eleven c): SLIM BARS IN THE SLAB'S OWN WEAVE, on the lattice of 6 m: in each cell one
// bar 1 m wide and 4 m long, its ends soft; along x in one cell, along z in the next, turn about (the cell's two
// numbers, summed: even or odd). The bar of the cell (ci) at p. x: how much of a pixel that reaches e (along x,
// along z) its face fills; far off the bars' own mean, a ninth. y: its light by the wave. z: the metres to its
// recess's edge, under nought inside it. w: the metres to its middle line.
const float BC = 6., BSOFT = ${(6*Wt.soft).toFixed(4)};
const vec2 BHB = vec2(${(6*Wt.long/2).toFixed(4)}, ${(6*Wt.wide/2).toFixed(4)});
vec4 barCell(vec2 p, vec2 ci, vec2 e){
  vec2 c = (ci + .5) * BC + LB.xy, r = p - c;
  bool ax = mod(ci.x + ci.y, 2.) < .5;
  vec2 q = ax ? r : r.yx, f = ax ? e : e.yx, d = abs(q) - BHB - vec2(.5 * BSOFT, 0.);
  float face = weaveBar(q, BHB, vec2(sqrt(f.x * f.x + BSOFT * BSOFT), f.y), smoothstep(BSOFT, 2. * BSOFT, f.x));
  face = mix(face, ${(Wt.long*Wt.wide).toFixed(5)}, smoothstep(.35 * BC, .9 * BC, max(e.x, e.y)));
  return vec4(face, waveHump(c.x + c.y), length(max(d, 0.)) + min(max(d.x, d.y), 0.), length(vec2(max(abs(q.x) - BHB.x, 0.), q.y)));
}
vec4 barNear(vec2 p, vec2 e){ return barCell(p, floor((p - LB.xy) / BC), e); }
// (the metres of band between 0 and t: bands BW broad, one in every 6 m, each beginning on a multiple of 6)
float bandI(float t){ float k = floor(t / 6.); return k * BW + min(t - 6. * k, BW); }
// (the metres from p to the ground a planter and its benches stand on: nought inside it)
float groundOut(vec2 p, vec4 b){ return length(max(max(b.xy - p, p - b.zw), 0.)); }
void main(){
  vec3 toEye = cameraPosition - vW;
  float dist = length(toEye), fw = max(length(fwidth(vW)), .01);
  vec3 v = toEye / max(dist, 1e-3), col;
  if (vK < .5) {
    // THE STONE'S POLISH: the eye's ray, turned at the floor, meets the ceiling and its lights, a wall, or goes out
    // through the glass: the slab's grid of lights, the hero's lit storeys, low down the court's lit range
    vec3 r = reflect(-v, vec3(0., 1., 0.));
    r.y = max(r.y, .03);
    float tc = LH / r.y, tg = r.x > 1e-4 ? (LB.z - vW.x) / r.x : 1e9, yg = r.y * tg, zg = vW.z + r.z * tg;
    vec2 pc = vW.xz + r.xz * tc;
    vec3 seen;
    if (tg < tc && zg < GS && zg > GN) {
      float tS = 96. / r.y;
      vec2 pS = vW.xz + r.xz * tS, sl = slabLights(pS, dFdx(pS), dFdy(pS));
      seen = SLAB_NEAR * 1.6 + SLAB_LIGHT * sl.x + SLAB_BLUE * sl.y;
      // (the hero's pile as it stands: three tiers, its west face plumb: in the stone it is a grid of warm lit
      // windows between dark plates and posts, as the pile itself is)
      vec2 rd = vec2(abs(r.x) < 1e-4 ? 1e-4 : r.x, abs(r.z) < 1e-4 ? 1e-4 : r.z);
      // (the first of the three tiers that the ray meets: the height and the place along its face where it meets
      // it; what is drawn there is worked out after the loop, which holds no early way out and no pixel's reach)
      float hyH = -1., alH = 0.;
      for (int k = 0; k < 3; k++) {
        float hh = k == 0 ? 50. : k == 1 ? 38. : 27., ya = k == 0 ? 0. : k == 1 ? 40. : 70., yb = k == 0 ? 40. : k == 1 ? 70. : 96.;
        vec2 o = vec2(HERO.x - 50. + hh, HERO.y) - vW.xz, ta = (o - hh) / rd, tb = (o + hh) / rd, t0 = min(ta, tb), t1 = max(ta, tb);
        float tn = max(t0.x, t0.y), hy = r.y * tn;
        if (hyH < 0. && tn > 0. && tn < min(t1.x, t1.y) && hy >= ya && hy < yb) { hyH = hy; alH = t0.x > t0.y ? vW.z + r.z * tn : vW.x + r.x * tn; }
      }
      float fh = max(fwidth(hyH), .05) + .5, fa = max(fwidth(alH), .05) + .35;
      if (hyH >= 0.) {
        float hs = hyH - 8., fl = floor(max(hs, 0.) / 10.), st = hs - 10. * fl;
        float plate = hs < 0. ? 0. : max(1. - smoothstep(2. - fh, 2. + fh, st), smoothstep(10. - fh, 10., st));
        // (the bays' posts, 4 m apart along the face the ray meets: with the plates they make a grid of lit windows)
        float post = (1. - smoothstep(.3, .3 + fa, abs(fract(alH / 4.) - .5) * 4.)) * clamp(1.2 / fa, 0., 1.);
        seen = mix(seen, mix(lit3(vec3(.95, .88, .74) * .82), lit3(vec3(.2, .26, .5)), max(.8 * plate, .7 * post)), .6);
      }
      seen = mix(seen, vec3(.1, .12, .26), step(r.y * (tg + 24. / max(abs(r.x), 1e-3)), 5.));
      // (the glass's posts stand in the mirror as fine pale lines)
      float pz = abs(fract((GS - zg) / ${F.LOBBY.bay.toFixed(1)} + .5) - .5) * ${F.LOBBY.bay.toFixed(1)}, pw = max(.75 * fwidth(zg), .02);
      seen = mix(seen, vec3(lit(.7)), .6 * (1. - smoothstep(.03, .03 + pw, pz)) * clamp(.12 / pw, 0., 1.));
    } else if (pc.x > LB.x && pc.x < LB.z && pc.y > LB.y && pc.y < LB.w) {
      vec4 dn = barNear(pc, max(1.5 * fwidth(pc), vec2(.02)));
      seen = mix(vec3(lit(.69)), vec3(1., .98, .94) * (.8 + 2.1 * dn.y * sqrt(dn.y)), dn.x);
    } else {
      // (a white wall: by the height at which the ray meets it)
      float tx = r.x > 0. ? (LB.z - vW.x) / max(r.x, 1e-4) : (LB.x - vW.x) / min(r.x, -1e-4), tz = r.z > 0. ? (LB.w - vW.z) / max(r.z, 1e-4) : (LB.y - vW.z) / min(r.z, -1e-4);
      // (round eleven: the wall stands in the stone as it is: its skirting's shade at its foot, the line of warm light
      // at the corridor's ceiling height and the wash over and under that line)
      float yw = r.y * min(tx, tz), dyw = yw - ${F.CH.toFixed(1)}, fwy = max(fwidth(yw), .02);
      float lw = clamp((.08 - abs(dyw)) / fwy + .5, 0., 1.) * clamp(.16 / fwy, .45, 1.);
      float tw = .63 + .19 * smoothstep(0., LH, yw) + .07 * exp(-abs(dyw) / (dyw > 0. ? 1.6 : .8)) - .2 * (1. - smoothstep(0., 1.1, yw));
      seen = vec3(lit(min(tw, .9))) * (1. - lw) + vec3(1., .9, .7) * 1.1 * lw;
    }
    // THE STONE ITSELF (round eleven b): PALE AND POLISHED, in slabs of 3 m with a fine joint. BROAD INLAID BANDS of a
    // deeper stone cross the hall from the west wall to the glass, one on every line of the ceiling's lattice
    // (BW m broad in every 6 m: their own mean is a quarter of the floor; the band is counted over the pixel's
    // own reach, so far off it settles to that mean). A SOFT LIGHTER BAR lies under each bar of the ceiling's
    // weave (round eleven c: the bars of the four cells nearest the place, summed, so that no edge stands where
    // one cell ends: a soft patch about each bar's middle line, three times as long as it is broad). THE
    // COURT'S BLUE comes in across the floor from the glass: cool near the glass, warm toward the walls. A shade
    // at the foot of each wall and round each planter.
    float R = .05 + .5 * pow(clamp(1. - v.y, 0., 1.), 3.);
    float ew = min(min(vW.x - LB.x, vW.z - LB.y), LB.w - vW.z), ao = .74 + .26 * smoothstep(0., 2., ew);
    vec2 tj = (.5 - abs(fract((vW.xz - LB.xy) / 3.) - .5)) * 3.;
    float jw = max(fw, .01), jt = max(clamp((.012 - tj.x) / jw + .5, 0., 1.), clamp((.012 - tj.y) / jw + .5, 0., 1.)) * clamp(.05 / jw, 0., 1.);
    float zl = vW.z - LB.y + .5 * BW, wz = max(fwidth(vW.z), 1e-3), band = clamp((bandI(zl + .5 * wz) - bandI(zl - .5 * wz)) / wz, 0., 1.);
    float pool = 0.;
    {
      vec2 c0 = floor((vW.xz - LB.xy) / BC - .5);
      for (int i = 0; i < 4; i++) {
        vec4 bn = barCell(vW.xz, c0 + vec2(float(i - 2 * (i / 2)), float(i / 2)), vec2(.02));
        pool += exp(-bn.w * bn.w / 1.6) * (.6 + .4 * bn.y);
      }
    }
    float cool = exp(-max(LB.z - vW.x, 0.) / 15.) * smoothstep(GN - 8., GN, vW.z) * (1. - smoothstep(GS, GS + 8., vW.z));
    float dP = 1e9;
    ${qa.map(e=>`dP = min(dP, groundOut(vW.xz, vec4(${e.x0.toFixed(2)}, ${(e.z-Pe.hb).toFixed(2)}, ${e.x1.toFixed(2)}, ${(e.z+Pe.hb).toFixed(2)})));`).join(`
    `)}
    vec3 stone = mix(STONE, vec3(.7, .675, .64), band) * (1. - .1 * jt), glassLight = mix(vec3(1., .975, .93), vec3(.7, .79, 1.03), .62 * cool);
    col = lit3(min(stone * glassLight * (.84 * ao * (1. - .32 * exp(-dP / .9)) + .14 * pool), vec3(.9))) * (1. - R) + R * seen;
  } else if (vK < 1.5) {
    // a wall: white, a shade deeper toward the floor, brightest under the ceiling's lights; fine upright joints;
    // a skirting half a metre high; ROUND THE WHOLE HALL, AT THE CORRIDOR'S CEILING HEIGHT, ONE FINE LINE OF WARM
    // LIGHT in a slim groove, which washes the wall over it and under it (it goes with the lights' one law)
    float y = vW.y, al = abs(vN.x) > .5 ? vW.z - LB.y : vW.x - LB.x;
    float tone = .63 + .19 * smoothstep(0., LH, y) + .06 * exp(-max(LH - y, 0.) / 2.5) - .2 * (1. - smoothstep(0., 1.1, y));
    // (the north wall's joints stand in the middles of its rank's piers; every other wall's every 6 m)
    float pit = vN.z > .5 && vW.z < LB.y + .5 ? NP : 6.;
    float ja = (.5 - abs(fract(al / pit) - .5)) * pit, jw = max(fw, .01);
    float joint = max(clamp((.02 - ja) / jw + .5, 0., 1.), clamp((.02 - abs(y - ${F.CH.toFixed(1)})) / jw + .5, 0., 1.)) * clamp(.06 / jw, 0., 1.);
    tone *= (1. - .11 * joint) * (1. - .06 * (1. - smoothstep(.5, .5 + jw, y)));
    // (the ceiling's lights nearest the wall wash it: a scallop under each, narrow at the head and widening down)
    float lc = (floor(al / 6.) + .5) * 6., wsc = 1.1 + .32 * max(LH - y, 0.), dsc = al - lc;
    tone += .085 * exp(-dsc * dsc / (wsc * wsc)) * exp(-max(LH - y, 0.) / 8.) * (.6 + .4 * waveHump(vW.x + vW.z + (lc - al)));
    float dyc = y - ${F.CH.toFixed(1)}, lineL = clamp((.08 - abs(dyc)) / jw + .5, 0., 1.) * clamp(.16 / jw, .45, 1.), kl = .6 + .4 * waveHump(vW.x + vW.z);
    tone += .07 * exp(-abs(dyc) / (dyc > 0. ? 1.6 : .8)) * kl;
    if (abs(vN.y) > .5) { tone = .6; lineL = 0.; }
    col = vec3(${oe.map(e=>e.toFixed(4)).join(", ")}) * vec3(.975, .985, 1.01) * lit(min(tone, .9)) * (1. - lineL) + vec3(1., .9, .7) * (.9 + .5 * kl) * lineL;
  } else if (vK < 2.5) {
    // the ceiling: each bar of the weave set up into it with a dark rim and a pale halo; fine joints on the lattice's lines
    vec4 dn = barNear(vW.xz, max(fwidth(vW.xz), vec2(.004)));
    vec2 jl = (.5 - abs(fract((vW.xz - LB.xy) / 6.) - .5)) * 6.;
    float face = dn.x, rim = (1. - smoothstep(.16 - fw, .16 + fw, dn.z)) * smoothstep(-fw, fw, dn.z) * (1. - smoothstep(.1, .5, fw));
    float halo = 1. - smoothstep(0., 2., dn.z), jw = max(fw, .01), joint = clamp((.03 - min(jl.x, jl.y)) / jw + .5, 0., 1.) * clamp(.09 / jw, 0., 1.);
    col = vec3(${oe.map(e=>e.toFixed(4)).join(", ")}) * lit((.69 + .1 * halo) * (1. - .3 * rim) * (1. - .1 * joint)) * (1. - face) + vec3(1., .98, .94) * (.95 + 2.3 * dn.y * sqrt(dn.y)) * face;
  } else if (vK < 3.5) col = vec3(.86, .85, .8) * lit(.8 + .1 * abs(vN.z));
  else if (vK < 4.5) col = STONE * lit(.5);
  else {
    // A NICHE OF THE NORTH WALL'S RANK (round eleven b): white, LIT SOFTLY FROM ABOVE by a slot of light in its head
    // along its back wall (it goes with the lights' one law): the back wall brightest under the slot and a shade
    // deeper toward the floor, the flanks a tone deeper, the floor pale stone with a soft shade round the tub
    float nb = (vW.x - LB.x) / NP, nx = (fract(nb) - .5) * NP, din = LB.y - vW.z, y = vW.y;
    float kl = .6 + .4 * waveHump(LB.x + (floor(nb) + .5) * NP + LB.y), wash = exp(-max(NH - y, 0.) / 5.5) * kl, e5 = max(fw, .01);
    vec3 white = vec3(${oe.map(e=>e.toFixed(4)).join(", ")}) * vec3(.975, .985, 1.01);
    if (vN.y < -.5) {
      float slot = clamp((din - (ND - .5)) / e5 + .5, 0., 1.) * (1. - clamp((din - (ND - .12)) / e5 + .5, 0., 1.));
      col = white * lit(.64) * (1. - slot) + vec3(1., .95, .84) * (.9 + .6 * kl) * slot;
    } else if (vN.y > .5) {
      col = STONE * lit(.66 * (1. - .3 * exp(-max(length(vec2(nx, din - ND * .5)) - .7, 0.) / .5)));
    } else {
      float tone = abs(vN.x) > .5 ? .46 + .2 * wash + .08 * din / ND : .56 + .37 * wash;
      col = mix(white, vec3(1., .94, .82), .5 * wash) * lit(min(tone * (1. - .16 * (1. - smoothstep(0., 1.2, y))), .9));
    }
  }
  gl_FragColor = vec4(mix(col, uFogIn, 1. - exp(-dist / 520.)), 1.);
  if (vK > 1.5 && vK < 2.5 && cameraPosition.y > vW.y + .2) discard;
}`;function ue(){const e=[],o=[],a=[],r=[],u=[];let n=0,t=0,s=0,l=1,c=0,i=1;const b=[9,9,18,18],y={at(w=0,h=0,v=0,m=0,f=1){return n=w,t=h,s=v,l=Math.cos(m),c=Math.sin(m),i=f,y},v(w,h,v,m,f=b){u.push(f[0]*i,f[1]*i,f[2]*i,f[3]*i),e.push(n+(w[0]*l+w[2]*c)*i,t+w[1]*i,s+(-w[0]*c+w[2]*l)*i),o.push(h[0]*l+h[2]*c,h[1],-h[0]*c+h[2]*l),a.push(v[0],v[1],v[2]),r.push(m)},quad(w,h,v,m,f,g,L=0){const M=Math.hypot(h[0]-w[0],h[1]-w[1],h[2]-w[2]),B=Math.hypot(m[0]-w[0],m[1]-w[1],m[2]-w[2]),I=[0,0,M,B],p=[M,0,M,B],O=[M,B,M,B],H=[0,B,M,B];return y.v(w,f,g,L,I),y.v(h,f,g,L,p),y.v(v,f,g,L,O),y.v(w,f,g,L,I),y.v(v,f,g,L,O),y.v(m,f,g,L,H),y},tri(w,h,v,m,f,g=0){return y.v(w,m,f,g),y.v(h,m,f,g),y.v(v,m,f,g),y},box(w,h,v,m,f,g,L,M=0,B=!1){return y.quad([w,m,f],[h,m,f],[h,m,g],[w,m,g],[0,1,0],L,M),y.quad([w,v,f],[h,v,f],[h,m,f],[w,m,f],[0,0,-1],L,M),y.quad([w,v,g],[h,v,g],[h,m,g],[w,m,g],[0,0,1],L,M),y.quad([w,v,f],[w,v,g],[w,m,g],[w,m,f],[-1,0,0],L,M),y.quad([h,v,f],[h,v,g],[h,m,g],[h,m,f],[1,0,0],L,M),B&&y.quad([w,v,f],[h,v,f],[h,v,g],[w,v,g],[0,-1,0],L,M),y},cyl(w,h,v,m,f,g,L,M=0,B=10,I=1,p=null,O=null){const H=(v-m)/Math.max(Math.hypot(v-m,g-f),1e-6),U=Math.sqrt(Math.max(1-H*H,0));for(let j=0;j<B;j++){const X=j/B*Math.PI*2,J=(j+1)/B*Math.PI*2,Y=Math.cos(X),ie=Math.sin(X),re=Math.cos(J),me=Math.sin(J),ze=[w+v*Y,f,h+v*ie],he=[w+v*re,f,h+v*me],Ie=[w+m*re,g,h+m*me],Be=[w+m*Y,g,h+m*ie],Ne=[Y*U,H,ie*U],ke=[re*U,H,me*U];y.v(ze,Ne,L,M),y.v(he,ke,L,M),y.v(Ie,ke,L,M),y.v(ze,Ne,L,M),y.v(Ie,ke,L,M),y.v(Be,Ne,L,M),I&1&&y.tri([w,g,h],Be,Ie,[0,1,0],p||L,O===null?M:O),I&2&&y.tri([w,f,h],ze,he,[0,-1,0],p||L,O===null?M:O)}return y},lathe(w,h,v,m,f=12,g=0){const L=v.map((M,B)=>{const I=v[Math.max(B-1,0)],p=v[Math.min(B+1,v.length-1)],O=p[0]-I[0],H=p[1]-I[1],U=Math.hypot(O,H)||1;return[H/U,-O/U]});for(let M=0;M<v.length-1;M++)for(let B=0;B<f;B++){const I=B/f*Math.PI*2,p=(B+1)/f*Math.PI*2,O=Math.cos(I),H=Math.sin(I),U=Math.cos(p),j=Math.sin(p),[X,J]=v[M],[Y,ie]=v[M+1],re=L[M],me=L[M+1],ze=m[M],he=m[M+1],Ie=[w+X*O,J,h+X*H],Be=[w+X*U,J,h+X*j],Ne=[w+Y*U,ie,h+Y*j],ke=[w+Y*O,ie,h+Y*H],Mt=[O*re[0],re[1],H*re[0]],Ht=[U*re[0],re[1],j*re[0]],Pt=[U*me[0],me[1],j*me[0]],mo=[O*me[0],me[1],H*me[0]];y.v(Ie,Mt,ze,g),y.v(Be,Ht,ze,g),y.v(Ne,Pt,he,g),y.v(Ie,Mt,ze,g),y.v(Ne,Pt,he,g),y.v(ke,mo,he,g)}return y},get triangles(){return e.length/9},build(){const w=new x.BufferGeometry;return w.setAttribute("position",new x.Float32BufferAttribute(e,3)),w.setAttribute("normal",new x.Float32BufferAttribute(o,3)),w.setAttribute("color",new x.Float32BufferAttribute(a,3)),w.setAttribute("aE",new x.Float32BufferAttribute(r,1)),w.setAttribute("aF",new x.Float32BufferAttribute(u,4)),w},async buildLong(w){const h=new x.BufferGeometry;return h.setAttribute("position",new x.Float32BufferAttribute(e,3)),await w.yield(),h.setAttribute("normal",new x.Float32BufferAttribute(o,3)),await w.yield(),h.setAttribute("color",new x.Float32BufferAttribute(a,3)),await w.yield(),h.setAttribute("aE",new x.Float32BufferAttribute(r,1)),h.setAttribute("aF",new x.Float32BufferAttribute(u,4)),h}};return y}const J0=`
attribute float aE;
attribute vec4 aF;
#ifdef USE_INSTANCING
attribute vec4 aMove;
#endif
${it}
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying float vE; varying float vY; varying vec4 vF;
void main(){
  vec3 p = position, n = normal;
  vF = aF;
  vY = position.y;
  #ifdef USE_INSTANCING
  float k = aMove.x, ang = aMove.y * uTime + aMove.z, c = cos(ang), s = sin(ang);
  float per = max(aMove.y, .05);
  if (k < .5) { p = position; }
  else if (k < 1.5) { p.xz = vec2(p.x * c + p.z * s, -p.x * s + p.z * c); n.xz = vec2(n.x * c + n.z * s, -n.x * s + n.z * c); }
  else if (k < 2.5) { float ph = fract(aMove.z - uTime / per); p.z += aMove.w * smoothstep(0., .2, ph) * (1. - smoothstep(.4, .6, ph)); }
  else if (k < 3.5) { p.xy *= vec2(fract(aMove.w), floor(aMove.w) / 100.); p.xy = vec2(p.x * c + p.y * s, -p.x * s + p.y * c); }
  else if (k < 4.5) { float a4 = .45 * sin(ang), c4 = cos(a4), s4 = sin(a4); p.y -= aMove.w; p.yz = vec2(p.y * c4 - p.z * s4, p.y * s4 + p.z * c4); n.yz = vec2(n.y * c4 - n.z * s4, n.y * s4 + n.z * c4); p.y += aMove.w; }
  else if (k < 5.5) { float ph = fract(aMove.z - uTime / per), up = sin(3.14159265 * clamp(ph / .55, 0., 1.)); up *= up; float a5 = .9 * up * sin(ph * 19.); p.xy = vec2(p.x * cos(a5) - p.y * sin(a5), p.x * sin(a5) + p.y * cos(a5)); p.y += aMove.w * up; }
  else if (k < 6.5) { p.xz += aMove.w * vec2(sin(ang + p.y * .7), cos(ang * .8 + p.y * .5)); }
  else if (k < 7.5) { p.y += aMove.w * (.5 - .5 * cos(6.2831853 * (uTime / per + aMove.z))); }
  vec4 w = modelMatrix * instanceMatrix * vec4(p, 1.);
  vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * n);
  #else
  vec4 w = modelMatrix * vec4(p, 1.);
  vN = normalize(mat3(modelMatrix) * n);
  #endif
  vCol = color; vE = aE;
  #ifdef USE_INSTANCING
  // (kind 8: A CORRIDOR'S WALL LAMP SWELLS WITH ITS COVE: its light goes by the lights' one law at its own metre of
  // the corridor (aMove.z: the place's number in the wave there), from aMove.w of itself at rest to the whole at a
  // front; it does not move)
  if (k > 7.5 && k < 8.5) vE *= aMove.w + (1. - aMove.w) * waveHump(aMove.z);
  #endif
  #ifdef USE_INSTANCING_COLOR
  vCol *= instanceColor;
  #endif
  gl_Position = projectionMatrix * viewMatrix * w;
  vW = w.xyz;
}`,en=`
varying vec3 vW; varying vec3 vN; varying vec3 vCol; varying float vE; varying float vY; varying vec4 vF;
uniform vec3 uFogIn, uNight; uniform float uFogKIn; uniform vec4 uLamp;
${bt}${ao}${$o}
void main(){
  vec3 n = normalize(vN);
  if (!gl_FrontFacing) n = -n;
  // lit from the ceiling, a little from one side so that faces differ, a shade where it meets its floor
  float tone = (.6 + .24 * clamp(n.y, 0., 1.) + .16 * (.5 + .5 * dot(n, vec3(.38, .25, .89))) - .1 * clamp(-n.y, 0., 1.)) * (.84 + .16 * smoothstep(0., .7, vY));
  // EVERY MADE THING CARRIES ITS EDGES AND ITS GLEAM: a darker line along the edges of each flat face (4.5 cm, thinning
  // to its own share of the pixel far off), and on a top a soft gleam of the ceiling's light, stronger the flatter
  // the look (no line of light stands in it: no ceiling carries one)
  vec2 e2 = min(vF.xy, vF.zw - vF.xy);
  float ed = min(e2.x, e2.y), aw = max(fwidth(ed), .004);
  float edge = clamp((.045 - ed) / aw + .5, 0., 1.) * clamp(.09 / aw, 0., 1.);
  tone *= 1. - .3 * edge;
  vec3 toEye = cameraPosition - vW;
  float dist = length(toEye);
  vec3 ve = toEye / max(dist, 1e-3);
  float top = smoothstep(.7, .95, n.y), graze = pow(clamp(1. - ve.y, 0., 1.), 3.);
  vec3 col = vCol * lit(tone) * (1. - vE) + vCol * vE * 2.4;
  col += vec3(1., .98, .94) * top * (1. - vE) * (1. - edge) * (.03 + .2 * graze);
  // the island's great lamp: its warm pool on whatever stands under it, on the platform (uLamp: the island's place,
  // reach squared, strength)
  vec2 la = vW.xz - uLamp.xy;
  float inH1 = step(dot(la, la), 196.) * step(-1., vW.y) * step(vW.y, 9.);
  col *= 1. + uLamp.w * inH1 * vec3(.9, .64, .32) * exp(-dot(la, la) / uLamp.z) * (.35 + .65 * abs(n.y)) * (1. - vE);
  #ifdef NIGHT
  // (round nine) A THING OF THE COURT BESIDE THE CORRIDOR stands in the great hall's night: lit only by the court's
  // lamp standards (uNight: their x, one's z, their pitch along z), by the white light that falls out through the
  // gallery's glass and by its own lit faces; between lights deep blue, never black
  float dzl = mod(vW.z - uNight.y + .5 * uNight.z, uNight.z) - .5 * uNight.z, dxl = vW.x - uNight.x, d2 = dxl * dxl + dzl * dzl + (vW.y - 4.9) * (vW.y - 4.9) * .4;
  vec3 lightN = vec3(.13, .18, .4) + vec3(1., .84, .56) * 1.1 * (exp(-d2 / 30.) + .35 * exp(-d2 / 170.)) + vec3(.8, .86, 1.) * .5 * exp(-max(vW.x + 64.5, 0.) / 5.);
  // (round ten: what is green is LIT FROM BELOW, warm, as by a lamp set in its tub: the swells' under sides brightest)
  lightN += step(1.25 * max(vCol.r, vCol.b), vCol.g) * vec3(1., .88, .6) * (.3 + .9 * clamp(.3 - n.y, 0., 1.));
  col = lit3(min(vCol * lightN * (.5 + .6 * tone), vec3(.93))) * (1. - vE) + vCol * vE * 2.4;
  gl_FragColor = vec4(nightAir(col, cameraPosition, -toEye), 1.);
  #else
  #ifdef WELLAIR
  col = wellAir(col, vW, dist, vE);
  #endif
  gl_FragColor = vec4(mix(col, uFogIn, 1. - exp(-dist * uFogKIn)), 1.);
  #endif
}`;function Ct(e,o,a=0,r=!1,u=!1){return new x.ShaderMaterial({uniforms:{uTime:e,uFogIn:{value:new x.Vector3(...q("#f4f3ee",.92))},uFogKIn:{value:o},uLamp:{value:new x.Vector4(F.ISLAND.x,F.ISLAND.z,110,a)},uNight:{value:new x.Vector3(qe.x,qe.z,qe.step)}},defines:r?{WELLAIR:1}:u?{NIGHT:1}:{},vertexColors:!0,side:x.DoubleSide,vertexShader:J0,fragmentShader:en})}function De(e,o,a){const r=new x.InstancedMesh(e,o,Math.max(a.length,1)),u=new Float32Array(Math.max(a.length,1)*4),n=a.some(s=>s.col),t=new x.Color;return a.forEach((s,l)=>{r.setMatrixAt(l,s.m),u.set(s.move||[0,0,0,0],l*4),n&&r.setColorAt(l,s.col?t.setRGB(s.col[0],s.col[1],s.col[2]):t.setRGB(1,1,1))}),r.count=a.length,e.setAttribute("aMove",new x.InstancedBufferAttribute(u,4)),r.frustumCulled=!1,r}const io=q("#2a55c8"),Ee=q("#e0d7c6"),ee=q("#f1efe9"),ro=q("#2e6f75"),$=q("#9aa0a8"),le=q("#ffe0b2"),Ko=q("#3f8f58"),ht=q("#e9e6df");function co(e,o=0,a=0,r=0,u=ro,n=2.7){for(let t=0;t<5;t++)e.at(o,0,a,r+t/5*Math.PI*2).box(.1,.95,.08,.2,-.07,.07,$);e.at(o,0,a,r).cyl(0,0,.09,.09,.1,1.05,$,0,6,0).cyl(0,0,.72,.78,1.05,1.3,u,0,12,3);for(let t=0;t<4;t++){const s=Math.PI*(1.15+.7*t/4),l=Math.PI*(1.15+.7*(t+1)/4),c=(s+l)/2,i=(b,y,w)=>[w*Math.cos(b),y,w*Math.sin(b)];e.quad(i(s,1.15,.8),i(l,1.15,.8),i(l,n,.94),i(s,n,.94),[-Math.cos(c),0,-Math.sin(c)],ee)}return e.at()}function Ga(e=ro,o=2.7){return co(ue(),0,0,0,e,o).build()}const Da=q("#ffd08c");function tn(){const e=ue();return e.box(-.13,.13,-.32,.32,0,.05,$).box(-.04,.04,-.04,.04,.05,.4,$),e.cyl(0,.4,.28,.19,-.3,.3,Da,.6,10,3,Da,.8),e.build()}function on(e){const o=new x.BufferGeometry,a=[],r=[],u=[],n=(t,s,l)=>{for(const c of[0,1,2,0,2,3])a.push(t[c][0],t[c][1],t[c][2]),r.push(s[c][0],s[c][1]),u.push(l)};return n([[-3,-e+.05,.035],[3,-e+.05,.035],[3,3,.035],[-3,3,.035]],[[-3,-e+.05],[3,-e+.05],[3,3],[-3,3]],0),n([[-2.6,-e+.03,3.6],[2.6,-e+.03,3.6],[2.6,-e+.03,.02],[-2.6,-e+.03,.02]],[[-2.6,3.6],[2.6,3.6],[2.6,.02],[-2.6,.02]],1),o.setAttribute("position",new x.Float32BufferAttribute(a,3)),o.setAttribute("uv",new x.Float32BufferAttribute(r,2)),o.setAttribute("aK",new x.Float32BufferAttribute(u,1)),o}const an=`
attribute float aK, aFree;
// (aWave: a corridor's wall lamp swells with its cove: the place's number in the wave at its own metre of the
// corridor, and the share of its light it keeps at rest; a lamp that does not swell: 1)
attribute vec2 aWave;
${it}
varying vec2 vU; varying float vK; varying float vD; varying float vFree; varying float vSwell;
void main(){
  vU = uv; vK = aK; vFree = aFree;
  vSwell = aWave.y + (1. - aWave.y) * waveHump(aWave.x);
  vec4 w = modelMatrix * instanceMatrix * vec4(position, 1.);
  vD = length(w.xyz - cameraPosition);
  gl_Position = projectionMatrix * viewMatrix * w;
}`,nn=`
varying vec2 vU; varying float vK; varying float vD; varying float vFree; varying float vSwell;
uniform float uFogK, uGain;
void main(){
  float g;
  if (vK < .5) {
    // the scallop: a fan that widens up and down the wall from the lamp and thins with the height
    // (it ends where its own stretch of plain wall ends: none hangs in an opening)
    float y = vU.y, w = .5 + .5 * abs(y);
    g = exp(-vU.x * vU.x / (w * w)) * exp(-abs(y) / (y > 0. ? 1.5 : 2.3)) * (1. - smoothstep(vFree - .6, vFree, abs(vU.x)));
  } else {
    g = .8 * exp(-(vU.x * vU.x + vU.y * vU.y * .7) / 2.4) * (1. - smoothstep(2., 2.6, abs(vU.x))) * (1. - smoothstep(2.8, 3.6, vU.y));
  }
  // (laid over what is under it as: under * alpha + colour: the face loses half its cool light where the lamp's warm
  // light lies on it, so that the scallop reads on a white wall as well as on a dark floor)
  float k = clamp(uGain * g * vSwell, 0., 1.) * exp(-vD * uFogK);
  // (round seven: ON A FLOOR the lamp's light lies as a faint pale sheen; a warm pool on black stone would read as a
  // brown floor. On the wall the scallop stays warm.)
  gl_FragColor = vec4(mix(vec3(.64, .47, .23), vec3(.3, .3, .33), vK) * k, 1. - .5 * k * (1. - vK));
}`;function ja(e,o,a){const r=a.filter(t=>t[1]>e&&t[0]<o).map(t=>[t[0],t[1]]).sort((t,s)=>t[0]-s[0]),u=[];let n=e;for(const t of r.concat([[o,o]])){const s=t[0]-n;if(s>=2.4){const l=Math.max(1,Math.ceil(s/6-1e-6));for(let c=0;c<l;c++)u.push([n+(c+.5)*s/l,s/(2*l)])}n=Math.max(n,t[1])}return u}function sn(){const e=ue().at(0,0,-.95);return e.box(-2.1,2.1,1.71,1.85,-1,1,Ee,0,!0).box(-2,-1.9,0,1.71,-.9,.9,ee).box(1.9,2,0,1.71,-.9,.9,ee),e.box(-1.9,1.9,.5,1.71,-.82,-.74,ee).box(.6,1.9,0,1.71,-.1,.9,ee),e.box(-1.5,-.9,1.85,2.05,-.3,.45,[.93,.93,.9]),e.cyl(1.2,-.3,.85,.85,1.85,1.856,le,.32,10,1),Ka(e,-.3,1,Math.PI).build()}function ln(e){const o=ue().at(0,0,-.95);return o.cyl(1.3,-.4,.22,.18,1.85,1.93,$,0,8,1).box(1.27,1.33,1.93,2.75,-.43,-.37,$),e?o.cyl(1.3,-.4,.46,.46,2.45,3.05,le,.85,12,3,le,1):o.cyl(1.3,-.4,.62,.26,2.55,3.05,le,.85,10,3,le,1),o.build()}function rn(){const e=ue(),o=rt,a=o.top,r=q("#e6e2d8"),u=q("#c9c5bb"),n=q("#f4f3ee"),t=q("#c3c8cd"),s=q("#aab0b7");e.cyl(0,0,o.r+.3,o.r,F.H2.deep,a-.3,r,0,28,0).cyl(0,0,o.r,o.r-.12,a-.3,a,u,0,28,1,r),e.cyl(0,0,o.r-.7,o.r-.7,a,a+.012,At,.25,28,1).cyl(0,0,o.r-.82,o.r-.82,a+.012,a+.02,r,0,28,1);const l=(o.head-a)/(8*o.halves),c=Math.PI/180,i=103*c,b=2.4,y=o.out,w=o.out-.12,h=(I,p,O)=>[I*Math.cos(p),O,I*Math.sin(p)],v=(I,p,O,H,U=0)=>{const j=[p[0]-I[0],p[1]-I[1],p[2]-I[2]],X=Math.hypot(j[0],j[2])||1,J=[-j[2]/X,0,j[0]/X],Y=Math.hypot(j[0],j[1],j[2]),ie=[(J[1]*j[2]-J[2]*j[1])/Y,(J[2]*j[0]-J[0]*j[2])/Y,(J[0]*j[1]-J[1]*j[0])/Y],re=(me,ze,he)=>[me[0]+(J[0]*ze+ie[0]*he)*O,me[1]+(J[1]*ze+ie[1]*he)*O,me[2]+(J[2]*ze+ie[2]*he)*O];for(const[me,ze,he]of[[1,0,J],[-1,0,J.map(Ie=>-Ie)],[0,1,ie],[0,-1,ie.map(Ie=>-Ie)]]){const Ie=me?re(I,me,-1):re(I,-1,ze),Be=me?re(I,me,1):re(I,1,ze),Ne=me?re(p,me,1):re(p,1,ze),ke=me?re(p,me,-1):re(p,-1,ze);e.quad(Ie,Be,Ne,ke,he,H,U)}},m=(I,p,O,H)=>{const U=(I+p)/2,j=[Math.sin(I),0,-Math.cos(I)],X=[-Math.sin(p),0,Math.cos(p)],J=[Math.cos(U),0,Math.sin(U)];e.quad(h(o.newel,I,O),h(y,I,O),h(y,p,O),h(o.newel,p,O),[0,1,0],n),e.quad(h(o.newel,I,O-H),h(y,I,O-H),h(y,p,O-H),h(o.newel,p,O-H),[0,-1,0],t),e.quad(h(o.newel,I,O-H),h(y,I,O-H),h(y,I,O),h(o.newel,I,O),j,n),e.quad(h(o.newel,p,O-H),h(y,p,O-H),h(y,p,O),h(o.newel,p,O),X,n),e.quad(h(y,I,O-H),h(y,p,O-H),h(y,p,O),h(y,I,O),J,n)};let f=null;const g=(I,p)=>{const O=h(w,I,p),H=[O[0],p+b,O[2]];e.cyl(O[0],O[2],.05,.05,p,p+b,s,0,4,0),f&&v(f,H,.07,n),f=H};for(let I=0;I<o.halves;I++){for(let H=0;H<7;H++){const U=i+(I*180+H*22)*c,j=a+(I*8+H+1)*l;m(U,U+22*c,j,.18),g(U+11*c,j)}const p=i+(I*180+154)*c,O=a+(I*8+8)*l;m(p,p+26*c,O,.3),g(p+3*c,O),g(p+23*c,O),e.cyl(0,0,o.newel+.12,o.newel+.12,O+2,O+2.6,le,.85,14,0)}e.cyl(0,0,o.newel,o.newel,a+.02,o.head+b+.5,n,0,14,1);const L=y-.3,M=F.WELL.r+.3,B=1.3;e.box(-B,B,o.head-.3,o.head,L,M,n,0,!0);for(const I of[-1,1]){const p=I*(B-.08);for(let O=L+.2;O<M;O+=3.05)e.cyl(p,O,.05,.05,o.head,o.head+b,s,0,4,0);v([p,o.head+b,L+.2],[p,o.head+b,M-.3],.07,n),v([p,o.head+.9,L+.2],[p,o.head+.9,M-.3],.035,s)}return e.build()}function cn(){const e=ue().at(0,0,-.95);return e.box(-2.1,2.1,1.71,1.85,-1,1,Ee,0,!0).box(-2,-1.9,0,1.71,-.9,.9,ee).box(1.9,2,0,1.71,-.9,.9,ee),e.box(-1.9,1.9,.5,1.71,-.82,-.74,ee).box(.6,1.9,0,1.71,-.1,.9,ee),e.box(-1.5,-.9,1.85,2.05,-.3,.45,[.93,.93,.9]),e.cyl(1.2,-.3,.85,.85,1.85,1.856,le,.32,10,1),e.build()}function hn(){const e=ue();e.box(-6,6,1.71,1.85,-1.3,1.3,Ee,0,!0).box(-5.2,-4.9,0,1.71,-1,1,ee).box(4.9,5.2,0,1.71,-1,1,ee).box(-.15,.15,0,1.71,-1,1,ee);for(const o of[-4.2,-1.4,1.4,4.2])co(e,o,2,Math.PI),co(e,o,-2,0);return e.build()}function _a(e,o=!1){const a=q("#dfe1e2"),r=q("#7d848c");e.box(-.65,.65,0,3.6,-.8,.8,ee);for(let u=0;u<4;u++){const n=.12+u*.87,t=n+.78;e.quad([-.57,n,.81],[.57,n,.81],[.57,t,.81],[-.57,t,.81],[0,0,1],a),e.box(-.2,.2,n+.5,n+.58,.81,.88,r),o&&(e.quad([.57,n,-.81],[-.57,n,-.81],[-.57,t,-.81],[.57,t,-.81],[0,0,-1],a),e.box(-.2,.2,n+.5,n+.58,-.88,-.81,r),e.quad([.66,n,.72],[.66,n,-.72],[.66,t,-.72],[.66,t,.72],[1,0,0],a),e.quad([-.66,n,-.72],[-.66,n,.72],[-.66,t,.72],[-.66,t,-.72],[-1,0,0],a))}return e}function dn(){return _a(ue(),!0).build()}const Va=[[.1,1.45],[.9,1.7],[1.5,2.25],[1.35,2.9],[.6,3.3],[1,3.55],[1.2,4],[1,4.5],[.45,4.8],[.75,5.05],[.85,5.4],[.6,5.85],[.08,6.35]],je=q("#2f8050"),Ue=q("#72c080");function Ft(e,o,a,r=1,u=1.45,n=1,t=12){const s=Va.map(([c,i])=>[c*r,u+(i-1.45)*n]),l=Va.map(([c])=>{const i=Ze((c-.35)/1,0,1);return[je[0]+(Ue[0]-je[0])*i,je[1]+(Ue[1]-je[1])*i,je[2]+(Ue[2]-je[2])*i]});return e.lathe(o,a,s,l,t)}function ho(e){return e.cyl(0,0,.62,.85,0,1.15,ht,0,12,1,q("#5a4a3a")).cyl(0,0,.1,.07,1.15,1.5,q("#7a6248"),0,6,0),Ft(e,0,0,.82,1.3,.56)}function fn(){return ho(ue()).build()}function un(){const e=ue(),o=q("#3d7d84");e.box(-2.5,2.5,.25,1,-.95,.95,o).box(-2.5,2.5,1,2,-.95,-.5,o).box(-2.5,-2.05,1,1.5,-.5,.95,o).box(2.05,2.5,1,1.5,-.5,.95,o);for(const[a,r]of[[-2.3,-.8],[2.3,-.8],[-2.3,.8],[2.3,.8]])e.box(a-.08,a+.08,0,.25,r-.08,r+.08,$);return e.build()}function mn(){const e=ue();e.cyl(0,0,2.1,2.1,1.73,1.85,Ee,0,20,3).cyl(0,0,.9,.3,0,.3,ee,0,10,0).cyl(0,0,.25,.25,.3,1.73,ee,0,8,0);for(let o=0;o<4;o++){const a=o/4*Math.PI*2+.4;Ka(e,3*Math.sin(a),3*Math.cos(a),a+Math.PI)}return e.build()}const vn=[4.9,7.5,3.9],$a=q("#ffdca8"),At=q("#ffd28a");function pn(e,o){const a=[],[r,u,n]=vn;for(let t=0;t<7;t++){const s=(t+.5)/7*Math.PI*2,l=Math.PI/7-.055,c=4,i=(h,v,m)=>[m*Math.cos(s+h),v,m*Math.sin(s+h)];for(let h=0;h<c;h++){const v=-l+2*l*h/c,m=-l+2*l*(h+1)/c,f=s+(v+m)/2,g=[Math.cos(f),0,Math.sin(f)];e.tri(i(v,1.85,r),i(m,1.85,r),i(m,1.85,u),[0,1,0],Ee).tri(i(v,1.85,r),i(m,1.85,u),i(v,1.85,u),[0,1,0],Ee),e.quad(i(v,1.71,u),i(m,1.71,u),i(m,1.85,u),i(v,1.85,u),g,Ee),e.quad(i(v,1.71,r),i(m,1.71,r),i(m,1.85,r),i(v,1.85,r),[-g[0],0,-g[2]],Ee),e.quad(i(v,1.71,r),i(m,1.71,r),i(m,1.71,u),i(v,1.71,u),[0,-1,0],Ee)}for(const h of[-1,1]){const v=l*h,m=[-Math.sin(s+v)*h,0,Math.cos(s+v)*h];e.quad(i(v,1.71,r),i(v,1.71,u),i(v,1.85,u),i(v,1.85,r),m,Ee);for(const f of[r+.24,u-.24]){const g=i(v-h*.24/f,0,f);e.cyl(g[0],g[2],.075,.075,0,1.71,$,0,4,0)}}const b=-s;e.at(0,0,0,b).box(5.5,7,.12,1.71,1.25,2.1,ee);for(let h=0;h<3;h++)e.quad([7.01,.22+h*.5,1.33],[7.01,.22+h*.5,2.02],[7.01,.64+h*.5,2.02],[7.01,.64+h*.5,1.33],[1,0,0],q("#dfe1e2"));e.box(5.55,5.63,1.85,3.3,-1.94,-1.86,$).box(5.55,6.5,3.22,3.3,-1.94,-1.86,$),e.cyl(6.5,-1.9,.42,.12,2.92,3.26,le,.75,6,2,le,1),e.cyl(6.4,-1.5,.8,.8,1.85,1.856,le,.3,8,1);const y=o.shuffle([0,1,2,3,0]).slice(0,3),w=[[6.3,.2],[5.6,.8],[6.8,-.6]];y.forEach((h,v)=>{const[m,f]=w[v];h===0?e.box(m-.3,m+.3,1.85,1.95+o.range(0,.4),f-.4,f+.4,[.93,.93,.9]):h===1?e.box(m-.42,m+.42,1.85,1.93,f-.3,f+.3,$):h===2?e.cyl(m,f,.14,.14,1.85,2.15,o.chance(.5)?io:ee,0,6,1):e.cyl(m,f,.17,.24,1.85,2.17,ht,0,6,0).cyl(m,f,.13,.46,2.17,2.55,Ko,0,5,0).cyl(m,f,.46,.05,2.55,3,Ko,0,5,0)}),e.at(),a.push([n*Math.cos(s),n*Math.sin(s)])}return e.cyl(0,0,.7,.3,0,.3,ee,0,8,1).cyl(0,0,.26,.2,.3,7.8,ee,0,6,0),e.cyl(0,0,5,1.4,5,7,$a,.5,20,3,$a,.8),e.cyl(0,0,1.4,.7,7,7.8,ee,0,8,0),a}function Ka(e,o,a,r,u=ro,n=2.7){for(let t=0;t<5;t++)e.at(o,0,a,r+t/5*Math.PI*2).quad([.1,.2,-.07],[.95,.2,-.07],[.95,.2,.07],[.1,.2,.07],[0,1,0],$);e.at(o,0,a,r).cyl(0,0,.09,.09,.1,1.05,$,0,5,0).cyl(0,0,.72,.78,1.05,1.3,u,0,8,3);for(let t=0;t<3;t++){const s=Math.PI*(1.15+.7*t/3),l=Math.PI*(1.15+.7*(t+1)/3),c=(s+l)/2,i=(b,y,w)=>[w*Math.cos(b),y,w*Math.sin(b)];e.quad(i(s,1.15,.8),i(l,1.15,.8),i(l,n,.94),i(s,n,.94),[-Math.cos(c),0,-Math.sin(c)],ee)}return e.at()}function Ua(e,o){const a=ue();for(let r=0;r<5;r++)a.at(0,0,0,r/5*Math.PI*2).quad([.1,.2,-.07],[.95,.2,-.07],[.95,.2,.07],[.1,.2,.07],[0,1,0],$);a.at().cyl(0,0,.09,.09,.1,1.05,$,0,5,0).cyl(0,0,.72,.78,1.05,1.3,e,0,8,3);for(let r=0;r<3;r++){const u=Math.PI*(1.15+.7*r/3),n=Math.PI*(1.15+.7*(r+1)/3),t=(u+n)/2,s=(l,c,i)=>[i*Math.cos(l),c,i*Math.sin(l)];a.quad(s(u,1.15,.8),s(n,1.15,.8),s(n,o,.94),s(u,o,.94),[-Math.cos(t),0,-Math.sin(t)],ee)}return a.build()}const wn=q("#f3f1ea"),qe={x:-52,z:15,step:14};function*xn(e,o){const a=[],r=Fe.z0,u=Fe.zN;for(const[n,t]of[[-57.6,0],[-46.4,7]])for(let s=r-8-t;s>u+6.5;s-=14){e.at(n,0,s).box(-1.25,1.25,1.71,1.85,-5,5,Ee,0,!0).box(-1,1,0,1.71,-4.4,-4.15,ee).box(-1,1,0,1.71,4.15,4.4,ee);for(const l of[-2.6,2.6])e.cyl(0,l,.22,.18,1.85,1.93,$,0,6,1).cyl(0,l,.04,.04,1.93,2.7,$,0,4,0).cyl(0,l,.6,.3,2.6,3.1,le,.85,8,3,le,1),e.cyl(0,l,1,1,1.85,1.856,le,.3,10,1);for(let l=0;l<3;l++){const c=o.range(-.7,.7),i=[-4.2,-1.3,0,1.3,4.2][o.int(0,4)]+o.range(-.25,.25),b=o.range(.06,.42);e.box(c-.3,c+.3,1.85,1.85+b,i-.38,i+.38,wn)}for(const l of[-3.2,0,3.2])for(const c of[-1,1])o.chance(.86)&&a.push([n+c*2+o.range(-.25,.25),s+l+o.range(-.3,.3),-c*Math.PI/2+o.range(-.5,.5),o.chance(.16)])}yield null;for(let n=0,t=r-4.5;t>u+2;t-=12,n++){if(t<F.LOBBY.glassN+3)continue;const s=o.range(0,6.28);n%2?ho(e.at(-62.9,0,t,s,1.05)):et(e.at(-62.8,0,t,s,.64))}e.at(),yield null;for(let n=qe.z;n>u+3;n-=qe.step)e.at(qe.x,0,n).cyl(0,0,.34,.22,0,.16,$,0,8,1).cyl(0,0,.08,.06,.16,4.55,$,0,6,0).cyl(0,0,.12,.46,4.5,4.9,le,1,8,2,le,1).cyl(0,0,.46,.12,4.9,5.3,le,1,8,1,le,1),n-7>u+3&&et(e.at(qe.x,0,n-7,o.range(0,6.28),.8));for(let n=r-10;n>u+4;n-=12)et(e.at(-42.4,0,n,o.range(0,6.28),.6));return e.at(),a}function gn(){const e=[],o=[],a=[],r=(i,b,y)=>{for(const w of[0,1,2,0,2,3])e.push(i[w][0],i[w][1],i[w][2]),o.push(b[0],b[1],b[2]),a.push(y)},n=-64.5+Fe.deep,t=Fe.z0,s=Fe.zN-.2,l=F.ROOF;r([[-64.5,0,s],[n,0,s],[n,0,t],[-64.5,0,t]],[0,1,0],0),r([[n,0,s],[n,0,t],[n,5,t],[n,5,s]],[-1,0,0],1),r([[n,5,s],[n,5,t],[n,l,t],[n,l,s]],[-1,0,0],1.5),r([[-64.5,0,s],[n,0,s],[n,l,s],[-64.5,l,s]],[0,0,1],2),r([[-64.5,0,t],[n,0,t],[n,l,t],[-64.5,l,t]],[0,0,-1],2),r([[-64.5+.05,0,s],[-64.5+.05,0,t],[-64.5+.05,l,t],[-64.5+.05,l,s]],[1,0,0],4),r([[-64.5+.05,l,s],[-63.3,l,s],[-63.3,l,t],[-64.5+.05,l,t]],[0,-1,0],5);const c=new x.BufferGeometry;return c.setAttribute("position",new x.Float32BufferAttribute(e,3)),c.setAttribute("normal",new x.Float32BufferAttribute(o,3)),c.setAttribute("aK",new x.Float32BufferAttribute(a,1)),c}const yn=`
attribute float aK;
varying vec3 vW; varying vec3 vN; varying float vK;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normal; vK = aK; gl_Position = projectionMatrix * viewMatrix * w; }`,bn=`
varying vec3 vW; varying vec3 vN; varying float vK;
uniform vec3 uPal[8];
${it}${bt}${ao}${Pa}${C0}
// (a draw between 0 and 1 from one number: our own numbers in the common sine hash's form, a cosine added)
float h1c(float n){ return fract(sin(n * 27.619 + 3.7) * 24634.6345 + cos(n * 41.233) * 7919.137); }
// A LIT ROOM BEHIND A GLAZED OPENING OF THE COURT, seen along the eye's own ray. u, yy: the place on the wall's face,
// across from the opening's middle and over the floor; d: the eye's ray as (across, up, into the room); op: the
// opening's half width, its sill and its head; rm: the room's half width, depth and height; rc: its back wall's
// colour; c2: its cabinet's. Gives the room's shade at that place; emis: the light its things give.
vec3 courtRoom(float u, float yy, vec3 d, vec3 op, vec3 rm, vec3 rc, vec3 c2, float kind, float hand, out vec3 emis){
  float du = d.x, dy = d.y, dw = max(d.z, .04);
  float tb = rm.y / dw, tu = (du > 0. ? rm.x - u : rm.x + u) / max(abs(du), 1e-4), ty = (dy > 0. ? rm.z - yy : yy) / max(abs(dy), 1e-4), t = min(tb, min(tu, ty));
  vec3 q = vec3(u + du * t, yy + dy * t, dw * t), room, lp = roomLight(rm.x, rm.y, kind), glowT;
  float lampG = exp(-((q.x - lp.x * hand) * (q.x - lp.x * hand) + (q.y - lp.y) * (q.y - lp.y) * 1.4 + (q.z - lp.z) * (q.z - lp.z) * .5) / 3.4);
  emis = vec3(0.);
  // (the back wall one plain tone, a shade lighter toward the ceiling; the side walls a tone darker, darker still
  // toward the back; the ceiling white with its slim bar of light; the floor deep)
  if (tb <= min(tu, ty)) room = rc * (.6 + .14 * q.y / rm.z);
  else if (tu < ty) room = mix(rc, vec3(.9, .89, .86), .4) * (.34 + .34 * (1. - q.z / rm.y));
  else if (dy > 0.) {
    // (round eleven c: one slim bar of light, 2.4 m long and 0.4 m broad, from the front toward the back)
    vec2 qc = abs(vec2(q.x, q.z - rm.y * .5)) - vec2(.2, 1.2);
    float cl = 1. - smoothstep(-.05, .05, max(qc.x, qc.y));
    room = mix(mix(rc, vec3(.97), .7) * .8, vec3(1.), cl); emis = vec3(1., .98, .94) * .8 * cl;
  } else room = (rc * .36 + .04) * (.7 + .3 * (1. - q.z / rm.y));
  room *= 1. + vec3(.9, .62, .24) * lampG;
  vec4 th = roomThings(vec3(u * hand, yy, 0.), vec3(du * hand, dy, dw), rm.x, rm.y, t, kind, c2, vec3(1., .93, .8), glowT);
  if (th.w < t) {
    vec3 pt = vec3(u + du * th.w, yy + dy * th.w, dw * th.w) - vec3(lp.x * hand, lp.y, lp.z);
    room = th.rgb * (1. + vec3(.5, .34, .13) * exp(-dot(pt, pt) / 5.)); emis = glowT;
  }
  // (the wall is 0.4 m thick: a ray still inside that depth meets the reveal: a jamb, the head or the sill, in
  // shade, the sill catching a little of the room's light)
  float tj = .4 / dw;
  vec2 qj = vec2(u + du * tj, yy + dy * tj);
  if (abs(qj.x) > op.x || qj.y > op.z || qj.y < op.y) {
    room = vec3(.17, .21, .42) * (abs(qj.x) > op.x ? .7 + .4 * step(0., du * qj.x) : qj.y > op.z ? .6 : 1.25) + rc * (qj.y < op.y ? .12 : .04);
    emis = vec3(0.);
  }
  return room;
}
void main(){
  vec3 toEye = cameraPosition - vW;
  if (vK > 3.5 && dot(vN, toEye) < 0.) discard;
  // (the eave is a top: it is seen from over its own height only; from the lobby and the loggia the ceiling ends in
  // its own beam)
  if (vK > 4.5 && cameraPosition.y < vW.y) discard;
  float fw = max(length(fwidth(vW)), .02), q = ${Fe.z0.toFixed(1)} - vW.z, y = vW.y;
  vec3 LAMPW = vec3(1., .84, .56), col, emis = vec3(0.);
  float dzl = mod(vW.z - ${qe.z.toFixed(1)} + ${(qe.step/2).toFixed(1)}, ${qe.step.toFixed(1)}) - ${(qe.step/2).toFixed(1)}, dxl = vW.x - ${qe.x.toFixed(1)}, d2 = dxl * dxl + dzl * dzl;
  float wl = (exp(-d2 / 26.) + .35 * exp(-d2 / 160.)) * (.8 + .4 * waveHump(vW.x + vW.z));
  float bay = floor(q / 4.), fb = q - bay * 4., on = step(.17, h1c(bay)), bci = floor(h1c(bay + 57.) * 5.999);
  vec3 bc = uPal[1 + int(bci)], dv = -toEye / max(length(toEye), 1e-3);
  // (how well an eye at this distance tells a room's things: whole within a pixel's reach of 0.6 m, none from 1.8 m;
  // none from behind the wall)
  float vis = clamp(.9 / fw - .5, 0., 1.) * step(0., dot(vN, toEye));
  if (vK < .5) {
    vec2 tj = (.5 - abs(fract(vW.xz / 1.5) - .5)) * 1.5;
    float jt = max(clamp((.03 - tj.x) / fw + .5, 0., 1.), clamp((.03 - tj.y) / fw + .5, 0., 1.)) * clamp(.06 / fw, 0., 1.);
    float gw = exp(-max(vW.x + 64.5, 0.) / 5.), rw = exp(-max(-40.5 - vW.x, 0.) / 4.) * on * (1. - .6 * smoothstep(1.2, 2.2, abs(fb - 2.)));
    col = vec3(.62, .64, .72) * (1. - .2 * jt) * (vec3(.13, .18, .4) + LAMPW * wl + vec3(.8, .86, 1.) * .55 * gw) + bc * .5 * rw;
  } else if (vK < 1.8) {
    float post = 1. - smoothstep(.16, .16 + fw, min(fb, 4. - fb)), pane = step(.5, y) * step(y, 4.2) * (1. - post);
    vec3 wallC = vec3(.2, .26, .5) * mix(.8, 1.05, smoothstep(0., 6.9, y)) + bc * .12 * on * step(4.2, y) * step(y, 5.);
    // (the room's own mean)
    vec3 room = mix(bc, vec3(1., .95, .85), .25) * (.5 + .16 * smoothstep(.5, 4.2, y)) * (.85 + .15 * waveHump(vW.x + vW.z)), em = vec3(0.);
    if (vis > 0. && pane > 0.) {
      float kd = h1c(bay * 3.31 + 11.), kind = kd < .45 ? 0. : kd < .8 ? 1. : 2., hand = h1c(bay * 5.13 + 23.) < .5 ? -1. : 1.;
      vec3 seen = courtRoom(fb - 2., y, vec3(-dv.z, dv.y, dv.x), vec3(1.84, .5, 4.2), vec3(1.92, 4.5, 4.7), bc, mix(uPal[1 + int(mod(bci + 2., 6.))], vec3(.92), .18), kind, hand, em);
      room = mix(room, seen, vis); em *= vis;
    }
    // (one fine mullion and one transom in each bay's glass; a dim bay keeps a sixth of its room's light)
    float bars = max(1. - smoothstep(.035, .035 + fw, abs(fb - 2.)), 1. - smoothstep(.035, .035 + fw, abs(y - 3.3))) * clamp(.1 / fw, 0., 1.), lr = mix(.16, 1., on);
    col = mix(wallC, mix(mix(vec3(.07, .1, .25), room, lr), vec3(.5, .56, .8), bars), pane);
    col = mix(col, vec3(.5, .56, .8), step(4.86, y) * step(y, 5.));
    emis = (em + bc * .1) * lr * pane * (1. - bars);
  } else if (vK < 2.5) {
    // an end wall: a bracket lamp every 6 m, and BETWEEN THE LAMPS A TALL WINDOW (2 m wide, from 0.7 to 5.3 m, one
    // fine mullion and one transom) WITH A LIT ROOM BEHIND IT (round eleven b: as the range's bays; each in one
    // of the floors' colours); a pale sill; a pale cope along the wall's head
    // (the bracket lamp's one law, the part's: an upright soft bar, to 1/e 0.16 m broad and 1 m high either way, in
    // a wash that falls to 1/e 1.2 m to either side and 3.6 m up and down: it reaches the wall's foot)
    float da = vW.x - (floor(vW.x / 6.) + .5) * 6., dy = y - 3.6, gl = bracketWash(da, dy);
    float wi = floor(vW.x / 6. + .5), dw = vW.x - wi * 6., we = floor(vW.z / 50. + .5) * 13., wci = floor(h1c(wi * 3.1 + 57. + we) * 5.999);
    vec3 wc = uPal[1 + int(wci)];
    float inW = (1. - smoothstep(1. - fw, 1. + fw, abs(dw))) * smoothstep(.7 - fw, .7 + fw, y) * (1. - smoothstep(5.3 - fw, 5.3 + fw, y));
    float bars = max(1. - smoothstep(.04, .04 + fw, abs(dw)), 1. - smoothstep(.04, .04 + fw, abs(y - 3.9))) * clamp(.1 / fw, 0., 1.);
    col = vec3(.24, .3, .56) * mix(.8, 1., smoothstep(0., 6.9, y));
    col = mix(col, vec3(.5, .56, .8), max(step(6.76, y), (1. - smoothstep(.06, .06 + fw, abs(y - .62))) * (1. - smoothstep(1.15, 1.15 + fw, abs(dw)))));
    col = mix(col, LAMPW * .92, .7 * gl) + LAMPW * .14 * gl;
    vec3 roomW = mix(wc, vec3(1., .95, .85), .25) * (.5 + .2 * smoothstep(.7, 5.3, y)) * (.85 + .15 * waveHump(vW.x + vW.z)), emW = vec3(0.);
    if (vis > 0. && inW > 0.) {
      float kd = h1c(wi * 7.7 + we + 3.), kind = kd < .45 ? 0. : kd < .8 ? 1. : 2., hand = h1c(wi * 2.9 + we + 31.) < .5 ? -1. : 1.;
      vec3 seen = courtRoom(dw, y, vec3(dv.x, dv.y, -dv.z * vN.z), vec3(1., .7, 5.3), vec3(1.6, 4.5, 5.9), wc, mix(uPal[1 + int(mod(wci + 2., 6.))], vec3(.92), .18), kind, hand, emW);
      roomW = mix(roomW, seen, vis); emW *= vis;
    }
    col = mix(col, mix(roomW, vec3(.62, .66, .8), bars), inW);
    emis = vec3(1., .8, .5) * 1.5 * bracketBar(da, dy) * (1. - inW) + (emW + wc * .1) * inW * (1. - bars);
  } else if (vK < 4.5) {
    // (the lobby's glass in its slim pale posts, then the open loggia with its rail, which has no post: the
    // corridor's lit inside is seen)
    float pit = ${F.LOBBY.bay.toFixed(1)}, fp = q - floor(q / pit) * pit, post = (1. - smoothstep(.04, .04 + fw, min(fp, pit - fp))) * clamp(.1 / fw, 0., 1.) * step(q, ${Fe.glass.toFixed(1)});
    float frame = max(max(post, step(y, .1)), step(6.6, y));
    col = mix(vec3(.9, .89, .85), vec3(.8, .8, .78), frame);
    emis = vec3(1., .97, .9) * .5 * (1. - frame);
  } else col = vec3(.16, .2, .42);
  gl_FragColor = vec4(nightAir(lit3(min(col, vec3(.93))) + emis, cameraPosition, -toEye), 1.);
}`;function et(e){return e.cyl(0,0,.95,1.1,0,1.25,ht,0,12,1,q("#5a4a3a")).cyl(0,0,.16,.12,1.25,1.6,q("#7a6248"),0,6,0),Ft(e,0,0,1,1.45,1)}function Qn(e,o,a,r,u){return et(e.at(o,0,a,r,u)).at()}function An(e,o){return e.cyl(0,0,.7,.82,0,1.25,ht,0,14,1,q("#5a4a3a")).cyl(0,0,.13,.1,1.25,1.65,q("#7a6248"),0,6,0),o?Ft(e,0,0,.7,1.5,.9):Ft(e,0,0,.6,1.5,1.35)}function En(e,o){const a=(o.x1-o.x0)/2,r=Pe,u=[(je[0]+Ue[0])/2,(je[1]+Ue[1])/2,(je[2]+Ue[2])/2];e.at((o.x0+o.x1)/2,0,o.z),e.box(-a+.12,a-.12,0,.14,-r.hw+.12,r.hw-.12,$).box(-a,a,.14,1.25,-r.hw,r.hw,ht),e.box(-a+.14,a-.14,1.25,1.8,-r.hw+.14,r.hw-.14,je);for(let n=-a+.75;n<a-.5;n+=1.5)e.lathe(n,0,[[.58,1.75],[.7,2],[.6,2.28],[.34,2.46],[.04,2.52]],[je,u,Ue,Ue,Ue],10);for(const n of[-1,1])for(let t=-a;t<a-1;t+=6){const s=n*(r.hw+r.gap),l=n*r.bench/3;for(let c=0;c<3;c++){const i=s+l*(c+.07),b=s+l*(c+.93);e.box(t+.5,t+5.5,1,1.1,Math.min(i,b),Math.max(i,b),Ee,0,!0)}for(const c of[t+1.1,t+4.9])e.box(c-.06,c+.06,0,1,Math.min(s,s+3*l)+.1,Math.max(s,s+3*l)-.1,$)}return e.at()}function Ya(e,o,a,r,u,n){return a===0?et(o.at(e,r,0,u,n.range(0,6.28),.5)):a===1?o.at(e,r,0,u).cyl(0,0,.45,.3,0,.12,$,0,10,1).cyl(0,0,.06,.06,.12,3.4,$,0,6,0).cyl(0,0,.62,.42,3.3,4.05,le,.75,10,3,le,1):(o.at(e,r,0,u,n.range(-.3,.3)).box(-.62,.62,0,.85,-.5,.5,Uo),o.at(e,r,.85,u,n.range(-.5,.5)).box(-.5,.5,0,.7,-.42,.42,Za),o.at(e,r,1.55,u,n.range(-.5,.5)).box(-.4,.4,0,.55,-.36,.36,Uo)),e.at()}function Bt(e,o,a,r){const u=o*e[2],n=-o*e[3],t=e[0]+e[2]*r-e[3]*o*a,s=e[1]+e[3]*r+e[2]*o*a,l=Math.atan2(n,u),c=(v,m)=>t+v*u+m*n,i=(v,m)=>s-v*n+m*u,b=new x.Euler,y=new x.Quaternion,w=new x.Vector3,h=new x.Vector3;return{at:(v,m=0,f=0,g=0,L=0,M=1)=>v.at(c(m,g),f,i(m,g),l+L,M),chair:(v,m,f,g=0)=>co(v,c(m,f),i(m,f),l+g),mat:(v,m,f,g=0,L=1)=>new x.Matrix4().compose(w.set(c(v,f),m,i(v,f)),y.setFromEuler(b.set(0,l+g,0)),h.set(L,L,L))}}const tt=q("#2b3038"),Qa=q("#d8452f");function Ln(){const e=ue(),o=ue(),a=ue(),r=ue(),u=ue(),n=ue();for(let t=0;t<20;t++){const s=t/20*Math.PI*2,l=(t+1)/20*Math.PI*2,c=(i,b,y)=>[b*Math.cos(i),b*Math.sin(i),y];e.tri([0,0,-.06],c(s,.9,-.06),c(l,.9,-.06),[0,0,-1],ee),e.quad(c(s,.9,-.07),c(l,.9,-.07),c(l,1,-.07),c(s,1,-.07),[0,0,-1],tt),e.quad(c(s,1,-.07),c(l,1,-.07),c(l,1,0),c(s,1,0),[Math.cos(s),Math.sin(s),0],tt)}for(let t=0;t<12;t++){const s=t/12*Math.PI*2,l=Math.cos(s),c=Math.sin(s),i=.025;e.quad([l*.7-c*i,c*.7+l*i,-.065],[l*.7+c*i,c*.7-l*i,-.065],[l*.82+c*i,c*.82-l*i,-.065],[l*.82-c*i,c*.82+l*i,-.065],[0,0,-1],tt)}return o.quad([-.5,-.12,0],[.5,-.12,0],[.5,1,0],[-.5,1,0],[0,0,-1],[1,1,1]),a.box(-.37,.37,-.27,.27,0,.95,q("#e4e6e6"),0,!0).box(-.14,.14,-.03,.03,-.06,0,q("#6d747c")),r.cyl(0,0,.15,1,-.6,0,[1,1,1],0,7,0).cyl(0,0,1,.1,0,.6,[1,1,1],0,7,0),u.cyl(0,0,.16,.14,0,.06,$,0,8,1).box(-.025,.025,.06,.95,-.025,.025,$).box(-.025,.025,.9,.95,-.45,.025,$),u.cyl(0,-.45,.24,.08,.72,.95,le,.75,8,2,le,1),n.quad([-.28,0,-.375],[.28,0,-.375],[.28,0,.375],[-.28,0,.375],[0,1,0],[.97,.97,.95]),{face:e.build(),hand:o.build(),drawer:a.build(),blob:r.build(),lamp:u.build(),sheet:n.build()}}const fo=[["clocks",18,7,9.6,(e,o,a,r,u,n,t)=>{const c=(u-.6)/13,i=(t-.7)/7;for(let b=0;b<7;b++)for(let y=0;y<13;y++){const w=[.55,.66,.78,.9,1][r.int(0,4)]*.47*Math.min(c,i),h=-u/2+.3+(y+.5)*c+r.range(-.5,.5)*(c-2*w),v=.4+(b+.5)*i+r.range(-.5,.5)*(i-2*w);o.face.push({m:a.mat(h,v,n-.02,0,w)});const m=r.range(0,6.283),f=r.range(0,6.283),g=n-.1;o.hand.push({m:a.mat(h,v,g,0,w),move:[3,0,m,50.16],col:tt},{m:a.mat(h,v,g-.01,0,w),move:[3,0,f,75.11],col:tt}),o.hand.push({m:a.mat(h,v,g-.02,0,w),move:[3,-Math.PI*2/60,r.range(0,6.283),84.05],col:Qa})}}],["drawers",18,6,9.6,(e,o,a,r,u,n,t)=>{const s=q("#39414a");a.at(e,0,0,n-.5).box(-8.1,8.1,0,9.15,-.02,.5,s),a.at(e,0,0,n-.5).box(-8.3,8.3,9.15,9.3,-.4,.5,ee).box(-8.3,-8.1,0,9.15,-.4,.5,ee).box(8.1,8.3,0,9.15,-.4,.5,ee);const l=r.range(.03,.05)*(r.chance(.5)?1:-1),c=r.range(.02,.04);for(let i=0;i<15;i++)for(let b=0;b<20;b++)o.drawer.push({m:a.mat(-7.6+b*.8,.35+i*.6,n-.55),move:[2,7,b*l+i*c+10,-.9]})}],["tree",16,16,11,(e,o,a,r,u,n,t)=>{const s=q("#7a6248"),l=n/2;a.at(e,0,0,l).cyl(0,0,1.7,1.9,0,1.2,ht,0,16,1,q("#5a4a3a")).cyl(0,0,.42,.26,1.2,4.6,s,0,8,0);for(const[i,b]of[[.4,2.4],[2.5,2.2],[4.4,2.6]])a.at(e,0,0,l,i).quad([-.12,3.6,0],[.12,3.6,0],[.1,3.6+b*.8,b*.6],[-.1,3.6+b*.8,b*.6],[0,.6,-.8],s);const c=q("#2f7a4a");for(const[i,b,y,w]of[[0,6.6,0,2.2],[1.6,5.6,.6,1.6],[-1.5,5.4,-.8,1.7],[.3,5.2,-1.7,1.5],[-.4,5.6,1.7,1.5],[.2,7.6,.1,1.3],[1.3,6.9,-1,1.2],[-1.3,6.8,.9,1.2]])o.blob.push({m:a.mat(i,b,l+y,r.range(0,6),w),move:[6,r.range(.5,.9),r.range(0,6.283),.05],col:r.chance(.5)?Ko:c})}],["chairs",18,23,6.4,(e,o,a,r,u,n,t)=>{const s=r.range(.4,.6)*(r.chance(.5)?1:-1),l=r.range(.4,.7),c=r.range(.4,.7);for(let i=0;i<10;i++)for(let b=0;b<8;b++)o.chair.push({m:a.mat(-7.525+b*2.15,0,1.6+i*2.15),move:[1,s,b*l+i*c,0]})}],["lamps",16,7,6.4,(e,o,a,r,u,n,t)=>{a.at(e,0,0,3.4).box(-7.2,7.2,1.71,1.85,-1.1,1.1,Ee,0,!0);for(const c of[-6.6,-2.2,2.2,6.6])a.at(e,c,0,3.4).box(-.08,.08,0,1.71,-.9,.9,ee);const s=r.range(.16,.24),l=r.range(1.1,1.5);for(let c=0;c<2;c++)for(let i=0;i<30;i++)o.lamp.push({m:a.mat(-6.74+i*.465,1.85,3.4+(c?.55:-.55),c?Math.PI:0,1.25),move:[4,l,-i*s+c*1.3,.06]})}],["paper",14,9,6.4,(e,o,a,r,u,n,t)=>{const s=[.84,.84,.82],l=r.range(.05,.09),c=r.range(.07,.12);for(let i=0;i<9;i++)for(let b=0;b<16;b++){const y=-6.375+b*.85,w=1+i*.9,h=Math.min(1.1+(t-1.5)*i/8+r.range(-.12,.12),t-.25);a.at(e,y,0,w).box(-.28,.28,0,h,-.375,.375,s),o.sheet.push({m:a.mat(y,h+.012,w),move:[5,6,b*l+i*c+10,.55]})}}]],Uo=q("#dcd8ce"),Za=q("#c4c0b6");function Mn(e,o,a,r,u){const n=u/9;if(a===1?a=0:a===4&&(a=2),a===0)o.at(e,0,0,4.6*n).box(-1.8,1.8,1.71,1.85,-1,1,Ee,0,!0).box(-1.65,-1.55,0,1.71,-.85,.85,ee).box(1.55,1.65,0,1.71,-.85,.85,ee),o.chair(e,-.5,4.6*n-1.7,r.range(-.5,.5)),o.chair(e,.5,4.6*n+1.7,Math.PI+r.range(-.5,.5));else if(a===1){const t=r.int(3,5);for(let s=0;s<t;s++)_a(o.at(e,(s-(t-1)/2)*1.42,0,u-.9,Math.PI))}else if(a===2)ho(o.at(e,r.range(-1.5,1.5),0,r.range(4,6)*n,r.range(0,6),1.3));else if(a===3){const t=r.range(-2,2),s=r.range(4,6.5)*n;o.at(e,t,0,s).cyl(0,0,.62,.5,0,.12,$,0,12,1).cyl(0,0,.07,.07,.12,4.3,$,0,6,1).cyl(0,0,.16,.16,4.3,4.5,$,0,8,3);for(let l=0;l<6;l++)o.at(e,t,0,s,l/6*Math.PI*2).box(.05,.62,3.78,3.86,-.035,.035,$,0,!0).box(.55,.62,3.86,4.08,-.035,.035,$)}else{const t=r.int(2,3);for(let s=0;s<t;s++){const l=(s-(t-1)/2)*2.1+r.range(-.15,.15),c=(5+r.range(-.6,.6))*n,i=r.int(1,3);let b=0;for(let y=0;y<i;y++){const w=r.range(.75,.95)-y*.08,h=r.range(1,1.5);o.at(e,l,b,c,r.range(-.25,.25)).box(-w,w,0,h,-w*.8,w*.8,y%2?Za:Uo).box(-.09,.09,h,h+.012,-w*.8,w*.8,q("#f0ece2")),b+=h}}}e.at()}function Sn(e,o,a,r,u,n,t){const s=r/2,l=-n;o.at(e,0,0,u*.5).box(-1.6,1.6,1.71,1.85,-.9,.9,Ee,0,!0).box(-1.5,-1.4,0,1.71,-.8,.8,ee).box(1.4,1.5,0,1.71,-.8,.8,ee),e.cyl(l,.3,.22,.18,1.85,1.93,$,0,8,1).cyl(l,.3,.04,.04,1.93,2.7,$,0,4,0).cyl(l,.3,.6,.3,2.6,3.1,le,.85,10,3,le,1),o.chair(e,-.3*l,u*.5+1.7,Math.PI+a.range(-.4,.4)),et(o.at(e,n*(s-1.15),0,1.7,a.range(0,6.28),.55)),o.at(e,-n*(s-1.9),0,u-.5).box(-1.6,1.6,.12,1.5,-.42,.42,t).box(-1.56,1.56,0,.12,-.36,.36,$).box(-1.66,1.66,1.5,1.58,-.46,.46,Ee,0,!0);for(const c of[-1.07,0,1.07])e.box(c-.5,c+.5,.2,1.42,-.44,-.42,[t[0]*.88,t[1]*.88,t[2]*.88]);o.at(e,n*(s-.95),0,u-1.05).cyl(0,0,.42,.3,0,.1,$,0,10,1).cyl(0,0,.05,.05,.1,2.9,$,0,6,0).cyl(0,0,.58,.38,2.85,3.5,le,.8,10,3,le,1),e.at()}const kt=q("#d8452f"),Xa=q("#e9dfc8"),On=q("#d3c6a8"),zn=q("#bfe3f2");function In(e,o,a,r,u,n){if(r===0)a.at(e,0,0,n*.5,u.range(0,6)).cyl(0,0,.62,.74,0,1.05,ht,0,14,1,q("#5a4a3a")).cyl(0,0,.1,.07,1.05,1.5,q("#7a6248"),0,6,0),Ft(e,0,0,.55,1.3,.68);else if(r===1){a.at(e,0,0,n-.06).box(-1.2,1.2,0,3.4,-.06,.04,q("#cfd6dc")),a.at(e,0,0,n-.75).cyl(0,0,.3,.36,0,1.55,ee,0,12,0).cyl(0,0,.36,.95,1.55,2.05,ee,0,16,0).cyl(0,0,.88,.88,1.98,2,q("#eef3f6"),0,16,1),e.box(-.05,.05,2,2.75,.5,.6,$).box(-.05,.05,2.65,2.75,.05,.6,$);for(let t=0;t<5;t++){const s=.05-t*.13,l=s-.13,c=2.7-t*t*.028,i=2.7-(t+1)*(t+1)*.028;e.quad([-.035,c,s],[.035,c,s],[.035,i,l],[-.035,i,l],[0,.5,-.8],zn,.3)}}else if(r===2){const t=u.range(0,6.283),s=u.range(0,6.283),l=2.9;o.face.push({m:a.mat(0,l,n-.02,0,1.2)}),o.hand.push({m:a.mat(0,l,n-.11,0,1.2),move:[3,0,t,50.16],col:tt},{m:a.mat(0,l,n-.12,0,1.2),move:[3,0,s,75.11],col:tt}),o.hand.push({m:a.mat(0,l,n-.13,0,1.2),move:[3,-Math.PI*2/60,u.range(0,6.283),84.05],col:Qa})}else if(r===3){a.at(e,0,0,n*.55);for(let t=0;t<4;t++)e.box(-1.8,1.8,1.05,1.13,-.5+t*.27,-.3+t*.27,Ee,0,!0);for(let t=0;t<3;t++)e.box(-1.8,1.8,1.5+t*.3,1.72+t*.3,.52,.6,Ee,0,!0);for(const t of[-1.5,1.5])e.box(t-.06,t+.06,0,1.05,-.45,.5,$).box(t-.06,t+.06,1.05,2.35,.44,.52,$)}else if(r===4){a.at(e,0,0,n*.52,u.range(-.2,.2));for(const[t,s]of[[-.6,-.5],[.6,-.5],[-.6,.5],[.6,.5]])e.box(t-.05,t+.05,0,1.1,s-.05,s+.05,$);for(let t=0;t<7;t++){const s=1.1+t*.3,l=t%2?ro:q("#3d8088");e.box(-.7,.7,s,s+.1,-.6,.6,l,0,!0).box(-.7,.7,s+.1,s+1,.5+t*.012,.6+t*.012,l)}}else if(r===5){a.at(e,0,0,n*.52),e.box(-1.5,1.5,.45,.55,-.6,.6,$,0,!0).box(-1.5,1.5,1.75,1.85,-.6,.6,$,0,!0);for(const t of[-1.46,1.46])for(const s of[-.56,.56])e.box(t-.04,t+.04,.3,2.9,s-.04,s+.04,$);e.box(-1.5,1.5,2.82,2.9,-.6,-.52,$,0,!0);for(const t of[-1.2,1.2])for(const s of[-.45,.45])e.cyl(t,s,.16,.16,0,.3,tt,0,8,1);for(const t of[.55,1.85])for(let s=0;s<4;s++)e.box(-1.36+s*.7,-.76+s*.7,t,t+u.range(.45,t>1?.9:1.1),-.45,.45,[.95,.95,.92])}else{const t=(l,c,i)=>[c*Math.cos(l),2.9+c*Math.sin(l),i],s=[0,0,-1];a.at(e,0,0,n-.02),e.box(-1.5,1.5,1.4,4.4,-.1,0,kt).box(-1.5,-1.38,1.4,4.4,-.5,-.1,kt).box(1.38,1.5,1.4,4.4,-.5,-.1,kt).box(-1.5,1.5,4.28,4.4,-.5,-.1,kt).box(-1.5,1.5,1.4,1.52,-.5,-.1,kt);for(let l=0;l<24;l++){const c=l/24*Math.PI*2,i=(l+1)/24*Math.PI*2;e.quad(t(c,1.2,-.4),t(i,1.2,-.4),t(i,1.2,-.12),t(c,1.2,-.12),[Math.cos(c),Math.sin(c),0],$);for(let b=0;b<4;b++)e.quad(t(c,.4+b*.2,-.36),t(i,.4+b*.2,-.36),t(i,.585+b*.2,-.36),t(c,.585+b*.2,-.36),s,Xa);for(let b=0;b<4;b++)e.quad(t(c,.585+b*.2,-.355),t(i,.585+b*.2,-.355),t(i,.6+b*.2,-.355),t(c,.6+b*.2,-.355),s,On);e.tri([0,2.9,-.42],t(c,.4,-.42),t(i,.4,-.42),s,$)}for(let l=0;l<4;l++){const c=l*Math.PI/2+.4,i=Math.cos(c),b=Math.sin(c),y=.07;e.quad([-b*y,2.9+i*y,-.43],[b*y,2.9-i*y,-.43],[i*1.2+b*y,2.9+b*1.2-i*y,-.43],[i*1.2-b*y,2.9+b*1.2+i*y,-.43],s,$)}e.box(1.02,1.14,.75,2.6,-.5,-.4,Xa).box(1,1.16,.45,.75,-.52,-.38,$)}e.at()}const P=F.SHAFT,uo=.6,Tt=.3,Yo=48,Et=(()=>{const e=[];for(let o=-P.below;o<=P.above;o++)e.push([o<=0?5*o:5+5*o,o===0?10:5]);return e})(),Re={s:P.z+Math.sqrt(P.r*P.r-(P.x+72.5)**2),n:P.z-Math.sqrt(P.r*P.r-(P.x+76)**2)},ot=(e,o,a)=>(a?-1:1)*Math.acos((e-P.x)/o);function Wn(){const e=[],o=[],a=[],r=[],u={quad(n,t,s,l=[0,5]){for(const c of[0,1,2,0,2,3]){const i=Array.isArray(t[0])?t[c]:t,b=Array.isArray(l[0])?l[c]:l;e.push(n[c][0],n[c][1],n[c][2]),o.push(i[0],i[1],i[2]),a.push(s),r.push(b[0],b[1])}},tri(n,t,s,l=[0,5]){for(let c=0;c<3;c++)e.push(n[c][0],n[c][1],n[c][2]),o.push(t[0],t[1],t[2]),a.push(s),r.push(l[0],l[1])},cyl(n,t,s,l,c,i,b,y,w){for(let h=0;h<b;h++){const v=h/b*Math.PI*2,m=(h+1)/b*Math.PI*2,f=Math.cos(v),g=Math.sin(v),L=Math.cos(m),M=Math.sin(m);u.quad([[n+s*f,c,t+s*g],[n+s*L,c,t+s*M],[n+l*L,i,t+l*M],[n+l*f,i,t+l*g]],[[f,0,g],[L,0,M],[L,0,M],[f,0,g]],y,w)}},get triangles(){return e.length/9},build(){const n=new x.BufferGeometry;return n.setAttribute("position",new x.Float32BufferAttribute(e,3)),n.setAttribute("normal",new x.Float32BufferAttribute(o,3)),n.setAttribute("aK",new x.Float32BufferAttribute(a,1)),n.setAttribute("aV",new x.Float32BufferAttribute(r,2)),n}};return u}function Qo(e,o=[]){const a=[];for(let u=0;u<e;u++)a.push(-Math.PI+u/e*Math.PI*2);for(const u of o)a.push(u[0],u[1]);a.sort((u,n)=>u-n),a.push(a[0]+Math.PI*2);const r=[];for(let u=0;u<a.length-1;u++){const n=a[u],t=a[u+1],s=(n+t)/2;t-n>1e-6&&!o.some(l=>s>l[0]&&s<l[1])&&r.push([n,t])}return r}const xe=(e,o,a)=>[P.x+e*Math.cos(a),o,P.z+e*Math.sin(a)];function*Rn(e){const o=P.r,a=P.r+P.deep,r=Qo(72),u=[[ot(-63.5,a,!1),ot(-72.5,a,!1)],[ot(-76,a,!0),ot(-60,a,!0)]],n=Qo(72,u);for(let m=0;m<Et.length;m++){const[f,g]=Et[m],L=[f,g],M=m===Et.length-1;for(const[B,I]of r){const p=(B+I)/2,O=[-Math.cos(p),0,-Math.sin(p)];e.quad([xe(o,f,B),xe(o,f,I),xe(a,f,I),xe(a,f,B)],[0,1,0],0,L),e.quad([xe(o,f-Tt,B),xe(o,f-Tt,I),xe(o,f,I),xe(o,f,B)],O,1,L),m>0&&e.quad([xe(o,f-Tt,B),xe(o,f-Tt,I),xe(a,f-uo,I),xe(a,f-uo,B)],[0,-1,0],2,L)}for(const[B,I]of f===0?n:r){const p=(B+I)/2,O=[-Math.cos(p),0,-Math.sin(p)],H=M?P.top:f+g-uo;e.quad([xe(a,f,B),xe(a,f,I),xe(a,H,I),xe(a,H,B)],O,3,L)}m%4===3&&(yield null)}for(const[m,f]of r)e.tri([[P.x,P.top,P.z],xe(a,P.top,f),xe(a,P.top,m)],[0,-1,0],4),e.tri([[P.x,-96,P.z],xe(a,-96,m),xe(a,-96,f)],[0,1,0],5);yield null;const t=-71,s=-65,l=Re.n,c=Re.s,i=.03;for(const[m,f]of[[t,-1],[s,1]]){const g=m-f*.3;e.quad([[m,i-.5,l],[m,i-.5,c],[m,i,c],[m,i,l]],[f,0,0],1,[i+.1,6]),e.quad([[g,i-.5,l],[g,i-.5,c],[g,i,c],[g,i,l]],[-f,0,0],8),e.quad([[m,i-.5,l],[m,i-.5,c],[g,i-.5,c],[g,i-.5,l]],[0,-1,0],8)}const b=P.x+P.plat-.25,y=P.z-1.6,w=P.z+1.6;for(const[m,f]of[[y,-1],[w,1]]){const g=m-f*.3;e.quad([[b,i-.5,m],[t,i-.5,m],[t,i,m],[b,i,m]],[0,0,f],1,[i+.1,6]),e.quad([[b,i-.5,g],[t,i-.5,g],[t,i,g],[b,i,g]],[0,0,-f],8),e.quad([[b,i-.5,m],[t,i-.5,m],[t,i-.5,g],[b,i-.5,g]],[0,-1,0],8)}yield null;const h=P.plat,v=(m,f,g)=>[P.x+m*Math.cos(g),f,P.z+m*Math.sin(g)];for(let m=0;m<48;m++){const f=m/48*Math.PI*2,g=(m+1)/48*Math.PI*2,L=(f+g)/2,M=[Math.cos(L),0,Math.sin(L)];e.tri([[P.x,0,P.z],v(h,0,g),v(h,0,f)],[0,1,0],7),e.quad([v(h,-.6,f),v(h,-.6,g),v(h,0,g),v(h,0,f)],M,1,[.1,6]),e.quad([v(h,-.6,f),v(h,-.6,g),v(1.2,-2.2,g),v(1.2,-2.2,f)],[M[0]*.2,-.98,M[2]*.2],8)}for(let m=0;m<4;m++){const f=Math.PI/4+m*Math.PI/2;e.cyl(P.x+(h-.45)*Math.cos(f),P.z+(h-.45)*Math.sin(f),.09,.09,0,P.top,6,9)}return e}function Nn(){const e=[],o=[],r=(y,w)=>{for(const[h,v]of[[y,0],[w,0],[w,1],[y,0],[w,1],[y,1]])e.push(h[0],h[1]+v*1.5,h[2]),o.push(0,v)},u=P.r+.12,n=[[ot(-65,u,!1),ot(-71,u,!1)],[ot(-71,u,!0),ot(-65,u,!0)]];for(const[y]of Et)for(const[w,h]of Qo(72,y===0?n:[]))r(xe(u,y,w),xe(u,y,h));const t=.03,s=P.z-1.6,l=P.z+1.6;r([-65,t,Re.n],[-65,t,Re.s]),r([-71,t,Re.n],[-71,t,s]),r([-71,t,l],[-71,t,Re.s]);const c=P.x+P.plat-.12;r([c,t,s],[-71,t,s]),r([c,t,l],[-71,t,l]);for(const[y,w]of[[[[-71,Re.n],[-65,Re.n],[-65,Re.s],[-71,Re.s]],2],[[[P.x+P.plat-.25,s],[-71,s],[-71,l],[P.x+P.plat-.25,l]],3]])for(const h of[0,1,2,0,2,3])e.push(y[h][0],t,y[h][1]),o.push(w,.5);const i=Math.asin(1.6/(P.plat-.12));for(let y=0;y<46;y++){const w=i+y/46*(Math.PI*2-2*i),h=i+(y+1)/46*(Math.PI*2-2*i);r(xe(P.plat-.12,0,w),xe(P.plat-.12,0,h))}const b=new x.BufferGeometry;return b.setAttribute("position",new x.Float32BufferAttribute(e,3)),b.setAttribute("uv",new x.Float32BufferAttribute(o,2)),b}const Cn=["#2a55c8","#10b4d4","#d08cf8","#84449a","#f3e6cc"],Fn=`
attribute float aK; attribute vec2 aV;
varying vec3 vW; varying vec3 vN; varying float vK; varying vec2 vV;
void main(){ vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; vN = normal; vK = aK; vV = aV; gl_Position = projectionMatrix * viewMatrix * w; }`,Bn=`
varying vec3 vW; varying vec3 vN; varying float vK; varying vec2 vV;
uniform vec3 uPalW[5]; uniform float uSeedW, uFront;
${it}${bt}${$o}${Pa}
const vec2 WC = vec2(${P.x.toFixed(1)}, ${P.z.toFixed(1)});
const float R0 = ${P.r.toFixed(1)}, R1 = ${(P.r+P.deep).toFixed(1)}, NB = ${Yo.toFixed(1)}, LIP = ${uo.toFixed(2)}, TAU = 6.2831853;
// (a draw between 0 and 1 from one number: our own, a sine and a cosine)
float h1w(float n){ return fract(sin(n * 27.619 + 3.7) * 24634.6345 + cos(n * 41.233) * 7919.137); }
// (the passing front: two arms round the well, 40 m from turn to turn, a turn of the phase in 6 s; uFront: where the
// front stands at the clock's nought, a share of its period, dealt by the seed)
float wellWave(float th, float y){ float ph = fract(th / 3.14159265 + y / 40. + uTime / 6. + uFront), s = sin(3.14159265 * min(ph / .3, 1.)); return s * s; }
// A STOREY'S OWN COLOUR, as a place of the five (cobalt, turquoise, lilac, plum, warm white). (round eleven) THE
// STOREYS TAKE PLUM, COBALT, TURQUOISE AND LILAC IN TURN, from the lowest up (which of the four the floor's own
// storey takes is the seed's): no two neighbours alike, and no storey is warm white
float storeyCol(float s){ return mod(mod(s + floor(uSeedW), 4.) + 3., 4.); }
// (a gallery's carpet: the storey's colour. The plum and the cobalt deep and calm; THE LILAC AND THE TURQUOISE
// CLEAR AND LIGHTER (round eleven c), each a tone named as it stands after the page's curve: the lilac a pink-violet of hue
// 282 to 285 degrees there, the turquoise a blue turquoise of hue 190)
vec3 carpetOf(float ci){ return abs(ci - 2.) < .5 ? vec3(.86, .5, 1.) : abs(ci - 1.) < .5 ? vec3(.06, .64, .78) : uPalW[int(ci)] * .43 + .02; }
void main(){
  vec3 toEye = cameraPosition - vW;
  float dist = length(toEye);
  vec3 dv = -toEye / max(dist, 1e-3);
  vec2 dC = vW.xz - WC;
  float r = length(dC), th = atan(dC.y, dC.x), fw = max(length(fwidth(vW)), .01), fy = max(fwidth(vW.y), .01);
  float sy = vV.x, sh = vV.y, bay = floor(th / TAU * NB), thc = (bay + .5) * TAU / NB, sIdx = floor(sy / 5. + .5);
  // THE FLOOR'S OWN STOREY keeps the floor's mixed colours (three bays to a colour); EVERY OTHER STOREY IS LIT IN ONE
  // COLOUR, each bay a shade brighter or deeper, one bay in seven warm white
  bool own = abs(sy) < .5;
  float mainI = storeyCol(sIdx), dst = floor((bay + floor(h1w(sIdx * 7.3 + uSeedW) * 9.)) / 3.);
  float cDraw = h1w(dst * 3.17 + sIdx * 17.3 + uSeedW), sDraw = h1w(bay * 1.713 + sIdx * 31.1 + uSeedW * 3.), tDraw = h1w(bay * 2.39 + sIdx * 5.7 + uSeedW);
  vec3 rcS = uPalW[int(mainI)], rc = own ? uPalW[int(cDraw * 4.999)] : mix(rcS * (.8 + .34 * tDraw), uPalW[4], step(.86, fract(tDraw * 7.31)));
  bool plain = sDraw < .08, doorB = sDraw >= .08 && sDraw < .28, dim = sDraw > .92;
  float litR = plain ? 0. : dim ? .15 : 1., wv = wellWave(th, vW.y), tone = .8, glow = 0.;
  vec3 alb = vec3(.955, .95, .93), add = vec3(0.), col;
  if (vK < .5) {
    // a gallery's floor: on the floor's own storey PALE STONE; on every other A CARPET IN THE STOREY'S COLOUR with a
    // border of pale stone along the rim; a joint at every bay; a shade at the wall's foot; each lit room's colour
    // lies before it; a pool of white light under the desk lamp of every other bay
    float rr = r - R0, u = (th - thc) * r, jb = (3.14159265 / NB - abs(th - thc)) * r, ja = abs(rr - 3.);
    // (the joints: 3 cm in a bay of 6 m: their own mean is 0.01 of the floor, and they fade to none)
    float jt = max(clamp((.03 - jb) / fw + .5, 0., 1.), own ? clamp((.03 - ja) / fw + .5, 0., 1.) : 0.) * clamp(.08 / fw, 0., 1.);
    // (round eleven: EVERY gallery's floor is a carpet in its storey's colour, the floor's own storey's too; along
    // the rim a band of the same colour a shade deeper, 0.9 m broad: no pale stone)
    float border = 1. - smoothstep(.9 - fw, .9 + fw, rr);
    tone = .8 - .1 * exp(-(6. - rr) / 1.2) + .05 * wv;
    alb = carpetOf(mainI) * (1. - .3 * border) * (1. - .16 * jt);
    float sp = litR * (1. - smoothstep(1.5, 3.1, abs(u))) * exp(-(6. - rr) / 2.8);
    alb = mix(alb, rc * .92, .5 * sp); tone += .05 * sp;
    vec2 dl = vec2(u - 1.2, rr - 1.6);
    float pool = step(.5, mod(bay + sIdx, 2.)) * exp(-dot(dl, dl) / 2.6);
    // (round eleven c: the lamp's pool is neutral white, not warm)
    alb = mix(alb, vec3(.96), .6 * pool); tone += .08 * pool;
  } else if (vK < 1.5) {
    // a lip. (round eleven c) A TIER'S FRONT IS A THIN SLAB EDGE IN ITS STOREY'S OWN CARPET COLOUR (the shade of the
    // carpet's band along the rim), the slim glass rail over it, and NO LINE OF LIGHT UNDER ANY TIER; the bridge's,
    // the spur's and the platform's edge beams (vV.y 6) stay white, each with its line of light along its foot
    bool beam = abs(sh - 6.) < .25;
    float yy = vW.y - (sy - LIP), line = beam ? clamp((.22 - yy) / fy + .5, 0., 1.) : 0.;
    if (!beam) alb = carpetOf(mainI) * .7;
    // (a tier's edge has its carpet's own tone, .8; THE PASSING FRONT LIFTS A SURFACE OF THE WELL BY A FIFTH OF ITS
    // OWN TONE: the edge, a gallery's under side, a storey's wall)
    tone = (beam ? .86 : .8 * (1. + .2 * wv)) * (1. - line);
    add = vec3(1., .93, .78) * (1. + 1.8 * wv) * line; glow = line;
  } else if (vK < 2.5) {
    // a slab's under side: white, in the glow of the storey under it. (round eleven c) ONE SLIM BAR OF LIGHT TO A BAY,
    // LYING ALONG THE RADIUS (the weave's strand turned to the ring): 4 m long, two thirds of the gallery's depth,
    // and 0.5 m broad, in the middle of its bay. No round light, and no strip of light behind the lip.
    float rr = r - R0;
    vec2 qb = abs(vec2(rr - 3., (th - thc) * r)) - vec2(2., .25);
    float dd = length(max(qb, 0.)) + min(max(qb.x, qb.y), 0.);
    // (a bar of 2 m2 in its bay of 35: the bars' own mean is 0.055 of the under side; far off they settle to it)
    float vis = clamp(1.1 / fw, 0., 1.), face = mix(.055, 1. - smoothstep(-fw, fw, dd), vis), halo = 1. - smoothstep(0., 1.65, dd), kd = wellWave(thc, vW.y);
    float sB = sy > 7.5 && sy < 12.5 ? 0. : sIdx - 1.;
    alb = mix(alb, uPalW[int(storeyCol(sB))], .3);
    // (the under side's own tone: four fifths of the carpet's, .64; the front lifts it by a fifth of that)
    tone = (.64 * (1. + .2 * wv) + .14 * halo) * (1. - face);
    add = vec3(1., .98, .94) * (.95 + 2.2 * kd * sqrt(kd)) * face; glow = face;
  } else if (vK < 3.5) {
    // a back wall and the rooms behind it
    float u = (th - thc) * R1, yy = vW.y - sy, Hs = sh - LIP, hd = min(Hs - .7, 5.), sill = doorB ? 0. : .55, hwO = doorB ? 1.25 : 2.45;
    float inO = (1. - smoothstep(hwO - fw, hwO + fw, abs(u))) * (1. - smoothstep(hd - fy, hd + fy, yy)) * smoothstep(sill - fy, sill + fy, yy) * (plain ? 0. : 1.);
    float jb = 3.14159265 / NB * R1 - abs(u), joint = clamp((.03 - jb) / fw + .5, 0., 1.) * clamp(.08 / fw, 0., 1.);
    // (round eleven c: THE FLOOR'S OWN STOREY'S WALL, the tallest band right round the well, IS THE LOBBY'S COOL WHITE;
    // every other storey's wall keeps its storey's own soft shade. Their own tones at the wall's foot: .84 and .6
    // (three quarters of the carpet's). The front lifts a shaded wall by a fifth of its tone; the white wall, which
    // stands a step under white already, by a tenth)
    tone = ((own ? .84 : .6) * (1. + (own ? .1 : .2) * wv) + (own ? .06 : .12) * smoothstep(0., Hs, yy)) * (1. - .12 * joint) * (1. - .2 * (1. - smoothstep(.25, .3 + fy, yy)));
    alb = own ? vec3(.93, .95, 1.) : mix(alb, rcS, .42);
    // (a fine pale frame round the opening)
    float fr = max(abs(u) - hwO, max(yy - hd, sill - yy));
    tone += .14 * (1. - smoothstep(.1, .1 + fw, abs(fr))) * clamp(.2 / fw, 0., 1.) * (plain ? 0. : 1.);
    vec2 tng = vec2(-sin(thc), cos(thc)), outw = vec2(cos(thc), sin(thc));
    float du = dot(dv.xz, tng), dw = max(dot(dv.xz, outw), .04), dy = dv.y, RW = 2.95, RD = 5.5, RH = Hs - .1;
    float tb = RD / dw, tu = (du > 0. ? RW - u : RW + u) / max(abs(du), 1e-4), ty = (dy > 0. ? RH - yy : yy) / max(abs(dy), 1e-4), t = min(tb, min(tu, ty));
    vec3 q = vec3(u + du * t, yy + dy * t, dw * t), room, emis = vec3(0.);
    // (round eleven b) THE ROOM'S KIND AND ITS HAND (which side its things stand on), dealt by its bay and storey
    float kDraw = h1w(bay * 4.71 + sIdx * 13.7 + uSeedW * 1.3), kind = kDraw < .45 ? 0. : kDraw < .8 ? 1. : 2., hand = h1w(bay * 6.13 + sIdx * 3.9 + uSeedW * 2.1) < .5 ? -1. : 1.;
    vec3 lp = roomLight(RW, RD, kind);
    float lampG = exp(-((q.x - lp.x * hand) * (q.x - lp.x * hand) + (q.y - lp.y) * (q.y - lp.y) * 1.4 + (q.z - lp.z) * (q.z - lp.z) * .5) / 3.4);
    // (round eleven) EVERY ROOM IS A DOORWAY WITH DEPTH AND A LIT INSIDE: the wall is 0.5 m thick, and its pale
    // reveal is seen round the opening (jamb, head or sill, as the eye's ray strikes it); inside, ONE WALL IN THE
    // ROOM'S COLOUR (the back one, deep), the side walls pale and darker toward the back, the floor deep, the
    // ceiling white with its slim bar of light; the room's lamp lights what stands round it
    float tj = .5 / dw;
    vec2 qj = vec2(u + du * tj, yy + dy * tj);
    bool reveal = abs(qj.x) > hwO || qj.y > hd || qj.y < sill;
    // (its back wall: one plain tone, a shade lighter toward the ceiling)
    if (tb <= min(tu, ty)) room = rc * (.58 + .14 * q.y / RH);
    else if (tu < ty) room = mix(rc, vec3(.9, .89, .86), .66) * (.46 + .42 * (1. - q.z / RD));
    else if (dy > 0.) {
      // (round eleven c: one slim bar of light, 2.4 m long and 0.4 m broad, from the front toward the back)
      vec2 qc = abs(vec2(q.x, q.z - RD * .5)) - vec2(.2, 1.2);
      float cl = 1. - smoothstep(-.05, .05, max(qc.x, qc.y));
      room = mix(mix(rc, vec3(.97), .7) * .8, vec3(1.), cl); emis += vec3(1., .98, .94) * .8 * cl;
    } else room = (rc * .36 + .04) * (.7 + .3 * (1. - q.z / RD));
    // (THE ROOM LAMP'S WASH IS WHITE LIGHT: where it is strongest it lifts a face by two thirds of the face's own
    // tone, the same on every channel, so that the room's colour keeps its own hue lit and in shade; the lamp's
    // shade itself stays warm, a small thing)
    room *= 1. + vec3(${(2/3).toFixed(4)}) * lampG;
    // (where the wash would lift one channel over .9, the page's white, the whole colour is held back together, so
    // that no channel is cut off alone and the hue stays)
    room *= min(1., .9 / max(max(room.r, max(room.g, room.b)), .02));
    // (the room's things: a second colour for the cabinet's doors, two places on in the storeys' four; the room
    // beyond a doorway warm white)
    vec3 glowT, c2 = mix(uPalW[int(mod(mainI + 2., 4.))], vec3(.92), .18);
    vec4 th = roomThings(vec3(u * hand, yy, 0.), vec3(du * hand, dy, dw), RW, RD, t, kind, c2, vec3(1., .93, .8), glowT);
    if (th.w < t) {
      vec3 pt = vec3(u + du * th.w, yy + dy * th.w, dw * th.w) - vec3(lp.x * hand, lp.y, lp.z);
      room = th.rgb * (1. + vec3(.36) * exp(-dot(pt, pt) / 5.)); emis = glowT;
    }
    if (reveal) { room = vec3(.8, .8, .82) * (abs(qj.x) > hwO ? .62 + .2 * step(0., du * qj.x) : qj.y > hd ? .66 : .88); emis = vec3(0.); }
    room = mix(mix(vec3(.3, .34, .46), rc, .2) * .7, room, litR);
    emis = (emis + rc * .12) * litR;
    // (a door's leaf slides across its opening by the doors' law; a glazed front has one fine mullion)
    if (doorB) {
      float o = doorOpen(WC.x + WC.y + R1 * (outw.x + outw.y) + sy * 3.), le = -hwO + 2. * hwO * o, leaf = smoothstep(le - fw, le + fw, u);
      float pu = u - le;
      vec3 lc = mix(vec3(.93), rc, .45) * (.92 - .1 * step(.3, pu) * step(pu, 2. * hwO - .3) * step(abs(fract(yy / (hd * .5)) - .5), .4));
      room = mix(room, lc, leaf); emis *= 1. - leaf;
    } else room = mix(room, vec3(.9, .91, .93), (1. - smoothstep(.04, .04 + fw, abs(u))) * clamp(.1 / fw, 0., 1.) * .8);
    col = mix(lit3(alb * tone), lit3(min(room, vec3(.9))) + emis, inO);
    gl_FragColor = vec4(wellAir(col, vW, dist, .3 * inO * litR), 1.);
    return;
  } else if (vK < 4.5) {
    // the well's ceiling: white, and THE WEAVE OF LIGHT on it (round eleven c): square cells of 6 m about the well's
    // axis, in each ONE SLIM BAR 4 m long and 1 m broad, along in one cell and across in the next, turn about. No
    // round light stands on it, and none round the pendant's root.
    vec2 cj = floor(dC / 6.), mid = (cj + .5) * 6., r6 = dC - mid;
    vec2 qb = abs(mod(cj.x + cj.y, 2.) < .5 ? r6 : r6.yx) - vec2(2., .5);
    float dd = length(max(qb, 0.)) + min(max(qb.x, qb.y), 0.), rm = length(mid);
    // (a bar of 4 m2 in its cell of 36: the bars' own mean is 0.111 of the ceiling; far off they settle to it; a
    // cell whose middle lies further than 44 m from the axis holds none: a bar's far corner is 2.1 m from its middle)
    float face = mix(.111, 1. - smoothstep(-fw, fw, dd), clamp(1.6 / fw, 0., 1.)) * step(rm, 44.), k4 = wellWave(atan(mid.y, mid.x), 40. + rm * .5);
    tone = .8 * (1. - face);
    add = vec3(1., .98, .94) * (1.05 + 2.1 * k4 * sqrt(k4)) * face; glow = face;
  } else if (vK < 5.5) {
    gl_FragColor = vec4(lit3(vec3(.76, .84, .95)), 1.);
    return;
  } else if (vK < 7.5) {
    // the platform's floor: PALE TIMBER in boards of 0.45 m, each a breath lighter or deeper, ONE FINE INLAID RING
    // near its rim; the island's great lamp lays its warm pool on it; a soft shade under the ring of desks
    float rp = r, bd = vW.x / .45, bj = (.5 - abs(fract(bd) - .5)) * .45, ring = clamp((.06 - abs(rp - 8.2)) / fw + .5, 0., 1.) * clamp(.12 / fw, 0., 1.);
    alb = vec3(.92, .83, .68) * (.95 + .09 * h1w(floor(bd) * 1.37)) * (1. - .16 * clamp((.012 - bj) / fw + .5, 0., 1.) * clamp(.04 / fw, 0., 1.));
    alb = mix(alb, vec3(.5, .42, .34), .8 * ring);
    tone = (.8 + .14 * exp(-rp * rp / 70.)) * (1. - .09 * smoothstep(4.3, 5.2, rp) * (1. - smoothstep(7.2, 8.1, rp)));
    alb *= 1. + vec3(.12, .05, -.04) * exp(-rp * rp / 60.);
  } else if (vK < 8.5) {
    // a plain white body: tops brightest, under sides lit from the bright depth, sides by the way they face
    tone = vN.y > .5 ? .86 : vN.y < -.5 ? .76 + .05 * wv : .78 + .08 * dot(normalize(vN.xz + vec2(1e-4)), vec2(.45, .89));
  } else { alb = vec3(.8, .82, .86); tone = .78 + .1 * abs(dot(normalize(vN.xz + vec2(1e-4)), vec2(.6, .8))); }
  col = lit3(min(alb * tone, vec3(.9))) + add;
  gl_FragColor = vec4(wellAir(col, vW, dist, glow), 1.);
}`,kn=`
varying vec2 vU; varying vec3 vW;
void main(){ vU = uv; vec4 w = modelMatrix * vec4(position, 1.); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,Tn=`
varying vec2 vU; varying vec3 vW;
${bt}${$o}
void main(){
  float fv = max(fwidth(vU.y), 1e-3), top = clamp((vU.y - .955) / fv + .5, 0., 1.) * clamp(.09 / fv, .1, 1.), foot = clamp((.03 - vU.y) / fv + .5, 0., 1.) * clamp(.06 / fv, 0., 1.);
  float dist = length(cameraPosition - vW), hz = pow(clamp((-40. - vW.y) / 54., 0., 1.), 1.3);
  float a = max(.035, max(.7 * top, .3 * foot)) * (1. - hz);
  vec3 c = mix(vec3(.9, .95, 1.), vec3(1.12, 1.12, 1.1), max(top, foot));
  if (vU.x > 1.5) {
    // (round eleven) A GLASS DECK (the bridge's, or the spur's): CLEAR, so that the galleries below are seen through
    // it; A FINE LIT EDGE on each side; A SLIM WHITE RIB across it every 3 m; a cool sheen that grows at the flat
    // look and never hides what lies under it
    bool spur = vU.x > 2.5;
    float e = spur ? 1.6 - abs(vW.z - (${P.z.toFixed(1)})) : 3. - abs(vW.x + 68.), al = spur ? vW.x + 71. : vW.z - (${Re.n.toFixed(3)});
    float fw = max(length(fwidth(vW.xz)), .01);
    float edge = clamp((.42 - e) / fw + .5, 0., 1.) * clamp((e - .3) / fw + .5, 0., 1.) * clamp(.12 / fw, .3, 1.);
    float rib = clamp((.07 - abs(fract(al / 3.) - .5) * 3.) / fw + .5, 0., 1.) * clamp(.14 / fw, .2, 1.) * step(.3, e);
    float flat_ = pow(max(1. - abs(normalize(cameraPosition - vW).y), 0.), 4.);
    // (the first 0.3 m from each side is the edge beam's own white top)
    float beam = 1. - clamp((e - .3) / fw + .5, 0., 1.);
    a = max(max(max(edge, .9 * rib), beam), .05 + .17 * flat_);
    c = mix(mix(mix(vec3(.62, .78, 1.), vec3(.86, .87, .86), rib), vec3(.84, .84, .82), beam), vec3(1.25, 1.14, .9), edge);
  }
  gl_FragColor = vec4(c, a);
}`;function Ja(e=!1){const o=ue();if(e){o.box(-2.1,2.1,1.71,1.85,.8,2.6,Ee,0,!0);for(const a of[-1.94,1.94])o.quad([a,0,.95],[a,0,2.45],[a,1.71,2.45],[a,1.71,.95],[a<0?-1:1,0,0],ee);return o.cyl(-1.2,1.6,.6,.26,2.5,3,le,.9,4,2,le,1).cyl(.3,3.6,.7,.76,1.05,1.28,io,0,4,1),o.quad([-.35,1.15,4.3],[.95,1.15,4.3],[.95,2.5,4.42],[-.35,2.5,4.42],[0,0,-1],ee),o.build()}return o.box(-2.1,2.1,1.71,1.85,.8,2.6,Ee,0,!0).box(-2,-1.88,0,1.71,.95,2.45,ee).box(1.88,2,0,1.71,.95,2.45,ee),o.cyl(-1.2,1.6,.04,.04,1.85,2.6,$,0,4,0).cyl(-1.2,1.6,.6,.26,2.5,3,le,.9,6,2,le,1),o.cyl(.3,3.6,.08,.08,.1,1.05,$,0,4,0).cyl(.3,3.6,.7,.76,1.05,1.28,io,0,6,3),o.quad([-.35,1.15,4.3],[.95,1.15,4.3],[.95,2.5,4.42],[-.35,2.5,4.42],[0,0,-1],ee),o.build()}const Lt={rise:2,reach:[1.2,3],period:[24,60]};function Hn(){const e=ue();return e.cyl(0,0,.16,.16,7.8,P.top,ee,0,6,0).cyl(0,0,.16,.16,-93,-2.1,ee,0,6,0),e.build()}function e0(e){const o=ue();if(o.cyl(0,0,1.3,1.3,0,1.5,At,.8,12,3,At,1),e)for(let a=0;a<8;a++){const r=(a+.5)/8*Math.PI*2,u=Math.cos(r),n=Math.sin(r),t=3.3*u,s=3.3*n,l=.44;o.quad([1.3*u,1.1,1.3*n],[t,1.1,s],[t,1.18,s],[1.3*u,1.18,1.3*n],[-n,0,u],$),o.cyl(t,s,.03,.03,.75+l,1.1,$,0,3,0),o.cyl(t,s,.02,.866*l,.75-l,.75-.5*l,At,1,6,0).cyl(t,s,.866*l,.866*l,.75-.5*l,.75+.5*l,At,1,6,0).cyl(t,s,.866*l,.02,.75+.5*l,.75+l,At,1,6,0)}return o.build()}function Pn(e){return Et.filter(([o])=>o!==0).map(([o])=>[o,e.range(Lt.period[0],Lt.period[1]),e.range(0,1),e.range(Lt.reach[0],Lt.reach[1])])}function qn(e){const o=[],a=[],r=[];for(const[n,t,s,l]of e)for(const[c,i]of[[-1,-1],[1,-1],[1,1],[-1,-1],[1,1],[-1,1]])o.push(P.x,n+Lt.rise+.75-l,P.z),a.push(c,i),r.push(t,s,l);const u=new x.BufferGeometry;return u.setAttribute("position",new x.Float32BufferAttribute(o,3)),u.setAttribute("uv",new x.Float32BufferAttribute(a,2)),u.setAttribute("aRide",new x.Float32BufferAttribute(r,3)),u}const Gn=`
attribute vec3 aRide;
uniform float uTime;
varying vec2 vU; varying float vHz;
void main(){
  // (the cluster's own ride: the things' law of a slow glide up and down again)
  vec3 p = position;
  p.y += aRide.z * (.5 - .5 * cos(6.2831853 * (uTime / max(aRide.x, .05) + aRide.y)));
  vU = uv; vHz = pow(clamp((-40. - p.y) / 54., 0., 1.), 1.3);
  vec4 mv = modelViewMatrix * vec4(p, 1.);
  mv.xy += uv * 5.;
  gl_Position = projectionMatrix * mv;
}`,Dn=`
varying vec2 vU; varying float vHz;
void main(){
  float d = dot(vU, vU), a = (.42 * exp(-d * 9.) + .07 * exp(-d * 2.2)) * (1. - smoothstep(.6, 1., d));
  gl_FragColor = vec4(vec3(1., .72, .36) * a * (1. - .8 * vHz), 1.);
}`;var Zn={id:"floor-without-windows",name:"The Floor Without Windows",category:"screen",placeKind:"interior",screen:"Severance",screenYear:"2022",screenKind:"series",media:["air"],weirdness:.6,async build(e){const o=d=>e.core.makeRng(e.core.hashSeed(d+":"+e.seed)),a=o("fww-look"),r=o("fww-doors"),u=o("fww-island"),n=o("fww-hall"),t=o("fww-rooms"),s=o("fww-well"),l=o("fww-plain"),c=o("fww-niche"),i=o("fww-gallery"),b=o("fww-alcove"),y=o("fww-link-doors"),w=o("fww-lobby-trees"),h=o("fww-room-deal"),v=o("fww-pendant"),m=e.quality?e.quality.detail:1,f=new x.Scene;f.background=new x.Color(pt.color.x,pt.color.y,pt.color.z);const g={value:0},L=e.vary||{rare:!1,density:1,mood:.5,hour:"any"},M=a.shuffle(G0.slice()),B={first:M[0],second:M[1]},I=Ia(3),p=W0(I.map(d=>[d[0],d[1],d[2]]));await e.yield();const O=Ia(.5),H=new Float32Array(O.length);for(let d=1;d<O.length;d++)H[d]=H[d-1]+Math.hypot(O[d][0]-O[d-1][0],O[d][1]-O[d-1][1],O[d][2]-O[d-1][2]);const U=H[H.length-1],j=d=>{const E=Ze(d/se.end,0,1)*(O.length-1),A=Math.min(Math.floor(E),O.length-2);return(H[A]+(H[A+1]-H[A])*(E-A))/U},X=d=>{const E=Ze(d,0,1)*U;let A=0,S=H.length-1;for(;S-A>1;){const C=A+S>>1;H[C]<=E?A=C:S=C}return(A+(E-H[A])/Math.max(H[S]-H[A],1e-6))/(O.length-1)*se.end},J=new x.Vector3(F.CORE.x,P0[0],F.CORE.z),Y={glassEnd:xt(F.LOBBY.glassN),loggiaEnd:xt(Fe.zN),bridge0:xt(Re.s),bridge1:xt(Re.n),platA:xt(P.z+P.plat),platB:xt(P.z-P.plat)};{const d=P.x+P.half,E=P.z+P.half,A=k=>{const z=we(k);return(d-z[0])*(J.z-z[1])-(E-z[1])*(J.x-z[0])};let S=Y.glassEnd,C=Y.loggiaEnd;const R=A(S);for(let k=0;k<40;k++){const z=(S+C)/2;A(z)*R>0?S=z:C=z}Y.covered=(S+C)/2}const ie=10,re=[[0,20.8],[Y.glassEnd,16],[Y.bridge0,15.4],[Y.bridge1+ie,20.8],[se.quay,17.8],[se.rise-ie,13],[se.top+ie,38],[se.roof,34],[se.plaza,27],[se.court-ie,22],[se.street,19.5]],me=d=>{let E=re[0][1];for(let A=1;A<re.length;A++)E+=(re[A][1]-re[A-1][1])*Do(re[A][0]-ie,re[A][0]+ie,d);return E},ze=d=>me(X(d))/15;await e.yield();const he=await R0(e,{time:g}),Ie=he.uniforms.sky;he.uniforms.roof.uAfter.value.z=(50-(Ze(L.density??1,.7,1.3)-1)*33.3)*Math.PI/180,f.add(he.object),await e.yield();const Be=(d,E,A)=>[d[0]+(E[0]-d[0])*A,d[1]+(E[1]-d[1])*A,d[2]+(E[2]-d[2])*A],Ne=q(B.first),ke=Be(oe,Ne,2/3),Mt=q(B.second),Ht=Be(oe,Mt,2/3),Pt=Nt(3.5,F.CH,F.COVE,Ne,Rt,Fa),mo=Nt(3.5,F.CH,F.COVE,null,Rt,Fa),vo=[{a:[0,0],b:[3.5-.96,0],part:0,col:Rt},{a:[3.5-.96,0],b:[3.5,0],part:0,col:Ne},{a:[3.5,F.CH],b:[0,F.CH],part:4.2,col:oe}];vo.hw=3.5,vo.headD=3.5;const t0=[],po=[],wo=[],xo=(d,E,A,S,C)=>{const R=[];for(const[k,z,N]of d)for(const W of ka(k,z,N,[E,A],[S,C]))(!R.length||W>R[R.length-1]+1e-6)&&R.push(W);return R};function Zo(d,E,A,S,C,R,k,z=[],N=[]){const W=xo(A,S,C,z,N);ct(d,E,W,1,R,S,z,N),ct(d,E,W,-1,k,C,N,z)}async function o0(d,E,A,S,C,R,k,z=[],N=[]){const W=xo(A,S,C,z,N),T=40,_=V=>Math.round((W.length-1)*V/T);await e.yield();for(const[V,G,Z,K,ae]of[[1,R,S,z,N],[-1,k,C,N,z]])for(let te=0;te<T;te++){const D=te===0?-1e9:W[_(te)],Q=te===T-1?1e9:W[_(te+1)];ct(d,E,W.slice(_(te),_(te+1)+1),V,G,Z,K,ae,ne=>ne>D&&ne<=Q),(V>0||te<T-1)&&await e.yield()}}const qt=(d,E,A,S,C,R)=>({q:S,x:d[0]-d[3]*A*E,z:d[1]+d[2]*A*E,ci:C,kind:R});function Gt(d,E,A,S,C,R,k,z,N={}){const W=E(A),T=N.ci===void 0?r.int(0,5):N.ci;if(R.push([A-gt/2,A+gt/2]),N.light){const _=A-gt/2-1.4,V=_+.9,G=E((_+V)/2),Z=-G[3]*S,K=G[2]*S,ae=[-Z,0,-K],te=[5,G[2],G[3]];R.push([_,V]);const D=(ne,ye,ve)=>[G[0]+G[2]*ne+Z*(C+ve),ye,G[1]+G[3]*ne+K*(C+ve)],Q=(ne,ye,ve,pe,be,Ge)=>d.quad([D(ne,ve,be),D(ye,ve,be),D(ye,pe,be),D(ne,pe,be)],ae,Ge,We,te);Q(-.45,-.39,.5,fe,.03,He),Q(.39,.45,.5,fe,.03,He),Q(-.39,.39,fe-.06,fe,.03,He),Q(-.39,.39,2.51,2.59,.03,He),Q(-.45,.45,0,.5,-.06,oe),d.quad([D(-.45,.5,-.06),D(.45,.5,-.06),D(.45,.5,Ce),D(-.45,.5,Ce)],[0,1,0],oe,We,te)}if(N.furnish){const _=-W[3]*S,V=W[2]*S,G=[-_,0,-V],Z=[5,W[2],W[3]],K=gt/2,ae=(D,Q,ne)=>[W[0]+W[2]*D+_*(C+ne),Q,W[1]+W[3]*D+V*(C+ne)],te=(D,Q,ne,ye,ve,pe,be=Z)=>d.quad([ae(D,ne,ve),ae(Q,ne,ve),ae(Q,ye,ve),ae(D,ye,ve)],G,pe,We,be);te(-K,-K+.07,0,fe,.02,He),te(K-.07,K,0,fe,.02,He),te(-K+.07,K-.07,fe-.07,fe,.02,He),te(-K,K,St,St+.12,.14,He),te(-K,K,St+.12,fe,.15,Ke[T].map(D=>D*.5),[7,W[2],W[3]]);for(const D of[-K/3,K/3])te(D-.03,D+.03,St+.12,fe,.14,He)}no(d,W,S,C+Ce,N.w||9,N.depth||9,N.h||5.6,Ke[T],N.furnish?{...N,wall:Ke[T].map(_=>_*.7)}:N),t0.push(_0(d,W,S,C+Ce-(N.slide<0?.12:.03),gt+.3,N.furnish?St:fe+.1,N.furnish?Be(oe,z,.3):z,N.slide||1,N.slide?4.1:gt+.4,N.furnish?Ke[T].map(_=>_*.42):null)),k.push(qt(W,S,C,A,T,1)),po.push({B:d,f:W,side:S,d0:C+Ce,depth:N.depth||9,w:N.w||9,furnish:!!N.furnish,ci:T})}const dt=4.2,go=2.5,Le=yt(),yo=4.2,St=4.2,Xo=[];function Dt(d,E,A,S,C,R,k){const z=E(A),N=b.int(0,3);R.push([A-dt/2,A+dt/2]),no(d,z,S,C+.12,dt-.04,yo-.12,fe-.02,Ke[N],{y0:.012,wall:Ke[N].map(W=>W*.7)}),k.push(qt(z,S,C,A,N,3)),Xo.push({B:d,f:z,side:S,d0:C+.12})}const jt=[],Jo=[],_t=[],ea=[],Vt=(d,E,A,S,C,R,k,z)=>{for(const[N,W]of ja(C,R,k)){const T=E(N);d.push({x:T[0]-T[3]*A*S,y:z,z:T[1]+T[2]*A*S,nx:T[3]*S,nz:-T[2]*S,free:W,q:N,side:S,n:T[0]+T[1]})}},ta=(d,E)=>E.slice(0,64).forEach((A,S)=>d.uniforms.uLampW.value[S].set(A.q,A.side*A.free));function a0(d,E,A,S,C,R,k,z,N=dt,W=-1){const T=E(A),_=E(A-N/2),V=E(A+N/2),G=c.int(0,5);R.push([A-N/2,A+N/2]);const Z=Math.hypot(V[0]-V[3]*C*S-_[0]+_[3]*C*S,V[1]+V[2]*C*S-_[1]-_[2]*C*S);if(no(d,T,S,C+.12,Z-.04,go-.12,fe-.02,Ke[G],{y0:.012}),k.push(qt(T,S,C,A,G,3)),!z){wo.push({B:d,f:T,side:S,d0:C+.12,kind:W});const K=C+go-.02;(d===Le?Jo:ea).push({x:T[0]-T[3]*K*S,y:4.6,z:T[1]+T[2]*K*S,nx:T[3]*S,nz:-T[2]*S,free:N/2-.1})}}const bo=lo(g,[3.5,F.CH,0,1],null,1/140,!1,ke,Ie);bo.uniforms.uGalQ.value=Y.loggiaEnd;const at=F.LOBBY,oa=6,$t=[0,2,3],aa=Math.max(...$t.map(d=>fo[d][1]))/2,n0=Math.max(...$t.map(d=>fo[d][2])),Ao=2.7,na=9,s0=1.5,Kt=.5,sa=Y.bridge0-se.mouth,ft=Math.floor(sa/(aa+Ao+s0)),l0=sa/ft,Ut=d=>se.mouth+(d+.5)*l0,Eo=(d,E,A,S)=>[-S,S].every(C=>[3.5,3.5+A].every(R=>{const k=we(d+C),z=k[0]-k[3]*R*E,N=k[1]+k[2]*R*E,W=q0+Kt;return(z<F.H1.x0-W||z>F.H1.x1+W||N<F.H1.z0-W||N>F.H1.z1+W)&&(z<at.x0-Kt||z>at.x1+Kt||N<at.z0-Je.deep-Kt)})),la=Array.from({length:ft},(d,E)=>E).filter(d=>Eo(Ut(d),-1,Ce+n0,aa)).sort((d,E)=>Math.abs(d+.5-ft/2)-Math.abs(E+.5-ft/2)||d-E)[0],Lo=[{q:Ut(la),side:-1}],i0={clocks:4,drawers:2,tree:3,chairs:2,lamps:4,paper:4},ia=[$t[h.int(0,$t.length-1)]];{const d=[],E=[],A=[],S=[];Lo.forEach((R,k)=>{E.push([R.q-oa,R.q+oa]),S.push(qt(we(R.q),R.side,3.5,R.q,i0[fo[ia[k]][0]],2))});const C=r.shuffle([0,1,2,3]);for(let R=0,k=0;R<ft;R++){const z=Ut(R);R!==la&&Eo(z,-1,Ce+na,Ao)&&Gt(Le,we,z,-1,3.5,E,S,ke,{w:2*Ao,depth:na,ci:C[k++%4],slide:1,furnish:!0})}for(let R=0;R<ft;R++){const k=Ut(R);k-dt/2>Y.loggiaEnd+1&&Eo(k,1,yo,dt/2)&&Dt(Le,we,k,1,3.5,d,A)}await e.yield();{const R=xo([[se.mouth,Y.loggiaEnd,15],[Y.loggiaEnd,Y.bridge0,10]],d,E,A,S);ct(Le,we,R,-1,mo,E,S,A),await e.yield(),ct(Le,we,R.filter(k=>k<=Y.loggiaEnd+.002),1,vo,[],[],S),ct(Le,we,R.filter(k=>k>=Y.loggiaEnd-.002),1,Pt,d,A,S),so(Le,[-68,Fe.zN,-1,0],3.5,F.CH,F.COVE,0,F.CH,oe,[-1]),so(Le,[-68,at.z0,-1,0],3.5,F.CH,F.COVE,0,F.CH,oe,[1]),Vt(jt,we,3.5,1,Y.loggiaEnd+.3,Y.bridge0-.3,d,3.9),Vt(jt,we,3.5,-1,se.mouth+.3,Y.bridge0-.3,E,3.9)}{const k=Fe.zN,z=F.LOBBY.glassN,N=F.CH,W=[5,0,-1],T=q("#eeece6"),_=q("#f4f3ee",.78),V=(G,Z,K,ae,te,D,Q)=>{Le.quad([[G,K,te],[G,K,D],[G,ae,D],[G,ae,te]],[-1,0,0],Q,We,W),Le.quad([[Z,K,te],[Z,K,D],[Z,ae,D],[Z,ae,te]],[1,0,0],Q,We,W),D-te<1?(Le.quad([[G,K,te],[Z,K,te],[Z,ae,te],[G,ae,te]],[0,0,-1],Q,We,W),Le.quad([[G,K,D],[Z,K,D],[Z,ae,D],[G,ae,D]],[0,0,1],Q,We,W)):(Le.quad([[G,ae,te],[Z,ae,te],[Z,ae,D],[G,ae,D]],[0,1,0],Q,We,W),Le.quad([[G,K,te],[Z,K,te],[Z,K,D],[G,K,D]],[0,-1,0],Q,We,W))};V(-64.5-.3,-64.5,0,N-.6,at.z0-.15,at.z0+.15,T),V(-64.5-.35,-64.5,N-.6,N-.001,k,z,_),V(-64.5-.025,-64.5+.025,1.17,1.21,k,z,He),V(-64.5-.04,-64.5+.04,0,.06,k,z,T)}}await e.yield();const nt=ue(),Ot={face:[],hand:[],drawer:[],blob:[],lamp:[],sheet:[],chair:[]};Lo.forEach((d,E)=>{const[A,S,C,R,k]=fo[ia[E]],z=q(A==="clocks"?"#f4f1e8":A==="chairs"?"#bfd4f5":A==="drawers"?"#cfd6dc":A==="tree"?"#c6ecee":"#f4f3ee"),N={floor:A==="chairs"?q("#b9d2ee"):Xe};d.holds=A;const W=we(d.q);no(Le,W,d.side,3.5+Ce,S,C,R,z,N),k(nt,Ot,Bt(W,d.side,3.5+Ce,0),t,S,C,R)});const Mo=ue();for(let d=0;d<Je.n;d++)An(Mo.at(Je.at(d),0,at.z0-Je.deep/2,w.range(0,6.28)),d%2);for(const d of qa)En(Mo,d);await e.yield();const ra=ue(),ca=xn(ra,i);let So=ca.next();for(;!So.done;)await e.yield(),So=ca.next();const r0=So.value;await e.yield(),Lo.forEach(d=>{const E=Bt(we(d.q),d.side,3.5+Ce,0),A=d.holds==="chairs"?1:n.int(0,1);Ya(nt,E,A,d.side*4.4,.9,n),Ya(nt,E,A===1?0:1,-d.side*4.6,.9,n)}),await e.yield();function c0(d,E,A,S,C,R){let k=0;for(const z of R.concat([[A,A]]))z[0]>k&&ct(d,E,ka(k,z[0],400,[C]),1,S,C.filter(N=>N[0]>k&&N[1]<z[0])),k=z[1]}ta(bo,jt);const Ye=Ct(g,1/900,.7),Te=new x.Group;Te.name="well of storeys";const ut=Ct(g,0,.7,!0),ha={value:0};{const d=Wn(),E=Rn(d);let A=E.next();for(;!A.done;)await e.yield(),A=E.next();const S={quad:(W,T)=>d.quad(W,T,8),tri:(W,T)=>d.tri(W,T,8)},C=10-Tt,R=P.r+P.deep;for(const[W,T,_,V,G,Z]of[[Re.s,1,3.5,F.CH,-72.5,-63.5],[Re.n,-1,de.hw,de.h,-76,-60]]){so(S,[-68,W,T,0],_,V,F.COVE,0,C,oe);for(const[K,ae]of[[G,-68-_],[-68+_,Z]])d.quad([[K,0,W],[ae,0,W],[ae,C,W],[K,C,W]],[0,0,-T],8);for(const[K,ae]of[[G,-1],[Z,1]]){const te=P.z+T*Math.sqrt(R*R-(K-P.x)**2);d.quad([[K,0,W],[K,0,te],[K,C,te],[K,C,W]],[ae,0,0],8)}}await e.yield();const k=W=>{const T=parseInt(W.slice(1),16);return new x.Vector3((T>>16&255)/255,(T>>8&255)/255,(T&255)/255)},z=new x.Mesh(d.build(),new x.ShaderMaterial({uniforms:{uTime:g,uPalW:{value:Cn.map(k)},uSeedW:{value:s.range(0,40)},uFront:ha},vertexShader:Fn,fragmentShader:Bn,side:x.DoubleSide,polygonOffset:!0,polygonOffsetFactor:1,polygonOffsetUnits:2}));z.name="well shell",Te.add(z),await e.yield();const N=new x.Mesh(Nn(),new x.ShaderMaterial({vertexShader:kn,fragmentShader:Tn,transparent:!0,depthWrite:!1,side:x.DoubleSide}));N.name="well rails",N.renderOrder=2,Te.add(N),await e.yield()}{const d=new x.Matrix4,E=ue(),A=pn(E,u),S=F.ISLAND.x,C=F.ISLAND.z,R=A.map(([D,Q])=>({m:d.clone().makeTranslation(S+D,0,C+Q),move:[1,u.range(.25,.6)*(u.chance(.5)?1:-1),u.range(0,6.28),0]}));for(const[D,Q,ne]of[[E.build(),[{m:d.clone().makeTranslation(S,0,C)}],"island"],[Ua(io,2.25),R,"island chairs"],[Hn(),[{m:d.clone().makeTranslation(S,0,C)}],"pendant"]]){const ye=De(D,ut,Q);ye.name=ne,Te.add(ye),await e.yield()}{const D=Pn(v),Q=([pe,be,Ge,za])=>({m:d.clone().makeRotationY(pe*.21).setPosition(S,pe+Lt.rise-za,C),move:[7,be,Ge,za]}),ne=De(e0(!0),ut,D.filter(([pe])=>pe>=-60).map(Q)),ye=De(e0(!1),ut,D.filter(([pe])=>pe<-60).map(Q));ne.name="pendant lamps",ye.name="pendant lamps far",Te.add(ne),Te.add(ye);const ve=new x.Mesh(qn(D),new x.ShaderMaterial({uniforms:{uTime:g},vertexShader:Gn,fragmentShader:Dn,transparent:!0,depthWrite:!1,blending:x.AdditiveBlending}));ve.name="pendant glow",ve.frustumCulled=!1,ve.renderOrder=3,Te.add(ve)}await e.yield();const k=[],z=[],N=new x.Euler,W=new x.Quaternion,T=new x.Vector3,_=new x.Vector3(1,1,1),V=[],G=(D,Q,ne=P.r)=>new x.Matrix4().compose(T.set(P.x+ne*Math.cos(D),Q,P.z+ne*Math.sin(D)),W.setFromEuler(N.set(0,Math.PI/2-D,0)),_);for(const[D]of Et){if(D<-40)continue;const Q=Math.floor(D/5+.5);for(let ne=0;ne<Yo;ne++){const ye=-Math.PI+(ne+.5)*Math.PI*2/Yo,ve=P.x+(P.r+1.7)*Math.cos(ye);if(((ne+Q)%2+2)%2!==0){D===0&&Math.abs(ve+68)>9&&V.push(ye);continue}D===0&&Math.abs(ve+68)<9||(D>=-5&&D<=10?k:z).push({m:G(ye,D)})}}const Z=De(Ja(),ut,k),K=De(Ja(!0),ut,z);Z.name="gallery desks",K.name="gallery desks far",Te.add(Z),Te.add(K),await e.yield();const ae=ue();V.forEach((D,Q)=>{const ne=Math.cos(D),ye=Math.sin(D),ve=be=>[P.x+(P.r+be)*ne,P.z+(P.r+be)*ye],pe=Q%3;if(pe===0){const be=ve(1.9);et(ae.at(be[0],0,be[1],s.range(0,6.28),.62))}else if(pe===1){const be=ve(1.5);ae.at(be[0],0,be[1],Math.PI/2-D);for(let Ge=0;Ge<4;Ge++)ae.box(-1.8,1.8,1.05,1.13,-.5+Ge*.27,-.3+Ge*.27,Ee,0,!0);for(const Ge of[-1.5,1.5])ae.box(Ge-.06,Ge+.06,0,1.05,-.45,.5,$)}else{const be=ve(1.4);ae.at(be[0],0,be[1]).cyl(0,0,.45,.3,0,.12,$,0,8,1).cyl(0,0,.06,.06,.12,3.4,$,0,5,0).cyl(0,0,.62,.42,3.3,4.05,le,.8,8,3,le,1)}}),ae.at();const te=new x.Mesh(ae.build(),ut);te.name="gallery things",Te.add(te),ha.value=s()}f.add(Te),await e.yield();const Yt=he.uniforms.tide.uBlueA.value,Qt=he.uniforms.tide.uBlueB.value,da=[(Yt.x+Qt.x)/2,(Yt.y+Qt.y)/2,(Yt.z+Qt.z)/2],_e=yt();{const d=(_,V,G)=>[_[0]+(V[0]-_[0])*G,_[1]+(V[1]-_[1])*G,_[2]+(V[2]-_[2])*G],E=(_,V)=>_.map(G=>G.part!==0?G:G.col===Xe?{...G,col:da}:{...G,colAt:Z=>d(V,d(da,[1,1,1],.25),Do(se.link+1,se.quay-1,Z))}),A=Nt(de.hw,de.h,F.COVE,Ne,Xe),S=E(A,Ne),C=E(Nt(de.hw,de.h,F.COVE,null,Xe),Ne);S.hw=C.hw=de.hw,S.headD=C.headD=A.headD;const R=[],k=[],z=[],N=[];Gt(_e,we,se.link+11.5,1,de.hw,R,z,ke,{light:!0,furnish:!0,ci:y.int(0,3)}),Gt(_e,we,se.link+8,-1,de.hw,k,N,ke,{light:!0,furnish:!0,ci:y.int(0,3)}),Dt(_e,we,se.link+4.5,1,de.hw,R,z),Dt(_e,we,se.link+18.5,1,de.hw,R,z),Dt(_e,we,se.link+15,-1,de.hw,k,N),Zo(_e,we,[[Y.bridge1,se.quay,3]],R,k,S,C,z,N),Vt(_t,we,de.hw,1,Y.bridge1+.3,se.quay-.3,R,3.9),Vt(_t,we,de.hw,-1,Y.bridge1+.3,se.quay-.3,k,3.9);const W=F.H2.z1,T=[[0,.02],[.2,-.04],[.3,-.2],[.3,-.5],[0,-.5]];for(let _=0;_<T.length-1;_++){const V=T[_],G=T[_+1],Z=-(G[1]-V[1]),K=G[0]-V[0],ae=Math.hypot(Z,K)||1;_e.quad([[-68-de.hw,V[1],W-V[0]],[-68+de.hw,V[1],W-V[0]],[-68+de.hw,G[1],W-G[0]],[-68-de.hw,G[1],W-G[0]]],[0,K/ae,-Z/ae],oe,We,[5,1,0])}Vo(_e,-68-de.hw,-67.5-de.hw,0,.4,W-.25,W+.3,oe),Vo(_e,-68.5+de.hw,-68+de.hw,0,.4,W-.25,W+.3,oe)}const mt=lo(g,[de.hw,de.h,0,1],null,1/500,!1,ke,Ie);mt.uniforms.uCarpet.value=1,mt.uniforms.uBlueA.value=Yt,mt.uniforms.uBlueB.value=Qt,mt.uniforms.uSeam.value=he.uniforms.tide.uSeam.value,ta(mt,_t);const fa=new x.Mesh(_e.build(),mt);fa.name="link and quay",f.add(fa),await e.yield();const Zt=yt(),ce=F.H2,Me=F.CON;{const d=D0(ce.deep,ce.h,!1),E=ce.x1-ce.x0,A=[[z=>[ce.x0+z,ce.z1,1,0],-68-ce.x0,de.hw,de.h,F.COVE],[z=>[ce.x1,ce.z1-z,0,-1],ce.z1-Me.z,Me.w/2,11,.02],[z=>[ce.x1-z,ce.z0,-1,0],null],[z=>[ce.x0,ce.z0+z,0,1],null]];for(const[z,N,W,T,_]of A)c0(Zt,z,E,d,[],N===null?[]:[[N-W,N+W]]),N!==null&&so(Zt,z(N),W,T,_,ce.deep,ce.h,oe);const S=F.OC,C=[];for(let z=0;z<96;z++)C.push(z/96*Math.PI*2);for(const[z,N]of[[ce.x0,ce.z0],[ce.x1,ce.z0],[ce.x1,ce.z1],[ce.x0,ce.z1]])C.push((Math.atan2(N-S.z,z-S.x)+Math.PI*2)%(Math.PI*2));C.sort((z,N)=>z-N);const R=z=>[S.x+(S.r+F.WELL.thick)*Math.cos(z),ce.h,S.z+(S.r+F.WELL.thick)*Math.sin(z)],k=z=>{const N=Math.cos(z),W=Math.sin(z),T=Math.min(N>1e-9?(ce.x1-S.x)/N:N<-1e-9?(ce.x0-S.x)/N:1e9,W>1e-9?(ce.z1-S.z)/W:W<-1e-9?(ce.z0-S.z)/W:1e9);return[S.x+T*N,ce.h,S.z+T*W]};for(let z=0;z<C.length;z++){const N=C[z],W=z+1<C.length?C[z+1]:C[0]+Math.PI*2;Zt.quad([R(N),R(W),k(W),k(N)],[0,-1,0],oe,We,[4,1,0])}}const h0=lo(g,[0,ce.h,0,0],[0,0,1,0],1/900,!1,null,Ie),ua=new x.Mesh(Zt.build(),h0);ua.name="hall two",f.add(ua),await e.yield();const st=new x.Group,vt=[];st.name="riders";{const d=T0(e.seed);let E=d.next();for(;!E.done;)await e.yield(),E=d.next();const A=E.value;H0(he.uniforms.tide.tLamps.value,A),await e.yield();const S=[sn(),dn(),fn(),un(),mn(),cn(),Ga(),hn()],C=new x.Matrix4;await e.yield(),S.forEach((R,k)=>{const z=A.filter(W=>W.kind===k),N=De(R,Ye,z.map(()=>({m:C})));st.add(N),vt.push({mesh:N,items:z,late:0})});for(const R of[0,1]){const k=A.filter(z=>(z.kind===0||z.kind===5)&&z.lamp===R);if(k.length){const z=De(ln(R),Ye,k.map(()=>({m:C})));st.add(z),vt.push({mesh:z,items:k,late:.45})}}}await e.yield();const d0=new x.PlaneGeometry(1,1).rotateX(-Math.PI/2).translate(0,.07,0),f0=new x.ShaderMaterial({transparent:!0,depthWrite:!1,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,vertexShader:"varying vec2 vU; void main(){ vU = uv * 2. - 1.; gl_Position = projectionMatrix * viewMatrix * modelMatrix * instanceMatrix * vec4(position, 1.); }",fragmentShader:"varying vec2 vU; void main(){ float d = length(max(abs(vU) - .62, 0.)) / .38; gl_FragColor = vec4(.008, .014, .07, .82 * (1. - smoothstep(.25, 1., d))); }"}),Oo=vt.filter(d=>d.late===0).flatMap(d=>d.items),zo=new x.InstancedMesh(d0,f0,Oo.length);zo.frustumCulled=!1,st.add(zo),Oo.forEach(d=>{d.sx=Math.max(d.hx,.5)*3.5,d.sz=Math.max(d.hz,.5)*3.5}),vt.push({mesh:zo,items:Oo,late:0,flat:!0}),await e.yield(),f.add(st);const zt=new x.Mesh(rn(),Ye);zt.name="tide stair",zt.position.set(rt.x,0,rt.z),zt.frustumCulled=!1,f.add(zt),await e.yield();const ma=new x.Vector3(0,1,0),u0=new x.Vector3,Io=new x.Quaternion,m0=new x.Quaternion,v0=new x.Vector3,va=new x.Vector3(1,1,1),p0=new x.Matrix4,Wo=[0,0];function pa(d){for(let E=0;E<vt.length;E++){const A=vt[E],S=A.mesh.instanceMatrix.array;for(let C=0;C<A.items.length;C++){const R=A.items[C];k0(wt,R.x,R.z,d-A.late,Wo),Io.setFromUnitVectors(ma,u0.set(-Wo[0],1,-Wo[1]).normalize()),Io.multiply(m0.setFromAxisAngle(ma,R.yaw+R.rate*d)),p0.compose(v0.set(R.x,F.H2.floor+B0(wt,R.x,R.z,d),R.z),Io,A.flat?va.set(R.sx,1,R.sz):va.set(R.size,R.size,R.size)).toArray(S,C*16)}A.mesh.instanceMatrix.needsUpdate=!0}}pa(0),await e.yield();const wa=[];async function Ro(d,E,A,S,C,R,k,z=.3,N=0){const W=Q=>[E+Q,A,1,0,-1],T=C/2,V=Nt(T,11,2,Mt).filter(Q=>Q.part===0||Q.low).concat([{a:[T,fe],b:[T,k],part:1,col:oe},{a:[T,k],b:[T,k+.35],part:2,col:oe},{a:[T,k+.35],b:[T,R],part:1,col:oe}]);V.hw=T,V.headD=T;const G=[],Z=[],K=[],ae=[];for(const[Q,ne,ye,ve]of[[1,G,K,6],[-1,Z,ae,9.5]]){for(let pe=ve;pe<S-9;pe+=14)Gt(d,W,pe,Q,T,ne,ye,Ht);for(let pe=ve+7;pe<S-9;pe+=14)a0(d,W,pe,Q,T,ne,ye);for(const[pe,be]of ja(.6,S-.6,ne))wa.push({x:E+pe,y:3.6,z:A+T*Q,nx:0,nz:-Q,free:be})}const te=Q=>{const ne=Ze(Q/S,0,1);return N+z*ne*ne*ne*ne},D=V.map(Q=>Q.part!==0?Q:{...Q,colAt:ne=>Be(Q.col,Na,te(ne))});D.hw=V.hw,D.headD=V.headD,await o0(d,W,[[0,S,6]],G,Z,D,D,K,ae),await e.yield()}const No=(d,E,A,S,C,R,k=0,z=null,N=null)=>{const W=lo(g,[d/2,E,A+.17,1],null,.00016666666666666666,!0,Ht,Ie);W.uniforms.uOpenL.value=k,z&&W.uniforms.uPool.value.set(...z),N&&W.uniforms.uStd.value.set(...N);const T=R.pile.filter(V=>!V.plate),_=he.uniforms.roof.uPal.value;return W.uniforms.uSto.value.forEach((V,G)=>{const Z=T[Math.min(G,T.length-1)].ci;Z===0?V.set(.949,.863,.682):V.copy(_[Z])}),W.uniforms.uFogIn.value.set(pt.color.x,pt.color.y,pt.color.z),W.uniforms.uGate.value.set(...S),W.uniforms.uRing.value.set(...C),W},Co=yt();await Ro(Co,Me.x0,Me.z,Me.x1-1.4-Me.x0,Me.w,Me.h,8),Vo(Co,Me.x0-.3,Me.x0+.25,0,.4,Me.z-Me.w/2,Me.z+Me.w/2,oe);const Qe=new x.Group;Qe.add(new x.Mesh(Co.build(),No(Me.w,Me.h,8,[Me.x1-Me.x0,F.CORE.door/2,F.CORE.door,44],[0,0],he.towers[0],Me.x1-1.4-Me.x0))),Qe.children[0].name="concourse open stretch",await e.yield();const xa=yt(),Se=F.STREET,ge=F.FORE,Fo=F.TOWB,ga=[Fo.door/2,Fo.door,40],ya=[F.RING_Y,8];await Ro(xa,Se.x0,Se.z,ge.x0-Se.x0,Se.w,F.ROOF,5.65,.1),Qe.add(new x.Mesh(xa.build(),No(Se.w,F.ROOF,5.65,[Se.x1-Se.x0,...ga],ya,he.towers[1],ge.x0-Se.x0,null,[7.75,13,6.7]))),Qe.children[1].name="street";const Xt=yt(),w0=d=>[ge.x0+d,Se.z,1,0,-1],Jt=Se.x1-1.4-ge.x0,x0=Be(Rt,Na,.1),eo=[{a:[Fo.door/2+F.REVEAL.broad,0],b:[ge.hw,0],part:0,col:x0},{a:[ge.hw,0],b:[ge.hw,F.ROOF],part:1,col:oe}];eo.hw=ge.hw,eo.headD=ge.hw,await Ro(Xt,ge.x0,Se.z,Jt,2*ge.hw,F.ROOF,5.65,0,.1),Zo(Xt,w0,[[Jt,Jt+5,5]],[],[],eo,eo);for(const d of[-1,1])Xt.quad([[ge.x0,0,Se.z+d*Se.w/2],[ge.x0,0,Se.z+d*ge.hw],[ge.x0,F.ROOF,Se.z+d*ge.hw],[ge.x0,F.ROOF,Se.z+d*Se.w/2]],[1,0,0],oe,[0,d*12,Se.z-ge.x0,-1],[1,1,0]);Qe.add(new x.Mesh(Xt.build(),No(2*ge.hw,F.ROOF,5.65,[Se.x1-ge.x0,...ga],ya,he.towers[1],Jt,[F.POOL.x0-ge.x0,F.POOL.x1-ge.x0,F.POOL.hw],[5,9,F.POOL.hw+4]))),Qe.children[2].name="forecourt";const It=(d,E,A,S,C=3.6)=>{const R=new x.Matrix4,k=new x.Quaternion,z=new x.Vector3,N=new x.Vector3(1,1,1),W=new x.Vector3(0,1,0),T=d.map(G=>({m:R.clone().compose(z.set(G.x,G.y,G.z),k.setFromAxisAngle(W,Math.atan2(G.nx,G.nz)),N),move:G.n===void 0?void 0:[8,0,G.n,Ae.lamp]})),_=De(tn(),E,T),V=new x.InstancedMesh(on(C),new x.ShaderMaterial({uniforms:{uTime:g,uFogK:{value:A},uGain:{value:S}},vertexShader:an,fragmentShader:nn,transparent:!0,depthWrite:!1,blending:x.CustomBlending,blendEquation:x.AddEquation,blendSrc:x.OneFactor,blendDst:x.SrcAlphaFactor,blendSrcAlpha:x.ZeroFactor,blendDstAlpha:x.OneFactor}),Math.max(T.length,1));return T.forEach((G,Z)=>V.setMatrixAt(Z,G.m)),V.geometry.setAttribute("aFree",new x.InstancedBufferAttribute(new Float32Array(Math.max(T.length,1)).map((G,Z)=>d[Z]?d[Z].free:1),1)),V.geometry.setAttribute("aWave",new x.InstancedBufferAttribute(new Float32Array(Math.max(T.length,1)*2).map((G,Z)=>{const K=d[Z>>1];return Z%2?K&&K.n!==void 0?Ae.lamp:1:K&&K.n!==void 0?K.n:0}),2)),V.count=T.length,V.frustumCulled=!1,V.renderOrder=3,_.name="bracket lamps",V.name="bracket lamps light",[_,V]};for(const d of It(wa,Ye,1/6e3,.8))Qe.add(d);f.add(Qe);for(const d of It(_t,Ye,1/500,.95,3.9).concat(It(ea,Ye,1/900,.9,4.58)))f.add(d);await e.yield();const to=ue(),Bo={face:[],hand:[]};for(let d=0;d<po.length;d++){const E=po[d],A=E.B===Le?nt:to,S=Bt(E.f,E.side,E.d0,0);E.furnish?Sn(A,S,l,E.w,E.depth,E.side,Be(Ke[(E.ci+2)%4],oe,.25)):Mn(A,S,l.int(0,4),l,E.depth),d%8===7&&await e.yield()}for(const d of Xo){const E=d.B===Le?nt:to,A=Bt(d.f,d.side,d.d0,0),S=yo-.12;A.at(E,-d.side,0,S*.5+.3).cyl(0,0,.42,.3,0,.1,$,0,10,1).cyl(0,0,.05,.05,.1,2.5,$,0,6,0).cyl(0,0,.55,.36,2.45,3.1,le,.8,10,3,le,1),b.chance(.5)?et(A.at(E,d.side*.95,0,S*.5,b.range(0,6.28),.5)):ho(A.at(E,d.side*.95,0,S*.5,b.range(0,6.28),.8)),E.at()}for(let d=0;d<wo.length;d++){const E=wo[d];In(E.B===Le?nt:to,E.B===Le?Ot:Bo,Bt(E.f,E.side,E.d0,0),E.kind>=0?E.kind:c.int(0,6),c,go-.12),d%3===2&&await e.yield()}await e.yield();const Ve=new x.Group;Ve.add(new x.Mesh(await Le.buildLong(e),bo)),Ve.children[0].name="corridors and rooms";{const d=new x.Mesh(Q0(),new x.ShaderMaterial({uniforms:{uTime:g,uSky:Ie,uFogIn:{value:new x.Vector3(...q("#f4f3ee",.92))}},vertexShader:Z0,fragmentShader:X0,side:x.DoubleSide}));d.name="lobby",Ve.add(d)}{const d=new x.PlaneGeometry(Fe.glass,F.LOBBY.h);d.rotateY(Math.PI/2),d.translate(-64.5,F.LOBBY.h/2,Fe.z0-Fe.glass/2);{const A=Fe.zN,S=F.LOBBY.glassN,C=d.attributes.position.array,R=d.attributes.normal.array,k=d.attributes.uv.array,z=Array.from(d.index.array),N=Array.from(C).concat([-64.5,1.17,A,-64.5,1.17,S,-64.5,.06,A,-64.5,.06,S]),W=Array.from(R).concat([1,0,0,1,0,0,1,0,0,1,0,0]),T=Array.from(k).concat([0,1,1,1,0,0,1,0]);d.setAttribute("position",new x.Float32BufferAttribute(N,3)),d.setAttribute("normal",new x.Float32BufferAttribute(W,3)),d.setAttribute("uv",new x.Float32BufferAttribute(T,2)),d.setIndex(z.concat([4,6,5,6,7,5]))}const E=new x.Mesh(d,new x.ShaderMaterial({uniforms:{uFogKIn:{value:1/140}},vertexShader:V0,fragmentShader:$0,transparent:!0,depthWrite:!1,side:x.DoubleSide}));E.name="gallery glass",E.renderOrder=2,Ve.add(E)}await e.yield();{const d=Ct(g,.007142857142857143),E=Ln();E.chair=Ga(),await e.yield();const A=new x.Mesh(await nt.buildLong(e),d);A.name="room things",Ve.add(A);const S=new x.Mesh(Mo.build(),Ct(g,1/520));S.name="lobby things",Ve.add(S),await e.yield();for(const R of It(jt,d,1/140,.95,3.9).concat(It(Jo,d,1/140,.9,4.58)))Ve.add(R);for(const R of Object.keys(Ot))if(Ot[R].length){const k=De(E[R],d,Ot[R]);k.name="room "+R+"s",Ve.add(k)}{const R=new x.Matrix4,k=Ct(g,0,0,!1,!0),z=r0.map(([_,V,G,Z])=>({m:R.clone().makeRotationY(G).setPosition(_,0,V),move:Z?[1,i.range(.2,.5)*(i.chance(.5)?1:-1),0,0]:[0,0,0,0]})),N=De(Ua(q("#84449a"),2.5),k,z),W=new x.Mesh(ra.build(),k),T=new x.Mesh(gn(),new x.ShaderMaterial({uniforms:{uTime:g,uPal:he.uniforms.roof.uPal},vertexShader:yn,fragmentShader:bn,side:x.DoubleSide}));N.name="court chairs",W.name="court things",T.name="court";for(const _ of[T,W,N])f.add(_)}await e.yield();const C=new x.Mesh(await to.buildLong(e),Ye);C.name="rooms beyond",f.add(C);for(const R of["face","hand"])if(Bo[R].length){const k=De(E[R].clone(),Ye,Bo[R]);k.name="concourse "+R+"s",f.add(k)}}f.add(Ve),await e.yield();const ko=(d,E)=>{const A=X(d),S=we(A);return E.set(S[0],N0(A),S[1])},Oe=new x.Vector3,To=new x.Vector3,Ho=Math.PI/180,ba=d=>d<-6?0:d>6?d:(d+6)*(d+6)/24,$e=(d,E,A)=>(ba(d-E)-ba(d-A))/(A-E),g0=45,y0=22,b0=(d,E)=>{const A=X(E);ko(E,Oe);const S=$e(A,Y.platB,Y.bridge1),C=$e(A,Y.covered,Y.platA),R=C-S,k=$e(A,Y.loggiaEnd,Y.platA)-S,z=J.x-Oe.x,N=Oe.z-J.z,W=Math.atan2(z,N)*(1-C)-g0*Ho*R,T=Math.atan2(J.y-Oe.y,Math.hypot(z,N))*(1-C)-y0*Ho*k,_=Math.cos(T)*80;return To.set(Oe.x+Math.sin(W)*_,Oe.y+Math.sin(T)*80,Oe.z-Math.cos(W)*_)},Po=new x.Vector3(F.CORE.x,(F.ROOF+F.SLAB)/2,F.CORE.z),A0=(F.ROOF+J.y)/2,oo=new x.Vector3(F.CORE.x,Po.y,F.CORE.z),E0=2/3,L0=20*Ho,Aa=.42,Ea=Math.atan2((rt.top+rt.head)/2-F.TIDE_EYE,F.RISE),La=d=>d-2*Math.PI*Math.round(d/(2*Math.PI)),qo=new x.Vector3,M0=new x.Vector3,Go=new x.Vector3,Ma=new x.Vector3,S0=(d,E,A)=>{const S=Math.acos(Ze(d.dot(E),-1,1));return S>1e-4&&A>0&&(Go.crossVectors(d,E),Go.lengthSq()>1e-10&&d.applyAxisAngle(Go.normalize(),S*A)),d},O0=(d,E)=>{const A=X(E);if(A<se.link)return b0(d,E);ko(E,Oe);const S=oo.x-Oe.x,C=oo.z-Oe.z;if(A<se.top){const k=we(A),z=Math.atan2(k[2],-k[3]);let N=E0*$e(A,se.quay,se.rise-6)*La(Math.atan2(rt.x-Oe.x,Oe.z-rt.z)-z);A>se.west&&(N=Math.max(La(Math.atan2(S,-C)-z),N));const W=$e(A,se.west+6,se.top-6),T=(Ea*$e(A,se.quay,se.rise-6)-(Ea+L0)*$e(A,se.rise+F.RISE_LATE,se.west))*(1-W)+Math.atan2(Po.y-Oe.y,Math.hypot(S,C))*W,_=Math.cos(T)*100;return To.set(Oe.x+Math.sin(z+N)*_,Oe.y+Math.sin(T)*100,Oe.z-Math.cos(z+N)*_)}const R=$e(A,se.plaza,se.corner-6);return oo.y=Po.y*(1-R)+A0*R,ko(Math.min(E+10/U,1),Ma),qo.subVectors(Ma,Oe).normalize(),S0(qo,M0.subVectors(oo,Oe).normalize(),1-(1-Aa)*R-Aa*$e(A,se.corner,se.court)),To.copy(Oe).addScaledVector(qo,100)},Sa=-2*ie/U,Oa=j(se.court+2*ie),z0=[{at:O0,from:Sa,to:Oa,weight:1,fade:ie/U/(Oa-Sa),arc:!0}],lt=new x.Vector3;function I0(d,E,A){g.value=E,lt.setFromMatrixPosition(A.matrixWorld);const S=lt.y>11.5,C=S||lt.x>60;he.above.visible=C||lt.z<Re.n-6,he.furn.visible=C,he.tide.visible=S?lt.x<64:lt.z<-80&&lt.x<50,Ve.visible=!C,Te.visible=!C,st.visible=he.tide.visible,zt.visible=he.tide.visible,st.visible&&pa(E)}return{scene:f,path:p,duration:50,pace:ze,pois:z0,camera:{fov:64,near:.3,far:5200,lookAhead:10,bank:.3},portal:{shape:"circle",radius:8,color:"#ffe2b8"},post:{exposure:1,bloom:{strength:.45,radius:.6,threshold:1.25},grade:{saturation:1+.08*Ze(L.mood??.5,0,1),contrast:1.03,vignette:.22,grain:.012}},ride:"none",companion:"none",update:I0,dispose(){}}}};export{Zn as default};
