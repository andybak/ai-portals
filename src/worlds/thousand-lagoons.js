import*as F from"three";import{clamp as Gt,lerp as st,smoothstep as te,makePath as f0,makeRng as ke}from"../kit/core.js";import{makeSky as h0,makeCloudField as m0,makeLightRig as p0}from"../kit/sky.js";import*as d0 from"../kit/fx.js";import{buildHero as x0,GLSL_BOWL as g0,GLSL_SQUALL as y0,SQUALL as Oe}from"../parts/thousand-lagoons.js";const lt=F.Vector3,tt=Math.PI*2,ae=630,ce=-345,Xe=-270,Pe=47,Ye=46,w0={afternoon:{sky:{preset:"day",zenith:"#4a8bdc",horizon:"#d3e0ee",horizonPow:9,scatter:.14,scatterColor:"#fff1e0",sunSize:1.3,sunIntensity:10,clouds:{coverage:.16,softness:.3,lit:"#ffffff"},clouds2:!1},fog:"#cfdbe9",dens:34e-5,clouds:30,cloudSize:[60,140],exposure:1.2,bloom:.22,sat:1.1,contrast:1.28,portal:"#c9fff1",veil:"#eef1f4"},noon:{sky:{preset:"day",zenith:"#4486dc",horizon:"#d2e1f0",horizonPow:9,scatter:.05,sunSize:1.2,sunIntensity:12,clouds:{coverage:.14,softness:.3},clouds2:!1},fog:"#d3e1ef",dens:34e-5,clouds:24,cloudSize:[60,140],exposure:1.1,bloom:.26,sat:1.12,contrast:1.22,portal:"#d6fff4",veil:"#f0f3f5"},squall:{sky:{preset:"day",zenith:"#4484d6",horizon:"#c0cfe1",horizonPow:7,scatter:.12,scatterColor:"#fff1e0",sunSize:1.3,sunIntensity:10,clouds:{coverage:.24,softness:.3,lit:"#ffffff",shade:"#7486a6",wind:[-.004,.014]},clouds2:!1},fog:"#b9c8dc",dens:4e-4,clouds:22,cloudSize:[70,170],exposure:1.2,bloom:.22,sat:1.1,contrast:1.28,portal:"#d9fff0",veil:"#e6eaf0"},moon:{sky:{preset:"night",zenith:"#050a1c",horizon:"#1c2a47",stars:.8,milkyWay:.5},fog:"#141f38",dens:45e-5,clouds:8,cloudSize:[130,280],exposure:1.05,bloom:.55,sat:1,contrast:1.05,portal:"#bfe8ff",veil:"#2c3a56"}},ue=`
uniform vec3 uSun,uSunCol,uFill;
vec3 tlLit(vec3 alb, vec3 n, float sh){
  float ndl=max(dot(n,uSun),0.);
  return alb*(uFill*(0.62+0.3*n.y)+uSunCol*(1.-exp(-ndl*3.))*sh+uSunCol*0.2*max(-n.y,0.));
}`,Kt=`
float h21(vec2 p){ vec3 p3=fract(vec3(p.xyx)*.1031); p3+=dot(p3,p3.yzx+33.33); return fract((p3.x+p3.y)*p3.z); }
float vn(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h21(i),h21(i+vec2(1.,0.)),f.x), mix(h21(i+vec2(0.,1.)),h21(i+vec2(1.,1.)),f.x), f.y); }`,z0=`
#include <fog_pars_fragment>
float tlFog(){
  #ifdef FOG_EXP2
    return 1.-exp(-fogDensity*fogDensity*vFogDepth*vFogDepth);
  #else
    return 0.;
  #endif
}`;function St(t,e,f,i={}){return new F.ShaderMaterial({uniforms:{...F.UniformsUtils.clone(F.UniformsLib.fog),...t},vertexShader:e,fragmentShader:f,fog:!0,...i})}function Zt(t,e,f){const i=new F.InstancedBufferGeometry;i.index=t.index;for(const u in t.attributes)i.setAttribute(u,t.attributes[u]);for(const u in e)i.setAttribute(u,new F.InstancedBufferAttribute(e[u][0],e[u][1]));return i.instanceCount=f,i}function kt(t,e,f,i=0){const u=new F.Mesh(t,e);return u.name=f,u.frustumCulled=!1,u.renderOrder=i,u}const ge=()=>{const t=new F.BufferGeometry;return t.setAttribute("position",new F.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),t.setIndex([0,1,2,0,2,3]),t},b0=(t,e)=>{if(e>=t[0][0])return t[0][1];for(let f=1;f<t.length;f++)if(e>=t[f][0]){const i=(t[f-1][0]-e)/(t[f-1][0]-t[f][0]);return t[f-1][1]+(t[f][1]-t[f-1][1])*(i*i*(3-2*i))}return t[t.length-1][1]};async function M0(t,e,f){const i=e.heightAt,u=e.anchors.waterLevel,_=e.anchors,d=_.crests,y=d[2].position.z,h=d[0].position.z,k=d[1].position.z,v=Gt((Math.abs(f)-8)/5,0,1),M=Math.PI/180,w=-14,c=35+2*v,o=3,l=[];for(let b=-.92;b<=-.02;b+=.01){const W=_.crestLine(2,b);l.push([W.x,W.z])}const p=(b,W,R)=>{const D=[Xe],pt=[ae];let at=Xe,zt=ae,Ft=w*M;const qt=(ft,J)=>{let it=Math.hypot(ft-at,J-zt);for(;it>=.5;){const N=.5/it;at+=(ft-at)*N,zt+=(J-zt)*N,D.push(at),pt.push(zt),it-=.5}},ne=ft=>{for(let J=0;J<ft-1e-6;J+=.5){const it=Math.min(.5,ft-J);at+=Math.sin(Ft)*it,zt-=Math.cos(Ft)*it,D.push(at),pt.push(zt)}},ye=(ft,J)=>{const it=ft*M-Ft,N=Math.max(1,Math.ceil(Math.abs(it)*J/.5)),At=it/N,Qt=Math.abs(it)*J/N;for(let oe=0;oe<N;oe++)Ft+=At*.5,at+=Math.sin(Ft)*Qt,zt-=Math.cos(Ft)*Qt,Ft+=At*.5,D.push(at),pt.push(zt);Ft=ft*M};if(ne((zt-W)/Math.cos(Ft)),ye(c,55),R)return{x:at,z:zt};ne(119),ye(o,80),ne(Math.max(10,(zt-130)/Math.cos(Ft)));const pe=4.5,ve=8,Jt=l[ve],_t=l[ve+3],It=Math.hypot(_t[0]-Jt[0],_t[1]-Jt[1])||1,we=(_t[0]-Jt[0])/It,fe=(_t[1]-Jt[1])/It,ze=ft=>{const J=l[Math.max(0,ft-2)],it=l[Math.min(l.length-1,ft+2)],N=Math.hypot(it[0]-J[0],it[1]-J[1])||1;return[l[ft][0]+(it[1]-J[1])/N*pe,l[ft][1]-(it[0]-J[0])/N*pe]},se=ze(ve),de=.4*Math.hypot(se[0]-at,se[1]-zt),ie=[at,zt],xe=[at+Math.sin(Ft)*de,zt-Math.cos(Ft)*de],re=[se[0]-we*de,se[1]-fe*de];for(let ft=1;ft<=60;ft++){const J=ft/60,it=1-J;qt(it*it*it*ie[0]+3*it*it*J*xe[0]+3*it*J*J*re[0]+J*J*J*se[0],it*it*it*ie[1]+3*it*it*J*xe[1]+3*it*J*J*re[1]+J*J*J*se[1])}for(let ft=ve+1;ft<=b;ft++){const J=ze(ft);qt(J[0],J[1])}const he=D.length;Ft=Math.atan2(D[he-1]-D[he-9],-(pt[he-1]-pt[he-9])),ye(0,55);const be=at;return ne(Math.max(0,zt-ce)),{X:D,Z:pt,xe:be}},a=_.crestLine(1,-.76),r=b=>(a.x-b.x)*Math.cos(c*M)+(a.z-b.z)*Math.sin(c*M),B=r(p(0,442,!0)),A=r(p(0,452,!0)),n=Gt(442-B*10/(A-B||.001),424,486);let s=30,S=p(s,n);for(let b=l.length-1;b>30;b-=1){const W=p(b,n);if(W.xe<=0){s=b,S=W;break}(b&7)===0&&await t.yield()}{const b=-S.xe,W=S.X.length;let R=0;for(let D=0;D<W;D++)S.Z[D]>40&&(R=D);for(let D=R;D<W;D++)S.X[D]+=b*Math.min(1,(D-R)/160)}await t.yield();const x=S.X,m=S.Z,T=x.length,g=b=>{if(b>=m[0])return x[0]+(b-m[0])*Math.tan(w*M)*-1;if(b<=m[T-1])return x[T-1];let W=0,R=T-1;for(;R-W>1;){const D=W+R>>1;m[D]>b?W=D:R=D}return st(x[W],x[R],(m[W]-b)/Math.max(1e-6,m[W]-m[R]))};await t.yield();const I=(b,W)=>{let R=b,D=-1;for(let pt=b;pt<=W;pt+=1){const at=i(g(pt),pt);at>D&&(D=at,R=pt)}return[R,D]},[H,X]=I(h-15,h+90),[Q,dt]=I(k-15,k+80),[ct,et]=I(y-20,y+40);await t.yield();let Y=H,ht=Q;{let b=0,W=0,R=0;for(let D=H-20;D>Q;D-=1)u-i(g(D),D)>.3?(b||(R=D),b++,b>W&&(W=b,Y=R,ht=D)):b=0}const Z=Y-ht>40,E=Math.min(Y-5,401),K=Math.max(ht+12,E-36),C=et+10.5-u,V=-205,gt=-280,L=X-u,bt=b=>Math.max(i(g(b),b),u)-u,ee=b=>{let W=0;const R=g(b);for(let D=-9;D<=9;D+=1.5)W=Math.max(W,i(R-.4*D,b-.9*D));return W-u},xt=[[ae,.55],[ae-37,.55],[H+24,L+6],[H+2,L+10.5],[H-16,L+14],[470,25]];Z?xt.push([E,.55],[K,.55],[Q+14,dt+4.5-u]):xt.push([(Y+ht)/2,10]),xt.push([Q-3,dt+(Z?7.5:10.5)-u],[Q-30,bt(Q-30)+8],[Q-60,bt(Q-60)+8],[Q-90,bt(Q-90)+8.5],[197,7],[169,13.6],[140,14.5],[100,20],[72,ee(72)+8.5],[63,ee(63)+9],[0,C+Ye],[-10,C+Ye-1],[ct-4,C+15],[ct-30,C+3],[V,.55],[gt,.55],[-303,3.5]);const ut=Math.floor((T-1)/6)+1,mt=new Float32Array(ut),Tt=new Float32Array(ut),Ut=new Float32Array(ut),Et=new Float32Array(ut),Lt=new Float32Array(ut);for(let b=0;b<ut;b++)mt[b]=x[b*6],Tt[b]=m[b*6];mt[ut-1]=0,Tt[ut-1]=ce;for(let b=0;b<6;b++)for(const W of[mt,Tt]){for(let R=0;R<ut;R++)Lt[R]=R<6||R>ut-22?W[R]:.25*W[R-1]+.5*W[R]+.25*W[R+1];W.set(Lt)}const Vt=(b,W)=>{const R=i(b,W);return R>u?R+2.7:u+.55};await t.yield();for(let b=0;b<ut;b++)Lt[b]=Vt(mt[b],Tt[b]);await t.yield();const Ht=new Uint8Array(ut);for(let b=0;b<ut;b++){const W=Tt[b];let R=Lt[b];for(let D=Math.max(0,b-2);D<=Math.min(ut-1,b+2);D++)R=Math.max(R,Lt[D]);Et[b]=R,Ut[b]=Math.max(R,u+b0(xt,W)),(W<=ae-18&&W>=ae-34||Z&&W<=E-3&&W>=K+3||W<=V-4&&W>=gt+4)&&(Ht[b]=1),W<gt&&(Et[b]=Math.min(Et[b],Ut[b]))}await t.yield();for(let b=0;b<10;b++){for(let W=0;W<ut;W++)Lt[W]=.25*Ut[Math.max(0,W-1)]+.5*Ut[W]+.25*Ut[Math.min(ut-1,W+1)];for(let W=0;W<ut;W++)Ut[W]=Ht[W]?Math.max(Et[W],u+.55):Math.max(Lt[W],Et[W])}const ot=[],Ct=3;for(let b=0;b<ut;b+=Ct)ot.push(new lt(mt[b],Ut[b],Tt[b]));const Ot=ot[ot.length-1];Ot.z>ce+.5?ot.push(new lt(0,u+3.5,ce)):Ot.set(0,u+3.5,ce),ot[0].y=u+3.6,ot[1].y=Math.max(ot[1].y,u+2.3),ot[2].y=Math.max(ot[2].y,u+.64),ot.splice(1,0,new lt(st(ot[0].x,ot[1].x,.5),u+3.21,st(ot[0].z,ot[1].z,.5)));let Yt=null;const Wt=new lt,Nt=new Float32Array(ot.length);for(let b=0;b<7;b++){Yt=f0(ot,{samples:620}),Nt.fill(0);let W=0,R=0;await t.yield();for(let D=0;D<=Yt.length;D+=1.25){Yt.posAtDist(D,Wt);const pt=i(Wt.x,Wt.z),at=(pt>u?pt+2.5:u+.5)-Wt.y;for(;R<ot.length-2&&Math.hypot(ot[R+1].x-Wt.x,ot[R+1].z-Wt.z)<Math.hypot(ot[R].x-Wt.x,ot[R].z-Wt.z);)R++;at>0&&(W++,Nt[R]=Math.max(Nt[R],at+.12),R+1<ot.length&&(Nt[R+1]=Math.max(Nt[R+1],at+.12)))}if(await t.yield(),!W)break;for(let D=0;D<ot.length-6;D++)ot[D].y+=Nt[D]}return await t.yield(),{path:Yt,xAt:g,uAtZ:b=>{let W=0,R=1;for(let D=0;D<22;D++){const pt=(W+R)/2;Yt.pointAt(pt,Wt).z>b?W=pt:R=pt}return(W+R)/2},zCross:ct,zB:[H,Q,ct],skims:[[ae-14,ae-37],Z?[E,K]:null,[V,gt]]}}const A0=66,S0=20;function k0(t,e,f){const i=new lt,u=new lt,_=new lt,d=e[2],y=Math.PI/180,h=(l,p)=>{t.pointAt(p,i),t.pointAt(Math.min(1,p+.035),u);let a=u.x-i.x,r=u.z-i.z;const B=Math.hypot(a,r)||1;a/=B,r/=B;const A=te(d-.155,d-.105,p)*(1-te(d-.05,d-.004,p));let n=.23*te(d-.25,d-.2,p)*(1-te(d-.17,d-.1,p))+.2*te(d-.205,d-.175,p)*(1-te(d-.14,d-.09,p));n=st(n,Math.atan2(a,-r)-A0*y,A);const s=Math.cos(n),S=Math.sin(n),x=a*s+r*S;r=-a*S+r*s,a=x;const m=st(st(Gt(7+.2*(i.y-f),7,16),5,te(d-.04,d+.01,p)),S0,A)*y;return _.set(i.x+a*100,i.y-Math.tan(m)*100,i.z+r*100)},k=new lt,v=new lt,M=new lt,w=1.6,c=24;return[{at:(l,p)=>{t.pointAt(p,k),t.posAtDist(Math.min(t.length,p*t.length+c),v),v.sub(k);const a=v.length()||1;v.multiplyScalar(1/a),t.pointAt(Math.min(1,p+.035),M);let r=M.x-k.x,B=M.z-k.z;const A=Math.hypot(r,B)||1;r/=A,B/=A;const n=te(.03,.07,p),s=st(2.5,Gt(7+.2*(k.y-f),7,16),n)*y,S=Math.cos(s),x=Math.sin(s),m=Math.max(.2,w*te(0,.04,p)*(1-n));return M.set(k.x+(r*S-(1-m)*v.x)/m*100,k.y+(-x-(1-m)*v.y)/m*100,k.z+(B*S-(1-m)*v.z)/m*100)},from:-1,to:.07,weight:w,fade:.0373832},{at:h,from:.02,to:d+.05,weight:.85,fade:.085},{at:new lt(0,f+3,ce),from:d-.04,to:.97,weight:.6,fade:.1},{at:new lt(0,f+4,-430),from:d+.004,to:.86,weight:.7,fade:.16}]}async function P0(t,e,f,i,u){const _=[],d=[],y=[],h=i.anchors.bounds,k=i.anchors.waterLevel,v=6,M=6,w=Math.tan(32*Math.PI/180),c=Math.round(24*(.6+.4*u));for(let a=0;a<c;a++){const r=1e3-a*(3900/c);for(let B=-2750+a%2*120;B<2750;B+=232){const A=B+e.range(-46,46),n=r+e.range(-52,52);if(A>h.x0+60&&A<h.x1-60&&n>h.z0+70&&n<h.z1+60||Math.hypot(A,n+200)>2700)continue;const S=n<-430||Math.hypot(A,n)>1500||A>560&&n<260,x=e.chance(.15),m=e.range(100,150),T=S?x?e.range(12,16):e.range(6,10.5):x?e.range(27,36):e.range(15,25),g=m*e.range(.5,.68),I=_.length/3,H=T/w;for(let E=0;E<=v;E++){const K=E/v*2-1,C=Math.abs(K),V=T*Math.pow(1-Math.pow(C,2.4),.9),gt=n+g*C*C,L=[[gt+V/w,0],[gt+.4,V*.985],[gt,V],[gt-V*.9,V*.72],[gt-V*2.2,V*.36],[gt-V*4.2-5,0]];for(let bt=0;bt<M;bt++)_.push(A+K*m,k-.3+L[bt][1],L[bt][0]),d.push(0,bt<2?0:.5,0)}for(let E=0;E<v;E++)for(let K=0;K<M-1;K++){const C=I+E*M+K,V=C+M;y.push(C,V,C+1,C+1,V,V+1)}const X=_.length/3,Q=m*(S?e.range(.82,1.15):e.range(.6,.85)),dt=S?e.range(62,96):e.range(34,56),ct=n+H+dt*.72,et=e.range(.5,1),Y=14,ht=e.range(0,tt),Z=.2*Math.max(0,Math.sin(ht*5.3));_.push(A,k-.2,ct),d.push(Z,0,1+et);for(let E=0;E<Y;E++){const K=E/Y*tt,C=.62*(1+.1*Math.sin(K*3+ht));_.push(A+Math.cos(K)*Q*C,k-.2,ct+Math.sin(K)*dt*C),d.push(Z,0,1+et*.55)}for(let E=0;E<Y;E++){const K=E/Y*tt,C=1+.13*Math.sin(K*3+ht)+.07*Math.sin(K*5-ht);_.push(A+Math.cos(K)*Q*C,k-.2,ct+Math.sin(K)*dt*C),d.push(Z,0,1)}for(let E=0;E<Y;E++){const K=(E+1)%Y;y.push(X,X+1+K,X+1+E,X+1+E,X+1+K,X+1+Y+E,X+1+K,X+1+Y+K,X+1+Y+E)}}await t.yield()}for(let a=0;a<46;a++){const r=a%2,B=-2.15+4.3*((a>>1)+.5*r+e.range(-.3,.3))/23,A=(r?2080:1640)+e.range(-110,110),n=Math.sin(B)*A,s=-200-Math.cos(B)*A;if(s>700)continue;const S=e.range(300,520),x=e.range(34,58)*(r?1.25:1),m=S*e.range(.25,.5),T=_.length/3;for(let g=0;g<=v;g++){const I=g/v*2-1,H=Math.abs(I),X=x*Math.pow(1-Math.pow(H,2.2),.9)*(1+.1*Math.sin(I*4+a)),Q=s+m*H*H,dt=[[Q+X/w,0],[Q+.4,X*.985],[Q,X],[Q-X*.9,X*.72],[Q-X*2.2,X*.36],[Q-X*4.2-5,0]];for(let ct=0;ct<M;ct++)_.push(n+I*S,k-.3+dt[ct][1],dt[ct][0]),d.push(0,ct<2?0:.5,0)}for(let g=0;g<v;g++)for(let I=0;I<M-1;I++){const H=T+g*M+I,X=H+M;y.push(H,X,H+1,H+1,X,X+1)}}await t.yield();{const a=_.length/3,r=56,B=k-.36;for(let A=0;A<=r;A++)for(let n=0;n<=r;n++)_.push(-3400+6800*n/r,B,1500-5100*A/r),d.push(.5,.5,0);for(let A=0;A<r;A++)for(let n=0;n<r;n++){const s=a+A*(r+1)+n,S=s+1,x=s+r+1,m=x+1;y.push(s,x,S,S,x,m)}}await t.yield();const o=new F.BufferGeometry;o.setAttribute("position",new F.Float32BufferAttribute(_,3)),await t.yield(),o.setAttribute("aK",new F.Float32BufferAttribute(d,3)),await t.yield(),o.setIndex(y),await t.yield(),o.computeVertexNormals(),await t.yield();{const a=o.attributes.normal.array;for(let r=0;r<a.length;r+=3)a[r+1]<0&&(a[r]=-a[r],a[r+1]=-a[r+1],a[r+2]=-a[r+2])}const l=i.sheetUniforms,p=St({...f,uBounds:i.uniforms.uBounds,uWater:i.uniforms.uWater,uBowl:i.uniforms.uBowl,uCloud:l.uCloud,uNight:l.uNight,uZen:l.uZen,uSq:l.uSq},`
    attribute vec3 aK; varying vec3 vK; varying vec3 vN; varying vec3 vW;
    ${g0}
    #include <fog_pars_vertex>
    void main(){ vK=aK; vN=normal; vec3 p=position; p.y+=bowlY(p.xz); vW=p; vec4 mvPosition=modelViewMatrix*vec4(p,1.); gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,`
    uniform vec3 uSand,uTurq,uTeal,uMint,uHor,uZen; uniform vec4 uBounds,uNight; uniform float uTime,uCloud;
    varying vec3 vK; varying vec3 vN; varying vec3 vW;
    ${ue}
    ${Kt}
    ${z0}
    ${y0}
    float fbm3(vec2 p){ return vn(p)*.5+vn(p*2.03+17.)*.3+vn(p*4.1+41.)*.2; }
    void main(){
      vec3 n=normalize(vN+vec3(0.,1e-4,0.)); vec2 xz=vW.xz;
      // under the hero sheet the floor and pools are never wanted (a portal camera's near plane can cut the sheet open above them)
      if((vK.x>0.25||vK.z>0.5)&&xz.x>uBounds.x+25.&&xz.x<uBounds.y-25.&&xz.y>uBounds.z+25.&&xz.y<uBounds.w-25.) discard;
      float slip=(1.-smoothstep(0.05,0.3,vK.y))*step(vK.z,0.5);
      float cs=1.-uCloud*smoothstep(.60,.72,fbm3(vec2(xz.x*0.0052+xz.y*0.0016,xz.y*0.0058-uTime*0.052)));
      // under the squall the rain takes most of the sun and the sand is wet: a shade darker and bluer
      float sq=sqK(xz); vec3 wetSq=mix(vec3(1.),vec3(0.80,0.845,0.91),sq);
      cs*=1.-0.62*sq;
      float ndl=max(dot(n,uSun),0.);
      float sh=cs*(1.-slip*(1.-smoothstep(0.16,0.42,ndl))*(1.-step(0.2,uNight.x)));          // slip faces turned from the sun stand in their own blue shadow (the moon silvers them)
      float sunT=(1.-exp(-ndl*5.4))*sh, shade=1.-sunT;
      vec3 col=uSand*(0.95+0.05*vn(xz*0.03))*(uFill*mix(0.26,0.96,shade)*(0.7+0.3*n.y)*mix(vec3(1.),vec3(0.97,1.06,1.24),shade)+uSunCol*sunT*0.84);
      float fk=1.;
      if(vK.z>0.5){
        float d=vK.z-1.;
        vec3 wc=mix(uMint,uTurq,smoothstep(0.05,0.26,d)); wc=mix(wc,uTeal,smoothstep(0.36,0.9,d));
        wc=mix(wc,wc*vec3(0.70,1.10,0.76)+vec3(0.,0.015,0.),smoothstep(0.05,0.15,vK.x)*0.85*(1.-uNight.x*3.));
        col=wc*mix(vec3(0.44,0.57,0.76),vec3(1.04),cs);
        col=mix(col,uSand*vec3(0.50,0.64,0.86)*(uFill*0.5+uSunCol*0.5*cs),(1.-smoothstep(0.025,0.075,d))*0.85*(1.-uNight.x*3.));      // the shoreline: a dark wet rim round every pool
        col=mix(col,mix(uHor,uZen,0.4),uNight.x*uNight.z+0.05);
        col+=uSunCol*step(0.93,vn(xz*0.35+uTime*vec2(.9,1.7)))*0.3*cs*smoothstep(0.1,0.3,d);
        fk=0.42;
      }
      #ifdef USE_FOG
        // where the rings meet the hero sheet both dissolve into plain lit sand, so no seam shows
        vec2 o=max(max(uBounds.x-xz.x,xz.x-uBounds.y),0.)*vec2(1.,0.)+vec2(0.,max(max(uBounds.z-xz.y,xz.y-uBounds.w),0.));
        float sF=(1.-exp(-max(uSun.y,0.)*5.4))*cs;
        col=mix(col,uSand*0.95*(uFill*mix(0.26,0.96,1.-sF)*mix(vec3(1.),vec3(0.97,1.06,1.24),1.-sF)+uSunCol*sF*0.84),1.-smoothstep(0.,70.,length(o)))*wetSq;
        float ff=max(tlFog()*fk,smoothstep(2250.,2700.,length(xz+vec2(0.,200.))));
        col=mix(col,fogColor,ff);
      #endif
      gl_FragColor=vec4(col,1.);
    }`,{side:F.DoubleSide});return kt(o,p,"far-dune-rings")}const Mt=[.8,.8,.78],Be=[.03,.03,.035],F0=(t,e)=>{const f=Math.cos(.61),i=Math.sin(.61);return[t*f-e*i+.55,e*f+t*i+.05]},De={wader:t=>{const e=t?[.12,.115,.11]:Mt,f=t?[.22,.19,.14]:[.86,.6,.07],i=[.05,.05,.05];return{stands:!0,body:[[0,.29,.012,Mt,Mt],[0,.2,.06,Mt,Mt],[0,.03,.1,Mt,Mt],[0,-.12,.095,Mt,Mt],[.01,-.22,.06,Mt,Mt],...t?[[.03,-.34,.04,e,e,.8,-.14],[.045,-.47,.036,e,e,.92,-.1],[.055,-.58,.036,e,e,1.01,-.13],[.06,-.66,.046,e,e,1.06,-.18],[.05,-.73,.03,f,f,1.045,-.25],[0,-.95,.006,f,f,.95,-.43]]:[[.075,-.3,.036,e,e,.8,-.14],[.118,-.24,.034,e,e,.92,-.09],[.146,-.3,.032,e,e,1.02,-.13],[.152,-.39,.04,e,e,1.07,-.17],[.146,-.45,.02,f,f,1.06,-.23],[.135,-.6,.003,f,f,1.02,-.38]]],legs:[[-.04,.14,.014,i,i,.5,.13],[-.035,.45,.011,i,i,.26,.155],[-.03,.74,.012,i,i,0,.12],[-.03,.82,.004,i,i,0,.02]],wing:{root:.07,half:.74,y:.03,le:-.17,sweep:.18,chord:[.27,.31,.29,.23,.14,.03],col:(_,d)=>t&&(d>.6||_>.8)?Be:Mt},tail:[.05,.1,0,t?Be:Mt]}},tern:()=>{const t=[.5,.53,.58],e=[.9,.7,.08],f=Be;return{stands:!1,body:[[0,.2,.008,t,Mt],[0,.11,.04,t,Mt],[0,-.02,.058,t,Mt],[.003,-.13,.052,t,Mt],[.008,-.2,.042,f,Mt],[.01,-.245,.036,f,Mt],[.006,-.28,.02,e,e],[-.004,-.37,.004,e,e]],wing:{root:.04,half:.46,y:.02,le:-.1,sweep:.3,chord:[.115,.13,.115,.09,.055,.01],col:(i,u)=>i>.62?[.06,.06,.07]:u>.8?Mt:t},tail:[.07,.16,.45,Mt]}},ibis:()=>{const t=[.8,.055,.03],e=[.5,.045,.03];return{stands:!1,body:[[0,.24,.01,t,t],[0,.15,.05,t,t],[0,.02,.075,t,e],[0,-.1,.07,t,e],[.01,-.18,.045,t,t],[.03,-.32,.026,t,t],[.045,-.43,.024,t,t],[.05,-.5,.032,t,t],[.04,-.55,.014,e,e],[-.02,-.72,.003,e,e]],legs:[[-.03,.12,.01,e,e],[-.025,.36,.008,e,e],[-.02,.52,.004,e,e]],wing:{root:.055,half:.5,y:.025,le:-.13,sweep:.2,chord:[.2,.23,.21,.17,.1,.02],col:f=>f>.88?Be:t},tail:[.04,.08,0,t]}}};function _0(t){const e=[],f=[],i=[],u=[],_=[],d=[],y=(c,o,l,p,a=0,r=0,B=0,A=0)=>(e.push(c[0],c[1],c[2]),f.push(o[0],o[1],o[2]),i.push(l[0],l[1],l[2]),u.push(p[0],p[1],p[2]),_.push(a,r,B,A),e.length/3-1),h=(c,o)=>t.stands?F0(c,o):[c,o],k=(c,o,l)=>{const p=e.length/3,a=c.length,r=c.map(n=>[n[0],n[1]]),B=c.map(n=>n.length>5?[n[5],n[6]]:h(n[0],n[1])),A=(n,s)=>{const S=n[Math.max(0,s-1)],x=n[Math.min(a-1,s+1)],m=x[0]-S[0],T=x[1]-S[1],g=Math.hypot(m,T)||1;return[T/g,-m/g]};for(let n=0;n<a;n++){const s=A(r,n),S=A(B,n),x=c[n][2];for(let m=0;m<o;m++){const T=m/o*tt,g=Math.sin(T),I=Math.cos(T),H=l+g*x*.85;y([H,B[n][0]+S[0]*I*x,B[n][1]+S[1]*I*x],[H,r[n][0]+s[0]*I*x,r[n][1]+s[1]*I*x],[g,s[0]*I,s[1]*I],s[0]*I>.25?c[n][3]:c[n][4])}}for(let n=0;n<a-1;n++)for(let s=0;s<o;s++){const S=p+n*o+s,x=p+n*o+(s+1)%o,m=S+o,T=x+o;d.push(S,m,x,x,m,T)}};k(t.body,7,0),t.legs&&(k(t.legs,3,-.035),k(t.legs,3,.035));const v=t.wing,M=[0,.22,.45,.68,.86,1];for(const c of[-1,1]){const o=M.map((l,p)=>{const a=c*(v.root+l*v.half),r=v.le+v.sweep*Math.pow(Math.max(0,l-.4),1.6)-.05*Math.sin(Math.min(1,l/.4)*1.57),B=v.chord[p];return[0,.45,1].map(A=>{const n=h(v.y-.02-l*.07-A*.07*(1-l),v.le+.04+l*v.half*.62+A*.03);return y([c*(v.root*.9+.012-l*.03),n[0],n[1]],[a,v.y+(A===.45?.012*(1-l):0),r+B*A],[0,1,0],v.col(l,A),c,l,1,A)})});for(let l=0;l<o.length-1;l++)for(let p=0;p<2;p++){const a=o[l][p],r=o[l+1][p],B=o[l+1][p+1],A=o[l][p+1];d.push(a,r,B,a,B,A)}}{const[c,o,l,p]=t.tail,a=t.body[0][1]-.03,r=(m,T)=>{const g=h(.004,T);return y([m,g[0],g[1]],[m,.004,T],[0,1,0],p)},B=r(0,a),A=r(-c,a+o),n=r(0,a+o*(1-l)),s=r(c,a+o),S=r(-c*.35,a),x=r(c*.35,a);d.push(S,A,n,S,n,B,B,n,x,x,n,s)}const w=new F.BufferGeometry;return w.setAttribute("position",new F.Float32BufferAttribute(e,3)),w.setAttribute("aAlt",new F.Float32BufferAttribute(f,3)),w.setAttribute("normal",new F.Float32BufferAttribute(i,3)),w.setAttribute("aCol",new F.Float32BufferAttribute(u,3)),w.setAttribute("aAnim",new F.Float32BufferAttribute(_,4)),w.setIndex(d),w}const B0=`
attribute vec3 aAlt; attribute vec3 aCol; attribute vec4 aAnim; attribute vec4 iPos, iPose, iMisc;
uniform float uRoot,uHalf;
varying vec3 vCol; varying vec3 vN; varying vec3 vV; varying float vPart;
#include <fog_pars_vertex>
void main(){
  float fly=iPose.x; vec3 p=aAlt, n=normal;
  if(aAnim.z>0.5){
    float r=aAnim.y, sd=aAnim.x, d=abs(aAlt.x)-uRoot, fold=iMisc.z;
    float th=iMisc.w+iPose.z*sin(iPose.y-r*1.3);
    float th2=th+(iPose.z*0.6*sin(iPose.y-1.2)-0.15-0.5*fold)*smoothstep(0.35,1.,r);
    float di=min(d,uHalf*0.45), dq=max(d-uHalf*0.45,0.);
    p.x=sd*(uRoot+(di*cos(th)+dq*cos(th2))*(1.-0.45*fold));
    p.y=aAlt.y+di*sin(th)+dq*sin(th2);
    p.z=aAlt.z+dq*fold*1.1+di*fold*0.25;
    float an=mix(th,th2,step(0.45,r)); n=vec3(-sd*sin(an),cos(an),0.);
  }
  p=mix(position,p,fly);
  float cp=cos(iPose.w), sp=sin(iPose.w); p.yz=vec2(p.y*cp-p.z*sp,p.z*cp+p.y*sp); n.yz=vec2(n.y*cp-n.z*sp,n.z*cp+n.y*sp);
  float cr=cos(iMisc.y), sr=sin(iMisc.y); p.xy=vec2(p.x*cr-p.y*sr,p.x*sr+p.y*cr); n.xy=vec2(n.x*cr-n.y*sr,n.x*sr+n.y*cr);
  float cy=cos(iPos.w), sy=sin(iPos.w); p.xz=vec2(p.x*cy+p.z*sy,p.z*cy-p.x*sy); n.xz=vec2(n.x*cy+n.z*sy,n.z*cy-n.x*sy);
  vec3 w=iPos.xyz+p*iMisc.x;
  vCol=aCol; vN=n; vPart=aAnim.z; vV=cameraPosition-w;
  vec4 mvPosition=viewMatrix*vec4(w,1.); gl_Position=projectionMatrix*mvPosition;
  #include <fog_vertex>
}`,T0=`
varying vec3 vCol; varying vec3 vN; varying vec3 vV; varying float vPart;
${ue}
#include <fog_pars_fragment>
void main(){
  vec3 n=normalize(vN+vec3(0.,1e-4,0.)), V=normalize(vV+vec3(0.,1e-4,0.));
  if(vPart>0.5&&dot(n,V)<0.) n=-n;
  float nv=max(dot(n,V),0.);
  vec3 col=vCol*(uFill*1.2*(0.7+0.3*n.y)+uSunCol*(1.-exp(-max(dot(n,uSun)*0.75+0.25,0.)*3.))+uSunCol*0.2*max(-n.y,0.));
  col=col*(0.85+0.15*nv)+vCol*uSunCol*0.22*pow(1.-nv,3.);
  gl_FragColor=vec4(col,1.);
  #include <fog_fragment>
}`;function Le(t,e,f,i){const u=_0(t),_=new Float32Array(e*4),d=new Float32Array(e*4),y=new Float32Array(e*4),h=Zt(u,{iPos:[_,4],iPose:[d,4],iMisc:[y,4]},e),k=St({...f,uRoot:{value:t.wing.root},uHalf:{value:t.wing.half}},B0,T0,{side:F.DoubleSide});return{mesh:kt(h,k,i),base:u,count:e,triangles:u.index.count/3*e,set(M,w,c,o,l,p,a,r,B,A,n=0,s=0,S=.1){const x=M*4;_[x]=w,_[x+1]=c,_[x+2]=o,_[x+3]=l,d[x]=p,d[x+1]=a%tt,d[x+2]=r,d[x+3]=B,y[x]=A,y[x+1]=n,y[x+2]=s,y[x+3]=S},commit(){for(const M of["iPos","iPose","iMisc"])h.attributes[M].needsUpdate=!0}}}function C0(t,e){const f=new Float32Array(t*4).fill(-1),i=new Float32Array(t*4),u=Zt(ge(),{iS:[f,4],iT:[i,4]},t),_=St(e,`
    attribute vec4 iS, iT; varying vec2 vUv; varying vec4 vP;
    #include <fog_pars_vertex>
    void main(){
      float age=iS.w, k=iT.y, life=k>1.5?2.6:1.15, f=clamp(age/life,0.,1.);
      vec3 c=vec3(iS.x,iT.w,iS.z); vec4 mvPosition;
      if(k>0.5&&k<1.5){ float r=iT.x*(0.5+2.6*f); mvPosition=viewMatrix*vec4(c+vec3(position.x*r,0.04,position.y*r),1.); }
      else if(k<0.5){ float wd=iT.x*(0.4+0.9*f), ht=iT.x*(0.2+1.7*sin(3.1416*min(f*1.2,1.)));
        mvPosition=viewMatrix*vec4(c,1.); mvPosition.xy+=vec2(position.x*wd,(position.y+1.)*0.5*ht); }
      else { float s=iT.x*(0.7+1.3*f); mvPosition=viewMatrix*vec4(c+vec3(0.,iT.x*(0.25+0.5*f),f*iT.x*2.),1.); mvPosition.xy+=position.xy*s*vec2(1.9,0.72); }
      vUv=position.xy; vP=vec4(age<0.?-1.:f,k,iT.z+iS.y,k>1.5?smoothstep(4.,10.,-mvPosition.z):1.);
      gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,`
    varying vec2 vUv; varying vec4 vP;
    uniform vec3 uSunCol,uFill;
    ${Kt}
    #include <fog_pars_fragment>
    void main(){
      float f=vP.x, k=vP.y, a=0.; if(f<0.) discard;
      if(k>0.5&&k<1.5){ float r=length(vUv); a=smoothstep(.55,.8,r)*(1.-smoothstep(.86,1.,r))*(1.-f)*0.8; }
      else if(k<0.5){ float yy=vUv.y*.5+.5; float env=1.-smoothstep(.55,1.,abs(vUv.x)/(.3+.7*yy));
        float dr=smoothstep(.38,.62,vn(vUv*vec2(6.,9.)+vP.z*17.+vec2(0.,-f*5.)));
        a=env*(1.-yy*yy)*mix(1.,dr,smoothstep(.1,.6,yy))*(1.-f*f)*1.1; }
      else { float r2=dot(vUv,vUv), er=vn(vUv*vec2(2.6,3.4)+vP.z*9.)*0.6+vn(vUv*vec2(6.,8.)+vP.z*5.)*0.4;
        a=max(exp(-r2*3.2)-0.06,0.)*smoothstep(0.25,0.7,er+0.35*(1.-r2))*sin(3.1416*sqrt(clamp(f,0.,1.)))*0.6*vP.w; }
      vec3 col=vec3(0.95)*(uFill*0.6+uSunCol*(k>1.5?0.85:1.15));
      gl_FragColor=vec4(col,clamp(a,0.,1.));
      #include <fog_fragment>
    }`,{transparent:!0,depthWrite:!1,side:F.DoubleSide});return{mesh:kt(u,_,"splashes",4),count:t,set(y,h,k,v,M,w,c,o=0){const l=y*4;f[l]=h,f[l+1]=o,f[l+2]=v,f[l+3]=M,i[l]=w,i[l+1]=c,i[l+2]=o,i[l+3]=k},commit(){u.attributes.iS.needsUpdate=!0,u.attributes.iT.needsUpdate=!0}}}function W0(t,e){const f=new F.Group;f.name="mount";const i={...t,uSkim:{value:0},uP:{value:new F.Vector3(.936,1.664,.6)},uCamM:{value:new F.Matrix4},uBeat:{value:new lt(0,1,0)}};{const u=[],_=[],d=[],y=[],h=M=>{const w=u.length/3,c=9;for(let o=0;o<=c;o++){const l=o/c,p=[[0,1,0,1],[1,.35,.92,.38],[.8,-.5,.95,-.3],[0,-1,0,-1],[-.8,-.5,-.95,-.3],[-1,.35,-.92,.38]];for(const a of p)u.push(a[0],a[1],l),_.push(a[2],a[3],.05),d.push(l,M,a[1])}for(let o=0;o<c;o++)for(let l=0;l<6;l++){const p=w+o*6+l,a=w+o*6+(l+1)%6,r=p+6,B=a+6;y.push(p,r,a,a,r,B)}};h(0),h(1);const k=new F.BufferGeometry;k.setAttribute("position",new F.Float32BufferAttribute(u,3)),k.setAttribute("normal",new F.Float32BufferAttribute(_,3)),k.setAttribute("aB",new F.Float32BufferAttribute(d,3)),k.setIndex(y);const v=St({...i,uRed:{value:new lt(e.r,e.g,e.b)}},`
      attribute vec3 aB; uniform float uSkim; uniform vec3 uP; uniform mat4 uCamM; varying vec3 vB; varying vec3 vN; varying vec3 vV;
      void main(){
        float t=aB.x, low=step(0.5,aB.y), zb=uP.z;
        // base at 0.93 of the way to the frame's foot; the upper mandible runs straight ahead, the lower a third longer
        vec3 base=vec3(0.,-0.93/uP.y-0.012*low,-1.)*zb;
        float len=mix(0.185,0.246,low)*zb, op=low*(0.035+0.663*uSkim), co=cos(op), so=sin(op);
        vec3 ax=vec3(0.,-so,-co), up=vec3(0.,co,-so);
        float k=pow(1.-t,0.75)*0.88+0.12;
        float hw=0.0125*zb*(0.25+0.75*k)*mix(1.,0.62,low), hh=mix(0.022,0.014,low)*zb*k;
        vec3 pv=base+ax*len*t+vec3(position.x*hw,0.,0.)+up*position.y*hh;
        vec3 nv=normalize(vec3(normal.x,0.,0.)+up*normal.y+vec3(0.,0.,0.05));
        vB=aB; vN=mat3(uCamM)*nv; vV=-(mat3(uCamM)*pv);
        gl_Position=projectionMatrix*vec4(pv,1.);
      }`,`
      uniform vec3 uRed; varying vec3 vB; varying vec3 vN; varying vec3 vV;
      ${ue}
      ${Kt}
      void main(){
        vec3 n=normalize(vN+vec3(0.,1e-4,0.)), V=normalize(vV+vec3(0.,1e-4,0.));
        float t=vB.x+0.03*(vn(vec2(vB.z*9.,vB.x*30.))-.5);
        vec3 alb=mix(uRed*(0.95+0.25*vB.z),vec3(0.03,0.028,0.035),smoothstep(0.42,0.52,t+0.06*vB.y));
        alb*=0.88+0.12*sin(vB.z*26.+vn(vec2(vB.x*40.,3.))*3.);          // growth ridges along the blade
        alb=mix(alb,alb*0.55,smoothstep(0.75,1.,abs(vB.z))*0.6);          // darker cutting edges
        float sp=pow(max(dot(reflect(-uSun,n),V),0.),36.)+0.25*pow(1.-max(dot(n,V),0.),4.);
        gl_FragColor=vec4(tlLit(alb,n,1.)+alb*uFill*0.25+uSunCol*sp*0.4,1.);
      }`,{side:F.DoubleSide,fog:!1,depthFunc:F.AlwaysDepth});f.add(kt(k,v,"bill",8))}{const u=[],_=[],d=[];for(const v of[-1,1])for(let M=0;M<3;M++){const w=u.length/3;for(let c=0;c<=8;c++){const o=c/8;u.push(o,-1,0,o,1,0),_.push(v,M,o,-1,v,M,o,1)}for(let c=0;c<8;c++){const o=w+c*2;d.push(o,o+2,o+1,o+1,o+2,o+3)}}const h=new F.BufferGeometry;h.setAttribute("position",new F.Float32BufferAttribute(u,3)),h.setAttribute("aW",new F.Float32BufferAttribute(_,4)),h.setIndex(d);const k=St(i,`
      attribute vec4 aW; uniform vec3 uBeat,uP; varying vec4 vW; varying float vS;
      void main(){
        float sd=aW.x, f=aW.y, a=aW.z, b=aW.w;
        float s=pow(0.5+0.5*sin(uBeat.x-0.35*f),1.3)*uBeat.y*(1.-uBeat.z);          // how far in this feather's tip is
        float asp=uP.y/uP.x;                                                        // frame width over height
        // the tip, in frame units of height (x from the edge inward, y from mid height); the feather runs back out to its root
        vec2 tip=vec2(-0.14*s+0.035+0.034*f,0.03+0.15*s-0.036*f+0.1*uBeat.z);
        vec2 dir=normalize(vec2(1.,-0.36-0.1*f));
        vec2 q=tip+dir*a*0.36+vec2(dir.y,-dir.x)*b*0.019*sqrt(max(a,0.))*(1.+0.9*a);
        vW=aW; vS=s;
        gl_Position=vec4(sd*(1.-2.*(-q.x)/asp)*1.,2.*q.y,0.,1.);
      }`,`
      uniform vec3 uSunCol,uFill; varying vec4 vW; varying float vS;
      void main(){
        float e=abs(vW.w), edge=1.-smoothstep(0.5,1.,e);
        float shaft=1.-smoothstep(0.,0.14,e);
        vec3 col=vec3(0.03,0.03,0.038)*(uFill*1.5+uSunCol*0.7)+vec3(0.07,0.075,0.09)*uFill*shaft+vec3(0.07)*uSunCol*smoothstep(0.4,0.9,vW.w*vW.x)*0.6;
        gl_FragColor=vec4(col,clamp(edge*0.96*smoothstep(0.,0.06,vS),0.,1.));
      }`,{transparent:!0,depthWrite:!1,depthTest:!1,fog:!1,side:F.DoubleSide});f.add(kt(h,k,"wingtips",8))}return{group:f,uniforms:i}}function q0(t){const e=new F.Group;e.name="our-cut";const f={...t,uCut:{value:0}},i=.4,u=3.7,_=i+u;{const d=[],y=[],h=[];for(let w=0;w<=24;w++){const c=w/24;d.push(-1,0,c,1,0,c),y.push(c,-1,c,1)}for(let w=0;w<24;w++){const c=w*2;h.push(c,c+2,c+1,c+1,c+2,c+3)}const v=new F.BufferGeometry;v.setAttribute("position",new F.Float32BufferAttribute(d,3)),v.setAttribute("aK",new F.Float32BufferAttribute(y,2)),v.setIndex(h);const M=St(f,`
      attribute vec2 aK; uniform float uTime; varying vec3 vK;
      #include <fog_pars_vertex>
      void main(){
        float t=aK.x, z=${(-i).toFixed(2)}+t*${_.toFixed(2)}, bk=clamp(z/${u.toFixed(2)},0.,1.);
        float w=mix(0.012,0.052,smoothstep(${(-i).toFixed(2)},-0.04,z))+0.12*pow(bk,0.7);
        vec3 p=vec3(aK.y*w+(0.03*sin(z*5.-uTime*8.)+0.016*sin(z*11.3-uTime*13.))*bk,0.,z);
        vK=vec3(aK,z); vec4 mvPosition=viewMatrix*modelMatrix*vec4(p,1.); gl_Position=projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,`
      uniform vec3 uSunCol,uFill; uniform float uTime,uCut; varying vec3 vK;
      ${Kt}
      #include <fog_pars_fragment>
      void main(){
        float v=vK.y, e=abs(v), z=vK.z, bk=clamp(z/${u.toFixed(2)},0.,1.), flow=z*2.6-uTime*13.;
        // one soft-shouldered stroke with a ragged edge, streaming back from the cut; churned along its length, thinning
        // and torn into dashes toward its tail
        float rag=0.55+0.4*vn(vec2(flow*1.2,sign(v)*5.+2.));
        float body=exp(-e*e*3.4)*(1.-smoothstep(rag,1.,e));
        float br=0.5+0.5*smoothstep(0.25,0.62,vn(vec2(flow,v*2.4+3.)))*(0.6+0.4*vn(vec2(flow*2.6,v*7.)));
        float dash=mix(1.,smoothstep(0.34,0.56,vn(vec2(flow*0.42,7.))),smoothstep(0.3,0.8,bk));
        // the knot at the cut: churned foam, never a solid white lump
        float churn=0.4+0.6*smoothstep(0.3,0.68,vn(vec2(flow*1.7,v*3.1+uTime*2.3)));
        float head=exp(-z*z*42.)*(1.-e*e*0.7)*0.8*churn;
        float a=clamp(body*br*dash*(1.-0.75*bk)*(0.55+0.45*churn)+head,0.,1.);
        float fade=smoothstep(${(-i).toFixed(2)},${(-i*.35).toFixed(2)},z)*(1.-smoothstep(0.8,1.,bk))*uCut;
        gl_FragColor=vec4((uFill*0.6+uSunCol*1.2)*0.95*(1.+0.5*head),clamp(a*fade*0.74,0.,1.));
        #include <fog_fragment>
      }`,{transparent:!0,depthWrite:!1,side:F.DoubleSide});e.add(kt(v,M,"our-furrow",3))}{const y=new Float32Array(440),h=ke("tl-cut-spray");for(let v=0;v<110;v++)y[v*4]=h(),y[v*4+1]=h(),y[v*4+2]=h(),y[v*4+3]=h()<.5?1:-1;const k=St(f,`
      attribute vec4 iA; uniform float uTime,uCut; varying vec2 vUv; varying float vA;
      #include <fog_pars_vertex>
      void main(){
        // drops fly up, out to either side and a little ahead of the cut (two low fans); every fifth is a curl of water lying low
        float f=fract(uTime*(2.7+iA.y*1.7)+iA.x), T=0.3*f, curl=step(0.8,iA.z);
        vec3 c=vec3(iA.w*(0.02+(0.35+1.5*iA.z)*T),0.015+(0.5+1.0*iA.y)*T-4.9*T*T,-0.05-(0.5+1.6*iA.x)*T);
        c=mix(c,vec3(iA.w*(0.03+(0.3+0.8*iA.y)*T),0.012+(0.15+0.4*iA.x)*T-2.4*T*T,-0.02-(0.3+1.0*iA.y)*T),curl);
        vec4 mvPosition=viewMatrix*modelMatrix*vec4(c,1.);
        mvPosition.xy+=position.xy*mix((0.005+0.008*f)*(0.7+0.8*iA.x)*vec2(1.2,1.2),(0.012+0.03*f)*vec2(1.9,0.75),curl);
        vUv=position.xy; vA=uCut*(1.-f)*smoothstep(0.,0.1,f)*mix(1.,0.5,curl);
        gl_Position=projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,`
      uniform vec3 uSunCol,uFill; varying vec2 vUv; varying float vA;
      #include <fog_pars_fragment>
      void main(){
        float a=max(1.-dot(vUv,vUv),0.);
        gl_FragColor=vec4((uFill*0.7+uSunCol*1.3)*0.95,clamp(a*a*vA*0.95,0.,1.));
        #include <fog_fragment>
      }`,{transparent:!0,depthWrite:!1});e.add(kt(Zt(ge(),{iA:[y,4]},110),k,"our-spray",6))}return{group:e,uniforms:f}}function I0(t,e,f){const i=f.anchors,u=i.waterLevel,_=f.heightAt,d=[],y=[],h=[];for(let p=0;p<5;p++){const a=p===2,r=a?.93:.84;for(let B=-r+t.range(0,.04);B<=r;){const A=1+Math.floor(t()*t()*3.4);for(let n=0;n<A&&B<=r;n++){const s=i.crestLine(p,B),S=i.crestLine(p,B-.01),x=i.crestLine(p,B+.01);if(B+=a?t.range(.005,.013):t.range(.03,.07),s.y-u<3.2)continue;let m=x.x-S.x,T=x.z-S.z;const g=Math.hypot(m,T)||1;m/=g,T/=g;let I=T,H=-m;H<0&&(I=-I,H=-H);let X=s.x,Q=s.z,dt=_(s.x,s.z);for(let C=-6;C<=6;C+=.5){const V=_(s.x+I*C,s.z+H*C);V>dt&&(dt=V,X=s.x+I*C,Q=s.z+H*C)}const ct=t.range(-.85,.7),et=Math.cos(ct),Y=Math.sin(ct);let ht=I*et-H*Y,Z=I*Y+H*et+.12;const E=Math.hypot(ht,Z);ht/=E,Z/=E;const K=t()<.3;d.push(X,dt+.12,Q,t()),y.push((K?t.range(26,44):t.range(9,24))*(a?1:.8),K?t.range(2.4,4):t.range(1,2.2),t.range(.8,1.3),t()),h.push(ht,Z)}B+=a?t.range(.016,.052):t.range(.05,.14)}}const k=d.length/4,v=[],M=[],w=16;for(let p=0;p<=w;p++){const a=p/w;v.push(a,-1,0,a,1,0)}for(let p=0;p<w;p++){const a=p*2;M.push(a,a+2,a+1,a+1,a+2,a+3)}const c=new F.BufferGeometry;c.setAttribute("position",new F.Float32BufferAttribute(v,3)),c.setIndex(M);const o={...e,uK:{value:1},uPx:f.uniforms.uPx},l=St(o,`
    attribute vec4 iR, iS; attribute vec2 iD; uniform float uTime,uK,uPx; varying vec3 vS; varying vec3 vA;
    #include <fog_pars_vertex>
    vec3 centre(float s){
      float L=iS.x, h1=iR.w, h2=iS.w;
      // it leaves the brink straight, then the eddy behind the crest takes it: a slow curl to one side, a wander on top of
      // that, and a snaking that runs down it with the gusts
      float curl=(h1-.5)*0.9*L*s*s;
      float sway=((2.2+2.6*h2)*sin(s*(2.4+2.*h1)+uTime*0.8+h1*30.)+1.2*sin(s*7.3-uTime*1.9+h2*40.))*s*smoothstep(0.,0.35,s);
      float y=L*((0.09+0.1*h2)*s-(0.28+0.2*h1)*s*s)+0.6*sin(s*6.-uTime*2.3+h1*50.)*s;
      return iR.xyz+vec3(iD.x*s*L-iD.y*(sway+curl),y,iD.y*s*L+iD.x*(sway+curl));
    }
    void main(){
      float s=position.x, sd=position.y;
      vec3 c=centre(s), tg=normalize(centre(s+0.03)-c+vec3(0.,0.,1e-4));
      vec3 toC=cameraPosition-c; float dist=length(toC);
      vec3 side=normalize(cross(tg,toC)+vec3(0.,1e-4,0.));
      float far=smoothstep(60.,200.,dist);
      float belly=(0.12+1.2*smoothstep(0.,0.3,s))*(1.-0.62*smoothstep(0.42,1.,s));
      float w=max(iS.y*belly,dist*uPx*(2.5+5.0*belly)*(1.-0.6*far));
      float gust=0.7+0.3*sin(uTime*0.55*iS.z+iS.w*6.283)*sin(uTime*0.21+iR.w*20.);
      vS=vec3(s,sd,iR.w); vA=vec3(uK*gust*smoothstep(0.,0.03,s)*pow(1.-s,0.85)*smoothstep(4.,14.,dist)*mix(0.6,1.,smoothstep(12.,48.,dist))*(1.-far*step(0.3,iS.w))*(1.-0.3*far),iS.x,iS.z);
      vec4 mvPosition=viewMatrix*vec4(c+side*sd*w,1.); gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,`
    uniform vec3 uSand,uSunCol,uFill; uniform float uTime; varying vec3 vS; varying vec3 vA;
    ${Kt}
    #include <fog_pars_fragment>
    void main(){
      float s=vS.x, v=vS.y, run=s*vA.y;
      float st=vn(vec2(run*0.3-uTime*vA.z*1.6,v*0.6+vS.z*9.))*0.6+vn(vec2(run*0.95-uTime*vA.z*3.4,v*1.5+vS.z*3.))*0.4;
      // a soft-edged wisp, off centre and wandering inside its ribbon, fraying into haze from a quarter of its length
      float vc=v-0.45*(vn(vec2(run*0.22+vS.z*17.,2.))-.5)*smoothstep(0.05,0.5,s);
      float across=exp(-vc*vc*mix(3.0,2.2,s));
      float fray=mix(1.,smoothstep(0.08,0.62,st),smoothstep(0.25,0.75,s));
      float a=vA.x*across*fray*(1.-smoothstep(0.75,1.,abs(v)));
      vec3 col=uSand*(uFill*0.5+uSunCol*1.0);
      gl_FragColor=vec4(col,clamp(a*1.25,0.,0.94));
      #include <fog_fragment>
    }`,{transparent:!0,depthWrite:!1,side:F.DoubleSide});return{mesh:kt(Zt(c,{iR:[new Float32Array(d),4],iS:[new Float32Array(y),4],iD:[new Float32Array(h),2]},k),l,"brink-streamers",3.5),uniforms:o,count:k}}async function R0(t,e,f,i,u,_){const d=i.anchors.waterLevel,y=i.heightAt,h=new lt,k=new lt,v=[],M=e.range(21,25),w=e.range(0,M);for(let r=2;r<u.length-30;r+=.5){if(u.posAtDist(r,h),h.y-d>1.25||d-y(h.x,h.z)<.4)continue;const B=(r+w)%M-M*.5,A=Math.exp(-B*B/14),n=.5+.5*Math.sin(r*.23+1.3)*Math.sin(r*.071+.4);v.push([r,Math.max(A,.12+.2*n)])}await t.yield();const c=Math.max(2,v.length?_:1)*2,o=new Float32Array(c*4),l=new Float32Array(c*4);for(let r=0,B=0;r<c/2;r++){let A=null;for(let Q=0;Q<12&&v.length;Q++){const dt=v[e.int(0,v.length-1)];if(e()<dt[1]){A=dt;break}}const n=A?A[0]+e.range(-.25,.25):0,s=(e.gauss?e.gauss():e.range(-1.5,1.5))*.9;u.posAtDist(Math.max(0,n),h),u.tangentAtDist(Math.max(0,n),k);const S=Math.hypot(k.x,k.z)||1,x=A?h.x-k.z/S*s:0,m=A?h.z+k.x/S*s:9999,T=e(),g=e(),I=e.range(0,40),H=e.range(0,tt),X=e.range(.3,.42)*.6;for(let Q=0;Q<2;Q++,B++)o.set([x,m,T,g],B*4),l.set([I,H,1-Q,X],B*4);(r&255)===255&&await t.yield()}const p={...f,uWater:i.uniforms.uWater,uPx:i.uniforms.uPx,uBill:{value:new lt(0,0,9999)}},a=St(p,`
    attribute vec4 iF, iG; uniform float uTime,uWater,uPx; uniform vec3 uBill,uSun; varying vec2 vUv; varying vec3 vI;
    #include <fog_pars_vertex>
    void main(){
      float s1=iF.z, s2=iF.w, shd=1.-iG.z, t=uTime*0.5+iG.x;
      float ha=iG.y+0.9*sin(t*0.7+s1*20.);
      vec2 hd=vec2(cos(ha),sin(ha)), pp=vec2(-hd.y,hd.x);
      vec2 pos=iF.xy+vec2(sin(t*0.8+s2*30.),cos(t*0.63+s1*30.))*0.6+hd*0.5*sin(t*1.7+s1*9.);
      vec2 d=pos-uBill.xz; float dd=dot(d,d); pos+=d*1.6*exp(-dd/2.5);        // the shoal parts round the bill
      float L=iG.w*(1.+0.5*shd), wig=sin(uTime*13.+s1*50.+position.x*2.)*0.04*(0.3+0.7*step(position.x,0.));
      vec2 q=pos+hd*position.x*L*0.5+pp*(position.y*L*0.2+wig);
      q-=shd*uSun.xz/max(uSun.y,0.25)*0.3;
      float fl=pow(max(sin(uTime*2.9+s1*37.+s2*11.),0.),18.);
      vec4 mvPosition=viewMatrix*vec4(q.x,uWater+0.03-0.012*shd,q.y,1.);
      vUv=position.xy; vI=vec3(fl,shd,1.-smoothstep(16.,38.,-mvPosition.z));
      mvPosition.y+=position.y*(-mvPosition.z)*uPx*(1.1+0.6*shd);
      gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,`
    uniform vec3 uSunCol,uFill; varying vec2 vUv; varying vec3 vI;
    #include <fog_pars_fragment>
    void main(){
      float x=vUv.x, y=abs(vUv.y);
      float w=x>-0.55?sqrt(max(1.-(x-0.22)*(x-0.22)/0.61,0.))*0.62:(-x-0.55)/0.45*0.7+0.08;
      float a=1.-smoothstep(w-0.28-0.3*vI.y,w,y);
      vec3 body=vec3(0.07,0.19,0.21)*(uFill*0.8+uSunCol)+uSunCol*vI.x*0.9*(1.-smoothstep(0.,0.4,y));
      vec3 col=mix(body,vec3(0.01,0.04,0.075)*uFill,vI.y);
      gl_FragColor=vec4(max(col,vec3(0.)),clamp(a*mix(0.8,0.45,vI.y)*vI.z,0.,1.));
      #include <fog_fragment>
    }`,{transparent:!0,depthWrite:!1,side:F.DoubleSide});return{mesh:kt(Zt(ge(),{iF:[o,4],iG:[l,4]},c),a,"tetra-shoals",1),uniforms:p}}async function D0(t,e,f,i,u,_){const d=i.heightAt,y=i.anchors.waterLevel,h=[],k=Math.ceil(_/30);for(let r=0;r<k;r++){const B=e.sign()*(1.6+100*Math.pow(e(),1.7));let A=null,n=0;for(let s=ae+16;s>ce-50;s-=3){const S=u.xAt(s)+B,x=y-d(S,s);if(A!==null&&x>.04!=A>.04){const m=st(n,s,(.04-A)/(x-A||.001)),T=x>A,g=T?e.int(5,10):e.int(1,4);for(let I=0;I<g;I++)h.push([S+e.range(-2.6,2.6),m+e.range(-1.2,1.2)-(T?e.range(0,1.8):-e.range(0,.8))])}A=x,n=s}(r&7)===7&&await t.yield()}await t.yield();const v=new Float32Array(h.length*4),M=new Float32Array(h.length*4);let w=0;for(const r of h){const B=d(r[0],r[1]);B<y-.42||B>y+.3||Math.abs(r[0]-u.xAt(r[1]))<1.4||(v[w*4]=r[0],v[w*4+1]=B-.03,v[w*4+2]=r[1],v[w*4+3]=e.range(0,tt),M[w*4]=e.range(.7,1.35)*(B<y?1.25:1),M[w*4+1]=e(),M[w*4+2]=e.range(0,tt),M[w*4+3]=0,w++)}const c=[],o=[],l=[];for(let r=0;r<5;r++){const B=r*1.2566+.4*Math.sin(r*2.1),A=.1+.16*(r*.37%1),n=.34+.2*(r*.61%1),s=c.length/3,S=Math.cos(B),x=Math.sin(B);for(const[m,T]of[[0,1],[.55,.7],[1,.05]]){const g=.03+A*m*m*1.6;c.push(S*g,n*m,x*g,S*g,n*m,x*g),o.push(m,-T,r,m,T,r)}l.push(s,s+1,s+2,s+1,s+3,s+2,s+2,s+3,s+4,s+3,s+5,s+4)}const p=new F.BufferGeometry;p.setAttribute("position",new F.Float32BufferAttribute(c,3)),p.setAttribute("aT",new F.Float32BufferAttribute(o,3)),p.setIndex(l);const a=St({...f,uPx:i.uniforms.uPx},`
    attribute vec3 aT; attribute vec4 iA, iB; uniform float uTime,uPx; varying vec3 vT; varying vec3 vN;
    #include <fog_pars_vertex>
    void main(){
      float c=cos(iA.w), s=sin(iA.w), t=aT.x; vec3 p=position*iB.x; p.xz=vec2(p.x*c-p.z*s,p.x*s+p.z*c);
      vec3 w=iA.xyz+p;
      float g=0.5+0.5*sin(uTime*1.9+w.x*0.35+w.z*0.5+iB.z)+0.35*sin(uTime*5.3+iB.z*3.+aT.z);
      w.z+=t*t*iB.x*(0.07+0.13*g); w.x+=t*t*iB.x*0.04*sin(uTime*2.7+iB.z);
      vec4 mvPosition=viewMatrix*vec4(w,1.);
      float hw=max(0.011*iB.x,-mvPosition.z*uPx*0.75);
      mvPosition.x+=aT.y*hw;
      vT=vec3(t,iB.y,g); vN=normalize(vec3(p.x,0.5,p.z)+vec3(0.,1e-3,0.));
      gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,`
    varying vec3 vT; varying vec3 vN;
    ${ue}
    #include <fog_pars_fragment>
    void main(){
      vec3 alb=mix(vec3(0.035,0.085,0.03),mix(vec3(0.17,0.34,0.09),vec3(0.3,0.36,0.13),vT.y*vT.y),vT.x);
      vec3 col=tlLit(alb,normalize(vN),1.)+alb*uSunCol*0.35*vT.x;
      gl_FragColor=vec4(col*(0.55+0.45*vT.x),1.);
      #include <fog_fragment>
    }`,{side:F.DoubleSide});return{mesh:kt(Zt(p,{iA:[v.subarray(0,w*4),4],iB:[M.subarray(0,w*4),4]},w),a,"sedge"),count:w,base:p}}function Je(t,e){const f=[],i=[],u=[],_=[],d=[],h=(s,S,x,m,T)=>(f.push(s[0],s[1],s[2]),i.push(S[0],S[1],S[2]),u.push(x[0],x[1],x[2]),_.push(m,T),f.length/3-1),k=[.37,.35,.325],v=e?10:7,M=[0,.35,.9,1.8],w=[.86,.62,.46,.39];for(let s=e?2.9:5;s<20.5-.5;s+=e?1.1:6)M.push(s),w.push(.35+.035*Math.sin(s/20.5*3.6-.6)-.05*Math.pow(s/20.5,3));M.push(20.5),w.push(.29);for(let s=0;s<M.length;s++)for(let S=0;S<v;S++){const x=S/v*tt,m=s<3?1+.22*Math.sin(x*5+1.3)*(1-s/3):1,T=s<3?.5:0;h([Math.cos(x)*w[s]*m,M[s],Math.sin(x)*w[s]*m],[Math.cos(x),T,Math.sin(x)],k,.12*Math.pow(M[s]/20.5,2),0)}for(let s=0;s<M.length-1;s++)for(let S=0;S<v;S++){const x=s*v+S,m=s*v+(S+1)%v;d.push(x,m,x+v,m,m+v,x+v)}const c=(s,S,x,m,T,g,I,H,X,Q,dt)=>{const ct=Math.cos(s),et=[Math.cos(S)*ct,Math.sin(s),Math.sin(S)*ct],Y=[-Math.sin(S),0,Math.cos(S)],ht=[et[1]*Y[2]-et[2]*Y[1],et[2]*Y[0]-et[0]*Y[2],et[0]*Y[1]-et[1]*Y[0]],Z=Math.cos(x),E=Math.sin(x),K=[Y[0]*Z+ht[0]*E,Y[1]*Z+ht[1]*E,Y[2]*Z+ht[2]*E],C=[ht[0]*Z-Y[0]*E,ht[1]*Z-Y[1]*E,ht[2]*Z-Y[2]*E];C[1]<0&&(C[0]=-C[0],C[1]=-C[1],C[2]=-C[2]);const V=[et[0]*m,dt+et[1]*m-H*.25,et[2]*m],gt=h([K[0]*.08,dt-.2,K[2]*.08],C,k,.1,1),L=h([-K[0]*.08,dt-.2,-K[2]*.08],C,k,.1,1),bt=h([V[0]+K[0]*.06,V[1],V[2]+K[2]*.06],C,g,.35,1),ee=h([V[0]-K[0]*.06,V[1],V[2]-K[2]*.06],C,g,.35,1);d.push(gt,L,bt,L,ee,bt);for(let xt=0;xt<X;xt++){const ut=((xt+.5)/X-.5)*2*Q,mt=Math.cos(ut),Tt=Math.sin(ut),Ut=Math.abs(ut)/Q,Et=T*(1-.2*Ut)*t.range(.9,1.08),Lt=[et[0]*mt+K[0]*Tt,et[1]*mt+K[1]*Tt,et[2]*mt+K[2]*Tt],Vt=[-et[0]*Tt+K[0]*mt,-et[1]*Tt+K[1]*mt,-et[2]*Tt+K[2]*mt],Ht=(b,W,R,D)=>[V[0]+Lt[0]*Et*b+Vt[0]*W+C[0]*(R-D*.3),V[1]+Lt[1]*Et*b+Vt[1]*W+C[1]*(R-D*.3)-D,V[2]+Lt[2]*Et*b+Vt[2]*W+C[2]*(R-D*.3)],ot=(e?.115:.2)*(.8+.2*Et/T),Ct=H*(.55+.45*Ut)*t.range(.8,1.2),Ot=[C[0]+Vt[0]*.5,C[1]+Vt[1]*.5,C[2]+Vt[2]*.5],Yt=[C[0]-Vt[0]*.5,C[1]-Vt[1]*.5,C[2]-Vt[2]*.5],Wt=h(Ht(.03,0,0,0),C,g,.35,1),Nt=h(Ht(.45,ot,-.04,Ct*.14),Ot,g,.65,1),Xt=h(Ht(.45,-ot,-.04,Ct*.14),Yt,g,.65,1);if(e){const b=h(Ht(.5,0,.05,Ct*.14),C,I,.65,1),W=h(Ht(.8,ot*.6,-.02,Ct*.52),Ot,g,.9,1),R=h(Ht(.8,-ot*.6,-.02,Ct*.52),Yt,g,.9,1),D=h(Ht(1,0,0,Ct),C,I,1,1);d.push(Wt,Nt,b,Wt,b,Xt,Nt,W,b,b,R,Xt,W,D,R,W,R,b)}else{const b=h(Ht(1,0,0,Ct),C,I,1,1);d.push(Wt,Nt,Xt,Nt,b,Xt)}}},o=[.03,.15,.045],l=[.085,.26,.065],p=[.2,.17,.135],a=[.31,.275,.225],r=e?20:12,B=e?14:8,A=e?11:6;for(let s=0;s<r;s++){const S=s/(r-1);c(-.55+2*Math.pow(S,.85)+t.range(-.1,.1),s*2.39996+t.range(-.2,.2),t.range(-.7,.7),t.range(1.7,2.5)*(1-.25*S),t.range(2,2.5),o,l,1.15-.75*S,B,2.65,20.5)}for(let s=0;s<A;s++)c(-1.2+t.range(-.14,.14),s*tt/A+t.range(-.3,.3),t.range(-.5,.5),t.range(.7,1.3),t.range(2.3,3.2),p,a,.5,e?7:5,1.5,20.5-.4);for(let s=0;s<(e?8:4);s++)c(-1.42+t.range(-.07,.07),s*tt/(e?8:4)+t.range(-.3,.3)+.4,t.range(-.4,.4),t.range(.25,.5),t.range(2,3),p,a,.3,e?6:4,1.1,20.5-1.5);const n=new F.BufferGeometry;return n.setAttribute("position",new F.Float32BufferAttribute(f,3)),n.setAttribute("normal",new F.Float32BufferAttribute(i,3)),n.setAttribute("aCol",new F.Float32BufferAttribute(u,3)),n.setAttribute("aW",new F.Float32BufferAttribute(_,2)),n.setIndex(d),n}function L0(t){return St(t,`
    attribute vec3 aCol; attribute vec2 aW; attribute vec4 iA, iB; uniform float uTime;
    varying vec3 vCol; varying vec3 vN; varying vec3 vV; varying vec3 vK; varying vec4 vBall;
    #include <fog_pars_vertex>
    void main(){
      float c=cos(iA.w), s=sin(iA.w); vec3 p=position*iB.x, n=normal; p.xz=vec2(p.x*c-p.z*s,p.x*s+p.z*c); n.xz=vec2(n.x*c-n.z*s,n.x*s+n.z*c);
      vec3 w=iA.xyz+p; float ph=iB.y+w.x*0.05;
      w.z+=aW.x*(0.35+0.3*sin(uTime*0.9+ph)+0.12*sin(uTime*2.3+ph*2.+position.y));
      w.y+=aW.x*aW.x*0.13*sin(uTime*6.5+position.x*2.6+position.z*3.1+ph);
      w.x+=aW.x*0.1*sin(uTime*1.3+ph*1.7);
      // the crown as a ball: direction and distance from its heart (the top of the trunk)
      vec3 b=position-vec3(0.,20.5,0.); float bl=length(b); b=b/max(bl,1e-3); b.xz=vec2(b.x*c-b.z*s,b.x*s+b.z*c);
      vBall=vec4(b,bl);
      vCol=aCol*mix(1.,iB.z,aW.y); vN=n; vV=cameraPosition-w; vK=vec3(aW.y,position.y,atan(position.z,position.x+1e-4));
      vec4 mvPosition=viewMatrix*vec4(w,1.); gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,`
    varying vec3 vCol; varying vec3 vN; varying vec3 vV; varying vec3 vK; varying vec4 vBall;
    ${ue}
    ${Kt}
    #include <fog_pars_fragment>
    void main(){
      vec3 n=normalize(vN+vec3(0.,1e-4,0.)), V=normalize(vV+vec3(0.,1e-4,0.)); vec3 alb=vCol; vec3 col;
      if(vK.x>0.5){
        float back=step(dot(n,V),0.); if(back>0.5) n=-n;
        vec3 nb=normalize(mix(n,vBall.xyz,0.62)+vec3(0.,1e-4,0.));                       // each fan takes most of its light as part of the ball
        float ao=mix(0.34,1.,smoothstep(0.8,4.2,vBall.w))*(0.72+0.28*vBall.y);            // dark heart, darker underside
        float sp=pow(max(dot(reflect(-uSun,n),V),0.),18.)*0.5*(1.-back);
        float thru=back*max(dot(-n,uSun),0.);                                             // sun through the blade
        alb*=0.86+0.28*vn(vec2(vK.z*7.,vK.y*1.3));
        col=tlLit(alb,nb,1.)*ao+alb*vec3(1.15,1.25,0.6)*uSunCol*0.6*thru*ao+uSunCol*sp*0.2*ao;
      } else {
        // the trunk: a ringed leaf scar every third of a metre (a dark groove with a pale lip, fading before it can alias),
        // broader weathered bands, fibre streaks down the column, a dark wet foot; one side takes the sun, the other the sky
        float yy=vK.y+0.05*vn(vec2(vK.z*3.,vK.y*0.8)), rp=yy*18.5, fwr=fwidth(rp), rk=1.-smoothstep(0.9,2.6,fwr);
        float sc=sin(rp), groove=smoothstep(0.55,0.95,sc)*rk, lip=smoothstep(0.2,0.75,sin(rp-1.2))*rk;
        float band=vn(vec2(vK.z*0.7,yy*0.55))*0.6+vn(vec2(vK.z*2.1+7.,yy*1.9))*0.4;
        float fibre=vn(vec2(vK.z*9.,yy*0.35))*0.6+vn(vec2(vK.z*23.,yy*1.1))*0.4;
        alb*=(0.72+0.5*band)*(0.82+0.36*fibre)*(1.-0.5*groove+0.22*lip)*mix(0.42,1.,smoothstep(0.2,3.2,vK.y))*mix(1.,0.6,smoothstep(17.5,20.,vK.y));
        n=normalize(n+vec3(0.,0.55*cos(rp)*rk,0.)+vec3(fibre-.5,0.,band-.5)*0.3);
        col=tlLit(alb,n,1.)+alb*uSunCol*0.07*(1.-n.y);                                    // a little of the white sand's light comes back up onto the trunks
      }
      gl_FragColor=vec4(col,1.);
      #include <fog_fragment>
    }`,{side:F.DoubleSide})}function t0(t,e,f,i,u){const _=Math.max(1,i.length),d=new Float32Array(_*4),y=new Float32Array(_*4);return i.forEach((h,k)=>{d.set([h.x,h.y,h.z,t.range(0,tt)],k*4),y.set([h.s,t.range(0,tt),t.range(.82,1.15),0],k*4)}),i.length||d.set([0,-200,0,0],0),kt(Zt(f,{iA:[d,4],iB:[y,4]},_),e,u)}function N0(t,e,f){const i=e.anchors.waterLevel,u=f.filter(c=>c.g<=i+.05),_=Math.max(1,u.length),d=new Float32Array(_*4),y=14,h=[],k=[];u.forEach((c,o)=>d.set([c.x,c.y+20.5*c.s-i,c.z,c.s],o*4)),u.length||d.set([0,20,99999,1],0);for(let c=0;c<=y;c++){const o=c/y;h.push(-1,o,0,1,o,0)}for(let c=0;c<y;c++){const o=c*2;k.push(o,o+2,o+1,o+1,o+2,o+3)}const v=new F.BufferGeometry;v.setAttribute("position",new F.Float32BufferAttribute(h,3)),v.setIndex(k);const M={...t,uWater:e.uniforms.uWater,uMap:e.uniforms.uMap,uRect:e.uniforms.uRect,uCamW:{value:new lt}},w=St(M,`
    attribute vec4 iA; uniform float uWater,uTime; uniform vec3 uCamW; uniform sampler2D uMap; uniform vec4 uRect;
    varying vec4 vR; varying vec3 vQ;
    #include <fog_pars_vertex>
    void main(){
      float top=iA.y, hc=max(uCamW.y-uWater,0.6), yw=position.y*(top+4.6);
      vec2 b=iA.xz, D=uCamW.xz-b; float dl=max(length(D),1e-3); vec2 dn=D/dl, pp=vec2(-dn.y,dn.x);
      float fr=yw/(hc+yw);
      vec2 q=b+D*fr+pp*position.x*5.0*(1.-fr);
      float wet=smoothstep(0.03,0.25,uWater-textureLod(uMap,(q-uRect.xy)*uRect.zw,0.).r);
      vR=vec4(position.x*5.0,yw,top,wet*(1.-smoothstep(0.72,0.93,fr))*(1.-smoothstep(170.,320.,dl))*smoothstep(0.5,2.5,dl*(1.-fr)));
      vQ=vec3(q,fr);
      vec4 mvPosition=viewMatrix*vec4(q.x,uWater+0.035,q.y,1.); gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,`
    uniform float uTime; uniform vec3 uSunCol,uFill,uTeal; varying vec4 vR; varying vec3 vQ;
    ${Kt}
    #include <fog_pars_fragment>
    void main(){
      float top=vR.z, yw=vR.y;
      // the ripples shake the image sideways, more the further it lies from the palm's foot, and tear it into bars
      float rip=vn(vec2(vQ.x*1.1+uTime*0.5,vQ.y*2.3-uTime*1.1))-.5, rip2=vn(vec2(vQ.x*3.7-uTime*0.7,vQ.y*6.1+uTime*1.6))-.5;
      float lx=vR.x+(rip*1.5+rip2*0.5)*(0.35+1.6*vQ.z);
      float trunk=(1.-smoothstep(0.3,0.75,abs(lx)))*step(yw,top);
      float skirt=(1.-smoothstep(0.5,1.5,abs(lx)*(1.+0.45*(top-yw))))*smoothstep(top-5.5,top-4.,yw)*(1.-smoothstep(top-1.,top+0.5,yw));
      vec2 c=vec2(lx,yw-top-0.4); float cr=length(c), an=atan(c.y,c.x+1e-4);
      float crown=1.-smoothstep(2.6,4.4,cr+0.9*vn(vec2(an*3.2,top*1.7)));
      float a=max(max(trunk*0.85,skirt*0.8),crown);
      vec3 col=mix(vec3(0.085,0.09,0.09),vec3(0.012,0.06,0.03),crown)*(uFill*0.9+uSunCol*0.35)+uTeal*0.06;
      float bars=0.55+0.45*smoothstep(0.3,0.62,vn(vec2(vQ.x*0.8,vQ.y*3.4-uTime*0.9)));
      gl_FragColor=vec4(col,clamp(a*bars*vR.w*0.74,0.,1.));
      #include <fog_fragment>
    }`,{transparent:!0,depthWrite:!1,side:F.DoubleSide});return{mesh:kt(Zt(v,{iA:[d,4]},_),w,"palm-reflections",.6),uniforms:M}}function G0(t,e){const f=e.length,i=new Float32Array(f*4),u=new Float32Array(f*4),_=new Float32Array(f*4);e.forEach((y,h)=>{i.set([y.a[0],y.a[1],y.a[2],y.b[1]],h*4),u.set([y.b[0],y.b[2],y.w,y.kind],h*4),_.set([y.k??.5,y.len??0,0,0],h*4)});const d=St(t,`
    attribute vec4 iA, iB, iC; varying vec3 vS; varying float vA; varying float vLen;
    #include <fog_pars_vertex>
    void main(){
      vec2 a=iA.xz, b=iB.xy, d=b-a; float L=max(length(d),1e-3); vec2 t=d/L, pp=vec2(-t.y,t.x);
      float u=position.y*.5+.5, ext=iB.w>2.5?0.:iB.z/L;
      float uu=mix(-ext,1.+ext,u);
      vec2 q=a+t*uu*L+pp*position.x*iB.z;
      vS=vec3(position.x,uu,iB.w); vA=iC.x; vLen=iC.y;
      vec4 mvPosition=viewMatrix*vec4(q.x,mix(iA.y,iA.w,clamp(uu,0.,1.))+0.07,q.y,1.); gl_Position=projectionMatrix*mvPosition;
      gl_Position.z-=0.0006*gl_Position.w;
      #include <fog_vertex>
    }`,`
    uniform vec3 uFill; varying vec3 vS; varying float vA; varying float vLen;
    #include <fog_pars_fragment>
    void main(){
      float x=abs(vS.x), u=vS.y, a=0.;
      if(vS.z<0.5){ float bar=(1.-smoothstep(0.05,0.16,x))*smoothstep(-0.02,0.03,u)*(1.-smoothstep(0.8,0.9,u));
        vec2 c=vec2(vS.x,(u-0.9)*5.5); a=max(bar*0.8,1.-smoothstep(0.35,1.,length(c))); }
      else if(vS.z<1.5){ a=(1.-smoothstep(0.35,1.,x))*smoothstep(-0.05,0.04,u)*(1.-smoothstep(0.85,1.05,u)); }
      else if(vS.z<2.5){ a=1.-smoothstep(0.2,1.,length(vec2(vS.x,(u-0.5)*2.))); }
      else if(vS.z<3.5){ a=1.-smoothstep(0.35,1.,x); }
      else { float al=u*vLen/0.75, sd=mod(floor(al),2.)*2.-1.; vec2 q=vec2((vS.x-sd*0.4)/0.42,(fract(al)-.5)/0.36); a=(1.-smoothstep(0.55,1.,length(q)))*step(0.,u)*step(u,1.); }       // kind 4: a line of footprints
      gl_FragColor=vec4(vec3(0.16,0.25,0.44)*uFill*0.55,clamp(a*vA,0.,1.));
      #include <fog_fragment>
    }`,{transparent:!0,depthWrite:!1,side:F.DoubleSide});return kt(Zt(ge(),{iA:[i,4],iB:[u,4],iC:[_,4]},f),d,"ground-shadows",.5)}function K0(t,e,f,i,u,_,d){const y=[],h=[],k=[],v=[],M=f.heightAt,w=10,c=14;for(let p=0;p<6;p++){const a=u-24-p*6.4+t.range(-1.5,1.5),r=i.xAt(a)+[6.5,9.5,7,11,6,8.5][p]+t.range(0,1.5),B=M(r,a)-.5,A=p===1||p===4,n=(A?t.range(2,2.8):t.range(5,7.4))+.5,s=A?t.range(.15,.3):t.range(.32,.62),S=t.range(0,.45),x=t.range(.27,.34),m=t.range(0,30),T=[Math.sin(s)*Math.sin(S),Math.cos(s),Math.sin(s)*Math.cos(S)],g=[Math.cos(S),0,-Math.sin(S)],I=[T[1]*g[2]-T[2]*g[1],T[2]*g[0]-T[0]*g[2],T[0]*g[1]-T[1]*g[0]],H=y.length/3,X=t.range(-.25,.25);for(let Z=0;Z<=c;Z++){const E=Math.min(1,Z/(c-1)),K=Z===c,C=x*(1-.16*E+.07*Math.sin(Z*1.9+m)+.045*Math.sin(Z*4.3+m*2))*(K?.45:1);for(let V=0;V<w;V++){const gt=V/w*tt,L=Math.cos(gt),bt=Math.sin(gt),ee=Z>=c-1?.28*Math.sin(V*2.4+m)+.2*Math.sin(V*5.1+m*2)-(K?.3:0):0,xt=E*n+ee,ut=X*E*E*n*.3+.05*Math.sin(Z*2.7+m);y.push(r+T[0]*xt+(g[0]*L+I[0]*bt)*C+ut,B+T[1]*xt+(g[1]*L+I[1]*bt)*C,a+T[2]*xt+(g[2]*L+I[2]*bt)*C);const mt=K?-1:1;h.push((g[0]*L+I[0]*bt)*mt,(g[1]*L+I[1]*bt)*mt+(K?.6:0),(g[2]*L+I[2]*bt)*mt),k.push(xt,gt,m,K?1:0)}}for(let Z=0;Z<c;Z++)for(let E=0;E<w;E++){const K=H+Z*w+E,C=H+Z*w+(E+1)%w;v.push(K,C,K+w,C,C+w,K+w)}const Q=[r+T[0]*n,a+T[2]*n],dt=T[1]*n-.5,ct=Math.min(60,dt/Math.max(.12,d.t)),et=Q[0]-d.x*ct,Y=Q[1]-d.z*ct,ht=Math.max(2,Math.ceil(ct/2.2));for(let Z=0;Z<ht;Z++){const E=Z/ht,K=(Z+1)/ht,C=st(r,et,E),V=st(a,Y,E),gt=st(r,et,K),L=st(a,Y,K);_.push({a:[C,M(C,V),V],b:[gt,M(gt,L),L],w:x*1.5,kind:3,k:.6*(1-.75*E)})}_.push({a:[r-.9,M(r,a),a+.15],b:[r+.9,M(r,a),a+.15],w:.8,kind:2,k:.5})}const o=new F.BufferGeometry;o.setAttribute("position",new F.Float32BufferAttribute(y,3)),o.setAttribute("normal",new F.Float32BufferAttribute(h,3)),o.setAttribute("aK",new F.Float32BufferAttribute(k,4)),o.setIndex(v);const l=St(e,`
    attribute vec4 aK; varying vec4 vK; varying vec3 vN; varying vec3 vV;
    #include <fog_pars_vertex>
    void main(){ vK=aK; vN=normal; vV=cameraPosition-position; vec4 mvPosition=viewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mvPosition;
      #include <fog_vertex>
    }`,`
    varying vec4 vK; varying vec3 vN; varying vec3 vV;
    ${ue}
    ${Kt}
    #include <fog_pars_fragment>
    void main(){
      vec3 n=normalize(vN+vec3(0.,1e-4,0.)); float d=vK.x, a=vK.y, s=vK.z;
      float ring=sin(d*17.+vn(vec2(a*1.5,d*2.+s))*2.5);
      float fib=vn(vec2(a*9.+s,d*1.4))*0.6+vn(vec2(a*26.,d*4.+s))*0.4;
      float crack=smoothstep(0.78,0.9,vn(vec2(a*5.+s*3.,d*0.6)));
      n=normalize(n+vec3(0.,0.25*ring*ring*sign(ring),0.)*0.5+vec3(fib-.5)*0.25);
      vec3 alb=mix(vec3(0.43,0.43,0.42),vec3(0.3,0.285,0.265),vn(vec2(a*1.3+s,d*0.45)))*(0.66+0.34*smoothstep(-0.6,0.6,ring)+0.34*(fib-.5));
      alb=mix(alb,vec3(0.1,0.085,0.07),crack*0.75);
      alb=mix(alb,vec3(0.13,0.1,0.08),vK.w*0.85);                      // the hollow, rotted top
      alb*=mix(0.7,1.,smoothstep(0.5,1.2,d));                           // sand-scoured, damp foot
      gl_FragColor=vec4(tlLit(alb,n,1.),1.);
      #include <fog_fragment>
    }`,{side:F.DoubleSide});return kt(o,l,"buried-trunks")}function U0(t,e,f){const i=[],u=[],_=[],d=[0,3.2,6.1,6.6,7,7.4,8.2],y=28;for(let M=0;M<=y;M++){const w=Math.PI+M/y*Math.PI;for(const c of d)i.push(Math.cos(w)*c,e+Math.sin(w)*c,ce+.08),u.push(c,-Math.sin(w)*c)}for(let M=0;M<y;M++)for(let w=0;w<d.length-1;w++){const c=M*d.length+w,o=c+d.length;_.push(c,o,c+1,c+1,o,o+1)}const h=new F.BufferGeometry;h.setAttribute("position",new F.Float32BufferAttribute(i,3)),h.setAttribute("aR",new F.Float32BufferAttribute(u,2)),h.setIndex(_);const k=new F.Color(f),v=St({...t,uCol:{value:new lt(k.r,k.g,k.b)},uShow:{value:0}},`
    attribute vec2 aR; uniform float uTime; varying vec3 vR;
    void main(){
      vec3 p=position; float dep=aR.y;
      p.x+=dep*(0.035*sin(dep*2.1-uTime*2.6)+0.02*sin(dep*5.3+uTime*3.7+p.x));
      vec4 mv=viewMatrix*vec4(p,1.); vR=vec3(aR,-mv.z); gl_Position=projectionMatrix*mv;
    }`,`
    uniform vec3 uCol; uniform float uTime, uShow; varying vec3 vR;
    ${Kt}
    void main(){
      float r=vR.x, dep=vR.y;
      float ring=exp(-(r-7.)*(r-7.)*2.2), fill=(1.-smoothstep(5.5,6.9,r))*0.3;
      float br=0.5+0.5*sin(dep*6.5-uTime*3.2+vn(vec2(r*0.8,dep*1.2-uTime*0.6))*6.);
      float a=(ring*1.5+fill)*mix(1.,0.35+0.65*br,smoothstep(0.1,1.6,dep))*exp(-dep*0.09)*smoothstep(0.02,0.25,dep);
      a*=smoothstep(8.,20.,vR.z)*(1.-smoothstep(380.,470.,vR.z))*uShow;
      gl_FragColor=vec4(uCol*a*2.6,1.);
    }`,{transparent:!0,depthWrite:!1,depthTest:!1,blending:F.AdditiveBlending,fog:!1,side:F.DoubleSide});return kt(h,v,"portal-mirror",3)}function E0(t,e){const f=new F.Group;f.name="squall";const i=190,u=.7071,_=(y,h)=>[Oe.x+u*(y+h),Oe.z+u*(y-h)],d={...t};{const y=[],h=(o,l,p,a,r,B)=>{const[A,n]=_(o,l);y.push([l,A,n,p,a,r,e(),B])};h(10,70,660,.62,80,-.5),h(-130,0,540,.5,95,-.4),h(150,-55,480,.5,70,-.4);for(let o=0;o<13;o++){const l=-430+860*(o+e())/13,p=Math.abs(l)/430;h(l,e.range(-95,95),e.range(90,210),e.range(.38,.62),e.range(60,120),-.25+.75*p*p+e.range(0,.2))}y.sort((o,l)=>l[0]-o[0]);const k=y.length,v=new Float32Array(k*4),M=new Float32Array(k*4);y.forEach((o,l)=>{v.set([o[1],o[2],o[3],o[4]],l*4),M.set([o[5],o[6],i+22,o[7]],l*4)});const w=new F.PlaneGeometry(2,2,6,8),c=St(d,`
      attribute vec4 iP, iQ; varying vec4 vR; varying vec2 vS;
      #include <fog_pars_vertex>
      void main(){
        float v=position.y*.5+.5, fall=1.-v;
        // the rain is carried downwind (+Z) as it falls, more the lower it gets
        vec3 c=vec3(iP.x+0.15*iQ.x*fall*fall,mix(-6.,iQ.z,v),iP.y+iQ.x*fall*(0.4+0.6*fall));
        vec3 toC=cameraPosition-c; vec3 rt=normalize(vec3(toC.z,0.,-toC.x)+vec3(1e-4,0.,0.));
        float hw=iP.z*0.5*(1.+0.2*fall);
        vec3 w=c+rt*position.x*hw;
        vR=vec4(position.x,v,position.x*hw,iP.w); vS=iQ.yw;
        vec4 mvPosition=viewMatrix*vec4(w,1.); gl_Position=projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,`
      uniform float uTime; varying vec4 vR; varying vec2 vS;
      ${Kt}
      #include <fog_pars_fragment>
      void main(){
        float a=vR.x, v=vR.y, am=vR.z, sd=vS.x*31.;
        // shafts: broad columns of heavier and lighter rain, finer streaks inside them, all sliding down
        float c1=vn(vec2(am*0.021+sd,v*0.35+uTime*0.02)), c2=vn(vec2(am*0.075+sd*3.,v*0.9+uTime*0.07)), c3=vn(vec2(am*0.24+sd*7.,v*2.4+uTime*0.3));
        float streak=c1*0.5+c2*0.32+c3*0.18;
        // a frayed edge either side, and shafts of uneven length: some reach the dunes, some hang in the air
        float edge=1.-smoothstep(0.25,1.,abs(a)+0.55*(vn(vec2(v*2.1+sd,a*1.6+sd*2.))-.5)+0.25*(c2-.5));
        float reach=vS.y+0.9*(c1-.5)+0.35*(c2-.5);
        float hang=smoothstep(reach-0.22,reach+0.3,v);
        float dens=edge*hang*(0.3+0.95*smoothstep(0.22,0.72,streak))*smoothstep(-0.02,0.1,v)*(1.-smoothstep(0.94,1.,v));
        vec3 col=mix(vec3(0.135,0.18,0.275),vec3(0.25,0.31,0.43),0.6*smoothstep(0.45,0.85,c2)*v);
        gl_FragColor=vec4(col,clamp(dens*vR.w,0.,1.));
        #include <fog_fragment>
      }`,{transparent:!0,depthWrite:!1,side:F.DoubleSide});f.add(kt(Zt(w,{iP:[v,4],iQ:[M,4]},k),c,"squall-rain",-.6))}{const y=o=>60+140*Math.exp(-(((o-70)/150)**2))+90*Math.exp(-(((o+230)/110)**2))+75*Math.exp(-(((o-310)/90)**2)),h=[],k=(o,l,p,a,r,B)=>{const[A,n]=_(o,l);h.push([l-p*.3,A,p,n,a,r,e(),B])};for(let o=0;o<26;o++)k(-450+900*(o+e())/26,e.range(-115,115),i+e.range(26,44),e.range(120,165),.42,0);for(let o=0;o<30;o++){const l=-410+820*(o+e())/30;k(l,e.range(-95,95),i+e.range(50,.55*y(l)+45),e.range(92,138),.82,1)}for(let o=0;o<36;o++){const l=-400+800*(o+e())/36,p=y(l);k(l,e.range(-70,70),i+p*e.range(.6,1),e.range(52,96)*(.75+.25*p/200),1,2)}for(let o=0;o<8;o++)k((o&1?1:-1)*e.range(440,540),e.range(-70,70),i+e.range(30,60),e.range(60,100),.5,0);h.sort((o,l)=>l[0]-o[0]);const v=h.length,M=new Float32Array(v*4),w=new Float32Array(v*4);h.forEach((o,l)=>{M.set([o[1],o[2],o[3],o[4]],l*4),w.set([o[5],o[6],o[7],0],l*4)});const c=St(d,`
      attribute vec4 iP, iQ; uniform float uTime; varying vec2 vUv; varying vec3 vQ; varying vec3 vRt; varying vec3 vUp; varying vec3 vFw;
      #include <fog_pars_vertex>
      void main(){
        vec3 c=iP.xyz; c.y+=5.*sin(uTime*0.13+iQ.y*40.)*step(0.5,iQ.z);                  // the heads heave slowly; the base lies still
        vec3 f=normalize(cameraPosition-c+vec3(0.,1e-3,0.));
        vec3 rt=normalize(vec3(f.z,0.,-f.x)+vec3(1e-4,0.,0.)), up=cross(f,rt);
        vec3 w=c+(rt*position.x+up*position.y*iQ.x)*iP.w;
        vUv=position.xy; vQ=vec3(iQ.yz,w.y); vRt=rt; vUp=up; vFw=f;
        vec4 mvPosition=viewMatrix*vec4(w,1.); gl_Position=projectionMatrix*mvPosition;
        #include <fog_vertex>
      }`,`
      uniform vec3 uSun,uSunCol,uFill; uniform float uTime; varying vec2 vUv; varying vec3 vQ; varying vec3 vRt; varying vec3 vUp; varying vec3 vFw;
      ${Kt}
      #include <fog_pars_fragment>
      void main(){
        vec2 q=vUv; float r=length(q), sd=vQ.x*37.;
        // a billowed, soft-edged ball: its rim swells and hollows, and wanders slowly
        float n1=vn(q*2.1+sd+uTime*0.012), n2=vn(q*5.3+sd*3.-uTime*0.02);
        float a=1.-smoothstep(0.4,0.96,r+0.36*(n1-.5)+0.17*(n2-.5));
        float zz=sqrt(max(1.-min(r*r,1.),0.));
        vec3 n=normalize(vRt*q.x+vUp*q.y+vFw*zz*0.9+vec3(0.,1e-4,0.));
        float hk=clamp((vQ.z-${i.toFixed(1)})/150.,0.,1.), top=smoothstep(0.04,0.5,hk);
        float lit=smoothstep(-0.3,0.7,dot(n,uSun)+0.25*(n1-.5))*top*mix(0.3,1.,step(1.5,vQ.y)+0.6*step(0.5,vQ.y)*(1.-step(1.5,vQ.y)));
        // the base and every shaded flank are slate blue, darkest underneath; the sunward heads are white
        vec3 shade=mix(vec3(0.115,0.145,0.215),vec3(0.31,0.38,0.52),top*(0.55+0.45*n.y))*(0.9+0.2*n2);
        vec3 col=mix(shade,vec3(0.80,0.79,0.77)*(uSunCol*0.92+uFill*0.2),clamp(lit,0.,1.));
        a*=smoothstep(${(i-22).toFixed(1)},${(i+26).toFixed(1)},vQ.z)*0.94;      // the flat base
        gl_FragColor=vec4(col,clamp(a,0.,1.));
        #include <fog_fragment>
      }`,{transparent:!0,depthWrite:!1,side:F.DoubleSide});f.add(kt(Zt(ge(),{iP:[M,4],iQ:[w,4]},v),c,"squall-cloud",-.5))}return f}function V0(t,e,f,i){const u=e.heightAt,_=e.anchors.waterLevel,d=e.anchors.crests[2].position,y=Math.tan(32*Math.PI/180),h=42,k=19,v=12,M=[],w=[],c=[],o=[];for(let r=0;r<=h;r++){const B=r/h*2-1,A=f+B*i;let n=d.z,s=-1e9;for(let x=d.z-16;x<d.z+100;x+=1){const m=u(A,x);m>s&&(s=m,n=x)}const S=Math.max(6,(s-_)/y+1.5);o.push([A,n+S,n,S]);for(let x=0;x<=k;x++){const m=x<=v?x/v:1+(x-v)/(k-v)*.55,T=n+.7+Math.min(m,1)*S+Math.max(0,m-1)*64;M.push(A,Math.max(u(A,T),_)+(m<=1?.1:.05),T),w.push(B,m,u(A,T)<_-.03?1:0)}}for(let r=0;r<h;r++)for(let B=0;B<k;B++){const A=r*(k+1)+B,n=A+k+1;c.push(A,n,A+1,A+1,n,n+1)}const l=new F.BufferGeometry;l.setAttribute("position",new F.Float32BufferAttribute(M,3)),l.setAttribute("aS",new F.Float32BufferAttribute(w,3)),l.setIndex(c);const p={...t,uSlab:{value:0}},a=St(p,`
    attribute vec3 aS; varying vec3 vS; varying vec3 vW;
    #include <fog_pars_vertex>
    void main(){ vS=aS; vW=position; vec4 mvPosition=viewMatrix*vec4(position,1.); gl_Position=projectionMatrix*mvPosition; gl_Position.z-=0.0005*gl_Position.w;
      #include <fog_vertex>
    }`,`
    uniform float uSlab,uTime; uniform vec3 uSand,uMint; varying vec3 vS; varying vec3 vW;
    ${ue}
    ${Kt}
    #include <fog_pars_fragment>
    void main(){
      float xn=vS.x, t=vS.y; vec2 xz=vW.xz; vec3 col; float a;
      float ex=1.-smoothstep(0.6,0.97,abs(xn)+0.16*(vn(vec2(xz.x*0.09,3.))-.5)+0.08*t);
      if(t<=1.){
        float f=uSlab*4., live=1.-smoothstep(0.86,1.,uSlab);
        float tt=t+0.17*(vn(vec2(xz.x*0.12,7.))-.5)+0.07*(vn(vec2(xz.x*0.45,2.))-.5);        // the lobed front
        float behind=(1.-smoothstep(f-0.04,f,tt))*smoothstep(0.08,0.16,t);
        // sheets of sand sliding: meandering lanes drawn out down the fall line, crossed by roll waves running down them
        float xw=xz.x+3.6*(vn(vec2(xz.x*0.05,t*2.5-uTime*0.25))-.5);
        float s1=vn(vec2(xw*0.8,t*1.3-uTime*0.9)), s2=vn(vec2(xw*2.8,t*2.6-uTime*1.9));
        float roll=0.5+0.5*sin(t*24.-uTime*5.+vn(vec2(xw*0.3,t*4.))*6.);
        float sheets=smoothstep(0.3,0.7,s1*0.58+s2*0.32+roll*0.10);
        float act=max(1.-smoothstep(0.7,3.0,f-tt),0.34);                  // the slide is a wave: behind it the face runs thin, then quiet
        col=uSand*(uFill*mix(0.5,0.94,sheets)+uSunCol*mix(0.03,0.12,sheets));        // sliding sand in the face's own shade: pale blue-white, not sunlit
        a=ex*behind*(0.22+0.56*sheets)*act*live;
        float lip=ex*(1.-smoothstep(0.,0.065,abs(tt-f+0.03)))*step(f,1.15)*live;
        col=mix(col,uSand*(uFill*1.0+uSunCol*0.42),lip); a=max(a,lip);
        // THE SCARP: the dark step the slab broke away from, a ragged crown a few metres under the brink with a clean upper
        // edge and a torn lower one, in its own deep shade, and a paler lip of loose sand still crumbling off its foot
        float sc0=0.045+0.04*vn(vec2(xz.x*0.19,1.))+0.015*vn(vec2(xz.x*0.9,5.)), sc1=sc0+0.09+0.09*vn(vec2(xz.x*0.33,4.))+0.03*vn(vec2(xz.x*1.7,2.));
        float scK=ex*smoothstep(0.,0.05,uSlab);
        float scarp=scK*smoothstep(sc0-0.007,sc0,t)*(1.-smoothstep(sc1-0.018,sc1,t));
        float crumb=scK*(1.-smoothstep(0.,0.07,abs(t-sc1-0.02)))*smoothstep(0.35,0.7,vn(vec2(xz.x*1.3,t*30.-uTime*1.5)))*live;
        col=mix(col,uSand*(uFill*1.05+uSunCol*0.3),crumb*0.8); a=max(a,crumb*0.8);
        col=mix(col,uSand*uFill*mix(vec3(0.13,0.17,0.26),vec3(0.24,0.3,0.42),smoothstep(sc0,sc1,t)),scarp); a=max(a,scarp*0.96);
      } else {
        float gr=smoothstep(0.06,0.7,uSlab), tw=(t-1.)/0.55;
        float edge=gr*1.15-0.2+0.3*(vn(vec2(xz.x*0.11,tw*3.+uTime*0.15))-.5)*gr;
        float milk=ex*(1.-smoothstep(edge-0.16,edge,tw))*smoothstep(0.,0.15,gr);
        float churn=vn(vec2(xz.x*0.5+uTime*0.3,tw*9.-uTime*0.8));
        col=mix(uMint*1.05,vec3(0.78,0.86,0.86),0.55+0.45*churn)*(uFill*0.95+uSunCol*0.24);
        a=milk*(0.75+0.2*churn)*smoothstep(0.5,0.95,vS.z);
        float wv=sin((tw-edge)*46.-uTime*5.);
        float wave=smoothstep(0.5,0.95,vS.z)*smoothstep(0.75,1.,wv)*smoothstep(edge,edge+0.06,tw)*(1.-smoothstep(edge+0.1,edge+0.55,tw))*gr*(1.-smoothstep(0.85,1.,abs(xn)))*0.5;
        if(wave>a){ col=vec3(0.9,0.95,0.97)*(uFill*0.6+uSunCol*0.7); a=wave; }
      }
      gl_FragColor=vec4(col,clamp(a,0.,1.));
      #include <fog_fragment>
    }`,{transparent:!0,depthWrite:!1,side:F.DoubleSide});return{mesh:kt(l,a,"slab-avalanche",1),uniforms:p,foot:o}}function H0(t,e,f){const i=new Float32Array(f*4),u=new Float32Array(f*4);for(let y=0;y<f;y++){const h=y%3===0;i.set([t(),t(),t(),t()],y*4),u.set([h?t.range(5,9):t.range(6,13),h?t.range(2.4,4.2):t.range(.5,1.3),t.range(15,24),h?1:0],y*4)}const _={...e,uVeil:{value:0},uSheet:{value:1},uCamW:{value:new lt}},d=St(_,`
    attribute vec4 iA, iB; uniform float uTime,uVeil; uniform vec3 uCamW; varying vec2 vUv; varying vec4 vI;
    void main(){
      const vec3 BOX=vec3(40.,17.,52.);
      vec3 f=fract(vec3(iA.x,iA.y,iA.z+uTime*iB.z/BOX.z)+uCamW/BOX*vec3(-1.,-1.,-1.));
      vec3 rel=(f-.5)*BOX; rel.z-=6.;
      rel.y+=1.2*sin(uTime*0.9+iA.w*30.+rel.z*0.12); rel.x+=1.5*sin(uTime*0.6+iA.w*17.+rel.z*0.09);
      vec3 c=uCamW+rel;
      vec3 toC=normalize(uCamW-c+vec3(1e-3,0.,0.));
      vec3 ax=normalize(vec3(0.12*sin(iA.w*40.),-0.07,1.)), sd=normalize(cross(ax,toC)+vec3(0.,1e-4,0.));
      vec3 w=c+ax*position.x*iB.x*0.5+sd*position.y*iB.y*0.5*(1.+0.6*iB.w);
      vec3 e=1.-smoothstep(vec3(0.34),vec3(0.5),abs(f-.5));
      float d=length(rel);
      vUv=position.xy; vI=vec4(uVeil*e.x*e.y*e.z*smoothstep(1.5,5.5,d),iA.w,smoothstep(-9.,11.,rel.x),iB.w);
      gl_Position=projectionMatrix*viewMatrix*vec4(w,1.);
    }`,`
    uniform vec3 uSand,uSunCol,uFill; uniform float uSheet; varying vec2 vUv; varying vec4 vI;
    ${Kt}
    void main(){
      float along=1.-vUv.x*vUv.x, across=exp(-vUv.y*vUv.y*3.2);
      float st=0.45+0.9*vn(vec2(vUv.x*2.2+vI.y*31.,vUv.y*4.5+vI.y*7.));
      float a=along*along*across*st*mix(0.72,0.42*uSheet,vI.w)*vI.x;
      vec3 col=uSand*mix(uFill*0.42+uSunCol*1.02,uFill*0.9+uSunCol*0.22,vI.z*0.75);
      gl_FragColor=vec4(col,clamp(a,0.,1.));
    }`,{transparent:!0,depthWrite:!1,fog:!1,side:F.DoubleSide});return{mesh:kt(Zt(ge(),{iA:[i,4],iB:[u,4]},f),d,"crest-veil",4),uniforms:_}}function Q0(t,e){const f=[0,-.55,0],i=[],u=40;for(let v=0;v<u;v++){const M=v/u*tt;f.push(Math.cos(M),.004,Math.sin(M)),i.push(0,1+v,1+(v+1)%u)}const _=new F.BufferGeometry;_.setAttribute("position",new F.Float32BufferAttribute(f,3)),_.setIndex(i);const d=e.sheetUniforms,y={...t,uWater:e.uniforms.uWater,uZen:d.uZen,uNight:d.uNight,uGlit:d.uGlit,uCamW:{value:new lt}},h=St(y,`
    varying vec3 vDir;
    void main(){ vDir=position; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,`
    uniform vec3 uCamW,uMint,uTurq,uTeal,uHor,uZen,uSand; uniform vec4 uNight; uniform float uTime,uWater,uGlit;
    varying vec3 vDir;
    ${ue}
    ${Kt}
    #include <fog_pars_fragment>
    void main(){
      vec3 d=normalize(vDir+vec3(0.,-1e-5,0.)); if(d.y>-0.0015) discard;
      float h=max(uCamW.y-uWater,0.25), t=h/(-d.y); vec2 xz=uCamW.xz+d.xz*t; vec3 V=-d;
      float wob=vn(xz*0.11)*5.+vn(xz*0.9)*1.3, fw=t*t/h*0.0026;                 // a pixel's footprint along the view
      vec3 body=mix(uTurq,uTeal,0.3)*1.04;
      float bedR=0.5+0.5*cos(dot(xz,vec2(-0.5,0.866))*3.1+wob);
      body=mix(body,uSand*uMint*1.7*(0.6+0.2*bedR),0.07*(1.-smoothstep(4.,30.,t)));
      float cat=smoothstep(.45,.75,vn(vec2(xz.x*0.035+3.,xz.y*0.02-uTime*0.11)));
      float amp=(0.03+0.075*cat)/(1.+t*0.01); vec2 g=vec2(0.); float q;
      q=dot(xz,vec2(0.29,0.96))*4.1-uTime*3.1+wob;       g+=vec2(0.29,0.96)*cos(q)*(1.-smoothstep(1.1,2.7,4.1*fw));
      q=dot(xz,vec2(-0.6,0.8))*7.3-uTime*4.2+wob*1.7;    g+=vec2(-0.6,0.8)*cos(q)*0.7*(1.-smoothstep(1.1,2.7,7.3*fw));
      q=dot(xz,vec2(-0.2,0.98))*1.3-uTime*1.6+wob*0.5;   g+=vec2(-0.2,0.98)*cos(q)*0.8*(1.-smoothstep(1.1,2.7,1.3*fw));
      q=dot(xz,vec2(0.12,0.99))*0.42-uTime*0.9+wob*0.3;  g+=vec2(0.12,0.99)*cos(q)*0.55*(1.-smoothstep(1.1,2.7,0.42*fw));
      vec3 n=normalize(vec3(-g.x*amp,1.,-g.y*amp));
      vec3 R=reflect(-V,n); R.y=abs(R.y)+0.015;
      vec3 sky=mix(uHor,uZen,uNight.y+(1.-uNight.y)*pow(clamp(R.y,0.,1.),0.4));
      float fr=uNight.x+(1.-uNight.x)*pow(1.-clamp(dot(V,n),0.,1.),5.);
      vec3 col=mix(body,sky,fr*uNight.z*(1.-uNight.w*smoothstep(40.,350.,t)));
      col*=1.-0.10*cat*(1.-fr);
      vec2 sl=uSun.xz/max(length(uSun.xz),1e-4); float toward=dot(d.xz/max(length(d.xz),1e-4),sl);
      float gs=mix(5.,0.35,smoothstep(8.,420.,t));
      float tk=vn(xz*gs+uTime*vec2(.9,2.3))*vn(xz*gs*1.7-uTime*vec2(1.7,.6)+5.);
      float nearK=1.-smoothstep(6.,16.,t), gn=mix(44.,11.,smoothstep(1.5,12.,t));
      vec2 gq=vec2(dot(xz,vec2(0.96,-0.29))*0.55,dot(xz,vec2(0.29,0.96))*1.5)*gn;
      float tkn=vn(gq+uTime*vec2(1.3,2.9))*vn(gq*1.7-uTime*vec2(2.1,.9)+5.);
      float tkk=mix(smoothstep(.5,.6,tk),smoothstep(.46,.56,tkn)*smoothstep(1.,4.5,t),nearK);
      float tg2=smoothstep(0.05,0.95,toward);
      col+=uSunCol*tkk*tg2*tg2*(0.3+0.7*cat)*3.*uGlit;
      #ifdef FOG_EXP2
        col=mix(col,fogColor,1.-exp(-fogDensity*fogDensity*t*t));
      #endif
      gl_FragColor=vec4(col,1.);
    }`,{depthWrite:!1,side:F.DoubleSide}),k=kt(_,h,"lagoon-underlay",-.5);return k.scale.setScalar(3e3),{mesh:k,uniforms:y}}async function $0(t,e,f,i,u,_){const d=f.heightAt,y=f.anchors.waterLevel,h=f.anchors.shadeAt,k=i.path,v=k.length,M=new lt,w=new lt,c=(l,p)=>{const a=y-d(l,p);return a>.14&&a<.4},o=(l,p)=>{const a=i.uAtZ(p)*v,r=y+.75;let B=0;for(let A=Math.max(0,a-84);A<=a-6;A+=6){k.posAtDist(A,M),k.tangentAtDist(A,w);const n=l-M.x,s=p-M.z,S=Math.hypot(n,s);if(S<12||S>80||n*w.x+s*w.z<.25*S)continue;const x=(r-M.y)/S;let m=!1;B++;for(let T=1.5;T<150;T+=T<24?1.5:5){const g=l+n/S*T,I=p+s/S*T,H=d(g,I);if(r+x*T<=Math.max(H,y)){m=H<y-.04||h(g,I)<.45;break}}if(!m)return!1}return B>0};for(let l=30,p=30;l<v-60;l+=6){if(await t.yield(),l<p)continue;k.posAtDist(l,M),k.tangentAtDist(l,w);const a=Math.hypot(w.x,w.z)||1,r=w.z/a,B=-w.x/a,A=M.x,n=M.z;let s=null;for(let x=6;x<=40&&!s;x+=3.4)for(const m of[1,-1]){const T=A+r*x*m,g=n+B*x*m;if(Math.abs(T-i.xAt(g))>5.5&&c(T,g)&&o(T,g)){s=[T,g];break}}if(!s)continue;const S=[];for(let x=0;x<90&&S.length<7;x++){const m=e.range(0,tt),T=(x?1:0)*(1+9*Math.sqrt(e())),g=s[0]+Math.cos(m)*T,I=s[1]+Math.sin(m)*T;(x&15)===15&&await t.yield(),!(!c(g,I)||Math.abs(g-i.xAt(I))<5.5||S.some(H=>Math.hypot(H[0]-g,H[1]-I)<1.3)||!o(g,I))&&(S.push([g,I]),u.push({x:g,z:I,y:Math.max(d(g,I),y-.42),go:-1,v:0,rise:0,dx:0,dz:-1,yaw:e.range(-3.1,3.1),ph:e.range(0,tt)}))}p=l+e.range(150,250)}}var X0={id:"thousand-lagoons",name:"The Thousand Lagoons",category:"wilderness",weirdness:.05,media:["air","water"],async build(t){const e=t.rng,f=t.quality?.detail??1,i=t.vary||{},u=e.fork("tl-look"),_=u(),d=u(),y=u(),h=u(),k=i.hour==="night"?"moon":i.hour==="day"?"noon":i.hour==="golden"||i.hour==="dawn"||_<.42?"afternoon":_<.62?"noon":_<.82?"squall":"moon",v=d<.5?"july":d<.75?"june":"september",M=y<.34&&k!=="moon",w=h>.6,c=Gt(i.density??1,.7,1.3),o=!!i.rare,l=w0[k],p=k==="moon",a=new F.Scene,r=new F.Color(l.fog),B=new F.Color(l.veil),A=l.dens*(v==="september"?1.1:1);a.fog=new F.FogExp2(r.clone(),A);const n=await x0(t,{hour:k,season:v,waterBias:v==="july"?.4:v==="june"?.25:.72,plumeStrength:1.2,birdMinPx:13,birds:Math.round(Gt(200*c*(v==="september"?.8:1),120,260)),autoplay:!1});a.add(n.object);const s=n.uniforms,S=n.sheetUniforms,x={value:0},m={uSun:s.uSun,uSunCol:s.uSunCol,uFill:s.uFill,uSand:s.uSand,uTime:x,uMint:S.uMint,uTurq:S.uTurq,uTeal:S.uTeal,uHor:S.uHor},T=n.anchors,g=T.waterLevel,I=n.heightAt,H=T.sunDir,X=T.crests,Q=T.grove,dt=Math.hypot(H.x,H.z)||1,ct={x:H.x/dt,z:H.z/dt,t:Math.max(.12,H.y/dt)};await t.yield();const et={rng:e,renderer:t.renderer,ground:l.fog,...l.sky},Y=Math.asin(Gt(H.y,-1,1))*180/Math.PI,ht=Math.atan2(H.x,-H.z)*180/Math.PI;p?(et.bake=!0,et.bodyOverrides={0:{elevation:Y,azimuth:ht,size:2.3}}):(et.sunElevation=Y,et.sunAzimuth=ht);const Z=h0(et);a.add(Z.object),await t.yield();const E=p0(Z,{bounce:.4,follow:!1});a.add(E.object),await t.yield();const K=m0({rng:e,sky:Z,count:l.clouds,altitude:340,altitudeJitter:50,size:l.cloudSize,height:.42,puffs:22,center:[0,0,-600],extent:[4200,3600],wind:[-2.4,0,8.6]});a.add(K.object),await t.yield();const C=await M0(t,n,-e.range(8,13)),V=C.path,gt=C.uAtZ,L=C.zB.map(gt);await t.yield(),a.add(await P0(t,e.fork("rings"),m,n,f)),await t.yield();const bt=await D0(t,e.fork("sedge"),m,n,C,Math.round((v==="june"?4600:v==="september"?2600:3600)*f*(.8+.2*c)));a.add(bt.mesh),await t.yield();for(let P=0;P<6;P++)e.range(-1.5,1.5);const ee=await R0(t,e.fork("fish"),m,n,V,Math.round(3e3*f));a.add(ee.mesh),await t.yield();const xt=[],ut=[],mt=e.fork("palms"),Tt=(P,q,G)=>!xt.some(z=>(z.x-P)*(z.x-P)+(z.z-q)*(z.z-q)<G*G),Ut=[];await $0(t,ke("tl-flats:"+t.seed),n,C,Ut,ut),await t.yield();for(let P=0;P<500&&xt.length<57;P++){const q=mt.range(0,tt),G=Math.sqrt(mt())*1.2,z=Q.x+Math.cos(q)*62*G,j=Q.z+Math.sin(q)*44*G,$=I(z,j);$<g-3.3||$>g+1.2||!Tt(z,j,4.6)||z-C.xAt(j)<17||xt.push({x:z,y:$-.3,z:j,s:mt.range(.93,1.2),g:Math.max($,g)})}for(let P=0;P<400&&xt.length<63;P++){const q=mt.range(Q.z-70,Q.z+60),G=C.xAt(q)+mt.range(16,120),z=I(G,q);z<g-.9||z>g+1.6||!Tt(G,q,9)||xt.push({x:G,y:z-.3,z:q,s:mt.range(.9,1.2),g:Math.max(z,g)})}for(const P of xt){const q=Math.min(78,20*P.s/ct.t),G=P.x-ct.x*q,z=P.z-ct.z*q;ut.push({a:[P.x,P.g,P.z],b:[G,Math.max(I(G,z),g),z],w:4.4*P.s,kind:0,k:p?.4:.5})}for(const P of xt)P.d=Math.abs(P.x-C.xAt(P.z));xt.sort((P,q)=>P.d-q.d);const Et=Math.min(xt.length,24),Lt=L0(m);await t.yield();const Vt=Je(mt,!0);await t.yield();const Ht=Je(mt,!1);await t.yield(),a.add(t0(mt,Lt,Vt,xt.slice(0,Et),"buriti-palms")),a.add(t0(mt,Lt,Ht,xt.slice(Et),"buriti-palms-far"));const ot=N0(m,n,xt);a.add(ot.mesh),await t.yield(),a.add(K0(e.fork("trunks"),m,n,C,X[1].position.z,ut,ct)),a.add(G0(m,ut)),await t.yield();const Ct=W0(m,new F.Color("#E8402A"));a.add(Ct.group);const Ot=q0(m);a.add(Ot.group),await t.yield();const Yt=I0(ke("tl-streamers:"+t.seed),m,n);a.add(Yt.mesh),await t.yield();const Wt=U0(m,g,l.portal);a.add(Wt);const Nt=k==="squall"?E0(m,ke("tl-squall:"+t.seed)):null;Nt&&a.add(Nt);const Xt=o?V0(m,n,-112,92):null;Xt&&a.add(Xt.mesh);const b=s.uPlume.value;await t.yield();const W=d0.makeParticles({rng:e.fork("dust"),preset:"dust",time:x,count:Math.round(1500*f*(v==="september"?1.5:1)),box:[44,14,60],velocity:[.5,-.1,10],velocityRandom:[1,.4,3],turbulence:[.8,.4,.6],colors:["#ffffff","#e6eef6","#f7f3ea"],size:[.015,.045],intensity:p?.12:1.05,additive:.35,opacity:.6,twinkle:.7});a.add(W.object),await t.yield();const R=Q0(m,n);a.add(R.mesh);const D=H0(e.fork("veil"),m,Math.round(150*(.6+.4*f)));a.add(D.mesh),await t.yield();const pt=e.fork("terns"),at=[],zt=T.lagoons,Ft=new lt,qt=new lt,ne=(P,q,G=5.5,z=3.4,j=1.1)=>{const $=V.pointAt(P,Ft),nt=V.tangentAt(P,qt),yt=Math.hypot(nt.x,nt.z)||1,wt=nt.x/yt,rt=nt.z/yt;for(let Rt=0;Rt<10&&g-I($.x+wt*G-rt*q*z,$.z+rt*G+wt*q*z)<.33;Rt++)G+=1.5;return{x:$.x+wt*G-rt*q*z,z:$.z+rt*G+wt*q*z,h0:Math.max(3.2,$.y-g-1.3),P:8,ph:pt.range(0,tt),uImp:P,sz:j}};at.push(ne(gt(C.skims[0][1]+3),-1),ne(gt(zt[1].position.z+12),-1),ne(gt(-226),1));{const P=ke("tl-grove-terns:"+t.seed),q={x:Q.x-44,z:Q.z,h0:6.5,P:8,ph:P.range(0,tt),uImp:-1,sz:1.3};for(let G=0;G<14&&g-I(q.x,q.z)<.8;G++)q.x+=2;at.push(q);for(let G=0;G<40&&at.length<8;G++){const z=P.range(0,tt),j=Math.sqrt(P())*.62,$=Q.x+Math.cos(z)*60*j,nt=Q.z+Math.sin(z)*42*j,yt=P.range(5,9),wt=P.range(6,9.5),rt=P.range(0,tt);g-I($,nt)>.8&&at.push({x:$,z:nt,h0:yt,P:wt,ph:rt,uImp:-1,sz:1.2})}}const ye=at.length+(M?0:Math.round(Gt(22*c,12,28))-3);for(let P=0;P<400&&at.length<ye;P++){const q=zt[pt.int(0,zt.length-1)],G=q.position.x+pt.range(-.3,.3)*q.radii[0],z=q.position.z+pt.range(-.6,.6)*q.radii[1];g-I(G,z)<.3||Math.abs(G-C.xAt(z))<7||at.push({x:G,z,h0:pt.range(4,9),P:pt.range(7,12),ph:pt.range(0,tt),uImp:-1,sz:1.1})}const pe=Le(De.tern(),at.length,m,"terns");a.add(pe.mesh);const ve=at.length*2,Jt=C0(ve+43,m);a.add(Jt.mesh),await t.yield();const _t=e.fork("waders"),It=[],we=(P,q,G)=>{const z=G>q?.5:-.5;for(let j=q;(G-j)*z>0;j+=z){const $=g-I(P,j);if($>.14&&$<.4)return j}return null},fe=(P,q)=>Math.max(I(P,q),g-.42),ze=(P,q,G,z,j,$,nt,yt=_t.range(0,tt))=>{const wt=Math.hypot(z,j);It.push({x:P,z:q,y:fe(P,q),go:G,v:$,rise:nt,dx:z/wt,dz:j/wt,yaw:Math.atan2(-z,-j),ph:yt})},se=.84;{const P=V.length,q=L[1]*P,G=[_t.range(0,tt),_t.range(0,tt)];let z=null;for(let j=L[0]*P+20;j<q&&!z;j+=1){V.posAtDist(j,Ft),V.tangentAtDist(j,qt);const $=Math.hypot(qt.x,qt.z)||1,nt=qt.x/$,yt=qt.z/$;for(const wt of[9,10.5,7.5,12]){const rt=Ft.x-yt*wt,Rt=Ft.z+nt*wt,$t=g-I(rt,Rt);if($t>.14&&$t<.4&&g-I(rt+nt*9,Rt+yt*9)>.45){z={d:j,x:rt,z:Rt};break}}}if(z){V.tangentAtDist(Math.min(P,z.d+28),qt);const j=Math.hypot(qt.x,qt.z)||1,$=Math.cos(.14),nt=Math.sin(.14),yt=(qt.x*$+qt.z*nt)/j,wt=(qt.z*$-qt.x*nt)/j;for(let rt=0;rt<2;rt++){let Rt=z.x-wt*rt*2.6+yt*rt*1.2,$t=z.z+yt*rt*2.6+wt*rt*1.2;for(let me=0;me<8&&!(g-I(Rt,$t)>.1&&g-I(Rt,$t)<.45);me++)Rt+=wt*.6,$t-=yt*.6;ze(Rt,$t,(z.d-60+rt*4)/P,yt,wt,11.5,(g+1.1+rt*.45-fe(Rt,$t)-.55)/.8,G[rt])}}}for(let P=0;P<6;P++){const q=9-P*2.2,G=we(q,-160,-225)??-190;ze(q,G+P%2*1.2,se-(2.6-P*.13)/Pe,-.8,-.6,7,9.4-P*.4)}const de=Math.round(14*c);for(let P=0,q=0;P<300&&q<de;P++){const G=zt[_t.int(0,zt.length-1)],z=C.xAt(G.position.z)+_t.sign()*_t.range(11,50)+(G===zt[4]?Q.x-C.xAt(G.position.z):0),j=we(z,G.position.z+G.radii[1]+14,G.position.z);j===null||It.some($=>($.x-z)*($.x-z)+($.z-j)*($.z-j)<12)||(It.push({x:z,z:j-.3,y:fe(z,j-.3),go:-1,v:0,rise:0,dx:0,dz:-1,yaw:_t.range(-1.1,1.1),ph:_t.range(0,tt)}),q++)}for(const[P,q]of[[-249,596],[-257,570],[-314,585]]){const G=we(P,q+9,q-9);G!==null&&It.push({x:P,z:G,y:fe(P,G),go:-1,v:0,rise:0,dx:0,dz:-1,yaw:_t.range(-1.1,1.1),ph:_t.range(0,tt)})}for(let P=0,q=0;P<80&&q<8;P++){const G=Math.PI+_t.range(-1.25,1.25),z=Math.cos(G),j=Math.sin(G);let $=null;for(let nt=1.2;nt>.3;nt-=.01){const yt=Q.x+z*60*nt,wt=Q.z+j*42*nt,rt=g-I(yt,wt);if(rt>.2&&rt<.5){$=[yt,wt];break}if(rt>.5)break}!$||Math.abs($[0]-C.xAt($[1]))<6||It.some(nt=>(nt.x-$[0])*(nt.x-$[0])+(nt.z-$[1])*(nt.z-$[1])<9)||(It.push({x:$[0],z:$[1],y:fe($[0],$[1]),go:-1,v:0,rise:0,dx:0,dz:-1,yaw:_t.range(-1.6,.4),ph:_t.range(0,tt),fast:1}),q++)}for(const P of Ut)It.some(q=>(q.x-P.x)*(q.x-P.x)+(q.z-P.z)*(q.z-P.z)<2.2)||It.push(P);const ie=Le(De.wader(w),Math.max(1,It.length),m,"waders");a.add(ie.mesh),It.length||ie.set(0,0,-50,0,0,0,0,0,0,0);const xe=M?Math.round(Gt(30*c,20,38)):0,re=xe?Le(De.ibis(),xe,m,"ibis"):null,he=L[2]+.03,be=V.pointAt(he).add(new lt(4,5,-30)),ft=new lt(.8,0,-.6);re&&a.add(re.mesh),await t.yield();const J=L[2]-.235,it=L[2],N=te,At=new lt,Qt=new lt,oe=new lt,e0=k0(V,L,g);await t.yield(),await Z.prewarm(t.renderer,null,a);function o0(P,q,G,z){x.value=q,V.pointAt(z,At),V.tangentAt(z,Qt);const j=G.matrixWorld.elements,$=j[12],nt=j[13],yt=j[14],wt=z<.003?Math.max(0,yt-At.z):0,rt=At.y-g,Rt=Gt(rt,0,45);V.pointAt(Math.min(1,z+.02),oe);let $t=oe.x-At.x,me=oe.z-At.z;const Te=Math.hypot($t,me);Te>.001?($t/=Te,me/=Te):($t=0,me=-1),n.setHeading($t,me);const a0=Math.min(rt*2.6,105)*N(3,9,rt)*N(.02,.04,z)*(1-N(L[2]-.05,L[2]+.01,z)),n0=(22+26*(1-N(L[2]+.02,L[2]+.1,z)))*N(L[2]-.06,L[2]-.005,z)*(1-N(.8,.87,z)),Fe=N(.5,10,wt),s0=Math.max(a0,n0)+32*(1-N(0,.03,z)),Ne=Math.max(Fe,1-N(.012,.03,z)),i0=N(L[2]+.01,L[2]+.09,z)*(1-N(.77,.85,z));n.setLine(At.z,At.x,s0,i0),n.setWake(st(7.5+Rt*.75,18,Fe),1+Math.max(0,Rt-6)*.08,Ne),n.setTilt(.65*Ne);const Me=N(L[2]-.145,L[2]-.105,z)*(1-N(L[2]-.05,L[2]-.012,z));n.setBirdMinPx(st(13+23*(1-N(.008,.035,z))+7*N(.86,.92,z)+11*Me,54,Fe),st(6,9,Fe)),R.mesh.position.set($,nt,yt),R.uniforms.uCamW.value.set($,nt,yt),R.mesh.scale.setScalar(wt>.5?3e3:.001);const r0=Math.hypot(Qt.x,Qt.z)||1,Ge=Gt(-Qt.y/r0,-.75,.75),_e=N(L[2]-.014,L[2]+.012,z)*(1-N(.79,.855,z)),l0=Math.max(N(2.6,7,rt)*N(.02,.04,z)*(1-N(.79,.855,z)),_e);n.setSkein(Me);const c0=N(.05,.3,g-I(At.x,At.z));n.setNear(c0*(1-N(1.6,3.2,rt))*N(.002,.008,z));const u0=N(L[2]-.235,L[2]-.2,z)*(1-N(L[2]-.145,L[2]-.105,z));V.tangentAtDist(Math.min(V.length,z*V.length+24),oe),n.setEscort(u0,.1,Gt((Qt.z*oe.x-Qt.x*oe.z)*1.6,-.5,.5)),n.setFlock(z>0?nt:g+1.5,l0,st(st(Ge,Math.max(Ge,.25),_e),.52,Me),st(st(z>0?5:4,17,_e),17,Me),_e*N(.08,.2,-Qt.y)*(1-Me)),n.setPeel(.6*N(L[2]+.04,.84,z));{const vt=N(L[2]-.13,L[2]-.09,z)*(1-N(.84,.89,z)),U=N(L[2]-.235,L[2]-.2,z)*(1-N(L[2]-.16,L[2]-.12,z));n.setPlume(b*(1+.15*vt-.5*U),st(.75,1.3,vt))}let le=0;for(const vt of L)le=Math.max(le,N(vt-.034,vt-.018,z)*(1-N(vt-.006,vt+.012,z)));le*=1-N(4,9,At.y-I(At.x,At.z)),a.fog.density=A+le*.002*Math.min(1.3,b+.3),a.fog.color.copy(r).lerp(B,le*.4);const Ke=N(L[2]-.235,L[2]-.2,z)*(1-N(L[2]-.17,L[2]-.135,z));le=Math.max(le,.4*Ke),D.uniforms.uSheet.value=1-Ke,D.uniforms.uVeil.value=le*Math.min(1.25,.55+.6*b),D.uniforms.uCamW.value.set($,nt,yt),ot.uniforms.uCamW.value.set($,nt,yt),n.update(P,q,G),Z.update(P,q,G),E.update(P,q,G),K.update(P,q,G),W.update(P,q,G),Wt.material.uniforms.uShow.value=N(L[2]-.004,L[2]+.02,z);const Ae=N(.05,.3,g-I(At.x,At.z))*(1-N(.72,1.15,At.y-g)),Ue=G.projectionMatrix.elements,v0=Math.max(.05,Ue[0]),Ee=Math.max(.2,Ue[5]),Ve=.035+.663*Ae,Ce=-(.93/Ee+.012)-.246*Math.sin(Ve),We=-(1+.246*Math.cos(Ve)),qe=st(.6,Gt((nt-g+.02)/Math.max(.15,-(j[5]*Ce+j[9]*We)),.45,2.4),Ae);Ct.uniforms.uP.value.set(v0,Ee,qe),Ct.uniforms.uCamM.value.copy(G.matrixWorld),Ct.uniforms.uSkim.value=Ae,Ct.uniforms.uBeat.value.set(q*23.5%tt,st(1,.82,Ae),N(.1,.22,-Qt.y)),Ct.group.visible=z>0,Ot.uniforms.uCut.value=Ae,Ot.group.position.set($+(j[4]*Ce+j[8]*We)*qe,g+.04,yt+(j[6]*Ce+j[10]*We)*qe),Ot.group.rotation.y=Math.atan2(-j[8],-j[10])+Math.PI,Ot.group.visible=z>0,ee.uniforms.uBill.value.set(At.x+Qt.x*2,g,At.z+Qt.z*2);for(let vt=0;vt<at.length;vt++){const U=at[vt];let O;if(U.uImp>=0){const Bt=U.uImp-.014;O=z<Bt?.3:z<U.uImp?.62+.1*(z-Bt)/.014:.72+(z-U.uImp)*Pe/U.P,O>=1&&(O=.3)}else O=(q/U.P+U.ph)%1;const Pt=q*.9+U.ph;let Dt=U.x+Math.sin(Pt*.8)*.5,jt=U.z+Math.cos(Pt*.6)*.4,Se=U.h0+Math.sin(Pt*1.4)*.3,Ie=.32,Qe=0,Re=.5,$e=U.uImp>=0?1.8:1.5;if(O>=.62&&O<.72){const Bt=(O-.62)/.1;Dt=st(Dt,U.x,Bt),jt=st(jt,U.z,Bt),Se=st(Se,.1,Bt*Bt),Ie=st(.32,-1.3,N(0,.35,Bt)),Qe=.75*N(.1,.5,Bt),Re=.5*(1-Bt)}else if(O>=.72&&O<.75)$e=0;else if(O>=.75){const Bt=(O-.75)/.25;Dt=st(U.x,Dt,Bt),jt=st(U.z-1.5*Math.sin(Bt*Math.PI),jt,Bt),Se=st(.1,Se,N(0,1,Bt)),Ie=st(.75,.32,Bt),Re=st(.85,.5,Bt)}pe.set(vt,Dt,g+Se,jt,.25*Math.sin(Pt*.5),1,q*tt*5.6+U.ph*7,Re,Ie,$e,.12*Math.sin(Pt),Qe,.22);const je=O>=.72?(O-.72)*U.P:-1,Ze=U.sz||1.1;Jt.set(vt*2,U.x,g,U.z,je,Ze,0,vt),Jt.set(vt*2+1,U.x,g,U.z,je,Ze*.82,1,vt)}pe.commit();const He=w?1.45:1.25;for(let vt=0;vt<It.length;vt++){const U=It[vt],O=U.go>=0?(z-U.go)*Pe:-9;if(O<0){const Pt=N(-.5,0,O),Dt=U.go<0?Math.pow(Math.max(Math.sin(q*(U.fast?1.1:.55)+U.ph),0),14):0;ie.set(vt,U.x,U.y-.1*Pt,U.z,U.yaw,0,0,0,-.5*Dt-.22*Pt+.03*Math.sin(q*.8+U.ph),He,0,0,.1)}else{const Pt=N(0,.45,O),Dt=O<1.2?U.v/2.4*O*O:U.v*(O-.6),jt=.55*Pt+U.rise*(1-Math.exp(-O*.5));ie.set(vt,U.x+U.dx*Dt,U.y+jt,U.z+U.dz*Dt,U.yaw,Pt,O*tt*(3.1-.5*N(0,3,O))+1.2,st(1,.72,N(0,3,O)),.45*Math.exp(-O*.8)+.06,He,0,0,.12)}}if(ie.commit(),re){const vt=(z-he)*Pe*13+Math.sin(q*.3)*2,U=Math.atan2(-ft.x,-ft.z);for(let O=0;O<xe;O++){const Pt=O+1>>1,Dt=(O&1?1:-1)*Pt*2.3+Math.sin(q*.7+O)*.3,jt=vt-Pt*2.1+Math.sin(q*.5+O*2.1)*.4;re.set(O,be.x+ft.x*jt-ft.z*Dt,be.y+Pt*.16+Math.sin(q*.9+O*1.3)*.35,be.z+ft.z*jt+ft.x*Dt,U,1,q*tt*2.9-Pt*.5,.62,.05,2.1,0,0,.12)}re.commit()}if(Xt){const vt=Gt((z-J)/(it-J),0,1);Xt.uniforms.uSlab.value=vt;for(let U=0;U<43;U++){const O=Xt.foot[U],Pt=Math.min(1,vt*4),Dt=vt>.01&&vt<.8&&Math.abs(U-21)<19?(q/2.6+U*.371)%1*2.6:-1,jt=Pt<1?O[2]+.7+Pt*O[3]:O[1]-1.5+U%4*1.3;Jt.set(ve+U,O[0],Math.max(I(O[0],jt),g)+.3,jt,Dt,1.1+U%3*.45,2,U)}}Jt.commit()}return{scene:a,path:V,duration:Pe,pace:P=>1+.1*N(.05,.09,P)*(1-N(.15,.2,P))-.2*N(L[2]-.13,L[2]-.09,P)*(1-N(.82,.88,P))-.14*N(L[2]-.12,L[2]-.085,P)*(1-N(L[2]-.04,L[2],P)),camera:{fov:62,near:.3,nearThrough:.3,far:4200,lookAhead:24,sway:.8,bank:.55},pois:e0,portal:{shape:"arch",width:14,height:7,color:l.portal,glow:1,revealDistance:420},post:{exposure:l.exposure,bloom:{strength:l.bloom,radius:.6,threshold:p?.93:1.04},grade:{saturation:l.sat,contrast:l.contrast,tint:"#ffffff",shadowTint:"#000000",vignette:.24,grain:.018,aberration:0}},ride:"none",update:o0,dispose(){n.dispose(),Z.dispose()}}}};export{X0 as default};
