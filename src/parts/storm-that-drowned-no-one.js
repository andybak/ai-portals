import*as M from"three";import{clamp as B,lerp as b,smoothstep as S,makeRng as Ot,hashSeed as Lt}from"../kit/core.js";const U=Math.PI*2,Y=t=>{const a=new M.Color(t);return[a.r,a.g,a.b]},R=(t,a)=>[t[0]*a,t[1]*a,t[2]*a],zt=(t,a,o)=>[b(t[0],a[0],o),b(t[1],a[1],o),b(t[2],a[2],o)],Ct={STERN:-19,STEM:19,SPRIT:32,BEAM:4.5,KEEL:-3.6,MAIN:{z:2,truck:36,top:22,yard:17,yardLen:20,tyard:27,tyardLen:14},FORE:{z:12,truck:31,top:19,yard:15,yardLen:17,tyard:24,tyardLen:12},MIZ:{z:-11,truck:25,yardLen:18},LANTERN_Y:10.6,FLYBY:32,HEIGHT:36,LENGTH:51};class ht{constructor(){this.p=[],this.c=[],this.k=[],this.uv=[],this.i=[],this.n=0}v(a,o,s=[0,0,0,0],n=[0,0]){return this.p.push(a[0],a[1],a[2]),this.c.push(o[0],o[1],o[2]),this.k.push(s[0],s[1],s[2],s[3]),this.uv.push(n[0],n[1]),this.n++}grid(a,o,s,n=!1){const c=this.n;for(let f=0;f<=o;f++)for(let r=0;r<=a;r++){const u=s(r/a,f/o);this.v(u.p,u.c,u.k,u.uv)}for(let f=0;f<o;f++)for(let r=0;r<a;r++){const u=c+f*(a+1)+r,l=u+1,e=u+a+1,i=e+1;n?this.i.push(u,e,l,l,e,i):this.i.push(u,l,e,l,i,e)}}tube(a,o,s,n,c,f=8,r=[0,0,0,0],u=1){const l=new M.Vector3(o[0]-a[0],o[1]-a[1],o[2]-a[2]),e=l.length();l.normalize();const i=new M.Vector3(1,0,0);Math.abs(l.x)>.9&&i.set(0,1,0);const h=new M.Vector3().crossVectors(l,i).normalize(),v=new M.Vector3().crossVectors(l,h);this.grid(f,u,(p,m)=>{const g=p*U,y=b(s,n,m),w=Math.cos(g)*y,A=Math.sin(g)*y;return{p:[a[0]+l.x*e*m+h.x*w+v.x*A,a[1]+l.y*e*m+h.y*w+v.y*A,a[2]+l.z*e*m+h.z*w+v.z*A],c,k:r,uv:[p,m*e]}})}box(a,o,s,n,c,f,r,u=[0,0,0,0]){const l=[a-n/2,a+n/2],e=[o,o+c],i=[s-f/2,s+f/2],h=(v,p,m,g)=>{const y=this.n;for(const w of[v,p,m,g])this.v(w,r,u,[w[0]+w[2],w[1]]);this.i.push(y,y+1,y+2,y,y+2,y+3)};h([l[0],e[0],i[1]],[l[1],e[0],i[1]],[l[1],e[1],i[1]],[l[0],e[1],i[1]]),h([l[1],e[0],i[0]],[l[0],e[0],i[0]],[l[0],e[1],i[0]],[l[1],e[1],i[0]]),h([l[1],e[0],i[1]],[l[1],e[0],i[0]],[l[1],e[1],i[0]],[l[1],e[1],i[1]]),h([l[0],e[0],i[0]],[l[0],e[0],i[1]],[l[0],e[1],i[1]],[l[0],e[1],i[0]]),h([l[0],e[1],i[1]],[l[1],e[1],i[1]],[l[1],e[1],i[0]],[l[0],e[1],i[0]])}quad(a,o,s,n,c,f=[0,0,0,0]){const r=this.n;this.v(a,c,f,[0,0]),this.v(o,c,f,[1,0]),this.v(s,c,f,[1,1]),this.v(n,c,f,[0,1]),this.i.push(r,r+1,r+2,r,r+2,r+3)}build(){const a=new M.BufferGeometry;return a.setAttribute("position",new M.Float32BufferAttribute(this.p,3)),a.setAttribute("color",new M.Float32BufferAttribute(this.c,3)),a.setAttribute("aK",new M.Float32BufferAttribute(this.k,4)),a.setAttribute("aUV",new M.Float32BufferAttribute(this.uv,2)),a.setIndex(this.i),a.computeVertexNormals(),a.computeBoundingSphere(),a}}const d=Ct,At=t=>d.BEAM*(t<.45?b(.6,1,S(0,.45,t)):Math.pow(Math.max(1-Math.pow((t-.45)/.55,2.3),0),.62)),ut=t=>4.5+4.6*(1-S(.06,.4,t))+1.3*S(.76,.98,t),It=t=>Math.pow(Math.sin(Math.PI/2*Math.min(1,t/.46)),.62)*(1-.2*S(.5,1,t)),ot=(t,a)=>b(d.STERN,d.STEM,t)+(t>.9?(t-.9)*10*.16*Math.max(a,0):0)-(t<.06?(.06-t)/.06*.1*Math.max(a-2,0):0),it=(t,a,o)=>{const s=ut(t),n=b(d.KEEL*(.55+.45*Math.sin(Math.PI*B(t*1.1,0,1))),s,a);return[o*At(t)*It(a),n,ot(t,n)]},ft=(t,a)=>{const o=ut(t),s=d.KEEL*(.55+.45*Math.sin(Math.PI*B(t*1.1,0,1)));return At(t)*It(B((a-s)/(o-s),0,1))},Wt=t=>t<.2?8:t<.38?6.3:t<.8?3.2:4.7,at=Y("#4a3524"),nt=Y("#2c2118"),tt=Y("#b08a3c"),rt=Y("#7a2e24"),Nt=Y("#8a7558"),dt=Y("#1d1a18"),kt=Y("#e6dcc4"),Q=Y("#6a4e32"),Gt=Y("#f09a3a"),Vt=Y("#b3202a");function Dt(){const t=new ht,a=[[0,null],[.1,null],[.2,null],[.3,null],[.38,null],[.46,null],[.56,null],[.64,null],[.64,tt],[.71,tt],[.71,null],[.79,null],[.79,rt],[.86,rt],[.86,null],[.95,null],[.95,nt],[1,nt]],o=46;for(const r of[1,-1]){const u=t.n;for(let l=0;l<a.length;l++)for(let e=0;e<=o;e++){const i=e/o,[h,v]=a[l],p=it(i,h,r);let m=v||zt(nt,at,.55+.45*Math.sin(i*37+h*11)*Math.sin(i*13));!v&&p[1]<.5&&(m=zt(Y("#1c2420"),m,S(-.4,.5,p[1]))),t.v(p,R(m,.8+.2*S(0,.5,h)),[0,0,.42,0],[p[2],p[1]])}for(let l=0;l<a.length-1;l++)if(a[l][0]!==a[l+1][0])for(let e=0;e<o;e++){const i=u+l*(o+1)+e,h=i+1,v=i+o+1,p=v+1;r>0?t.i.push(i,v,h,h,v,p):t.i.push(i,h,v,h,p,v)}for(let l=0;l<7;l++){const e=.36+l*.062,i=(g,y)=>{const w=it(e+g,.585+y,r);return[w[0]+r*.05,w[1],w[2]]},h=i(-.011,-.035),v=i(.011,-.035),p=i(.011,.035),m=i(-.011,.035);r>0?t.quad(v,h,m,p,R(rt,.75)):t.quad(h,v,p,m,R(rt,.75))}}const s=(r,u,l)=>t.grid(l,2,(e,i)=>{const h=b(r,u,e),v=Wt((r+u)/2),p=ft(h,v)-.12,m=b(-p,p,i);return{p:[m,v,ot(h,v)],c:R(Nt,.8+.2*Math.abs(i*2-1)),k:[0,0,.32,0],uv:[ot(h,v),m]}},!0);s(.005,.2,5),s(.2,.38,5),s(.38,.8,12),s(.8,.985,6);const n=(r,u,l,e)=>{const i=ft(r,u)-.1,h=ft(r,l)-.1,v=ot(r,u),p=[-i,u,v],m=[i,u,v],g=[h,l,v],y=[-h,l,v];e>0?t.quad(p,m,g,y,R(at,.9),[0,0,.5,0]):t.quad(m,p,y,g,R(at,.9),[0,0,.5,0])};n(.2,6.3,8,1),n(.38,3.2,6.3,1),n(.8,3.2,4.7,-1),t.grid(8,10,(r,u)=>{const l=b(.6,ut(0),u),e=ft(0,l),i=b(e,-e,r);return{p:[i,l,ot(0,l)],c:R(u>.86?rt:at,.85),k:[0,0,.42,0],uv:[i,l]}});const c=ot(0,6);for(let r=-2;r<=2;r++){const u=r*.92,l=c-.06;t.quad([u+.33,5.35,l],[u-.33,5.35,l],[u-.33,6.7,l],[u+.33,6.7,l],Y("#2a2418"),[1,0,0,0])}t.box(0,4.95,c-.35,5,.22,.8,R(tt,.8)),t.box(0,6.95,c-.18,5.2,.16,.4,R(tt,.8));const f=[];for(const r of[-1.6,0,1.6]){const u=d.LANTERN_Y+(r===0?.5:0),l=d.STERN-.25;t.tube([r,ut(0)-.2,l+.2],[r,u-.75,l],.06,.05,dt,5),t.box(r,u-.75,l,.5,.75,.5,R(Gt,.9),[0,0,0,1]),t.box(r,u,l,.62,.1,.62,dt),f.push([r,u-.35,l])}t.box(0,3.2,6.6,2.2,.14,2.6,R(nt,.8),[0,0,.16,0]),t.box(0,3.2,-2.6,2,.14,2.2,R(nt,.8),[0,0,.16,0]),t.tube([0,3.2,-5.2],[0,4.4,-5.2],.5,.36,Q,8),t.grid(4,1,(r,u)=>{const l=b(d.STEM-.3,d.STEM+5.6,r),e=b(1.5,.25,r)*(u*2-1);return{p:[e,b(4.9,5.9,r),l],c:R(at,.9),k:[0,0,.3,0],uv:[l,e]}},!0);for(const r of[1,-1])t.tube([r*1.5,5.6,d.STEM-.3],[r*.25,6.5,d.STEM+5.6],.07,.06,tt,5);for(const r of[1,-1])for(const[u,l]of[[.01,.2],[.2,.38],[.38,.8],[.8,.97]])for(let e=0;e<6;e++){const i=b(u,l,e/6),h=b(u,l,(e+1)/6),v=it(i,1,r),p=it(h,1,r);t.tube([v[0],v[1]+.06,v[2]],[p[0],p[1]+.06,p[2]],.09,.09,nt,5)}return{b:t,lanterns:f}}const V=[{id:"mainYard",mast:0,a:[-d.MAIN.yardLen/2,d.MAIN.yard,d.MAIN.z+.5],b:[d.MAIN.yardLen/2,d.MAIN.yard,d.MAIN.z+.5],r:.24},{id:"mainTop",mast:0,a:[-d.MAIN.tyardLen/2,d.MAIN.tyard,d.MAIN.z+.4],b:[d.MAIN.tyardLen/2,d.MAIN.tyard,d.MAIN.z+.4],r:.17},{id:"foreYard",mast:1,a:[-d.FORE.yardLen/2,d.FORE.yard,d.FORE.z+.5],b:[d.FORE.yardLen/2,d.FORE.yard,d.FORE.z+.5],r:.22},{id:"foreTop",mast:1,a:[-d.FORE.tyardLen/2,d.FORE.tyard,d.FORE.z+.4],b:[d.FORE.tyardLen/2,d.FORE.tyard,d.FORE.z+.4],r:.15},{id:"mizzen",mast:2,a:[.35,9.4,d.MIZ.z+5.6],b:[.35,22.2,d.MIZ.z-7],r:.17},{id:"sprit",mast:1,a:[-4.5,8.5,26.4],b:[4.5,8.5,26.4],r:.13}],_t=[0,5.2,16.6],mt=[0,10.6,d.SPRIT],pt=[[0,d.MAIN.truck,d.MAIN.z],[0,d.FORE.truck,d.FORE.z],[0,d.MIZ.truck,d.MIZ.z]],Ft=[{mast:0,a:[0,21.6,d.MAIN.z+.3],b:[0,5.4,d.FORE.z+1.4]},{mast:0,a:[0,34.6,d.MAIN.z],b:[0,19.6,d.FORE.z-.3]},{mast:1,a:[0,18.6,d.FORE.z+.3],b:[0,8.3,25.2]},{mast:1,a:[0,30.2,d.FORE.z],b:[0,10.6,d.SPRIT-.2]},{mast:2,a:[0,17.2,d.MIZ.z+.2],b:[0,6.6,d.MAIN.z-1]}];function Bt(t){const a=(o,s,n,c,f)=>{t.tube([0,1.5,o],[0,s+1.6,o+f*s],c,c*.72,Q,10,[0,0,0,0],3),t.tube([0,s-1.2,o+f*s+.5],[0,n,o],c*.6,c*.24,Q,8,[0,0,0,0],3),t.tube([0,s,o+.2],[0,s+.22,o+.2],1.25,1.5,R(Q,.8),14),t.tube([0,s+.22,o+.2],[0,s+.9,o+.2],1.5,1.62,R(at,.9),14),t.grid(14,1,(r,u)=>{const l=r*U,e=u*1.5;return{p:[Math.cos(l)*e,s+.23,o+.2+Math.sin(l)*e],c:R(Nt,.7),k:[0,0,0,0],uv:[r,u]}}),t.tube([0,n-.1,o],[0,n+.12,o],.2,.16,tt,8)};a(d.MAIN.z,d.MAIN.top,d.MAIN.truck,.46,0),a(d.FORE.z,d.FORE.top,d.FORE.truck,.42,0),t.tube([0,5.5,d.MIZ.z],[0,d.MIZ.truck,d.MIZ.z],.3,.09,Q,8,[0,0,0,0],3),t.tube([0,d.MIZ.truck-.1,d.MIZ.z],[0,d.MIZ.truck+.1,d.MIZ.z],.15,.12,tt,8);for(const o of V){const s=[(o.a[0]+o.b[0])/2,(o.a[1]+o.b[1])/2,(o.a[2]+o.b[2])/2];t.tube(s,o.a,o.r,o.r*.5,Q,7,[0,0,0,0],2),t.tube(s,o.b,o.r,o.r*.5,Q,7,[0,0,0,0],2)}t.tube(_t,mt,.36,.15,Q,9,[0,0,0,0],3)}function vt(t,a,o){const s=[a.b[0]-a.a[0],a.b[1]-a.a[1],a.b[2]-a.a[2]],n=Math.hypot(s[0],s[1],s[2]),c=Math.max(8,Math.round(n/.7)),f=s[0]/n,r=s[1]/n,u=s[2]/n,l=new M.Vector3(0,1,0),e=new M.Vector3(f,r,u),i=new M.Vector3().crossVectors(e,l);i.lengthSq()<.01&&i.set(1,0,0),i.normalize();const h=new M.Vector3().crossVectors(i,e).normalize();t.grid(8,c,(v,p)=>{const m=.04+.92*p,g=v*U,y=Math.abs((m*n+o)%1.7-.85)<.1,w=(.3+.1*Math.sin(m*n*2.1+o*5)*Math.sin(m*n*.7+o))*(1-.55*Math.pow(Math.abs(m*2-1),3))*(y?.8:1)*(a.r/.24*.6+.4),A=Math.cos(g)*w,N=Math.sin(g)*w*1.25,F=a.r+w*.75;return{p:[b(a.a[0],a.b[0],m)+h.x*(F+A)+i.x*N,b(a.a[1],a.b[1],m)+h.y*(F+A)+i.y*N,b(a.a[2],a.b[2],m)+h.z*(F+A)+i.z*N],c:y?R(dt,1.6):R(kt,.74+.2*Math.cos(g)+.06*Math.sin(m*n*3.3)),k:[0,0,0,0],uv:[v,m*n]}})}function Pt(t,a,o,s,n,c){t.grid(14,10,(f,r)=>{const u=b(1,s,r),l=b(a.a[0],a.b[0],.5+(f-.5)*u*.96),e=Math.sin(Math.PI*f)*Math.sin(Math.PI*Math.min(1,r*.8+.12)),i=[l,a.a[1]-a.r-o*r+.5*Math.pow(Math.abs(f*2-1),2)*r,a.a[2]+.2+n*e],h=Math.abs(f*14%2-1)<.12?.88:1,v=r>.72&&r<.82?.9:1;return{p:i,c:R(kt,(.82+.18*e)*h*v),k:[0,c*(.25+r)*Math.sin(Math.PI*B(f,.04,.96)),0,0],uv:[f,r]}})}function Et(t,a){const s=d.MAIN.truck-.2;t.grid(18,1,(n,c)=>{const f=b(.75,.06,n)*(c-.5);return{p:a?[.25+11*n,s+f-.6*n*n,d.MAIN.z-.4*n]:[.2+.5*Math.sin(n*5)*n,s-11*n*.82+f*.2,d.MAIN.z+.25*Math.sin(n*7)*n+f],c:R(Vt,.85+.15*Math.sin(n*21)),k:[0,(a?1.3:.22)*n,0,0],uv:[n,c]}})}function Ut(){const t=[],a=(e,i,h,v=0)=>{if(!v){t.push([e,i,h]);return}const p=6;let m=e;for(let g=1;g<=p;g++){const y=g/p,w=[b(e[0],i[0],y),b(e[1],i[1],y)-v*4*y*(1-y),b(e[2],i[2],y)];t.push([m,w,h]),m=w}},o=(e,i)=>{const h=B((e-d.STERN)/(d.STEM-d.STERN),.01,.99),v=it(h,1,i);return[v[0]+i*.3,v[1]-.2,v[2]]},s=(e,i,h,v,p)=>{const m=[],g=[v*p,i-.4,e];for(let y=0;y<h;y++)m.push(o(e-.5-y*1.05,v));for(const y of m)a(y,g,.075);for(let y=m[0][1]+1;y<i-1.6;y+=.62){const w=A=>{const N=(y-A[1])/(g[1]-A[1]);return[b(A[0],g[0],N),y,b(A[2],g[2],N)]};a(w(m[0]),w(m[h-1]),.035)}};for(const e of[1,-1]){s(d.MAIN.z,d.MAIN.top,5,e,.4),s(d.FORE.z,d.FORE.top,4,e,.36),s(d.MIZ.z,17.5,3,e,.25);for(const h of[d.MAIN,d.FORE])for(let v=0;v<3;v++)a([e*1.5,h.top+.9,h.z+.7-v*.6],[e*.12,h.truck-3.2,h.z],.05);a([0,d.MAIN.truck-2,d.MAIN.z],o(d.MAIN.z-6.5,e),.06),a([0,d.FORE.truck-2,d.FORE.z],o(d.FORE.z-5.5,e),.06);for(const h of V.slice(0,4)){const v=h.mast===0?d.MAIN:d.FORE,p=e>0?h.b:h.a,m=h.id.endsWith("Top");a(p,[0,p[1]+(m?5.5:4.2),v.z+.3],.04)}const i=h=>e>0?h.b:h.a;a(i(V[0]),o(-9.5,e),.045,.8),a(i(V[1]),[0,22.5,d.MIZ.z],.04,.5),a(i(V[2]),[e*.3,16.4,d.MAIN.z+.6],.045,.6),a(i(V[3]),[e*.3,22.6,d.MAIN.z+.5],.04,.4),a(i(V[5]),o(15.5,e),.04,.3)}for(const e of Ft)a(e.a,e.b,.085);a(V[4].b,[0,d.MIZ.truck-.6,d.MIZ.z],.04),a(V[4].a,o(d.MIZ.z+7.5,1),.04),a(V[4].a,o(d.MIZ.z+7.5,-1),.04),a([0,1.2,d.STEM+.4],[0,9.2,28.2],.07);const n=t.length,c=new Float32Array(n*12),f=new Float32Array(n*12),r=new Float32Array(n*8),u=[];for(let e=0;e<n;e++){const[i,h,v]=t[e];for(let p=0;p<4;p++){const m=p<2?i:h,g=p<2?h:i,y=e*12+p*3;c[y]=m[0],c[y+1]=m[1],c[y+2]=m[2],f[y]=g[0],f[y+1]=g[1],f[y+2]=g[2],r[e*8+p*2]=(p%2?1:-1)*(p<2?1:-1),r[e*8+p*2+1]=v}u.push(e*4,e*4+1,e*4+2,e*4+1,e*4+3,e*4+2)}const l=new M.BufferGeometry;return l.setAttribute("position",new M.BufferAttribute(c,3)),l.setAttribute("aOther",new M.BufferAttribute(f,3)),l.setAttribute("aSW",new M.BufferAttribute(r,2)),l.setIndex(u),l.boundingSphere=new M.Sphere(new M.Vector3(0,18,4),42),l}function qt(t){const o=new Uint8Array(65536),s=(c,f)=>{const r=new Float32Array(c*c);for(let u=0;u<r.length;u++)r[u]=t();for(let u=0;u<128;u++)for(let l=0;l<128;l++){const e=l/128*c,i=u/128*c,h=Math.floor(e),v=Math.floor(i),p=e-h,m=i-v,g=p*p*(3-2*p),y=m*m*(3-2*m),w=r[v%c*c+h%c],A=r[v%c*c+(h+1)%c],N=r[(v+1)%c*c+h%c],F=r[(v+1)%c*c+(h+1)%c];o[(u*128+l)*4+f]=Math.round(255*b(b(w,A,g),b(N,F,g),y))}};s(8,0),s(16,1),s(32,2),s(6,3);const n=new M.DataTexture(o,128,128,M.RGBAFormat,M.UnsignedByteType);return n.wrapS=n.wrapT=M.RepeatWrapping,n.magFilter=M.LinearFilter,n.minFilter=M.LinearMipmapLinearFilter,n.generateMipmaps=!0,n.needsUpdate=!0,n}const St=`
  uniform mat4 projectionMatrix;
  float mirrorDepth(vec3 w, float waterY) {
    vec3 d = w - cameraPosition; float t = (waterY + .2 - cameraPosition.y) / min(d.y, -1e-4);
    vec4 c = projectionMatrix * viewMatrix * vec4(cameraPosition + d * t, 1.);
    return clamp(c.z / max(c.w, 1e-4) * .5 + .5, 0., 1.);
  }`,Kt=`
  attribute vec4 aK; attribute vec2 aUV;
  uniform float uTime, uGale, uWaterY;
  varying vec3 vN, vW, vC; varying vec4 vK; varying vec2 vUV; varying float vOx;
  #include <fog_pars_vertex>
  void main() {
    vec3 p = position;
    float fl = aK.y * (.12 + .88 * uGale);
    p += normal * fl * (sin(uTime * 9.1 + position.x * 1.7 + position.y * 2.3) * .15 + sin(uTime * 5.3 + position.y * 1.1 - position.x * .8) * .22);
    p.x += aK.w * .2 * sin(uTime * 1.9 + position.x * 2.);
    vec4 wp = modelMatrix * vec4(p, 1.);
    #ifdef MIRROR
      // the copy trembles with the water's ripples, more the further it lies from her waterline
      float dp = clamp((uWaterY - wp.y) / 36., 0., 1.);
      wp.x += (.05 + dp * .3) * sin(uTime * 1.3 + wp.y * .9 + wp.z * .21); wp.z += (.05 + dp * .3) * sin(uTime * 1.1 + wp.y * .7 + wp.x * .17);
    #endif
    vN = normalize(mat3(modelMatrix) * normal); vW = wp.xyz; vC = color; vK = aK; vUV = aUV; vOx = position.x;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Ht=`
  uniform vec3 uSunDir, uSunCol, uSky, uGround, uFireCol; uniform vec4 uFire[6];
  uniform float uTime, uWet, uGlim, uGlimPh, uLamp, uWaterY, uGain; uniform vec3 uWaterTint;
  varying vec3 vN, vW, vC; varying vec4 vK; varying vec2 vUV; varying float vOx;
  #include <fog_pars_fragment>
  #ifdef MIRROR
  ${St}
  #endif
  void main() {
    #ifdef MIRROR
      if (vW.y > uWaterY - .02) discard;
    #endif
    vec3 n = normalize(vN) * (gl_FrontFacing ? 1. : -1.);
    #ifdef MIRROR
      // the copy is lit as she is: the light on her does not turn over with her
      n.y = -n.y;
    #endif
    vec3 alb = vC;
    if (vK.z > 0.) {
      float q = vUV.y / max(vK.z, .05), f = fract(q);
      alb *= clamp(mix(.6, 1., smoothstep(0., .07, f) * smoothstep(1., .93, f)) * (.88 + .24 * fract(sin(floor(q) * 12.9898) * 43758.5453)), .5, 1.12);
    }
    float sail = step(.001, vK.y);
    vec3 hemi = mix(uGround, uSky, n.y * .5 + .5);
    float nl = dot(n, uSunDir);
    vec3 sun = uSunCol * (max(nl * .85 + .15, 0.) + sail * .4 * max(-nl, 0.));
    vec3 fire = vec3(0.); float spec = 0.;
    vec3 v = normalize(cameraPosition - vW);
    for (int i = 0; i < 6; i++) {
      vec3 L = uFire[i].xyz - vW; float d2 = dot(L, L); vec3 l = L * inversesqrt(max(d2, 1e-4));
      float a = uFire[i].w / (1. + d2 / 110.);
      fire += uFireCol * a * (max(dot(n, l) * .7 + .3, 0.) + sail * .35 * max(-dot(n, l), 0.));
      vec3 h = normalize(l + v); float nh = max(dot(n, h), 0.); float nh2 = nh * nh; nh2 *= nh2; nh2 *= nh2;
      spec += a * nh2 * nh2;
    }
    // canvas never burns out under the fire: its light is eased towards 1, so seams, reef bands and the belly's shade stay
    vec3 lt = hemi + sun + fire; float lm = max(lt.r, max(lt.g, lt.b));
    if (lm > .6) lt *= mix(1., (.6 + .4 * (1. - exp(-(lm - .6) / .4))) / lm, sail);
    vec3 col = alb * lt + uFireCol * spec * uWet * .22;
    // pale fire glimmering in the cabin windows in turn; glass takes the sky when nothing burns
    float turn = .5 + .5 * sin(uTime * 1.3 + uGlimPh + floor(vOx * 1.09 + .5) * 2.4);
    col = mix(col, uFireCol * (2.2 * uGlim * turn * turn) + uSky * .35 * (1. - uGlim), step(.5, vK.x));
    col += vec3(1., .56, .16) * vK.w * uLamp * (.85 + .15 * sin(uTime * 7. + vOx * 5.));
    col *= uGain;
    #ifdef MIRROR
      // seen in the water: darker than she is and taking the water's own colour, more towards her trucks
      col = mix(col * .8, uWaterTint, .2 + .4 * clamp((uWaterY - vW.y) / 36., 0., 1.));
      gl_FragDepth = mirrorDepth(vW, uWaterY);
    #endif
    gl_FragColor = vec4(col, 1.);
    #include <fog_fragment>
  }`,Yt=`
  attribute vec3 aOther; attribute vec2 aSW;
  varying float vA; varying vec3 vW;
  #include <fog_pars_vertex>
  void main() {
    vec4 wa = modelMatrix * vec4(position, 1.), wb = modelMatrix * vec4(aOther, 1.);
    vW = wa.xyz;
    vec4 a = viewMatrix * wa, b = viewMatrix * wb;
    vec3 dir = b.xyz - a.xyz; vec3 c = cross(dir, a.xyz); float cl = length(c);
    vec3 side = cl > 1e-5 ? c / cl : vec3(1., 0., 0.);
    // never thinner to the eye than 0.0016 rad: a far rope keeps that width and fades instead
    float w = max(aSW.y, max(-a.z, .1) * .0016);
    vA = clamp(aSW.y / w, 0., 1.);
    a.xyz += side * aSW.x * w * .5;
    vec4 mvPosition = a;
    gl_Position = projectionMatrix * mvPosition;
    #include <fog_vertex>
  }`,Zt=`
  uniform vec3 uSky, uSunCol, uFireCol; uniform vec4 uFire[6]; uniform float uWaterY, uGain;
  varying float vA; varying vec3 vW;
  #include <fog_pars_fragment>
  #ifdef MIRROR
  ${St}
  #endif
  void main() {
    #ifdef MIRROR
      if (vW.y > uWaterY - .02) discard;
      gl_FragDepth = mirrorDepth(vW, uWaterY);
    #endif
    float f = 0.;
    for (int i = 0; i < 6; i++) { vec3 L = uFire[i].xyz - vW; f += uFire[i].w / (1. + dot(L, L) / 110.); }
    vec3 col = vec3(.075, .065, .055) * (uSky * 1.2 + uSunCol * .45) + uFireCol * f * .16;
    #ifdef MIRROR
      gl_FragColor = vec4(col * uGain, vA * .45);
    #else
      gl_FragColor = vec4(col * uGain, vA);
    #endif
    #include <fog_fragment>
  }`,jt=`
  attribute vec3 iPos; attribute vec2 iHP;
  uniform float uTime; uniform vec3 uWind;
  varying vec2 vUv; varying float vKind, vPh, vH;
  void main() {
    float h = iHP.x, kind = position.z;
    vKind = kind; vPh = iHP.y; vH = h;
    vec4 mv;
    if (kind > 1.5) {
      // the glow: a soft dab that turns about its own place to face the eye
      mv = modelViewMatrix * vec4(iPos + vec3(0., h * .4, 0.), 1.);
      float s = (h * 1.25 + .3) * step(.01, h);
      mv.xy += vec2(position.x * 2., position.y * 2. - 1.) * s;
      vUv = vec2(position.x * 2., position.y * 2. - 1.);
    } else {
      float w = .44 * pow(max(h, 0.), .75), y = position.y;
      vec3 dir = kind < .5 ? vec3(1., 0., 0.) : vec3(0., 0., 1.);
      vec3 p = iPos + dir * (position.x * 2. * w) + vec3(0., y * h, 0.);
      p += uWind * (y * y * h * .45) + vec3(sin(uTime * 7. + iHP.y * 40. + y * 4.), 0., cos(uTime * 6.1 + iHP.y * 31. + y * 3.)) * (.08 * h * y);
      mv = modelViewMatrix * vec4(p, 1.);
      vUv = vec2(position.x * 2., y);
    }
    gl_Position = projectionMatrix * mv;
  }`,$t=`
  uniform sampler2D uNoise; uniform float uTime, uGlow; uniform vec3 uCol;
  varying vec2 vUv; varying float vKind, vPh, vH;
  void main() {
    vec3 col;
    float flick = .8 + .2 * sin(uTime * 13. + vPh * 60.) * sin(uTime * 7.3 + vPh * 21.);
    if (vKind > 1.5) {
      float r = clamp(length(vUv), 0., 1.);
      col = mix(uCol, vec3(.45, .65, 1.), .35) * (exp(-r * r * 3.4) * (1. - smoothstep(.7, 1., r)) * uGlow * flick);
    } else {
      float x = clamp(vUv.x, -1., 1.), y = clamp(vUv.y, 0., 1.);
      // moving noise: broad slow licks, quick small ones and a fine tearing, all rising
      float n1 = texture2D(uNoise, vec2(x * .16 + vPh, y * .26 * (1. + vH * .15) - uTime * .7)).r;
      float n2 = texture2D(uNoise, vec2(x * .37 - vPh * 3., y * .55 - uTime * 1.5)).g;
      float n3 = texture2D(uNoise, vec2(x * .8 + vPh * 7., y * 1.1 - uTime * 2.3)).b;
      // widest a fifth of the way up, thinning to the tip; its middle line wanders with the noise
      float wd = (.14 + .44 * smoothstep(0., .2, y)) * pow(clamp(1. - y, 0., 1.), .85);
      float d = abs(x - ((n1 - .5) * .7 + (n2 - .5) * .25) * y) / max(wd, 1e-3);
      float body = smoothstep(1.15, .15, d + (n3 - .5) * .7 + (n2 - .5) * .5);
      body *= smoothstep(1., .5, y + (n2 - .5) * .5) * (1. - smoothstep(.75, 1., abs(x))) * smoothstep(0., .05, y);
      float root = smoothstep(.7, 0., d) * (1. - smoothstep(0., .55, y)) * smoothstep(0., .05, y);
      col = (mix(uCol * .62, vec3(.16, .38, 1.) * .55, smoothstep(.05, .85, y)) * body + vec3(.8, .9, 1.) * root * .32) * flick;
    }
    gl_FragColor = vec4(col, 1.);
  }`;function Xt(t,a,o){const s=[],n=[];for(let i=0;i<3;i++){const h=i===2?1:6,v=s.length/3;for(let p=0;p<=h;p++)for(const m of[-.5,.5])s.push(m,p/h,i);for(let p=0;p<h;p++){const m=v+p*2;n.push(m,m+1,m+2,m+1,m+3,m+2)}}const c=new M.InstancedBufferGeometry;c.setAttribute("position",new M.Float32BufferAttribute(s,3)),c.setIndex(n);const f=new M.InstancedBufferAttribute(new Float32Array(t*3),3),r=new M.InstancedBufferAttribute(new Float32Array(t*2),2);f.setUsage(M.DynamicDrawUsage),r.setUsage(M.DynamicDrawUsage),c.setAttribute("iPos",f),c.setAttribute("iHP",r),c.instanceCount=t,c.boundingSphere=new M.Sphere(new M.Vector3,1e5);const u={uTime:{value:0},uWind:{value:new M.Vector3(.5,0,.25)},uNoise:{value:a},uGlow:{value:.3},uCol:{value:new M.Color(o||"#cfeaff")}},l=new M.ShaderMaterial({uniforms:u,vertexShader:jt,fragmentShader:$t,transparent:!0,depthWrite:!1,blending:M.AdditiveBlending,side:M.DoubleSide,forceSinglePass:!0}),e=new M.Mesh(c,l);return e.frustumCulled=!1,e.renderOrder=3,{mesh:e,uniforms:u,count:t,set(i,h,v,p,m,g){f.array[i*3]=h,f.array[i*3+1]=v,f.array[i*3+2]=p,r.array[i*2]=m,r.array[i*2+1]=g},commit(){f.needsUpdate=!0,r.needsUpdate=!0}}}const Z={run:1.3,hold:1.5,burst:1};function Jt(t){const a=[],o=[],s=e=>e===0?d.MAIN.z:e===1?d.FORE.z:d.MIZ.z,n=(e,i,h,v,p)=>{const m={a:e,b:i,len:Math.hypot(i[0]-e[0],i[1]-e[1],i[2]-e[2]),mast:h,group:v,hubT:p,list:[]};return m.hub=[0,b(e[1],i[1],p),s(h)],a.push(m),m};V.forEach((e,i)=>n(e.a,e.b,e.mast,i===5?5:e.mast===0?3:e.mast===1?4:2,i===4?.44:.5));const c=n([0,6.2,d.STEM+.4],mt,1,5,0);Ft.forEach(e=>n(e.a,e.b,e.mast,e.mast===0?3:e.mast===1?4:2,0)),pt.forEach((e,i)=>o.push({truck:!0,fixed:e,mast:i,group:i,h0:t.range(3,4.5),ph:t()}));for(let e=0;e<5;e++)for(const i of[0,1])o.push({t:a[e],p:i,end:!0,mast:a[e].mast,group:a[e].group,h0:t.range(1.2,2),ph:t()});o.push({t:c,p:1,end:!0,tip:!0,mast:1,group:5,h0:t.range(1.5,2),ph:t()});const f=a.reduce((e,i)=>e+i.len,0);for(const e of a){const i=Math.max(2,Math.round(70*e.len/f));for(let h=0;h<i;h++){const v=t.range(2,6),p=v/(.63*e.len);o.push({t:e,run:!0,mast:e.mast,group:e.group,h0:t.range(.5,1.5),ph:t(),c0:t.range(.42,.58),w1:p,f1:t.range(0,U),w2:p*t.range(2,2.7),f2:t.range(0,U)})}}o.forEach((e,i)=>{e.i=i,e.t&&e.t.list.push(e)});const r=[],u=Z.run+Z.hold+Z.burst;let l=-1;for(let e=0;e<18;e++){let i=t.int(0,2);i===l&&(i=(i+1+t.int(0,1))%3),r.push({at:e*u,mast:i}),l=i}if(r[17].mast===r[0].mast){const e=r[0].mast,i=r[16].mast;r[17].mast=e===i?(e+1)%3:3-e-i}return{tracks:a,flames:o,events:r,loop:18*u,phase:t()*18*u}}function Qt(t,a,o){o[0]=o[1]=o[2]=0;const s=((a+t.phase)%t.loop+t.loop)%t.loop;for(const n of t.events){const c=s-n.at;c<0||c>Z.run+Z.hold+Z.burst||(o[n.mast]=Math.max(o[n.mast],S(0,Z.run,c)*(1-S(Z.run+Z.hold,Z.run+Z.hold+Z.burst,c))))}return o}async function se(t,a={}){const o=a.rng||Ot(Lt("fire-ship:"+t.seed));await t.yield();const s=a.noiseTexture||qt(o);await t.yield();const n=Dt();await t.yield(),Bt(n.b),await t.yield();for(const I of[0,3,4,5])vt(n.b,V[I],I*1.37);await t.yield();const c=(I,x)=>{const z=new ht;return z.p=I.p.concat(x.p),z.c=I.c.concat(x.c),z.k=I.k.concat(x.k),z.uv=I.uv.concat(x.uv),z.i=I.i.concat(x.i.map(k=>k+I.n)),z.n=I.n+x.n,z},f=new ht;Pt(f,V[2],6.2,.9,1.9,.5),Pt(f,V[1],7.4,1.18,1.7,.45),Et(f,!0);const r=c(n.b,f).build();await t.yield();const u=new ht;vt(u,V[2],2.9),vt(u,V[1],4.3),Et(u,!1);const l=c(n.b,u).build();await t.yield();const e=Ut();await t.yield();const i={value:0},h=()=>({uSunDir:{value:new M.Vector3(.908,.342,-.243)},uSunCol:{value:new M.Vector3(.5,.52,.55)},uSky:{value:new M.Vector3(.16,.22,.24)},uGround:{value:new M.Vector3(.05,.09,.085)},uFireCol:{value:new M.Color(a.fireColor||"#cfeaff")},uTime:i,uWaterY:{value:0},uGlimPh:{value:a.glimmer||0},uWaterTint:{value:new M.Vector3(.6,.66,.68)}}),v=h(),p=()=>({fogColor:{value:new M.Color},fogDensity:{value:0},fogNear:{value:1},fogFar:{value:2e3}}),m=(I,x,z)=>{const k={...p(),...z,...I},W=x?{MIRROR:1}:{},G=new M.ShaderMaterial({uniforms:k,defines:W,vertexShader:Kt,fragmentShader:Ht,vertexColors:!0,fog:!0,side:M.DoubleSide}),_=new M.ShaderMaterial({uniforms:k,defines:W,vertexShader:Yt,fragmentShader:Zt,fog:!0,transparent:!0,depthWrite:!1,side:M.DoubleSide});return{ship:G,rig:_}},g=()=>Array.from({length:6},()=>new M.Vector4(0,0,0,0)),y=(I,x)=>{const z=new M.Group;for(const W of x)z.add(new M.Mesh(W,I.ship));const k=new M.Mesh(e,I.rig);return k.renderOrder=2,z.add(k),z},w={uFire:{value:g()},uGale:{value:1},uWet:{value:1},uGlim:{value:1},uLamp:{value:3},uGain:{value:1}},A=new M.Group,N=y(m(w,!1,v),[r]);A.add(N);const F=Jt(o),T=Xt(F.flames.length,s,a.fireColor);N.add(T.mesh);const E=[0,0,0],O=new Float32Array(24),K=new M.Vector3,L=new M.Euler(0,0,0,"YXZ"),q=o.range(0,U),j=o.range(0,U),C=(I,x,z,k)=>(k[0]=b(I[0],x[0],z),k[1]=b(I[1],x[1],z),k[2]=b(I[2],x[2],z),k),P=[0,0,0],D=I=>{Qt(F,I,E),O.fill(0);for(const x of F.flames){const z=E[x.mast];let k=x.h0;if(x.truck)P[0]=x.fixed[0],P[1]=x.fixed[1],P[2]=x.fixed[2],k=b(x.h0,7,S(.55,1,z)),x.pp=-1;else{const W=x.t;let G=x.run?B(x.c0+.34*Math.sin(x.w1*I+x.f1)+.13*Math.sin(x.w2*I+x.f2),.03,.97):x.p;if(G=b(G,W.hubT,S(0,.6,z)),x.pp=G,C(W.a,W.b,G,P),z>.6){const _=S(.6,1,z),$=pt[x.mast];P[0]=b(P[0],$[0],_),P[1]=b(P[1],$[1],_),P[2]=b(P[2],$[2],_),k*=1-.9*_}}x.x=P[0],x.y=P[1],x.z=P[2],x.h=k}for(const x of F.tracks)for(let z=0;z<x.list.length;z++)for(let k=z+1;k<x.list.length;k++){const W=x.list[z],G=x.list[k],_=Math.abs(W.pp-G.pp)*x.len;if(_<1.5){const $=1-S(.5,1.5,_),et=G.h*$;W.h+=et,G.h-=et}}for(const x of F.flames){T.set(x.i,x.x,x.y,x.z,x.h,x.ph);const z=x.group*4;O[z]+=x.x*x.h,O[z+1]+=x.y*x.h,O[z+2]+=x.z*x.h,O[z+3]+=x.h}T.commit(),T.uniforms.uTime.value=I,N.updateMatrixWorld(!0);for(let x=0;x<6;x++){const z=O[x*4+3],k=w.uFire.value[x];if(z<.001){k.w=0;continue}K.set(O[x*4]/z,O[x*4+1]/z+.8,O[x*4+2]/z).applyMatrix4(N.matrixWorld),k.set(K.x,K.y,K.z,(a.fireLight??.2)*Math.pow(z,.7))}},J=()=>{const I={uFire:{value:g()},uGale:{value:0},uWet:{value:0},uGlim:{value:0},uLamp:{value:0},uGain:{value:1}},x={...I,uGain:{value:1}},z=h(),k=new M.Group,W=y(m(I,!1,z),[l]),G=y(m(x,!0,z),[l]);return G.scale.y=-1,k.add(W,G),{object:k,upright:W,mirror:G,uniforms:I,mirrorUniforms:x,light:z}},H=I=>new M.Vector3(I[0],I[1],I[2]),st={trucks:pt.map(H),yardEnds:V.slice(0,5).flatMap(I=>[H(I.a),H(I.b)]),bowspritEnd:H(mt),lanterns:n.lanterns.map(H),mainTop:new M.Vector3(0,d.MAIN.top,d.MAIN.z),foreYard:new M.Vector3(0,d.FORE.yard,d.FORE.z),flyBy:[new M.Vector3(-d.FLYBY,d.MAIN.yard+3.5,d.STERN),new M.Vector3(-d.FLYBY,d.MAIN.yard+1,d.SPRIT)]};return D(0),{object:A,radius:28,height:d.HEIGHT,center:new M.Vector3(0,15,4),anchors:st,ground:!0,groundY:-.05,light:v,uniforms:w,fire:w.uFire.value,flames:T,noiseTexture:s,twin:J,rock:N,heightAt:a.heightAt||null,update(I,x,z){i.value=x;const k=this.heightAt;let W=.9*Math.sin(x*.83+j),G=.087*Math.sin(x*.71+j);if(k){A.updateMatrixWorld(!0);const _=A.matrixWorld.elements,$=_[12],et=_[14],yt=_[8],Mt=_[10],wt=k($+yt*14,et+Mt*14,x),bt=k($-yt*14,et-Mt*14,x),Tt=k($,et,x);W=(wt+bt+2*Tt)/4*.85,G=B(Math.atan2(bt-wt,28)*.8,-.1,.1)}L.set(G,0,.122*(.75*Math.sin(x*.57+q)+.25*Math.sin(x*1.31+q*2))),N.rotation.copy(L),N.position.y=W,D(x)},dispose(){a.noiseTexture||s.dispose();for(const I of[r,l,e])I.dispose()}}}class ie{constructor(a=1){this.cap=0,this.icap=0,this.n=0,this.ni=0,this.from=0,this.k=a,this.ax=0,this.az=0,this.ar=1,this.room(4096,16384)}room(a,o){if(a>this.cap){const s=Math.max(a,this.cap*2),n=(c,f)=>{const r=new Float32Array(s*f);return c&&r.set(c.subarray(0,this.n*f)),r};this.P=n(this.P,3),this.N=n(this.N,3),this.L=n(this.L,4),this.O=n(this.O,1),this.C=n(this.C,4),this.cap=s}if(o>this.icap){const s=Math.max(o,this.icap*2),n=new Uint32Array(s);this.I&&n.set(this.I.subarray(0,this.ni)),this.I=n,this.icap=s}}v(a,o,s,n,c,f,r,u){const l=this.n;l>=this.cap&&this.room(l+1,0);const e=this.P,i=this.N,h=l*3;return e[h]=a,e[h+1]=o,e[h+2]=s,i[h]=n,i[h+1]=c,i[h+2]=f,this.L[l*4]=r,this.O[l]=u,this.C[l*4]=a-this.ax,this.C[l*4+1]=s-this.az,this.C[l*4+2]=this.ar,this.n++}sheet(a,o,s){const n=this.P,c=this.N,f=this.ni;this.room(0,f+a*o*6);const r=this.I;let u=f;for(let e=0;e<o;e++)for(let i=0;i<a;i++){const h=s+e*(a+1)+i,v=h+1,p=h+a+1,m=p+1;r[u]=h,r[u+1]=p,r[u+2]=v,r[u+3]=v,r[u+4]=p,r[u+5]=m,u+=6}this.ni=u;let l=0;for(let e=f;e<u;e+=3){const i=r[e]*3,h=r[e+1]*3,v=r[e+2]*3,p=n[h]-n[i],m=n[h+1]-n[i+1],g=n[h+2]-n[i+2],y=n[v]-n[i],w=n[v+1]-n[i+1],A=n[v+2]-n[i+2];l+=(m*A-g*w)*c[i]+(g*y-p*A)*c[i+1]+(p*w-m*y)*c[i+2]}if(l<0)for(let e=f;e<u;e+=3){const i=r[e+1];r[e+1]=r[e+2],r[e+2]=i}}lathe(a,o,s,n,c={}){const f=c.amp??2,r=(c.edge??f*.5)*this.k,u=c.sx??1,l=c.sz??1,e=c.lean?c.lean[0]:0,i=c.lean?c.lean[1]:0,h=[];for(let y=0;y<n.length-1;y++){const w=n[y],A=n[y+1],N=Math.max(1,Math.ceil(Math.hypot(A[0]-w[0],A[1]-w[1])/r));for(let F=0;F<N;F++)h.push([b(w[0],A[0],F/N),b(w[1],A[1],F/N)])}h.push(n[n.length-1]);let v=0;for(const y of h)v=Math.max(v,y[0]);this.ar=v*Math.max(u,l);const p=B(Math.ceil(U*v*Math.max(u,l)/r),8,72),m=h.length-1,g=this.n;for(let y=0;y<=m;y++){const w=h[y],A=h[Math.max(0,y-1)],N=h[Math.min(m,y+1)],F=N[0]-A[0],T=N[1]-A[1],E=Math.hypot(F,T)||1,O=T/E,K=-F/E;this.ax=a+e*w[1],this.az=s+i*w[1];for(let L=0;L<=p;L++){const q=L/p*U,j=Math.cos(q),C=Math.sin(q),P=c.open?c.open(q,w[1]):0,D=Math.max(0,w[0]-P*(c.recess??1.5));this.v(a+j*D*u+e*w[1],o+w[1],s+C*D*l+i*w[1],j*O,K,C*O,f*(1-.5*P),(c.shade??1)*(1-.68*P))}}this.sheet(p,m,g)}ball(a,o,s,n,c,f,r={}){const u=[];for(let l=0;l<=10;l++){const e=l/10*Math.PI;u.push([n*Math.sin(e),-c*Math.cos(e)])}u[0][0]=0,u[10][0]=0,this.lathe(a,o,s,u,{...r,sz:f/n})}box(a,o,s,n,c,f,r={}){this.ax=a,this.az=s,this.ar=Math.min(n,f);const u=r.amp??2,l=(r.edge??u*.5)*this.k,e=Math.max(.05,Math.min(r.round??u,n,c,f)),i=r.yaw??0,h=Math.cos(i),v=Math.sin(i),p=r.taper??0,m=[n,c,f];for(let g=0;g<3;g++)for(let y=-1;y<=1;y+=2){if(r.skip&&r.skip.includes("xyz"[g]+(y<0?"-":"+")))continue;const w=(g+1)%3,A=(g+2)%3,N=Math.max(1,Math.ceil(2*m[w]/l)),F=Math.max(1,Math.ceil(2*m[A]/l)),T=this.n,E=[0,0,0];for(let O=0;O<=F;O++)for(let K=0;K<=N;K++){E[g]=y*m[g],E[w]=(K/N*2-1)*m[w],E[A]=(O/F*2-1)*m[A];const L=B(E[0],-n+e,n-e),q=B(E[1],-c+e,c-e),j=B(E[2],-f+e,f-e);let C=E[0]-L,P=E[1]-q,D=E[2]-j;const J=Math.hypot(C,P,D)||1;C/=J,P/=J,D/=J;const H=r.open?r.open(g,y,E[0],E[1],E[2]):0,st=e-H*(r.recess??1.5);let I=L+C*st,x=q+P*st,z=j+D*st;if(p){I*=1-p*(x+c)/(2*c),P+=Math.abs(C)*p*n/(2*c);const k=Math.hypot(C,P,D)||1;C/=k,P/=k,D/=k}this.v(a+I*h+z*v,o+x,s-I*v+z*h,C*h+D*v,P,-C*v+D*h,u*(1-.5*H),(r.shade??1)*(1-.68*H))}this.sheet(N,F,T)}}tube(a,o,s={}){const n=s.amp??1.5,c=(s.edge??n*.5)*this.k,f=B(Math.ceil(U*o/c),6,40),r=s.ref??[0,0,1],u=this.n,l=a.length;for(let e=-1;e<=l;e++){const i=B(e,0,l-1),h=a[Math.max(0,i-1)],v=a[Math.min(l-1,i+1)],p=a[i];let m=v[0]-h[0],g=v[1]-h[1],y=v[2]-h[2];const w=Math.hypot(m,g,y)||1;m/=w,g/=w,y/=w;let A=r[1]*y-r[2]*g,N=r[2]*m-r[0]*y,F=r[0]*g-r[1]*m;const T=Math.hypot(A,N,F)||1;A/=T,N/=T,F/=T;const E=g*F-y*N,O=y*A-m*F,K=m*N-g*A,L=e<0?-1:e===l?1:0;this.ax=p[0],this.az=p[2],this.ar=o;for(let q=0;q<=f;q++){const j=q/f*U,C=Math.cos(j),P=Math.sin(j),D=A*C+E*P,J=N*C+O*P,H=F*C+K*P;L?this.v(p[0]+m*L*o*.7,p[1]+g*L*o*.7,p[2]+y*L*o*.7,m*L,g*L,y*L,n,s.shade??1):this.v(p[0]+D*o,p[1]+J*o,p[2]+H*o,D,J,H,n,s.shade??1)}}this.sheet(f,l+1,u)}place(a,o,s,n,c,f,r=1,u=0,l=0){const e=Math.cos(n),i=Math.sin(n),h=this.P,v=this.N,p=this.L,m=this.C;for(let g=this.from;g<this.n;g++){const y=h[g*3]*r,w=h[g*3+1]*r,A=h[g*3+2]*r,N=v[g*3],F=v[g*3+2];h[g*3]=a+y*e+A*i,h[g*3+1]=o+w,h[g*3+2]=s-y*i+A*e,v[g*3]=N*e+F*i,v[g*3+2]=-N*i+F*e,p[g*4]*=r,p[g*4+1]=c,p[g*4+2]=B(w/(f*r),0,1),p[g*4+3]=f*r;const T=m[g*4]*r,E=m[g*4+1]*r;m[g*4]=T*e+E*i,m[g*4+1]=-T*i+E*e,m[g*4+2]=u?Math.max(m[g*4+2]*r,.6):0,m[g*4+3]=l}this.from=this.n}geometry(a){const o=new M.BufferGeometry,s=this.n,n=(c,f)=>new M.BufferAttribute(c.slice(0,s*f),f);return o.setAttribute("position",n(this.P,3)),o.setAttribute("normal",n(this.N,3)),o.setAttribute("aL",n(this.L,4)),o.setAttribute("aO",n(this.O,1)),o.setAttribute("aC",n(this.C,4)),o.setIndex(new M.BufferAttribute(this.I.slice(0,this.ni),1)),a?o.boundingSphere=a:o.computeBoundingSphere(),o}}function lt(t,a,o){const s=a*.045,n=a*.66,c=Math.max(1,t*.14),f=[[0,0],[t*1.14,0],[t*1.14,a*.03],[t,s]];let r=t,u=s;for(let p=1;p<=o;p++){const m=b(s,n,p/o),g=t*(1-.2*p/o);f.push([b(r,g,.8),m-c*1.6],[r*1.02+c,m-c*.8],[r*1.02+c,m],[g,m+c*.9]),r=g,u=m+c*.9}const l=r*.8,e=u+a*.1,i=e+t*.22,h=(a-i)*.66;f.push([l,u+t*.25],[l,e],[l*1.12,e+t*.1],[l*1.12,i]);for(let p=1;p<=5;p++){const m=p/6*Math.PI/2;f.push([Math.max(l*.36,l*Math.cos(m)),i+h*Math.sin(m)])}const v=i+h*Math.sin(5/12*Math.PI);return f.push([l*.36,b(v,a,.6)],[l*.2,b(v,a,.85)],[0,a]),f}function gt(t,a,o,s){const n=[[0,0],[t,0],[t,a],[t*1.1,a+t*.08],[t*1.1,a+t*.2],[t*.97,a+t*.28]],c=a+t*.28;for(let r=1;r<=6;r++){const u=r/7*Math.PI/2;n.push([Math.max(t*.2,t*.97*Math.cos(u)),c+o*Math.sin(u)])}const f=c+o*Math.sin(6/14*Math.PI);return n.push([t*.2,b(f,s,.6)],[t*.12,b(f,s,.85)],[0,s]),n}const ct=(t,a,o=0,s=0)=>{const n=[[0,0],[t*1.3,0],[t*1.2,a*.04]],c=s?.3:1;for(let f=1;f<=9;f++)n.push([t*((s?.98-.012*f:.88)+c*(.16*Math.sin(f*1.9+o)+.07*Math.sin(f*4.3+o*2))),a*(.04+.085*f)]);return n.push([t*1.28,a*.88],[t*1.42,a*.94],[t*1.05,a*.985],[0,a]),n},X=(t,a,o,s,n,c)=>{const f=Math.abs((t/o%1+1.5)%1-.5)*o,r=c-Math.min(1,f/s)*Math.min(1,f/s)*s;return S(s+.5,s-.5,f)*S(n-.5,n+.5,a)*(1-S(r-.5,r+.5,a))},xt=(t,a,o,s)=>(n,c)=>{const f=t*.045,r=(t*.66-f)/a,u=c-f-(a-1)*r;return u<0||u>r?0:X(n/U*o*10,u,10,s,r*.16,r*.82)},re={*towers(t,a,o){for(const[s,n]of[[-19,a],[19,o]])t.lathe(s,0,0,lt(11,n,3),{amp:2.8,edge:1.7,open:xt(n,3,4,3.4),recess:4.5}),yield,t.ball(s,n-7,0,10,6,10,{amp:3.6,edge:1.9}),t.ball(s+6,n-12,3,6.5,4,6.5,{amp:2.6,edge:1.7}),t.ball(s-5,n-13,-4,6,3.6,6,{amp:2.6,edge:1.7}),yield;return t.box(0,13,0,12,13,7,{amp:2,edge:1.8,skip:"y-",open:(s,n,c,f)=>s===2?X(c,f,60,4.5,-12,4):0,recess:5}),t.box(0,27.5,0,13.5,2.2,8.5,{amp:1.8,edge:2}),Math.max(a,o)},*palace(t){const a=(o,s,n,c)=>o===2?X(n,c,21.4,4.6,-11,8):0;t.box(0,1.5,3,82,1.5,22,{amp:2,edge:3.6,skip:"y-"}),yield,t.box(0,16,0,75,13,12,{amp:2.4,edge:2,skip:"y-",open:a,recess:4.5}),yield,t.box(0,30.5,0,76.5,2.2,13.5,{amp:2,edge:2.6}),t.box(0,35,0,58,3.5,9.5,{amp:2.2,edge:2.4,skip:"y-"}),yield,t.box(0,21,5,17,18,16,{amp:1.8,edge:1.7,skip:"y-",open:(o,s,n,c)=>o===2&&s>0?X(n,c,80,5,-16,4):0,recess:3}),yield,t.box(0,44,5,18.5,5,17,{amp:1.4,edge:1.8,taper:.9,skip:"y-"}),yield,t.lathe(0,39,-2,gt(13,12,17,36),{amp:2,edge:1.6,open:(o,s)=>X(o/U*120,s,10,1.8,2.5,9.5),recess:1.6});for(const o of[-1,1]){yield,t.box(o*63,19,3,12,16,15,{amp:2.4,edge:2,skip:"y-",open:(s,n,c,f)=>s===2?X(c,f,60,4.2,-14,6):0,recess:4.5}),t.lathe(o*63,35,3,gt(8.5,4,9.5,19),{amp:1.6,edge:1.6}),yield;for(let s=0;s<3;s++)t.lathe(o*(26+s*11),3,17.5,ct(2.7,24,s*2.3+o,1),{amp:1.1,edge:1.7,lean:[o*.03*(s-1),.02]});yield}return 75},*temple(t){for(let o=0;o<3;o++)t.box(0,.85+o*1.7,0,44.5-o*1.6,.85,30.5-o*1.6,{amp:.7,edge:3.4,round:.6,skip:"y-"});yield,t.box(0,20,0,27,15,15,{amp:1.2,edge:2.6,shade:.34,skip:"y-y+",open:(o,s,n,c)=>o===2?X(n,c,80,4,-15,6):0,recess:2});const a=(o,s)=>t.lathe(o,5,s,ct(3,30,o*.31+s,1),{amp:1.2,edge:1.9,lean:[Math.sin(o*.7+s)*.025,Math.cos(o*.4-s)*.025]});yield;for(let o=0;o<8;o++)a(-36.4+o*10.4,22),a(-36.4+o*10.4,-22),o%2&&(yield);yield;for(let o=1;o<=4;o++)a(-36.4,22-o*8.8),a(36.4,22-o*8.8),o===2&&(yield);return yield,t.box(0,39,0,40.8,4,26.4,{amp:1.4,edge:2.1}),yield,t.box(0,54.5,0,42,13.5,27.2,{amp:1.7,edge:2,taper:.96,skip:"y-",open:(o,s,n,c)=>o===2?S(-9.5,-8,c)*(1-S(4,7,c))*.6:0,recess:1.4}),68},*slender(t,a){for(let o=0;o<a.length;o++){const s=a[o],n=(o-1)*24,c=o===1?5:-3;t.lathe(n,0,c,lt(5.2,s,4),{amp:1.7,edge:1.9,open:xt(s,4,4,2.2),recess:2.6,lean:[(o-1)*.02,.012]}),t.ball(n,s-4,c,5.5,3.4,5.5,{amp:2.2,edge:1.5}),yield}return Math.max(...a)},*arch(t){for(const a of[-1,1]){t.box(a*20,23,0,7,23,8,{amp:1.1,edge:1.5,skip:"y-y+"}),yield;for(const o of[-1,1])for(const s of[14.6,25.4])t.lathe(a*s,3,o*9.4,ct(1.7,34,s+o),{amp:.6,edge:1.5});t.box(a*20,1.5,0,9,1.5,11.5,{amp:.7,edge:2.2,skip:"y-"}),yield}for(const a of[-5.2,0,5.2]){const o=[];for(let s=0;s<=26;s++){const n=s/26*Math.PI;o.push([16.5*Math.cos(n),30+16.5*Math.sin(n),a])}t.tube(o,3.5,{amp:.8,edge:1.3}),yield}return yield,t.box(0,52,0,27,8,8.5,{amp:1.5,edge:1.7,open:(a,o,s,n)=>a===2?S(22,20,Math.abs(s))*S(-5,-3.5,n)*(1-S(3.5,5,n))*.5:0,recess:1}),yield,t.box(0,43.2,0,28.5,1.2,10.2,{amp:.8,edge:2.2}),t.box(0,60.2,0,28.8,1.3,10,{amp:1.2,edge:2.2}),61.5},column(t,a,o,s,n){return t.lathe(a,0,o,ct(3,30,s,1),{amp:1.3,edge:1.5,lean:n}),t.ball(a+n[0]*30,30.5,o+n[1]*30,5,2.6,5,{amp:1.6,edge:1.7}),33},heap(t,a,o,s,n,c=1,f=0){const r={amp:s*.1,edge:s*.24,shade:.9},u=s*c;t.lathe(a,f,o,[[0,.05*u],[.4*s,0],[.78*s,.05*u],[s,.17*u],[.92*s,.29*u],[.6*s,.4*u],[0,.46*u]],r);for(const[l,e,i]of n)t.ball(a+Math.cos(l)*e*s,f+.24*u,o+Math.sin(l)*e*s,i*s*.5,i*u*.3,i*s*.5,r)},great(t,a){if(a===0)t.box(0,13,0,27,13,27,{amp:2.8,edge:6,skip:"y-"}),t.lathe(0,22,0,gt(23,34,26,78),{amp:2.8,edge:4.8,open:(o,s)=>X(o/U*60,s,10,2.6,6,28),recess:4});else if(a===1)t.lathe(-15,0,0,lt(9,96,3),{amp:2.6,edge:4.6}),t.lathe(15,0,0,lt(9,78,3),{amp:2.6,edge:4.6}),t.box(0,14,0,26,14,9,{amp:2.2,edge:5,skip:"y-",open:(o,s,n,c)=>o===2?X(n,c,60,5,-13,6):0,recess:4});else if(a===2){t.box(0,4,0,40,4,24,{amp:2,edge:6,skip:"y-"}),t.box(0,30,0,30,22,15,{amp:2.2,edge:6,shade:.4,skip:"y-y+"});for(let o=0;o<6;o++)t.lathe(-33+o*13.2,8,20,ct(4.2,44,o*1.7),{amp:1.3,edge:4.6,lean:[Math.sin(o*2.1)*.03,.02]});t.box(0,68,0,39,16,24,{amp:2.4,edge:5,taper:.95,skip:"y-"})}else t.lathe(0,0,0,lt(13,120,4),{amp:3,edge:5,open:xt(120,4,4,4),recess:5}),t.ball(0,112,0,13,8,13,{amp:4,edge:4.5});return te[a].H},globe(t){return t.ball(0,125,0,125,125,125,{amp:11,edge:7.2,recess:7,open:(a,o)=>S(.1,.5,Math.sin(o/125*7.4))*(.45+.55*S(-.3,.3,Math.sin(a*3+o/125*2.2)))}),250}},te=[{H:100,reach:39,hx:27,hz:27},{H:96,reach:30,hx:26,hz:9.5},{H:84,reach:47,hx:40,hz:24},{H:120,reach:17,hx:13,hz:13}],Rt=18,ee=`
  uniform sampler2D uNoise; uniform float uTime;
  // a noise of the place itself (the same on every lump that passes through a point): three flat lookups, each sheared by the third axis
  float cn(vec3 q) {
    return texture2D(uNoise, q.xz * .125 + q.y * vec2(.046, .014)).r * .4 + texture2D(uNoise, q.xy * .0625 + q.z * vec2(.014, .026) + .37).g * .35
      + texture2D(uNoise, q.zy * .0625 + q.x * vec2(.019, .011) + .71).g * .25;
  }`,oe=ee+`
  attribute vec4 aL, aC; attribute float aO;
  uniform float uFront[${Rt}]; uniform vec3 uWindDir;
  varying vec3 vW, vN, vP; varying vec4 vK; varying float vM, vF;
  // metres by which the cloud swells at a place: broad lobes, billows about three times their height across, smaller ones on them, slowly crawling
  float billow(vec3 p, float amp) {
    vec3 q = p / max(amp * 3.4, .05) + uTime * vec3(.026, .011, .019);
    return amp * ((cn(q * .31 + 2.1) - .5) * 2.4 + (cn(q) - .47) * 3.4 + (cn(q * 2.7 + 5.3) - .5) * 1.1);
  }
  void main() {
    float amp = aL.x, span = aL.w; int bi = int(aL.y + .5);
    vec3 n = normalize(normal), p = position;
    // the melt: how far this place stands above its building's front (in building heights), the front a little uneven
    float front = uFront[bi], over = max(aL.z + (cn(p * .021) - .5) * .1 - front, 0.), mv = smoothstep(0., .1, over);
    // (the rounded head)
    float dome = step(.3, aC.z), rh = max(aC.z, .6), rr = max(length(aC.xy), .05), hs = clamp(over * span / max(2.4 * rh, 7.), 0., 1.), ca = cos(hs * 1.5708), sa = sin(hs * 1.5708);
    p.xz -= aC.xy * ((1. - ca) * dome);
    p.y += (rh * .8 * sa - over * span) * dome;
    n = normalize(mix(n, vec3(aC.x / rr * ca, sa + 1e-3, aC.y / rr * ca), dome * mv));
    float boil = amp * (1. + 1.3 * mv) * (1. - .55 * aC.w);
    vec3 t1 = normalize(cross(n, abs(n.y) > .9 ? vec3(1., 0., 0.) : vec3(0., 1., 0.))), t2 = cross(n, t1);
    float e = max(amp * 1.1, .05), d0 = billow(p, boil), d1 = billow(p + t1 * e, boil), d2 = billow(p + t2 * e, boil);
    vec3 nn = normalize(n - (t1 * (d1 - d0) + t2 * (d2 - d0)) * (.8 / e));
    p += n * d0;
    vec4 wp = modelMatrix * vec4(p, 1.);
    // what stands above the front lifts, goes to the lee and thins away (the taller the building, the further)
    wp.xyz += (uWindDir + vec3(0., .38, 0.)) * mix(max(16., span * .1) * mv * mv, min(rh, 14.) * .3 * hs, dome);
    vN = normalize(mat3(modelMatrix) * nn); vW = wp.xyz; vP = position;
    float gone = 1. - smoothstep(-.12, .04, front);
    vK = vec4(max(mv * (1. - dome), gone), aO, aL.z * span, clamp(d0 / max(boil, .05) * .4 + .5, 0., 1.));
    vM = mv; vF = aC.w;
    vec4 mvPosition = viewMatrix * wp;
    gl_Position = projectionMatrix * mvPosition;
  }`,ae=t=>t+`
  uniform vec3 uLit, uShade, uHollow, uGold, uRing, uHaze; uniform vec4 uRingAt;
  varying vec3 vW, vN, vP; varying vec4 vK; varying float vM, vF;
  void main() {
    vec3 N0 = normalize(vN), toEye = cameraPosition - vW; float dist = length(toEye); vec3 V = toEye / max(dist, 1e-3);
    // fine fluff: three flat lookups weighted by the facing, at two sizes
    vec3 w = abs(N0); w /= max(w.x + w.y + w.z, 1.);
    vec3 f = texture2D(uNoise, vP.zy * .11).rgb * w.x + texture2D(uNoise, vP.xz * .11).rgb * w.y + texture2D(uNoise, vP.xy * .11).rgb * w.z;
    vec3 g = texture2D(uNoise, vP.zy * .027 + .3).rgb * w.x + texture2D(uNoise, vP.xz * .027 + .3).rgb * w.y + texture2D(uNoise, vP.xy * .027 + .3).rgb * w.z;
    float eat = g.r * .62 + f.g * .38;
    // eaten away above the melting front; a ragged outline; a foot that frays into the mist
    if (eat < vK.x * 1.2 - .06) discard;
    if (dot(N0, V) < (eat - .36) * .55 * (1. - .7 * vF)) discard;
    if (vK.z < (eat - .22) * 14.) discard;
    vec3 N = normalize(N0 + (g.gbr - .5) * (.4 - .28 * vF));
    float nv = clamp(dot(N, V), 0., 1.), ndl = dot(N, uSunDir), lit = smoothstep(mix(-.25, -.14, vF), mix(.5, .34, vF), ndl);
    // the creases between billows lie in shade, their crowns in the light
    float crease = smoothstep(.2, .6, vK.w) * (.55 + .45 * smoothstep(.3, .62, g.r));
    vec3 col = mix(uShade * mix(vec3(1.), vec3(.9, .95, 1.07), vF), uLit * mix(vec3(1.), vec3(1.06, 1., .9), vF), lit * mix(.42 + .58 * crease, .7 + .3 * crease, vF));
    col += uGold * (.1 * lit * smoothstep(.55, .9, vK.w));
    // undersides lie in the deepest shade, and so do hollows: doorways, between columns, under cornices
    float belly = 1. - smoothstep(-.75, .1, N.y);
    col = mix(col, uHollow * (.75 + .5 * crease), belly * .8);
    col = mix(uHollow, col, clamp(vK.y * (.75 + .25 * crease), 0., 1.));
    // a thin gold rim towards the sun; the air between pales the far ones a little
    float rim = 1. - nv, r3 = rim * rim * rim, vs = clamp(dot(-V, uSunDir), 0., 1.);
    col = mix(col, uGold, r3 * (.25 + .6 * vs * vs) * (.4 + .6 * lit));
    col = mix(col, uHaze, (1. - exp(-dist * .0005)) * .7);
    // the melting front glows pale gold
    col += uGold * (smoothstep(0., .5, vM) * .3);
    // the ring's light on the last arch
    vec3 L = uRingAt.xyz - vW; float d2 = dot(L, L);
    col += uRing * ((clamp(dot(N, L * inversesqrt(max(d2, 1e-3))), 0., 1.) * .8 + .2) * uRingAt.w / (1. + d2 / 150.));
    // from under the storm: what its skirts hide is hidden, and its rain veils the rest
    float hide = stormVeil(-V, dist);
    if (hide > .002) col = mix(col, skyAt(-V, 0.), hide);
    gl_FragColor = vec4(col, 1.);
  }`;function le(t){const a={uTime:{value:0},uFront:{value:new Array(Rt).fill(1.3)},uWindDir:{value:t.wind},uLit:{value:t.lit},uShade:{value:t.shade},uHollow:{value:t.hollow},uGold:{value:t.gold},uRing:{value:t.ring},uRingAt:{value:t.ringAt},uHaze:{value:t.haze},...t.sky.uniforms};return new M.ShaderMaterial({uniforms:a,vertexShader:oe,fragmentShader:ae(t.sky.glsl)})}export{Rt as CLOUD_BUILDINGS,ie as CloudBuilder,te as GREAT,re as PAGEANT,Ct as SHIP,se as buildHero,le as makeCloudMaterial,Xt as makeFlames};
