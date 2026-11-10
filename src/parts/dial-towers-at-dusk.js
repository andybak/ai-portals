import*as b from"three";import{TOWERS as $,KNOTS as W,COLOURS as F,CREAM as K,UNIT as rt,SOUND as H,DIAL as V,GROUND_Y as j,dirOf as C}from"./dial-towers-at-dusk-data.js";const Y=a=>{const t=new b.Color(a);return[t.r,t.g,t.b]},N=(a,t=1)=>{const e=Y(a);return`vec3(${(e[0]*t).toFixed(6)}, ${(e[1]*t).toFixed(6)}, ${(e[2]*t).toFixed(6)})`},it=a=>{const t=Y(a);return .2126*t[0]+.7152*t[1]+.0722*t[2]},St=(a,t)=>{const e=Y(a),o=t*rt/it(a);return[e[0]*o,e[1]*o,e[2]*o]},U=`
const vec3 KEY = vec3(-0.988, 0.156, 0.0);
const vec3 FADE_W = ${N(F.fadeWest)}, FADE_H = ${N(F.fadeHalf)}, FADE_A = ${N(F.fadeAway)};
float westShare(vec2 dxz) {
  float l = max(length(dxz), 1e-5);
  float a = degrees(acos(clamp(-dxz.x / l, -1., 1.)));
  float x = clamp((a - 50.) / 60., 0., 1.);
  return 1. - x * x * (3. - 2. * x);
}
vec3 byShare(float w, vec3 west, vec3 halfw, vec3 away) { return w >= .5 ? mix(halfw, west, 2. * w - 1.) : mix(away, halfw, 2. * w); }
vec3 farFade(vec3 col, vec3 wp, vec3 eye, float rate) {
  vec3 d = wp - eye;
  float k = rate * .8 * clamp((length(d) - 350.) / 750., 0., 1.);
  return mix(col, byShare(westShare(d.xz), FADE_W, FADE_H, FADE_A), k);
}
float smooth01(float x) { x = clamp(x, 0., 1.); return x * x * (3. - 2. * x); }
`,lt=()=>({value:0});function ct(){return{pos:[],nor:[],loc:[],face:[],tw:[],k:[],idx:[],n:0,T:null}}function ft(a,t,e){const[o,n]=C(t.rot),s=t.w/2,i=Math.round(((t.facing-t.rot)%360+360)%360/90)%4,r=[1,0,-1,0][i],c=[0,1,0,-1][i];a.T={t,cx:e?e[0]:t.x,cz:e?e[1]:t.z,nx:o,nz:n,hw:s,fa:r,fb:c,R:t.face/2,tw:[s,0,0,t.belfry]}}function O(a,t,e,o,n){const s=a.T,i=t[0],r=t[1],c=t[2];a.pos.push(s.cx+i*s.nx-c*s.nz,r,s.cz+i*s.nz+c*s.nx),a.nor.push(e[0]*s.nx-e[2]*s.nz,e[1],e[0]*s.nz+e[2]*s.nx),a.loc.push(i,r,c);const f=i-s.fa*s.hw,m=c-s.fb*s.hw;return a.face.push((-f*s.fb+m*s.fa)/s.R,(r-s.t.faceY)/s.R,(f*s.fa+m*s.fb)/s.R),a.tw.push(s.tw[0],s.tw[1],s.tw[2],s.tw[3]),a.k.push(o,n,a.wash||e[0]*s.fa+e[2]*s.fb>.7?1:0),a.n++}function k(a,t,e,o,n,s,i=0,r=1){const c=e[0]-t[0],f=e[1]-t[1],m=e[2]-t[2],x=n[0]-t[0],h=n[1]-t[1],d=n[2]-t[2];let l=[f*d-m*h,m*x-c*d,c*h-f*x];const v=Math.hypot(l[0],l[1],l[2])||1;l=[l[0]/v,l[1]/v,l[2]/v];const u=l[0]*(t[0]-s[0])+l[1]*(t[1]-s[1])+l[2]*(t[2]-s[2])>=0;u||(l=[-l[0],-l[1],-l[2]]);const w=Math.min(t[1],e[1],o[1],n[1]),p=Math.max(t[1],e[1],o[1],n[1]),g=I=>i===1?1+(I[1]-w)/(p-w||1):r,y=O(a,t,l,i,g(t)),M=O(a,e,l,i,g(e)),A=O(a,o,l,i,g(o)),L=O(a,n,l,i,g(n));u?a.idx.push(y,M,A,y,A,L):a.idx.push(y,A,M,y,L,A)}function E(a,t,e,o,n,s,i,r=0,c=1,f=63){const m=[(t+e)/2,(o+n)/2,(s+i)/2];f&1&&k(a,[t,o,s],[t,o,i],[t,n,i],[t,n,s],m,r,c),f&2&&k(a,[e,o,s],[e,o,i],[e,n,i],[e,n,s],m,r,c),f&4&&k(a,[t,o,s],[e,o,s],[e,o,i],[t,o,i],m,r,c),f&8&&k(a,[t,n,s],[e,n,s],[e,n,i],[t,n,i],m,r,c),f&16&&k(a,[t,o,s],[e,o,s],[e,n,s],[t,n,s],m,r,c),f&32&&k(a,[t,o,i],[e,o,i],[e,n,i],[t,n,i],m,r,c)}const R=(a,t,e,o,n=0,s=1)=>E(a,-t,t,e,o,-t,t,n,s);async function ht(a,t){const e=new b.BufferGeometry,o=async()=>{t&&await t()};return e.setAttribute("position",new b.BufferAttribute(new Float32Array(a.pos),3)),await o(),e.setAttribute("normal",new b.BufferAttribute(new Float32Array(a.nor),3)),await o(),e.setAttribute("aLoc",new b.BufferAttribute(new Float32Array(a.loc),3)),await o(),e.setAttribute("aFace",new b.BufferAttribute(new Float32Array(a.face),3)),await o(),e.setAttribute("aTw",new b.BufferAttribute(new Float32Array(a.tw),4)),await o(),e.setAttribute("aK",new b.BufferAttribute(new Float32Array(a.k),3)),await o(),e.setIndex(new b.BufferAttribute(a.n>65535?new Uint32Array(a.idx):new Uint16Array(a.idx),1)),await o(),e.computeBoundingSphere(),e}const vt=a=>a-Math.floor(a);function X(a){const t=a.face/2,e=9+3*vt(.618*(a.rank+1)),o=a.faceY-t-1.5,n=a.faceY+t+1.5,s=Math.max(0,Math.min(2,Math.floor((a.belfry-.6-n-2)/e)+1)),i=[];for(let h=s-1;h>=0;h--)i.push(n+.6+h*e);for(let h=0;h<5-s;h++)i.push(o-h*e);const r=i.filter(h=>h>j+6&&h<a.belfry-2.5),c=et(a).y,f=[a.belfry-.6].concat(r);let m=null,x=1e9;for(let h=0;h+1<f.length;h++){const d=f[h]-(h?.6:0),l=f[h+1];if(l<a.faceY+t&&d>a.faceY-t||d-l<8.2)continue;const v=Math.abs((d+l)/2-c);v<x&&(x=v,m={y0:l+.9,y1:l+5.9})}return{s:e,yA:o,ys:r,rec:m,dialTop:s>=1?n:null}}const Z=[[1,0],[0,1],[-1,0],[0,-1]],z=(a,t,e,o)=>{const[n,s]=Z[a];return[n*e-s*t,o,s*e+n*t]};function J(a,t,e,o,n,s,i,r,c){const m=(e+o)/2,x=(o-e)/2,h=Math.min(x,s-n-2),d=s-h,l=z(t,m,r-c/2,i+5);for(let v=0;v<6;v++){const u=Math.PI*v/6,w=Math.PI*(v+1)/6,p=m-x*Math.cos(u),g=m-x*Math.cos(w),y=d+h*Math.sin(u),M=d+h*Math.sin(w);k(a,z(t,p,r,y),z(t,g,r,M),z(t,g,r,i),z(t,p,r,i),z(t,m,0,i),0,1),k(a,z(t,p,r-c,y),z(t,g,r-c,M),z(t,g,r-c,i),z(t,p,r-c,i),z(t,m,r+9,i),0,1),k(a,z(t,p,r,y),z(t,g,r,M),z(t,g,r-c,M),z(t,p,r-c,y),l,0,1)}}function S(a,t,e,o,n,s,i,r,c,f=1,m=0){const x=(d,l,v)=>z(t,d,l,v),h=z(t,(e+o)/2,n-s/2,(i+r)/2);k(a,x(e,n,i),x(o,n,i),x(o,n,r),x(e,n,r),h,c,f),k(a,x(e,n-s,i),x(o,n-s,i),x(o,n-s,r),x(e,n-s,r),h,c,f),k(a,x(e,n,i),x(e,n-s,i),x(e,n-s,r),x(e,n,r),h,c,f),k(a,x(o,n,i),x(o,n-s,i),x(o,n-s,r),x(o,n,r),h,c,f),m&1&&k(a,x(e,n,r),x(o,n,r),x(o,n-s,r),x(e,n-s,r),h,c,f),m&2&&k(a,x(e,n,i),x(o,n,i),x(o,n-s,i),x(e,n-s,i),h,c,f)}function mt(a,t,e,o,n,s){const i=s?6:4,r=2*(e-1.2),c=Math.min(1.6,(r-2.2)/3),f=(r-3*c)/4,m=.5,x=c/2,h=n-.3,d=h-x,l=(w,p,g)=>z(t,w,p,g),v=l(0,0,(o+n)/2);let u=-e;for(let w=0;w<3;w++){const p=-e+1.2+f+w*(c+f),g=p+c,y=(p+g)/2;k(a,l(u,e,o),l(p,e,o),l(p,e,n),l(u,e,n),v,0,1);for(let M=0;M<i;M++){const A=Math.PI*M/i,L=Math.PI*(M+1)/i,I=y-x*Math.cos(A),P=y-x*Math.cos(L),T=d+x*Math.sin(A),D=d+x*Math.sin(L);k(a,l(I,e,T),l(P,e,D),l(P,e,n),l(I,e,n),v,0,1);const at=(I+P)/2,nt=(T+D)/2,st=l(y+(at-y)*3,e-m/2,d+(nt-d)*3);k(a,l(I,e,T),l(P,e,D),l(P,e-m,D),l(I,e-m,T),st,0,.6)}if(k(a,l(p,e-m,o),l(g,e-m,o),l(g,e-m,h),l(p,e-m,h),v,0,.6),k(a,l(p,e,o),l(p,e-m,o),l(p,e-m,d),l(p,e,d),l(p-1,e-m/2,o),0,.6),k(a,l(g,e,o),l(g,e-m,o),l(g,e-m,d),l(g,e,d),l(g+1,e-m/2,o),0,.6),k(a,l(p,e,o),l(g,e,o),l(g,e-m,o),l(p,e-m,o),l(y,e-m/2,o-1),0,.8),s){const M=e+.1,A=.2,L=(I,P,T)=>l(y-(x+P)*Math.cos(I),T,d+(x+P)*Math.sin(I));for(let I=0;I<i;I++){const P=Math.PI*I/i,T=Math.PI*(I+1)/i;k(a,L(P,0,M),L(T,0,M),L(T,A,M),L(P,A,M),v,0,1)}for(const[I,P]of[[p,-1],[g,1]])k(a,l(I,M,o),l(I+P*A,M,o),l(I+P*A,M,d),l(I,M,d),v,0,1);S(a,t,p-.32,g+.32,e+.2,.2,o-.25,o,0,1,3)}u=g}k(a,l(u,e,o),l(e,e,o),l(e,e,n),l(u,e,n),v,0,1)}function dt(a,t,e){const o=t.w/2,n=j-2,s=t.belfry-.6,i=[],r=e.ys.filter(v=>v<=e.yA+.01);for(const v of[0,2])r[v]!==void 0&&i.push([r[v]-.6-1.5,r[v]-.6]);t.rank%2===0&&i.push([s-1.5,s]);const c=[n,s],f=e.rec;for(const[v,u]of i)v>n+1&&u<=s&&c.push(v,u);f&&c.push(f.y0,f.y1+.3),c.sort((v,u)=>v-u);for(let v=0;v+1<c.length;v++){const u=c[v],w=c[v+1];if(w-u<.01)continue;const p=i.some(([g,y])=>u>=g-.01&&w<=y+.01)?1:0;if(f&&u>=f.y0-.01&&w<=f.y1+.31){for(let g=0;g<4;g++)mt(a,g,o,u,w,a.near);continue}E(a,-o,o,u,w,-o,o,p,1,51)}const m=Math.round(((t.facing-t.rot)%360+360)%360/90)%4,[x,h]=Z[m],d=Math.min(e.yA-.6,s),l=e.dialTop!==null?e.dialTop+.6:s;for(const[v,u]of[[1,1],[1,-1],[-1,1],[-1,-1]]){const w=(p,g,y,M)=>{if(g-p<.5)return;const A=v*(o-1.2),L=v*(o+y),I=u*(o-1.2),P=u*(o+M);E(a,Math.min(A,L),Math.max(A,L),p,g,Math.min(I,P),Math.max(I,P),0,1,51)};w(n,d,.4,.4),w(d,l,x===v?-.02:.4,h===u?-.02:.4),w(l,s,.4,.4)}{const v=Math.round(((t.facing-t.rot)%360+360)%360/90)%4,u=t.face/2,w=a.near?40:16,p=u+.02,g=Math.min(u+.42,o-.03),y=.24,M=z(v,0,0,t.faceY),A=(L,I,P)=>{const T=2*Math.PI*L/w;return z(v,I*Math.cos(T),o+P,t.faceY+I*Math.sin(T))};for(let L=0;L<w;L++)k(a,A(L,p,y),A(L+1,p,y),A(L+1,g,y),A(L,g,y),M,0,1),a.wash=1,k(a,A(L,p,y),A(L+1,p,y),A(L+1,p,0),A(L,p,0),A(L+.5,p+1,y/2),0,1),a.wash=0,a.near&&k(a,A(L,g,y),A(L+1,g,y),A(L+1,g,0),A(L,g,0),M,0,1)}if(a.near){const v=i.filter(([u])=>u>n+2).map(([u])=>u-.25);f&&!v.some(u=>Math.abs(u-f.y1-.5)<.7)&&v.push(f.y1+.5);for(const u of v)for(let w=0;w<4;w++)S(a,w,-o+1.2,o-1.2,o+.14,.14,u,u+.25,0,1,3);for(const u of[t.faceY-.45*t.face/2,t.faceY+.45*t.face/2])for(let w=0;w<4;w++)w!==m&&S(a,w,-o+1.2,o-1.2,o+.14,.14,u,u+.25,0,1,3);for(let u=0;u<3;u++){const w=e.yA-u*e.s-.6;if(e.ys.some(p=>Math.abs(p-.6-w)<.01))for(let p=0;p<4;p++)S(a,p,-.3,.3,o+.42,.42,w-.5,w,0,.85,2)}}for(const v of e.ys)R(a,o+.5,v-.6,v)}function Q(a){const t=a.bell,e=a.ring-a.belfry,o=H.swing*Math.PI/180,n=Math.cos(o),s=Math.sin(o),i=x=>(G*x*n+.5*s)*t,r=x=>(.225*x*n+.13*s)*t+.05,c=Math.max(.6,Math.min(1,(e+.75-.63*s*t)/((G+.225)*n*t))),f=.1+i(c),m=e+.9-r(c);return{k:c,p:Math.max(f,Math.min(m,4+.5*G*t*c)),lo:f,hi:m}}function ut(a,t,e,o,n,s,i){const c=(e+o)/2,f=(o-e)/2,m=Math.min(f,n-s-2),x=n-m,h=i+.14,d=.38,l=(v,u,w)=>z(t,c-(f+u)*Math.cos(v),w,x+(m+u)*Math.sin(v));for(let v=0;v<6;v++){const u=Math.PI*v/6,w=Math.PI*(v+1)/6,p=z(t,c,i-1,x);k(a,l(u,0,h),l(w,0,h),l(w,d,h),l(u,d,h),p,0,1),k(a,l(u,d,h),l(w,d,h),l(w,d,i),l(u,d,i),p,0,1)}}function xt(a,t,e,o,n,s,i){const r=(e+o)/2,c=(o-e)/2,f=Math.min(c,n-s-2),m=n-f,x=i-.34,h=.07;S(a,t,e,o,x,.14,m-.07,m+.07,2);for(const d of[45,90,135]){const l=d*Math.PI/180,v=Math.cos(l),u=Math.sin(l),w=[r-c*v,m+f*u],p=z(t,r,x-.07,m+f),g=(y,M,A)=>z(t,y,A,M);k(a,g(r-h*u,m-h*v,x),g(r+h*u,m+h*v,x),g(w[0]+h*u,w[1]+h*v,x),g(w[0]-h*u,w[1]-h*v,x),p,2,1),k(a,g(r-h*u,m-h*v,x-.14),g(r+h*u,m+h*v,x-.14),g(w[0]+h*u,w[1]+h*v,x-.14),g(w[0]-h*u,w[1]-h*v,x-.14),p,2,1)}}function pt(a,t,e){const o=t.w/2,n=t.belfry,s=t.ring,i=Math.max(1.2,Math.min(2,.16*t.w)),r=.9,c=s-2.3,f=c-.4,m=t.frame==="iron",x=Math.round(((t.facing-t.rot)%360+360)%360/90)%4;R(a,o+.5,n-.6,n);const h=Q(t),d=n+h.p+.01*t.bell*h.k;for(let l=0;l<4;l++){S(a,l,-o,-o+i,o,i,n,c,0);const v=(l-x+4)%2===1,u=m?.3:.9,w=v?[[-o+i,o-i]]:[[-o+i,-u/2],[u/2,o-i]];for(const[p,g]of w){J(a,l,p,g,n,f,c,o,r);const y=(g-p)/2,M=f-Math.min(y,f-n-2);if(m){for(const A of[n+.55,n+1.05])S(a,l,p,g,o-.3,.14,A,A+.14,2);v||xt(a,l,p,g,f,n,o)}else S(a,l,p,g,o-.15,.4,n,n+1,0,1,1);e&&(ut(a,l,p,g,f,n,o),S(a,l,p-.4,p+.06,o+.14,r+.28,M-.32,M,0,1,3),S(a,l,g-.06,g+.4,o+.14,r+.28,M-.32,M,0,1,3))}if(!v){const p=(o-i-u/2)/2,g=f-Math.min(p,f-n-2);S(a,l,-u/2,u/2,m?o-.25:o,m?.34:r,n,g+.05,m?2:0);const y=o-r,M=.5*ot*t.bell;if(d+.21*t.bell*h.k<c-.1&&M-.35<y){const A=gt(wt(l,-.3,.3,M-.4,y+.05)),L=d-.055*t.bell*h.k;E(a,A[0],A[1],L-.5,L,A[2],A[3],m?2:0,1)}}}if(R(a,o+.06,c,s-.8,1),R(a,o+.3,s-.8,s-.2),R(a,o+.6,s-.2,s+1),e){const l=Math.max(4,Math.round(t.w/1.7));for(let v=0;v<4;v++)for(let u=0;u<l;u++){const w=-o+(u+.5)*(2*o/l);S(a,v,w-.22,w+.22,o+.56,.3,s-.62,s-.2,0,.85,2)}}}function wt(a,t,e,o,n){const s=z(a,t,o,0),i=z(a,e,n,0);return[s[0],i[0],s[2],i[2]]}const gt=([a,t,e,o])=>[Math.min(a,t),Math.max(a,t)].concat([Math.min(e,o),Math.max(e,o)]);function q(a,t,e,o,n,s=0,i=1){const r=e[0]-t[0],c=e[1]-t[1],f=e[2]-t[2],m=o[0]-t[0],x=o[1]-t[1],h=o[2]-t[2];let d=[c*h-f*x,f*m-r*h,r*x-c*m];const l=Math.hypot(d[0],d[1],d[2])||1;d=[d[0]/l,d[1]/l,d[2]/l];const v=d[0]*(t[0]-n[0])+d[1]*(t[1]-n[1])+d[2]*(t[2]-n[2])>=0;v||(d=[-d[0],-d[1],-d[2]]);const u=O(a,t,d,s,i),w=O(a,e,d,s,i),p=O(a,o,d,s,i);v?a.idx.push(u,w,p):a.idx.push(u,p,w)}function _(a,t,e,o,n=0,s=0){const i=[n,e,s],r=[n,o,s],c=[[1,1],[-1,1],[-1,-1],[1,-1]];for(let f=0;f<4;f++){const m=c[f],x=c[(f+1)%4];q(a,[n+m[0]*t,e,s+m[1]*t],[n+x[0]*t,e,s+x[1]*t],r,i)}}function B(a,t,e,o,n){const s=[[1,1],[-1,1],[-1,-1],[1,-1]],i=[0,(e+n)/2,0];for(let r=0;r<4;r++){const c=s[r],f=s[(r+1)%4];k(a,[c[0]*t,e,c[1]*t],[f[0]*t,e,f[1]*t],[f[0]*o,n,f[1]*o],[c[0]*o,n,c[1]*o],i)}}function tt(a,t,e){const o=[0,t,0],n=[[e,0],[0,e],[-e,0],[0,-e]];for(let s=0;s<4;s++){const i=n[s],r=n[(s+1)%4];q(a,[i[0],t,i[1]],[r[0],t,r[1]],[0,t+e*1.2,0],o),q(a,[i[0],t,i[1]],[r[0],t,r[1]],[0,t-e*1.2,0],o)}}function bt(a,t){const e=t.w/2,o=t.ring+1,n=t.h-o,s=t.rank%3;if(t.shape==="spired"){const i=Math.min(2.2,n*.14),r=o+i,c=e-.3,f=t.h-.8,m=[0,r,0];if(E(a,-e+.5,e-.5,o,r,-e+.5,e-.5,0,1,51),R(a,e-.2,r-.3,r),s===0){const v=r+(f-r)*.14;B(a,c,r,c*.66,v),_(a,c*.66,v,f)}else if(s===1){const v=r+(f-r)*.4;B(a,c,r,c*.56,v),E(a,-c*.56-.22,c*.56+.22,v,v+.4,-c*.56-.22,c*.56+.22,0,1,63),_(a,c*.5,v+.4,f)}else{_(a,c,r,f);const v=c*.42,u=r+1.5*v,w=c*(1-1.5*v/(f-r));for(let p=0;p<4;p++){const g=z(p,-v,c+.02,r),y=z(p,v,c+.02,r),M=z(p,0,c+.02,u),A=z(p,0,w-.05,u);q(a,g,y,M,m),q(a,g,M,A,[0,r-9,0]),q(a,y,M,A,[0,r-9,0])}}tt(a,f+.25,.45);const x=s===0?c*.66:c,h=s===0?r+(f-r)*.14:r,d=f-h,l=(v,u)=>{const w=x*(1-v)+u,p=h+d*v;return[[w,p,w],[-w,p,w],[-w,p,-w],[w,p,-w]]};if(d>9&&s!==1)for(const v of[.36,.68]){const u=l(v,.13),w=l(v+.38/d,.13),p=l(v+.38/d,0);for(let g=0;g<4;g++){const y=(g+1)%4;k(a,u[g],u[y],w[y],w[g],[0,h+d*v,0],0,.78),k(a,w[g],w[y],p[y],p[g],[0,h,0],0,.78)}}}else if(t.shape==="stepped"){const i=Math.max(4,Math.ceil(n/4)),r=.72+.05*s,c=n-.9;let f=e;for(let m=0;m<i;m++){f=e*(1-r*m/i)-.15;const x=o+c*m/i,h=o+c*(m+1)/i,d=m%2===s%2&&h-.3-x>2?.9:0;E(a,-f,f,x,h-.3-d,-f,f,0,1,51),d&&E(a,-f,f,h-.3-d,h-.3,-f,f,1,1,51),E(a,-f-.2,f+.2,h-.3,h,-f-.2,f+.2,0,1,63)}_(a,f+.2,o+c,t.h)}else if(t.shape==="domed"){const i=e-.3,r=5,c=16,f=[0,o,0],m=o+.8,x=n-.8;E(a,-e+.1,e-.1,o,m,-e+.1,e-.1,0,1,59);const h=(d,l)=>{const v=d/r*Math.PI/2,u=l/c*Math.PI*2;return[i*Math.cos(v)*Math.cos(u),m+x*Math.sin(v),i*Math.cos(v)*Math.sin(u)]};for(let d=0;d<r;d++)for(let l=0;l<c;l++)d===r-1?q(a,h(d,l),h(d,l+1),[0,t.h,0],f):k(a,h(d,l),h(d,l+1),h(d+1,l+1),h(d+1,l),f)}else{const i=n*.52,r=n*.8,c=e-.5,f=e*.48,m=c+.5,x=.8,h=o+i-.1,d=s===1?3:2,l=.5;for(const[w,p]of[[1,1],[1,-1],[-1,1],[-1,-1]])E(a,w*c-.5,w*c+.5,o,h,p*c-.5,p*c+.5,0,1,51),E(a,w*f-.4,w*f+.4,o+i,o+r,p*f-.4,p*f+.4,0,1,51);const v=2*(c-.5),u=(v-(d-1)*l)/d;for(let w=0;w<4;w++)for(let p=0;p<d;p++){const g=-c+.5+p*(u+l),y=g+u,M=h-.5;J(a,w,g,y,o,M,h,m,x),p&&S(a,w,g-l,g,m,x,o,M-Math.min(u/2,M-o-2)+.05,0)}R(a,c+.7,h,o+i+.5),R(a,f+.5,o+r-.1,o+r+.4),_(a,f+.2,o+r+.4,t.h-.8),tt(a,t.h-.55,.42)}}function et(a){let t=1e9,e=0;for(let o=0;o+1<W.length;o++){const n=W[o],s=W[o+1],i=s[0]-n[0],r=s[2]-n[2],c=i*i+r*r||1,f=Math.max(0,Math.min(1,((a.x-n[0])*i+(a.z-n[2])*r)/c)),m=Math.hypot(a.x-n[0]-f*i,a.z-n[2]-f*r);m<t&&(t=m,e=n[1]+f*(s[1]-n[1]))}return{dist:t,y:e}}const yt=a=>et(a).dist-a.w/2<=40;function Mt(a,t,e){ft(a,t,e);const o=X(t);a.near=yt(t),a.T.tw=[t.w/2,o.yA,o.s,t.belfry],dt(a,t,o),pt(a,t,a.near),bt(a,t)}function At(){return new b.ShaderMaterial({vertexShader:`
      attribute vec3 aLoc, aFace, aK; attribute vec4 aTw;
      varying vec3 vN, vWp, vLoc, vFace, vK; varying vec4 vTw;
      void main() {
        vec4 wp = modelMatrix * vec4(position, 1.);
        vWp = wp.xyz; vN = normalize(mat3(modelMatrix) * normal); vLoc = aLoc; vFace = aFace; vK = aK; vTw = aTw;
        gl_Position = projectionMatrix * viewMatrix * wp;
      }`,fragmentShader:`
      ${U}
      varying vec3 vN, vWp, vLoc, vFace, vK; varying vec4 vTw;
      const vec3 STONE_L = ${N(F.stoneLit)}, STONE_U = ${N(F.stoneUnlit)};
      const vec3 TILE_L = ${N(F.tileLit)}, TILE_U = ${N(F.tileUnlit)}, GLINT = ${N(F.tileGlint)};
      const vec3 IRON_L = ${N(F.ironLit)}, IRON_U = ${N(F.iron)};
      const vec3 CREAM1 = ${N(K,1/3.4)}, LAMP1 = ${N(F.lamp)};
      float hash12(vec2 p) { vec3 p3 = fract(vec3(p.xyx) * .1031); p3 += dot(p3, p3.yzx + 33.33); return fract((p3.x + p3.y) * p3.z); }
      float vnoise(vec2 p) {
        vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
        return mix(mix(hash12(i), hash12(i + vec2(1., 0.)), f.x), mix(hash12(i + vec2(0., 1.)), hash12(i + vec2(1., 1.)), f.x), f.y);
      }
      void main() {
        vec3 N = normalize(vN);
        float s = max(0., dot(N, KEY)), kind = vK.x, wall = step(abs(N.y), .5);
        vec3 unlit = kind < .5 ? STONE_U : (kind < 1.5 ? TILE_U : IRON_U), lit = kind < .5 ? STONE_L : (kind < 1.5 ? TILE_L : IRON_L);
        unlit *= 1. + .38 * N.y;
        // an unlit wall stands under the open sky: lighter toward the tower's top, darker down between the house blocks
        unlit *= mix(1., mix(.8, 1.5, smooth01(vLoc.y / 110.)), wall);
        // stone in recess: inside the belfry, and whatever the buffer marks
        float hw = vTw.x, inner = step(max(abs(vLoc.x), abs(vLoc.z)), hw - .05) * step(vTw.w - .01, vLoc.y);
        float shade = (kind > .5 && kind < 1.5 ? 1. : vK.y) * mix(1., .6, inner);
        // the stone under a ledge is darkened to 0.6 of itself, easing out a metre below it: under the dial's ledge, the
        // three ledges below it and the belfry's floor (the ledges stand one spacing apart from the dial's own)
        float under = (vTw.y - .6) - vLoc.y, dl = under >= 0. && under < 3.5 * vTw.z ? mod(under, max(vTw.z, 1.)) : 9.;
        float ub = (vTw.w - .6) - vLoc.y;
        dl = ub >= 0. ? min(dl, ub) : dl;
        shade *= mix(.6, 1., smooth01(dl / 1.1));
        // each tower's stone is a little of its own tone (a twelfth lighter or darker at the most), read from its own measures
        float own = 1. + .16 * (hash12(vec2(vTw.y * 1.37, vTw.z * 7.1 + vTw.x)) - .5);
        vec3 col = mix(unlit, lit, s) * shade * (kind < .5 ? own : 1.);
        // derivatives are taken here, before any branch
        float cy = vLoc.y / .6, fw = max(fwidth(cy), 1e-4), row = floor(cy);
        float along0 = (vWp.x * -N.z + vWp.z * N.x) / 1.4, fa = max(fwidth(along0), 1e-4);
        vec2 sq = vLoc.xz / 1.2; float fsq = max(max(fwidth(sq.x), fwidth(sq.y)), 1e-4);
        if (kind < .5) {
          // courses 0.6 m high, their joints 12 in 100 darker; blocks of 1.4 m, each a little of its own tone
          float along = along0 + .5 * mod(row, 2.), blk = floor(along);
          float jy = smoothstep(.5 - .06 - fw, .5 - .06, abs(fract(cy) - .5));
          float jx = smoothstep(.5 - .025 - fa, .5 - .025, abs(fract(along) - .5));
          float fine = 1. - smooth01((fw - .3) / .6);
          float tone = (hash12(vec2(blk, row)) - .5) * .16 + (hash12(vec2(row, 7.)) - .5) * .06;
          // in the shade the courses are drawn stronger, so an unlit wall still reads as laid stone
          float amp = mix(2.4, 1., smooth01(s * 3.));
          col *= 1. + wall * fine * amp * (tone - .12 * max(jy, jx * .8)) - wall * (1. - fine) * .02;
          // the stone's relief: each course's upper edge catches a little light under its joint
          float edge = smoothstep(.28, .36, fract(cy) - .5) * (1. - jy);
          col *= 1. + wall * fine * .07 * edge;
          // weather: broad slow stains down and along the wall, so no wall is one flat tone
          col *= 1. + wall * (.16 * (vnoise(vec2(along0 * .35, cy * .12)) - .5) + .08 * (vnoise(vec2(along0 * 1.3 + 7., cy * .5)) - .5));
          // what looks up (ledges, steps, cornices) is laid in slabs of 1.2 m with dark joints
          vec2 sf = abs(fract(sq) - .5);
          float sj = max(smoothstep(.45 - fsq, .45, sf.x), smoothstep(.45 - fsq, .45, sf.y));
          col *= 1. + step(.5, N.y) * (1. - smooth01((fsq - .3) / .6)) * ((hash12(floor(sq) + 31.) - .5) * .2 - .2 * sj);
          // the stone's own grain, read only from close by
          float near1 = 1. - smooth01((fw - .02) / .06);
          col *= 1. + wall * near1 * .09 * (hash12(floor(vec2(along0 * 14., cy * 6.))) - .5);
        } else if (kind < 1.5) {
          // glazed tiles four rows to a band, each a little of its own gloss, with fine dark joints; then the tile's one
          // amber glint line, 0.15 m high, along the upper edge of a lit band
          float g = vK.y - 1.;
          vec2 tq = vec2(along0 * 3.733, g * 4.), tf = fract(tq);
          float tfine = 1. - smooth01((fa * 3.733 - .25) / .5);
          float tj = max(smoothstep(.44, .47, abs(tf.x - .5)), smoothstep(.44, .47, abs(tf.y - .5)));
          col *= 1. + wall * tfine * ((hash12(floor(tq)) - .5) * .7 - .45 * tj);
          col = mix(col, GLINT, smoothstep(.88, .9, g) * smooth01(s * 3.) * wall);
        }
        // the steady wash of the face's light on the face's own wall: 0.30 units at the dial's rim, nothing one dial's width
        // out, falling by the square; the stone answers the cream with its own honey, so the wall round a dial is warm
        float rr = length(vFace.xy);
        float wsh = clamp((3. - rr) / 2., 0., 1.);
        col += mix(CREAM1, STONE_L, .85) * (.30 * wsh * wsh * vK.z * step(-.2, vFace.z) * step(kind, .5));
        // the steady pools of the tower's lamps: twelve on three ledges (one at the middle of each side), four in the belfry
        vec2 q = abs(vLoc.xz); q = q.x > q.y ? q : q.yx;
        float kl = clamp(floor((vTw.y + .45 - vLoc.y) / max(vTw.z, 1.) + .5), 0., 2.), yl = vTw.y + .45 - kl * vTw.z;
        float d1 = length(vec3(q.x - (hw + .28), q.y, vLoc.y - yl));
        float pc = hw - clamp(.32 * hw, 1.2, 2.) - .15;
        float d2 = length(vec3(abs(vLoc.x) - pc, vLoc.y - (vTw.w + 1.5), abs(vLoc.z) - pc));
        // a ledge's lamp stands on its ledge: it lights the wall over the ledge and the ledge's top, and nothing under them
        float over = smoothstep(yl - .62, yl - .42, vLoc.y);
        // a lamp's light on the stone falls by the square of the distance from the lamp: brightest on the wall behind the
        // lantern (0.45 units), a fifth of a unit a metre out, nothing from 2.5 m
        float f1 = smooth01(1. - d1 / 2.5) / (1. + d1 * d1 / .81), f2 = smooth01(1. - d2 / 2.5) / (1. + d2 * d2 / .81);
        float pool = 1.5 * max(f1 * over, f2);
        col += LAMP1 * (.35 * pool * (kind > 1.5 ? .3 : 1.));
        gl_FragColor = vec4(farFade(col, vWp, cameraPosition, 1.), 1.);
      }`})}async function kt(a,t,e=null){const o=ct();for(let i=0;i<a.length;i++)Mt(o,a[i],e?e[a[i].name]:null),t&&await t();const n=await ht(o,t);t&&await t();const s=new b.Mesh(n,At());return s.name="tower-stone",s.frustumCulled=!1,{mesh:s,triangles:o.idx.length/3,vertices:o.n}}function Lt(a,t,e=null){const o=a.length,n=new b.InstancedBufferGeometry,s=new b.PlaneGeometry(2,2);n.setAttribute("position",s.getAttribute("position")),n.setIndex(s.getIndex()),n.instanceCount=o;const i=new Float32Array(o*3),r=new Float32Array(o*4),c=new Float32Array(o*4),f=new Float32Array(o*4);a.forEach((h,d)=>{const[l,v]=C(h.facing),u=e?e[h.name][0]:h.x,w=e?e[h.name][1]:h.z,p=h.w/2+.05;i.set([u+l*p,h.faceY,w+v*p],d*3),r.set([v,-l,h.dial[4],0],d*4),c.set([h.face/2,h.interval,h.start,h.rank],d*4),f.set([V.stroke[h.dial[0]],V.width[h.dial[1]],h.dial[2],h.dial[3]],d*4)}),n.setAttribute("iPos",new b.InstancedBufferAttribute(i,3)),n.setAttribute("iRight",new b.InstancedBufferAttribute(r,4)),n.setAttribute("iA",new b.InstancedBufferAttribute(c,4)),n.setAttribute("iD",new b.InstancedBufferAttribute(f,4));const m=new b.ShaderMaterial({uniforms:{uClock:t},transparent:!0,depthWrite:!1,blending:b.CustomBlending,blendEquation:b.AddEquation,blendSrc:b.OneFactor,blendDst:b.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec3 iPos; attribute vec4 iRight, iA, iD;
      varying vec2 vUv; varying vec3 vWp; varying vec4 vA, vD; varying float vHand;
      void main() {
        vUv = position.xy * 1.3; vA = iA; vD = iD; vHand = iRight.z;
        vec3 wp = iPos + vec3(iRight.x, 0., iRight.y) * (vUv.x * iA.x) + vec3(0., 1., 0.) * (vUv.y * iA.x);
        vWp = wp; gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`,fragmentShader:`
      ${U}
      uniform float uClock;
      varying vec2 vUv; varying vec3 vWp; varying vec4 vA, vD; varying float vHand;
      const vec3 CREAM1 = ${N(K,1/3.4)}, IRON = ${N(F.iron)};
      const float RISE = ${H.rise.toFixed(2)}, FALL = ${H.fall.toFixed(2)}, REST = ${H.rest.toFixed(2)}, TOP = ${H.top.toFixed(2)};
      #define THIN(w) clamp(1.2 * (w) / px, 0., 1.)
      // a hand that points along +y from the hub: shape 0 a plain bar, 1 a tapered blade, 2 a bar with a short tail
      float hand(vec2 p, float ang, float len, float wid, float shape, float px) {
        float c = cos(ang), s = sin(ang); vec2 h = vec2(p.x * c - p.y * s, p.x * s + p.y * c);
        float tail = shape > 1.5 ? .2 * len : .04, hw = shape > .5 && shape < 1.5 ? wid * (1.25 - clamp(h.y / len, 0., 1.)) : wid * .6;
        float along = smoothstep(-tail - px, -tail, h.y) * (1. - smoothstep(len - px, len, h.y));
        return along * (1. - smoothstep(hw - px, hw, abs(h.x)));
      }
      void main() {
        float r = length(vUv), px = max(fwidth(vUv.x), fwidth(vUv.y)) * 1.2 + 1e-4;
        // the face's level: a soft rise of 1.5 s from its bell's stroke and a soft fall of 2 s, then rest
        float a = mod(uClock - vA.z, vA.y);
        float lev = a < RISE ? smooth01(a / RISE) : 1. - smooth01((a - RISE) / FALL);
        vec3 col = CREAM1 * (REST + (TOP - REST) * lev);
        // a line narrower than a pixel shows by the share of the pixel it fills (THIN), so a far dial is a cream disc with
        // faint marks and never a dark star
        // the rim: one line, two lines, or a line and an inner circle
        float ink = smoothstep(.95 - px, .95, r) * THIN(.05);
        ink = max(ink, step(.5, vD.w) * step(vD.w, 1.5) * smoothstep(.885 - px, .885, r) * (1. - smoothstep(.91, .91 + px, r)) * THIN(.025));
        ink = max(ink, step(1.5, vD.w) * smoothstep(.5 - px, .5, r) * (1. - smoothstep(.52, .52 + px, r)) * THIN(.02));
        // twelve plain strokes, every third half as long again on some dials
        float r1 = vD.w > .5 && vD.w < 1.5 ? .85 : .91;
        float th = atan(vUv.x + step(r, 1e-4) * 1e-3, vUv.y), k = floor(th / .5235988 + .5), dth = th - k * .5235988;
        float len = vD.x * (vD.z > .5 && mod(k + 12., 3.) < .5 ? 1.5 : 1.);
        float lat = abs(r * sin(dth)), rad = r * cos(dth);
        ink = max(ink, (1. - smoothstep(vD.y * .5, vD.y * .5 + px, lat)) * smoothstep(r1 - len - px, r1 - len, rad) * (1. - smoothstep(r1, r1 + px, rad)) * THIN(vD.y));
        // the hands: the long one once round in 90 s, the short one at a twelfth of that, each from an angle of its own;
        // sturdy iron (a bar of 0.08 and of 0.12 of the dial's radius across), so that both read on a dial of 40 px
        float longA = radians(360. * vA.z / vA.y + 4. * uClock), shortA = radians(30. * mod(vA.w, 12.)) + longA / 12.;
        ink = max(ink, hand(vUv, longA, .8, .065, vHand, px) * THIN(.078));
        ink = max(ink, hand(vUv, shortA, .52, .1, vHand, px) * THIN(.12));
        ink = max(ink, (1. - smoothstep(.09, .09 + px, r)) * THIN(.18));
        col = mix(col, IRON, ink);
        col = farFade(col, vWp, cameraPosition, .5);
        // the disc is solid; outside it the quad lays only the halo: 0.5 units at the rim, nothing at 1.15 radii, at the resting level
        float disc = 1. - smoothstep(1. - px, 1., r);
        vec3 halo = CREAM1 * (.5 * clamp((1.15 - r) / .15, 0., 1.));
        gl_FragColor = vec4(mix(halo, col, disc), disc);
      }`}),x=new b.Mesh(n,m);return x.name="faces",x.frustumCulled=!1,x.renderOrder=2,x}const G=.82,ot=1.3;function zt(){const a=[[0,-.03],[.14,-.035],[.215,-.07],[.25,-.13],[.262,-.22],[.275,-.34],[.295,-.46],[.33,-.58],[.385,-.68],[.445,-.76],[.5,-.82],[.47,-.82],[.4,-.74]],t=[[new b.LatheGeometry(a.map(([c,f])=>new b.Vector2(c,f)).reverse(),24),0],[new b.SphereGeometry(.075,8,5).translate(0,-.72,0),1],[new b.CylinderGeometry(.02,.02,.66,5).translate(0,-.37,0),1],[new b.CylinderGeometry(.09,.12,.08,8).translate(0,-.01,0),2],[new b.BoxGeometry(.22,.2,ot).translate(0,.11,0),2],[new b.BoxGeometry(.26,.25,.05).translate(0,.1,.14),2],[new b.BoxGeometry(.26,.25,.05).translate(0,.1,-.14),2]],e=[],o=[],n=[],s=[];let i=0;for(const[c,f]of t){const m=c.getAttribute("position"),x=c.getAttribute("normal"),h=c.getIndex();for(let d=0;d<m.count;d++)e.push(m.getX(d),m.getY(d),m.getZ(d)),o.push(x.getX(d),x.getY(d),x.getZ(d)),n.push(f);for(let d=0;d<h.count;d++)s.push(i+h.getX(d));i+=m.count,c.dispose()}const r=new b.InstancedBufferGeometry;return r.setAttribute("position",new b.Float32BufferAttribute(e,3)),r.setAttribute("normal",new b.Float32BufferAttribute(o,3)),r.setAttribute("aPart",new b.Float32BufferAttribute(n,1)),r.setIndex(s),r}function It(a,t,e=null){const o=a.length,n=zt();n.instanceCount=o;const s=new Float32Array(o*3),i=new Float32Array(o*4),r=new Float32Array(o*3);a.forEach((m,x)=>{const[h,d]=C(m.facing),l=e?e[m.name][0]:m.x,v=e?e[m.name][1]:m.z,u=Q(m);s.set([l,m.belfry+u.p,v],x*3),i.set([m.bell,h,d,m.interval],x*4),r.set([m.start,m.rank,u.k],x*3)}),n.setAttribute("iPos",new b.InstancedBufferAttribute(s,3)),n.setAttribute("iB",new b.InstancedBufferAttribute(i,4)),n.setAttribute("iS",new b.InstancedBufferAttribute(r,3));const c=new b.ShaderMaterial({uniforms:{uClock:t},side:b.DoubleSide,vertexShader:`
      attribute vec3 iPos, iS; attribute vec4 iB; attribute float aPart;
      uniform float uClock;
      varying vec3 vN, vWp; varying float vPart, vY;
      vec3 turn(vec3 p, vec3 ax, float a) { float c = cos(a), s = sin(a); return p * c + cross(ax, p) * s + ax * dot(ax, p) * (1. - c); }
      void main() {
        // the swing: 28 degrees x sin(pi (t - start) / interval); the clapper leans a little further than the bell
        float th = radians(${H.swing.toFixed(1)}) * sin(3.14159265 * (uClock - iS.x) / iB.w) * (aPart > .5 && aPart < 1.5 ? 1.22 : 1.);
        vec3 ax = vec3(iB.y, 0., iB.z);
        // the unit bell is turned so that its headstock lies along the axis, then scaled to its width and swung
        vec3 p = vec3(position.x * iB.z + position.z * iB.y, position.y * iS.z, -position.x * iB.y + position.z * iB.z);
        vec3 nn = normalize(vec3(normal.x * iB.z + normal.z * iB.y, normal.y / iS.z, -normal.x * iB.y + normal.z * iB.z) + vec3(0., 1e-5, 0.));
        vec3 wp = iPos + turn(p * iB.x, ax, th);
        vN = turn(nn, ax, th); vWp = wp; vPart = aPart; vY = position.y;
        gl_Position = projectionMatrix * viewMatrix * vec4(wp, 1.);
      }`,fragmentShader:`
      ${U}
      varying vec3 vN, vWp; varying float vPart, vY;
      const vec3 BELL = ${N(F.bell)}, RIM = ${N(F.bellRim)}, IRON_U = ${N(F.iron)}, IRON_L = ${N(F.ironLit)}, LAMP1 = ${N(F.lamp)};
      const vec3 FILL = ${N(F.fillUp)};
      void main() {
        vec3 N = normalize(vN);
        float front = gl_FrontFacing ? 1. : 0.;
        if (front < .5) N = -N;
        float s = max(0., dot(N, KEY));
        // dark metal, a little of the dusk's violet on what looks up, so that the round reads; the warm rim is the bell's own
        // rim, its lowest band, on the side toward the west; above it the west leaves one narrow streak of gloss; the
        // moulded lines a bell is cast with
        float edge = smooth01((s - .45) / .55), rim = 1. - smoothstep(-.7, -.6, vY);
        float band = (1. - smoothstep(.0, .012, abs(vY + .135))) + (1. - smoothstep(.0, .01, abs(vY + .61))) + (1. - smoothstep(.0, .01, abs(vY + .655)));
        vec3 metal = BELL * (1. + .5 * band) + FILL * (.05 * (.35 + .65 * max(0., N.y)) + .03 * band);
        float gloss = smooth01((s - .86) / .14);
        vec3 col = vPart < .5 ? mix(metal, RIM, front * max(edge * rim, .3 * gloss * gloss)) : mix(IRON_U, IRON_L, s) + FILL * (.03 * max(0., N.y));
        float lip = vPart < .5 ? 1. - smoothstep(-.81, -.6, vY) : 0.;
        col += LAMP1 * (.3 * lip * lip * mix(.35, 1., front));
        col *= mix(.55, 1., max(front, step(.5, vPart)));
        gl_FragColor = vec4(farFade(col, vWp, cameraPosition, 1.), 1.);
      }`}),f=new b.Mesh(n,c);return f.name="bells",f.frustumCulled=!1,f}function Nt(a){const t=X(a),e=a.w/2,o=[],n=e-Math.max(1.2,Math.min(2,.16*a.w))-.15;for(let s=0;s<3;s++){const i=t.yA-s*t.s;if(t.ys.some(r=>Math.abs(r-i)<.01))for(let r=0;r<4;r++)o.push(z(r,0,e+.28,i+.45))}for(const[s,i]of[[1,1],[1,-1],[-1,1],[-1,-1]])o.push([s*n,a.belfry+1.5,i*n]);return o}function Ft(a,t,e=null){const o=[];for(const r of a){const[c,f]=C(r.rot),m=e?e[r.name][0]:r.x,x=e?e[r.name][1]:r.z,h=Nt(r);h.forEach(([d,l,v],u)=>o.push(m+d*c-v*f,l,x+d*f+v*c,u<h.length-4?1:-1))}const n=new b.InstancedBufferGeometry,s=new b.PlaneGeometry(2,2);n.setAttribute("position",s.getAttribute("position")),n.setIndex(s.getIndex()),n.instanceCount=o.length/4,n.setAttribute("iL",new b.InstancedBufferAttribute(new Float32Array(o),4));const i=new b.Mesh(n,new b.ShaderMaterial({uniforms:{uH:t},transparent:!0,depthWrite:!1,blending:b.CustomBlending,blendEquation:b.AddEquation,blendSrc:b.OneFactor,blendDst:b.OneMinusSrcAlphaFactor,vertexShader:`
      attribute vec4 iL; uniform float uH; varying vec2 vM; varying vec3 vWp; varying float vPx, vFar, vHang;
      void main() {
        vec4 mv = viewMatrix * modelMatrix * vec4(iL.xyz, 1.);
        float pxPerM = projectionMatrix[1][1] * uH * .5 / max(-mv.z, .5);
        // half the quad in metres: half a metre, or the least point's half (one pixel of a 450 px picture) where that is more
        float least = uH / 450. / pxPerM, h = max(.5, least);
        vec3 up = normalize((viewMatrix * vec4(0., 1., 0., 0.)).xyz), side = cross(up, vec3(0., 0., 1.));
        float sl = length(side); side = sl > 1e-3 ? side / sl : vec3(1., 0., 0.);
        mv.xyz += (side * position.x + up * position.y) * h;
        vM = position.xy * h; vPx = pxPerM; vFar = max(.25, least); vHang = iL.w; vWp = (modelMatrix * vec4(iL.xyz, 1.)).xyz;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      ${U}
      varying vec2 vM; varying vec3 vWp; varying float vPx, vFar, vHang;
      const vec3 LAMP = ${N(F.lamp)}, IRON = ${N(F.iron)};
      // a box about c with half sizes b: 1 inside, eased over one pixel
      float box(vec2 p, vec2 c, vec2 b, float e) { vec2 d = abs(p - c) - b; return 1. - clamp(max(d.x, d.y) / e + .5, 0., 1.); }
      void main() {
        float e = 1. / max(vPx, 1e-3);
        // the far point: a warm disc of the lamp's own least size
        float aFar = 1. - smoothstep(.55, 1., length(vM) / vFar);
        // the lantern: pane, cap (narrowing upward), finial, foot, and its post below or its rod above
        float pane = box(vM, vec2(0.), vec2(.11, .16), e);
        float capW = mix(.16, .04, clamp((vM.y - .16) / .11, 0., 1.));
        float iron = max(box(vM, vec2(0., .215), vec2(capW, .055), e), box(vM, vec2(0., .30), vec2(.02, .03), e));
        iron = max(iron, box(vM, vec2(0., -.18), vec2(.14, .02), e));
        iron = max(iron, vHang > 0. ? box(vM, vec2(0., -.325), vec2(.03, .125), e) : box(vM, vec2(0., .415), vec2(.015, .085), e));
        vec2 dq = max(abs(vM) - vec2(.11, .16), 0.);
        float shine = smooth01(1. - length(dq) / .3); shine *= shine * .45;
        float core = clamp(1. - length(vM / vec2(.11, .16)), 0., 1.);
        vec3 near = mix(LAMP * shine, IRON, iron); float aNear = iron;
        near = mix(near, LAMP * (1. + .8 * core), pane); aNear = max(aNear, pane);
        // the painted lantern comes in where the quad's metre is 9 pixels or more, whole from 18
        float k = smooth01((vPx - 9.) / 9.);
        vec3 col = mix(LAMP * aFar, near, k); float a = mix(aFar, aNear, k);
        gl_FragColor = vec4(farFade(col, vWp, cameraPosition, 1.), a);
      }`}));return i.name="tower-lamps",i.frustumCulled=!1,i.renderOrder=3,i}async function Tt(a,t={}){const e=t.clock||lt(),o=new b.Group;o.name="dial-towers";let n=t.only?$.filter(d=>t.only.includes(d.name)):$,s=null;t.city||(n=(t.towers||["O1","O2","B5a"]).map(l=>$.find(v=>v.name===l)).filter(Boolean),s={},n.forEach((l,v)=>{const u=v-(n.length-1)/2;s[l.name]=[u===0?-7:5,u*22]}));const i=a&&a.yield?()=>a.yield():null,r=await kt(n,i,s);o.add(r.mesh),i&&await i();const c=Lt(n,e,s);o.add(c),i&&await i();const f=It(n,e,s);o.add(f);const m={value:450},x=new b.Vector2,h=Ft(n,m,s);return o.add(h),{object:o,radius:t.city?420:40,height:t.city?120:108,center:new b.Vector3(0,t.city?60:70,0),anchors:{},clock:e,towers:n,stone:r,faces:c,bells:f,lamps:h,update(d,l){t.clock||(e.value=l),a&&a.renderer&&(a.renderer.getDrawingBufferSize(x),m.value=x.y)},dispose(){},ground:!t.city,groundY:j-1}}export{U as LIGHT_GLSL,$ as TOWERS,St as atUnits,Q as bellFit,Tt as buildHero,yt as isNear,Nt as lampsOf,Mt as layTower,X as ledgesOf,It as makeBells,lt as makeClock,Lt as makeFaces,Ft as makeLamps,At as makeStoneMaterial,kt as makeTowerStone,et as routeBy};
