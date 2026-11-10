import*as h from"three";import{HALL as c,HEARTH as U,EXIT as I}from"./hall-roofed-with-weather-plan.js";const se=Math.PI*2,$=c.cloudBase,O=6.5,ue=$-O,m={flat:11,half:24,rear0:I.z+11,rear1:I.z+19,bank:I.z+12,dome:5.5},Q=e=>({run:e.length,z0:I.z-12-e.length,lift:I.y+e.ring+6-$}),G=.9,_=5.5,Y=Math.floor((c.x1-c.x0-13)/_),D={x0:c.x0+7-_/2,span:(Y+1)*_};async function ee(e,l){const a=new Uint8Array(65536),d=n=>{const o=new Float32Array(n*n);for(let x=0;x<o.length;x++)o[x]=l();return o},p=async(n,o)=>{const x=new Float32Array(16384);let z=1,M=0;for(let L=0;L<n;L++){const q=o<<L,A=d(q),S=q/128;for(let k=0;k<128;k++)for(let y=0;y<128;y++){const N=y*S,b=k*S,T=Math.floor(N),F=Math.floor(b),W=N-T,C=b-F,B=W*W*(3-2*W),E=C*C*(3-2*C),j=(T+1)%q,K=(F+1)%q,V=A[F*q+T],R=A[F*q+j],X=A[K*q+T],J=A[K*q+j];x[k*128+y]+=z*(V+(R-V)*B+(X-V)*E+(V-R-X+J)*B*E)}M+=z,z*=.5,await e.yield()}for(let L=0;L<x.length;L++)x[L]/=M;return x},v=await p(4,4),i=await p(4,4),s=await p(4,8),t=6,u=new Float32Array(t*t),w=new Float32Array(t*t);for(let n=0;n<t*t;n++)u[n]=(n%t+.15+.7*l())/t,w[n]=(Math.floor(n/t)+.15+.7*l())/t;for(let n=0;n<128;n++)for(let o=0;o<128;o++){o===0&&(n&31)===0&&await e.yield();const x=(o+.5)/128,z=(n+.5)/128,M=Math.floor(x*t),L=Math.floor(z*t);let q=9,A=9;for(let y=-1;y<=1;y++)for(let N=-1;N<=1;N++){const b=(M+N+t)%t,T=(L+y+t)%t;let F=u[T*t+b]-x,W=w[T*t+b]-z;F-=Math.round(F),W-=Math.round(W);const C=Math.hypot(F,W);C<q?(A=q,q=C):C<A&&(A=C)}const S=(n*128+o)*4,k=y=>Math.max(0,Math.min(255,Math.round(((y-.5)*1.9+.5)*255)));a[S]=k(v[n*128+o]),a[S+1]=k(i[n*128+o]),a[S+2]=Math.min(255,Math.round((A-q)*t*255*1.15)),a[S+3]=k(s[n*128+o])}const f=new h.DataTexture(a,128,128,h.RGBAFormat,h.UnsignedByteType);return f.wrapS=f.wrapT=h.RepeatWrapping,f.magFilter=h.LinearFilter,f.minFilter=h.LinearMipmapLinearFilter,f.generateMipmaps=!0,f.colorSpace=h.NoColorSpace,f.needsUpdate=!0,f}const r=e=>Number.isInteger(e)?e+".":String(e),H=`
uniform sampler2D tN; uniform float uTime, uMargin; uniform vec2 uBand; uniform vec3 uVault;      // uVault: the hollow's z0, 1 / its run, its lift; uMargin: how broad the torn margins are (0 .. 1)
#define TN(p) textureLod(tN, p, 0.)
vec3 nrm(vec3 v){ return v*inversesqrt(dot(v,v)+1e-8); }
float stormAtX(float x){ float a=clamp((uBand.x-x)/10.,0.,1.), b=clamp((x-uBand.y)/10.,0.,1.), s=min(a,b); return s*s*(3.-2.*s); }
float wallDist(vec2 q){ return min(min(q.x-(${r(c.x0)}),(${r(c.x1)})-q.x),min(q.y-(${r(c.zHigh)}),(${r(c.zLow)})-q.y)); }
// how far the base is lifted into the hollow at a place (0 .. about 28 m). wall: how much of one of its two side
// walls (x), of the bank behind the ring (y), the place is.
float vaultAt(vec2 q, vec4 w, out vec2 wall){
  float t=clamp((q.y-uVault.x)*uVault.y,0.,1.), ramp=t*t*(3.-2.*t);
  float tx=abs(q.x+(w.r-.5)*3.2), ax=clamp((tx-${r(m.flat)})/${r(m.half-m.flat)},0.,1.), prof=1.-ax*ax*(3.-2.*ax);     // a flat crown between two steep soft walls
  float bank=1.+.17*exp(-(q.y-(${r(m.bank)}))*(q.y-(${r(m.bank)}))/9.);                                         // the rolled bank behind the ring
  // (the end wall does not stand on a straight line: along x its place wanders up to 4.5 m toward the ring, by a noise that stands)
  float r=clamp((q.y+4.5*textureLod(tN,vec2(q.x/47.+.23,.61),1.5).g-(${r(m.rear0)}))/${r(m.rear1-m.rear0)},0.,1.), rear=1.-r*r*(3.-2.*r);
  vec2 h=q-vec2(${r(U.x)},${r(U.z)});
  wall=vec2(4.*prof*(1.-prof)*ramp*rear,4.*rear*(1.-rear)*prof);
  // (a side wall and the end wall meet in a round corner: one profile, by how far out a place is across both)
  float c=min(1.,sqrt(ax*ax+r*r)), both=1.-c*c*(3.-2.*c);
  return (uVault.z*ramp*(.94+.2*w.a)+${r(m.dome)}*exp(-dot(h,h)/60.))*both*bank;
}
// how whole the sheet is at a place (1 whole .. 0 a hole) behind the storm: the tear, ragged, widening from the
// middle of the room; never along the walls and never over the hollow (it closes over the last metres before the
// hollow begins, uVault.x: as many as the hollow's flat crown is wide to a side). edge: 1 on the thinning margin,
// which is broader by uMargin.
float cloudWhole(vec2 q, out float edge, out float soft){
  vec2 d=q-vec2(uTime*${r(G)},0.);
  float behind=clamp((uBand.y-q.x)/24.,0.,1.);
  float mid=smoothstep(9.,18.,wallDist(q))*(1.-smoothstep(uVault.x-${r(m.flat)},uVault.x,q.y));
  float open=min(behind*mid,.96);
  float tn=textureLod(tN,d/83.+vec2(.11,.3),.5).a*.6+textureLod(tN,d/31.,2.).r*.4;
  float fine=(TN(d/9.1).a-.5)*.17+(TN(d/4.3).g-.5)*.06;
  float a=smoothstep(open*1.5-.5,open*1.5-.04,tn+fine);
  soft=smoothstep(open*1.5-.62,open*1.5+.1,tn);
  edge=mix(a*(1.-a),soft*(1.-soft),uMargin)*4.;
  return a;
}
// the y of the cloud's skin at a place of the plan.
// info: x 0 in a fold .. 1 on a pad's or a pouch's belly; y the storm (0..1); z the shelf's lip; w the rim along the walls
float cloudY(vec2 q, out vec4 info, out float whole, out float edge){
  vec2 d=q-vec2(uTime*${r(G)},0.);
  // (each noise is read no finer than the sheet's own mesh can carry, so the skin has no creases; the fine detail is in its shading)
  vec4 w=textureLod(tN,d/97.+vec2(.13,.71),.6), v=textureLod(tN,d/41.+(w.rg-.5)*.25,1.8), m=textureLod(tN,d/17.+vec2(.37,.05),3.);
  float pad=smoothstep(.2,.8,v.r*.62+w.a*.38);
  float pouch=smoothstep(.28,.8,m.g*.7+v.a*.3);
  float s=stormAtX(q.x);
  float lx=(q.x-(uBand.x-4.5))/4.6, lip=exp(-lx*lx)*(.7+.6*TN(vec2(q.y/67.,uTime*.003+.5)).r);
  float rim=1.-smoothstep(0.,11.,wallDist(q)); rim*=rim;
  float calm=.4+2.8*pad*(.6+.8*w.r)+.8*(m.a-.5)*pad;
  float storm=2.6+2.5*pouch+w.a;
  // inside the hollow the skin is its own billows. On its walls they are laid in the wall's own plane: along the
  // wall, and up it by its height and its run together (so they are not drawn out where a wall leans back into the
  // crown or out into the base): about as round there as under the flat base.
  // (its lift swells by up to a sixth with the pads' middle noise, and never sinks by it: its crown is no level
  // ceiling, and stands nowhere lower over the ring than its own law puts it)
  vec2 wall; float vl=vaultAt(q,vec4(w.r,0.,0.,w.a+1.3*max(v.g-.35,0.)),wall), inV=clamp(vl/6.,0.,1.), up=vl*1.1;
  // (read broad enough that the sheet's cells carry them up a wall's steepest part)
  float mw=mix(textureLod(tN,vec2(q.y,up-.8*abs(q.x))/29.+vec2(.37,.05),3.).g,textureLod(tN,vec2(q.x,up-.8*q.y)/29.+vec2(.11,.6),3.).g,wall.y/(wall.x+wall.y+1e-3));
  float onWall=smoothstep(0.,.75,max(wall.x,wall.y)), bil=smoothstep(.25,.75,mix(m.g*.6+v.a*.4,mw*.8+v.a*.2,onWall));
  // (a billow hangs 3.4 m under the hollow's crown; on a wall it stands a third as far out, so that none hangs before
  // another there as a pendant with a cut outline: a wall's billows are in its shading)
  float drop=(mix(calm,storm,s)+3.4*lip)*(1.-.75*inV)+3.4*bil*inV*(1.-.65*onWall)+2.6*rim*(.6+.8*w.g);
  float even=1.-smoothstep(0.,6.5,wallDist(q)); drop=mix(drop,3.,even);          // it meets the stone at one even height
  // the skin's floor (CLOUD_LOW): never more than ${r(O)} under the base; the limit comes on softly over its last metre and a half
  float lim=max(1.5-abs(drop-${r(O)}),0.)/1.5; drop=min(drop,${r(O)})-lim*lim*.375;
  float soft; whole=cloudWhole(q,edge,soft);
  float torn=1.-soft;
  info=vec4(mix(mix(mix(pad,pouch,s),bil,inV),.75,even),s,lip,rim);
  return ${r($)}-drop+vl+4.5*torn*torn;
}
`,P=`
uniform vec4 uGlow[12]; uniform vec4 uFire, uFlash[3]; uniform vec3 uAmber, uSlate, uBolt, uSilver, uFogCol; uniform float uFogDen;
// n: the skin's normal (mostly facing down). The candles' gold falls off fast: it stays on what hangs nearest them.
vec3 cloudLight(vec3 p, vec3 n){
  vec3 sum=vec3(0.);
  for(int i=0;i<12;i++){ vec3 dv=uGlow[i].xyz-p; float d2=dot(dv,dv), x=d2/110., k=uGlow[i].w/(1.+x*x), nd=clamp(dot(n,dv)*inversesqrt(d2+1e-3)*.6+.5,0.,1.); sum+=uAmber*(k*nd); }
  { vec3 dv=uFire.xyz-p; float d2=dot(dv,dv), inv=inversesqrt(d2+1e-3), up=clamp((-dv.y*inv-.78)/.2,0.,1.);
    float k=uFire.w*(1./(1.+d2/500.)+1.7*up*up/(1.+d2/3200.)), nd=clamp(dot(n,dv)*inv*.6+.5,0.,1.); sum+=vec3(1.,.44,.13)*(k*nd); }
  return sum;
}
// the hollow's own light: the fire's glow goes up into it with the smoke. Orange on its skin from its mouth to its
// crown, strongest over the hearth and less along the vault toward its closed end (the hollow is closed above: no
// other light comes into it)
vec3 hollowLight(vec3 p){
  float m=smoothstep(0.,4.,p.y-${r($)})*smoothstep(uVault.x-2.,uVault.x+20.,p.z)*(1.-smoothstep(${r(m.half-3)},${r(m.half+2)},abs(p.x)));
  vec3 dv=p-uFire.xyz; float d2=dot(dv,dv);
  return m*vec3(1.,.44,.13)*(uFire.w*(.1+.3/(1.+d2/2600.)));
}
// the sheet lightning's glow inside the cloud at a place of the plan (three patches, each swelling and fading)
vec3 boltGlow(vec2 q){
  float g=0.;
  for(int i=0;i<3;i++){ vec2 e=(q-uFlash[i].xy)*vec2(1.,.5); g+=uFlash[i].w*exp(-dot(e,e)*uFlash[i].z); }
  return uBolt*g;
}
// the cloud's own haze: it thickens down the hall, so the far ceiling sinks into slate
vec3 cloudAir(vec3 col, vec3 p){ vec3 e=p-cameraPosition; float fd=uFogDen*uFogDen*dot(e,e); return mix(col,uFogCol,1.-exp(-fd)); }
`;function Z(e,l,g,a){const d=[];for(let p=0;p<g;p++){const v=e+(l-e)*p/g,i=e+(l-e)*(p+1)/g,s=(v+i)/2,t=a.some(([u,w])=>s>u&&s<w)?3:1;for(let u=0;u<t;u++)d.push(v+(i-v)*u/t)}return d.push(l),d}function te(e,l){const g=Z(c.x0-.7,c.x1+.7,e,[[-m.half-2,2-m.flat],[m.flat-2,m.half+2]]),a=Z(c.zHigh-.7,c.zLow+.7,l,[[m.rear0-2,m.rear1+2]]),d=g.length-1,p=a.length-1,v=new Float32Array((d+1)*(p+1)*3),i=[];for(let t=0;t<=p;t++)for(let u=0;u<=d;u++){const w=(t*(d+1)+u)*3;v[w]=g[u],v[w+1]=c.wallTop+8,v[w+2]=a[t]}for(let t=0;t<p;t++)for(let u=0;u<d;u++){const w=t*(d+1)+u,f=w+1,n=w+d+1,o=n+1;i.push(w,f,n,f,o,n)}const s=new h.BufferGeometry;return s.setAttribute("position",new h.BufferAttribute(v,3)),s.setIndex(i),s}function oe(e){return new h.ShaderMaterial({uniforms:e,fog:!1,transparent:!0,depthWrite:!0,side:h.FrontSide,vertexShader:`
      ${H}
      varying vec3 vW, vN; varying vec4 vInfo;
      void main(){
        vec2 q=position.xz; vec4 info, i2; float wh, ed, e=1.1;
        float y=cloudY(q,info,wh,ed), yx=cloudY(q+vec2(e,0.),i2,wh,ed), yz=cloudY(q+vec2(0.,e),i2,wh,ed);
        vW=vec3(q.x,y,q.y); vN=nrm(vec3(yx-y,-e,yz-y)); vInfo=info;
        gl_Position=projectionMatrix*viewMatrix*vec4(vW,1.);
      }`,fragmentShader:`
      ${H}
      ${P}
      varying vec3 vW, vN; varying vec4 vInfo;
      void main(){
        vec2 q=vW.xz; float edge, soft, a=cloudWhole(q,edge,soft);
        vec2 dd=q-vec2(uTime*${r(G)},0.), da=vec2(q.y,vW.y), db=vec2(q.x,vW.y);
        float steep=clamp(1.5-1.5*vN.y*vN.y,0.,1.);                  // 0 the flat base .. 1 a wall of the hollow or of the tear
        float wx=vN.x*vN.x/(vN.x*vN.x+vN.z*vN.z+1e-4);              // a wall is drawn in its own upright plane, in the world's metres
        vec4 f1=mix(texture(tN,dd/7.3+vec2(.2,.6)),mix(texture(tN,db/7.3+vec2(.5,.1)),texture(tN,da/7.3+vec2(.5,.1)),wx),steep);
        vec4 f2=mix(texture(tN,dd/2.9),mix(texture(tN,db/2.9),texture(tN,da/2.9),wx),steep);
        vec4 f3=mix(texture(tN,dd/19.+vec2(.6,.1)),mix(texture(tN,db/19.+vec2(.6,.1)),texture(tN,da/19.+vec2(.6,.1)),wx),steep);
        float det=mix(f1.a*.45+f2.r*.2+f3.g*.35,.5,.55*steep), belly=vInfo.x, storm=vInfo.y;      // (a wall's fine grain is kept faint: its billows are its shape)
        vec3 n=nrm(vN+vec3(f1.r-.5,0.,f1.g-.5)*.55+vec3(f2.g-.5,0.,f2.a-.5)*.22);
        vec3 V=nrm(cameraPosition-vW); float graze=1.-abs(dot(n,V)); graze*=graze;
        float occ=(.1+.9*belly*belly)*(.7+.6*det), dark=storm*(1.-.7*vInfo.w);       // dark: under the storm's own base (the rim along the walls keeps its light)
        // under the storm the body is the darkest thing in the room (it takes less of the candles' amber too): what
        // lights it there is the sheet lightning's patches, from within
        vec3 col=uSlate*(.5+.5*belly)*(.75+.5*det)*mix(1.,.3,dark)*(1.+.9*vInfo.w)+(cloudLight(vW,n)+uAmber*(.3*vInfo.w))*occ*mix(1.,.5,dark);
        float inner=storm*smoothstep(.3,.8,texture(tN,dd/67.+vec2(uTime*.031,uTime*-.019)).g)*.05;
        col+=(boltGlow(q)+uBolt*inner)*(.7+.45*belly)*(.45+.55*det)*mix(.25,1.,storm);
        col+=uSilver*edge*(.09+.12*det);
        col+=hollowLight(vW)*(.5+det)*(.2+.95*belly*belly);
        col=mix(col,uSlate*1.3,graze*.24);
        gl_FragColor=vec4(cloudAir(col,vW),a);
        if(a<.01) discard;
      }`})}function ae(e){const l=$-14,g=c.wallTop+16,a=$-2,d=[[1.1,g,.8,$-13],[2,a,.7,$-11],[3.1,a,.6,$-9]],p=[],v=[],i=[],s=[];d.forEach(([f,n,o,x],z)=>{const M=c.x0+f,L=c.x1-f,q=c.zHigh+f,A=c.zLow-f;[[M,q,M,A],[L,A,L,q],[L,q,M,q],[M,A,L,A]].forEach(([S,k,y,N],b)=>{const T=Math.hypot(y-S,N-k),F=p.length/3,W=b===3?Math.min(n,$+3):n,C=b*37+z*11;p.push(S,l,k,y,l,N,y,W,N,S,W,k),v.push(C,0,C+T,0,C+T,W-l,C,W-l);for(let B=0;B<4;B++)i.push(o,x);s.push(F,F+1,F+2,F,F+2,F+3)})});const t=new h.BufferGeometry;t.setAttribute("position",new h.Float32BufferAttribute(p,3)),t.setAttribute("uv",new h.Float32BufferAttribute(v,2)),t.setAttribute("aL",new h.Float32BufferAttribute(i,2)),t.setIndex(s);const u=new h.ShaderMaterial({uniforms:e,fog:!1,side:h.DoubleSide,transparent:!0,depthWrite:!1,vertexShader:"attribute vec2 aL; varying vec2 vUv, vL; varying vec3 vW; void main(){ vUv=uv; vL=aL; vW=position; gl_Position=projectionMatrix*viewMatrix*vec4(position,1.); }",fragmentShader:`
      uniform sampler2D tN; uniform float uTime; uniform vec3 uSlate, uSilver, uAmber, uFogCol; uniform float uFogDen; varying vec2 vUv, vL; varying vec3 vW;
      void main(){
        vec2 p=vUv-vec2(uTime*.5,0.); float n=texture(tN,p/47.).r*.6+texture(tN,p/15.).a*.4, n2=texture(tN,p/9.+vec2(.4,.2)).g;
        float top=${r(c.wallTop+5)}+6.5*n+2.*n2, up=clamp((vW.y-${r($)})/24.,0.,1.), over=smoothstep(${r($-2)},${r($+1)},vW.y);
        float lo=vL.y+3.*n+1.5*n2, mist=vL.x*smoothstep(lo,lo+8.,vW.y)*(.8+.2*n2);
        float a=(1.-smoothstep(top-3.5,top+2.5,vW.y))*mix(mist,1.,over);
        vec3 col=mix(uSlate*(1.3+.5*n)+uAmber*(.14+.1*n),uSlate*(.3+.45*n)+uSilver*(.008+.05*up*up)*(.4+.9*n),over);
        vec3 e=vW-cameraPosition; col=mix(col,uFogCol,1.-exp(-uFogDen*uFogDen*dot(e,e)));
        gl_FragColor=vec4(col,a);
        if(a<.01) discard;
      }`}),w=new h.Mesh(t,u);return w.name="cloud-curtain",w.frustumCulled=!1,w.renderOrder=1,w}function ne(e,l,g){const a=Math.min(1,Math.max(0,(g-e.z0)/e.run)),d=a*a*(3-2*a),p=Math.min(1,Math.max(0,(Math.abs(l)-m.flat)/(m.half-m.flat))),v=Math.min(1,Math.max(0,(g-m.rear0)/(m.rear1-m.rear0))),i=Math.min(1,Math.hypot(p,v)),s=1-i*i*(3-2*i),t=l-U.x,u=g-U.z;return(e.lift*d+m.dome*Math.exp(-(t*t+u*u)/60))*s}function le(e,l){const g=[],a=_,d=Y,p=Math.floor((c.zLow-c.zHigh-13)/a);for(let i=0;i<=p;i++)for(let s=0;s<=d;s++){const t=c.x0+7+s*a+(e()-.5)*a*.9,u=c.zHigh+7+i*a+(e()-.5)*a*.9,w=3.2+2.8*e(),f=.8+2.7*e(),n=.5+.25*e(),o=e();Math.abs(t)<m.half+1&&u>l.z0+14&&u<m.rear1+2||g.push([t,f,u,w,o,0,n])}const v=[[c.x0,c.zHigh,0,1,1,0,170],[c.x1,c.zHigh,0,1,-1,0,170],[c.x0,c.zHigh,1,0,0,1,66],[c.x0,c.zLow,1,0,0,-1,66]];for(const[i,s,t,u,w,f,n]of v){const o=Math.round(n/3.4);for(let x=0;x<o;x++){const z=(x+e())/o*n,M=2+5.5*e();g.push([i+t*z+w*M,.5+2.5*e(),s+u*z+f*M,3.5+2.5*e(),e(),1,.5+.2*e()])}}for(let i=-1;i<=1;i+=2)for(let s=0,t=Math.round((l.run+14)/4.4);s<t;s++)g.push([i*(m.half+(e()-.3)*3),.6+2*e(),l.z0+6+s*4.4+(e()-.5)*2,3+2*e(),e(),2,.55+.2*e()]);for(let i=0;i<6;i++)g.push([(e()-.5)*22,.6+1.6*e(),l.z0-1+8*e(),3+2*e(),e(),2,.5+.2*e()]);return g}function re(e,l,g){const a=l.length,d=new h.InstancedBufferGeometry;d.setAttribute("position",new h.Float32BufferAttribute([-1,-1,0,1,-1,0,1,1,0,-1,1,0],3)),d.setIndex([0,1,2,0,2,3]);const p=new h.InstancedBufferAttribute(new Float32Array(a*4),4),v=new h.InstancedBufferAttribute(new Float32Array(a*4),4);p.setUsage(h.DynamicDrawUsage),v.setUsage(h.DynamicDrawUsage),d.setAttribute("aC",p),d.setAttribute("aS",v),d.instanceCount=a;const i=new h.ShaderMaterial({uniforms:e,fog:!1,transparent:!0,depthWrite:!1,vertexShader:`
      ${H}
      ${P}
      attribute vec4 aC, aS; varying vec2 vUv; varying vec3 vW, vBody, vWarm, vTop; varying vec3 vK;
      void main(){
        vec2 q=aC.xz; float kind=aS.y, show=1.;
        // the field's scud goes toward +x with the sheet and wraps across the field's own width
        if(kind<.5) q.x=${r(D.x0)}+mod(q.x-(${r(D.x0)})+uTime*${r(G)},${r(D.span)});
        vec4 info; float whole, edge, sy=cloudY(q,info,whole,edge);
        float y=sy-aC.y;
        if(kind<.5){
          // (it thins out over the field's last 4 m toward the +x wall's bank and gathers over its first 4 m from the
          // -x wall's; and none of it hangs where the skin is lifted into the hollow)
          vec2 wl; float into=smoothstep(0.,4.,q.x-(${r(D.x0)}))*(1.-smoothstep(${r(D.x0+D.span-4)},${r(D.x0+D.span)},q.x));
          show=max(max(edge*1.4,info.z*1.1),max(step(.72,aS.x)*.6,step(.5,aS.x)*info.y*.7))*smoothstep(.03,.25,whole);
          show*=into*(1.-smoothstep(.5,3.,vaultAt(q,vec4(.5),wl)));
        }
        vec3 c=vec3(q.x,y,q.y), e=cameraPosition-c; float d2=dot(e,e), inv=inversesqrt(d2+1e-4);
        show=min(show,1.)*smoothstep(.6,2.5,d2*inv);
        vec3 right=vec3(viewMatrix[0][0],viewMatrix[1][0],viewMatrix[2][0]), up=vec3(viewMatrix[0][1],viewMatrix[1][1],viewMatrix[2][1]);
        vec3 p=c+(right*position.x+up*(position.y*aS.z))*(show<.004?0.:aC.w);
        vK=vec3(show,aS.x,sy);
        vec3 n=nrm(vec3(0.,-1.,0.)+e*inv*.5);
        vBody=uSlate*mix(1.,.3,info.y*(1.-.7*info.w))*(1.+.8*info.w)+uAmber*(.16*info.w);
        vWarm=cloudLight(c,n)+boltGlow(q)*(.5*info.y+.08)+hollowLight(c)*.9;
        vTop=uSilver*(kind<.5?edge*.13:0.);
        vUv=position.xy; vW=p;
        gl_Position=projectionMatrix*viewMatrix*vec4(p,1.);
      }`,fragmentShader:`
      uniform sampler2D tN; uniform float uTime; uniform vec3 uFogCol; uniform float uFogDen;
      varying vec2 vUv; varying vec3 vW, vBody, vWarm, vTop; varying vec3 vK;
      void main(){
        float r2=dot(vUv,vUv);
        vec2 o=vec2(vK.y*7.31,vK.y*3.17);
        vec4 n1=texture(tN,vUv*.21+o+vec2(uTime*.004,0.)), n2=texture(tN,vUv*.57+o.yx);
        float den=(1.-r2)*(.5+.95*n1.r)+(n2.a-.5)*.34;
        float a=smoothstep(.1,.62,den)*vK.x*.9*(1.-smoothstep(vK.z-2.4,vK.z+.3,vW.y));
        float low=.5-.5*vUv.y;
        vec3 col=vBody*(.62+.5*n1.a)+vWarm*(.3+.7*low)*(.55+.6*n1.g)+vTop*(1.-low);
        vec3 e=vW-cameraPosition; col=mix(col,uFogCol,1.-exp(-uFogDen*uFogDen*dot(e,e)));
        gl_FragColor=vec4(col,a);
        if(a<.01) discard;
      }`}),s=new h.Mesh(d,i);s.name="cloud-scud",s.frustumCulled=!1,s.renderOrder=5;const t=new Uint16Array(a),u=new Float32Array(a),w=new Float32Array(a);for(let o=0;o<a;o++)t[o]=o,w[o]=$-2-l[o][1]+(l[o][5]<.5?0:ne(g,l[o][0],l[o][2]));const f=(o,x)=>u[x]-u[o];function n(o,x){const z=o.matrixWorld.elements,M=z[12],L=z[13],q=z[14],A=G*x;for(let y=0;y<a;y++){const N=l[y];let b=N[0];N[5]<.5&&(b=(b-D.x0+A)%D.span,b=D.x0+(b<0?b+D.span:b));const T=b-M,F=w[y]-L,W=N[2]-q;u[y]=T*T+F*F+W*W}t.sort(f);const S=p.array,k=v.array;for(let y=0;y<a;y++){const N=l[t[y]],b=y*4;S[b]=N[0],S[b+1]=N[1],S[b+2]=N[2],S[b+3]=N[3],k[b]=N[4],k[b+1]=N[5],k[b+2]=N[6]}p.needsUpdate=!0,v.needsUpdate=!0}return{mesh:s,sort:n,n:a}}async function he(e,l){const g=await ee(e,l.S.pads);await e.yield();const a=(o,x,z,M)=>new h.Vector4(o,x,z,M),d=o=>new h.Color(o[0],o[1],o[2]),p=l.dealt.hour,v=Q(l.leg),i={night:{slate:[.066,.088,.15],haze:[.045,.06,.105],silver:[.5,.58,.78],margin:0},dawn:{slate:[.082,.07,.1],haze:[.05,.04,.062],silver:[.86,.62,.62],margin:0},golden:{slate:[.098,.074,.072],haze:[.06,.042,.04],silver:[.9,.66,.4],margin:0},day:{slate:[.12,.14,.18],haze:[.085,.1,.13],silver:[.86,.94,1.2],margin:1}}[p],s={tN:{value:g},uTime:{value:0},uMargin:{value:i.margin},uBand:{value:new h.Vector2(-300,-360)},uVault:{value:new h.Vector3(v.z0,1/v.run,v.lift)},uGlow:{value:Array.from({length:12},()=>a(0,24,-60,0))},uFire:{value:a(U.x,5,U.z,.9)},uFlash:{value:[a(0,0,.002,0),a(0,0,.002,0),a(0,0,.002,0)]},uAmber:{value:new h.Color(.66,.43,.12)},uSlate:{value:d(i.slate)},uBolt:{value:new h.Color(.58,.62,1.12)},uSilver:{value:d(i.silver)},uFogCol:{value:d(i.haze)},uFogDen:{value:.0085}},t=new h.Group;t.name="cloud";const u=72,w=186,f=new h.Mesh(te(u,w),oe(s));f.renderOrder=3,f.frustumCulled=!1,f.name="cloud-base",await e.yield();const n=re(s,le(l.S.puffs,v),v);return t.add(ae(s),f,n.mesh),await e.yield(),{object:t,uniforms:s,noise:g,triangles:f.geometry.index.count/3+24+n.n*2,drawCalls:3,puffs:n.n,update(o,x,z,M){s.uTime.value=x,M&&n.sort(M,x)},dispose(){g.dispose(),t.traverse(o=>{o.isMesh&&(o.geometry.dispose(),o.material.dispose())})}}}export{ue as CLOUD_LOW,O as DROP_MOST,H as GLSL_CLOUD,P as GLSL_CLOUD_LIGHT,he as buildCloud,ee as makeNoiseTexture};
