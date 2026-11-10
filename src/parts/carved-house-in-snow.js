import*as c from"three";const q=78,At=30,dt=12,E=204,kt=-16,Tt=465,Et=[70,150,230,310,390],L=(o,t,e)=>{const a=Math.min(1,Math.max(0,(e-o)/(t-o)));return a*a*(3-2*a)},G=(o,t,e)=>o+(t-o)*e;function Gt(){const t=Math.round((Tt+4-kt)/.5),e=new Float32Array(t+1),a=new Float32Array(t+1),n=u=>G(34,21,L(396,440,u)),s=(u,l)=>l<60?0:G(G(0,u,L(60,84,l)),.325,L(400,430,l)),r=u=>{let l=0,b=0;for(let f=0;f<=t;f++){const x=kt+f*.5;e[f]=l,a[f]=b,x>=70&&(l+=.5/n(x)),b+=s(u,x)*.5}return a[Math.round((Tt-kt)/.5)]};let p=.19;for(let u=0;u<12;u++){const l=r(p);p*=1+(q-l)/Math.max(l,1)*.9}r(p);const y=(u,l)=>{const b=Math.min(t-.001,Math.max(0,(l-kt)/.5)),f=Math.floor(b);return u[f]+(u[f+1]-u[f])*(b-f)},h=u=>{let l=0;for(const b of Et)l=Math.max(l,1-L(2.2,6.5,Math.abs(u-b)));return l},R={k:p,radius:n,pinch:h,angle:u=>y(e,u),y:u=>y(a,u),slope:u=>s(p,u),wR(u){const l=u<64?20:G(20,17,L(64,76,u));return G(G(l,8,h(u)),8,L(405,432,u))},wL(u){return u<70?R.wR(u):Math.min(R.wR(u),n(u)-13.6)},crown(u){return G(G(26,20,h(u)),15,L(388,412,u))},frame(u,l={}){if(u<70)return l.x=34,l.z=70-u,l.y=y(a,u),l.tx=0,l.tz=-1,l.nx=1,l.nz=0,l.a=0,l;const b=y(e,u),f=n(u);return l.a=b,l.nx=Math.cos(b),l.nz=-Math.sin(b),l.tx=-Math.sin(b),l.tz=-Math.cos(b),l.x=f*l.nx,l.z=f*l.nz,l.y=y(a,u),l},point(u,l,b,f=new c.Vector3){const x=R.frame(u,It);return f.set(x.x+x.nx*l,x.y+b+R.rib(u),x.z+x.nz*l)},rib(u){if(u<74||u>452)return 0;const l=Math.abs((u%8+8)%8-4);return .28*(1-L(3.1,3.9,l))*(1-R.kilim(u))},kilim(u){return L(236,240,u)*(1-L(300,304,u))},seat(u,l,b=0,f=0,x=1){const v=R.frame(u,It),g=new c.Matrix4;return g.makeRotationY(Math.atan2(-v.tx,-v.tz)+Math.PI+f),x!==1&&g.scale(Ht.set(x,x,x)),g.setPosition(v.x+v.nx*l,v.y+b,v.z+v.nz*l)}};return R}const It={},Ht=new c.Vector3,ae=Gt(),oe=(o,t)=>Math.atan2(-t,o),Mt=55*Math.PI/180,et=new c.Vector3(-Math.cos(Mt),Math.sin(Mt),0),vt=new c.Vector3(-17.2,185,-16),lt=o=>At-12*Math.pow(L(150,208,o),1.6),nt=new c.Vector3,J=new c.Vector3,Ct=new c.Color,Dt=new c.Matrix3,xt=o=>(Ct.set(o),[Ct.r,Ct.g,Ct.b]);class Ft{constructor(t=2048){this.cap=t,this.P=new Float32Array(t*3),this.N=new Float32Array(t*3),this.C=new Float32Array(t*3),this.M=new Float32Array(t*4),this.U=new Float32Array(t*2),this.S=new Float32Array(t*3),this.L=new Float32Array(t*3),this.I=new Uint32Array(t*6),this.n=0,this.ni=0,this.sway=!1,this.lit=null}room(t){if(this.n+t<=this.cap)return;let e=this.cap*2;for(;e<this.n+t;)e*=2;this.cap=e;for(const[a,n]of[["P",3],["N",3],["C",3],["M",4],["U",2],["S",3],["L",3]]){const s=new Float32Array(e*n);s.set(this[a]),this[a]=s}}iroom(t){if(this.ni+t<=this.I.length)return;let e=this.I.length*2;for(;e<this.ni+t;)e*=2;const a=new Uint32Array(e);a.set(this.I),this.I=a}v(t,e,a,n,s,r,p,y=0,h=0,R=0,u=0,l=0){this.n>=this.cap&&this.room(1);const b=this.n,f=b*3,x=this.P,v=this.N,g=this.C,m=this.M,C=this.L,D=this.lit;return x[f]=t,x[f+1]=e,x[f+2]=a,v[f]=n,v[f+1]=s,v[f+2]=r,g[f]=p[0],g[f+1]=p[1],g[f+2]=p[2],m[b*4]=y,m[b*4+1]=h,m[b*4+3]=l,this.U[b*2]=R,this.U[b*2+1]=u,D?(C[f]=D[0],C[f+1]=D[1],C[f+2]=D[2]):C[f]=-1,this.n++}tri(t,e,a){this.ni+3>this.I.length&&this.iroom(3);const n=this.I,s=this.ni;n[s]=t,n[s+1]=e,n[s+2]=a,this.ni=s+3}quad(t,e,a,n){this.tri(t,e,a),this.tri(t,a,n)}triN(t,e,a){const n=this.P,s=this.N,r=n[t*3],p=n[t*3+1],y=n[t*3+2],h=n[e*3]-r,R=n[e*3+1]-p,u=n[e*3+2]-y,l=n[a*3]-r,b=n[a*3+1]-p,f=n[a*3+2]-y;(R*f-u*b)*s[t*3]+(u*l-h*f)*s[t*3+1]+(h*b-R*l)*s[t*3+2]>=0?this.tri(t,e,a):this.tri(t,a,e)}quadN(t,e,a,n){this.triN(t,e,a),this.triN(t,a,n)}add(t,e={}){const a=t.attributes.position,n=t.attributes.normal,s=t.index,r=this.n,p=e.m,y=a.count,h=a.array,R=n.array,u=!a.isInterleavedBufferAttribute&&!n.isInterleavedBufferAttribute&&a.itemSize===3&&n.itemSize===3;p&&Dt.getNormalMatrix(p),this.room(y);const l=e.c==="geo"?t.attributes.color:null,b=typeof e.c=="function"?e.c:null,f=b||l?null:e.c||[.6,.45,.33],x=this.P,v=this.N,g=this.C,m=this.M,C=this.U,D=this.S,F=this.L,H=e.kind||0,O=e.emis||0,V=e.w||0,I=e.l||this.lit,tt=!!e.flip;for(let d=0;d<y;d++){let z,W,M;u?(z=h[d*3],W=h[d*3+1],M=h[d*3+2],J.set(R[d*3],R[d*3+1],R[d*3+2])):(z=a.getX(d),W=a.getY(d),M=a.getZ(d),J.set(n.getX(d),n.getY(d),n.getZ(d))),nt.set(z,W,M);const T=r+d,S=T*3,U=e.uv?e.uv(z,W,M):null,_=e.sway?e.sway(z,W,M,d):null;if(l)g[S]=l.getX(d),g[S+1]=l.getY(d),g[S+2]=l.getZ(d);else{const j=b?b(z,W,M,J):f;g[S]=j[0],g[S+1]=j[1],g[S+2]=j[2]}p&&(nt.applyMatrix4(p),J.applyMatrix3(Dt).normalize()),tt&&J.negate(),x[S]=nt.x,x[S+1]=nt.y,x[S+2]=nt.z,v[S]=J.x,v[S+1]=J.y,v[S+2]=J.z,m[T*4]=H,m[T*4+1]=O,m[T*4+2]=_?_[3]:0,m[T*4+3]=V,U&&(C[T*2]=U[0],C[T*2+1]=U[1]),_&&(D[S]=_[0],D[S+1]=_[1],D[S+2]=_[2],this.sway=!0),I?(F[S]=I[0],F[S+1]=I[1],F[S+2]=I[2]):F[S]=-1}const ct=s?s.count:y,X=s?s.array:null;this.iroom(ct);const K=this.I;let k=this.ni;for(let d=0;d+2<ct;d+=3){const z=r+(X?X[d]:d),W=r+(X?X[d+1]:d+1),M=r+(X?X[d+2]:d+2);K[k]=z,tt?(K[k+1]=M,K[k+2]=W):(K[k+1]=W,K[k+2]=M),k+=3}return this.ni=k,this.n+=y,t.dispose(),this}get triangles(){return this.ni/3}async bake(t,e){const a=this.P,n=this.N,s=this.L,r=[0,.6,0];for(let p=0;p<this.n;p++){(p&255)===0&&await e.yield();const y=p*3;s[y]>=0||(t(a[y],a[y+1],a[y+2],n[y],n[y+1],n[y+2],r),s[y]=r[0],s[y+1]=r[1],s[y+2]=r[2])}}build(t){const e=new c.BufferGeometry,a=this.n,n=this.P,s=this.N,r=this.L.slice(0,a*3),p=[0,.6,0];for(let y=0;y<a;y++){const h=y*3;r[h]>=0||(t?(t(n[h],n[h+1],n[h+2],s[h],s[h+1],s[h+2],p),r[h]=p[0],r[h+1]=p[1],r[h+2]=p[2]):(r[h]=0,r[h+1]=.6,r[h+2]=0))}return e.setAttribute("position",new c.BufferAttribute(n.slice(0,a*3),3)),e.setAttribute("normal",new c.BufferAttribute(s.slice(0,a*3),3)),e.setAttribute("color",new c.BufferAttribute(this.C.slice(0,a*3),3)),e.setAttribute("aM",new c.BufferAttribute(this.M.slice(0,a*4),4)),e.setAttribute("aUV",new c.BufferAttribute(this.U.slice(0,a*2),2)),e.setAttribute("aL",new c.BufferAttribute(r,3)),e.setAttribute("aSw",new c.BufferAttribute(this.S.slice(0,a*3),3)),e.setIndex(new c.BufferAttribute(a>65535?this.I.slice(0,this.ni):new Uint16Array(this.I.subarray(0,this.ni)),1)),e.computeBoundingSphere(),e.boundingSphere.radius+=3,e}}const ie=(o,t=14)=>new c.LatheGeometry(o.map(e=>new c.Vector2(Math.max(e[0],.001),e[1])),t);function ne(o,t,e,a=.4,n=10,s=6){const r=new c.SphereGeometry(1,n,s),p=r.attributes.position,y=h=>Math.sign(h)*Math.pow(Math.abs(h),a);for(let h=0;h<p.count;h++)p.setXYZ(h,y(p.getX(h))*o*.5,y(p.getY(h))*t*.5+t*.5,y(p.getZ(h))*e*.5);return r.computeVertexNormals(),r}function se(o,t,e,a=e,n=6){const s=new c.Vector3(t[0]-o[0],t[1]-o[1],t[2]-o[2]),r=s.length(),p=new c.CylinderGeometry(a,e,r,n,2,!1);return p.applyQuaternion(new c.Quaternion().setFromUnitVectors(new c.Vector3(0,1,0),s.normalize())),p.translate((o[0]+t[0])/2,(o[1]+t[1])/2,(o[2]+t[2])/2),p}function re(o,t,e,a,n){const s=new c.PlaneGeometry(o,t,e,a),r=s.attributes.position;if(s.translate(0,-t/2,0),n){for(let p=0;p<r.count;p++)r.setZ(p,n(r.getX(p)/o+.5,-r.getY(p)/t));s.computeVertexNormals()}return s}const at=32,Wt=12,Kt=`
attribute vec4 aM; attribute vec2 aUV; attribute vec3 aL; attribute vec3 aSw;
uniform float uTime;
varying vec3 vW, vN, vC, vL; varying vec4 vM; varying vec2 vUV;
void main(){
  vec3 p=position;
  #ifdef SWAY
  float ph=aM.z, f=.7+fract(ph*3.7)*.9;
  f*=1.+3.6*step(1.5,ph);                         // phase 2..3: the quick ones (a hen pecking)
  p+=aSw*(sin(uTime*f+ph*6.283)+.35*sin(uTime*f*2.3+ph*17.));
  #endif
  vec4 w=modelMatrix*vec4(p,1.); vW=w.xyz; vN=normalize(mat3(modelMatrix)*normal);
  vC=color; vL=aL; vM=aM; vUV=aUV;
  gl_Position=projectionMatrix*viewMatrix*w;
}`,Yt=`precision highp float;
uniform float uTime, uDim, uFogDen, uCount, uShimmer;
uniform vec3 uSun, uSunCol, uGlareCol, uFillCol, uTopCol, uFogCol, uHotCol, uSky;
uniform vec4 uWinC[${at}], uWinN[${at}], uWinR[${at}], uHot[${Wt}];
varying vec3 vW, vN, vC, vL; varying vec4 vM; varying vec2 vUV;
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
float band(float x, float c, float w, float aa){ return 1.-smoothstep(w-aa, w+aa, abs(x-c)); }
// the pick strokes near P: t1, t2 span the surface, w = half width of a groove in metres (never under a pixel)
float picks(vec3 P, vec3 t1, vec3 t2, float w){
  vec3 c0=floor(P/.85-.5); float acc=0., k=.05/w;
  for(int i=0;i<8;i++){
    float fi=float(i); vec3 ci=c0+vec3(mod(fi,2.), mod(floor(fi*.5),2.), floor(fi*.25));
    vec3 h=vec3(h21(ci.xy+ci.z*7.13), h21(ci.yz+ci.x*3.71), h21(ci.zx+ci.y*5.39));
    vec3 lp=P-(ci+.5+(h-.5)*.3)*.85;
    float a=dot(lp,t1), b=dot(lp,t2), ang=.82+(h.x-.5)*.5, ca=cos(ang), sn=sin(ang);
    float al=a*ca+b*sn, ac=b*ca-a*sn, hl=.23+.09*h.y;
    float body=(1.-smoothstep(hl*.5,hl,abs(al)))*step(.16,h.z);
    float g=ac/w, l=(ac-w*1.7)/w;
    acc+=body*(exp(-l*l)*.55-exp(-g*g))*k;
  }
  return acc;
}
void main(){
  float kind=floor(vM.x+.5);
  vec3 N=normalize(vN);
  vec3 V=normalize(cameraPosition-vW);
  #ifdef TWOSIDE
  if(dot(N,V)<0.) N=-N;
  #endif
  vec2 q=vW.xz+vW.y*vec2(.37,.61);
  vec2 uv=vUV; float aa=max(fwidth(uv.x)+fwidth(uv.y), 1e-3);
  float n1=vn(q*.21), n2=vn(q*1.7+3.), n3=vn(q*7.3);
  float rr=length(vW.xz), pxw=min(length(fwidth(vW)),1.);          // pxw: the size of a pixel on the rock, in metres
  vec3 base=vC; float gloss=0., strokes=0., hz=1.;
  vec3 OCHRE=vec3(.34,.088,.05), CREAM=vec3(.80,.72,.58), INDIGO=vec3(.018,.05,.16), MADDER=vec3(.42,.045,.03);
  if(kind<.5){                                   // carved rock: pick strokes in bands, ochre dado between 8 and 10.2 m
    // pick strokes: short slanting gouges scattered over the rock, each a dark groove with a raised lip on one side. One
    // stroke lives in each 0.85 m cell of space and is laid in the plane of the surface, so strokes are the same size on
    // every wall, vault and reveal however it curves, and there are no bands or seams. They are gone with distance well
    // before they could beat against the pixel grid.
    if(pxw<.13){
      vec3 ref=normalize(mix(vec3(0.,1.,0.), vec3(-vW.z,0.,vW.x)/max(rr,1.), smoothstep(.55,.85,abs(N.y)))+vec3(0.,1e-3,0.));
      vec3 t1=cross(N,ref); t1*=inversesqrt(dot(t1,t1)+1e-4); vec3 t2=cross(N,t1);
      strokes=picks(vW,t1,t2,max(.05,pxw*.9))*smoothstep(.2,.45,vn(q*.12+3.))*(1.-smoothstep(.05,.13,pxw));
    }
    base*=(.8+.36*n1)*(.9+.2*n2)*max(1.+.5*strokes,.25);
    hz=smoothstep(7.,15.5,uv.y);                     // 0 on the walls below the sills, 1 on the vault
    base=mix(base, base*vec3(1.06,.9,.82), smoothstep(.55,.9,vn(q*.06)));
    float d=(uv.y-8.)/2.2;
    if(d>-.05&&d<1.05){
      float cell=floor(uv.x/7.), cx=(uv.x-cell*7.)/7., pick=h21(vec2(cell,3.)), a2=aa/2.2;
      float m=band(d,.06,.035,a2)+band(d,.94,.035,a2);
      float zz=abs(fract(uv.x/1.6)-.5)*2.;
      float zig=band(d,.3+zz*.4,.07,a2*1.5);
      float px=(cx-.5)*7./2.2, py=d-.5, rr=length(vec2(px,py));
      float ang=atan(py, px+1e-4);
      float wheel=band(rr,.3,.05,a2)+step(rr,.3)*band(fract(ang*1.2732+.5),.5,.13,.05)+step(rr,.07);
      float comb=step(abs(px),.55)*step(abs(py),.3)*max(step(.2,py), step(.5,fract(px*4.+.25)));
      float mot=pick<.5?zig:(pick<.78?max(wheel, zig*step(.5,abs(px))):max(comb, zig*step(.75,abs(px))));
      m=clamp(m+mot,0.,1.)*(.55+.45*n2)*smoothstep(.15,.45,n3+.25);
      base=mix(base, OCHRE*(.8+.5*n1), m*.9);
    }
    if(uv.y>300.){                               // the plain rock round the great window: painted zigzag courses
      float zz=abs(fract(uv.x/1.9)-.5)*2., cy=fract((uv.y-382.)/2.3)*2.3, a4=aa*1.2;
      base=mix(base, OCHRE*(.8+.5*n1), band(cy,.55+zz*.75,.11,a4)*(.55+.45*n2)*smoothstep(.15,.45,n3+.25)*.85);
    }
    // a second painted course low on the wall: a line and a row of teeth
    float d2=(uv.y-2.95)/.95;
    if(d2>-.15&&d2<1.2){
      float a3=aa/.95, tooth=1.-abs(fract(uv.x/1.25)-.5)*2.;
      float m2=max(band(d2,1.08,.05,a3), smoothstep(-a3,a3,tooth-d2/.82-.04)*step(0.,d2));
      base=mix(base, OCHRE*(.8+.5*n1), m2*(.55+.45*n2)*smoothstep(.15,.45,n3+.25)*.85);
    }
  } else if(kind<1.5){                           // plain: wood, clay, straw, fur
    base*=(.8+.34*n2)*(.9+.2*n3);
  } else if(kind<2.5){                           // cloth: stripes of cream by vM.w, weave
    if(vM.w>1.5){                                 // a patchwork quilt: counter-changed diamonds, seams between the patches
      vec2 pq=vec2(uv.x+uv.y,uv.x-uv.y)*1.1, ci=floor(pq), cf=fract(pq)-.5;
      float chk=mod(ci.x+ci.y,2.), star=step(abs(cf.x)+abs(cf.y),.3);
      base=mix(mix(base,CREAM,chk), mix(CREAM,base,chk), star)*(1.-.3*step(.45,max(abs(cf.x),abs(cf.y))));
    } else base=mix(base, CREAM, step(.5,fract(uv.y))*vM.w);
    base*=(.9+.1*sin(uv.x*31.)*sin(uv.y*31.))*(.88+.2*n2);
    float qd=min(abs(fract(uv.x*.5+uv.y*.5)-.5), abs(fract(uv.x*.5-uv.y*.5)-.5));
    base*=.82+.18*smoothstep(.0,.06,qd);
  } else if(kind<3.5){                           // metal
    base*=(.75+.3*n2); gloss=1.;
  } else if(kind<4.5){                           // kilim: uv.x 0..1 across, uv.y metres along
    float u=fract(uv.x), v=uv.y, e=abs(u-.5)*2.;
    float dm=abs(fract(v/5.)-.5)*2.+e*.9;
    float k=floor(dm*5.+.001); float md=mod(k,4.);
    vec3 c=md<.5?MADDER:(md<1.5?CREAM:(md<2.5?INDIGO:vec3(.62,.3,.12)));
    float st=step(.5,fract(dm*5.))*step(.5,fract(v*1.2+u*9.));
    c=mix(c, c*.55+CREAM*.2, st*.5);
    float bd=step(.86,e); float tri=step(fract(v/1.6), abs(fract(e*3.5)-.5)*2.);
    c=mix(c, mix(INDIGO,CREAM,tri), bd);
    c=mix(c, MADDER, step(.965,e));
    base=mix(c,vec3(dot(c,vec3(.33))),.12)*(.62+.2*n2)*(.9+.1*sin(v*40.)); base*=mix(1., vC.r*1.6, .5);
  } else if(kind<5.5){                           // painted niche wall: sunbursts at the tile corners
    base*=(.84+.3*n1)*(.92+.16*n2);
    vec2 c=vec2(abs(uv.x)-vM.w, min(uv.y, 4.6-uv.y));
    float rr=length(c), ang=atan(c.y, c.x-1e-4);
    float sb=step(rr,.42)+step(.55,rr)*step(rr,1.05)*step(.5,fract(ang*2.546));
    base=mix(base, OCHRE*(.85+.4*n1), clamp(sb,0.,1.)*.85*smoothstep(.2,.5,n3+.3));
  } else if(kind<6.5){                           // embers
    float e=vn(vW.xz*.55+uTime*vec2(.13,-.09))*vn(vW.xz*1.9-uTime*.21);
    base=vec3(.12,.03,.01); gl_FragColor.a=1.;
    vec3 hot=vec3(1.9,.42,.05)*(.16+1.7*e*e)*(.85+.15*sin(uTime*7.+vW.x));
    gl_FragColor=vec4(hot,1.); return;
  } else {                                       // rock floor: uv = (s, lateral)
    vec2 g=uv/vec2(5.5,4.2); g.x+=floor(g.y)*.37; vec2 gf=abs(fract(g)-.5);
    float joint=smoothstep(.5-aa*.3-.012,.5-aa*.3-.035, max(gf.x,gf.y));
    float worn=1.-smoothstep(2.,9.,abs(uv.y));
    base*=(.8+.34*n1)*(.9+.2*n2)*(.72+.28*joint)*(1.+.12*worn)*(.95+.1*h21(floor(g)));
    base=mix(base, vec3(.62,.5,.26)*(.7+.5*n3), vC.g>vC.r?0.:smoothstep(.62,.8,n2*.6+n3*.5)*.0);
  }
  // light through the window rectangles: the sun (one direction for all), or under a snow sky (uSky.z = 1) the cold
  // daylight that each window lets fall along its own axis, soft edged and fading with distance
  float sunL=0., sunK=0.;
  for(int i=0;i<${at};i++){
    vec4 c=uWinC[i], n=uWinN[i], r=uWinR[i];
    vec3 sd=mix(uSun, vec3(n.x*uSky.x, uSky.y, n.z*uSky.x), uSky.z);
    float dn=dot(sd,n.xyz);
    if(float(i)<uCount && dn>.04){
      float t=dot(c.xyz-vW,n.xyz)/dn;
      vec3 hp=vW+sd*t-c.xyz;
      float a=abs(dot(hp.xz,r.xz)), b=abs(hp.y), hole=r.y, e=mix(.2+t*.013,.14+t*.006,hole)*(1.+1.9*uSky.z);
      float m=(1.-smoothstep(n.w-e,n.w+e,a))*(1.-smoothstep(r.w-e,r.w+e,b));
      float ex=a/n.w, ey=b/r.w, el=sqrt(sqrt(ex*ex*ex*ex+ey*ey*ey*ey)), ee=e/n.w;
      m=mix(m, 1.-smoothstep(1.-ee,1.+ee,el), hole)*step(0.,t)*(1.-smoothstep(c.w*.75,c.w,t));
      m*=1.-.85*(1.-hole)*(1.-uSky.z)*max(1.-smoothstep(.16-e*.3,.16+e,a), 1.-smoothstep(.16-e*.3,.16+e,abs(b-r.w*.3)));
      m*=mix(1., 1.35/(1.+t*t*.0011), uSky.z);
      float ld=dot(N,sd), l=max(ld,0.);
      if(kind>1.5&&kind<2.5) l=l*.7+.3*abs(ld);                    // cloth lets light through
      l=l*1.4/(.4+l);
      sunL=max(sunL,m); sunK=max(sunK,m*l);
    }
  }
  float shim=1.+uShimmer*(vn(vec2(vW.y*.1-uTime*.9, vW.x*.06+vW.z*.08+uTime*.2))+.5*vn(vec2(vW.x*.21+uTime*1.3, vW.z*.21+vW.y*.17-uTime*.7))-.75);
  vec3 sun=uSunCol*sunK*uDim*max(1.+.25*strokes,.4)*mix(1.,shim,.5);
  // where the bounce is strong it carries more of the window's own white, so lit rock is apricot and shade rose-tan
  vec3 fillC=mix(uFillCol, uFillCol*.55+vec3(.42,.4,.36)*dot(uFillCol,vec3(.6)), smoothstep(.45,.9,vL.y));
  vec3 light=fillC*vL.y*(.8+.2*N.y)*mix(1.,shim,.25)*(.5+.5*uDim);
  vec3 top=uTopCol*vL.z*mix(1.,shim,.25);
  vec3 glare=uGlareCol*vL.x*shim*uDim*(kind<.5?mix(.5,1.,hz):1.);
  for(int i=0;i<${Wt};i++){
    vec3 d=uHot[i].xyz-vW; float d2=dot(d,d);
    float fl=.82+.18*sin(uTime*(9.+float(i)*2.3)+float(i)*1.7)*sin(uTime*3.7+float(i));
    light+=uHotCol*uHot[i].w*fl*(.25+.75*max(dot(N,d*inversesqrt(d2+1e-3)),0.))/(1.+d2*.011);
  }
  // snow glare is so much bluer than the rock is warm that it bleaches it: lit by it, apricot goes blue-white
  vec3 cool=mix(base, vec3(dot(base,vec3(.4,.4,.2))), kind<.5?mix(.25,.84,hz):(kind>6.5?.5:.35));
  // the white light of the well and of the open shaft, and the daylight of a snow sky, bleach it a little as well
  vec3 col=base*light+mix(base,cool,.45)*top+mix(base,vec3(dot(base,vec3(.4,.4,.2))),.8*uSky.z)*sun+cool*glare; light+=glare+top+sun;
  if(gloss>.5){
    vec3 R=reflect(-V,N); float up=smoothstep(-.25,.65,R.y);
    vec3 env=mix(uFillCol*.3, uGlareCol*1.15+uTopCol*.25, up)*(.6+.8*vn(R.xz*2.6+R.y*1.7));
    float fr=pow(1.-max(dot(N,V),0.),3.);
    col=base*(light*.28+env*(.75+.6*fr))+base*uSunCol*pow(max(dot(R,uSun),0.),20.)*sunL*1.2+vec3(1.,.92,.8)*pow(max(dot(R,normalize(vec3(.3,.8,.5))),0.),40.)*.3;
  }
  col+=vC*vM.y*(.9+.1*sin(uTime*11.+vW.x*3.));
  float fd=length(cameraPosition-vW)*uFogDen; col=mix(uFogCol, col, exp(-fd*fd));
  gl_FragColor=vec4(col,1.);
}`;function Qt(){const o=()=>Array.from({length:at},()=>new c.Vector4),t={uTime:{value:0},uDim:{value:1},uFogDen:{value:.004},uCount:{value:0},uShimmer:{value:.3},uSun:{value:new c.Vector3(.646,.407,.646)},uSunCol:{value:new c.Color(3.2,2.7,2.1)},uGlareCol:{value:new c.Color(.86,1,1.2)},uFillCol:{value:new c.Color(.62,.5,.46)},uTopCol:{value:new c.Color(1.25,1.3,1.4)},uFogCol:{value:new c.Color("#dfeaf6")},uHotCol:{value:new c.Color(2.4,.95,.3)},uWinC:{value:o()},uWinN:{value:o()},uWinR:{value:o()},uHot:{value:Array.from({length:Wt},()=>new c.Vector4(0,-999,0,0))},uSky:{value:new c.Vector3(.88,.47,0)}},e=[];return{U:t,windows:[],material(a={}){const n=new c.ShaderMaterial({uniforms:{...t},vertexShader:Kt,fragmentShader:Yt,vertexColors:!0,side:a.side??c.FrontSide,defines:{...a.sway?{SWAY:1}:{},...a.side===c.DoubleSide?{TWOSIDE:1}:{}}});return e.push(n),n},setWindows(a){this.windows=a,t.uCount.value=Math.min(at,a.length);for(let n=0;n<t.uCount.value;n++){const s=a[n];t.uWinC.value[n].set(s.c.x,s.c.y,s.c.z,s.reach??70),t.uWinN.value[n].set(s.n.x,0,s.n.z,s.hw),t.uWinR.value[n].set(-s.n.z,s.hole?1:0,s.n.x,s.hh)}},setHot(a,n,s,r,p){t.uHot.value[a].set(n,s,r,p)}}}const st=[[-1.6,.6],[-1.6,2.5],[-1.05,3.45],[0,4],[1.05,3.45],[1.6,2.5],[1.6,.6]],ut=4.6,bt=xt("#e9b98e"),mt=xt("#b9795a"),Pt=xt("#b4432b"),Nt=xt("#d9b45e"),Rt=xt("#f1dcc2"),Q=(o,t)=>[o[0]*t,o[1]*t,o[2]*t];async function Lt(o,t){const{rings:e,cols:a,y0:n,rad:s,skip:r,lightAt:p,glow:y}=t,h=[],R=[],u=[],l=[],b=[],f=[],x=[];for(let v=0;v<e;v++)for(let g=0;g<a;g++){g===0&&t.pause&&await t.pause();const m=(g+v%2*.5)/a*Math.PI*2,C=n+v*ut,D=s(C+2.3),F=Math.PI*D/a,H=r?r(m,C+2.3,v,g):0;if(H===!0)continue;if(H===3){const z=[],W=p(C+2.3);o.lit=W;for(let M=0;M<=7;M++)for(let T=0;T<=6;T++){const S=m+(T/6*2-1)*F/D,U=C+M/7*ut,_=s(U);z.push(o.v(_*Math.cos(S),U,-_*Math.sin(S),-Math.cos(S),0,Math.sin(S),Q(bt,.95),0,0,S*_,U+(t.blankV??20)))}for(let M=0;M<7;M++)for(let T=0;T<6;T++){const S=m+((T+.5)/6*2-1)*F/D;t.cut&&t.cut(S,C+(M+.5)/7*ut)||o.quadN(z[M*7+T],z[M*7+T+1],z[(M+1)*7+T+1],z[(M+1)*7+T])}continue}const O=(s(C+3.3)-s(C+1.3))/2,V=Math.hypot(1,O),I=(k,d,z,W,M,T,S,U,_=5,j=0)=>{const ht=m+k/D,rt=C+d,it=s(rt)+z,wt=Math.cos(ht),ft=Math.sin(ht),gt=p(rt);return o.lit=[gt[0]*U,gt[1]*(.4+.6*U),gt[2]*U],o.v(it*wt,rt,-it*ft,-ft*W+wt*T,M,-wt*W-ft*T,S,_,j,k,d,F)},tt=.9+.2*((v*7+g*13)%10/10),ct=Q(bt,tt),X=Q(Pt,.85+.3*((v*5+g*3)%7/7)),K=[[-F,0],[-F,2.5],[-F,ut],[0,ut],[F,ut],[F,2.5],[F,0]];for(let k=0;k<7;k++){const d=st[k],z=d[0],W=d[1]-2.2,M=Math.hypot(z,W),T=z/M,S=W/M,U=k===0||k===6;R[k]=I(d[0],d[1],0,0,O/V,-1/V,X,1),u[k]=I(d[0]+T*.38,d[1]+S*.38,0,0,O/V,-1/V,X,1),l[k]=I(d[0]+T*.38,d[1]+S*.38,0,0,O/V,-1/V,U?Rt:ct,1),b[k]=I(K[k][0],K[k][1],0,0,O/V,-1/V,U?Q(Rt,.9):ct,1),f[k]=I(d[0],d[1],.02,-T,-S,0,U?Nt:Q(mt,.95),.8),x[k]=I(d[0],d[1],2.5,-T,-S,0,U?Q(Nt,.7):Q(mt,.6),.34)}for(let k=0;k<7;k++){const d=(k+1)%7;o.quadN(R[k],R[d],u[d],u[k]),o.quadN(l[k],l[d],b[d],b[k]),o.quadN(f[k],f[d],x[d],x[k])}if(H===2){const k=I(0,2.3,1.3,0,0,-1,y,1,1,1);let d=I(st[0][0],st[0][1],1.3,0,0,-1,y,1,1,1),z=d;for(let W=1;W<7;W++){const M=I(st[W][0],st[W][1],1.3,0,0,-1,y,1,1,1);o.triN(k,d,M),d=M}o.triN(k,d,z)}else{const k=I(0,2.2,2.5,0,0,-1,Q(mt,.5),.3,1);for(let z=0;z<7;z++){const W=I(st[z][0],st[z][1],2.5,0,0,-1,Q(mt,z===0||z===6?.75:.5),.3,1),M=I(st[(z+1)%7][0],st[(z+1)%7][1],2.5,0,0,-1,Q(mt,.5),.3,1);o.triN(k,W,M)}const d=s(C+1.2)+.3;h.push([d*Math.cos(m),C+1.02,-d*Math.sin(m),m,v])}}return o.lit=null,h}function ot(o,t){const{y0:e,y1:a,ny:n,na:s,rad:r,lightAt:p,kind:y=0,out:h=!1,c:R=bt,skip:u}=t,l=[];for(let f=0;f<=n;f++)for(let x=0;x<=s;x++){const v=G(e,a,f/n),g=x/s*Math.PI*2,m=r(v,f/n),C=r(v+.5,f/n)-r(v-.5,f/n),D=Math.hypot(1,C)*(h?-1:1),F=Math.cos(g),H=Math.sin(g),O=t.yOf?t.yOf(f/n):v,V=.9+.2*Math.sin(x*12.9898+f*78.233)*Math.sin(x*3.7);o.lit=p(O,m),l.push(o.v(m*F,O,-m*H,t.up?0:-F/D,t.up||C/D,t.up?0:H/D,Q(typeof R=="function"?R(g,m):R,V),y,0,y===7?g*20:g*m,y===7?m-22:O-(t.vBase??q)))}const b=s+1;for(let f=0;f<n;f++)for(let x=0;x<s;x++)u&&u((x+.5)/s*Math.PI*2,r(G(e,a,(f+.5)/n),(f+.5)/n))||o.quadN(l[f*b+x],l[f*b+x+1],l[(f+1)*b+x+1],l[(f+1)*b+x]);o.lit=null}function jt(){const o=[],t=[],e=[],a=[];let n=0;const s=(v,g,m,C,D=0,F=1,H=0)=>(o.push(v,g,m),t.push(D,F,H),e.push(C),n++),r=[[-1,.02,.05],[-.78,.18,.03],[-.42,.38,0],[.05,.47,0],[.46,.4,.1],[.72,.21,.25],[.92,.26,.42],[1.08,.22,.46],[1.2,.09,.42],[1.38,.01,.38]],p=6,y=[];for(let v=0;v<r.length;v++){const g=r[Math.max(0,v-1)],m=r[Math.min(r.length-1,v+1)],C=(m[1]-g[1])/(m[0]-g[0]),D=(m[2]-g[2])/(m[0]-g[0]);y[v]=[];for(let F=0;F<p;F++){const H=F/p*Math.PI*2+Math.PI/2,O=Math.cos(H),V=Math.sin(H),I=-C-V*D,tt=Math.hypot(O,V,I);y[v][F]=s(O*r[v][1]*.92,r[v][2]+V*r[v][1]*.85,r[v][0],0,O/tt,V/tt,I/tt)}}for(let v=0;v+1<r.length;v++)for(let g=0;g<p;g++){const m=(g+1)%p;a.push(y[v][g],y[v+1][g],y[v+1][m],y[v][g],y[v+1][m],y[v][m])}const h=[[.3,.55,-.44,.1],[.95,.8,-.52,.34],[1.55,.74,-.46,.56],[2.1,.46,-.36,.76],[2.55,.06,-.36,.92],[2.86,-.54,-.64,1]];for(const v of[-1,1]){const g=h.map(m=>[s(v*m[0],.15,m[1],v*m[3],0,1,.6),s(v*m[0],.23-.06*m[3],(m[1]+m[2])/2+.05,v*m[3],0,1,.05),s(v*m[0],.13,m[2],v*m[3],0,1,-.6)]);for(let m=0;m+1<h.length;m++)for(let C=0;C<2;C++)a.push(g[m][C],g[m+1][C],g[m][C+1],g[m][C+1],g[m+1][C],g[m+1][C+1])}const R=s(0,.06,-.66,0),u=s(-.62,.05,-1.46,0),l=s(-.24,.07,-1.68,0),b=s(.24,.07,-1.68,0),f=s(.62,.05,-1.46,0);a.push(R,u,l,R,l,b,R,b,f);const x=new c.BufferGeometry;return x.setAttribute("position",new c.Float32BufferAttribute(o,3)),x.setAttribute("normal",new c.Float32BufferAttribute(t,3)),x.setAttribute("aWing",new c.Float32BufferAttribute(e,1)),x.setIndex(a),x}const $t=`
attribute float aWing; attribute vec4 iA, iB; attribute float iC, iD;
uniform float uTime, uU, uDur, uPart; uniform vec3 uPortal, uPDir, uPRight, uPUp;
varying vec3 vN, vW, vQ; varying vec4 vK;
vec3 route(float s, float t, out float lift){
  float seed=iB.x, rho=iB.y, kind=iB.w;
  if(kind>.5){ lift=1.; float th=seed*43.98+t*(.42+.3*fract(seed*13.7)); float yc=iA.y+5.*sin(t*.23+seed*9.)+2.*sin(t*.61+seed*4.); rho*=.8+.2*sin(t*.31+seed*21.);
    vec3 circ=vec3(rho*cos(th), yc, -rho*sin(th));
    if(kind<1.5) return circ;
    // the escort: these circle high in the shaft until the last climb, then form up round the line from the camera to
    // the great window and overtake us all the way out through it, a ring of wings round the opening (iB.z = how far
    // out from that line, iD = where in the stream)
    float lead=mod(iD+t*6.5,52.)-9., dc=dot(uPortal-cameraPosition,uPDir)-lead, ph=seed*18.85+.25*sin(t*.8+seed*40.);
    vec3 q=uPortal-uPDir*dc+(uPRight*cos(ph)+uPUp*sin(ph))*(iB.z+lead*.07)*(1.+.07*sin(t*1.7+seed*20.))*(.6+.4*smoothstep(2.,18.,dc));
    return mix(circ,q,smoothstep(.862,.912,uU)); }
  lift=smoothstep(0.,1.05,s);
  float yv=iA.y+2.5+max(s,0.)*iB.z;
  // the ribbon: two strands of one helix round the axis (a turn every 38 m) that turns slowly on itself as the flight
  // goes on; a bird keeps its place across the ribbon (iD: the strand that was nearer its niche when it left, and where
  // across that strand) and climbs along it at its own speed, so the gaps between the coils stay open
  float th=(yv-78.)/6.+(iA.w*uDur+s)*.3+iD;
  rho+=.7*sin(t*.9+seed*31.);
  vec3 vort=vec3(rho*cos(th), yv+.8*sin(t*.7+seed*13.), -rho*sin(th));
  vec3 p=mix(iA.xyz+vec3(0.,2.2*sin(lift*3.1416),0.), vort, lift);
  float e=smoothstep(160.,186.,yv)*lift;
  float ph=seed*61.;
  vec3 q=uPortal-uPDir*(1.-e)*26.+(uPRight*cos(ph)*.92+uPUp*(sin(ph)*.9+.12))*(5.6+2.4*fract(seed*5.3))*(1.-e*.14);
  return mix(p,q,e*e*(3.-2.*e));
}
// keep the air round the camera and along its line to the window open: nearer birds are moved out, further ones less,
// so that nothing piles up on the edge of the clearing
vec3 part(vec3 p){
  vec3 a=cameraPosition, ab=uPortal-a; float h=clamp(dot(p-a,ab)/max(dot(ab,ab),1.),0.,1.);
  vec3 d=p-(a+ab*h); float dist=length(d)+1e-3;
  float rad=mix(mix(16.,8.5,smoothstep(0.,.3,h)),5.6,smoothstep(.8,1.,h)), R=rad*2.2;
  return p+d/dist*max(rad-dist*rad/R,0.)*uPart;
}
void main(){
  float seed=iB.x, kind=iB.w, s=(uU-iA.w)*uDur, l0, l1;
  vec3 p0=route(s,uTime,l0), p1=route(s+.12,uTime+.12,l1);
  float esc=step(1.5,kind), k1=min(kind,1.);
  p0=mix(p0,part(p0),l0*(1.-esc)); p1=mix(p1,part(p1),l1*(1.-esc));
  vec3 inward=normalize(vec3(-iA.x,0.,-iA.z)+vec3(1e-4,0.,0.));
  float sh=.55*sin(uTime*.6+seed*20.)+.25*sin(uTime*1.9+seed*7.);
  vec3 perch=normalize(inward+vec3(-inward.z,0.,inward.x)*sh);
  vec3 d=p1-p0; vec3 fly=d*inversesqrt(dot(d,d)+1e-6);
  vec3 fw=normalize(mix(perch,fly,l0)+vec3(0.,1e-4,0.));
  vec3 rt=cross(vec3(0.,1.,0.),fw); rt*=inversesqrt(dot(rt,rt)+1e-5); vec3 up=cross(fw,rt);
  float roll=iC>.5?6.2832*smoothstep(.72,1.,sin(uTime*.9+seed*9.))*l0:0.;
  roll+=(.4*sin(uTime*.7+seed*33.))*l0;
  float cr=cos(roll), sr=sin(roll); vec3 r2=rt*cr+up*sr, u2=up*cr-rt*sr;
  vec3 q=position; float w=abs(aWing), sd=sign(aWing), isW=step(.01,w), ax=abs(q.x), cz=clamp(normal.z/.6,-1.,1.);
  // flying: the arm beats from the shoulder and the hand follows a little later from the wrist, so the wing bends
  float phs=uTime*(9.+3.5*fract(seed*3.3))+seed*50.;
  float aIn=(sin(phs)*.9+.12)*l0, aOut=aIn+(sin(phs-1.1)*.75-.12)*l0;
  float xin=min(ax,1.05), xo=max(ax-1.05,0.);
  vec3 qf=vec3(sd*(xin*cos(aIn)+xo*cos(aOut)), q.y+xin*sin(aIn)+xo*sin(aOut), q.z-.22*w*w*cos(phs));
  qf=mix(q-vec3(0.,.1*sin(phs),0.), qf, isW);
  // perched: the body fluffed, each wing folded to a blade along the flank, the bird tipped up on its feet
  float fat=mix(1.5,1.12,smoothstep(.45,.85,q.z));
  vec3 qp=mix(vec3(q.x*fat,q.y*fat*.94,q.z*.92), vec3(sd*(.76-.44*w*w), .3+.3*cz-.2*w, .5-1.7*w+.14*cz), isW);
  qp=vec3(qp.x, qp.y*.8+qp.z*.6+.3, qp.z*.8-qp.y*.6);
  q=mix(qp,qf,l0);
  float aw=mix(aIn,aOut,step(1.05,ax));
  vec3 n=normal; if(w>.01) n=normalize(mix(vec3(sd*.9,.45,0.), vec3(-sd*sin(aw), cos(aw), normal.z*.5), l0));
  float bob=(1.-l0)*.14*abs(sin(uTime*1.7+seed*30.));
  float yv=iA.y+2.5+max(s,0.)*iB.z;
  // on the wing a bird is drawn smaller than on its perch, so that one bird never covers more than a tenth of the picture
  float dcE=dot(uPortal-p0,uPDir);
  float sc=kind>1.5?.78*smoothstep(-1.,5.,dcE)*mix(1.,1.-smoothstep(35.,42.,dot(p0-cameraPosition,uPDir)),smoothstep(.862,.912,uU)):kind>.5?mix(1.,.8,step(${q}.,iA.y)):(1.-smoothstep(183.,187.,yv)*step(0.,s))*(1.-.5*smoothstep(166.,185.,yv)*step(0.,s))*mix(1.,.62,smoothstep(0.,.6,l0));
  vec3 c=p0+vec3(0.,bob,0.);
  float cd=distance(c,cameraPosition);
  sc*=smoothstep(5.,11.,cd)*mix(1.,mix(step(.5,fract(seed*7.31)),1.,smoothstep(18.,64.,cd)),l0*(1.-k1));     // the lifting flock thins round the camera
  vec3 wp=c+(r2*q.x+u2*q.y+fw*q.z)*sc;
  vN=normalize(r2*n.x+u2*n.y+fw*n.z); vW=(modelMatrix*vec4(wp,1.)).xyz;
  vK=vec4(iC, w, l0, kind*(1.-esc)); vQ=vec3(abs(position.x), position.z, position.y);
  gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);
}`,Xt=`precision highp float;
uniform vec3 uGlareCol, uFillCol, uTopCol, uFogCol, uSunCol, uSun, uBounce, uSky; uniform float uFogDen, uDark, uGain, uCount;
uniform vec4 uWinC[${at}], uWinN[${at}], uWinR[${at}];
varying vec3 vN, vW, vQ; varying vec4 vK;
void main(){
  vec3 N=normalize(vN);
  vec3 V=normalize(cameraPosition-vW);
  float face=dot(N,V)<0.?-1.:1.; N*=face;
  float wing=step(.01,vK.y), fl=vK.z, under=(1.-face)*.5, fw=fwidth(vQ.x)*2.4, body=(1.-wing)*(1.-fl);
  vec3 base=mix(vec3(.95,.94,.91), vec3(.24,.27,.35), vK.x);
  base=mix(base, base*vec3(.27,.29,.38), smoothstep(.62,.84,vK.y));            // dark flight feathers on the hand of the wing
  base*=1.-.25*smoothstep(.3,.5,vK.y)*(1.-smoothstep(.55,.7,vK.y));           // a bar across the coverts
  base=mix(base, base*vec3(.42,.46,.6), wing*(1.-fl));                         // folded, the wings lie grey along the flanks
  // the gaps between the flight feathers, on the trailing half of the wing (gone before they could alias)
  float gap=(1.-smoothstep(0.,.3,abs(fract(vQ.x*2.4-vQ.y*1.2)-.5)*2.))*(1.-smoothstep(-.45,0.,vQ.y))*wing*(1.-smoothstep(.15,.5,fw));
  base*=1.-.34*gap;
  base=mix(base, base*vec3(.68,.71,.8), under*mix(.45,1.,wing)*fl);             // grey underside
  // on the perch: a grey-violet collar, a dark eye, the breast shading down to the feet
  base=mix(base, base*vec3(.55,.52,.68), body*smoothstep(.5,.6,vQ.y)*(1.-smoothstep(.76,.86,vQ.y))*.8);
  base*=1.-.9*(1.-wing)*(1.-smoothstep(.06,.1,length(vec3(vQ.x-.2,vQ.z-.47,vQ.y-1.02))));
  base*=mix(1.,mix(.42,1.,smoothstep(-.45,.3,vQ.z)),body);
  base=mix(base, vec3(.5,.26,.24), smoothstep(1.2,1.26,vQ.y)*(1.-wing));        // the beak
  base*=1.-.4*(1.-smoothstep(-1.55,-1.3,vQ.y))*(1.-wing);                            // a darker band at the end of the tail
  float dk=uDark*step(.5,vK.w);                                              // only the well flyers (swallows at dusk): dark slate, never black
  base=mix(base, vec3(.15,.16,.22), dk*.9);
  // the light comes down the shaft (and, for a bird on its perch, from the middle of it): backs and breasts bright,
  // bellies and flanks in grey shade; a spread wing seen from below lets some of the light through
  vec3 Lk=normalize(vec3(-vW.x*mix(.9,.35,fl), 26., -vW.z*mix(.9,.35,fl)));
  float kd=dot(N,Lk), lit=smoothstep(mix(.0,-.3,fl),mix(.95,.8,fl),kd), up=N.y*.5+.5, thru=wing*fl*under*max(-kd,0.);
  vec3 light=(uFillCol*.3+uTopCol*(.2+.95*lit+.6*thru)+uGlareCol*.12*(1.-up))*mix(.86,1.,fl);
  // a bird crossing one of the bars of sun from the flight holes flares, warmest on its rim
  float sunL=0.;
  for(int i=0;i<${at};i++){
    vec4 c=uWinC[i], n=uWinN[i], r=uWinR[i];
    vec3 sd=mix(uSun, vec3(n.x*uSky.x, uSky.y, n.z*uSky.x), uSky.z);
    float dn=dot(sd,n.xyz);
    if(float(i)<uCount && r.y>.5 && dn>.04){
      float t=dot(c.xyz-vW,n.xyz)/dn; vec3 hp=vW+sd*t-c.xyz;
      float ex=abs(dot(hp.xz,r.xz))/n.w, ey=abs(hp.y)/r.w, el=sqrt(sqrt(ex*ex*ex*ex+ey*ey*ey*ey));
      sunL=max(sunL,(1.-smoothstep(.85,1.1,el))*step(0.,t)*step(t,c.w));
    }
  }
  float rim=max(1.-abs(dot(N,V)),0.); rim*=rim;
  light+=uSunCol*sunL*(.2+.3*abs(dot(N,uSun))+1.1*rim)*mix(1.,.5,uSky.z);
  light+=uBounce*fl*(1.-.5*up);                                              // the last sun off the red wall, under a risen bird
  vec3 col=base*light*uGain+uTopCol*rim*.12*(1.-dk*.5);
  float fd=length(cameraPosition-vW)*uFogDen; col=mix(uFogCol, col, exp(-fd*fd));
  gl_FragColor=vec4(col,1.);
}`,Zt="varying vec3 vW; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w; }",Jt=`precision highp float;
uniform vec3 uZen, uHor; uniform float uTime, uCloud, uFlakes, uStars; varying vec3 vW;
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
void main(){
  vec3 rd=normalize(vW-cameraPosition); float up=clamp(rd.y,0.,1.);
  vec2 q=rd.xz/max(rd.y,.25);
  vec3 col=mix(uHor,uZen,smoothstep(.5,1.,up));
  float cl=vn(q*2.6+uTime*vec2(.06,.025))*.6+vn(q*6.1-uTime*vec2(.035,.07))*.4;
  col=mix(col, mix(uHor,vec3(1.),.55)*1.2, smoothstep(.42,.8,cl)*uCloud);
  col+=uStars*step(.992,h21(floor(q*70.)))*vec3(2.2,2.4,3.)*(.6+.4*sin(uTime*3.+q.x*90.));
  // flakes coming down the throat: three layers, the nearer ones larger and faster
  for(int k=0;k<3;k++){ float fk=float(k); vec2 g=vW.xz*(.16+fk*.11)+vec2(sin(uTime*.5+fk*2.)*.6+fk*7., uTime*(.5+fk*.35)); vec2 gi=floor(g);
    float d=length(fract(g)-.5-(vec2(h21(gi+fk),h21(gi+3.+fk))-.5)*.6); col=mix(col, vec3(1.25,1.3,1.4), smoothstep(.2,.06,d)*.8*uFlakes*step(.35,h21(gi+9.))); }
  gl_FragColor=vec4(col,1.);
}`,te="varying vec3 vW, vN; void main(){ vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; vN=normalize(mat3(modelMatrix)*normal); gl_Position=projectionMatrix*viewMatrix*w; }",ee=`precision highp float;
uniform vec3 uCol; uniform float uTime, uFlakes; varying vec3 vW, vN;
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f); return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }
void main(){
  vec3 d=cameraPosition-vW; float dist=length(d); vec3 V=d/max(dist,1e-3);
  float f=abs(dot(normalize(vN),V)); f=f*f*(3.-2.*f);                           // thick through the middle, nothing at the limb
  float ang=atan(vW.z,vW.x+1e-5);
  float n=vn(vec2(ang*3.,vW.y*.07+uTime*.22))*.6+vn(vec2(ang*9.,vW.y*.21+uTime*.5))*.4;
  float h=smoothstep(${q}.,${q+30}.,vW.y)*(.45+.55*smoothstep(${q}.,${E}.,vW.y));
  float a=f*h*(.55+.9*n)*smoothstep(4.,16.,dist);
  vec2 g=vec2(ang*26.,vW.y*.9+uTime*2.4), gi=floor(g);                          // snow coming down in it
  float fl=step(.9,h21(gi))*smoothstep(.4,.1,length(fract(g)-.5))*uFlakes*f*smoothstep(8.,24.,dist)*(1.-smoothstep(60.,110.,dist));
  gl_FragColor=vec4(uCol*(a+fl*9.),1.);
}`,pt=new c.Vector3(0,0,-1),yt=new c.Vector3(Math.sin(Mt),Math.cos(Mt),0),Vt=(o,t)=>{const e=Math.abs(o)-7,a=Math.abs(t+3.5)-4.5,n=Math.hypot(Math.max(e,0),Math.max(a,0))+Math.min(Math.max(e,a),0);return Math.min(n,Math.hypot(o,t-1)-7)};function Bt(o,t,e,a){if(qt(o,t,e,a),Math.abs(a[2])>18)return 0;const n=Vt(a[0],a[1]);return n>10?0:G(Math.max(a[2],G(3.5,-.6,L(1,3.4,n))),a[2],L(3.4,10,n))-a[2]}function qt(o,t,e,a){const n=o-vt.x,s=t-vt.y,r=e-vt.z;return a[0]=n*pt.x+s*pt.y+r*pt.z,a[1]=n*yt.x+s*yt.y+r*yt.z,a[2]=n*et.x+s*et.y+r*et.z,a}async function le(o,t={}){const e=o.rng.fork?o.rng.fork("dovecote"):o.rng,a=new c.Group,n=!t.rock,s=t.rock||Qt(),r=s.U,p=t.glow||[2.2,2.9,4],y=[0,0,0],h=new Ft,R=q+4,u=24,l=44,b=i=>[.1+.3*L(150,204,i),.5-.16*L(84,150,i),.1+.52*L(88,200,i)],f=Math.round(((t.holeAngle??-Math.PI/4)/(Math.PI*2)%1+1)%1*l),x=[],v=(t.holeRings||[[12,-4],[13,-2],[14,0],[15,2],[16,4]]).map(i=>[i[0],(i[1]+f+l)%l]),g=await Lt(h,{pause:o.yield,rings:u,cols:l,y0:R,rad:lt,lightAt:b,glow:p,blankV:300,skip(i,w,P,B){const Y=lt(w);if(qt(Y*Math.cos(i),w,-Y*Math.sin(i),y),Math.abs(y[2])<14&&Vt(y[0],y[1])<1.5)return!0;for(const[N,A]of[[0,0],[-2.3,-2.3],[2.3,-2.3],[-2.3,2.3],[2.3,2.3]]){const Z=lt(w+A),$=i+N/Z;if(Bt(Z*Math.cos($),w+A,-Z*Math.sin($),y)>.3)return 3}for(const N of v)if(N[0]===P&&N[1]===B){const A=Y+.4;return x.push({c:new c.Vector3(A*Math.cos(i),w,-A*Math.sin(i)),n:new c.Vector3(Math.cos(i),0,-Math.sin(i)),hw:2.1,hh:2.2,reach:98,hole:!0}),2}return 0}});o.yield&&await o.yield(),ot(h,{y0:q,y1:R,ny:2,na:88,rad:lt,lightAt:b}),o.yield&&await o.yield(),ot(h,{y0:R+u*ut,y1:E,ny:5,na:66,rad:lt,lightAt:b,vBase:188.4}),o.yield&&await o.yield();const m=lt(E),C=m-1.6,D=E+8;if(ot(h,{y0:E,y1:E+1.5,ny:1,na:66,rad:()=>m,c:Q(Pt,.9),lightAt:()=>[.3,.3,.45]}),ot(h,{y0:0,y1:1,ny:1,na:66,rad:(i,w)=>G(m,C,w),yOf:()=>E+1.5,up:-1,lightAt:()=>[.25,.3,.3]}),ot(h,{y0:E+1.5,y1:D,ny:3,na:66,rad:()=>C,lightAt:i=>[.5+.5*L(E+1.5,D,i),.2,.6+.3*L(E+1.5,D,i)],vBase:E-9}),o.yield&&await o.yield(),t.snowy){const i=new c.TorusGeometry(C-.5,1.5,7,54).rotateX(Math.PI/2),w=i.attributes.position;for(let P=0;P<w.count;P++){const B=w.getX(P),Y=w.getY(P),N=w.getZ(P),A=Math.atan2(N,B),Z=1+.3*Math.sin(A*7)*Math.sin(A*3+1)+.18*Math.sin(A*23);w.setXYZ(P,B*(1-.035*(Z-1)),Y*Z*(Y<0?1.5:1),N*(1-.035*(Z-1)))}i.computeVertexNormals(),h.add(i.translate(0,D-.4,0),{c:[.9,.94,1],kind:1,l:[1,.1,.75]});for(let P=0;P<46;P++){(P&15)===0&&o.yield&&await o.yield();const B=P/46*Math.PI*2+.07*Math.sin(P*5.1),Y=1.6+4.2*Math.abs(Math.sin(P*2.37))*Math.abs(Math.sin(P*.9+1)),N=C-.9-.5*Math.sin(P*3.3);h.add(new c.ConeGeometry(.2+Y*.045,Y,5,1).rotateX(Math.PI).translate(N*Math.cos(B),D-1.6-Y/2,-N*Math.sin(B)),{c:[.72,.86,1],kind:3,l:[.9,.2,.8]})}}o.yield&&await o.yield();for(let i=0;i<h.n;i++){(i&16383)===16383&&o.yield&&await o.yield();const w=i*3,P=Bt(h.P[w],h.P[w+1],h.P[w+2],y);P!==0&&(h.P[w]+=et.x*P,h.P[w+1]+=et.y*P,h.P[w+2]+=et.z*P)}o.yield&&await o.yield(),ot(h,{y0:0,y1:1,ny:11,na:110,rad:(i,w)=>G(13.6,30.2,w),yOf:()=>q,up:1,kind:7,lightAt:(i,w)=>[.4*(1-L(15,25,w)),.46,.2-.1*L(22,30,w)],skip:t.mouth,c:(i,w)=>Math.sin(i*23+w*1.3)+Math.sin(i*7-w*2.1)>1.1?Nt:bt}),ot(h,{y0:q,y1:q+3,ny:2,na:60,rad:()=>13.6,out:!0,lightAt:()=>[.1,.5,.4]}),ot(h,{y0:0,y1:1,ny:1,na:60,rad:(i,w)=>G(dt,13.6,w),yOf:()=>q+3,up:1,lightAt:()=>[.15,.5,.7]}),o.yield&&await o.yield();{const i=[],w=(N,A,Z,$)=>i.push([N,A,Z,$]);w(-7,-8,-.7,-.7),w(-7,-3.5,-1,0),w(-7,1,-1,0);for(let N=1;N<16;N++){const A=Math.PI-N/16*Math.PI;w(7*Math.cos(A),1+7*Math.sin(A),Math.cos(A),Math.sin(A))}w(7,1,1,0),w(7,-3.5,1,0),w(7,-8,.7,-.7),w(0,-8,0,-1);const P=[[0,.5,0],[0,-1.3,0],[.6,-1.7,1],[.95,-1.7,1],[.95,-1.7,3],[1.6,-1.7,3],[1.6,-1.7,1],[1.9,-1.7,1],[2.6,-1.2,2],[2.9,8,2]],B=[];let Y=0;for(let N=0;N<=i.length;N++){const A=i[N%i.length],Z=i[(N+i.length-1)%i.length];N&&(Y+=Math.hypot(A[0]-Z[0],A[1]-Z[1])),B[N]=P.map($=>{const Ot=A[0]+A[2]*$[0],Ut=A[1]+A[3]*$[0],_t=$[1],St=$[2]===0?[-A[2],-A[3],0]:$[2]===2?[A[2],A[3],-.2]:[0,0,-1];return nt.copy(vt).addScaledVector(pt,Ot).addScaledVector(yt,Ut).addScaledVector(et,_t),J.set(0,0,0).addScaledVector(pt,St[0]).addScaledVector(yt,St[1]).addScaledVector(et,St[2]).normalize(),h.lit=$[2]===0?[.5,.6,.9]:[.22,.55,.62],h.v(nt.x,nt.y,nt.z,J.x,J.y,J.z,$[2]===3?Pt:Q(bt,$[2]===0?1.05:.95),0,0,Y,13+$[0])})}for(let N=0;N<i.length;N++)for(let A=0;A+1<P.length;A++)A===3||A===5||h.quadN(B[N][A],B[N+1][A],B[N+1][A+1],B[N][A+1]);h.lit=null}o.yield&&await o.yield();const F=t.fillK??1;for(let i=1;i<h.n*3;i+=3)h.L[i]*=F;o.yield&&await o.yield();const H=s.material(),O=new c.Mesh(h.build(),H);O.name="dovecote",a.add(O);let V=h.triangles;o.yield&&await o.yield();const I=new Ft,tt=i=>[.03,.22,.62+.5*L(-8,q,i)],ct=await Lt(I,{pause:o.yield,rings:18,cols:19,y0:-6.8,rad:()=>dt,lightAt:tt,glow:p,skip:t.wellSkip||null,cut:t.wellCut});o.yield&&await o.yield(),ot(I,{y0:76,y1:q+3,ny:2,na:60,rad:()=>dt,lightAt:tt}),ot(I,{y0:0,y1:1,ny:3,na:30,rad:(i,w)=>G(.4,dt,w),yOf:()=>-6.8,up:1,kind:7,c:Q(mt,.6),lightAt:()=>[0,.25,.1]}),I.add(new c.TorusGeometry(dt-.1,.42,5,72).rotateX(Math.PI/2).translate(0,76.4,0),{c:(i,w,P)=>Q(Rt,.8+.2*Math.sin(Math.atan2(P,i)*60)),kind:1,l:[.1,.4,.9]});for(let i=1;i<I.n*3;i+=3)I.L[i]*=F;const X=new c.Mesh(I.build(),H);X.name="well",a.add(X),V+=I.triangles,o.yield&&await o.yield();const K=[],k=t.archY||[15,27,43,58,72];for(let i=0;i<40;i++)K.push([k[i%k.length]+e.range(-3,5),e.range(2.5,9.5)]);for(let i=0;i<16;i++)K.push([e.range(96,172),e.range(3,11)]);const d=72;for(let i=0;i<d;i++)K.push([e.range(112,150),e.range(3,10.5),2]);const z=g.length+K.length,W=new Float32Array(z*4),M=new Float32Array(z*4),T=new Float32Array(z),S=new Float32Array(z),U=t.slate??0;for(let i=0;i<z;i++){const w=g[i];if(w)W[i*4]=w[0],W[i*4+1]=w[1],W[i*4+2]=w[2],W[i*4+3]=.674+.074*(w[4]/(u-1))+e.range(-.003,.006)+(e()<.08?e.range(0,.2):0),M[i*4+3]=0;else{const P=K[i-g.length];W[i*4+1]=P[0],W[i*4+3]=-1,M[i*4+3]=P[2]||1}if(M[i*4]=e(),M[i*4+1]=w?e.range(4.5,9.5):K[i-g.length][1],M[i*4+2]=e()<.55?e.range(13,22):e.range(4.5,8.5),T[i]=e()<U?1:0,!w&&M[i*4+3]>1.5&&(M[i*4+2]=e.range(5.3,8.6),S[i]=e.range(0,52)),w){const P=t.duration||40,B=(e()-.5)*1.1,Y=(w[1]+2.5-q)/6+W[i*4+3]*P*.3+B,N=Y-w[3],A=Math.abs(N-Math.PI*2*Math.round(N/(Math.PI*2)));S[i]=B+(A>Math.PI/2?Math.PI:0)}}o.yield&&await o.yield();const _=jt(),j=new c.InstancedBufferGeometry;j.index=_.index;for(const i in _.attributes)j.setAttribute(i,_.attributes[i]);j.setAttribute("iA",new c.InstancedBufferAttribute(W,4)),j.setAttribute("iB",new c.InstancedBufferAttribute(M,4)),j.setAttribute("iC",new c.InstancedBufferAttribute(T,1)),j.setAttribute("iD",new c.InstancedBufferAttribute(S,1)),j.instanceCount=z;const ht={uTime:r.uTime,uU:{value:0},uDur:{value:t.duration||40},uPortal:{value:vt.clone()},uPDir:{value:et.clone()},uPRight:{value:pt.clone()},uPUp:{value:yt.clone()},uGlareCol:r.uGlareCol,uFillCol:r.uFillCol,uTopCol:r.uTopCol,uFogCol:r.uFogCol,uSunCol:r.uSunCol,uSun:r.uSun,uFogDen:r.uFogDen,uDark:{value:t.dark||0},uBounce:{value:new c.Vector3(...t.bounce||[0,0,0])},uGain:{value:.82},uPart:{value:1},uSky:r.uSky,uCount:r.uCount,uWinC:r.uWinC,uWinN:r.uWinN,uWinR:r.uWinR},rt=new c.Mesh(j,new c.ShaderMaterial({uniforms:ht,vertexShader:$t,fragmentShader:Xt,side:c.DoubleSide}));rt.frustumCulled=!1,rt.name="pigeons",a.add(rt),V+=z*(_.index.count/3);const it=t.sky||{},wt={uTime:r.uTime,uZen:{value:new c.Color(...it.zen||[.5,.62,.85])},uHor:{value:new c.Color(...it.hor||[1,1.08,1.2])},uCloud:{value:it.cloud??.6},uFlakes:{value:it.flakes??0},uStars:{value:it.stars??0}},ft=new c.Mesh(new c.CircleGeometry(lt(E)+1.5,40).rotateX(Math.PI/2).translate(0,E+8.6,0),new c.ShaderMaterial({uniforms:wt,vertexShader:Zt,fragmentShader:Jt}));ft.name="sky",a.add(ft);const gt={uTime:r.uTime,uCol:{value:new c.Color(...t.column||[.05,.065,.09])},uFlakes:{value:it.flakes??0}},zt=new c.Mesh(new c.CylinderGeometry(lt(E)-3.2,12.6,E+8-q,40,6,!0).translate(0,(E+8+q)/2,0),new c.ShaderMaterial({uniforms:gt,vertexShader:te,fragmentShader:ee,transparent:!0,depthWrite:!1,blending:c.AdditiveBlending,side:c.DoubleSide}));return zt.name="column",zt.renderOrder=2,a.add(zt),n&&(s.setWindows(x),r.uFogDen.value=.002),{object:a,radius:At+4,height:E+8,center:new c.Vector3(0,140,0),ground:!1,groundY:q,anchors:{portal:vt.clone(),portalDir:et.clone(),floorY:q,shaftRadius:At,wellRadius:dt,axis:new c.Vector3(0,0,0)},rock:s,holes:x,perches:g,wellPerch:ct,birds:rt,birdUniforms:ht,triangles:V,drawCalls:5,update(i,w,P,B){r.uTime.value=w,ht.uU.value=B===void 0?.62+w%18/18*.36:B},dispose(){}}}export{Et as ARCHES,Ft as Bld,q as FLOOR,ae as LAYOUT,Wt as NHOT,at as NWIN,et as PORTAL_DIR,vt as PORTAL_POS,kt as S0,At as SHAFT_R,Tt as S_END,E as TOP,dt as WELL_R,oe as angOf,se as bar,le as buildHero,ie as lathe,G as lerp,xt as lin,Qt as makeRock,ne as pillow,lt as shaftR,re as sheet,L as sstep};
