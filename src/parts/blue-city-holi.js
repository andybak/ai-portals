import*as w from"three";const Jt=["#27348B","#3E6FD6","#E8EEF7","#C98F58","#E6178A","#FF9A1E","#2FBF6B"],Dt=e=>{const n=new w.Color(e);return[n.r,n.g,n.b]},q=(e,n)=>[e[0]*n,e[1]*n,e[2]*n],ut=(e,n,t)=>[e[0]+(n[0]-e[0])*t,e[1]+(n[1]-e[1])*t,e[2]+(n[2]-e[2])*t],Tt=(e,n,t)=>{const l=Math.min(1,Math.max(0,(t-e)/(n-e)));return l*l*(3-2*l)},Vt=`
float hh21(vec2 p){ p = fract(p * vec2(123.34, 345.45)); p += dot(p, p + 34.345); return fract(p.x * p.y); }
float vn2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(hh21(i), hh21(i + vec2(1., 0.)), f.x), mix(hh21(i + vec2(0., 1.)), hh21(i + vec2(1., 1.)), f.x), f.y); }
float fb2(vec2 p){ return vn2(p) * .5 + vn2(p * 2.07 + 11.3) * .3 + vn2(p * 4.3 + 37.1) * .2; }
`;function Bt(){const e=[],n=[],t=[],l=[],u=new w.Matrix4,i=new w.Matrix3,d=[],g=new w.Vector3,h=new w.Vector3,c=new w.Vector3,b=new w.Vector3,y=new w.Quaternion,B=new w.Vector3(0,1,0),M={aux:[0,0],count:0},T=(o,s,r)=>{g.set(o[0],o[1],o[2]).applyMatrix4(u),h.set(s[0],s[1],s[2]).applyMatrix3(i).normalize(),e.push(g.x,g.y,g.z),n.push(h.x,h.y,h.z),t.push(r[0],r[1],r[2]),l.push(M.aux[0],M.aux[1]),M.count++};return M.set=(o=0,s=0,r=0,x=0,v=1,L=0,P=0)=>{y.setFromEuler(new w.Euler(L,x,P,"YXZ")),u.compose(new w.Vector3(o,s,r),y,new w.Vector3(v,v,v)),i.getNormalMatrix(u)},M.put=T,M.push=()=>d.push(u.clone()),M.pop=()=>{u.copy(d.pop()),i.getNormalMatrix(u)},M.tri=(o,s,r,x,v,L,P,f,m)=>{T(o,v,x),T(s,L,f||x),T(r,P,m||x)},M.quad=(o,s,r,x,v,L,P)=>{if(c.set(s[0]-o[0],s[1]-o[1],s[2]-o[2]),b.set(x[0]-o[0],x[1]-o[1],x[2]-o[2]),c.lengthSq()<1e-10&&c.set(r[0]-o[0],r[1]-o[1],r[2]-o[2]),c.cross(b),c.lengthSq()<1e-12)return;c.normalize();let f=[c.x,c.y,c.z];L=L||v,P&&f[0]*P[0]+f[1]*P[1]+f[2]*P[2]<0?(f=[-f[0],-f[1],-f[2]],T(o,f,v),T(r,f,L),T(s,f,v),T(o,f,v),T(x,f,L),T(r,f,L)):(T(o,f,v),T(s,f,v),T(r,f,L),T(o,f,v),T(r,f,L),T(x,f,L))},M.box=(o,s,r,x,v,L,P,f={})=>{const m=f.t??1,p=x/2,C=L/2,S=p*m,A=C*(f.tz??m),I=s+v,E=q(P,f.g??.86),W=P,_=[[o-p,s,r-C],[o+p,s,r-C],[o+p,s,r+C],[o-p,s,r+C]],D=[[o-S,I,r-A],[o+S,I,r-A],[o+S,I,r+A],[o-S,I,r+A]];M.quad(_[3],_[2],D[2],D[3],E,W,[0,0,1]),M.quad(_[1],_[0],D[0],D[1],E,W,[0,0,-1]),M.quad(_[2],_[1],D[1],D[2],E,W,[1,0,0]),M.quad(_[0],_[3],D[3],D[0],E,W,[-1,0,0]),f.noTop||M.quad(D[3],D[2],D[1],D[0],W,W,[0,1,0]),f.bottom&&M.quad(_[0],_[1],_[2],_[3],E,E,[0,-1,0])},M.lathe=(o,s,r,x,v,L,P={})=>{const f=P.rot??0,m=P.sx??1,p=P.sz??1,C=P.arc??Math.PI*2,S=P.flat,A=typeof L=="function"?L:()=>L;for(let I=0;I<x.length-1;I++){const[E,W]=x[I],[_,D]=x[I+1],Z=x[Math.max(0,I-1)],O=x[Math.min(x.length-1,I+2)],Q=[D-Z[1],-(_-Z[0])],j=[O[1]-W,-(O[0]-E)],dt=[D-W,-(_-E)];for(let R=0;R<v;R++){const ot=f+R/v*C,N=f+(R+1)/v*C,nt=Math.sin(ot),st=Math.cos(ot),rt=Math.sin(N),J=Math.cos(N),tt=[o+E*nt*m,s+W,r+E*st*p],at=[o+E*rt*m,s+W,r+E*J*p],ft=[o+_*rt*m,s+D,r+_*J*p],X=[o+_*nt*m,s+D,r+_*st*p],et=A(I,R),lt=A(I+1,R);if(S){const gt=(ot+N)/2;M.quad(tt,at,ft,X,et,lt,[Math.sin(gt)*(Math.abs(dt[0])+.01),dt[1],Math.cos(gt)*(Math.abs(dt[0])+.01)]);continue}const vt=[Q[0]*nt,Q[1],Q[0]*st],Y=[Q[0]*rt,Q[1],Q[0]*J],ht=[j[0]*rt,j[1],j[0]*J],wt=[j[0]*nt,j[1],j[0]*st];E>1e-4&&M.tri(tt,at,ft,et,vt,Y,ht,et,lt),_>1e-4&&M.tri(tt,ft,X,et,vt,ht,wt,lt,lt)}}},M.tube=(o,s,r,x,v={})=>{const L=typeof x=="function"?x:()=>x,P=typeof s=="function"?s:()=>s,f=[],m=new w.Vector3,p=new w.Vector3,C=new w.Vector3,S=new w.Vector3(0,1,0);for(let A=0;A<o.length;A++){const I=o[Math.max(0,A-1)],E=o[Math.min(o.length-1,A+1)];m.set(E[0]-I[0],E[1]-I[1],E[2]-I[2]).normalize(),S.set(0,1,0),Math.abs(m.y)>.92&&S.set(1,0,0),p.crossVectors(m,S).normalize(),C.crossVectors(p,m).normalize();const W=[],_=P(A);for(let D=0;D<r;D++){const Z=D/r*Math.PI*2,O=Math.cos(Z),Q=Math.sin(Z),j=[p.x*O+C.x*Q,p.y*O+C.y*Q,p.z*O+C.z*Q];W.push({p:[o[A][0]+j[0]*_,o[A][1]+j[1]*_,o[A][2]+j[2]*_],n:j})}f.push(W)}for(let A=0;A<f.length-1;A++){v.auxAt&&(M.aux=v.auxAt(A));const I=L(A),E=L(A+1);for(let W=0;W<r;W++){const _=f[A][W],D=f[A][(W+1)%r],Z=f[A+1][(W+1)%r],O=f[A+1][W];M.tri(_.p,Z.p,D.p,I,_.n,Z.n,D.n,E,I),M.tri(_.p,O.p,Z.p,I,_.n,O.n,Z.n,E,E)}}},M.build=async o=>{const s=new w.BufferGeometry,r=new Float32Array(e);s.setAttribute("position",new w.BufferAttribute(r,3)),o&&await o(),s.setAttribute("normal",new w.BufferAttribute(new Float32Array(n),3)),o&&await o(),s.setAttribute("color",new w.BufferAttribute(new Float32Array(t),3)),o&&await o(),s.setAttribute("aux",new w.BufferAttribute(new Float32Array(l),2));let x=1e9,v=1e9,L=1e9,P=-1e9,f=-1e9,m=-1e9;for(let p=0;p<r.length;p+=3){const C=r[p],S=r[p+1],A=r[p+2];C<x&&(x=C),C>P&&(P=C),S<v&&(v=S),S>f&&(f=S),A<L&&(L=A),A>m&&(m=A)}return r.length||(x=v=L=P=f=m=0),s.boundingSphere=new w.Sphere(new w.Vector3((x+P)/2,(v+f)/2,(L+m)/2),.5*Math.hypot(P-x,f-v,m-L)),s},M.set(),M}const Kt=`
{
  float md = vAux.x; vec3 lp = vLp; vec3 an = abs(vLn);
  float wallU = an.x > an.z ? lp.z : lp.x;
  vec2 wuv = vec2(wallU, lp.y);
  float vert = 1. - smoothstep(.55, .8, an.y);
  float blot = fb2(wuv * .33 + 3.1), fine = vn2(wuv * 5.5 + lp.zx * 2.1);
  vec3 dc = diffuseColor.rgb;
  float fw = fwidth(lp.y) + fwidth(wallU);
  float sel = vn2(vec2(wallU, lp.z + lp.x) * .09 + 5.) * 3.;
  vec3 pc = sel < 1. ? uPow[0] : (sel < 2. ? uPow[1] : uPow[2]);
  if (md < .5) {                      // dressed sandstone: courses, blocks, streaks, powder thrown at its foot
    float course = lp.y / .46, row = floor(course);
    float bu = wallU / .98 + hh21(vec2(row, 7.));
    float blk = hh21(vec2(floor(bu), row));
    float dj = min(min(fract(course), 1. - fract(course)) * .46, min(fract(bu), 1. - fract(bu)) * .98);
    float joint = (1. - smoothstep(.008, .028 + fw, dj)) / (1. + fw * 14.);
    dc *= mix(1., .78, joint * vert);
    dc *= .93 + .13 * blk * vert / (1. + fw * 4.);
    dc *= .78 + .44 * blot;
    dc *= 1. - .26 * smoothstep(.5, .9, vn2(vec2(wallU * 1.7, lp.y * .07 + 2.))) * vert;
    dc = mix(dc, dc * vec3(1.08, 1.0, .9), fine * .35);
    float st = smoothstep(.42, .7, fb2(wuv * .5 + 9.)) * (1. - smoothstep(.3, 6.5, lp.y)) * vert;
    dc = mix(dc, pc * .8, st * .62);
  } else if (md < 1.5) {              // limewash and paint: blotches and rain streaks
    dc *= .8 + .36 * blot;
    dc *= 1. - .2 * smoothstep(.5, .9, vn2(vec2(wallU * 2.3, lp.y * .09 + 4.))) * vert;
    float st = smoothstep(.5, .75, fb2(wuv * .6 + 19.)) * (1. - smoothstep(.3, 4., lp.y)) * vert;
    dc = mix(dc, pc * .8, st * .5);
  } else if (md < 2.5) {              // brass
    dc *= .8 + .4 * fine;
    hEmis = dc * (.35 + .9 * smoothstep(.72, .95, fine));
    hBrass = 1.;
  } else if (md < 3.5) {              // paving: flags, worn tones, drifts of trodden powder
    vec2 fl = lp.xz / vec2(1.7, 1.1); fl.x += floor(fl.y) * .37;
    vec2 ff = fract(fl); float tone = hh21(floor(fl));
    float pf = fwidth(lp.x) + fwidth(lp.z);
    float dj = min(min(ff.x, 1. - ff.x) * 1.7, min(ff.y, 1. - ff.y) * 1.1);
    float jn = (1. - smoothstep(.015, .06 + pf, dj)) / (1. + pf * 5.);
    dc *= mix(1., .5, jn);
    dc *= (.8 + .34 * tone / (1. + pf * 2.)) * (.8 + .34 * fb2(lp.xz * .21));
    float s0 = smoothstep(.47, .68, fb2(lp.xz * .05 + 1.7)), s1 = smoothstep(.49, .7, fb2(lp.xz * .052 + 31.3)), s2 = smoothstep(.49, .7, fb2(lp.xz * .048 + 77.1));
    float gr = .55 + .45 * fb2(lp.xz * .9 + 5.);
    dc = mix(dc, uPow[0] * .8, s0 * .55 * gr * uStainK); dc = mix(dc, uPow[1] * .8, s1 * .5 * gr * uStainK); dc = mix(dc, uPow[2] * .8, s2 * .5 * gr * uStainK);
    float rg = fb2(lp.xz * .33 + 21.);
    for (int i = 0; i < 16; i++) {
      vec4 ft = uFeet[i];
      float fd = length(lp.xz - ft.xy) / max(ft.w, .1) + (rg - .5) * .7;
      vec3 fc = ft.z < .5 ? uPow[0] : (ft.z < 1.5 ? uPow[1] : uPow[2]);
      dc = mix(dc, fc * (.62 + .3 * gr), (1. - smoothstep(.2, 1., fd)) * .82 * mix(.75, 1., uStainK) * smoothstep(0., .3, uStainK));
    }
    dc *= mix(1., .8, jn * .6);
    float sp = smoothstep(.66, .84, fb2(lp.xz * .7 + 50.));
    dc = mix(dc, pc, sp * .4);
  } else if (md < 4.5) {              // heaped powder
    dc *= .8 + .35 * fine; hEmis = dc * .22;
  }
  diffuseColor.rgb = dc;
}
`;function Gt(e){const n=new w.MeshStandardMaterial({vertexColors:!0,roughness:.93,metalness:0});return n.onBeforeCompile=t=>{t.uniforms.uPow=e.uPow,t.uniforms.uFeet=e.uFeet,t.uniforms.uStainK=e.uStainK,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aux; varying vec3 vLp; varying vec3 vLn; varying vec2 vAux;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vLp = position; vLn = normal; vAux = aux;`),t.fragmentShader=t.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vLp; varying vec3 vLn; varying vec2 vAux; uniform vec3 uPow[3]; uniform vec4 uFeet[16]; uniform float uStainK;
`+Vt).replace("#include <color_fragment>",`#include <color_fragment>
float hBrass = 0.; vec3 hEmis = vec3(0.);
`+Kt).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = mix(roughnessFactor, .34, hBrass);`).replace("#include <metalnessmap_fragment>",`#include <metalnessmap_fragment>
metalnessFactor = mix(metalnessFactor, .45, hBrass);`).replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += hEmis;`)},n.customProgramCacheKey=()=>"holi-stone3",n}function te(e){const n=new w.MeshStandardMaterial({vertexColors:!0,roughness:.85,metalness:0,side:w.DoubleSide});return n.onBeforeCompile=t=>{t.uniforms.uTime=e.uTime,t.uniforms.uWind=e.uWind,t.vertexShader=t.vertexShader.replace("#include <common>",`#include <common>
attribute vec2 aux; uniform float uTime; uniform vec3 uWind;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        float cw = sin(uTime * 2.1 + aux.y + position.x * .8 + position.z * .6) * .6 + sin(uTime * 3.9 + aux.y * 1.7 + position.y * 1.4 + position.x * .5) * .4;
        float cg = .5 + .5 * sin(uTime * .43 + position.x * .05 + position.z * .04);
        transformed += (vec3(uWind.x, 0., uWind.z) * (cw * .7 + cg * .9) + vec3(0., cw * .35, 0.)) * aux.x;`),t.fragmentShader=t.fragmentShader.replace("#include <emissivemap_fragment>",`#include <emissivemap_fragment>
totalEmissiveRadiance += diffuseColor.rgb * .1;`)},n.customProgramCacheKey=()=>"holi-cloth",n}function Ct(e,n,t,l,u,i,d,g=4){e.push(),e.set(n,t,l,0,u),e.aux=[0,0],e.box(0,0,0,3.7,.22,3.7,i.stoneD),e.box(0,.22,0,3.3,.2,3.3,i.stone);const h=[[.24,0],[.26,.12],[.17,.3],[.15,1.75],[.2,1.86],[.15,1.95],[.27,2.12],[.3,2.2]];for(let b=0;b<g;b++){const y=Math.PI/4+b/g*Math.PI*2,B=g===4?1.9:1.55;e.lathe(Math.sin(y)*B,.42,Math.cos(y)*B,h,6,M=>M===2||M===3?i.stoneL:i.stone)}e.box(0,2.62,0,3.1,.34,3.1,i.stone,{g:.7}),e.lathe(0,0,0,[[2.1,2.9],[3.5,2.5],[3.56,2.6],[2.2,3.12]],4,b=>b<2?i.stoneD:i.stoneL,{rot:Math.PI/4,flat:!0}),e.lathe(0,0,0,[[1.55,3.05],[1.55,3.38],[1.68,3.44],[1.68,3.56],[1.5,3.6]],8,i.stone,{flat:!0,rot:Math.PI/8});const c=[];for(let b=0;b<=9;b++){const y=b/9*Math.PI/2;c.push([1.56*Math.pow(Math.cos(y),.8)*(1+.1*Math.sin(2*y)),3.6+1.62*Math.sin(y)])}c[9][0]=.16,e.aux=[1,0],e.lathe(0,0,0,c,14,(b,y)=>q(i.dome,(d&&y%2?.86:1)*(.84+.16*b/9))),e.aux=[0,0],e.lathe(0,0,0,[[.16,5.2],[.42,5.26],[.2,5.4],[.12,5.44]],8,i.stoneL),e.aux=[2,0],e.lathe(0,0,0,[[.1,5.44],[.3,5.6],[.1,5.78],[.2,5.9],[.05,6.02],[.03,6.4],[0,6.45]],8,i.brass),e.aux=[0,0],e.pop()}function Rt(e,n,t,l,u,i,d,g){const h=u+i*d,c=l-d*.32;e.quad([n,l,u],[t,l,u],[t,c,h],[n,c,h],g.stoneL,g.stone,[0,1,i*.3]),e.quad([n,l-.22,u],[t,l-.22,u],[t,c-.14,h],[n,c-.14,h],g.stoneD,q(g.stoneD,.8),[0,-1,0]),e.quad([n,c-.14,h],[t,c-.14,h],[t,c,h],[n,c,h],g.stone,g.stone,[0,0,i]),e.quad([n,l-.22,u],[n,c-.14,h],[n,c,h],[n,l,u],g.stone,g.stone,[-1,0,0]),e.quad([t,l-.22,u],[t,c-.14,h],[t,c,h],[t,l,u],g.stone,g.stone,[1,0,0]);const b=Math.max(2,Math.round((t-n)/1.5));for(let y=0;y<=b;y++){const B=n+.2+y/b*(t-n-.4);e.box(B,l-.95,u+i*d*.28,.24,.72,d*.56,g.stoneD,{g:.7}),e.box(B,l-.5,u+i*d*.48,.2,.3,d*.9,g.stone,{g:.75})}}function Ut(e,n,t,l,u,i,d){const g=Math.max(1,Math.round((t-n)/1.02)),h=(t-n)/g;e.box((n+t)/2,l,u,t-n,.42,.5,i.stone);for(let c=0;c<g;c++){const b=n+(c+.5)*h,y=q(i.stone,.9+d()*.2);d()<.04||(e.box(b,l+.42,u,h*.8,.5,.4,y,{g:.92,noTop:!0}),e.box(b,l+.92,u,h*.8,.52,.4,y,{t:.1,tz:1,g:1}))}}function ee(e,n,t,l,u,i,d){const g=l+i*.75;e.aux=[0,0],e.box(n,t-1.1,l+i*.3,u*.5,.5,.6,d.stoneD,{g:.7}),e.box(n,t-.6,l+i*.5,u*.8,.4,1,d.stone,{g:.72}),e.box(n,t-.2,g,u+.3,.22,1.6,d.stoneL,{g:.8,bottom:!0}),e.box(n,t,l+i*1.38,u,.75,.14,d.stone),e.aux=[5,0],e.box(n,t,l+i*.06,u-.5,2.3,.1,d.dark,{g:1}),e.aux=[1,0],e.box(n-u*.2,t+.1,l+i*.14,u*.3,1.9,.08,d.indigo),e.box(n+u*.22,t+.1,l+i*.2,u*.3,1.9,.08,d.cobalt),e.aux=[0,0];const h=[[.13,0],[.09,.2],[.08,1.75],[.15,1.95],[.17,2.05]];for(const c of[-.5,-.17,.17,.5])e.lathe(n+c*u*.96,t+.02,l+i*1.36,h,5,d.stoneL);e.box(n,t+2.07,g,u+.1,.2,1.55,d.stone,{g:.75}),e.lathe(n,t+2.27,l,[[1.3,-.1],[1.34,-.04],[1.08,.36],[.6,.66],[.08,.8]],10,c=>q(d.stoneL,.82+c*.05),{arc:Math.PI,rot:i>0?-Math.PI/2:Math.PI/2,sx:(u/2+.45)/1.3,sz:1.75/1.3}),e.aux=[2,0],e.lathe(n,t+3.05,l+i*.12,[[.06,0],[.16,.12],[.05,.26],[0,.5]],6,d.brass),e.aux=[0,0]}function Ft(e,n,t,l,u,i,d,g=12){const h=[],c=d()*6.28;for(let b=0;b<=g;b++){const y=b/g,B=4*y*(1-y);h.push([n[0]+(t[0]-n[0])*y,n[1]+(t[1]-n[1])*y-l*B,n[2]+(t[2]-n[2])*y])}e.tube(h,b=>u*(b%2?1.15:.8),5,b=>b%3===0?i.gold:i.marigold,{auxAt:b=>{const y=(b+.5)/g;return[.32*l*4*y*(1-y),c]}})}function Lt(e,n,t,l,u,i){const d=[],g=i()*6.28,h=8;for(let c=0;c<=h;c++)d.push([n[0],n[1]-t*c/h,n[2]]);e.tube(d,c=>l*(c%2?1.15:.8),5,c=>c%3===1?u.gold:u.marigold,{auxAt:c=>[.5*t*Math.pow((c+.5)/h,1.6)*.3,g]})}function G(e,n,t,l,u,i,d){const g=Math.hypot(t[0]-n[0],t[1]-n[1],t[2]-n[2]),h=Math.max(4,Math.round(g/.95)),c=i()*6.28,b=[],y=s=>[n[0]+(t[0]-n[0])*s,n[1]+(t[1]-n[1])*s-l*4*s*(1-s),n[2]+(t[2]-n[2])*s];for(let s=0;s<=h;s++)b.push(y(s/h));e.aux=[0,0],e.tube(b,.035,3,u.rope,{auxAt:s=>[.1*l*4*((s+.5)/h)*(1-(s+.5)/h),c]});const B=t[0]-n[0],M=t[2]-n[2],T=Math.hypot(B,M)||1,o=[-M/T,.2,B/T];for(let s=0;s<h;s++){const r=(s+.12)/h,x=(s+.88)/h,v=(r+x)/2,L=y(r),P=y(x),f=y(v),m=d[(s+Math.floor(i()*2))%d.length],p=.1*l*4*v*(1-v),C=.62+i()*.14;e.aux=[p,c],e.put(L,o,m),e.put(P,o,m),e.aux=[p+.3,c+s*.9],e.put([f[0],f[1]-C,f[2]],o,q(m,.82))}e.aux=[0,0]}function oe(e,n,t,l,u,i,d,g,h,c){const b=h()*6.28,y=7,B=h.range(-.25,.25),M=(T,o)=>[n+(T-.5)*u+B*o*o,t-i*o,l+c*.05*Math.sin(o*5+b)];for(let T=0;T<y;T++)for(let o=0;o<3;o++){const s=T/y,r=(T+1)/y,x=o/3,v=(o+1)/3,L=T===y-1||o===0?g:q(d,.85+.15*h());for(const[P,f]of[[x,s],[v,s],[v,r],[x,s],[v,r],[x,r]])e.aux=[.5*Math.pow(f,1.5)*Math.min(1,i/4),b+P*1.2],e.put(M(P,f),[0,.15,c],L)}e.aux=[0,0]}function qt(e,n,t,l,u,i,d,g,h,c){e.aux=[2,0],e.tube([[t,l,u],[t,l+i,u]],.05,5,d.brass),e.aux=[0,0];const b=2.3,y=6,B=h()*6.28,M=[-g[1],.1,g[0]];for(let T=0;T<y;T++){const o=T/y,s=(T+1)/y,r=.55*(1-o),x=.55*(1-s),v=l+i-.6,L=(C,S)=>[t+g[0]*b*C,v+S-C*.25,u+g[1]*b*C],P=[.9*o*o+.05*o,B-o*4],f=[.9*s*s+.05*s,B-s*4],m=q(c,1-o*.15),p=q(c,1-s*.15);n.aux=P,n.put(L(o,-r),M,m),n.aux=f,n.put(L(s,-x),M,p),n.put(L(s,x),M,p),n.aux=P,n.put(L(o,-r),M,m),n.aux=f,n.put(L(s,x),M,p),n.aux=P,n.put(L(o,r),M,m)}n.aux=[0,0]}async function ae(e,n,t,l,u){const i=u.yield||(()=>{}),d=u.z,g=9,h=d+g/2,c=d-g/2,b=o=>Math.abs(o)<11.5?23:19.8,y=[{x:0,w:15,h:17,n:u.lobes,c:.62},{x:-15.5,w:8,h:11,n:u.lobes-2,c:.42},{x:15.5,w:8,h:11,n:u.lobes-2,c:.42}],B=o=>q(t.stone,.78+.24*Tt(0,16,o)),M=o=>{const s=[],v=o.n*8,L=[],P=f=>{const m=Math.abs(Math.sin(f));let p=o.h*(.84*Math.pow(Math.max(0,1-Math.pow(m,6)),1/6)+.16*Math.pow(Math.max(0,1-m),1.5));return Math.abs(f)<=1.12+1e-6&&(p-=o.c*(1-Math.abs(Math.sin(o.n*Math.PI*(f+1.12)/(2*1.12))))),Math.max(0,p)};for(let f=0;f<5;f++)L.push(-Math.PI/2+f/5*(Math.PI/2-1.12));for(let f=0;f<=v;f++)L.push(-1.12+f/v*2*1.12);for(let f=1;f<=5;f++)L.push(1.12+f/5*(Math.PI/2-1.12));for(const f of L)s.push([o.x+o.w/2*Math.sin(f),P(f)]);return s[0][1]=0,s[s.length-1][1]=0,s};e.aux=[0,0];for(const o of y){const s=M(o),r=b(o.x),x=B(r),v=q(t.stoneD,.8);for(let L=0;L<s.length-1;L++){const[P,f]=s[L],[m,p]=s[L+1],C=B((f+p)/2);e.quad([P,f,h],[m,p,h],[m,r,h],[P,r,h],C,x,[0,0,1]),e.quad([P,f,c],[m,p,c],[m,r,c],[P,r,c],C,x,[0,0,-1]),e.quad([P,f,h],[m,p,h],[m,p,c],[P,f,c],v,v,[o.x-(P+m)/2,o.h*.45-(f+p)/2,0])}for(const L of[1,-1]){const P=L>0?h:c;for(const A of[-1,1])e.box(o.x+A*(o.w/2+.6),1.3,P+L*.18,.72,o.h-.4,.5,t.stoneL,{g:.8}),e.push(),e.set(o.x+A*o.w*.4,o.h*.935,P+L*.01,0,o.w*.06,L*Math.PI/2),e.lathe(0,0,0,[[1,0],[.92,.22],[.6,.12],[.34,.3],[0,.36]],10,(I,E)=>E%2?t.stoneL:t.stone),e.pop();e.box(o.x,o.h+.9,P+L*.2,o.w+2.6,.5,.56,t.stoneL,{g:.8,bottom:!0}),e.box(o.x,o.h+1.4,P+L*.12,o.w+2.2,.16,.36,t.stone,{g:.9});const f=o.w>10?3:2,m=o.h+.85,p=P+L*.62,C=o.x-o.w/2-.6,S=(o.w+1.2)/f;for(let A=0;A<f;A++)Ft(n,[C+A*S,m,p],[C+(A+1)*S,m,p],o.w>10?1.25:1,.13,t,l);for(let A=0;A<=f;A+=f)Lt(n,[C+A*S,m,p],o.w>10?6:4,.12,t,l)}await i()}for(const[o,s]of[[-23,-19.5],[-11.5,-7.5],[7.5,11.5],[19.5,23]]){const r=b((o+s)/2*.98);e.quad([o,0,h],[s,0,h],[s,r,h],[o,r,h],B(0),B(r),[0,0,1]),e.quad([o,0,c],[s,0,c],[s,r,c],[o,r,c],B(0),B(r),[0,0,-1]),e.box((o+s)/2,0,d,s-o,1.3,g+.8,t.stoneL,{g:.8}),e.box((o+s)/2,1.3,d,s-o,.25,g+.5,t.stone,{g:.9,t:.97})}for(const o of[-1,1])e.quad([o*11.5,19.8,h],[o*11.5,19.8,c],[o*11.5,23,c],[o*11.5,23,h],B(19),B(23),[o,0,0]),e.quad([o*11.5,19.8,h],[o*23,19.8,h],[o*23,19.8,c],[o*11.5,19.8,c],t.stoneD,t.stoneD,[0,1,0]);e.quad([-11.5,23,h],[11.5,23,h],[11.5,23,c],[-11.5,23,c],t.stoneD,t.stoneD,[0,1,0]);for(const o of[1,-1]){await i();const s=o>0?h:c;e.box(0,18.75,s+o*.1,23.4,.3,.3,t.stoneL,{g:.85,bottom:!0});for(let r=-3;r<=3;r++){const x=r*2.9;e.aux=[5,0],e.box(x,19.35,s+o*.03,1.25,1.9,.08,t.dark,{g:1}),e.aux=[1,0],(r+3+u.shut)%3&&e.box(x+.3,19.4,s+o*.08,.56,1.8,.06,(r+u.shut)%2?t.indigo:t.cobalt),e.aux=[0,0],e.box(x,19.12,s+o*.16,1.7,.16,.36,t.stoneL,{bottom:!0}),e.box(x,21.25,s+o*.14,1.6,.34,.3,t.stoneL,{t:.2,tz:1,bottom:!0})}Rt(e,-11.6,11.6,22.5,s,o,1.35,t),Ut(e,-11.5,11.5,23,s-o*.26,t,l);for(const r of[-1,1]){const x=r*15.5;ee(e,x,14.2,s,3.5,o,t),e.box(x,17.9,s+o*.1,8.6,.26,.3,t.stoneL,{g:.85,bottom:!0});for(const v of[-3,3])e.aux=[5,0],e.box(x+v,14.3,s+o*.03,.9,1.7,.08,t.dark,{g:1}),e.aux=[1,0],e.box(x+v-.2,14.34,s+o*.08,.42,1.6,.06,t.indigo),e.aux=[0,0],e.box(x+v,16,s+o*.12,1.25,.3,.28,t.stoneL,{t:.2,tz:1,bottom:!0});Rt(e,r>0?11.6:-19.6,r>0?19.6:-11.6,19.35,s,o,1.15,t),Ut(e,r>0?11.9:-19.4,r>0?19.4:-11.9,19.8,s-o*.26,t,l);for(let v=0,L=o>0?2:1;v<L;v++){const P=x+(v?1:-1)*l.range(1.6,3.2)+(L===1?l.range(-1,1):0);oe(n,P,18.92,s+o*1.22,l.range(1,1.4),l.range(3.2,5.2),l.pick(u.cloths),l.pick(u.edges),l,o)}Lt(n,[x-1.9,14,s+o*1.5],2.6,.1,t,l),Lt(n,[x+1.9,14,s+o*1.5],2.6,.1,t,l),Ft(n,[x-1.9,14,s+o*1.5],[x+1.9,14,s+o*1.5],.8,.11,t,l,9)}}for(const o of y.slice(1))for(const s of[-1,1]){e.push(),e.set(o.x+s*3.72,0,d+1.9,s*-.16),e.aux=[1,0],e.box(0,.15,-1.9,.2,8.9,3.7,s*o.x>0?t.indigo:t.cobalt,{g:.7}),e.aux=[2,0];for(const r of[1.6,4.4,7.2])e.box(0,r,-1.9,.26,.2,3.5,t.brass);e.aux=[0,0],e.pop()}const T=[];for(const o of[-1,1]){await i();const s=o*23.6;e.lathe(s,0,d,[[5,0],[5,1.3],[4.5,1.75],[4.3,12],[4.5,12.25],[4.5,12.6],[4.28,12.85],[4.22,20.3],[4.7,20.8],[4.7,21.5],[4.85,21.6],[4.85,22.5],[4.4,22.5],[4.4,21.9],[0,21.9]],8,r=>r<2||r===4||r===5||r>=8?t.stoneL:q(t.stone,.8+.2*Math.min(1,r/7)),{flat:!0,rot:Math.PI/8});for(let r=0;r<8;r++){const x=r*Math.PI/4,v=4.26*Math.cos(Math.PI/8)+.02;Math.abs(Math.sin(x))>.9&&Math.sin(x)*o<0||(e.push(),e.set(s+Math.sin(x)*v,0,d+Math.cos(x)*v,x),e.aux=[5,0],e.box(0,15.2,0,.5,2.1,.08,t.dark,{g:1}),e.box(0,7.4,0,.45,1.8,.08,t.dark,{g:1}),e.aux=[0,0],e.box(0,17.3,.06,.95,.26,.3,t.stoneL,{t:.2,tz:1,bottom:!0}),e.pop())}Ct(e,s,21.9,d,1.14,t,u.ribbed,8),T.push([s,21.9+6.45*1.14,d]),await i(),Ct(e,o*8.6,23,d,.98,t,u.ribbed,4),T.push([o*8.6,23+6.45*.98,d]),qt(e,n,s,21.9+6.3*1.14,d,3.2,t,u.wind,l,t.saffronCloth),qt(e,n,o*8.6,23+6.3*.98,d,2.8,t,u.wind,l,t.saffronCloth)}return{kiosks:T,zf:h,zb:c}}function ne(e,n,t,l,u,i,d){e.aux=[0,0],e.box(u,0,i,9.4,.5,9.4,t.stoneL,{g:.8}),e.box(u,.5,i,8.4,.5,8.4,t.stone,{g:.85}),e.box(u,1,i,7.4,.6,7.4,t.stoneL,{g:.85}),e.box(u,1.6,i,6.2,6,6.2,t.stone,{g:.78,t:.97}),e.box(u,7.6,i,6.7,.4,6.7,t.stoneL,{g:.8,bottom:!0}),e.box(u,8,i,5.6,.3,5.6,t.stone),e.box(u,8.3,i,4.7,12.7,4.7,t.stone,{g:.8});for(const y of[-1,1])for(const B of[-1,1])e.box(u+y*2.3,8.3,i+B*2.3,.62,12.7,.62,t.stoneL,{g:.8});for(const y of[12.4,16.7])e.box(u,y,i,5.25,.3,5.25,t.stoneL,{g:.8,bottom:!0});for(let y=0;y<4;y++){const B=y*Math.PI/2,M=Math.sin(B),T=Math.cos(B);e.push(),e.set(u+M*3.02,0,i+T*3.02,B),e.aux=[5,0],e.box(0,1.7,0,2,3.6,.1,t.dark,{g:1}),e.box(0,5.3,0,2,.8,.1,t.dark,{t:.1,tz:1,g:1}),e.aux=[1,0],e.box(y%2?.48:-.48,1.75,.07,.96,3.4,.08,y===d.door?t.cobalt:t.indigo,{g:.75}),e.aux=[0,0];for(const o of[-1,1])e.box(o*1.25,1.6,.14,.4,4.9,.3,t.stoneL,{g:.8});e.box(0,6.5,.14,3.2,.34,.34,t.stoneL,{bottom:!0}),e.pop(),e.push(),e.set(u+M*2.36,0,i+T*2.36,B);for(const o of[9.4,13.6,17.8])e.aux=[5,0],e.box(0,o,0,.9,2,.1,t.dark,{g:1}),e.aux=[1,0],(y+Math.round(o))%3&&e.box(.22,o+.05,.06,.42,1.9,.06,t.indigo),e.aux=[0,0],e.box(0,o-.22,.12,1.4,.2,.34,t.stoneL,{bottom:!0}),e.box(0,o+2,.12,1.5,.42,.3,t.stoneL,{t:.15,tz:1,bottom:!0});e.pop(),e.push(),e.set(u+M*3.35,0,i+T*3.35,B),e.box(0,21.3,0,6.9,.14,.14,t.stoneL),e.box(0,22.15,0,6.9,.16,.2,t.stoneL);for(let o=-5;o<=5;o++)e.box(o*.66,21.4,0,.14,.78,.14,o%5===0?t.stoneL:t.stone);for(const o of[-1.7,0,1.7])e.box(o,20.1,-.75,.34,.9,.5,t.stoneD,{g:.7,bottom:!0}),e.box(o,20.55,-.4,.28,.45,1,t.stone,{g:.7,bottom:!0});e.pop(),e.push(),e.set(u+M*2.33,24.1,i+T*2.33,B,1,Math.PI/2),e.lathe(0,0,0,[[2.05,0],[2.05,.2],[1.8,.26],[1.72,.06]],20,o=>o===1?t.stoneL:t.stone),e.pop(),Lt(n,[u+M*3.4+T*2.6,21.3,i+T*3.4-M*2.6],3.2,.1,t,l),Ft(n,[u+M*3.45-T*3.3,21.25,i+T*3.45+M*3.3],[u+M*3.45+T*3.3,21.25,i+T*3.45-M*3.3],1.1,.12,t,l)}e.box(u,21,i,6.9,.3,6.9,t.stoneL,{g:.72,bottom:!0}),e.box(u,21.3,i,4.6,5.4,4.6,t.stone,{g:.85});for(const y of[-1,1])for(const B of[-1,1])e.box(u+y*2.22,21.3,i+B*2.22,.5,5.4,.5,t.stoneL,{g:.85});e.box(u,26.7,i,5.3,.36,5.3,t.stoneL,{g:.8,bottom:!0}),e.lathe(u,0,i,[[3.3,27],[4.75,26.55],[4.82,26.66],[3.4,27.25]],4,y=>y<2?t.stoneD:t.stoneL,{rot:Math.PI/4,flat:!0}),Ct(e,u,27.15,i,1.05,t,!d.ribbed,8),qt(e,n,u,27.15+6.3*1.05,i,2.6,t,d.wind,l,t.saffronCloth);const g=[],h=[],c=[];for(let y=0;y<4;y++){const B=y*Math.PI/2,M=[Math.sin(B),0,Math.cos(B)],T=[Math.cos(B),0,-Math.sin(B)],o=[u+M[0]*2.42,24.1,i+M[2]*2.42],s=1.76,r=[[-1,-1],[1,-1],[1,1],[-1,-1],[1,1],[-1,1]];for(const[x,v]of r)g.push(o[0]+T[0]*x*s,o[1]+v*s,o[2]+T[2]*x*s),h.push(x,v),c.push(M[0],M[1],M[2])}const b=new w.BufferGeometry;return b.setAttribute("position",new w.Float32BufferAttribute(g,3)),b.setAttribute("uv",new w.Float32BufferAttribute(h,2)),b.setAttribute("normal",new w.Float32BufferAttribute(c,3)),b}function se(e){return new w.ShaderMaterial({fog:!0,uniforms:w.UniformsUtils.merge([w.UniformsLib.fog,{}]),vertexShader:`
      varying vec2 vUv; varying vec3 vN;
      #include <fog_pars_vertex>
      void main(){ vUv = uv; vN = normalize(mat3(modelMatrix) * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.); gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform float uTime; uniform vec3 uSun; varying vec2 vUv; varying vec3 vN;
      #include <fog_pars_fragment>
      float seg(vec2 p, float ang, float len, float w){ vec2 d = vec2(sin(ang), cos(ang)); float t = clamp(dot(p, d), -.12, len); return length(p - d * t) - w; }
      void main(){
        vec2 p = vUv; float r = length(p); if (r > 1.) discard;
        float aa = fwidth(r) * 1.5 + .004;
        vec2 pa = r > .01 ? p : vec2(0., 1.); float ang = atan(pa.x, pa.y);
        vec3 col = mix(vec3(.72, .69, .6), vec3(.62, .57, .46), smoothstep(.2, 1., r));
        float t12 = abs(fract(ang / 6.2831853 * 12. + .5) - .5) / 12. * 6.2831853 * r;
        float t60 = abs(fract(ang / 6.2831853 * 60. + .5) - .5) / 60. * 6.2831853 * r;
        float tick = (1. - smoothstep(.022, .022 + aa, t12)) * smoothstep(.70, .70 + aa, r) * (1. - smoothstep(.9, .9 + aa, r));
        tick = max(tick, (1. - smoothstep(.008, .008 + aa, t60)) * smoothstep(.83, .83 + aa, r) * (1. - smoothstep(.9, .9 + aa, r)));
        tick = max(tick, smoothstep(.93, .93 + aa, r) * (1. - smoothstep(.975, .975 + aa, r)));
        float mins = 2.0 + uTime / 90.;                        // a quarter turn every 22 s: visibly alive
        float hm = seg(p, mins * 6.2831853, .78, .028), hh = seg(p, (9. + fract(mins)) / 12. * 6.2831853, .5, .045);
        float hands = 1. - smoothstep(0., aa, min(min(hm, hh), r - .07));
        col = mix(col, vec3(.035, .04, .06), max(tick, hands));
        float l = max(dot(normalize(vN), normalize(uSun)), 0.);
        gl_FragColor = vec4(col * (vec3(.30, .36, .50) + vec3(1.05, .95, .78) * l), 1.);
        #include <fog_fragment>
      }`})}function re(e,n,t,l,u,i,d,g){e.push(),n.push(),e.set(u,0,i,d),n.set(u,0,i,d);const h=l.range(2.7,3.7),c=2.5,b=l.range(2.75,3.15),y=b-l.range(.5,.85);e.aux=[1,0];for(const[m,p,C]of[[-h/2,-c/2,b],[h/2,-c/2,b],[-h/2,c/2,y],[h/2,c/2,y]])e.tube([[m*1.05+l.range(-.05,.05),0,p*1.05],[m,C*.5,p],[m,C+.18,p]],.05,4,S=>q(t.bamboo,.8+S*.15));const B=6,M=4,T=l()*6.28,o=l.range(.12,.3),s=[0,1,.22],r=(m,p)=>[(m-.5)*h*1.1,b+(y-b)*p-o*4*m*(1-m)*(.35+2.4*p*(1-p)),(p-.5)*c*1.16],x=(m,p)=>[.05+.5*m*(1-m)*(.3+p),T],v=l.int(1,3);for(let m=0;m<B;m++)for(let p=0;p<M;p++){const C=m/B,S=(m+1)/B,A=p/M,I=(p+1)/M,E=q(Math.floor(m/v)%2?g[0]:g[1],.86+.14*l());for(const[W,_]of[[C,A],[C,I],[S,I],[C,A],[S,I],[S,A]])n.aux=x(W,_),n.put(r(W,_),s,E)}for(let m=0;m<B;m++){const p=m/B,C=(m+1)/B,S=(p+C)/2,A=r(S,1),I=q(Math.floor(m/v)%2?g[0]:g[1],.74);n.aux=x(p,1),n.put(r(p,1),[0,.3,1],I),n.aux=x(C,1),n.put(r(C,1),[0,.3,1],I),n.aux=[.24,T+m],n.put([A[0],A[1]-.42,A[2]+.03],[0,.3,1],I)}n.aux=[0,0];const L=ut(t.white,g[1],.25);e.aux=[1,0],e.box(0,0,.15,h*.82,.78,1.35,L,{t:.95,g:.6});const P=l.int(5,7),f=l.int(0,2);for(let m=0;m<P;m++){const p=(m/(P-1)-.5)*h*.66,C=.15+(m%2?.28:-.24),S=l.range(.2,.28),A=l.range(.42,.62),I=t.pow[(f+m)%3];e.aux=[2,0],e.lathe(p,.78,C,[[S+.12,0],[S+.13,.05],[0,.05]],6,t.brass),e.aux=[4,0],e.lathe(p,.8,C,[[S,.02],[S*.56,A*.5],[0,A]],6,E=>q(I,.78+E*.13))}for(const m of[-1,1])if(l()<.7){const p=t.pow[l.int(0,2)],C=m*(h*.5+.55),S=l.range(.2,1);e.aux=[1,0],e.lathe(C,0,S,[[.3,0],[.42,.34],[.33,.6],[.37,.64]],6,A=>q(t.burlap,.75+A*.08)),e.aux=[4,0],e.lathe(C,0,S,[[.34,.58],[.2,.74],[0,.8]],6,p)}e.aux=[0,0],e.pop(),n.pop()}function ie(e,n){const t=n.length,l=new Float32Array(t*4),u=new Float32Array(t*4),i=new Float32Array(t*4);for(let c=0;c<t;c++)l.set(n[c].a,c*4),u.set(n[c].b,c*4),i.set(n[c].c,c*4);const d=new w.InstancedBufferGeometry;d.setAttribute("position",new w.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),d.setIndex([0,1,2,0,2,3]),d.setAttribute("iA",new w.InstancedBufferAttribute(l,4)),d.setAttribute("iB",new w.InstancedBufferAttribute(u,4)),d.setAttribute("iC",new w.InstancedBufferAttribute(i,4)),d.instanceCount=t;const g=new w.ShaderMaterial({transparent:!0,depthWrite:!1,premultipliedAlpha:!0,fog:!0,uniforms:w.UniformsUtils.merge([w.UniformsLib.fog,{}]),vertexShader:`
      attribute vec4 iA, iB, iC;
      uniform float uTime, uPart, uErupt, uFire, uS; uniform vec3 uWind, uSun; uniform vec4 uLaneP[10], uLaneK;
      varying vec2 vUv; varying vec4 vB, vLane; varying vec3 vWp; varying float vAlpha, vLy, vShaft, vSide, vFoot, vSize;
      #include <fog_pars_vertex>
      float h1(float n){ return fract(sin(n * 127.1) * 43758.5453); }
      void main(){
        float seed = iB.x, type = iB.z, H = iA.w, sq = iC.z;
        vec3 o = iA.xyz, c; float size, alpha, hh = 0., hand = 0.; vSide = 0.;
        float er = mix(1., mix(.36, 1., uErupt), sq);
        if (type < .5) {
          float a = fract(uTime * iC.w + seed);
          hh = pow(a, .85);
          float fs = fract(seed * 7.13);
          float ang = h1(fs * 3.1) * 6.2831853 + uTime * .06 * (h1(fs * 9.7) - .5);
          float rr = sqrt(h1(fs * 5.3));
          vec2 off = vec2(cos(ang), sin(ang)) * (iC.x * (.35 + .5 * hh + 1.1 * hh * hh * hh) * rr);   // a column that opens only near its top
          c = o + vec3(off.x, H * hh * er, off.y);
          c.x += sin(uTime * .31 + fs * 40. + c.y * .21) * (.2 + 1.5 * hh);
          c.z += cos(uTime * .27 + fs * 31. + c.y * .17) * (.2 + 1.5 * hh);
          c.xz += uWind.xz * (iC.y * uWind.y * H * pow(hh, 2.2) * er);
          size = iC.x * (.8 + .9 * hh + 1.35 * hh * hh * hh) * mix(.75, 1.3, h1(fs * 7.7));
          alpha = smoothstep(0., .05, a) * (1. - smoothstep(.5, 1., a)) * mix(.7, 1., er) * (1. - .7 * hh) * .58;
          vSide = dot(normalize(off + vec2(1e-4, 0.)), normalize(uSun.xz + vec2(1e-4, 0.))) * rr;
        } else if (type < 1.5) {
          float grp = floor(seed), fs = fract(seed);
          float per = 1.4 + h1(grp * 1.7) * 1.3;
          float tt = uTime / per + h1(grp * 2.3), b = fract(tt), k = floor(tt);
          float ang = h1(grp * .73 + k * .37) * 6.2831853;
          vec3 dir = normalize(vec3(cos(ang) * .5 + (h1(fs * 91.) - .5) * .55, 1., sin(ang) * .5 + (h1(fs * 57.) - .5) * .55));
          hand = iC.w;                                             // 1: a handful thrown by someone we can see (crowd, roof)
          float reach = mix(3. + 5. * h1(fs * 13.), 6. + 4. * h1(fs * 13.), hand) * (1. - exp(-3.2 * b)) * mix(.7, 1.25, er);
          vec3 foot = o + vec3(cos(grp * 2.4 + k) * iC.x, 1.3, sin(grp * 2.4 + k) * iC.x);
          c = foot + dir * reach - vec3(0., 1.8 * b * b, 0.);
          c.xz += uWind.xz * (b * 1.6);
          hh = c.y / max(H, 1.) * .3;
          size = mix(.45 + 2.6 * b, .3 + 1.4 * b, hand); alpha = smoothstep(0., .06, b) * pow(1. - b, 1.3) * mix(.8, .95, hand);
          // roof handfuls near the route fly as the camera arrives (iC.y = metres along the path); the crowd's come in with the eruption
          if (iC.y > .5) alpha *= smoothstep(iC.y - 85., iC.y - 55., uS) * (1. - smoothstep(iC.y + 30., iC.y + 60., uS));
          float eg = .08 + .6 * h1(grp * .31);
          alpha *= mix(1., smoothstep(eg, eg + .25, uErupt), hand * sq);
        } else {
          float fall = .3 + .5 * h1(seed * 3.);
          c = o; c.y = mod(o.y - uTime * fall, H);
          c.x += sin(uTime * .5 + seed * 50.) * .7 + uWind.x * (H - c.y) * .06;
          c.z += cos(uTime * .43 + seed * 23.) * .7 + uWind.z * (H - c.y) * .06;
          size = .045 + .06 * h1(seed * 11.); alpha = .8 * smoothstep(0., 1.5, c.y) * (1. - smoothstep(H - 3., H, c.y));
        }
        // the parting: the square's cloud leans away from the centre line, more with height
        float sgn = o.x < 0. ? -1. : 1.;
        c.x += sq * (1. - hand) * sgn * uPart * (5. + 13. * hh) * exp(-abs(o.x) / 24.);
        vec3 wc = (modelMatrix * vec4(c, 1.)).xyz;
        vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]), cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
        float dcam = length(cameraPosition - wc);
        // many small puffs, never a sheet: no sprite wider than 9 m, nor than an eighth of the view
        if (type < 1.5) size = min(min(size, 4.5), max(dcam * .12, .3));
        // bonfire eve: thrown handfuls become small bright sparks
        if (type > .5 && type < 1.5) size = mix(size, max(.05 + .07 * h1(seed * 3.3), dcam * .0021), uFire);
        vec3 wp = wc + (cr * position.x + cu * position.y) * size;
        alpha *= type > 1.5 ? smoothstep(2.5, 9., dcam) : (type > .5 ? smoothstep(3.5, 11., dcam) : mix(smoothstep(7., 20., dcam), smoothstep(9., 28., dcam), sq));   // nothing soft against the lens
        // the square's cloud never closes over the gate: thinner on the centre line, and thinner still along the sight line to the portal
        vec3 pp = (modelMatrix * vec4(0., 9., -60., 1.)).xyz - cameraPosition; float pl = max(length(pp), 1e-3); pp /= pl;
        vec3 ts = wc - cameraPosition; float al = dot(ts, pp), perp = length(ts - pp * al);
        float clear = max(smoothstep(4.5, 10. + size * .8, perp), step(pl, al));
        alpha *= mix(1., mix(.5, 1., smoothstep(5., 15., abs(c.x))) * mix(.22, 1., clear), sq * (1. - step(1.5, type)));
        vUv = position.xy; vB = iB; vWp = wp; vAlpha = alpha; vLy = c.y + cu.y * position.y * size; vFoot = vLy - o.y;
        vShaft = mix(.36, .3, sq); vSize = size;
        // the lane the camera runs: how far this corner stands across it (signed) and along it from the crossing, whether its walls
        // stand here at all, and the height they stand to (a handful thrown from a roof clears its own parapet)
        float ld = 1e9, lx = 0., ls = 0., lt = 0.;
        for (int i = 0; i < 9; i++) {
          vec4 la = uLaneP[i], lb = uLaneP[i + 1];
          vec2 ab = lb.xy - la.xy, ap = wp.xz - la.xy;
          float t = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-4), 0., 1.);
          vec2 e = ap - ab * t;
          float d = dot(e, e);
          if (d < ld) { ld = d; lx = (ab.x * ap.y - ab.y * ap.x < 0. ? -1. : 1.) * sqrt(d + 1e-6); ls = mix(la.z, lb.z, t); lt = mix(la.w, lb.w, t); }
        }
        float oy = (modelMatrix * vec4(o, 1.)).y;
        vLane = vec4(lx, ls - uLaneK.x, type > 1.5 ? 0. : smoothstep(uLaneK.z, uLaneK.z + 4., ls) * (1. - smoothstep(uLaneK.w - 4., uLaneK.w, ls)), oy > lt - 3.4 ? min(oy + .5, lt) : lt);
        vec4 mvPosition = viewMatrix * vec4(wp, 1.);
        gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uCol[5]; uniform vec3 uSun, uLitCol, uShadeCol, uFireCol; uniform float uTime, uGate, uFire; uniform vec4 uLaneK;
      varying vec2 vUv; varying vec4 vB, vLane; varying vec3 vWp; varying float vAlpha, vLy, vShaft, vSide, vFoot, vSize;
      #include <fog_pars_fragment>
      ${Vt}
      void main(){
        float r2 = dot(vUv, vUv); if (r2 > 1.) discard;
        float soft = 1. - r2;
        vec3 base = vB.y < .5 ? uCol[0] : (vB.y < 1.5 ? uCol[1] : (vB.y < 2.5 ? uCol[2] : (vB.y < 3.5 ? uCol[3] : uCol[4])));
        // a puff, not a disc: a soft billowing edge broken by lumps, fine grain that stays on the puff close up, and (for thrown
        // handfuls) loose specks flung off the rim
        float a = soft * soft; vec2 lump = vec2(0.);
        // every puff turns its noise by its own angle (the sprites all face the camera: unturned, their noise cells line up into a
        // grid across the plume), and the fine octaves fade out before a cell is smaller than a few pixels
        float ra = vB.x * 17.3, rc = cos(ra), rs = sin(ra);
        mat2 rm = mat2(rc, -rs, rs, rc);
        vec2 ru = rm * vUv;
        float fu = fwidth(vUv.x);
        vec2 gq = ru * vSize * 9., gw = fwidth(gq);
        if (vB.z < 1.5) {
          float hand = step(.5, vB.z);
          vec2 q = ru * 2.6 + vB.x * 37.;
          float b = fb2(q), b2 = fb2(ru * 6.5 + vB.x * 91. - vec2(0., uTime * .08));
          float b3 = fb2(ru * 15. + vB.x * 53.);
          float k2 = 1. - smoothstep(.15, .4, fu * 6.5), k3 = 1. - smoothstep(.1, .25, fu * 15.);
          a = smoothstep(.1, .74, soft * (.3 + 1.5 * b) - .22 * mix(.5, b2, k2) - .16 * mix(.5, b3, k3));
          // the lumps that catch the light come from the broad octave only, turned back into the sprite's own axes
          lump = (vec2(vn2(q + vec2(.25, 0.)), vn2(q + vec2(0., .25))) - vn2(q)) * rm;
          float gk = 1. / (1. + 3. * dot(gw, gw));
          float g = hh21(floor(gq) + floor(vB.x * 64.));
          a *= mix(1., mix(.88, .64, hand) + mix(.24, .72, hand) * g, gk);
          a = max(a, hand * step(.8, g) * smoothstep(.02, .22, soft) * (1. - smoothstep(.3, .52, soft)) * .5 * gk);
        }
        float wisp = fb2(vec2(vWp.x + vWp.z * .7, vWp.y * .8 - uTime * .22) * .42 + floor(vB.x) * 1.3);
        if (vB.z < 1.5) a *= .66 + .68 * wisp;
        float spark = (vB.z > .5 && vB.z < 1.5) ? uFire : 0.;
        a = mix(a, soft, spark);
        // in the lane the powder thins to nothing before it meets a house wall (the lane itself, or its cross street): no wall
        // cuts a puff along a straight line
        float dw = max(3.45 - abs(vLane.x), uLaneK.y - .05 - abs(vLane.y));
        float wk = vLane.z * (1. - smoothstep(9.5, 10.5, abs(vLane.x))) * (1. - smoothstep(vLane.w, vLane.w + 1., vWp.y));
        a *= mix(1., smoothstep(0., 1., dw), wk);
        a *= vAlpha; if (a < .003) discard;
        vec3 sun = normalize(uSun);
        vec3 N = normalize(vec3(vUv - lump * 4., sqrt(max(soft, 0.)) + .3));
        vec3 Lv = normalize((viewMatrix * vec4(sun, 0.)).xyz);
        float nl = dot(N, Lv);
        float lit = smoothstep(vB.w - 2. + uGate, vB.w + 3.5 + uGate, vLy);
        // shafts: sheets of shadow thrown by the roofline, constant along the sun direction
        vec3 p2 = normalize(cross(vec3(0., 1., 0.), sun) + vec3(1e-4, 0., 0.)), p1 = normalize(cross(sun, p2));
        float sv = vn2(vec2(dot(vWp, p1) * .45 + uTime * .03, dot(vWp, p2) * .03) + floor(vB.x) * 3.7);
        float sv2 = vn2(vec2(dot(vWp, p1) * 1.1 - uTime * .02, dot(vWp, p2) * .05) + 17.);
        float shaftAmt = vShaft * (1. - smoothstep(vB.w + 9., vB.w + 20., vLy));
        float sh = mix(1., smoothstep(.41, .55, sv * .72 + sv2 * .28), shaftAmt);
        float sunAmt = lit * sh * max(.3, .56 + .44 * vSide);
        vec3 airy = mix(base, vec3(1.), .1);
        // a lit side and a shadowed side of different hue: warm and airy toward the sun, deeper and bluer away from it
        // (powder in the sun is bright all through: a puff's own far side is dimmed, never dark)
        float lk = sunAmt * mix(.3, 1., smoothstep(-.25, .6, nl));
        vec3 col = mix(base * uShadeCol * vec3(.66, .7, 1.) + uShadeCol * vec3(.03, .042, .075), mix(airy, vec3(1.), .17 * lk * lk) * uLitCol * 1.12, lk);
        float fwd = max(dot(normalize(vWp - cameraPosition), sun), 0.);
        col += airy * sunAmt * fwd * fwd * r2 * .9 * min(uLitCol.g, 1.);
        // bonfire eve: smoke lit from its foot, sparks in place of thrown handfuls
        col += uFireCol * uFire * (spark > .5 ? 3.2 : (vB.z < .5 ? .42 * exp(-max(vFoot, 0.) / 4.5) * soft : 0.));
        gl_FragColor = vec4(col, a);
        #include <fog_fragment>
        gl_FragColor.rgb = max(gl_FragColor.rgb, 0.) * clamp(gl_FragColor.a, 0., 1.);
      }`});g.uniforms.uTime=e.uTime,g.uniforms.uPart=e.uPart,g.uniforms.uErupt=e.uErupt,g.uniforms.uS=e.uS,g.uniforms.uWind=e.uWind,g.uniforms.uSun=e.uSun,g.uniforms.uCol=e.uPow5,g.uniforms.uLaneP=e.uLaneP,g.uniforms.uLaneK=e.uLaneK,g.uniforms.uLitCol=e.uLitCol,g.uniforms.uShadeCol=e.uShadeCol,g.uniforms.uFireCol=e.uFireCol,g.uniforms.uGate=e.uGate,g.uniforms.uFire=e.uFire;const h=new w.Mesh(d,g);return h.frustumCulled=!1,h.renderOrder=6,h}function ue(e,n){const t=n.length,l=new Float32Array(t*4),u=new Float32Array(t*4);for(let b=0;b<t;b++)l.set(n[b].o,b*4),u.set(n[b].p,b*4);const i=new w.InstancedBufferGeometry,d=[0,0,.3,-.09,0,0,.09,0,0,-.09,0,0,0,0,-.34,.09,0,0,-.07,.01,.14,-.62,.01,-.02,-.07,.01,-.14,.07,.01,.14,.07,.01,-.14,.62,.01,-.02],g=[0,0,0,0,0,0,0,1,0,0,0,1];i.setAttribute("position",new w.Float32BufferAttribute(d,3)),i.setAttribute("aW",new w.Float32BufferAttribute(g,1)),i.setAttribute("iO",new w.InstancedBufferAttribute(l,4)),i.setAttribute("iP",new w.InstancedBufferAttribute(u,4)),i.instanceCount=t;const h=new w.ShaderMaterial({side:w.DoubleSide,fog:!0,uniforms:w.UniformsUtils.merge([w.UniformsLib.fog,{}]),vertexShader:`
      attribute float aW; attribute vec4 iO, iP;
      uniform float uTime; varying vec3 vCol; varying float vTint, vUp;
      #include <fog_pars_vertex>
      void main(){
        float an = iP.y + uTime * iP.x, dirn = iP.x < 0. ? -1. : 1.;
        float rr = iO.w * (1. + .16 * sin(an * 1.7 + iP.y * 3.));
        vec3 c = iO.xyz + vec3(cos(an) * rr, sin(an * 2.3 + iP.y * 5.) * iP.z, sin(an) * rr);
        vec3 fw = vec3(-sin(an), 0., cos(an)) * dirn, rt = vec3(fw.z, 0., -fw.x);
        float beat = sin(uTime * 15. + iP.y * 9.), glide = smoothstep(.55, .9, sin(uTime * .7 + iP.y * 4.));
        float flap = mix(beat * .85, .22, glide);
        vec3 p = position * 1.7;
        p.y += aW * flap * abs(p.x) ; p.x *= 1. - aW * abs(flap) * .28;
        float bank = .35 * dirn;
        vec3 l = rt * (p.x * cos(bank)) + vec3(0., 1., 0.) * (p.y + p.x * sin(bank)) + fw * p.z;
        float nearK = smoothstep(3., 8., distance(cameraPosition, (modelMatrix * vec4(c, 1.)).xyz));   // never a flat shape against the lens
        l *= nearK;
        vec4 wp = modelMatrix * vec4(c + l, 1.);
        vCol = mix(vec3(.27, .29, .34), vec3(.62, .64, .68), aW * (.5 + .5 * beat));
        vTint = iP.w; vUp = aW;
        vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
        #include <fog_vertex>
      }`,fragmentShader:`
      uniform vec3 uCol[3]; varying vec3 vCol; varying float vTint, vUp;
      #include <fog_pars_fragment>
      void main(){
        vec3 col = vCol;
        vec3 tc = vTint < .5 ? uCol[0] : (vTint < 1.5 ? uCol[1] : uCol[2]);
        col = mix(col, tc, vTint < -.5 ? 0. : .55);
        gl_FragColor = vec4(col * 1.25, 1.);
        #include <fog_fragment>
      }`});h.uniforms.uTime=e.uTime,h.uniforms.uCol=e.uPow;const c=new w.Mesh(i,h);return c.frustumCulled=!1,c}async function Nt(e,n,t){const l=Bt(),u=[.42,.27,.17],i=[.86,.86,.86],d=[.06,.05,.05];if(t){l.lathe(0,0,0,[[.16,0],[.2,.5],[.14,.96],[.21,1.32],[.07,1.5]],4,o=>o<2?q(i,.6):i,{rot:Math.PI/4}),l.lathe(0,0,0,[[.07,1.47],[.12,1.6],[.1,1.73],[0,1.8]],4,o=>o>1?d:u),l.aux=[1,0];for(const o of[-1,1])l.tube([[o*.2,1.36,0],[o*.31,1.68,.07],[o*.3,2.02,.1]],s=>.056-s*.008,3,s=>s>0?u:i)}else{l.lathe(0,0,0,[[.13,0],[.24,1.22],[.08,1.5]],4,o=>o===0?q(i,.45):i),l.lathe(0,0,0,[[.08,1.48],[.125,1.62],[0,1.8]],4,o=>o>1?d:u),l.aux=[1,0];for(const o of[-1,1])l.tube([[o*.2,1.36,0],[o*.33,2,.1]],.05,3,s=>s>0?u:i)}l.aux=[0,0];const g=await l.build(),h=new w.MeshStandardMaterial({vertexColors:!0,roughness:.9});h.onBeforeCompile=o=>{o.uniforms.uTime=e.uTime,o.uniforms.uErupt=e.uErupt,o.uniforms.uCrowd=e.uCrowd,o.vertexShader=o.vertexShader.replace("#include <common>",`#include <common>
uniform float uTime; uniform float uErupt; uniform float uCrowd; attribute vec3 iPose; attribute vec2 aux;`).replace("#include <begin_vertex>",`#include <begin_vertex>
        float cph = iPose.z * 6.2831853, pose = iPose.x, er = max(uErupt, iPose.y);
        float spd = 2. + fract(iPose.z * 7.31) * 2.6;
        float hop = abs(sin(uTime * spd + cph));
        float arm = aux.x * smoothstep(1.42, 2.0, position.y), rightArm = step(0., position.x);
        float one = step(.5, pose) * step(pose, 1.5), crouch = step(1.5, pose);
        float hang = arm * max(1. - er, one * (1. - rightArm));                      // arms that are not in the air hang at the side
        float sw = sin(uTime * spd * 1.25 + cph * 2.);
        transformed.y += hop * hop * (.1 + .2 * er) * (1. - .7 * crouch) - hang * 1.05 - arm * crouch * .55 * (1. - hang);
        transformed.x += (sin(uTime * 5.3 + cph * 3.) * .14 * (1. - one) - sign(position.x) * .09 * hang) * arm + sin(uTime * 1.7 + cph) * .05 * position.y;
        transformed.z += cos(uTime * 4.1 + cph * 2.) * .1 * arm * (1. - one) + (sw * .42 * one * rightArm + .32 * crouch) * arm * (1. - hang);
        transformed.y -= (.5 - .5 * sw) * .3 * one * rightArm * arm * (1. - hang);
        transformed.y *= 1. - .3 * crouch;
        transformed *= max(uCrowd, iPose.y);`)},h.customProgramCacheKey=()=>"holi-crowd4";const c=new w.InstancedMesh(g,h,n.length),b=new Float32Array(n.length*3),y=new w.Matrix4,B=new w.Quaternion,M=new w.Vector3(0,1,0),T=new w.Color;for(let o=0;o<n.length;o++){const s=n[o],r=Math.sin(s.x*12.9898+s.z*78.233+o*.37)*43758.5453;y.compose(new w.Vector3(s.x,s.y||0,s.z),B.setFromAxisAngle(M,s.ry),new w.Vector3(s.s,s.s,s.s)),c.setMatrixAt(o,y),c.setColorAt(o,T.setRGB(s.c[0],s.c[1],s.c[2])),b[o*3]=s.pose||0,b[o*3+1]=s.always?1:0,b[o*3+2]=r-Math.floor(r)}return g.setAttribute("iPose",new w.InstancedBufferAttribute(b,3)),c.instanceMatrix.needsUpdate=!0,c.instanceColor&&(c.instanceColor.needsUpdate=!0),c.frustumCulled=!1,c}async function ce(e,n={}){const t=e.rng.fork?e.rng.fork("standing-colour"):e.rng,l=e.quality?.detail??1,u=(Array.isArray(n.palette)&&n.palette.length>=7?n.palette:Jt).map(Dt),i=(a,z,k)=>new w.Vector3(a,z,k),d=new w.Group;d.name="blue-city-holi-hero";const g=t.shuffle([0,1,2]),h=Math.PI+t.range(-.3,.3),c=n.windAngle??h,b=[Math.cos(c),Math.sin(c)],y=t.chance(.2)?t.range(.03,.08):t.range(.14,.3),B=n.lean??y,M=t.pick([9,11]),T=t.chance(.5),o=t.chance(.6);let s=u[3];s=ut(ut(s,[.6,.47,.34],.38),t.chance(.5)?[.6,.3,.2]:[.62,.44,.2],t.range(0,.35));const r={stone:s,stoneL:ut(s,[.8,.72,.6],.34),stoneD:q(s,.6),white:q(u[2],.84),indigo:u[0],cobalt:u[1],dark:[.03,.035,.06],brass:[.8,.52,.14],marigold:q(u[5],.95),gold:[.9,.6,.06],rope:[.3,.25,.18],bamboo:[.5,.4,.22],burlap:[.42,.33,.2],saffronCloth:q(u[5],.95),pow:[u[4],u[5],u[6]]};r.dome=o?r.white:r.stoneL;const x=n.sunDir?i(n.sunDir[0],n.sunDir[1],n.sunDir[2]).normalize():i(.845,.53,.074),v={uTime:{value:0},uPart:{value:n.parting??.7},uErupt:{value:1},uSun:{value:x},uWind:{value:i(b[0],1,b[1])},uPow:{value:r.pow.map(a=>new w.Color().setRGB(a[0],a[1],a[2]))},uLitCol:{value:i(1.75,1.58,1.3)},uShadeCol:{value:i(.33,.35,.5)},uFireCol:{value:i(1,.42,.12)},uFeet:{value:Array.from({length:16},()=>new w.Vector4(9999,9999,0,.1))},uGate:{value:0},uFire:{value:0},uStainK:{value:1},uS:{value:0},uCrowd:{value:1}},L=(n.extraColors||[]).map(Dt);v.uPow5={value:[0,1,2,3,4].map(a=>{const z=a<3?r.pow[a]:L[a-3]||r.pow[a-3];return new w.Color().setRGB(z[0],z[1],z[2])})};const P=n.lane,f=P&&Array.isArray(P.pts)&&P.pts.length===10?P.pts:null;v.uLaneP={value:Array.from({length:10},(a,z)=>f?new w.Vector4(f[z][0],f[z][1],f[z][2],f[z][3]):new w.Vector4(9e5+z*10,9e5,z*10,0))},v.uLaneK={value:f?new w.Vector4(P.cross??0,P.half??0,P.from??0,P.to??0):new w.Vector4(0,0,9e5,-9e5)};const m=Bt(),p=Bt();m.aux=[3,0];const C=q(ut(r.stone,[.5,.47,.44],.55),.82),S=66,A=12,I=a=>q(C,.9+.14*e.noise.n2(a*.05,3.3));for(let a=0;a<A;a++)for(let z=0;z<A;z++){const k=-S+a/A*2*S,F=-S+(a+1)/A*2*S,V=-S+z/A*2*S,U=-S+(z+1)/A*2*S;m.quad([k,0,U],[F,0,U],[F,0,V],[k,0,V],I(U),I(V),[0,1,0])}for(const[a,z,k,F,V,U]of[[-S,S,S,S,0,1],[S,-S,-S,-S,0,-1],[S,S,S,-S,1,0],[-S,-S,-S,S,-1,0]])m.quad([a,-.7,z],[k,-.7,F],[k,0,F],[a,0,z],q(C,.6),C,[V,0,U]);m.aux=[0,0];const E=await ae(m,p,r,t,{yield:()=>e.yield?.(),z:-60,lobes:M,shut:t.int(0,2),ribbed:T,wind:b,cloths:[r.white,r.white,q(u[0],1.3),u[1],q(u[2],.7)],edges:[q(u[5],.9),q(u[0],1.2),q(u[4],.85)]});await e.yield?.();const W=-26,_=10,D=ne(m,p,r,t,W,_,{door:t.int(0,3),ribbed:T,wind:b});await e.yield?.();const Z=[[r.white,q(u[0],1.25)],[r.white,q(u[1],.95)],[[.7,.6,.44],r.white],[r.white,q(u[5],.8)],[q(u[1],.9),q(u[0],1.2)]],O=[],Q=t.int(10,12);for(let a=0;a<Q;a++){const z=-46+a/(Q-1)*92;O.push([-54,z,Math.PI/2],[54,z,-Math.PI/2])}for(const a of[34,43.5])O.push([a,-53,0],[-a,-53,0]);for(const a of[15,24.5,34,43.5])O.push([a,55,Math.PI],[-a,55,Math.PI]);const j=[];let dt=0;for(const a of O){if(++dt%2===0&&await e.yield?.(),t()<.06)continue;const z=a[0]+t.range(-.7,.7),k=a[1]+t.range(-.7,.7),F=a[2]+t.range(-.14,.14);re(m,p,r,t,z,k,F,t.pick(Z)),j.push({position:i(z,0,k),rotationY:F})}await e.yield?.();const R=[r.white,r.saffronCloth,q(u[0],1.3),r.white,u[1],q(u[4],.9),r.white,q(u[6],.9)],ot=[[-37,-27],[37,-27],[-39,33],[39,33]].map(([a,z])=>[a+t.range(-2,2),10.5+t.range(0,2),z+t.range(-2,2)]);for(const[a,z,k]of ot)m.aux=[0,0],m.box(a,0,k,1.1,.7,1.1,r.stoneL,{t:.8}),m.aux=[1,0],m.tube([[a,.6,k],[a+.06,z*.5,k],[a,z,k]],F=>.11-F*.025,6,F=>q(r.bamboo,.75+F*.12)),m.aux=[2,0],m.lathe(a,z,k,[[.05,0],[.16,.12],[.05,.28],[0,.45]],6,r.brass),m.aux=[0,0];const N=a=>[ot[a][0],ot[a][1]-.2,ot[a][2]];G(p,N(0),[W+3.3,21.4,_-3.3],2.2,r,t,R),G(p,N(2),[W-3.3,21.4,_+3.3],1.8,r,t,R),G(p,N(0),[-20.5,17.6,E.zf+.3],1.6,r,t,R),G(p,N(1),[20.5,17.6,E.zf+.3],1.6,r,t,R),G(p,N(0),N(2),2.6,r,t,R),G(p,N(1),N(3),2.6,r,t,R),G(p,N(1),[53.5,3.2,-30+t.range(-6,6)],1.2,r,t,R),G(p,N(3),[53.5,3.2,30+t.range(-6,6)],1.2,r,t,R),G(p,N(2),[-53.5,3.2,36+t.range(-6,6)],1.2,r,t,R),G(p,N(3),[30+t.range(-4,4),3.2,54.5],1.4,r,t,R),G(p,N(2),[-30+t.range(-4,4),3.2,54.5],1.4,r,t,R),await e.yield?.();const nt=new w.Mesh(await m.build(()=>e.yield?.()),Gt(v));nt.castShadow=!0,nt.receiveShadow=!0,d.add(nt),await e.yield?.();const st=new w.Mesh(await p.build(()=>e.yield?.()),te(v));st.castShadow=!0,st.frustumCulled=!1,d.add(st);const rt=se(v);rt.uniforms.uTime=v.uTime,rt.uniforms.uSun=v.uSun,d.add(new w.Mesh(D,rt)),await e.yield?.();const[J,tt,at]=g,ft=()=>t.range(-3,3),X=[],et=(a,z,k)=>X.push({x:a+ft()*(Math.abs(a)<10?.3:1),y:0,z:z+ft(),h:t.range(21,30),R:t.range(1.6,2.4),col:k,roofY:t.range(3.5,5.5),sq:1,lean:Math.min(B,.22),rate:1/t.range(11,15),n:120});et(-7,-36,J),et(7,-31,at),et(-6,-13,tt),et(6.5,-9,J);const lt=t.shuffle([[-20,-41,J],[-35,-19,tt],[-17,32,tt],[-13,6,J],[22,-42,at],[36,-15,tt],[19,8,at],[21,35,at]]);for(let a=0,z=t.int(5,6);a<z;a++)et(lt[a][0],lt[a][1],[J,tt,at][(a+1)%3]);const vt=n.outerPlumes??(n.plumes?0:10);for(let a=0;a<vt;a++){const z=.45+(a+t.range(.1,.9))/vt*(Math.PI*2-.9),k=t.range(63,71);X.push({x:Math.sin(z)*k,y:0,z:Math.cos(z)*k,h:t.range(16,27),R:t.range(1.8,2.6),col:(a+g[0])%3,roofY:t.range(6,9.5),sq:0,lean:B*1.15,rate:1/t.range(12,17),n:60})}for(const a of n.plumes||[])X.push({x:a.x,y:a.y??0,z:a.z,h:a.height??22,R:a.radius??2.8,col:a.color??0,roofY:a.roofY??(a.y??0)+8,sq:0,lean:B*1.15,rate:1/t.range(12,17),n:a.count??60,nb:a.bursts??3,bs:a.burstS??0,hf:a.handful?1:0});X.sort((a,z)=>a.z-z.z);const Y=[],ht=[];let wt=0;if(X.forEach((a,z)=>{ht.push(Y.length);for(let k=0;k<a.n;k++)Y.push({a:[a.x,a.y,a.z,a.h],b:[z+t()*.999,a.col,0,a.roofY],c:[a.R,a.lean,a.sq,a.rate*t.range(.85,1.15)]});for(let k=0;k<(a.nb??3);k++){const F=wt++;for(let V=0,U=a.hf?14:11;V<U;V++)Y.push({a:[a.x,a.y,a.z,a.h],b:[F+t()*.999,a.col,1,a.roofY],c:[a.R*.7,a.bs||0,a.sq,a.hf||0]})}}),n.ranks&&n.ranks.length&&e.core){const a=e.core.makeRng(e.core.hashSeed("holi-rank-sprites:"+e.seed)),z=X.map((k,F)=>({z:k.z,items:Y.slice(ht[F],F+1<X.length?ht[F+1]:Y.length)}));n.ranks.forEach((k,F)=>{const V=k.y??0,U=k.height??22,pt=k.radius??2.8,it=k.color??0,kt=k.roofY??V+8,H=1/a.range(12,17),$=[];for(let K=0,$t=k.count??80;K<$t;K++)$.push({a:[k.x,V,k.z,U],b:[X.length+F+a()*.999,it,0,kt],c:[pt,B*1.15,0,H*a.range(.85,1.15)]});for(let K=0;K<11;K++)$.push({a:[k.x,V,k.z,U],b:[512+F+a()*.999,it,1,kt],c:[pt*.7,0,0,0]});z.push({z:k.z,items:$})}),z.sort((k,F)=>k.z-F.z),Y.length=0;for(const k of z)for(const F of k.items)Y.push(F)}const gt=X.filter(a=>a.sq),ct=gt.map(a=>({x:a.x,z:a.z,col:a.col,r0:a.R*.6+.8}));for(let a=0,z=0;a<2&&z<40&&j.length;z++){const k=t.pick(j),F=k.position.x*.84,V=k.position.z*.84;Math.abs(F)<8||ct.some(U=>Math.hypot(U.x-F,U.z-V)<11)||Math.hypot(F+26,V-10)<9||(ct.push({x:F,z:V,col:t.int(0,2),r0:.4}),a++)}const At=[];for(let a=0,z=Math.round(46*Math.max(.7,l));a<z;a++){const k=ct[a%ct.length],F=wt++,V=k.x+t.gauss()*2.6,U=k.z+t.gauss()*2.6,pt=t()<.7?k.col:t.int(0,2);for(let it=0;it<24;it++)At.push({a:[V,0,U,24],b:[F+t()*.999,pt,1,2.6],c:[.5,0,1,1]})}const jt=Math.round(900*l);for(let a=0;a<jt;a++)Y.push({a:[t.range(-62,62),t.range(0,32),t.range(-62,62),32],b:[t()*100,t.int(0,2),2,0],c:[0,0,0,0]});const Ht=Y.length;for(let a=0;a<At.length;a++)Y.push(At[a]);await e.yield?.();const _t=ie(v,Y);d.add(_t);const It=a=>{v.uErupt.value=a,_t.geometry.instanceCount=a>0?Y.length:Ht};await e.yield?.();const bt=[],Et=Math.round((n.crowd??750)*l);gt.slice(0,16).forEach((a,z)=>v.uFeet.value[z].set(a.x,a.z,a.col,a.R*2.3+3.2));const Yt=(a,z)=>Math.abs(a)<49&&z>-53&&z<49&&Math.hypot(a-W,z-_)>6.6;for(let a=0;bt.length<Et&&a<Et*30;a++){let z,k,F,V;const U=t();if(U<.7){const H=t.pick(ct),$=t()*6.283,K=H.r0+Math.abs(t.gauss())*2.5;z=H.x+Math.cos($)*K,k=H.z+Math.sin($)*K,F=Math.atan2(H.x-z,H.z-k)+t.range(-.5,.5),V=H.col}else if(U<.95){const H=t.pick(ct),$=t.pick(ct),K=t.range(.15,.85);z=H.x+($.x-H.x)*K+t.gauss()*1.3,k=H.z+($.z-H.z)*K+t.gauss()*1.3,F=Math.atan2($.x-H.x,$.z-H.z)+t.range(-.4,.4)+(t()<.5?Math.PI:0),V=t()<.5?H.col:$.col}else z=t.range(-48,48),k=t.range(-52,48),F=t()*6.283,V=t.int(0,2);if(!Yt(z,k))continue;const pt=t()<.72?[.8,.8,.78]:t.pick([q(u[1],1.1),ut(u[0],[1,1,1],.3),[.7,.55,.36]]),it=t(),kt=t()<.16;bt.push({x:z,y:0,z:k,ry:F,s:kt?t.range(.56,.74):t.range(.9,1.12),c:ut(pt,r.pow[t()<.75?V:t.int(0,2)],t.range(.2,.8)),pose:it<.36?1:it<.5?2:0,always:0})}const yt=[];for(const a of n.figures||[])yt.push({x:a.x,y:a.y??0,z:a.z,ry:a.ry??0,s:a.s??1,c:a.c||ut([.8,.8,.78],r.pow[(a.color??0)%3],.5),pose:a.pose??1,always:1});await e.yield?.();const mt=await Nt(v,bt);mt.castShadow=!0,mt.frustumCulled=!0,mt.computeBoundingSphere(),mt.boundingSphere.radius+=3,d.add(mt);let Mt=null;yt.length&&(Mt=await Nt(v,yt,!0),Mt.castShadow=!0,d.add(Mt)),await e.yield?.();const xt=[],St=t.sign();for(let a=0;a<26;a++)xt.push({o:[W,29+t.range(-2.5,4),_,t.range(6.5,12)],p:[St*t.range(.5,.75),t()*6.283,t.range(.4,1.4),t()<.25?t.int(0,2):-1]});for(let a=0;a<22;a++)xt.push({o:[t.range(-6,6),31+t.range(-1,5),-60+t.range(-3,3),t.range(11,24)],p:[-St*t.range(.28,.45),t()*6.283,t.range(.6,2.2),t()<.3?t.int(0,2):-1]});for(let a=0;a<20;a++)xt.push({o:[t.range(-10,10),40+.5*t.range(-5,8),t.range(-20,10),t.range(24,42)],p:[St*t.range(.16,.26),t()*6.283,t.range(1,3),t()<.6?t.int(0,2):-1]});d.add(ue(v,xt));const Ot=n.eruptFrom??.6,Qt=n.eruptTo??.76,Xt=n.partFrom??.8,Zt=n.partTo??.9;let zt=!!n.sunDir;const Pt=new w.Vector3,Wt=new w.Vector3;return{object:d,radius:50,extent:72,height:36,center:i(0,12,-16),ground:!0,groundY:-.5,uniforms:v,triangles:(m.count+p.count)/3+Y.length*2+(bt.length+yt.length)*40+xt.length*4,anchors:{portalSeat:{position:i(0,9,-60),facing:i(0,0,1),radius:7,tiltDeg:9},flyThrough:[i(0,33,90),i(0,27.3,54),i(0,21.6,18),i(0,15.9,-18),i(0,11.2,-46),i(0,9,-60)],gateCenter:i(0,9,-60),gateTop:i(0,24,-60),clockTower:i(W,34,_),clockDial:i(W,24.1,_+2.4),fortSightline:i(0,.25,-1).normalize(),viewpoints:[{name:"reveal",position:i(0,33,90),lookAt:i(0,13,-60)},{name:"descent",position:i(0,21.6,18),lookAt:i(0,10,-60)},{name:"finale",position:i(0,13.6,-31),lookAt:i(0,9,-60)}],plumeFeet:X.map(a=>({position:i(a.x,a.y,a.z),color:a.col,height:a.h,radius:a.R,square:!!a.sq})),kiosks:E.kiosks.map(a=>i(a[0],a[1],a[2])),stalls:j,masts:ot.map(a=>i(a[0],a[1],a[2])),tintClouds:[{center:i(0,27,52),radius:20,color:J},{center:i(0,22.5,24),radius:20,color:tt},{center:i(0,18,-4),radius:20,color:at}],windDir:i(b[0],0,b[1])},setProgress(a){It(Tt(Ot,Qt,a)),v.uPart.value=Tt(Xt,Zt,a)},setParting(a){v.uPart.value=Math.min(1,Math.max(0,a))},setEruption(a){It(Math.min(1,Math.max(0,a)))},setCrowd(a){v.uCrowd.value=Math.min(1,Math.max(0,a)),mt.visible=a>.002||!Mt},update(a,z){if(v.uTime.value=z,!zt&&d.parent){let k=d;for(;k.parent;)k=k.parent;k.traverse(F=>{zt||!F.isDirectionalLight||(F.getWorldPosition(Pt),F.target.getWorldPosition(Wt),Pt.sub(Wt),Pt.lengthSq()>1e-6&&v.uSun.value.copy(Pt.normalize()),zt=!0)}),zt=!0}},dispose(){}}}export{ce as buildHero,te as makeClothMaterial};
