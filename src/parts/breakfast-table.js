import*as e from"three";import{mergeGeometries as be}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as te,lerp as oe,smoothstep as We}from"../kit/core.js";const G=Math.PI*2,Lt=["#fff1d0","#8aa48f","#e4dac4","#8f5d36","#c0392b","#3a2414","#ffb300"];function se(s,p,r,_=[],N=!1){const V=s*(p+1),L=new Float32Array(V*3),T=new Float32Array(V*3),B=_.map(d=>new Float32Array(V*d.size)),P={p:[0,0,0],c:[1,1,1],a:_.map(d=>new Array(d.size).fill(0))};for(let d=0;d<=p;d++)for(let b=0;b<s;b++){const y=d*s+b;r(d,b/s*G,P,b),L[y*3]=P.p[0],L[y*3+1]=P.p[1],L[y*3+2]=P.p[2],T[y*3]=P.c[0],T[y*3+1]=P.c[1],T[y*3+2]=P.c[2];for(let k=0;k<B.length;k++)for(let z=0;z<_[k].size;z++)B[k][y*_[k].size+z]=P.a[k][z]}const x=new Uint32Array(s*p*6);let m=0;for(let d=0;d<p;d++)for(let b=0;b<s;b++){const y=d*s+b,k=d*s+(b+1)%s,z=y+s,F=k+s;N?(x[m++]=y,x[m++]=z,x[m++]=k,x[m++]=k,x[m++]=z,x[m++]=F):(x[m++]=y,x[m++]=k,x[m++]=z,x[m++]=k,x[m++]=F,x[m++]=z)}const M=new e.BufferGeometry;return M.setAttribute("position",new e.BufferAttribute(L,3)),M.setAttribute("color",new e.BufferAttribute(T,3)),_.forEach((d,b)=>M.setAttribute(d.name,new e.BufferAttribute(B[b],d.size))),M.setIndex(new e.BufferAttribute(x,1)),M.computeVertexNormals(),M}async function Bt(s,p,r,_,N=[]){const V=p*(r+1),L=new Float32Array(V*3),T=new Float32Array(V*3).fill(1),B=N.map(d=>new Float32Array(V*d.size)),P={p:[0,0,0],c:[1,1,1],a:N.map(d=>new Array(d.size).fill(0))};for(let d=0;d<=r;d++){for(let b=0;b<p;b++){const y=d*p+b;_(d,b/p*G,P,b),L[y*3]=P.p[0],L[y*3+1]=P.p[1],L[y*3+2]=P.p[2];for(let k=0;k<B.length;k++)for(let z=0;z<N[k].size;z++)B[k][y*N[k].size+z]=P.a[k][z]}(d&7)===7&&await s.yield()}const x=new Uint32Array(p*r*6);let m=0;for(let d=0;d<r;d++)for(let b=0;b<p;b++){const y=d*p+b,k=d*p+(b+1)%p,z=y+p,F=k+p;x[m++]=y,x[m++]=k,x[m++]=z,x[m++]=k,x[m++]=F,x[m++]=z}const M=new e.BufferGeometry;return M.setAttribute("position",new e.BufferAttribute(L,3)),M.setAttribute("color",new e.BufferAttribute(T,3)),N.forEach((d,b)=>M.setAttribute(d.name,new e.BufferAttribute(B[b],d.size))),M.setIndex(new e.BufferAttribute(x,1)),M.computeVertexNormals(),M}function xe(s,p,r,_,N=null){const V=s.map(P=>new e.Vector2(P[0],P[1])),L=new e.SplineCurve(V),T=(s.length-1)*r,B=L.getPoints(T);return se(p,T,(P,x,m)=>{const M=B[P],d=P/T,b=N?N(M.x,M.y,x,d):M.x;m.p[0]=Math.cos(x)*b,m.p[1]=M.y,m.p[2]=Math.sin(x)*b;const y=_(M.x,M.y,d,x);m.c[0]=y[0],m.c[1]=y[1],m.c[2]=y[2]},[],!0)}function mt(s,p,r,_,N,V=!1){const L=new e.CatmullRomCurve3(s,V,"centripetal"),T=L.computeFrenetFrames(p,V),B=new e.Vector3;return se(r,p,(P,x,m)=>{const M=P/p;L.getPointAt(M,B);const d=_(M),b=T.normals[P],y=T.binormals[P],k=Math.cos(x),z=Math.sin(x);m.p[0]=B.x+(b.x*k+y.x*z)*d,m.p[1]=B.y+(b.y*k+y.y*z)*d,m.p[2]=B.z+(b.z*k+y.z*z)*d;const F=N(M,x);m.c[0]=F[0],m.c[1]=F[1],m.c[2]=F[2]},[],!0)}function Rt(s,p,r){const _=s.attributes.position,N=s.attributes.normal,V=s.index.array,L=_.count,T=p.length,B=new Float32Array(T*L*3),P=new Float32Array(T*L*3),x=new Float32Array(T*L*3),m=new Uint32Array(T*V.length),M=new e.Vector3,d=new e.Matrix3;for(let y=0;y<T;y++){d.getNormalMatrix(p[y]);const k=r[y],z=y*L*3;for(let F=0;F<L;F++)M.fromBufferAttribute(_,F).applyMatrix4(p[y]),B[z+F*3]=M.x,B[z+F*3+1]=M.y,B[z+F*3+2]=M.z,M.fromBufferAttribute(N,F).applyMatrix3(d).normalize(),P[z+F*3]=M.x,P[z+F*3+1]=M.y,P[z+F*3+2]=M.z,x[z+F*3]=k[0],x[z+F*3+1]=k[1],x[z+F*3+2]=k[2];for(let F=0;F<V.length;F++)m[y*V.length+F]=V[F]+y*L}const b=new e.BufferGeometry;return b.setAttribute("position",new e.BufferAttribute(B,3)),b.setAttribute("normal",new e.BufferAttribute(P,3)),b.setAttribute("color",new e.BufferAttribute(x,3)),b.setIndex(new e.BufferAttribute(m,1)),b}const ie=s=>{const p=new e.Color(s);return[p.r,p.g,p.b]},Z=(s,p,r)=>[s[0]+(p[0]-s[0])*r,s[1]+(p[1]-s[1])*r,s[2]+(p[2]-s[2])*r],W=(s,p)=>[s[0]*p,s[1]*p,s[2]*p];function Ae(s,p){return s.applyMatrix4(p),s}const ce=(s,p,r,_=0,N=0,V=0,L=1)=>new e.Matrix4().compose(new e.Vector3(s,p,r),new e.Quaternion().setFromEuler(new e.Euler(_,N,V)),new e.Vector3(L,L,L)),dt=`
float h31(vec3 p){ p=fract(p*vec3(.1031,.1030,.0973)); p+=dot(p,p.yxz+33.33); return fract((p.x+p.y)*p.z); }
float vn3(vec3 p){ vec3 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
             mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z); }
float fbm3(vec3 p){ float a=.5,s=0.; for(int i=0;i<4;i++){ s+=a*vn3(p); p=p*2.03+7.1; a*=.5; } return s; }
`;function De(s,p,r,_,N={}){const V=s(p),L=V.onBeforeCompile,T=V.customProgramCacheKey;return V.onBeforeCompile=(B,P)=>{L&&L.call(V,B,P),Object.assign(B.uniforms,N),B.vertexShader=B.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vOP; varying vec3 vON;`).replace("#include <begin_vertex>",`#include <begin_vertex>
vOP = position; vON = normal;`),B.fragmentShader=B.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vOP; varying vec3 vON;
`+dt+r).replace("#include <color_fragment>",`#include <color_fragment>
detail(diffuseColor.rgb, vOP, normalize(vON));`).replace("#include <roughnessmap_fragment>",`#include <roughnessmap_fragment>
roughnessFactor = detailRough(roughnessFactor, vOP);`).replace("metalnessFactor=clamp(iMetal,0.,1.);","metalnessFactor=clamp(iMetal,0.,1.); roughnessFactor = detailRough(roughnessFactor, vOP);")},V.customProgramCacheKey=()=>"bt-hero-"+_+"|"+(T?T.call(V):""),V}const Tt=`
uniform float uTime, uProgress;
varying vec3 vW, vN; varying float vFlow, vThin, vLy;
#include <fog_pars_vertex>
#ifdef ROPE
attribute float aT, aAng;
uniform vec3 uTop; uniform float uFall, uCoilH, uCoilR, uTurns, uSpin, uSplit;
float ropeAng(float t){ float ks=(t-uSplit)/(1.-uSplit); return (ks<0. ? ks*1.6 : ks*uTurns*6.2831853) - uTime*uSpin; }
vec3 ropeC(float t){
  float ks=(t-uSplit)/(1.-uSplit), k=clamp(ks,0.,1.), fall=clamp(t/uSplit,0.,1.);
  float ang=ropeAng(t);
  float rc=uCoilR*smoothstep(-0.45,0.22,ks)*(0.5+0.8*k);
  vec2 sway=vec2(sin(uTime*0.6+t*9.),cos(uTime*0.47+t*11.))*0.09*sin(fall*3.14159);
  return uTop+vec3(cos(ang)*rc+sway.x, -uFall*pow(fall,0.92)-uCoilH*k, sin(ang)*rc+sway.y);
}
float ropeR(float t){
  float fall=clamp(t/uSplit,0.,1.);
  float r=mix(0.66,0.25,smoothstep(0.0,0.5,fall));
  r+=0.085*pow(0.5+0.5*sin(fall*9.-uTime*1.7),8.)*smoothstep(0.1,0.3,fall)*(1.-step(uSplit,t));
  float cap=1.-min(fall/0.06,1.); r*=sqrt(max(0.,1.-cap*cap));     // rounded start inside the dipper's honey
  return r*(1.-0.5*smoothstep(0.97,1.,t));
}
#endif
#ifdef MORPH
attribute vec3 aPos0; attribute vec2 aSkin;
#endif
#ifdef DROP
attribute vec4 aDrop; attribute vec3 aDrop0; attribute float aFallD;
#endif
#ifdef CLIP
uniform mat4 uJarMat;
#endif
void main(){
  vec3 p=position; vec3 n=normal; vFlow=p.y; vThin=1.; vLy=0.;
  #ifdef ROPE
    float e=0.004;
    vec3 c=ropeC(aT); vec3 T=normalize(ropeC(aT+e)-ropeC(aT-e));
    float ang=ropeAng(aT); vec3 R=vec3(cos(ang),0.,sin(ang));
    vec3 B=normalize(cross(T,R)); R=cross(B,T);
    n=cos(aAng)*R+sin(aAng)*B; p=c+n*ropeR(aT);
    vFlow=aT*uTurns*20.; vThin=0.8;
  #endif
  #ifdef MORPH
    float e=uProgress*uProgress*(3.-2.*uProgress);
    if(aSkin.x>50.) e=smoothstep(0.72,1.,e);                     // plate puddles only spread once the sheets arrive
    p=mix(aPos0,position,e);
    vFlow=aSkin.x; vThin=aSkin.y;
    p+=n*0.045*sin(aSkin.x*2.2-uTime*0.8+p.x*0.6+p.z*0.4)*smoothstep(0.3,1.5,aSkin.x)*min(aSkin.y,1.);
  #endif
  #ifdef DROP
    float ph=fract(uTime/(5.+6.*aDrop.w)+aDrop.w*9.7);
    float gr=smoothstep(0.,0.62,ph), f=clamp((ph-0.62)/0.38,0.,1.);
    float sc=gr*(1.-smoothstep(0.86,1.,f));
    float pe=uProgress*uProgress*(3.-2.*uProgress);
    vec3 anchor=mix(aDrop0,aDrop.xyz,pe);
    p=anchor+position*sc*vec3(1.,1.+f*1.2,1.)-vec3(0.,gr*0.22+f*f*(aFallD+anchor.y-aDrop.y),0.);
    vFlow=aDrop.w*10.; vThin=0.6;
  #endif
  vec4 w=modelMatrix*vec4(p,1.); vW=w.xyz; vN=normalize(mat3(modelMatrix)*n);
  #ifdef CLIP
    vLy=(uJarMat*vec4(p,1.)).y;
  #endif
  vec4 mvPosition=viewMatrix*w; gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Dt=`
