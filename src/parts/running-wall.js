import*as p from"three";import{mergeVertices as Je}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as le,lerp as I,smoothstep as e0}from"../kit/core.js";const t0=["#E9DFC8","#F7F2E6","#BBA988","#2B2623","#D29B3E","#A8432A"],ee=Math.PI*2,S=(i,e,a)=>e0(i,e,a);async function a0(i,e){const s=new Uint8Array(262144),c=z=>{const x=new Float32Array(z*z);for(let w=0;w<x.length;w++)x[w]=i();return x},m=z=>z.map(([x,w,b])=>({L:x,amp:w,ridged:b,a:c(x)})),y=(z,x,w)=>{const b=z.L,k=x/256*b,P=w/256*b,E=Math.floor(k),D=Math.floor(P);let F=k-E,C=P-D;F=F*F*(3-2*F),C=C*C*(3-2*C);const $=(E+1)%b,N=(D+1)%b,L=z.a,H=I(I(L[D*b+E],L[D*b+$],F),I(L[N*b+E],L[N*b+$],F),C);return z.ridged?1-Math.abs(2*H-1):H},l=(z,x,w)=>{let b=0,k=0;for(const P of z)b+=y(P,x,w)*P.amp,k+=P.amp;return b/k},v=m([[8,.7,0],[16,.8,1],[32,1,0],[64,.9,1],[128,.55,0]]),d=m([[8,1,0],[32,.5,0]]),r=m([[8,1,0],[32,.5,0]]),n=m([[4,1,0],[8,.7,0],[16,.45,0],[64,.2,0]]),h=m([[8,1,0],[16,.8,1],[32,.5,0]]);for(let z=0,x=0;z<256;z++){for(let w=0;w<256;w++,x+=4){const b=w+(l(d,w,z)-.5)*34+256,k=z+(l(r,w,z)-.5)*34+256;s[x]=le((l(v,b%256,k%256)-.5)*2.1+.5,0,1)*255,s[x+1]=le((l(n,w,z)-.5)*2+.5,0,1)*255,s[x+2]=le((l(h,w,z)-.5)*1.9+.5,0,1)*255,s[x+3]=i()*255}(z&15)===15&&await e?.yield?.()}const f=new p.DataTexture(s,256,256,p.RGBAFormat,p.UnsignedByteType);return f.wrapS=f.wrapT=p.RepeatWrapping,f.magFilter=p.LinearFilter,f.minFilter=p.LinearMipmapLinearFilter,f.generateMipmaps=!0,f.anisotropy=4,f.needsUpdate=!0,f}const ye=`
uniform sampler2D uGrain;
uniform vec3 uRock, uPale, uChar, uOchre, uRed, uSun, uTorchCol, uDark, uShade;
uniform vec4 uTorch, uMouth, uHearth;
uniform float uTime, uFade, uSnow, uTorchR, uTorchBack, uEngr, uGlim;
vec4 rwGrain2(vec2 p){
  vec4 a = texture2D(uGrain, p * 0.55), b = texture2D(uGrain, p * 0.093 + vec2(0.37, 0.11));
  return vec4(a.r * 0.62 + b.r * 0.38, b.g * 0.65 + a.g * 0.35, a.b, a.a);
}
vec3 rwRock(float h, float blot){
  vec3 c = mix(uRock * 0.5, mix(uRock, uPale, 0.45) * 0.76, smoothstep(0.2, 0.9, h)) * (0.9 + 0.16 * blot);
  c *= vec3(1.04, 0.965, 0.84);
  return mix(c, vec3(0.86, 0.87, 0.85), uSnow * smoothstep(0.5, 0.25, h));
}
float rwDab(float amt, float h, float soft){
  return smoothstep(0.5 - soft, 0.5 + soft, amt * 0.95 + (h - 0.5) * 1.1);
}
float rwRake(float h, float hSun){ return clamp((h - hSun) * 2.6, -0.34, 0.3); }
vec3 rwCave(vec3 col, vec3 wp, float cave){
  vec3 dt = wp - uTorch.xyz;
  dt.z *= mix(1.0, uTorchBack, step(0.0, dt.z));
  float tl = uTorch.w * exp(-dot(dt, dt) / max(uTorchR, 1.0));
  float ml = exp(-distance(wp, uMouth.xyz) / max(uMouth.w, 1.0));
  // two ember beds (the world's hearths: uHearth xyz, strength; the second is mirrored across the axis)
  vec3 h1 = wp - uHearth.xyz, h2 = wp - vec3(0.5 - uHearth.x, uHearth.y, uHearth.z - 3.0);
  float hl = uHearth.w * (exp(-dot(h1, h1) / 70.0) + exp(-dot(h2, h2) / 70.0));   // an ember bed lights some 8 m round it, no more
  tl += hl;
  float L = tl + ml;
  vec3 lit = col * (uTorchCol * tl + vec3(1.0, 0.96, 0.88) * ml) / max(L, 1e-3);
  vec3 c = mix(uDark * (0.3 + 1.7 * dot(col, vec3(0.3333))), lit, smoothstep(0.05, 0.9, L));
  return mix(col, c, clamp(cave, 0.0, 1.0));
}
vec3 rwSpark(vec4 g, vec3 wp){
  vec3 vd = wp - cameraPosition;
  float tw = max(sin(dot(vd, vec3(3.1, 2.3, 2.7)) + g.a * 160.0 + uTime * 1.3), 0.0);
  tw *= tw; tw *= tw; tw *= tw;
  return uPale * (smoothstep(0.955, 1.0, g.a) * tw * 3.2);
}
float rwSeg(vec2 p, vec2 a, vec2 b, float r){
  vec2 pa = p - a, ba = b - a;
  float t = clamp(dot(pa, ba) / max(dot(ba, ba), 1e-5), 0.0, 1.0);
  return length(pa - ba * t) - r;
}
float rwHand(vec2 p){
  float d = length(max(abs(p - vec2(0.0, -0.18)) - vec2(0.15, 0.17), 0.0)) - 0.07;
  d = min(d, rwSeg(p, vec2(-0.15, 0.04), vec2(-0.25, 0.36), 0.048));
  d = min(d, rwSeg(p, vec2(-0.05, 0.07), vec2(-0.08, 0.50), 0.052));
  d = min(d, rwSeg(p, vec2(0.05, 0.07), vec2(0.07, 0.53), 0.052));
  d = min(d, rwSeg(p, vec2(0.15, 0.04), vec2(0.22, 0.44), 0.048));
  d = min(d, rwSeg(p, vec2(0.18, -0.20), vec2(0.40, 0.02), 0.055));
  d = min(d, rwSeg(p, vec2(-0.08, -0.36), vec2(0.08, -0.36), 0.12));
  return d;
}
`;function o0(i,e){const a=s=>new p.Color(s);return{uGrain:{value:e},uRock:{value:a(i[0])},uPale:{value:a(i[1])},uTan:{value:a(i[2])},uChar:{value:a(i[3])},uOchre:{value:a(i[4])},uRed:{value:a(i[5])},uSun:{value:new p.Vector3(-.55,.62,.56).normalize()},uTorch:{value:new p.Vector4(0,-100,0,0)},uTorchCol:{value:new p.Color(1.5,.95,.5)},uMouth:{value:new p.Vector4(0,0,0,22)},uHearth:{value:new p.Vector4(0,-1e3,0,0)},uTime:{value:0},uFade:{value:1500},uSnow:{value:0},uTorchR:{value:70},uTorchBack:{value:1},uEngr:{value:0},uGlim:{value:1},uShLen:{value:1},uDark:{value:a(i[3]).multiplyScalar(1.15)},uShade:{value:a(i[3]).multiplyScalar(2.5)}}}class Fe{constructor(){this.p=[],this.n=[],this.c=[],this.s=[],this.idx=[],this.gidx=[],this.nv=0}vert(e,a,s,c,m,y,l,v,d,r,n,h){return this.p.push(e,a,s),this.n.push(c,m,y),this.c.push(l[0],l[1],l[2],v),this.s.push(d,r,n,h),this.nv++}tri(e,a,s,c){this.idx.push(e,a,s),c&&this.gidx.push(e,a,s)}tube(e,a={}){const s=a.sides||8,c=e.length,m=a.z||0,y=a.bone||0,l=a.part||0,v=!!a.ghost,d=[];for(let r=0;r<c;r++){const n=e[Math.max(r-1,0)],h=e[Math.min(r+1,c-1)],f=e[r];let z=h[0]-n[0],x=h[1]-n[1];const w=Math.hypot(z,x)||1;z/=w,x/=w;const b=-x,k=z,P=Math.max(f[2],.001),E=Math.max(f[3],.001),D=[],F=r/(c-1),C=m+(a.zBow?a.zBow(F):0);for(let $=0;$<s;$++){const N=$/s*ee,L=Math.cos(N),H=Math.sin(N);let _=b*L/P,A=k*L/P,Q=H/E;const X=Math.hypot(_,A,Q);_/=X,A/=X,Q/=X;const ae=a.paint?a.paint(F,L,f,r):[0,0,0],oe=a.param?a.param(F,f,r):0,B=a.flat?0:P*(1-Math.abs(L))+(a.edgeBias||0);D.push(this.vert(f[0]+b*P*L,f[1]+k*P*L,C+E*H,_,A,Q,ae,B,y,oe,a.leg?P*L:0,l))}d.push(D)}for(let r=0;r<c-1;r++)for(let n=0;n<s;n++){const h=d[r][n],f=d[r][(n+1)%s],z=d[r+1][n],x=d[r+1][(n+1)%s];this.tri(h,z,f,v),this.tri(f,z,x,v)}for(const[r,n]of[[0,!1],[c-1,!0]]){if(r===0&&a.openStart||r>0&&a.openEnd)continue;const h=e[r],f=r/(c-1),z=a.paint?a.paint(f,0,h,r):[0,0,0],x=this.vert(h[0],h[1],m+(a.zBow?a.zBow(f):0),n?1:-1,0,0,z,a.flat?0:h[2],y,a.param?a.param(f,h,r):0,0,l);for(let w=0;w<s;w++){const b=d[r][w],k=d[r][(w+1)%s];n?this.tri(b,x,k,v):this.tri(b,k,x,v)}}}sheet(e,a,s={}){const c=s.paint||[0,1,0],m=s.bone||0,y=s.part||0,l=s.zf||(()=>s.z||0),v=!!s.ghost,d=s.param||(()=>0);for(const r of[1,-1]){const n=this.vert(e[0],e[1],l(e[0],e[1]),0,0,r,c,s.edge??.06,m,d(e[0],e[1]),0,y),h=[];for(const f of a)h.push(this.vert(f[0],f[1],l(f[0],f[1]),0,0,r,c,0,m,d(f[0],f[1]),0,y));for(let f=0;f<h.length-1;f++)r>0?this.tri(n,h[f],h[f+1],v):this.tri(n,h[f+1],h[f],v)}}build(){const e=a=>{const s=new p.BufferGeometry;return s.setAttribute("position",this._pos),s.setAttribute("normal",this._nrm),s.setAttribute("aPaint",this._col),s.setAttribute("aSkin",this._skin),s.setIndex(a),s};return this._pos=new p.Float32BufferAttribute(this.p,3),this._nrm=new p.Float32BufferAttribute(this.n,3),this._col=new p.Float32BufferAttribute(this.c,4),this._skin=new p.Float32BufferAttribute(this.s,4),{body:e(this.idx),ghost:e(this.gidx),tris:this.idx.length/3,ghostTris:this.gidx.length/3}}}function r0(i,e=1){const a=[];for(let s=0;s<i.length;s++){const c=i[Math.max(s-1,0)],m=i[Math.min(s+1,i.length-1)],y=i[s];let l=m[0]-c[0],v=m[1]-c[1];const d=Math.hypot(l,v)||1;l/=d,v/=d,a.push({x:y[0]-v*y[2]*e,y:y[1]+l*y[2]*e,px:-v*e,py:l*e})}return a}function te(i,e,a,s,c,m,y,l,v,d,r){const n=c+m+y,h=v,f=[[.14,(d?.2:.15)*h,.1*h],[.32,(d?.155:.12)*h,.085*h],[c,.07*h,.06*h],[c+m*.5,.047*h,.042*h],[c+m,.058*h,.05*h],[c+m+y*.55,.05*h,.045*h],[n,.07*h,.06*h]].map(([z,x,w])=>[a,s-z,x,w]);i.tube(f,{sides:6,z:l,bone:e,part:1,leg:!0,ghost:!0,openStart:!0,param:(z,x)=>s-x[1],paint:(z,x,w)=>{const b=s-w[1],k=S(c*.72,c*1.12,b);return[Math.max(r?.2:.62*(1-k),0),Math.max(k,r),0]}})}function Ge(i,e,a,s,c,m){const y=[];for(let l=0;l<=6;l++)y.push([e+Math.cos(l/6*ee)*c,a+Math.sin(l/6*ee)*c*.7]);for(const l of[1,-1])i.sheet([e,a],y,{z:l*s,paint:[0,1,0],bone:1,param:()=>m,edge:0})}function n0(i,e,a,s,c,m,y,l){const v=r0(e,1);for(let d=a;d<s;d++){const r=v[d],n=v[d+1],h=3,f=[[r.x-r.px*.03,r.y-r.py*.03],[n.x-n.px*.03,n.y-n.py*.03]];for(let x=h;x>=0;x--){const w=x/h,b=c*(.75+.5*m())*(x%2?1:.72);f.push([I(r.x,n.x,w)+I(r.px,n.px,w)*b,I(r.y,n.y,w)+I(r.py,n.py,w)*b])}f.push(f[0]);const z=I(y,l,(d-a+.5)/(s-a));i.sheet([(r.x+n.x)/2,(r.y+n.y)/2],f,{paint:[0,1,0],bone:1,param:()=>z,edge:0})}}function i0(i){const e=new Fe,a=r=>r*(.94+.12*i()),s=a(.37),c=a(1),m=[[-1.03,1.2,.05,.04],[-.96,1.18,.2,.16],[-.76,1.14,.33,.27],[-.45,1.1,.36,.3],[-.1,1.07,s,.31],[.25,1.08,.38,.3],[.5,1.12,.38,.27],[.7,1.13,.3,.2],[.83,1.15,.14,.1]].map(r=>[r[0],r[1],r[2],r[3]*c]);e.tube(m,{sides:8,bone:0,paint:(r,n)=>[.6+.5*n-.12*S(.3,.6,r)*S(.75,.45,r),.3*S(.5,1,n),0]});const y=[[.45,1.2,.3,.17],[.72,1.42,.22,.13],[.94,1.61,.17,.105],[1.07,1.68,.15,.1],[1.21,1.57,.14,.09],[1.35,1.42,.108,.075],[1.45,1.31,.086,.062],[1.49,1.265,.058,.045]];e.tube(y,{sides:8,bone:1,ghost:!0,param:r=>S(0,.6,r),paint:(r,n)=>[.7+.35*n,.92*S(.74,.96,r),0]}),n0(e,y,0,3,.15,i,.15,.8);for(const r of[1,-1])e.sheet([1.03,1.8],[[.98,1.76],[1.09,1.77],[1.03+.02*r,1.95],[.98,1.76]],{z:r*.06,paint:[0,1,0],bone:1,ghost:!0,param:()=>1,edge:0});Ge(e,1.15,1.6,.092,.026,1),e.tube([[-.98,1.27,.07,.04],[-1.22,1.24,.085,.045],[-1.5,1.12,.1,.04],[-1.75,.93,.085,.03],[-1.9,.72,.03,.015]],{sides:6,bone:2,flat:!0,param:r=>r,paint:()=>[0,1,0]});const l=[.5,1.05,.5,.46],v=[-.7,1.08,.52,.47],d=.21;return te(e,3,l[0],l[1],l[2],l[3],d,.14,1.14,!1,0),te(e,4,l[0],l[1],l[2],l[3],d,-.14,1.14,!1,0),te(e,5,v[0],v[1],v[2],v[3],d-.01,.15,1.14,!0,0),te(e,6,v[0],v[1],v[2],v[3],d-.01,-.15,1.14,!0,0),{...e.build(),fore:l,hind:v,L3:d,gait:[1.38,.46,.055,.05],neck:[.5,1.25,.11,1.05],height:1.85,len:2.5,stride:8.4}}function l0(i){const e=new Fe,a=[[-1.43,1.42,.05,.04],[-1.36,1.38,.22,.17],[-1.1,1.3,.38,.3],[-.6,1.22,.42,.34],[-.1,1.18,.46,.37],[.4,1.22,.52,.38],[.75,1.3,.52,.34],[1,1.25,.4,.25],[1.15,1.22,.18,.12]];e.tube(a,{sides:8,bone:0,paint:(l,v)=>[.25,.78-.5*S(.8,1,v),0]});const s=[[.75,1.35,.42,.22],[1.1,1.42,.32,.17],[1.4,1.4,.24,.14],[1.62,1.28,.19,.12],[1.82,1.1,.14,.1],[1.93,.98,.1,.08],[1.97,.93,.05,.04]];e.tube(s,{sides:8,bone:1,ghost:!0,param:l=>S(0,.6,l),paint:l=>[.2,.85-.75*S(.8,.95,l),0]});for(const l of[1,-1]){const v=[[1.42,1.56,.06,.05],[1.52,1.76,.055,.045],[1.72,1.92,.045,.04],[1.93,1.95,.03,.028],[2.06,2.1,.01,.01]];e.tube(v,{sides:5,bone:1,ghost:!0,param:()=>.7,zBow:d=>l*(.1+.26*Math.sin(Math.PI*d*.85)),paint:d=>[.12,S(.55,.95,d),0],edgeBias:-.012}),e.sheet([1.36,1.5],[[1.42,1.5],[1.3,1.44],[1.22,1.56],[1.42,1.5]],{z:l*.14,paint:[0,1,0],bone:1,ghost:!0,param:()=>.7,edge:0})}Ge(e,1.6,1.36,.118,.03,.8),e.tube([[-1.38,1.5,.05,.035],[-1.58,1.42,.04,.03],[-1.76,1.1,.035,.025],[-1.86,.78,.06,.03],[-1.9,.56,.02,.015]],{sides:5,bone:2,flat:!0,param:l=>l,paint:()=>[0,1,0]});const c=[.72,1.2,.58,.5],m=[-1,1.22,.6,.5],y=.24;return te(e,3,c[0],c[1],c[2],c[3],y,.17,1.2,!1,.8),te(e,4,c[0],c[1],c[2],c[3],y,-.17,1.2,!1,.8),te(e,5,m[0],m[1],m[2],m[3],y,.18,1.2,!0,.8),te(e,6,m[0],m[1],m[2],m[3],y,-.18,1.2,!0,.8),{...e.build(),fore:c,hind:m,L3:y,gait:[1.6,.5,.05,.045],neck:[.8,1.38,.09,1.2],height:2.1,len:3.4,stride:8.4}}function s0(i){const e=new Fe,a=[[-1.26,1.45,.05,.04],[-1.19,1.42,.2,.15],[-.95,1.38,.34,.26],[-.5,1.34,.36,.28],[0,1.32,.38,.29],[.45,1.4,.46,.3],[.72,1.5,.5,.28],[.95,1.42,.34,.2],[1.08,1.4,.15,.1]];e.tube(a,{sides:8,bone:0,paint:(l,v)=>[.42+.3*v,.5*S(.45,.8,l)*S(.3,1,v),0]});const s=[[.72,1.55,.36,.18],[1,1.85,.22,.13],[1.2,2.12,.16,.11],[1.3,2.25,.14,.1],[1.48,2.2,.12,.085],[1.65,2.1,.09,.07],[1.76,2.03,.05,.045]];e.tube(s,{sides:8,bone:1,ghost:!0,param:l=>S(0,.6,l),paint:(l,v)=>[.5+.25*v,.85*S(.72,.98,l)+.45*S(.3,0,l),0]}),Ge(e,1.42,2.25,.097,.028,1);for(const l of[1,-1]){e.sheet([1.33,2.4],[[1.3,2.34],[1.42,2.36],[1.4+.03*l,2.55],[1.3,2.34]],{z:l*.08,paint:[0,1,0],bone:1,ghost:!0,param:()=>1,edge:0});const d={zf:(z,x)=>l*(.07+.5*Math.hypot(z-1.28,x-2.34)),paint:[.5,.12,0],bone:1,part:2,param:()=>1,edge:.16},r={...d,edge:.05};e.sheet([1.15,2.56],[[1.25,2.32],[1.34,2.36],[1.12,2.8],[.98,2.74],[1.25,2.32]],r),e.sheet([1.36,2.5],[[1.24,2.4],[1.3,2.36],[1.58,2.66],[1.24,2.4]],r);const n=[.72,3],h=()=>(i()-.5)*.09,f=[[1.1,2.72],[1.14+h(),3.3+h()],[.96,3.1],[.86+h(),3.52+h()],[.72,3.2],[.52+h(),3.54+h()],[.48,3.2],[.2+h(),3.44+h()],[.3,3.1],[-.06+h(),3.2+h()],[.2,2.96],[-.02+h(),2.84+h()],[.42,2.8],[.8,2.74],[1.1,2.72]];e.sheet(n,f,d)}e.tube([[-1.2,1.55,.06,.04],[-1.34,1.5,.06,.035],[-1.44,1.38,.02,.015]],{sides:5,bone:2,flat:!0,param:l=>l,paint:()=>[0,1,0]});const c=[.68,1.38,.64,.58],m=[-.9,1.4,.66,.58],y=.25;return te(e,3,c[0],c[1],c[2],c[3],y,.14,.95,!1,0),te(e,4,c[0],c[1],c[2],c[3],y,-.14,.95,!1,0),te(e,5,m[0],m[1],m[2],m[3],y,.15,.95,!0,0),te(e,6,m[0],m[1],m[2],m[3],y,-.15,.95,!0,0),{...e.build(),fore:c,hind:m,L3:y,gait:[1.72,.6,.085,.06],neck:[.8,1.6,.07,1.35],height:2.4,len:3,stride:9.2}}const Ne=`
uniform sampler2D uTrack;
uniform float uTrackN, uRows, uClosed;
vec4 rwTrk(float i, float row){ return texelFetch(uTrack, ivec2(int(i + 0.5), int(row + 0.5)), 0); }
void rwTrack(float t, float row, out vec4 P, out vec3 T, out vec4 aux, out float met){
  float tt = uClosed > 0.5 ? fract(t) : clamp(t, 0.0, 1.0);
  float f = tt * uTrackN, i0 = min(floor(f), uTrackN - 1.0), fr = f - i0;
  vec4 a = rwTrk(i0, row), b = rwTrk(i0 + 1.0, row);
  vec4 pm = rwTrk(uClosed > 0.5 ? mod(i0 - 1.0 + uTrackN, uTrackN) : max(i0 - 1.0, 0.0), row);
  vec4 pn = rwTrk(uClosed > 0.5 ? mod(i0 + 2.0, uTrackN) : min(i0 + 2.0, uTrackN), row);
  P = mix(a, b, fr);
  T = mix(b.xyz - pm.xyz, pn.xyz - a.xyz, fr);
  aux = mix(rwTrk(i0, row + uRows), rwTrk(i0 + 1.0, row + uRows), fr);
  met = max((b.w - a.w) * uTrackN, 1e-3);
}
`,c0=`
${Ne}
uniform vec3 uSun;
uniform vec4 uFore, uHind, uGaitP, uNeck, uGaitOff, uTail;
uniform float uL3;
attribute vec4 aPaint, aSkin, iA, iB, iC;
attribute float iT;
varying vec3 vW, vN;
varying vec4 vPaint, vAux, vInst;
varying vec2 vUV, vWallUV, vSun2;
varying float vRed;
#include <fog_pars_vertex>
vec2 rwRot(vec2 v, float a){ float c = cos(a), s = sin(a); return vec2(v.x * c - v.y * s, v.x * s + v.y * c); }
void main(){
  float row = iA.x, g = iB.x;
  vec4 Pc, auxc; vec3 Tc; float met;
  rwTrack(iT, row, Pc, Tc, auxc, met);
  float sc0 = mix(iA.z, iA.y, auxc.x);
  float lag = g * 0.42 * sc0;
  float t0 = iT - lag / met;
  float gait = (Pc.w - lag) / max(iA.w, 0.5) + iC.x - g * 0.08;
  float cyc = gait * 6.2831853;
  float bob = uGaitP.z * cos(cyc - 5.4), pit = uGaitP.w * cos(cyc - 0.94);
  vec2 C = vec2(0.0, uNeck.w);
  float bone = aSkin.x;
  vec2 p = position.xy, n2 = normal.xy;
  if (bone < 2.5) {
    float ang = pit;
    if (bone > 1.5) {
      float t = aSkin.y;
      p.y += t * t * (uTail.x + uTail.y * sin(cyc * 2.0 - t * 3.0));
      p.x += t * t * uTail.w * sin(cyc - t * 2.0) - t * uTail.z;
    } else if (bone > 0.5) {
      float nod = -uNeck.z * cos(cyc - 2.2) * aSkin.y;
      p = uNeck.xy + rwRot(p - uNeck.xy, nod); ang += nod;
    }
    p = C + rwRot(p - C, pit) + vec2(0.0, bob);
    n2 = rwRot(n2, ang);
  } else {
    float li = bone - 3.0;
    bool hindL = li > 1.5;
    vec4 G = hindL ? uHind : uFore;
    float off = li < 0.5 ? uGaitOff.x : (li < 1.5 ? uGaitOff.y : (li < 2.5 ? uGaitOff.z : uGaitOff.w));
    float ph = fract(gait + off);
    float Ls = uGaitP.x, duty = clamp(Ls * sc0 / max(iA.w, 0.5), 0.08, 0.6);
    vec2 Ft; float flex = 0.0;
    if (ph < duty) { Ft = vec2(Ls * (0.5 - ph / duty), 0.0); }
    else {
      float q = (ph - duty) / (1.0 - duty), e = q * q * (3.0 - 2.0 * q), sq = sin(q * 3.14159265);
      Ft = vec2(Ls * (-0.5 + e) - 0.2 * Ls * sq * (1.0 - q), uGaitP.y * (hindL ? 0.8 : 1.0) * sq);
      flex = 1.25 * sin(3.14159265 * min(q * 1.5, 1.0));
    }
    Ft.x += G.x + (hindL ? 0.10 : 0.04);
    vec2 H = C + rwRot(G.xy - C, pit) + vec2(0.0, bob);
    float La = G.z, Lb = G.w + uL3;
    vec2 d = Ft - H; float dl = max(length(d), 1e-3); vec2 dn = d / dl;
    float st = clamp(dl / (La + Lb), 1.0, 1.16);
    float la = La * st, lb = Lb * st;
    float dc = clamp(dl, abs(la - lb) + 0.02, (la + lb) * 0.999);
    float a = (la * la - lb * lb + dc * dc) / (2.0 * dc), hh = sqrt(max(la * la - a * a, 0.0));
    vec2 K = H + dn * a + vec2(-dn.y, dn.x) * hh * (hindL ? -1.0 : 1.0);
    vec2 E = H + dn * dc;
    vec2 d1 = (K - H) / la, d2 = (E - K) / lb;
    float l = aSkin.y * st, lf = la + G.w * st;
    vec2 q2 = l < la ? H + d1 * l : K + d2 * (l - la);
    vec2 dir = normalize(mix(d1, d2, smoothstep(la - 0.1, la + 0.1, l)) + vec2(0.0, -1e-4));
    if (l > lf) {
      float fa = -flex * smoothstep(lf, lf + 0.06, l);
      dir = rwRot(d2, fa);
      q2 = K + d2 * (lf - la) + dir * (l - lf);
    }
    vec2 pp = vec2(-dir.y, dir.x);
    p = q2 + pp * aSkin.z;
    n2 = pp * normal.x - dir * normal.y;
  }
  vec4 Pv, aux; vec3 Tv; float m2;
  rwTrack(t0 + p.x * sc0 / met, row, Pv, Tv, aux, m2);
  float rel = aux.x;
  float sc = mix(iA.z, iA.y, rel);
  float thick = mix(0.03, 0.34, rel) * (g > 0.5 ? 0.5 : 1.0);
  vec3 Th = normalize(vec3(Tv.x, 0.0, Tv.z) + vec3(1e-5, 0.0, 0.0));
  vec3 Tn = normalize(Tv + vec3(1e-5, 0.0, 0.0));
  vec3 side = vec3(-Th.z, 0.0, Th.x);
  vec3 lp = Pv.xyz + vec3(0.0, p.y * sc, 0.0) + side * (position.z * sc * thick + iC.z * (1.0 - rel));
  vec3 ln = Tn * n2.x + vec3(0.0, n2.y, 0.0) + side * (normal.z * min(thick * 3.0, 1.0) + 1e-4);
  vec4 wp = modelMatrix * vec4(lp, 1.0);
  vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * ln);
  vPaint = aPaint; vAux = aux; vInst = vec4(g, iB.y, iB.z, iC.y);
  vUV = position.xy * iA.y + vec2(iC.y * 17.0, iC.y * 9.0);
  vWallUV = vec2(Pv.w, lp.y);
  vSun2 = vec2(dot(uSun, Tn), uSun.y);
  vRed = iC.w;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  if (aSkin.w > 1.5 && iB.w < 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  #include <fog_vertex>
}
`,u0=`
${ye}
varying vec3 vW, vN;
varying vec4 vPaint, vAux, vInst;
varying vec2 vUV, vWallUV, vSun2;
varying float vRed;
#include <fog_pars_fragment>
void main(){
  float rel = vAux.x, g = vInst.x;
  // every lookup and derivative comes before the first discard
  vec4 gr = mix(rwGrain2(vWallUV), rwGrain2(vUV), rel);
  float fr = floor(uTime * 8.0);
  float wob = texture2D(uGrain, vUV * 0.19 + vec2(fract(fr * 0.3713), fract(fr * 0.7391))).b;
  float hs = rwGrain2(mix(vWallUV, vUV, step(0.5, rel)) + vSun2 * 0.02).r;
  float hatchT = texture2D(uGrain, vec2(vUV.x * 0.13 + vUV.y * 0.9, vUV.y * 0.05 - vUV.x * 0.02)).b;
  float fw = max(fwidth(vPaint.w), 1e-4);
  float h = gr.r, pres = vAux.z;
  if (pres < 0.02 || (pres < 0.99 && gr.g * 0.75 + h * 0.25 > pres)) discard;
  // the charcoal contour, redrawn eight times a second: only its position changes
  float lw = max(0.036 + 0.034 * (wob - 0.5), 1.6 * fw);
  float line = 1.0 - smoothstep(lw - fw * 0.7, lw + fw * 0.7, vPaint.w);
  vec3 n = normalize(vN + vec3(0.0, 1e-4, 0.0));
  vec3 rock = rwRock(h, gr.g), col = rock;
  vec3 lineCol = mix(uChar, uRed * 0.8, vRed);
  float dist = distance(vW, cameraPosition);
  lineCol *= 1.0 - 0.2 * uEngr * smoothstep(9.0, 22.0, dist);   // engraved: the nearest animal carries the brightest line, the ones behind it are scraped fainter
  float covered = 0.0;
  if (g > 0.5) {
    float keep = max(line, vPaint.y * 0.85 * (1.0 - 0.8 * uEngr)) * (0.86 - 0.12 * g) * (1.0 - 0.45 * uEngr);
    if (rwDab(keep, h, 0.05) < 0.5) discard;
    col = mix(col, lineCol, 0.88); covered = 1.0;
  } else {
    float och = vPaint.x * vInst.y;
    col = mix(col, uOchre * (0.6 + 0.32 * h), rwDab(och + (gr.g - 0.5) * 0.25, h, 0.14) * 0.9);
    float sh = smoothstep(0.3, -0.6, dot(n, uSun)) * rel;
    col = mix(col, uShade, rwDab(sh * 0.82 + (gr.b - 0.5) * 0.3, h, 0.22) * 0.6);
    float fill = max(vPaint.y, vInst.z * (0.62 + 0.3 * gr.g + 0.25 * step(0.8, vInst.z) * (1.0 - uEngr)));   // a black animal is laid on solid: no rock flecks through the stallion at arm's length
    // engraved (night): a filled animal is one unbroken body of dark clay (no dry-brush breaks, no hatching inside it) with
    // its mane, tail and muzzle scraped pale like the contour; the washed animals keep their hatching
    float solid = uEngr * smoothstep(0.4, 0.6, vInst.z);
    float cc = max(mix(rwDab(fill, h, 0.1), smoothstep(0.3, 0.4, fill), solid), rwDab(line, h, 0.12));
    vec3 fillCol = mix(uChar, mix(uRock * 0.42, lineCol * 0.92, smoothstep(0.86, 0.97, vPaint.y)), uEngr);
    float hatch = smoothstep(0.77, 0.83, hatchT) * uEngr * smoothstep(0.05, 0.12, vPaint.w) * (1.0 - solid);
    col = mix(col, mix(fillCol, lineCol, step(fill, line)), cc * 0.95); covered = cc;
    col = mix(col, lineCol, rwDab(hatch * 0.8, h, 0.1) * 0.6);
  }
  col *= 1.0 + rwRake(h, hs) * 0.85;
  col += rwSpark(gr, vW) * 0.4 * (1.0 - covered);
  col = mix(rock, col, mix(1.0, 0.35, smoothstep(0.0, uFade, dist)));
  col = rwCave(col, vW, vAux.y * uGlim);   // uGlim < 1: the pigment glimmers a little beyond the torch pool
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}
`,h0=`
attribute vec4 aRock;
varying vec3 vW, vN, vL;
varying vec4 vRock;
#include <fog_pars_vertex>
void main(){
  vL = position; vRock = aRock;
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal + vec3(0.0, 1e-5, 0.0));
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,f0=`
${ye}
uniform vec4 uRing;
varying vec3 vW, vN, vL;
varying vec4 vRock;
#include <fog_pars_fragment>
float rwHash(vec2 p){ p = fract(p * vec2(0.1031, 0.1030)); p += dot(p, p.yx + 33.33); return fract((p.x + p.y) * p.x); }
vec4 rwTri(vec3 p, vec3 w){ return rwGrain2(p.zy) * w.x + rwGrain2(p.xz) * w.y + rwGrain2(p.xy) * w.z; }
void main(){
  vec3 n = normalize(vN + vec3(0.0, 1e-4, 0.0));
  vec3 w = abs(n); w *= w; w /= (w.x + w.y + w.z + 1e-4);
  vec4 gr = rwTri(vL, w);
  float h = gr.r, hs = rwTri(vL + uSun * 0.022, w).r;
  vec2 wu = vec2(vRock.w, vL.y);
  // every lookup happens before any branch
  float bed = texture2D(uGrain, vec2(vL.y * 0.13 + gr.g * 0.1, 0.31 + vRock.w * 0.004)).b;
  float zone = texture2D(uGrain, wu * 0.021 + 0.5).g;
  float zone2 = texture2D(uGrain, wu * 0.017 + vec2(0.13, 0.71)).g;
  float wipe = texture2D(uGrain, vec2(wu.x * 0.31, wu.y * 0.035) + 0.2).b;
  float field = texture2D(uGrain, vL.xz * 0.011).g;
  float gate = texture2D(uGrain, vec2(wu.x * 0.043, wu.y * 0.37) + 0.6).b;
  vec3 col = rwRock(h, gr.g);
  float fz = vRock.x, gz = vRock.z;
  // ochre staining along the beds
  col = mix(col, uOchre * 0.85, rwDab(bed * 0.75 * (1.0 - gz), h, 0.22) * 0.3);
  // drawn shade: a charcoal smudge on faces turned from the sun, and under the overhang
  float sh = max(smoothstep(0.12, -0.6, dot(n, uSun)), vRock.y * 0.75) * (1.0 - gz);
  col = mix(col, uShade, rwDab(sh * 0.8 + (gr.b - 0.5) * 0.35, h, 0.25) * 0.52);
  // bedding: wavering charcoal lines along the strata, each with a little shade beneath it
  float by = vL.y / 1.3 + (zone - 0.5) * 1.7 + vRock.w * 0.012;
  float bl = abs(fract(by) - 0.5), rockOnly = (1.0 - gz) * (1.0 - fz) * step(0.5, vRock.w);
  float crack = (1.0 - smoothstep(0.02, 0.07, bl)) * smoothstep(0.38, 0.6, gate) * rockOnly;
  col = mix(col, uChar * 1.5, rwDab(crack * 0.9, h, 0.14) * 0.7);
  col = mix(col, uShade, rwDab(smoothstep(0.5, 0.2, fract(by + 0.5)) * 0.42 * rockOnly, h, 0.25) * 0.3);
  // the painted wall: palm-dot panels, hand stencils, torch wipes
  if (fz > 0.01) {
    vec2 c = wu / 0.3, id = floor(c), f = fract(c) - 0.5;
    float hd = rwHash(id);
    float dotm = (1.0 - smoothstep(0.24, 0.33, length(f + (vec2(hd, fract(hd * 7.3)) - 0.5) * 0.25))) * step(0.42, hd);
    float red = dotm * smoothstep(0.73, 0.78, zone) * step(fract(hd * 9.1), 0.82);
    vec2 c2 = (wu + vec2(0.0, 0.3)) / vec2(1.05, 0.85), id2 = floor(c2), f2 = (fract(c2) - 0.5) * vec2(1.05, 0.85);
    float hh = rwHash(id2 + 17.0);
    float ha = (hh - 0.5) * 1.1;
    vec2 hp = vec2(f2.x * cos(ha) - f2.y * sin(ha), f2.x * sin(ha) + f2.y * cos(ha)) / 0.36;
    hp.x *= fract(hh * 5.7) > 0.5 ? 1.0 : -1.0;
    float d = rwHand(hp);
    float hand = step(0.0, d) * (1.0 - smoothstep(0.02, 0.5 + 0.1 * sin(uTime * 1.7 + hh * 40.0), d)) * step(hh, 0.6)
      * smoothstep(0.52, 0.6, zone2) * step(1.0, id2.y) * step(id2.y, 3.0);
    red = max(red, hand * (0.55 + 0.6 * gr.a));
    col = mix(col, uRed, rwDab(red * fz, h, 0.16) * 0.88);
    col = mix(col, uChar * 1.6, rwDab(smoothstep(0.78, 0.98, wipe) * 0.6 * fz, h, 0.2) * 0.45);
  }
  // the ground: grass signs (charcoal and ochre dashes) and the red churn of the hoof ring
  if (gz > 0.5) {
    vec2 c = vL.xz / 0.55, id = floor(c), f = fract(c) - 0.5;
    float hd = rwHash(id), ang = (hd - 0.5) * 1.6 + 0.6;
    vec2 dv = vec2(cos(ang), sin(ang)) * 0.3, o = (vec2(fract(hd * 13.7), fract(hd * 5.1)) - 0.5) * 0.3;
    float dash = 1.0 - smoothstep(0.022, 0.05, rwSeg(f, o - dv, o + dv, 0.0));
    float rr = length(vL.xz);
    float keepOut = smoothstep(uRing.x - 3.0, uRing.x, rr) * (1.0 - smoothstep(uRing.y, uRing.y + 3.0, rr)) * uRing.z;
    dash *= step(0.35 + 0.4 * (1.0 - field), hd) * (1.0 - keepOut);
    col = mix(col, mix(uChar * 1.3, uOchre * 0.9, step(0.6, fract(hd * 3.3))), rwDab(dash * 0.9, h, 0.15) * 0.85);
    col = mix(col, uRed, rwDab(keepOut * (0.1 + 0.5 * gr.b) * (0.45 + 0.6 * field), h, 0.1) * 0.34);
  }
  col *= 1.0 + rwRake(h, hs);
  col += rwSpark(gr, vW);
  col = rwCave(col, vW, vRock.y);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}
