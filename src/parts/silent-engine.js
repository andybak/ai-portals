import*as w from"three";import{clamp as Qt,lerp as J,smoothstep as Yt}from"../kit/core.js";const ie=["#020206","#1b1c2a","#5d5a66","#d9d2c4","#b08a4a","#ffd27a","#7af0ff"],F=Math.PI*2,It=[500,400,310,220,150],le=[20,35,50];class Xt{constructor(){this.p=[],this.n=[],this.c=[],this.uv=[],this.m=[],this.ix=[],this.nv=0}quad(o,t,v,h,g,f,b=0,x=null){let n=t[0]-o[0],r=t[1]-o[1],l=t[2]-o[2],s=h[0]-o[0],e=h[1]-o[1],c=h[2]-o[2],d=r*c-l*e,m=l*s-n*c,_=n*e-r*s,B=Math.hypot(d,m,_);B<1e-7&&(n=v[0]-t[0],r=v[1]-t[1],l=v[2]-t[2],s=h[0]-t[0],e=h[1]-t[1],c=h[2]-t[2],d=r*c-l*e,m=l*s-n*c,_=n*e-r*s,B=Math.hypot(d,m,_)||1),d/=B,m/=B,_/=B;const L=d*g[0]+m*g[1]+_*g[2]<0;L&&(d=-d,m=-m,_=-_);const I=[o,t,v,h];for(let C=0;C<4;C++)this.p.push(I[C][0],I[C][1],I[C][2]),this.n.push(d,m,_),this.c.push(f[0],f[1],f[2]),this.m.push(b),x?this.uv.push(x[C][0],x[C][1]):this.uv.push(I[C][0]+I[C][2]*.37,I[C][1]+I[C][2]*.61);const k=this.nv;this.nv+=4,L?this.ix.push(k,k+2,k+1,k,k+3,k+2):this.ix.push(k,k+1,k+2,k,k+2,k+3)}build(){const o=new w.BufferGeometry;return o.setAttribute("position",new w.Float32BufferAttribute(this.p,3)),o.setAttribute("normal",new w.Float32BufferAttribute(this.n,3)),o.setAttribute("aCol",new w.Float32BufferAttribute(this.c,3)),o.setAttribute("uv",new w.Float32BufferAttribute(this.uv,2)),o.setAttribute("aM",new w.Float32BufferAttribute(this.m,1)),o.setIndex(this.nv>65535?new w.Uint32BufferAttribute(this.ix,1):new w.Uint16BufferAttribute(this.ix,1)),o}get tris(){return this.ix.length/3}}const A=(i,o,t,v=0)=>{const h=Math.cos(i),g=Math.sin(i);return[o*h-v*g,t,o*g+v*h]},S=(i,o)=>[i[0]*o,i[1]*o,i[2]*o],X=(i,o,t)=>[J(i[0],o[0],t),J(i[1],o[1],t),J(i[2],o[2],t)];function G(i,o,t,v,h={}){const g=h.t0??0,f=h.t1??F,b=h.col,x=h.jit??(()=>1),n=t.length,r=[0];for(let l=0;l<n;l++){const s=t[l],e=t[(l+1)%n];r.push(r[l]+Math.hypot(e.r-s.r,e.a-s.a))}for(let l=0;l<v;l++){const s=g+(f-g)*(l/v),e=g+(f-g)*((l+1)/v),c=(s+e)/2,d=x(l);for(let m=0;m<n;m++){const _=t[m],B=t[(m+1)%n],L=B.r-_.r,I=B.a-_.a,k=Math.hypot(L,I)||1,C=I/k,ct=-L/k,E=[C*Math.cos(c),ct,C*Math.sin(c)],rt=A(s,o+_.r,_.a),bt=A(e,o+_.r,_.a),O=A(e,o+B.r,B.a),$=A(s,o+B.r,B.a);let K;if(_.m===1){const R=k*.5,Q=(h.phase??0)+m*13.7;K=[[s*o/R+Q,0],[e*o/R+Q,0],[e*o/R+Q,1],[s*o/R+Q,1]]}else K=[[s*o,r[m]],[e*o,r[m]],[e*o,r[m+1]],[s*o,r[m+1]]];i.quad(rt,bt,O,$,E,S(b,(_.k??1)*d),_.m??0,K)}}if(h.cap){let l=0,s=0;for(const e of t)l+=e.r/n,s+=e.a/n;for(const[e,c]of[[g,-1],[f,1]]){const d=[-Math.sin(e)*c,0,Math.cos(e)*c],m=A(e,o+l,s);for(let _=0;_<n;_++){const B=t[_],L=t[(_+1)%n];i.quad(m,A(e,o+B.r,B.a),A(e,o+L.r,L.a),m,d,S(b,h.capK??.8),h.capM??0)}}}}function N(i,o,t,v,h={}){const g=t.map(e=>{const c=e.v0??0,d=e.w0??0;return[o(e.u,c-e.hv,d-e.hw),o(e.u,c+e.hv,d-e.hw),o(e.u,c+e.hv,d+e.hw),o(e.u,c-e.hv,d+e.hw)]}),f=t[Math.floor(t.length/2)],b=t[0],x=t[t.length-1],n=o((b.u+x.u)/2,f.v0??0,f.w0??0),r=e=>[e[0]-n[0],e[1]-n[1],e[2]-n[2]],l=(e,c,d,m)=>[(e[0]+c[0]+d[0]+m[0])/4,(e[1]+c[1]+d[1]+m[1])/4,(e[2]+c[2]+d[2]+m[2])/4],s=h.sideM??[0,0,0,0];for(let e=0;e<g.length-1;e++)for(let c=0;c<4;c++){const d=g[e][c],m=g[e+1][c],_=g[e+1][(c+1)%4],B=g[e][(c+1)%4],L=h.bandM&&e===h.bandAt?h.bandM:s[c];i.quad(d,m,_,B,r(l(d,m,_,B)),S(v,(h.k??1)*(c&1?.92:1.06)),L)}if(!h.noCapA){const e=g[0];i.quad(e[0],e[1],e[2],e[3],r(l(e[0],e[1],e[2],e[3])),S(v,.85),h.capAM??0)}if(!h.noCapB){const e=g[g.length-1];i.quad(e[0],e[1],e[2],e[3],r(l(e[0],e[1],e[2],e[3])),S(v,1),h.capBM??0)}}function Z(i,o,t,v,h,g=0){const f=[t[0]-o[0],t[1]-o[1],t[2]-o[2]],b=Math.hypot(f[0],f[1],f[2])||1;f[0]/=b,f[1]/=b,f[2]/=b;let x=Math.abs(f[1])>.9?[1,0,0]:[0,1,0],n=[f[1]*x[2]-f[2]*x[1],f[2]*x[0]-f[0]*x[2],f[0]*x[1]-f[1]*x[0]];const r=Math.hypot(n[0],n[1],n[2]);n=n.map(e=>e/r);const l=[f[1]*n[2]-f[2]*n[1],f[2]*n[0]-f[0]*n[2],f[0]*n[1]-f[1]*n[0]];N(i,(e,c,d)=>[o[0]+f[0]*e+n[0]*c+l[0]*d,o[1]+f[1]*e+n[1]*c+l[1]*d,o[2]+f[2]*e+n[2]*c+l[2]*d],[{u:0,hv:v,hw:v},{u:b*.5,hv:v*.72,hw:v*.72},{u:b,hv:v,hw:v}],h,{noCapA:!0,noCapB:!0,sideM:[g,g,g,g]})}const it=`
float h21(vec2 p){ p=fract(p*vec2(123.34,456.21)); p+=dot(p,p+45.32); return fract(p.x*p.y); }
float h31(vec3 p){ p=fract(p*.1031); p+=dot(p,p.yzx+33.33); return fract((p.x+p.y)*p.z); }
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float a=.5, s=0.; for(int i=0;i<4;i++){ s+=a*vn3(p); p=p*2.03+vec3(7.1,3.3,5.7); a*=.5; } return s; }
`,wt=`
uniform vec3 uStar; uniform vec3 uRingN[5]; uniform vec3 uRingW[5];
float engineShadow(vec3 wp, float idx){
  vec3 d=wp-uStar; float dist=length(d); d/=max(dist,1e-3); float s=1.;
  for(int k=0;k<5;k++){
    if(float(k)>idx+.5){
      float a=abs(dot(d,uRingN[k]));
      s*=1.-uRingW[k].y*(1.-smoothstep(uRingW[k].x,uRingW[k].x*1.7+.006,a))*step(uRingW[k].z,dist);
    }
  }
  return s;
}
`,lt=`
#ifdef USE_FOG
  #ifdef FOG_EXP2
    float fogF=1.-exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    float fogF=smoothstep(fogNear,fogFar,vFogDepth);
  #endif
  gl_FragColor.rgb*=1.-fogF;
#endif
`,ce=`
attribute vec3 aCol; attribute float aM;
varying vec3 vWp; varying vec3 vN; varying vec3 vCol; varying vec2 vUv; varying float vM;
#include <fog_pars_vertex>
void main(){
  vec4 wp=modelMatrix*vec4(position,1.); vWp=wp.xyz; vN=normalize(mat3(modelMatrix)*normal);
  vCol=aCol; vUv=uv; vM=aM;
  vec4 mvPosition=viewMatrix*wp; gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ue=`