uniform float uTime, uLevel, uGlow, uWet;
uniform vec3 uLightDir, uLightCol, uAmbient, uAbsorb, uUnder;
varying vec3 vW, vN; varying float vFlow, vThin, vLy;
#include <fog_pars_fragment>
${dt}
void main(){
  vec3 N=normalize(vN), V=normalize(cameraPosition-vW), L=normalize(uLightDir);
  #ifdef CLIP
    if(vLy>uLevel) discard;
    if(!gl_FrontFacing) N=vec3(0.,1.,0.);
  #else
    if(!gl_FrontFacing) N=-N;
  #endif
  float ndv=clamp(dot(N,V),0.,1.);
  vec3 q=vec3(vW.x*1.3, vFlow*0.55-uTime*0.22, vW.z*1.3);
  float streak=fbm3(q);
  #ifdef MORPH
    streak=0.5+(streak-0.5)*0.8;
  #endif
  { float rp=0.07;                                                // slow ripples break the highlights into glints
    #ifdef MORPH
      rp=0.2;
    #endif
    N=normalize(N+rp*vec3(vn3(q*2.6)-0.5, 0., vn3(q*2.6+11.)-0.5)); ndv=clamp(dot(N,V),0.,1.); }
  float deep=1.-uWet;                                             // 1: free honey (rope, coil, jar): thin gold edges, deep amber middle
  float thick=mix(mix(0.85,0.3,deep),2.5,ndv*ndv)*(0.72+0.56*streak)*max(vThin,0.75);      // optical depth proxy
  #ifdef CLIP
    thick*=1.5;
  #endif
  #ifdef MORPH
    thick*=1.5;
  #endif
  vec3 trans=exp(-thick*uAbsorb)*uUnder;                          // Beer-Lambert amber over what lies beneath
  float back=pow(clamp(0.5-0.5*dot(V,L),0.,1.),1.5);              // 1 when looking into the light
  float wrap=clamp(dot(N,L)*0.5+0.5,0.,1.);
  vec3 core=exp(-thick*0.55*uAbsorb);                             // light that came straight through: gold, not cream
  float rim=1.-ndv; rim*=rim;
  vec3 col=trans*(uAmbient*0.75+uLightCol*(0.09+0.3*wrap*wrap))*(1.-0.5*deep*ndv);
  col+=core*uLightCol*vec3(1.,0.8,0.3)*uGlow*(back*(0.35+0.65*(1.-0.7*ndv))+0.22*rim*(0.35+back))*(1.-0.85*ndv*deep);   // the glow sits on the edges, the middle stays deep
  float bub=smoothstep(0.80,0.92,vn3(q*7.)); col+=trans*uLightCol*bub*0.10*(0.4+back);
  vec3 H=normalize(L+V); float nh=max(dot(N,H),0.);
  float F=0.04+0.96*pow(1.-ndv,5.);
  #ifdef MORPH
    F=0.07+0.93*pow(1.-ndv,3.);                                  // the sheets are wet glass
  #endif
  vec3 R=reflect(-V,N);
  vec3 env=mix(uAmbient*0.5,uAmbient*mix(1.1,1.9,uWet),smoothstep(-0.2,0.6,R.y));
  float win=smoothstep(0.72,0.94,dot(R,normalize(vec3(L.x,L.y*0.35,L.z))));  // the window mirrored in the wet surface
  win*=smoothstep(0.92,0.5,abs(fract(R.y*2.5+streak*0.3)-0.5)*2.);
  col=mix(col,env,F*0.45);
  col+=uLightCol*win*mix(0.06+0.3*F,0.16+0.7*F,uWet);            // uWet 0: no pale window sheen (rope), 1: wet glass (sheets)
  col+=uLightCol*(pow(nh,130.)*1.8+pow(nh,22.)*0.10);
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`,Nt=`
varying vec3 vW, vN, vO;
#include <fog_pars_vertex>
void main(){ vO=position; vec4 w=modelMatrix*vec4(position,1.); vW=w.xyz; vN=normalize(mat3(modelMatrix)*normal);
  vec4 mvPosition=viewMatrix*w; gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,Ot=`
uniform vec3 uLightDir, uLightCol, uAmbient; uniform vec2 uBand;
varying vec3 vW, vN, vO;
#include <fog_pars_fragment>
// distance to the nearest hexagon edge: the embossed honeycomb band of a honey jar
float hexEdge(vec2 p){ vec2 r=vec2(1.,1.7320508), h=r*.5; vec2 a=mod(p,r)-h, b=mod(p-h,r)-h;
  vec2 g=dot(a,a)<dot(b,b)?a:b; g=abs(g); return 0.5-max(dot(g,normalize(r)),g.x); }
void main(){
  vec3 N=normalize(vN), V=normalize(cameraPosition-vW), L=normalize(uLightDir);
  if(!gl_FrontFacing) N=-N;
  float band=smoothstep(uBand.x,uBand.x+0.25,vO.y)*(1.-smoothstep(uBand.y-0.25,uBand.y,vO.y));
  float he=hexEdge(vec2(atan(vO.z,vO.x)*4.7746, vO.y*1.85));
  float ridge=(1.-smoothstep(0.02,0.11,he))*band;
  float ndv=clamp(dot(N,V),0.,1.);
  float F=0.05+0.95*pow(1.-ndv,3.5);
  vec3 H=normalize(L+V); float nh=max(dot(N,H),0.);
  float back=pow(clamp(0.5-0.5*dot(V,L),0.,1.),2.);
  float spec=pow(nh,320.)*5.+pow(nh,40.)*0.25+ridge*pow(nh,10.)*0.9;
  vec3 col=uAmbient*(0.9*F+0.35*ridge)+uLightCol*(spec+ridge*back*0.25+F*back*0.3);
  float a=clamp(0.07+0.75*F+ridge*0.3+spec,0.,1.);
  gl_FragColor=vec4(col,a);
  #include <fog_fragment>
}`;async function It(s,p={}){const r=s.rng.fork?s.rng.fork("honey-fall"):s.rng,_=p.palette&&p.palette.length>=7?p.palette:Lt,[N,V,L,T,B,P,x]=_.map(ie),m=new e.Group;m.name="honey-fall";const M=p.standardMaterial||(t=>new e.MeshStandardMaterial(t)),d=r.int(0,2),b=p.chinaBlue||["#2b4a9c","#27407f","#3a5aa8"][d],y=ie(b),k=[V,Z(V,N,.18),Z(V,y,.3)][r.int(0,2)],z=[k[0]*.56,k[1]*.72,k[2]*.6],F=r.int(5,7),vt=new e.Vector3().copy(p.lightDir||new e.Vector3(-.6,.7,.4)).normalize(),gt=p.lightColor?new e.Color().copy(p.lightColor):new e.Color(_[0]).multiplyScalar(3),wt=p.ambient?new e.Color().copy(p.ambient):new e.Color(_[0]).multiplyScalar(.55),ne={uTime:{value:0},uProgress:{value:te(p.progress??1,0,1)},uLightDir:{value:vt},uLightCol:{value:gt},uAmbient:{value:wt}},ke=[[0,.5],[2.5,.5],[4.9,.5],[5.5,.6],[6.5,.93],[7.3,1.24],[7.56,1.31],[7.66,1.25],[7.45,1.1],[6.4,.66],[5.2,.27],[4.5,.2],[4.38,0],[3.95,0],[3.82,.2],[2,.26],[0,.27]],Ne=t=>{for(let o=1;o<7;o++)if(t<=ke[o][0]){const n=ke[o-1],i=ke[o];return oe(n[1],i[1],(t-n[0])/(i[0]-n[0]))}return 1.31};{const t=new e.SplineCurve(ke.map(c=>new e.Vector2(c[0],c[1]))).getPoints(96),o=W(N,.78),n=se(128,96,(c,f,h)=>{const w=t[c];h.p[0]=Math.cos(f)*w.x,h.p[1]=w.y,h.p[2]=Math.sin(f)*w.x,h.c=o}),i=De(M,{vertexColors:!0,roughness:.16,metalness:0},`
      uniform vec3 uChina; uniform vec2 uPat;
      void detail(inout vec3 c, vec3 p, vec3 n){
        float r=length(p.xz), a=atan(p.z,p.x);
        float up=step(0.0,n.y)*step(0.45,p.y), m=0.;
        m=max(m, smoothstep(7.34,7.39,r));
        float sc=6.3+0.3*abs(sin(a*uPat.x));
        m=max(m, smoothstep(sc,sc+0.05,r)*(1.-smoothstep(6.93,6.98,r)));
        m=max(m, smoothstep(7.08,7.11,r)*(1.-smoothstep(7.18,7.21,r)));
        float da=fract(a*uPat.y/6.2831853)-0.5; vec2 dp=vec2(da*6.2831853/uPat.y*5.9, r-5.9);
        m=max(m, 1.-smoothstep(0.09,0.13,length(dp)));
        m=max(m, smoothstep(5.36,5.39,r)*(1.-smoothstep(5.47,5.5,r)));
        c=mix(c, uChina*(0.75+0.5*vn3(p*4.)), m*up*0.94);
        c*=0.93+0.07*vn3(p*1.1);
      }
      float detailRough(float r, vec3 p){ return r+0.08*vn3(p*9.); }`,"plate",{uChina:{value:new e.Color(y[0],y[1],y[2])},uPat:{value:new e.Vector2([12,16,20][d]/2,[40,32,48][d])}}),l=new e.Mesh(n,i);l.name="plate",m.add(l)}await s.yield();const le=[];let Oe=.5;for(let t=0;t<F;t++){const o=r.range(.56,.68),n=t===F-1;le.push({y0:Oe,y1:Oe+o,h:o,r:n?r.range(4.75,4.95):r.range(4.8,5.25),ox:r.range(-.28,.28)*(n?.4:1),oz:r.range(-.28,.28)*(n?.4:1),p1:r.range(0,G),p2:r.range(0,G),p3:r.range(0,G),p4:r.range(0,G),tone:r.range(.85,1.1)}),Oe+=o-.015}const Y=le[F-1].y1,_e=Y-.5,Ye=(t,o)=>t.r*(1+.022*Math.sin(2*o+t.p1)+.014*Math.sin(5*o+t.p2)+.008*Math.sin(11*o+t.p3)),Qe=t=>.24*(1-Math.sqrt(Math.max(0,1-t*t))),Se=(t,o)=>{let n=le[0];for(let l=0;l<F;l++)o>=le[l].y0&&(n=le[l]);const i=te((o-n.y0)/n.h*2-1,-1,1);return Ye(n,t)-Qe(i)+n.ox*Math.cos(t)+n.oz*Math.sin(t)};{const t=W(ie("#ecc98c"),.86),o=ie("#a9641f"),n=ie("#7c4313"),i=[0,.4,.7,.88,.96],l=[1,.8,.45,0,-.45,-.8,-1],c=[.95,.8],f=le.map(g=>se(96,i.length+l.length+c.length-1,(a,u,v)=>{const S=Ye(g,u);let A,C,D;const E=.05*Math.sin(3*u+g.p4);if(a<i.length)A=i[a]*(S-.24),C=g.y1+.03*(1-i[a])+E*i[a]*i[a],D=Z(o,n,.5+.5*Math.sin(u*3+g.p2+i[a]*4)),a===i.length-1&&(D=Z(D,t,.45));else if(a<i.length+l.length){const O=l[a-i.length];A=S-Qe(O),C=(g.y0+g.y1)/2+O*g.h/2+E,D=Z(t,o,Math.pow(Math.abs(O),2.2)*.85)}else A=c[a-i.length-l.length]*(S-.24),C=g.y0+E,D=Z(o,n,.6);v.p[0]=g.ox+Math.cos(u)*A,v.p[1]=C,v.p[2]=g.oz+Math.sin(u)*A,v.c=W(D,g.tone)})),h=De(M,{vertexColors:!0,roughness:.82},`
      void detail(inout vec3 c, vec3 p, vec3 n){
        float m=fbm3(p*vec3(1.2,3.,1.2)), flat_=abs(n.y);
        float pores=smoothstep(0.6,0.8,vn3(p*vec3(6.,13.,6.)));
        c*=0.74+0.55*m; c*=1.-0.4*pores*(1.-flat_);
        float blot=smoothstep(0.45,0.7,fbm3(p*0.8+3.)); c=mix(c,c*vec3(0.6,0.47,0.36),blot*flat_*0.75);
      }
      float detailRough(float r, vec3 p){ return r; }`,"pancake"),w=new e.Mesh(be(f),h);w.name="pancakes",m.add(w)}await s.yield();const Q=r.range(-.25,.25),K=r.range(.1,.5),Ke=r.int(5,7),ue=[],yt=r.range(0,G);for(let t=0;t<Ke;t++){const o=t%2===0&&ue.filter(n=>n.full).length<3;ue.push({th:yt+(t+r.range(-.22,.22))*G/Ke,w:o?r.range(.4,.62):r.range(.26,.44),D:o?_e*1.5:r.range(.25,.8)*_e,full:o})}const je=(t,o)=>{let n=(t-o)%G;return n>Math.PI&&(n-=G),n<-Math.PI&&(n+=G),n},Ge=r.range(0,G),Je=r.range(1.9,2.5),Xe=r.range(0,G);{const t=W(ie("#ffe394"),.88),o=[[0,1],[.6,1],[.86,.97],[.98,.82],[1.03,.55],[1.1,.25],[1.22,.05],[1.3,-.06]],n=se(40,o.length-1,(l,c,f)=>{const h=.95/Math.pow(Math.pow(Math.abs(Math.cos(c)),5)+Math.pow(Math.abs(Math.sin(c)),5),.2),w=o[l][0]*h*(1+.04*Math.sin(c*3+Xe));f.p[0]=Math.cos(c)*w,f.p[1]=o[l][1]*.62,f.p[2]=Math.sin(c)*w,f.c=W(t,.9+.1*o[l][1])});Ae(n,ce(Math.cos(Ge)*Je,Y+.02,Math.sin(Ge)*Je,.03,Xe,-.04));const i=new e.Mesh(n,M({vertexColors:!0,roughness:.28,emissive:new e.Color("#ffd76a"),emissiveIntensity:.12}));i.name="butter",m.add(i)}{const t=[],o=[],n=new e.SphereGeometry(1,6,4),i=B,l=W(B,.45),c=r.int(3,5),f=new e.Matrix4;for(let w=0;w<c;w++){let g=0;for(let A=0;A<12&&(g=r.range(0,G),!ue.every(C=>!C.full||Math.abs(je(g,C.th))>C.w+.3));A++);const a=r.range(6.05,6.5),u=r.range(.5,.64),v=Ne(a)+u*.72;f.copy(ce(Math.cos(g)*a,v,Math.sin(g)*a,r.range(-1.5,1.5),r.range(0,G),r.range(-1.5,1.5)));const S=40;for(let A=0;A<S;A++){const C=1-2*(A+.5)/S,D=Math.sqrt(1-C*C),E=A*2.39996,O=1-.22*(C*.5+.5);t.push(ce(Math.cos(E)*D*u*O,C*u*1.12,Math.sin(E)*D*u*O,0,r.range(0,3),0,u*r.range(.25,.31)).premultiply(f)),o.push(Z(l,i,r.range(.35,1)))}}const h=new e.Mesh(Rt(n,t,o),M({vertexColors:!0,roughness:.42}));h.name="raspberries",m.add(h)}await s.yield();const Ie=r.range(.85,1.25),ae={value:new e.Vector3(.11,.66,3.4).multiplyScalar(Ie)},ze=Math.max(Ie,1.08)/Ie,Ze={value:0},$e={value:new e.Matrix4},me=(t,o={},n=e.FrontSide)=>new e.ShaderMaterial({defines:t,side:n,fog:!0,vertexShader:Tt,fragmentShader:Dt,uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),...ne,uAbsorb:ae,uLevel:Ze,uJarMat:$e,uGlow:{value:.7},uWet:{value:0},uUnder:{value:new e.Vector3(1,1,1)},...o}}),et=r.range(0,G),Mt=r.range(0,G),bt=t=>4.05+.32*Math.sin(3*t+et)+.2*Math.sin(5*t+Mt)+.3*Math.max(0,Math.cos(t-Ge)),Pe=.4,xt=_e-.04,Fe=(t,o)=>{const n=Se(t,Y),i=Math.min(bt(t),n-.12);let l=i;for(const c of ue){const f=Math.abs(je(t,c.th))/c.w;if(f>=1)continue;const h=Math.cos(f*Math.PI/2),w=c.full?Math.pow(h,1.1):h*h;l=Math.max(l,i+(n+Pe+Math.min(c.D*o,xt-.31)-i)*w)}return l},At=(t,o)=>{let n=0;for(let i=-2;i<=2;i++)n=Math.max(n,Se(t,te(o+i*.12,.5,Y)));return n},de={x:0,y:0,z:0,t:0},Ce=(t,o,n)=>{const i=Se(t,Y),l=o/n,c=Math.cos(t),f=Math.sin(t),h=Math.sqrt(Math.max(0,1-Math.pow(l,16)));let w,g,a,u=0;if(o<=i)w=o,g=Y,a=Math.PI/2;else{const ee=o-i;u=te(ee/Pe,0,1),g=ee<Pe?Y-.31*(1-Math.cos(u*Math.PI/2)):Y-.31-(ee-Pe),g=Math.max(g,.54),w=oe(i,At(t,g),We(0,1,u)),a=Math.PI/2*(1-u)}const v=.19+.05*Math.sin(t*4+o*2.1+et),S=.12+.22*Math.exp(-Math.pow((n-o)/.5,2)),A=oe(v,S,u)*h,C=c*w,D=f*w,E=(C-Q)*(C-Q)+(D-K)*(D-K),O=u===0?.55*Math.exp(-E/1.7):0;return de.x=c*(w+A*Math.cos(a)),de.z=f*(w+A*Math.cos(a)),de.y=g+A*Math.sin(a)+O,de.t=A+O*.6,de},tt=[{name:"aPos0",size:3},{name:"aSkin",size:2}],ot=.1;{const o=[],n=new Float32Array(240),i=new Float32Array(240);o.push(await Bt(s,240,64,(c,f,h,w)=>{c===0&&(n[w]=Fe(f,1),i[w]=Fe(f,ot));const g=c/64,a=n[w],u=i[w];let v=Ce(f,g*u,u);h.a[0][0]=v.x,h.a[0][1]=v.y,h.a[0][2]=v.z,v=Ce(f,g*a,a),h.p[0]=v.x,h.p[1]=v.y,h.p[2]=v.z,h.a[1][0]=g*a,h.a[1][1]=te(v.t/.2,.3,1.9)},tt));for(const c of ue)if(c.full){const f=Se(c.th,.6)+.25,h=r.range(1.3,1.9),w=r.range(0,G),g=r.range(1.4,1.9)*Math.min(1.3,c.w*2.2);o.push(se(30,7,(a,u,v)=>{const S=a/7,A=h*(1+.22*Math.sin(u*3+w)+.12*Math.sin(u*5+w*2)),C=Math.min(f+Math.cos(u)*S*A,7.2),D=c.th+Math.sin(u)*S*A*g/f,E=.17*Math.sqrt(1-Math.pow(S,5));v.p[0]=Math.cos(D)*C,v.p[1]=Ne(C)+E,v.p[2]=Math.sin(D)*C,v.a[0][0]=Math.cos(c.th)*(f-.7),v.a[0][1]=.52,v.a[0][2]=Math.sin(c.th)*(f-.7),v.a[1][0]=60+S*A,v.a[1][1]=1.35},tt))}const l=new e.Mesh(be(o),me({MORPH:1},{uUnder:{value:new e.Vector3(.92,.74,.52)},uGlow:{value:.55},uWet:{value:.7}}));l.name="honey-skin",l.frustumCulled=!1,m.add(l)}await s.yield();const Ee=r.range(.78,.96),pe=r.range(-.22,.22),ve=new e.Vector3(Math.sin(pe),0,Math.cos(pe)),nt=new e.Vector3(ve.x*Math.cos(Ee),-Math.sin(Ee),ve.z*Math.cos(Ee)),fe=new e.Vector3(Q,Y+r.range(7,7.8),K),ge=fe.clone().addScaledVector(nt,-6.5),U=new e.Group;U.name="jar",U.position.copy(ge),U.quaternion.setFromUnitVectors(new e.Vector3(0,1,0),nt),U.updateMatrix(),m.add(U),$e.value.copy(U.matrix),Ze.value=ge.y+r.range(.7,1.3);const we=new e.Vector3(0,-1,0).applyQuaternion(U.quaternion.clone().invert()),at=r.range(1.7,2.1),kt=r.range(4.6,5.8),Ve=new e.Vector3(Q,Y+.42,K);{const i=new Float32Array(6252),l=new Float32Array(6252),c=new Uint32Array(520*12*6);let f=0;for(let a=0;a<=520;a++)for(let u=0;u<12;u++)i[a*12+u]=a/520,l[a*12+u]=u/12*G;for(let a=0;a<520;a++)for(let u=0;u<12;u++){const v=a*12+u,S=a*12+(u+1)%12,A=v+12,C=S+12;c[f++]=v,c[f++]=S,c[f++]=A,c[f++]=S,c[f++]=C,c[f++]=A}const h=new e.BufferGeometry;h.setAttribute("position",new e.BufferAttribute(new Float32Array(6252*3),3)),h.setAttribute("normal",new e.BufferAttribute(new Float32Array(6252*3),3)),h.setAttribute("aT",new e.BufferAttribute(i,1)),h.setAttribute("aAng",new e.BufferAttribute(l,1)),h.setIndex(new e.BufferAttribute(c,1)),h.boundingSphere=new e.Sphere(fe.clone().lerp(Ve,.5),6);const w=me({ROPE:1},{uAbsorb:{value:new e.Vector3(ae.value.x,ae.value.y*1.2*ze,ae.value.z*1.8*ze)},uTop:{value:fe},uFall:{value:fe.y-Ve.y-at},uCoilH:{value:at},uCoilR:{value:r.range(.78,.98)},uTurns:{value:kt},uSpin:{value:r.range(1.5,2.1)*r.sign()},uSplit:{value:.28}},e.DoubleSide);w.uniforms.uGlow.value=.9;const g=new e.Mesh(h,w);g.name="honey-rope",g.frustumCulled=!1,m.add(g)}await s.yield();{const t=xe([[0,-.21],[.14,-.15],[.2,0],[.14,.17],[.06,.34],[0,.52]],8,2,()=>[1,1,1]);t.deleteAttribute("color");const o=[],n=t.attributes.position.count,i=(l,c)=>{const f=Fe(l,1),h=Fe(l,ot),w=Ce(l,h*.985,h),g=[w.x,w.y-.1,w.z],a=Ce(l,f*.985,f),u=r();if(a.y<1.6)return;const v=t.clone().scale(c,c,c),S=Math.hypot(a.x,a.z)+.1,A=a.y-.1-Ne(S)-.15,C=new Float32Array(n*4),D=new Float32Array(n*3),E=new Float32Array(n);for(let O=0;O<n;O++)C[O*4]=a.x*(S/(S-.1)),C[O*4+1]=a.y-.1,C[O*4+2]=a.z*(S/(S-.1)),C[O*4+3]=u,D[O*3]=g[0],D[O*3+1]=g[1],D[O*3+2]=g[2],E[O]=A;v.setAttribute("aDrop",new e.BufferAttribute(C,4)),v.setAttribute("aDrop0",new e.BufferAttribute(D,3)),v.setAttribute("aFallD",new e.BufferAttribute(E,1)),o.push(v)};for(const l of ue)l.full?(i(l.th+l.w*.78,.8),i(l.th-l.w*.8,.9)):i(l.th,r.range(.9,1.3));if(o.length){const l=new e.Mesh(be(o),me({DROP:1}));l.name="honey-drops",l.frustumCulled=!1,m.add(l)}}await s.yield();{const t=xe([[0,-2.8],[1.75,-2.8],[2.18,-2.62],[2.27,-2.2],[2.27,1],[2.2,1.55],[1.85,2.08],[1.55,2.33],[1.5,2.7],[1.5,3.02],[0,3.02]],48,3,()=>[1,1,1]);t.deleteAttribute("color");const o=new e.Mesh(t,me({CLIP:1},{},e.DoubleSide));o.name="jar-honey",U.add(o);const n=c=>Math.max(0,Math.cos(c)*we.x+Math.sin(c)*we.z)/Math.max(.2,Math.hypot(we.x,we.z)),i=xe([[1.42,2.7],[1.38,3.05],[1.05,3.5],[.7,4],[.6,4.4],[.95,4.75],[1.13,5.3],[1.12,5.9],[.98,6.4],[.8,6.78],[.62,7.05],[.34,7.22],[0,7.26]],28,3,()=>[1,1,1],(c,f,h)=>c*(oe(.94,.5,We(3,4.4,f))+oe(.1,.68,We(3,4.4,f))*Math.pow(n(h),.7))*(1+.05*Math.sin(f*5+h*2)));i.deleteAttribute("color");const l=new e.Mesh(i,me({},{uAbsorb:{value:new e.Vector3(ae.value.x,ae.value.y*1.2*ze,ae.value.z*1.6*ze)}}));l.name="dipper-honey",U.add(l)}await s.yield();{const t=xe([[0,-3],[1.85,-3],[2.28,-2.88],[2.43,-2.55],[2.46,-1.5],[2.46,1],[2.38,1.6],[2.02,2.14],[1.74,2.36],[1.7,2.52],[1.83,2.58],[1.83,2.68],[1.7,2.73],[1.7,2.81],[1.83,2.86],[1.83,2.96],[1.72,3.03],[1.56,3.04],[1.5,2.9]],56,3,()=>[1,1,1]);t.deleteAttribute("color");const o=new e.ShaderMaterial({transparent:!0,depthWrite:!1,fog:!0,side:e.DoubleSide,vertexShader:Nt,fragmentShader:Ot,uniforms:{...e.UniformsUtils.clone(e.UniformsLib.fog),uLightDir:ne.uLightDir,uLightCol:ne.uLightCol,uAmbient:ne.uAmbient,uBand:{value:new e.Vector2(-2.3,1.1)}}}),n=new e.Mesh(t,o);n.name="jar-glass",n.renderOrder=2,U.add(n)}await s.yield();{const t=[[0,-2.2],[.34,-2.15],[.42,-1.9],[.3,-1.6],[.28,1],[.3,4.2],[.36,4.35]],o=r.int(4,6),n=4.4,i=6.75;for(let a=0;a<=44;a++){const u=a/44,v=oe(n,i,u),S=Math.pow(Math.max(0,1-Math.pow((u-.48)/.52,2)),.55),A=Math.pow(.5+.5*Math.cos(u*o*G),2.2);t.push([Math.max(.3,1.04*S*(1-.34*A)),v])}t.push([.2,6.82],[0,6.84]);const l=t.map(a=>new e.Vector2(a[0],a[1])),c=Z(T,N,.42),f=W(T,.62),h=se(28,l.length-1,(a,u,v)=>{const S=l[a];v.p[0]=Math.cos(u)*S.x,v.p[1]=S.y,v.p[2]=Math.sin(u)*S.x;const A=S.y>n?te(1-(S.x-.55)/.45,0,1):0;v.c=Z(c,f,A*.8)},[],!0),w=De(M,{vertexColors:!0,roughness:.6},`
      void detail(inout vec3 c, vec3 p, vec3 n){
        float g=fbm3(vec3(p.x*4.,p.y*0.5,p.z*4.)); float rings=0.5+0.5*sin(g*20.+p.x*8.+p.z*3.);
        c*=0.7+0.45*g+0.14*rings;
      }
      float detailRough(float r, vec3 p){ return r; }`,"wood"),g=new e.Mesh(h,w);g.name="dipper",U.add(g)}await s.yield();const rt=t=>[Q-ve.x*t,K-ve.z*t],j=ge.y+4.9,re=13.4,J=(t,o)=>{const n=rt(t);return new e.Vector3(n[0],o,n[1])},$=[J(re,1.9),J(re+.05,j*.38),J(re-.15,j*.72),J(re-1.5,j-1.5),J(re-4.2,j+.55),J(7,j+.95),J(4.2,j+.3),J(2.9,j-1),J(3.1,j-1.9)],ye=new e.CatmullRomCurve3($,!1,"centripetal"),st=t=>oe(.56,.26,Math.pow(t,.8)),Le=.6;{const t=W(Z(P,y,.5),.6),o=W(N,.66),n=xe([[0,0],[2.95,0],[3.1,.1],[3.1,.32],[2.95,.44],[2.5,.4],[2.15,.43],[2.1,.7],[2,.8],[1.55,.77],[1.3,.82],[1.25,1.1],[1.15,1.2],[.9,1.3],[.72,1.55],[.86,1.8],[.9,1.95],[.72,2.15],[.58,2.3]],48,3,(a,u)=>a>2.9&&u<.37?t:a>1.9&&u>.5&&u<.78?o:W(z,.8+.2*te(u,0,1))),i=rt(re);Ae(n,ce(i[0],0,i[1])),await s.yield();const l=a=>.85*Math.exp(-Math.pow((a-Le)/.013,2))-.16*Math.exp(-Math.pow((Math.abs(a-Le)-.03)/.008,2)),c=mt($,180,14,a=>st(a)*(1+l(a)+.22*Math.exp(-Math.pow((a-.07)/.03,2))+.5*Math.exp(-Math.pow((a-1)/.02,2))),a=>a>.975?t:a>.105&&a<.15?o:Math.abs(a-.1)<.005||Math.abs(a-.155)<.005?t:W(z,.92));await s.yield();const f=new e.SphereGeometry(.44,12,8);f.deleteAttribute("uv");const h=$[$.length-1];Ae(f,ce(h.x,h.y-.15,h.z));{const a=f.attributes.position.count,u=new Float32Array(a*3);for(let v=0;v<a;v++)u.set(t,v*3);f.setAttribute("color",new e.BufferAttribute(u,3))}const w=De(M,{vertexColors:!0,roughness:.3,metalness:.05},`
      void detail(inout vec3 c, vec3 p, vec3 n){
        c*=0.86+0.26*fbm3(p*0.7);
        c=mix(c, c*0.45, smoothstep(0.84,0.9,vn3(p*13.))*0.7);        // enamel flecks
      }
      float detailRough(float r, vec3 p){ return r+0.25*smoothstep(0.84,0.9,vn3(p*13.)); }`,"enamel"),g=new e.Mesh(be([n,c,f]),w);g.name="stand",m.add(g)}await s.yield();{const t=ie("#c9953a"),o=W(t,.7),n=[],i=U.matrix,l=i.clone().invert(),c=(R,I)=>{R.deleteAttribute("uv");const X=R.attributes.position.count,q=new Float32Array(X*3);for(let H=0;H<X;H++)q.set(I,H*3);return R.setAttribute("color",new e.BufferAttribute(q,3)),R},f=(R,I,X,q=t)=>c(Ae(new e.TorusGeometry(R,I,8,48),ce(0,X,0,Math.PI/2).premultiply(i)),q);n.push(f(2.6,.15,-.9),f(1.86,.12,2.3),f(2.05,.13,-3.08),f(2.6,.07,-.55,o),f(2.6,.07,-1.25,o));const h=(R,I,X,q=!0,H=t)=>{const Me=mt(R,X,8,()=>I,()=>H);return q&&Me.applyMatrix4(i),Me},w=4,g=r.range(0,G);for(let R=0;R<w;R++){const I=g+R/w*G+Math.PI/4,X=Math.cos(I),q=Math.sin(I),H=(Me,Vt)=>new e.Vector3(X*Me,Vt,q*Me);n.push(h([H(.2,-3.12),H(2,-3.12),H(2.5,-2.8),H(2.6,-1.5),H(2.6,.9),H(2.5,1.6),H(2.12,2.12),H(1.86,2.34)],.09,28))}await s.yield();let a=.8,u=1e9;const v=new e.Vector3(0,-.9,0).applyMatrix4(i),S=new e.Vector3;for(let R=60;R<=96;R++){ye.getPointAt(R/100,S);const I=Math.hypot(S.x-v.x,S.z-v.z);I<u&&(u=I,a=R/100)}const A=ye.getPointAt(a),C=A.clone().add(new e.Vector3(0,-.62,0)).applyMatrix4(l),D=new e.Vector3(1,0,0),E=D.clone().multiplyScalar(2.6).setY(-.9),O=D.clone().multiplyScalar(-2.6).setY(-.9),ee=we.clone().negate(),zt=E.clone().lerp(C,.55).addScaledVector(D,.9).addScaledVector(ee,-.2),Pt=O.clone().lerp(C,.55).addScaledVector(D,-.9).addScaledVector(ee,-.2);n.push(h([E,zt,C,Pt,O],.11,40));const Ft=ye.getTangentAt(a),qe=new e.TorusGeometry(.62,.11,8,24);qe.applyQuaternion(new e.Quaternion().setFromUnitVectors(new e.Vector3(0,0,1),Ft)),qe.translate(A.x,A.y,A.z),n.push(c(qe,t)),await s.yield();const Re=new e.Vector3(0,2.3,0).addScaledVector(new e.Vector3(ee.x,0,ee.z).normalize(),1.86).applyMatrix4(i),Te=$[$.length-1].clone().setY($[$.length-1].y-.5),pt=Re.clone().lerp(Te,.5).addScaledVector(ve,.35);n.push(h([Te,pt,Re],.06,12,!1,o));const Ct=new e.QuadraticBezierCurve3(Te,pt,Re),ft=Math.max(4,Math.round(Te.distanceTo(Re)/.42));for(let R=1;R<ft;R++){const I=Ct.getPoint(R/ft);n.push(c(Ae(new e.SphereGeometry(.15,6,4),ce(I.x,I.y,I.z)),t))}await s.yield();for(const R of[.07,.3,.5,Le-.045,Le+.045]){const I=ye.getPointAt(R),X=ye.getTangentAt(R),q=new e.TorusGeometry(st(R)*(R<.1?1.22:1)+.07,.11,8,20);q.applyQuaternion(new e.Quaternion().setFromUnitVectors(new e.Vector3(0,0,1),X)),q.translate(I.x,I.y,I.z),n.push(c(q,t))}const ht=new e.Mesh(be(n),M({vertexColors:!0,roughness:.3,metalness:.55}));ht.name="brass",m.add(ht)}await s.yield();const Be=fe.clone().lerp(Ve,.55),he=Be.y+1.2,He=12,it=-.75*Math.PI+pe,ct=.75*Math.PI+pe,lt=[];for(let t=0;t<=12;t++){const o=oe(it,ct,t/12);lt.push(new e.Vector3(Q+Math.sin(o)*He,he+.8*Math.sin(t/12*Math.PI),K+Math.cos(o)*He))}const Ue=(t,o,n)=>new e.Vector3(Q+Math.sin(t+pe)*o,n,K+Math.cos(t+pe)*o),St={lookAt:Be,ropeTop:fe.clone(),ropeBase:Ve.clone(),jar:ge.clone(),orbit:{center:new e.Vector3(Q,he,K),radius:He,y:he,from:it,to:ct},flyThrough:lt,viewpoints:{backlit:Ue(Math.PI*.5,12,he),front:Ue(0,14,he+1),entry:Ue(-.6*Math.PI,30,he-2)},steamAcross:{from:new e.Vector3(Q-9,Be.y+1,K+2.2),to:new e.Vector3(Q+9,Be.y+3,K+1.2)},keepOut:[{center:new e.Vector3(0,Y*.5,0),radius:5.6},{center:ge.clone(),radius:4.2},{center:J(re,j*.5),radius:j*.5+1}]},ut=j+1.6;return{object:m,radius:13,height:ut,center:new e.Vector3(Q,ut*.42,K-1.5),anchors:St,setProgress(t){ne.uProgress.value=te(t,0,1)},uniforms:ne,update(t,o,n){ne.uTime.value=o},dispose(){},ground:!0,groundY:0}}export{It as buildHero};