`;function We(i,e,a,s,c,m,y){const l=[[0,-.4,1,0,0,0],[0,0,1,0,0,0],[0,1.5,1,0,0,0],[0,3,1,0,0,0],[0,4.5,1,0,0,0],[0,6,1,0,0,0],[-.45,6.9,0,.8,.3,0],[-1.7,7.6,0,.8,.7,0],[-2.5,8.3,0,.5,1,0],[-1.7,9.3,0,0,1,0],[.2,9.9,0,0,1,0],[.9,10.4,0,.4,1.1,0],[.7,12.3,0,0,1.1,0],[1.4,13.7,0,0,1.1,0],[2.7,14.7,0,0,1.1,0],[4.3,14.1,0,0,1.1,0],[5.4,11.4,0,0,1.1,0],[6.2,10.3,0,0,1.1,0],[6.8,6.8,0,0,.9,.7],[7.6,3.2,0,0,.8,.7],[8.6,-.4,0,0,.5,0]],v=[];for(let x=0;x<l.length;x++){v.push(l[x]);const w=l[x],b=l[x+1];b&&!(w[2]&&b[2])&&v.push(w.map((k,P)=>P===2?0:(k+b[P])/2))}const d=v.length,r=[],n=[],h=[],f=e()*50;for(let x=0;x<=m;x++){const w=I(s,c,x/m),b=Math.min(s-w,w-c),k=S(0,.3,b),P=.55+.45*i.fbm2(w*2.2+f,3.1,3)+.35*Math.sin(w*2.3+f);for(let E=0;E<d;E++){const[D,F,C,$,N,L]=v[E];let H=D>0?D*(.22+.78*k):D*(.3+.7*k),_=F>6?6+(F-6)*(.3+.7*k)*le(.75+.5*P,.5,1.4):F;if(!C){const X=i.fbm3(w*9+f,_*.35,H*.3,3),ae=i.n3(w*31,_*1.1+4,H),oe=1-Math.abs(i.n3(w*15+f,_*.45,7+H*.25));H+=(X*1+ae*.3+(oe-.62)*1.1)*N*(.5+.5*k),F>0&&(_+=X*.5*Math.min(N,1))}const A=a+H;r.push(Math.sin(w)*A,_,Math.cos(w)*A);const Q=C?.16+.5*S(1.5,6,_):$;n.push(C&&F>=0?1:L*k,Q*S(0,.16,b),0,(s-w)*a+y)}}for(let x=0;x<m;x++)for(let w=0;w<d-1;w++){const b=x*d+w,k=b+1,P=b+d,E=P+1;h.push(b,P,k,k,P,E)}for(const[x,w]of[[0,!1],[m,!0]]){let b=0,k=0,P=0;for(let B=0;B<d;B++){const O=(x*d+B)*3;b+=r[O],k+=r[O+1],P+=r[O+2]}const E=r.length/3;r.push(b/d,k/d*.8,P/d),n.push(0,0,0,0);const D=r.length/3;for(let B=0;B<d;B++){const O=(x*d+B)*3;r.push(r[O],r[O+1],r[O+2]),n.push(0,0,0,0)}const F=x===0?s:c,C=Math.cos(F)*(w?-1:1),$=-Math.sin(F)*(w?-1:1),N=B=>[r[B*3],r[B*3+1],r[B*3+2]],L=N(E),H=N(D+2),_=N(D+3),A=[H[0]-L[0],H[1]-L[1],H[2]-L[2]],Q=[_[0]-L[0],_[1]-L[1],_[2]-L[2]],X=A[1]*Q[2]-A[2]*Q[1],ae=A[0]*Q[1]-A[1]*Q[0],oe=X*C+ae*$>0;for(let B=0;B<d-1;B++)oe?h.push(E,D+B,D+B+1):h.push(E,D+B+1,D+B)}const z=new p.BufferGeometry;return z.setAttribute("position",new p.Float32BufferAttribute(r,3)),z.setAttribute("aRock",new p.Float32BufferAttribute(n,4)),z.setIndex(h),z.computeVertexNormals(),z}function qe(i,e,a,s,c,m){const y=new p.IcosahedronGeometry(1,2);y.deleteAttribute("uv"),y.deleteAttribute("normal");const l=Je(y,1e-4),v=l.attributes.position,d=new Float32Array(v.count*4);for(let r=0;r<v.count;r++){const n=v.getX(r),h=v.getY(r),f=v.getZ(r),z=c*(.72+.34*i.fbm3(n*1.3+m,h*1.3,f*1.3,3)+.1*Math.sign(n)*Math.abs(n)**3);v.setXYZ(r,e+n*z*1.25,a+h*z*.78,s+f*z)}return l.setAttribute("aRock",new p.BufferAttribute(d,4)),l.computeVertexNormals(),l}function v0(i,e,a){const s=[0,5,10,15,20,25,30,36,46,62,90,130,200,290,a],c=56,m=[],y=[],l=[];for(let d=0;d<s.length;d++)for(let r=0;r<c;r++){const n=s[d],h=r/c*ee,f=Math.sin(h)*n,z=Math.cos(h)*n,x=S(e,e+60,n)*(i.fbm2(f*.012,z*.012,3)*9-2.5)-.02;m.push(f,x,z),y.push(0,0,1,0)}for(let d=0;d<s.length-1;d++)for(let r=0;r<c;r++){const n=d*c+r,h=d*c+(r+1)%c,f=n+c,z=h+c;l.push(n,f,h,h,f,z)}const v=new p.BufferGeometry;return v.setAttribute("position",new p.Float32BufferAttribute(m,3)),v.setAttribute("aRock",new p.Float32BufferAttribute(y,4)),v.setIndex(l),v.computeVertexNormals(),v}function d0(i){let e=0,a=0;for(const r of i)e+=r.attributes.position.count,a+=r.index.count;const s=new Float32Array(e*3),c=new Float32Array(e*3),m=new Float32Array(e*4),y=new Uint32Array(a);let l=0,v=0;for(const r of i){s.set(r.attributes.position.array,l*3),c.set(r.attributes.normal.array,l*3),m.set(r.attributes.aRock.array,l*4);const n=r.index.array;for(let h=0;h<n.length;h++)y[v+h]=n[h]+l;l+=r.attributes.position.count,v+=n.length,r.dispose()}const d=new p.BufferGeometry;return d.setAttribute("position",new p.BufferAttribute(s,3)),d.setAttribute("normal",new p.BufferAttribute(c,3)),d.setAttribute("aRock",new p.BufferAttribute(m,4)),d.setIndex(new p.BufferAttribute(y,1)),d}const p0=`
${Ne}
uniform vec3 uSun;
uniform float uShLen;
attribute vec4 iD;
attribute float iT;
varying vec2 vQ;
varying vec4 vS;
varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vec4 Pc, auxc; vec3 Tc; float met;
  rwTrack(iT, iD.x, Pc, Tc, auxc, met);
  vec4 wp; float vis, age = 0.0;
  if (iD.y < 0.5) {
    vec3 Th = normalize(vec3(Tc.x, 0.0, Tc.z) + vec3(1e-5, 0.0, 0.0));
    vec3 side = vec3(-Th.z, 0.0, Th.x);
    vec3 sd = normalize(vec3(-uSun.x, 0.0, -uSun.z) + vec3(1e-5, 0.0, 0.0));
    float lk = step(1.5, uShLen);
    vec3 ax = normalize(mix(Th, sd, lk)), ay = vec3(-ax.z, 0.0, ax.x);
    vec3 lp = Pc.xyz + vec3(-uSun.x, 0.0, -uSun.z) * (0.8 * iD.z * mix(1.0, uShLen * 1.5, lk)) + ax * (position.x * 1.7 * iD.z * mix(1.0, uShLen, lk)) + ay * (position.y * 0.75 * iD.z);
    lp.y = Pc.y + 0.05;
    wp = modelMatrix * vec4(lp, 1.0);
    vis = auxc.w * step(0.5, auxc.x);
  } else {
    float span = 11.0;
    age = fract((Pc.w + (iD.y - 1.0) * span / 5.0) / span + iD.w);
    vec4 Pb, auxb; vec3 Tb; float mb;
    rwTrack(iT - (age * span + 0.8 * iD.z) / met, iD.x, Pb, Tb, auxb, mb);
    vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    vec3 cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    float sz = iD.z * (0.3 + 0.9 * age);
    wp = modelMatrix * vec4(Pb.xyz + vec3(0.0, (0.12 + 0.75 * age) * iD.z, 0.0), 1.0);
    wp.xyz += (cr * position.x + cu * position.y) * sz;
    vis = (1.0 - age) * auxb.w;
  }
  vQ = position.xy; vS = vec4(iD.y, vis, iD.w, age); vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  if (vis < 0.03) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
  #include <fog_vertex>
}
`,g0=`
${ye}
varying vec2 vQ;
varying vec4 vS;
varying vec3 vW;
#include <fog_pars_fragment>
void main(){
  vec4 gn = texture2D(uGrain, vQ * 0.23 + vS.z * vec2(3.7, 1.3));
  vec4 gw = rwGrain2(vW.xz);
  float st = texture2D(uGrain, vQ * 0.05 + vS.z * vec2(5.1, 2.9) + vec2(0.0, vS.w * 0.03)).a;
  float r = length(vQ);
  vec3 col;
  if (vS.x < 0.5) {
    float d = rwDab((1.0 - r * r) * vS.y * 0.9 + (gn.b - 0.5) * 0.4, gw.r, 0.2);
    if (d < 0.4) discard;
    col = mix(rwRock(gw.r, gw.g), uShade, 0.56 * d);
  } else {
    float v = (1.0 - r) * vS.y;
    if (st + (gn.r - 0.5) * 0.3 < 1.03 - 0.74 * v) discard;
    col = mix(rwRock(gw.r, gw.g), uRed * 0.78, 0.86);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}
`,m0=`
uniform vec3 uFlamePos;
uniform float uFlameSize, uTime;
attribute vec4 iF;
varying vec2 vQ;
varying vec3 vK;
#include <fog_pars_vertex>
void main(){
  vec4 wp = modelMatrix * vec4(uFlamePos, 1.0);
  float age = 0.0;
  if (iF.x < 0.5) {
    vec3 cr = normalize(vec3(viewMatrix[0][0], 0.0, viewMatrix[2][0]) + vec3(1e-5, 0.0, 0.0));
    wp.xyz += cr * (position.x * uFlameSize * 0.8) + vec3(0.0, position.y * uFlameSize * 1.7, 0.0);
  } else {   // charcoal smoke: dabs that rise, spread and thin
    age = fract(uTime * 0.05 + iF.y);
    vec3 cr = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
    vec3 cu = vec3(viewMatrix[0][1], viewMatrix[1][1], viewMatrix[2][1]);
    wp.xyz += vec3(sin(iF.y * 40.0 + age * 5.0) * 0.8 * age + 2.6 * age * age, 1.5 + 21.0 * age, cos(iF.y * 31.0 + age * 4.0) * 0.8 * age) * uFlameSize;
    wp.xyz += (cr * (position.x * 2.0) + cu * (position.y * 2.0 - 1.0)) * (0.45 + 2.5 * age) * uFlameSize;
  }
  vQ = position.xy + vec2(0.5, 0.0); vK = vec3(iF.x, iF.y, age);
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}
`,w0=`
${ye}
varying vec2 vQ;
varying vec3 vK;
#include <fog_pars_fragment>
void main(){
  float n = texture2D(uGrain, vec2(vQ.x * 0.22 + 0.3, vQ.y * 0.17 - uTime * 0.5)).b;
  float n2 = texture2D(uGrain, vec2(vQ.x * 0.45, vQ.y * 0.38 - uTime * 1.05)).r;
  vec4 sm = texture2D(uGrain, (vQ - 0.5) * 0.12 + vK.y * vec2(3.1, 7.7));
  vec3 col;
  if (vK.x < 0.5) {
    float w = 1.0 - vQ.y;
    float shape = w * (1.0 - smoothstep(0.0, 0.42 * w + 0.07, abs(vQ.x - 0.5 + (n - 0.5) * 0.5 * vQ.y)));
    float v = shape * 1.5 + (n2 - 0.5) * 0.65;
    if (v < 0.4) discard;
    col = mix(uRed * 3.0, uOchre * 6.5, smoothstep(0.4, 0.85, v));
    col = mix(col, uPale * 7.5, smoothstep(0.95, 1.35, v)) * uTorch.w;
  } else {
    vec2 q = (vQ - 0.5) * 2.0;
    float v = (1.0 - length(q)) * (1.0 - vK.z) * smoothstep(0.0, 0.06, vK.z);
    if (sm.a * 0.55 + sm.b * 0.45 < 0.94 - 0.85 * v) discard;
    col = uChar * (2.0 + 1.6 * sm.r);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}
`;function Pe(i,e,a,s,c){const m=e-1;let y=0,l=0,v=0,d=0;for(let r=0;r<=m;r++){const n=c(r/m),h=(s*e+r)*4,f=((s+a)*e+r)*4;r>0&&(y+=Math.hypot(n[0]-l,n[1]-v,n[2]-d)),l=n[0],v=n[1],d=n[2],i[h]=n[0],i[h+1]=n[1],i[h+2]=n[2],i[h+3]=y,i[f]=n[3],i[f+1]=n[4],i[f+2]=n[5],i[f+3]=n[6]}return y}function x0(i,e){const a=e.a0-ee*i,s=(i-e.g0)/(e.g1-e.g0),c=s>0&&s<1?Math.sin(Math.PI*s):0,m=i<e.tIn?S(e.tIn-.12,e.tIn,i):1-S(e.tOut,e.tOut+.12,i),y=e.laneR+e.wob*Math.sin(a*3+e.ph)+e.wob*.5*Math.sin(a*7+e.ph*2.3),l=I(y,e.Rw-e.off,m)-.7*c,v=i<e.tIn?S(e.tIn-.075,e.tIn-.004,i):1-S(e.tOut+.004,e.tOut+.08,i),d=e.wallY*v+.55*Math.sin(Math.PI*v)*Math.min(e.wallY,1)+.75*c;let r=i<e.tIn?1-S(e.tIn-.03,e.tIn+.003,i):S(e.tOut-.003,e.tOut+.03,i);r=Math.max(r,S(e.g0-.004,e.g0+.014,i)*(1-S(e.g1-.014,e.g1+.004,i)));const n=S(e.tIn-.01,e.tIn+.05,i)*(1-S(e.tOut-.05,e.tOut+.01,i))*(1-S(e.g0-.03,e.g0,i)*(1-S(e.g1,e.g1+.03,i)));return[Math.sin(a)*l,d,Math.cos(a)*l,r,.62*n,1,r*(1-S(0,.12,d))]}function be(i,e,a){const s=new p.InstancedBufferGeometry;s.index=i.index;for(const c in i.attributes)s.setAttribute(c,i.attributes[c]);for(const c in a){const m=new p.InstancedBufferAttribute(a[c],c==="iT"?1:4);c==="iT"&&m.setUsage(p.DynamicDrawUsage),s.setAttribute(c,m)}return s.instanceCount=e,s.boundingSphere=new p.Sphere(new p.Vector3,1e5),s}async function z0(i,e={}){const a=i.rng.fork?i.rng.fork("running-wall"):i.rng,s=i.noise,c=Array.isArray(e.palette)&&e.palette.length>=6?e.palette:t0,m=i.quality?.detail??1,y=e.hour||"morning",l=e.weather||"clear",v=new p.Group;v.name="running-wall-hero";const d=!e.grainTexture,r=e.grainTexture||await a0(a.fork("grain"),i),n=o0(c,r);if(y==="golden")n.uRock.value.lerp(new p.Color(c[4]),.34),n.uPale.value.lerp(new p.Color(c[4]),.2),n.uShLen.value=2.6,n.uShade.value.lerp(new p.Color(c[5]),.22).multiplyScalar(.85),n.uSun.value.set(-.74,.3,.6).normalize();else if(y==="night"){const t=new p.Color(c[2]),u=new p.Color(c[1]);n.uRock.value.copy(t).multiplyScalar(.27),n.uPale.value.copy(t).multiplyScalar(.4),n.uShade.value.copy(t).multiplyScalar(.07),n.uChar.value.copy(u).multiplyScalar(.34),n.uOchre.value.copy(t).lerp(u,.3).multiplyScalar(.7),n.uRed.value.lerp(t,.5).multiplyScalar(.8),n.uSun.value.set(-.6,.5,.62).normalize(),n.uEngr.value=1}l==="loess"?n.uFade.value=420:l==="snow"&&(n.uSnow.value=1),e.sunDir&&n.uSun.value.fromArray(e.sunDir).normalize();const h=()=>p.UniformsUtils.clone(p.UniformsLib.fog);await i.yield?.();const f=[];f.push(i0(a.fork("horse"))),await i.yield?.(),f.push(l0(a.fork("aurochs"))),await i.yield?.(),f.push(s0(a.fork("deer"))),await i.yield?.(),f.push(...e.species||[]);const z=le(Math.round(e.escort??0),0,f.length-1),x=e.laneFn||null;await i.yield?.();const w=e.path||null,b=!!w,k=[],P=(t,u)=>{if(t>2)return f[t].coat?f[t].coat(u):{ochre:.7,fill:0,red:0,antler:1};if(t===1)return{ochre:.6,fill:.72+.2*u(),red:0,antler:1};if(t===2)return{ochre:.8+.3*u(),fill:0,red:u()<.25?1:0,antler:u()<.55?1:0};const M=u();return M<.16?{ochre:.35,fill:.66+.2*u(),red:0,antler:1}:{ochre:.72+.42*u(),fill:0,red:M>.9?1:0,antler:1}},E=b?1024:256,D=E+1,F=19,C=Math.PI/180,$=28.5*C,N=t=>(388.5-t)/360,L={a0:$,tIn:N(292),g0:N(214),g1:N(188),tOut:N(135)},H=e.speed??15;let _=0,A=0,Q=1,X=1,ae=2.3,oe=null;const B=f.map(()=>0);if(b){_=w.length,ae=e.eye??2.3,A=(e.mouthU??.13)*_,Q=_+80;const t={hallHalf:16,galleryHalf:4.5,mouthHalf:7,hallLen:30,flare:14,...e.cave||{}};oe=o=>I(I(t.hallHalf,t.galleryHalf,S(t.hallLen-2,t.hallLen+12,o)),I(t.mouthHalf,t.finHalf??t.mouthHalf,S(A,A+(t.finLen??30),o)),S(A-t.flare,A,o));const u=Math.round(e.horses??40),M=Math.round((e.frieze??34)*(.6+.4*m));for(let o=0;o<u;o++){const g=o===0?11:6+34*Math.pow((o-.5+a()*.6)/u,1.25),T=o===0||a()<.55?1:-1,G=a.range(1.2,2.3);k.push({sp:o===0?0:z,...P(o===0?0:z,a),lane:g,side:T,along:o===0?5:a.range(-.5*g-6,Math.min(1.25*g+4,58)),weave:o===0?.6:a.range(.8,2.6),ph:a()*ee,wand:o===0?1:a.range(1,3),wr:a.range(.15,.3),close:o===0?{lat:e.stallionLat??5,from:.22,to:.4}:null,scale:o===0?e.stallionScale??1.1:a.range(.92,1.07),scaleWall:G/f[o===0?0:z].height,wallY:a.range(.3,Math.max(.4,4.6-G)),off:.045+o*.001,gaitPh:a(),seed:a(),dEnd:Q,loop:!1})}if(k[0].ochre=.3,k[0].fill=.82,k[0].red=0,e.sides)for(const o in e.sides)k[o]&&(k[o].side=e.sides[o]);for(let o=0;o<M;o++){const g=a(),T=g<.55?0:g<.8?1:2,G=a.range(1.1,2.4)*(e.friezeScale??1);k.push({sp:T,...P(T,a),lane:a.range(16,46),side:o%2?1:-1,along:0,weave:a.range(1,3),ph:a()*ee,wand:0,wr:0,close:null,scale:a.range(.93,1.08),scaleWall:G/f[T].height,wallY:a.range(.3,Math.max(.4,4.6-G)),off:.045+(u+o)*.001,gaitPh:a(),seed:a(),dEnd:A+140,loop:!0,phase:(o+a()*.8)/M})}for(const o of e.actors||[]){const g=Object.assign(o,{ext:!0,loop:!1,t:o.t??0,scale:o.scale??1,scaleWall:o.scale??1,gaitPh:o.gaitPh??a(),seed:o.seed??a(),ochre:o.ochre??.7,fill:o.fill??0,red:o.red??0,antler:o.antler??1});k.push(g)}k.forEach((o,g)=>{o.row=g,o.idx=g,!o.ext&&e.peelFn&&(o.peel=e.peelFn(o))})}else{const t=[e.horses??Math.round((28+a()*8)*(.6+.4*m)),e.aurochs??a.int(4,7),e.deer??a.int(3,5)];for(let o=0;o<3;o++)for(let g=0;g<t[o];g++)k.push({sp:o});a.shuffle(k);const u=k.length,M=a.shuffle(k.map((o,g)=>g));k.forEach((o,g)=>{const T=f[o.sp],G=a.range(1.1,2.4)*(o.sp===2?1.1:1);Object.assign(o,P(o.sp,a),{row:g,scale:a.range(.93,1.08),scaleWall:G/T.height,wallY:a.range(.3,Math.max(.4,5.5-G)),laneR:10.6+7.6*((M[g]+.5)/u),wob:a.range(.25,.7),ph:a()*ee,off:.045+g*.0012,phase:(g+a()*.7)/u,gaitPh:a(),seed:a(),Rw:F,...L})}),X=ee*F/H}const O=k.length,ne=new Float32Array(D*O*2*4),V=new p.Vector3,Z=new p.Vector3,je=e.avoid||[],Re=e.laneMin??5,De=e.portalClear??10,Ce=e.peel||[0,0],Qe=e.fan??18,Ke=(t,u)=>{w.posAtDist(t,V),w.tangentAtDist(t,Z);let M=-Z.z,o=Z.x;const g=Math.hypot(M,o)||1;M/=g,o/=g;let T=u.lane+u.weave*Math.sin(t/41+u.ph)+u.weave*.4*Math.sin(t/13+u.ph*3);if(u.close){const q=t/_,j=u.close,J=(j.to-j.from)*.35;T=I(T,j.lat,S(j.from,j.from+J,q)*(1-S(j.to-J,j.to,q)))}T=Math.max(T,Re,De*S(_-100,_-45,t)),x&&(T=x(t,u.side,T,u));const G=A+(u.peel??(u.side>0?Ce[1]:Ce[0])),K=u.side*I(oe(t)-u.off,T,S(G,G+Qe,t));let W=V.x+M*K,Y=V.z+o*K;for(const q of je){const j=W-q.x,J=Y-q.z,ie=Math.hypot(j,J)||.001;ie<q.r&&(W=q.x+j/ie*q.r,Y=q.z+J/ie*q.r)}const ce=I(V.y-ae,e.heightAt?e.heightAt(W,Y):V.y-ae,S(A-1,A+6,t)),se=1-S(G+.5,G+11,t),U=ce+u.wallY*se+.5*Math.sin(Math.PI*se)*Math.min(u.wallY,1);let re=S(.5,6,t);return u.loop&&(re*=1-S(u.dEnd-34,u.dEnd-3,t)),[W,U,Y,S(G-.4,G+3.6,t),1-S(A-4,A+2,t),re,S(G-.4,G+3.6,t)*(1-S(0,.12,U-ce))*(e.dustAt?e.dustAt(W,Y):1)]};for(let t=0;t<O;t++){const u=k[t],M=f[u.sp];u.len=u.ext?Pe(ne,D,O,t,u.sample):b?Pe(ne,D,O,t,g=>Ke(g*u.dEnd,u)):Pe(ne,D,O,t,g=>x0(g,u));const o=(b?M.stride:M.stride*.78)*u.scale;u.stride=u.ext&&u.stride?u.stride:b?o:u.len/Math.max(1,Math.round(u.len/o)),await i.yield?.()}const ue=new p.DataTexture(ne,D,O*2,p.RGBAFormat,p.FloatType);ue.magFilter=ue.minFilter=p.NearestFilter,ue.generateMipmaps=!1,ue.needsUpdate=!0;const _e={uTrack:{value:ue},uTrackN:{value:E},uRows:{value:O},uClosed:{value:b?0:1}};await i.yield?.();const de=[];let he=0,fe=0;for(let t=0;t<f.length;t++){const u=k.filter(R=>R.sp===t),M=[...u.filter(R=>!R.loop),...u.filter(R=>R.loop)],o=M.length,g=f[t];if(!o)continue;B[t]=M.filter(R=>!R.loop).length;const T=new Float32Array(o*4),G=new Float32Array(o*4),K=new Float32Array(o*4),W=new Float32Array(o),Y=new Float32Array(o*8),ce=new Float32Array(o*8),se=new Float32Array(o*8),U=new Float32Array(o*2);M.forEach((R,we)=>{T.set([R.row,R.scale,R.scaleWall,R.stride],we*4),G.set([0,R.ochre,R.fill,R.antler],we*4),K.set([R.gaitPh,R.seed,0,R.red],we*4);for(let xe=0;xe<2;xe++){const Ae=(we*2+xe)*4;Y.set([R.row,R.scale,R.scaleWall,R.stride],Ae),ce.set([xe+1,R.ochre,R.fill,R.antler],Ae),se.set([R.gaitPh,R.seed,0,R.red],Ae)}});const re=new p.ShaderMaterial({vertexShader:c0,fragmentShader:u0,fog:!0,side:p.DoubleSide,uniforms:{...h(),...n,..._e,uFore:{value:new p.Vector4(...g.fore)},uHind:{value:new p.Vector4(...g.hind)},uL3:{value:g.L3},uGaitP:{value:new p.Vector4(...g.gait)},uNeck:{value:new p.Vector4(...g.neck)},uGaitOff:{value:new p.Vector4(...g.gaitOff||[.42,.54,0,.1])},uTail:{value:new p.Vector4(...g.tail||[.24,.1,.12,0])}}}),q=be(g.body,o,{iA:T,iB:G,iC:K,iT:W}),j=be(g.ghost,o*2,{iA:Y,iB:ce,iC:se,iT:U}),J=new p.Mesh(q,re),ie=new p.Mesh(j,re);J.frustumCulled=ie.frustumCulled=!1,J.name="rw-body-"+t,ie.name="rw-ghost-"+t,v.add(J),g.noGhost||v.add(ie),de.push({sp:t,list:M,n:o,bodyG:q,ghostG:j,bodyT:W,ghostT:U,mat:re,iA:T,gA:Y}),he+=o*(g.tris+(g.noGhost?0:2*g.ghostTris)),fe+=g.noGhost?1:2}await i.yield?.();const Ye=5,ve=Ye+1,pe=O*ve,Le=new Float32Array(pe*4),Be=new Float32Array(pe);k.forEach((t,u)=>{for(let M=0;M<ve;M++)Le.set([t.row,M,t.scale*(t.sp===0?1:le(f[t.sp].len/2.6,.5,2.2)),(t.seed*7.13+M*.37)%1],(u*ve+M)*4)});const Ee=be(new p.PlaneGeometry(2,2),pe,{iD:Le,iT:Be}),$e=new p.ShaderMaterial({vertexShader:p0,fragmentShader:g0,fog:!0,side:p.DoubleSide,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2,uniforms:{...h(),...n,..._e}}),ke=new p.Mesh(Ee,$e);ke.frustumCulled=!1,ke.name="rw-signs",v.add(ke),he+=pe*2,fe++;let ge=null;const Ve={on:b?0:1};if(!b&&e.rock!==!1){const t=[We(s,a,F,292*C,214*C,60,1),We(s,a,F,188*C,135*C,42,40)];for(const[U,re]of[[292,1],[214,-1],[188,1],[135,-1]])for(let q=0;q<2;q++){const j=(U+re*a.range(2,9))*C,J=F+a.range(1.5,7),ie=a.range(.6,1.5);t.push(qe(s,Math.sin(j)*J,ie*.32,Math.cos(j)*J,ie,U+q*7.7))}const u=a.range(232,270)*C,M=F-a.range(2.6,3.4),o=new p.Vector3(Math.sin(u)*M,.25,Math.cos(u)*M);for(let U=0;U<6;U++){const re=U/6*ee+a()*.5;t.push(qe(s,o.x+Math.cos(re)*.62,.08,o.z+Math.sin(re)*.62,a.range(.2,.32),40+U))}await i.yield?.(),e.ground!==!1&&t.push(v0(s,34,420));const g=d0(t),T=new p.ShaderMaterial({vertexShader:h0,fragmentShader:f0,fog:!0,uniforms:{...h(),...n,uRing:{value:new p.Vector4(10,18.7,1,0)}}}),G=new p.Mesh(g,T);G.name="rw-rock",v.add(G),he+=g.index.count/3,fe++;const K=new p.PlaneGeometry(1,1);K.translate(0,.5,0),ge={uFlamePos:{value:o.clone()},uFlameSize:{value:1.25}};const W=16,Y=new Float32Array((W+1)*4);for(let U=1;U<=W;U++)Y[U*4]=1,Y[U*4+1]=(U+a()*.6)/W;const ce=be(K,W+1,{iF:Y}),se=new p.Mesh(ce,new p.ShaderMaterial({vertexShader:m0,fragmentShader:w0,fog:!0,side:p.DoubleSide,uniforms:{...h(),...n,...ge}}));se.frustumCulled=!1,se.name="rw-flame",v.add(se),he+=2*(W+1),fe++,n.uTorch.value.set(o.x,o.y+1,o.z,1),n.uMouth.value.set(Math.sin(135*C)*(F-2),3,Math.cos(135*C)*(F-2),12)}else b&&(w.posAtDist(A,V),n.uMouth.value.set(V.x,V.y+1.2,V.z,22));await i.yield?.();let Oe=-1,me=0,Ue=!0;const Xe=t=>t>=A?t:A-1.25*(A-t),Ie=t=>{const u=b?S(A,A+30,me):0,M=b?Xe(me):0;for(const o of k)if(!o.ext)if(b)if(o.loop){const g=t*H/o.dEnd+o.phase;o.t=g-Math.floor(g)}else o.t=le((M+o.along+(o.wig??1)*(u*o.wand*Math.sin(t*o.wr+o.ph)+(1-u)*5*Math.sin(t*.6+o.ph)))/Q,0,1);else{const g=t/X+o.phase;o.t=g-Math.floor(g)}for(const o of de){for(let g=0;g<o.n;g++){const T=o.list[g].t;o.bodyT[g]=T,o.ghostT[g*2]=T,o.ghostT[g*2+1]=T}o.bodyG.attributes.iT.needsUpdate=!0,o.ghostG.attributes.iT.needsUpdate=!0}for(let o=0;o<O;o++){const g=k[o].t;for(let T=0;T<ve;T++)Be[o*ve+T]=g}Ee.attributes.iT.needsUpdate=!0},He=(t,u,M=new p.Vector3)=>{const o=le(u,0,1)*E,g=Math.min(Math.floor(o),E-1),T=o-g,G=(t*D+g)*4;return M.set(I(ne[G],ne[G+4],T),I(ne[G+1],ne[G+5],T),I(ne[G+2],ne[G+6],T))};Ie(0);let ze,Me,Se,Te;if(b){const t=u=>{const M=[];for(let o=0;o<=A+.01;o+=4){w.posAtDist(o,V),w.tangentAtDist(o,Z);const g=Math.hypot(Z.x,Z.z)||1;M.push([V.x-Z.z/g*u*oe(o),V.y-ae,V.z+Z.x/g*u*oe(o)])}return M};w.posAtDist(A,V),w.tangentAtDist(A,Z),Me=_*.5,Se=8,Te=w.posAtDist(_*.5,new p.Vector3),ze={mouth:{position:[V.x,V.y-ae,V.z],facing:[Z.x,Z.y,Z.z],u:A/_,halfWidth:oe(A),height:8},wallLines:{left:t(-1),right:t(1),friezeBand:[.2,5]},portalSeat:{position:w.end.toArray(),facing:w.endTangent.clone().negate().toArray(),radius:7,clear:De},flyThrough:[0,.1,.2,.4,.6,.8,1].map(u=>w.pointAt(u).toArray()),lanes:{min:Re,max:40,stallion:{side:1,lateral:k[0].lane,closeLateral:k[0].close.lat,closeFrom:.22,closeTo:.4,ahead:k[0].along}},sunDir:n.uSun.value.toArray()}}else{Me=14,Se=9,Te=new p.Vector3(-1.3,3.2,-4.8);const t=(u,M,o)=>[Math.sin(u*C)*M,o,Math.cos(u*C)*M];ze={portalSeat:{position:[0,7.2,0],facing:t(15,1,0),radius:7},flyThrough:[t(15,80,11),t(15,40,10.6),t(15,16,9.8),[0,7.2,0]],viewpoints:{front:{position:t(13,36,5.5),target:[0,2.5,-6]},peel:{position:t(108,29,2.3),target:t(135,17,2)},gap:{position:t(201,36,2.6),target:t(201,19,2.6)},frieze:{position:t(60,6,2.3),target:t(250,19,2.6)},abreast:{position:t(60,24,2.3),target:t(48,14,1.4)}},peelEdge:{position:t(135,F,0),up:[0,6,0]},returnEdge:{position:t(292,F,0),up:[0,6,0]},gap:{from:t(214,F,0),to:t(188,F,0)},walls:{centre:[0,0,0],radius:F,spansDeg:[[292,214],[188,135]],friezeHeight:6,overhangY:8.3,rockOuterRadius:F+9.5,crownY:15},ring:{inner:10,outer:18.7,lapSeconds:X},hearth:ge?ge.uFlamePos.value.toArray():null,sunDir:n.uSun.value.toArray()}}const Ze={triangles:Math.round(he),calls:fe,animals:O};return{object:v,radius:Me,height:Se,center:Te,anchors:ze,ground:b?!1:e.rock===!1||e.ground===!1,groundY:-.5,uniforms:n,grainTexture:r,stats:Ze,animals:k,species:f.map(t=>({height:t.height,length:t.len,stride:t.stride})),setProgress(t){Oe=t},setSun(t){n.uSun.value.set(t.x??t[0],t.y??t[1],t.z??t[2]).normalize()},setTorch(t,u=1){n.uTorch.value.set(t.x??t[0],t.y??t[1],t.z??t[2],n.uTorch.value.w),Ve.on=u},actorAt(t,u=new p.Vector3){return He(t.row,t.t??0,u)},rescale(t,u){if(t._rs===u)return;t._fig===void 0&&(t._fig=de.find(g=>g.sp===t.sp)||null,t._fi=t._fig?t._fig.list.indexOf(t):-1);const M=t._fig,o=t._fi;if(!(!M||o<0)){t._rs=u,M.iA[o*4+1]=u,M.iA[o*4+2]=u;for(let g=0;g<2;g++){const T=(o*2+g)*4;M.gA[T+1]=u,M.gA[T+2]=u}M.bodyG.attributes.iA.needsUpdate=!0,M.ghostG.attributes.iA.needsUpdate=!0}},runnerAt(t,u=new p.Vector3){const M=k[le(t|0,0,O-1)];return He(M.row,M.t??0,u)},update(t,u,M){n.uTime.value=u;const o=Math.sin(u*ee*2),g=Math.sin(u*ee*.7+1.3);if(n.uTorch.value.w=Ve.on*(1+.1*o*Math.abs(o)+.05*g),b){let T=Oe;T<0&&M&&(v.updateMatrixWorld(),V.setFromMatrixPosition(M.matrixWorld),v.worldToLocal(V),T=w.nearestXZ(V.x,V.z).u),me=le(T<0?0:T,0,1)*_;const G=me<A+145;if(G!==Ue){Ue=G;for(const K of de){const W=G?K.n:B[K.sp];K.bodyG.instanceCount=W,K.ghostG.instanceCount=W*2}}}Ie(u)},dispose(){ue.dispose(),d&&r.dispose()}}}export{t0 as DEFAULT_PALETTE,u0 as FIG_FRAG,c0 as FIG_VERT,Fe as Fig,ye as PIGMENT_GLSL,Ne as TRACK_GLSL,te as addLeg,Pe as bakeRow,z0 as buildHero,a0 as makeGrainTexture};