varying vec3 vWp; varying vec3 vN; varying vec3 vCol; varying vec2 vUv; varying float vM;
uniform vec3 uStarCol; uniform vec3 uKey; uniform vec3 uFill; uniform vec3 uGlyph; uniform vec3 uBeam[4];
uniform float uTime; uniform float uIdx; uniform float uProgress; uniform float uStarI;
#include <fog_pars_fragment>
${it}
${wt}
float glyph(vec2 uv){
  float c=floor(uv.x); vec2 g=vec2(fract(uv.x),uv.y); float id=h21(vec2(c,17.));
  if(id<.16) return 0.;
  g=(g-.5)*vec2(1.3,1.45)+.5; if(g.x<0.||g.x>1.||g.y<0.||g.y>1.) return 0.;
  vec2 q=floor(g*vec2(3.,5.)), qf=fract(g*vec2(3.,5.));
  float on=step(.42,h21(q+vec2(c*7.31,3.)));
  float bar=step(.14,qf.x)*step(qf.x,.86)*step(.16,qf.y)*step(qf.y,.84);
  float joinH=step(.5,h21(q+vec2(c*3.7,9.)))*step(.3,qf.y)*step(qf.y,.7);
  float spine=step(abs(g.x-.5),.07)*step(.45,id);
  return max(on*max(bar,joinH),spine);
}
void main(){
  vec3 N=normalize(vN); vec3 toS=uStar-vWp; float ds=length(toS); vec3 L=toS/ds; vec3 V=normalize(cameraPosition-vWp);
  float sh=engineShadow(vWp,uIdx);
  float ndl=dot(N,L), ndv=max(dot(N,V),0.);
  vec3 alb=vCol; float rough=.45; vec3 emi=vec3(0.); float metal=1.; float det=1.;
  float gn=fbm3(vWp*.045+uIdx*7.);
  if(vM<.5){
    vec2 sc=vec2(11.,3.4); vec2 pu=vUv/sc; pu.x+=.5*step(.5,fract(floor(pu.y)*.5));
    vec2 cell=floor(pu), f=fract(pu);
    float e=min(min(f.x,1.-f.x)*sc.x,min(f.y,1.-f.y)*sc.y);
    float farK=smoothstep(.12,.7,fwidth(pu.y));
    float seam=mix(smoothstep(.0,.2,e),.88,farK);
    float tn=mix(h21(cell+uIdx*3.1),.5,farK*.7);
    det=(.7+.55*tn)*mix(.4,1.,seam);
    alb*=det;
    alb=mix(alb,alb*vec3(.6,.74,.64)+vec3(.0,.008,.006),smoothstep(.62,.84,gn)*.4);
    rough=mix(.26,.6,gn)+.16*step(.78,tn);
  } else if(vM<1.5){
    float fw=fwidth(vUv.x);
    float g=mix(glyph(vUv),.34,smoothstep(.3,1.1,fw));
    float line=step(.42,abs(vUv.y-.5))*step(abs(vUv.y-.5),.47);
    vec3 d=-L; float bm=0.;
    for(int k=0;k<4;k++) bm=max(bm,smoothstep(.9,.995,dot(d,uBeam[k])));
    float pulse=pow(clamp(.5+.5*sin(vUv.x*.19-uTime*1.15+uIdx*2.1),0.,1.),8.);
    float thr=.15+uIdx*.14; float ign=smoothstep(thr,thr+.14,uProgress);
    ign*=mix(.55+.45*step(.5,fract(uTime*9.+h21(vec2(floor(vUv.x),2.)))),1.,smoothstep(.6,1.,ign));
    emi=uGlyph*(g*min(1.1+2.2*pulse+4.4*bm,3.2)+line*.55)*ign*mix(.62,1.,smoothstep(.5,2.5,uIdx));
    alb*=.3; rough=.75; det=.5;
  } else if(vM<2.5){
    float lv=mix(.3+.7*smoothstep(.2,.45,abs(fract(vUv.y*.45)-.5)),.72,smoothstep(.2,.9,fwidth(vUv.y*.45)));
    emi=uStarCol*(3.+.8*sin(uTime*2.3+vWp.x*.07+vWp.z*.05))*lv*smoothstep(.1,.4,uProgress+.3); alb*=.25; det=.5;
  } else {
    metal=0.; det=.7+.6*gn; alb*=det; rough=.95;
  }
  float fr=pow(clamp(1.-ndv,0.,1.),4.);
  float lit=max(ndl,0.)*sh;
  vec3 H=normalize(L+V);
  float sp=pow(max(dot(N,H),0.),mix(120.,14.,rough))*mix(2.4,.3,rough)*step(0.,ndl)*sh*metal;
  vec3 key=uKey*uStarI;
  vec3 col=alb*key*lit*mix(.95,.6,metal);
  col+=mix(alb,vec3(.6),.35)*key*sp;
  col+=mix(alb,vec3(.5),.4)*key*fr*smoothstep(-.3,.3,ndl)*sh*.3;          // gold edge light near the terminator
  col+=uFill*det*(.75+.45*N.y)+uFill*fr*1.2*metal;                         // cold starlight fill: blue-black shadow side
  col+=alb*uStarCol*.03*(1.-max(ndl,0.));                                  // faint warm bounce from the other rings
  col+=emi;
  gl_FragColor=vec4(col,1.);
  if(!(abs(gl_FragColor.r+gl_FragColor.g+gl_FragColor.b)<1e5)) gl_FragColor=vec4(0.,0.,0.,1.);
  #include <fog_fragment>
}`,fe=`
varying vec3 vP; varying vec3 vWp; varying vec3 vNw;
#include <fog_pars_vertex>
void main(){
  vP=position; vec4 wp=modelMatrix*vec4(position,1.); vWp=wp.xyz; vNw=normalize(mat3(modelMatrix)*normal);
  vec4 mvPosition=viewMatrix*wp; gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ve=`
varying vec3 vP; varying vec3 vWp; varying vec3 vNw;
uniform vec3 uStarCol; uniform float uTime; uniform float uGain;
#include <fog_pars_fragment>
${it}
void main(){
  vec3 p=normalize(vP); float t=uTime;
  vec3 q=p*4.5;
  vec3 w=vec3(fbm3(q+t*.06),fbm3(q+11.3-t*.05),fbm3(q+23.7+t*.045));
  float g=fbm3(p*8.+w*2.4+t*.03);
  float cells=fbm3(p*24.+w*3.2+vec3(t*.11));
  float v=g*.62+cells*.48;
  float spot=smoothstep(.37,.25,fbm3(p*2.4+31.+t*.008));
  float mu=max(dot(normalize(vNw),normalize(cameraPosition-vWp)),0.);
  float limb=.42+.58*pow(clamp(mu,0.,1.),.6);
  vec3 hot=vec3(1.,.96,.84), cool=vec3(1.,.36,.07);
  vec3 c=mix(cool,uStarCol,smoothstep(.3,.5,v)); c=mix(c,hot,smoothstep(.5,.68,v));
  c*=mix(.75,4.6,smoothstep(.38,.7,v))*limb;
  c=mix(c,cool*.55,spot*.8);
  c+=cool*1.4*pow(clamp(1.-mu,0.,1.),3.);
  gl_FragColor=vec4(c*uGain,1.);
  if(!(abs(gl_FragColor.r+gl_FragColor.g+gl_FragColor.b)<1e5)) gl_FragColor=vec4(0.,0.,0.,1.);
  ${lt.replace("1.-fogF","1.-fogF*.5")}
}`,he=`
uniform float uSize; varying vec2 vQ; varying float vBoost;
#include <fog_pars_vertex>
void main(){
  vQ=position.xy; vec4 mvPosition=modelViewMatrix*vec4(0.,0.,0.,1.); vBoost=clamp(-mvPosition.z/420.,1.,2.4); mvPosition.xy+=position.xy*uSize;
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,pe=`
varying vec2 vQ; varying float vBoost; uniform vec3 uStarCol; uniform float uTime; uniform float uSize; uniform float uR; uniform float uGain;
#include <fog_pars_fragment>
${it}
void main(){
  float r=length(vQ)*uSize/uR; float t=uTime;
  vec2 dir=normalize(vQ+vec2(1e-5,0.));
  float rr=max(r,1.);
  float glow=.42/(rr*rr)+.8*exp(-(rr-1.)*4.);
  float s=fbm3(vec3(dir*2.6,rr*.5-t*.12));
  float rays=s*s*exp(-(rr-1.)*.5)*.8;
  float n=vn3(vec3(dir*7.,t*.04+3.));
  float spikes=pow(clamp(n,0.,1.),5.)*exp(-(rr-1.)*.16)*1.3;
  float inner=smoothstep(.75,1.,r);
  float edge=smoothstep(1.,.5,length(vQ));
  vec3 c=mix(uStarCol,vec3(1.,.93,.8),exp(-(rr-1.)*1.2))*(glow+rays+spikes)*inner*edge*edge*uGain*vBoost;
  gl_FragColor=vec4(c,1.);
  if(!(abs(gl_FragColor.r+gl_FragColor.g+gl_FragColor.b)<1e5)) gl_FragColor=vec4(0.,0.,0.,1.);
  ${lt.replace("1.-fogF","1.-fogF*.6")}
}`,me=`
attribute vec3 aTan; attribute vec3 aSide; attribute float aW;
uniform float uViewH; uniform float uMinPx;
varying vec3 vS;
#include <fog_pars_vertex>
void main(){
  vS=aSide; vec4 mvPosition=modelViewMatrix*vec4(position,1.);
  vec3 tv=normalize((modelViewMatrix*vec4(aTan,0.)).xyz);
  vec3 sd=cross(tv,normalize(mvPosition.xyz)); sd/=max(length(sd),1e-4);
  float w=max(aW,-mvPosition.z*uMinPx*2./(projectionMatrix[1][1]*uViewH));
  mvPosition.xyz+=sd*aSide.x*w;
  gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ge=`
varying vec3 vS; uniform vec3 uStarCol; uniform float uTime; uniform float uKind; uniform float uGain;
#include <fog_pars_fragment>
${it}
void main(){
  float s=vS.x, u=vS.y, sd=vS.z, t=uTime; vec3 c;
  if(uKind<.5){
    float core=exp(-s*s*5.)+.1*exp(-s*s*1.5);
    float pk=pow(clamp(.5+.5*sin(u*20.-t*5.5+sd*3.),0.,1.),8.);
    float fl=.72+.4*vn3(vec3(t*6.,sd*9.,u*5.-t*2.));
    c=mix(uStarCol,vec3(1.,.95,.85),exp(-s*s*14.))*core*(4.6*fl+4.*pk)*smoothstep(1.,.985,u);
  } else if(uKind<1.5){
    float core=exp(-s*s*4.);
    c=mix(uStarCol,vec3(1.,.92,.75),.4)*core*1.5*pow(clamp(1.-u,0.,1.),1.3)*smoothstep(0.,.006,u)*(.85+.15*sin(u*260.-t*2.5));
  } else {
    float fil=fbm3(vec3(u*5.-t*.3+sd*10.,s*1.8,sd*5.+t*.08));
    float shape=pow(clamp(1.-s*s,0.,1.),2.)*smoothstep(0.,.1,u)*smoothstep(1.,.9,u);
    c=mix(vec3(1.,.3,.06),uStarCol,fil)*shape*pow(clamp(fil,0.,1.),1.6)*9.;
  }
  gl_FragColor=vec4(c*uGain,1.);
  if(!(abs(gl_FragColor.r+gl_FragColor.g+gl_FragColor.b)<1e5)) gl_FragColor=vec4(0.,0.,0.,1.);
  ${lt}
}`,de=`
attribute vec4 aD; uniform float uTime; uniform float uViewH; uniform vec3 uStarCol;
varying vec3 vC;
#include <fog_pars_vertex>
${wt}
void main(){
  float a=aD.x*uTime; float c=cos(a), s=sin(a);
  vec3 p=vec3(position.x*c-position.z*s, position.y+sin(uTime*.2+aD.z)*3., position.x*s+position.z*c);
  vec4 wp=modelMatrix*vec4(p,1.);
  vec4 mvPosition=viewMatrix*wp; gl_Position=projectionMatrix*mvPosition;
  float sh=engineShadow(wp.xyz,-1.);
  float dist=length(wp.xyz-uStar);
  float px=aD.y*projectionMatrix[1][1]*uViewH*.5/max(-mvPosition.z,1.);
  float tw=.6+.4*sin(uTime*(1.+aD.z)+aD.z*40.);
  float b=aD.w*sh*clamp(170./dist,.25,2.2)*tw*min(px,1.);
  gl_PointSize=clamp(px,1.,5.);
  vC=mix(uStarCol,vec3(1.,.9,.72),.3)*b;
  #include <fog_vertex>
}`,we=`
varying vec3 vC;
#include <fog_pars_fragment>
void main(){
  float d=length(gl_PointCoord-.5); float a=smoothstep(.5,.12,d);
  gl_FragColor=vec4(vC*a,1.);
  if(!(abs(gl_FragColor.r+gl_FragColor.g+gl_FragColor.b)<1e5)) gl_FragColor=vec4(0.,0.,0.,1.);
  ${lt}
}`,xe=`
varying vec3 vWp; varying vec3 vL;
#include <fog_pars_vertex>
void main(){
  vL=position; vec4 wp=modelMatrix*vec4(position,1.); vWp=wp.xyz;
  vec4 mvPosition=viewMatrix*wp; gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,ye=`
varying vec3 vWp; varying vec3 vL; uniform vec3 uStarCol; uniform float uTime; uniform float uVeilR; uniform float uGain;
#include <fog_pars_fragment>
${it}
${wt}
void main(){
  float rr=length(vL.xz)/uVeilR; float t=uTime;
  float sh=engineShadow(vWp,-1.);
  float ang=atan(vL.z,vL.x)+t*.012+rr*1.4;
  vec2 sw=vec2(cos(ang),sin(ang))*rr;
  float n=fbm3(vec3(sw*5.,t*.03));
  float n2=fbm3(vec3(sw*17.+4.,t*.05));
  float body=smoothstep(.02,.3,rr)*pow(max(1.-rr,0.),1.4);
  float pool=exp(-rr*rr*26.)*.55;
  float vd=abs(normalize(cameraPosition-vWp).y); float edge=smoothstep(.01,.16,vd);
  vec3 c=uStarCol*vec3(1.,.82,.55)*((.09+.5*n*n+.2*n2*n)*body+pool)*mix(.12,1.,sh)*edge*uGain;
  gl_FragColor=vec4(c,1.);
  if(!(abs(gl_FragColor.r+gl_FragColor.g+gl_FragColor.b)<1e5)) gl_FragColor=vec4(0.,0.,0.,1.);
  ${lt}
}`,p=(i,o,t=0,v=1)=>({r:i,a:o,m:t,k:v}),xt=(i,o,t,v=1,h=6)=>{const g=[];for(let f=0;f<h;f++){const b=f/h*F+.26;g.push(p(i+t*Math.cos(b),o+t*Math.sin(b),0,.82+.3*(f*7%h)/h*v))}return g};function yt(i,o,t=.8,v=1.18){const h=new Float32Array(o);let g=0;for(;g<o;){const f=i.int(2,6),b=i.range(t,v);for(let x=0;x<f&&g<o;x++)h[g++]=b}return f=>h[f%o]}function be(i,o,t,v){const g=X(v.brass,v.steel,.12),f=[p(-5,-21),p(-2,-24,0,.8),p(3,-24),p(5,-22,0,1.1),p(5,-9,0,.7),p(3.6,-8,1),p(3.6,8,0,.7),p(5,9,0,1.1),p(5,22),p(3,24,0,.8),p(-2,24),p(-5,21,0,1.1),p(-5,9,0,.7),p(-3.8,8,1),p(-3.8,-8,0,.7),p(-5,-9,0,1.1)];G(i,o,f,320,{col:g,jit:yt(t,320),phase:t.range(0,99)});const b=t.int(40,54)*4,x=F*o/b;for(let r=0;r<b;r++){const l=(r+.5)/b*F,s=r%4===0?1.5:1;for(const e of[-1,1])N(i,(c,d,m)=>A(l,o-5-c,e*18.6+d,m),[{u:-.5,hv:3.6,hw:x*.33},{u:5*s,hv:3,hw:x*.27},{u:7.5*s,hv:1.8,hw:x*.15}],S(g,t.range(.8,1.15)),{noCapA:!0}),r%2===0&&N(i,(c,d,m)=>A(l,o+5+c,e*19.6+d,m),[{u:-.5,hv:2.6,hw:x*.42},{u:3.2,hv:2,hw:x*.34}],S(v.steel,t.range(.7,1)),{noCapA:!0})}const n=t.int(13,18)*4;for(let r=0;r<n;r++){const l=r/n*F;r%4===0?(N(i,(s,e,c)=>A(l,o+4+s,e,c),[{u:0,hv:13,hw:8},{u:5,hv:12,hw:7},{u:8.5,hv:9,hw:5},{u:9.4,hv:5,hw:1.6}],S(v.steel,.9),{noCapA:!0,capBM:2}),N(i,(s,e,c)=>A(l,o-4-s,e,c),[{u:0,hv:12,hw:6},{u:4.5,hv:9,hw:4}],S(v.steel,1),{noCapA:!0})):N(i,(s,e,c)=>A(l,o+4.6+s,e,c),[{u:0,hv:22.5,hw:1.5},{u:2.4,hv:21.5,hw:.9}],S(g,.75),{noCapA:!0})}}function Me(i,o,t,v){const h=X(v.brass,v.steel,.3),g=240,f=[[1,-20],[1,20],[-30,0]];for(const[r,l]of f)G(i,o,xt(r,l,2.5),g,{col:h,jit:yt(t,g,.85,1.12)});G(i,o,[p(.4,-5.5,0,.7),p(2.2,-5.5,1),p(2.2,5.5,0,.7),p(.4,5.5,1)],g,{col:S(h,.8),phase:t.range(0,99)});const b=t.int(34,44)*2,x=S(X(v.brass,v.steel,.5),.9),n=(r,l)=>A(r/b*F,o+f[l][0],f[l][1]);for(let r=0;r<b;r++){const l=r%2;if(Z(i,n(r,l),n(r+1,1-l),.95,x),Z(i,n(r,l?0:2),n(r+1,l?2:0),.85,x),Z(i,n(r,l?2:1),n(r+1,l?1:2),.85,x),Z(i,n(r,0),n(r,1),1.1,S(h,.9)),Z(i,n(r,0),n(r,2),.9,S(h,.8)),Z(i,n(r,1),n(r,2),.9,S(h,.8)),r%6===0){const s=r/b*F;N(i,(e,c,d)=>A(s,o-30-e,c,d),[{u:-3.4,hv:3.6,hw:4.6},{u:3.4,hv:3.6,hw:4.6},{u:6,hv:2,hw:2.4}],S(v.steel,.9),{capBM:2});for(const e of[-20,20])N(i,(c,d,m)=>A(s,o+1+c,e+d,m),[{u:-3.6,hv:3.6,hw:5},{u:3.6,hv:3.6,hw:5}],S(v.steel,.8))}}}function Se(i,o,t,v){const h=X(v.brass,v.steel,.05),g=264,f=[p(-9,-6),p(-7,-8,0,.9),p(-4,-8,0,.7),p(-3,-6.8,1),p(3,-6.8,0,.7),p(4,-8,0,.9),p(7,-8),p(9,-6,0,1.1),p(9,6),p(7,8,0,.9),p(4,8,0,.7),p(3,6.8,1),p(-3,6.8,0,.7),p(-4,8,0,.9),p(-7,8),p(-9,6,0,1.1)];G(i,o,f,g,{col:h,jit:yt(t,g),phase:t.range(0,99)});const b=t.int(26,36)*2,x=F*o/b;for(let n=0;n<b;n++){const r=n/b*F,l=S(h,t.range(.82,1.15));N(i,(s,e,c)=>A(r,o+8.5+s,e,c),[{u:-.5,hv:6.4,hw:x*.31},{u:7,hv:5.8,hw:x*.26},{u:13,hv:4.4,hw:x*.15},{u:15,hv:3,hw:x*.09}],l,{noCapA:!0});for(const s of[.25,.75]){const e=(n+s)/b*F;N(i,(c,d,m)=>A(e,o-8.5-c,d,m),[{u:-.5,hv:5.2,hw:x*.12},{u:4.6,hv:4.2,hw:x*.07}],S(v.steel,t.range(.8,1.1)),{noCapA:!0})}if(n%4===0)for(const s of[-1,1]){const e=(n+.5)/b*F;N(i,(c,d,m)=>A(e,o+6+d,s*(7.6+c),m),[{u:0,hv:2.4,hw:3.4},{u:2,hv:1.6,hw:2.4}],S(v.steel,.9),{noCapA:!0,capBM:2})}}}function _e(i,o,t,v){const h=X(v.brass,v.steel,.2),g=200;for(const n of[-1,1]){const r=n*10.5,l=n>0,s=[p(-3.6,r-2,0,.9),p(-2.6,r-3,l?0:1),p(2.6,r-3,0,.9),p(3.6,r-2,1),p(3.6,r+2,0,.9),p(2.6,r+3,l?1:0),p(-2.6,r+3,0,.9),p(-3.6,r+2,0,1.1)];G(i,o,s,g,{col:h,jit:yt(t,g),phase:t.range(0,99)})}G(i,o,xt(-7.5,0,1.3),120,{col:S(v.steel,.9)});const f=t.int(40,56);for(let n=0;n<f;n++){const r=n/f*F;N(i,(l,s,e)=>A(r,o+s,l,e),[{u:-8,hv:2.4,hw:1.7},{u:0,hv:1.1,hw:.9},{u:8,hv:2.4,hw:1.7}],S(v.steel,t.range(.75,1.05)),{noCapA:!0,noCapB:!0}),Z(i,A(r,o-7.5,0),A(r,o,0),.55,S(v.steel,.8))}const b=t.int(5,8),x=t.range(0,F);for(let n=0;n<b;n++){const r=x+n/b*F;N(i,(l,s,e)=>A(r,o+l,s,e),[{u:-6.5,hv:11,hw:5},{u:-3,hv:15.5,hw:9},{u:4.5,hv:15.5,hw:9},{u:8.5,hv:9,hw:5},{u:9.6,hv:6,hw:2}],S(X(v.brass,v.steel,.6),.95),{capBM:2})}}function Ce(i,o,t,v){const h=X(v.brass,v.steel,.1),g=[p(-7,-7),p(-5,-9,0,.85),p(5,-9),p(7,-7,0,1.1),p(7,-4.5,0,.7),p(5.8,-3.8,1),p(5.8,3.8,0,.7),p(7,4.5,0,1.1),p(7,7),p(5,9,0,.85),p(-5,9),p(-7,7,0,1.1),p(-7,4.5,0,.7),p(-5.8,3.8,1),p(-5.8,-3.8,0,.7),p(-7,-4.5,0,1.1)],f=t.int(9,14),b=t.range(.76,.86),x=t.range(0,F);for(let s=0;s<f;s++){const e=x+s/f*F,c=e+b/f*F;G(i,o,g,9,{t0:e,t1:c,col:S(h,t.range(.85,1.15)),cap:!0,capM:2,phase:t.range(0,99)})}G(i,o,xt(0,0,2.3),120,{col:S(v.steel,.85)}),G(i,o,xt(-3,5.5,.9),96,{col:S(v.steel,.7)});const n=t.range(0,F),r=[],l=g.map(s=>p(s.r*1.22,s.a*1.16,0,s.k));for(let s=0;s<4;s++){const e=n+s*F/4;r.push(e),G(i,o,l,4,{t0:e-.05,t1:e+.05,col:S(v.steel,.9),cap:!0}),N(i,(c,d,m)=>A(e,o-8-c,d,m),[{u:-1,hv:5.2,hw:5.2},{u:5,hv:3.4,hw:3.4},{u:9,hv:1.6,hw:1.6},{u:10.5,hv:2.6,hw:2.6},{u:12,hv:2.2,hw:2.2}],S(v.steel,1),{noCapA:!0,capBM:2})}return{emitters:r,tipR:o-20}}function Fe(i,o,t,v,h,g,f,b,x){const n=new w.IcosahedronGeometry(1,f),r=n.getAttribute("position"),l=[];for(let s=0;s<r.count;s++){const e=r.getX(s),c=r.getY(s),d=r.getZ(s),m=g*(.72+.42*o.n3(e*1.3+x,c*1.3,d*1.3)+.14*o.n3(e*3.1,c*3.1+x,d*3.1));l.push([t+e*m*1.25,v+c*m*.8,h+d*m])}for(let s=0;s<l.length;s+=3){const e=l[s],c=l[s+1],d=l[s+2],m=[(e[0]+c[0]+d[0])/3-t,(e[1]+c[1]+d[1])/3-v,(e[2]+c[2]+d[2])/3-h];i.quad(e,c,d,d,m,S(b,.8+.4*(s*7919%13)/13),3)}n.dispose()}async function Ae(i,o={}){const t=i.rng,v=i.noise,h=Array.isArray(o.palette)&&o.palette.length>=7?o.palette:ie,g=a=>{const u=new w.Color(a);return[u.r,u.g,u.b]},f=o.starHeight??420,b=o.veilDrop??250,x=20,n=w.Vector3,r=t.range(-1,1),l=g(h[4]),s={brass:S(X(l,r>0?[l[0]*1.05,l[1]*.72,l[2]*.6]:[l[0],l[1]*1.12,l[2]*1.5],Math.abs(r)*.6),.92),steel:S(g(h[2]),.75),ash:S(g(h[3]),.8)},e=new w.Color(h[5]);e.lerp(new w.Color(r>0?"#ffb45a":"#fff0c8"),Math.abs(r)*.35);const c=e.clone().lerp(new w.Color("#ffffff"),.62),d=new w.Color(h[1]).multiplyScalar(1.7),m={uTime:{value:0},uProgress:{value:o.progress??1},uViewH:{value:720},uStar:{value:new n(0,f,0)},uRingN:{value:[0,1,2,3,4].map(()=>new n(0,1,0))},uRingW:{value:[new n(24/500,.9,480),new n(21/400,.5,365),new n(9/310,.88,294),new n(13.5/220,.66,208),new n(9/150,.82,140)]},uBeam:{value:[0,1,2,3].map(()=>new n(1,0,0))},uStarCol:{value:e},uKey:{value:c},uFill:{value:d},uGlyph:{value:new w.Color(h[6])},uStarI:{value:2.5}},_=()=>w.UniformsUtils.clone(w.UniformsLib.fog),B=(...a)=>{const u={};for(const M of a)u[M]=m[M];return u},L=a=>new w.ShaderMaterial({uniforms:{..._(),...B("uTime","uProgress","uStar","uRingN","uRingW","uBeam","uStarCol","uKey","uFill","uGlyph","uStarI"),uIdx:{value:a}},vertexShader:ce,fragmentShader:ue,fog:!0}),I=(a,u,M,y)=>new w.ShaderMaterial({uniforms:{..._(),...B(...y),...M},vertexShader:a,fragmentShader:u,fog:!0,transparent:!0,depthWrite:!1,blending:w.AdditiveBlending,side:w.DoubleSide}),k=new w.Group;k.name="silent-engine";const C=new w.Group;C.position.set(0,f,0),k.add(C);const ct=new n(0,1,0),E=[];let rt=Math.PI/2+t.range(-.2,.2);for(let a=0;a<3;a++){const u=le[a]*Math.PI/180,M=a===0?-1:t.sign();E.push(new n(Math.cos(u)*Math.cos(rt),Math.cos(u)*Math.sin(rt),M*Math.sin(u)).normalize()),rt+=t.sign()*t.range(.85,1.4)}const bt=[be,Me,Se,_e,Ce],O=[],$=[],K=[];let R=null,Q=0;for(let a=0;a<5;a++){const u=new Xt,M=bt[a](u,It[a],t,s);a===4&&(R=M),Q+=u.tris;const y=new w.Mesh(u.build(),L(a));y.frustumCulled=!1,y.name="ring"+a,O.push(y),await i.yield?.()}const Jt=t.sign();for(let a=0;a<3;a++){const u=new w.Group;u.quaternion.setFromUnitVectors(ct,E[a]),u.add(O[a]),C.add(u),$.push((a%2?-1:1)*Jt*[t.range(.018,.028),t.range(.03,.045),t.range(.05,.07)][a]),K.push(t.range(0,F))}const Mt=new w.Group;Mt.quaternion.setFromEuler(new w.Euler(t.range(-.6,.6),t.range(0,F),t.range(-.6,.6)));const ut=new w.Group;Mt.add(ut),ut.add(O[3]),C.add(Mt);const St=new w.Group;St.rotation.y=t.range(.5,1.2)*t.sign(),ut.add(St);const ft=new w.Group;St.add(ft),ft.add(O[4]),$.push(t.sign()*t.range(.1,.15),t.sign()*t.range(.17,.24)),K.push(t.range(0,F),t.range(0,F));const Dt=new w.ShaderMaterial({uniforms:{..._(),...B("uTime","uStarCol"),uGain:{value:1}},vertexShader:fe,fragmentShader:ve,fog:!0}),vt=new w.Mesh(new w.SphereGeometry(x,56,36),Dt);vt.rotation.set(t.range(-.4,.4),0,t.range(-.4,.4)),C.add(vt);const Nt=I(he,pe,{uSize:{value:x*22},uR:{value:x},uGain:{value:1}},["uTime","uStarCol"]),_t=new w.Mesh(new w.PlaneGeometry(2,2),Nt);_t.frustumCulled=!1,_t.renderOrder=3,C.add(_t);const Ct=a=>{const u=[],M=[],y=[],W=[],q=[];let T=0;for(const P of a){const D=P.pts.length;for(let V=0;V<D;V++){const U=P.pts[Math.max(V-1,0)],Y=P.pts[Math.min(V+1,D-1)],et=P.pts[V],ot=Y[0]-U[0],nt=Y[1]-U[1],at=Y[2]-U[2],qt=Math.hypot(ot,nt,at)||1,re=P.u?P.u[V]:V/(D-1);for(const se of[-1,1])u.push(et[0],et[1],et[2]),M.push(ot/qt,nt/qt,at/qt),y.push(se,re,P.seed),W.push(P.w[V]);V<D-1&&q.push(T,T+1,T+2,T+1,T+3,T+2),T+=2}}const z=new w.BufferGeometry;return z.setAttribute("position",new w.Float32BufferAttribute(u,3)),z.setAttribute("aTan",new w.Float32BufferAttribute(M,3)),z.setAttribute("aSide",new w.Float32BufferAttribute(y,3)),z.setAttribute("aW",new w.Float32BufferAttribute(W,1)),z.setIndex(q),z},Ft=(a,u)=>I(me,ge,{uKind:{value:a},uGain:{value:1},uMinPx:{value:u}},["uTime","uStarCol","uViewH"]),Lt=[],Zt=t.int(5,8);for(let a=0;a<Zt;a++){const u=new n(t.gauss(),t.gauss()*.6,t.gauss()).normalize(),M=new n(t.gauss(),t.gauss(),t.gauss()).cross(u).normalize(),y=t.range(.3,.8),W=t.range(5,17),q=t.range(-.3,.3),T=new n().crossVectors(u,M),z=[],P=[],D=22,V=t.range(1.8,3.4);for(let U=0;U<=D;U++){const Y=U/D,et=(Y-.5)*y,ot=Math.pow(Math.sin(Math.PI*Y),.8),nt=u.clone().multiplyScalar(Math.cos(et)).addScaledVector(M,Math.sin(et)).addScaledVector(T,q*ot*.3).normalize(),at=x-.6+W*ot;z.push([nt.x*at,nt.y*at,nt.z*at]),P.push(V*(.55+.75*ot))}Lt.push({pts:z,w:P,seed:t()})}const zt=new w.Mesh(Ct(Lt),Ft(2,0));zt.frustumCulled=!1,zt.renderOrder=4,vt.add(zt);const Ut=R.emitters.map(a=>new n(Math.cos(a),0,Math.sin(a))),te=Ut.map((a,u)=>{const M=[],y=[];for(let q=0;q<=6;q++){const T=J(x-1,R.tipR,q/6);M.push([a.x*T,0,a.z*T]),y.push(1.5)}return{pts:M,w:y,seed:u*.37+t()}}),jt=Ft(0,1.3),Pt=new w.Mesh(Ct(te),jt);Pt.frustumCulled=!1,Pt.renderOrder=5,ft.add(Pt);let ht=null;if(o.skyBeam!==!1){const a=[x,60,160,400,900,1800,3e3,4200],u=4200;ht=new w.Mesh(Ct([{pts:a.map(M=>[0,M,0]),w:a.map(M=>1.8+M*8e-4),u:a.map(M=>M/u),seed:.5}]),Ft(1,1.1)),ht.frustumCulled=!1,ht.renderOrder=2,C.add(ht)}await i.yield?.();{const u=o.veil===!1?0:1600,M=2600+u,y=new Float32Array(M*3),W=new Float32Array(M*4);for(let z=0;z<M;z++){let P,D;if(z<2600){P=45+520*Math.pow(t(),1.5);const U=t.gauss()*.42;D=Math.sin(U)*P,P=Math.cos(U)*P}else P=110+640*Math.sqrt(t()),D=-b+t.gauss()*14+6;const V=t()*F;y[z*3]=Math.cos(V)*P,y[z*3+1]=D,y[z*3+2]=Math.sin(V)*P,W[z*4]=t.range(.015,.05)*Math.sqrt(220/Math.max(P,60))*(t.chance(.85)?1:-1),W[z*4+1]=t.range(.7,2.4)*(t.chance(.06)?2.2:1),W[z*4+2]=t()*6.28,W[z*4+3]=t.range(.35,1.3)}const q=new w.BufferGeometry;q.setAttribute("position",new w.BufferAttribute(y,3)),q.setAttribute("aD",new w.BufferAttribute(W,4));const T=new w.Points(q,I(de,we,{},["uTime","uViewH","uStarCol","uStar","uRingN","uRingW"]));T.frustumCulled=!1,T.renderOrder=6,C.add(T)}const Ht=800;if(o.veil!==!1){const a=new w.RingGeometry(.5,Ht,96,12);a.rotateX(-Math.PI/2);const u=new w.Mesh(a,I(xe,ye,{uVeilR:{value:Ht},uGain:{value:1}},["uTime","uStarCol","uStar","uRingN","uRingW"]));u.position.y=-b,u.frustumCulled=!1,u.renderOrder=1,C.add(u)}const At=[],ee=[{lo:420,hi:474,ha:12,big:22,small:46},{lo:540,hi:640,ha:20,big:20,small:50}];for(let a=0;a<2;a++){const u=ee[a],M=new Xt,y=a?-1:1,W=new n(t.range(-.35,.35),t.range(.6,.85),t.range(.5,.75)).normalize();for(let z=0;z<u.big+u.small;z++){const P=z<u.big,D=t()*F,V=t.range(u.lo+6,u.hi-6),U=t.range(-1,1)*(u.ha-5),Y=P?t.range(2.6,6.5):t.range(.8,2.2);Fe(M,v,Math.cos(D)*V,U,Math.sin(D)*V,Y,P?1:0,S(s.ash,t.range(.7,1.05)),t()*50)}Q+=M.tris;const q=new w.Mesh(M.build(),L(-1));q.frustumCulled=!1;const T=new w.Group;T.quaternion.setFromUnitVectors(ct,W),T.add(q),C.add(T),At.push({mesh:q,normal:W,speed:y*t.range(.008,.016),Rc:(u.lo+u.hi)/2,hr:(u.hi-u.lo)/2+2,ha:u.ha+2}),await i.yield?.()}const j=new n(0,f,0),Gt=230,oe=[{n:E[0],Rc:498.5,hr:14.5,ha:24},{n:E[1],Rc:386,hr:18.5,ha:23.5},{n:E[2],Rc:315,hr:19.5,ha:9},...At.map(a=>({n:a.normal,Rc:a.Rc,hr:a.hr,ha:a.ha}))],pt=new n,mt=a=>{pt.set(a.x??a[0],a.y??a[1],a.z??a[2]).sub(j);let u=pt.length()-Gt;for(const M of oe){const y=pt.dot(M.n),W=Math.sqrt(Math.max(pt.lengthSq()-y*y,0));u=Math.min(u,Math.hypot(Math.max(Math.abs(W-M.Rc)-M.hr,0),Math.max(Math.abs(y)-M.ha,0)))}return u},Et=E[0],Bt=new n(0,0,1).addScaledVector(Et,-Et.z).normalize(),Ot=Bt.clone().multiplyScalar(It[0]).add(j),kt=new n(-Bt.x,-Bt.y,0).normalize(),st=Ot.clone().addScaledVector(kt,44);for(let a=0;a<30&&mt(st)<40;a++)st.addScaledVector(kt,3);const ne=new n(0,f,280),H=st.clone().sub(j),gt=H.z,tt=[new n(H.x,H.y,gt+330),new n(H.x,H.y,gt+170),new n(H.x,H.y,gt)];for(const a of[.3,.55,.8]){const u=.5+.5*Math.cos(Math.PI*a);tt.push(new n(H.x*u,H.y*u,J(gt,345,a)))}tt.push(new n(0,0,340),new n(0,0,310),new n(0,0,280));for(const a of tt)a.add(j);for(const a of tt)for(let u=0;u<20&&mt(a)<30&&a.z>300;u++)a.addScaledVector(kt,4);const Kt=[0,1,2,3,4].map(a=>({radius:It[a],halfWidth:[24,23.5,9,15.5,9][a],normal:a<3?E[a].clone():new n(0,1,0),spin:$[a],fixed:a<3})),ae={star:{position:j.clone(),radius:x},portalSeat:{position:ne,facing:new n(0,0,1),radius:7},flyThrough:tt,flyThroughClearance:Math.min(...tt.map(mt)),rimPass:st,rimPoint:Ot,approachDir:new n(0,0,-1),innerReach:Gt,rings:Kt,clearance:mt,keyLight:{position:j.clone(),color:"#"+c.getHexString(),intensity:2.5},viewpoints:{reveal:{position:new n(0,f+H.y,900),target:j.clone()},rimPass:{position:st.clone(),target:j.clone()},axis:{position:new n(0,f,430),target:j.clone()},above:{position:new n(380,f+460,760),target:j.clone()}}};let dt=Qt(o.progress??1,0,1);const Tt=new w.Vector2,$t=new w.Matrix4,ze=new n;let Vt=0;const Wt=()=>{m.uProgress.value=dt,Nt.uniforms.uGain.value=(.8+.2*dt)*J(1,.36,Vt),Dt.uniforms.uGain.value=J(1,.36,Vt),jt.uniforms.uGain.value=.55+.45*Yt(.1,.9,dt)};Wt();function Rt(a,u,M){m.uTime.value=u,M&&(Vt=1-Yt(400,720,M.position.distanceTo(m.uStar.value)),Wt());for(let y=0;y<3;y++)O[y].rotation.y=K[y]+$[y]*u;ut.rotation.x=K[3]+$[3]*u,ft.rotation.z=K[4]+$[4]*u,vt.rotation.y=u*.035;for(const y of At)y.mesh.rotation.y=y.speed*u;k.updateWorldMatrix(!0,!0),C.getWorldPosition(m.uStar.value),$t.copy(k.matrixWorld).invert();for(let y=0;y<5;y++)m.uRingN.value[y].set(0,1,0).transformDirection(O[y].matrixWorld),y>=3&&Kt[y].normal.copy(m.uRingN.value[y]).transformDirection($t);for(let y=0;y<4;y++)m.uBeam.value[y].copy(Ut[y]).transformDirection(O[4].matrixWorld);i.renderer&&i.renderer.getDrawingBufferSize&&(i.renderer.getDrawingBufferSize(Tt),Tt.y>0&&(m.uViewH.value=Tt.y))}return Rt(0,0,null),{object:k,radius:520,height:f*2,center:j.clone(),anchors:ae,update:Rt,dispose(){},setProgress(a){dt=Qt(a,0,1),Wt()},uniforms:m,shadowGLSL:wt,ground:!1,groundY:0,stats:{triangles:Q+2016*2+960*2}}}export{wt as SHADOW_GLSL,Ae as buildHero};
