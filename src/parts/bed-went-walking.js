import*as a from"three";import{mergeGeometries as gt}from"three/addons/utils/BufferGeometryUtils.js";import{clamp as D,lerp as F,smoothstep as j}from"../kit/core.js";const Zt=["#EFE4C6","#F3DE7A","#EE9C82","#A9C49A","#A9CBE0","#2A5078","#1A1714"];function le(t=Zt){return{uRes:{value:new a.Vector2(1280,720)},uReg:{value:new a.Vector2(1.5,1)},uPxAng:{value:2/(1.7*720)},uPaper:{value:new a.Color(t[0])},uInk:{value:new a.Color(t[6])},uLine:{value:.8},uTime:{value:0}}}const Nt=new a.Vector2;function ce(t,n,e){n&&n.renderer&&(n.renderer.getDrawingBufferSize(Nt),Nt.y>0&&t.uRes.value.copy(Nt));const i=e&&e.projectionMatrix?e.projectionMatrix.elements[5]:1.7;t.uPxAng.value=2/(Math.max(i,.05)*t.uRes.value.y),t.uLine.value=Math.max(.8,.8*t.uRes.value.y/720)}const zt=`
uniform vec2 uRes; uniform float uLine;
// push a clip-space position outward along a clip-space direction by px pixels (constant on screen, near and far)
vec4 mcHull(vec4 clip, vec2 dirXY, float px){
  float l = length(dirXY);
  vec2 d = l > 1e-6 ? dirXY / l : vec2(0.);
  clip.xy += d * (px * 2.0 / uRes) * max(clip.w, 0.0);
  return clip;
}`,ue=`
uniform vec2 uRes; uniform vec2 uReg; uniform float uPxAng; uniform vec3 uPaper; uniform vec3 uInk; uniform float uLine; uniform float uTime;
// a pen line wherever v crosses an integer; 2 px wide; closer than 3 px apart it is replaced by its flat mean
float mcLine(float v){
  float f = max(fwidth(v), 1e-6);
  float d = abs(v - floor(v + 0.5)) / f;
  float ln = 1.0 - smoothstep(uLine - 0.5, uLine + 0.5, d);
  float mean = clamp(2.0 * uLine * f, 0.0, 0.34);
  return mix(ln, mean, smoothstep(0.25, 0.34, f));
}
// ruled shade: 'turn' runs 0..1 across the ruled direction and spans 'metres'; lines sit about 6 px apart at this depth
float mcRule(float turn, float metres, float viewZ){
  float want = metres / max(8.5 * uLine * viewZ * uPxAng, 1e-5);
  float n = exp2(floor(log2(clamp(want, 2.0, 4096.0)) + 0.5));
  return mcLine(turn * n);
}
// 1 where the tint plate prints, 0 in the bare sliver inside a lower-left contour (round things: N and N.V in view space)
float mcRegister(vec3 Nv, float ndv){
  float g = max(length(vec2(dFdx(ndv), dFdy(ndv))), 1e-5);
  float dpx = 0.5 * ndv / g;
  float rl = max(length(uReg), 1e-4);
  float nl = length(Nv.xy);
  float facing = nl > 1e-4 ? dot(Nv.xy / nl, -uReg / rl) : 0.0;
  return max(step(rl * max(facing, 0.0) * 1.6, dpx), step(0.5, ndv));     // only near a true contour
}
// the same for a flat face with uv in 0..size (metres or any unit): bare sliver inside its low-u and low-v edges
float mcEdgeReg(vec2 uv, vec2 size){
  vec2 f = max(fwidth(uv), vec2(1e-6));
  vec2 a = uv / f;
  return step(abs(uReg.x), a.x) * step(abs(uReg.y), a.y);
}
// the engraver's rule for what is shaded: looks to starboard, or looks down
float mcShadeOf(vec3 Nw){ return max(step(0.36, Nw.x), step(Nw.y, -0.55)); }
vec3 mcFinish(vec3 tint, float ink, float reg){ return mix(mix(uPaper, tint, reg), uInk, clamp(ink, 0.0, 1.0)); }
`,Xt=`
uniform float uSway, uSwayAmp, uBillow;
vec3 clothMove(vec3 p0, vec2 rule){
  vec3 p = p0; float cloth = step(rule.y, -1e-4);
  float hang = uSwayAmp * max(0.0, -p0.y) * cloth;
  p.z += hang * uSway; p.x += hang * 0.35 * sin(uSway * 2.1 + p0.z * 0.4);
  float mid = max(0.0, 1.0 - (p0.x * p0.x) / 90.0);
  p.y += uBillow * cloth * (mid * (2.6 + 1.1 * sin(p0.z * 0.6 + uSway * 3.0)) + 0.5 * sin(p0.z * 1.3 + p0.x * 0.7 + uSway * 4.0));
  return p;
}`;function Kt(t={}){return new a.ShaderMaterial({uniforms:{...t.style,uSway:{value:0},uSwayAmp:{value:t.sway||0},uBillow:{value:0}},side:t.side??a.DoubleSide,vertexShader:`
      attribute vec3 color; attribute vec2 rule; attribute float crease;
      ${Xt}
      varying vec3 vNv, vNw, vVp, vCol; varying vec2 vRule; varying float vCrease, vCloth;
      void main(){
        vec3 p = position;
        p = clothMove(p, rule); vCloth = step(rule.y, -1e-4);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        vNv = normalMatrix * normal; vNw = mat3(modelMatrix) * normal; vVp = mv.xyz; vCol = color;
        vRule = vec2(rule.x, abs(rule.y)); vCrease = crease;
        gl_Position = projectionMatrix * mv;
      }`,fragmentShader:`
      ${ue}
      varying vec3 vNv, vNw, vVp, vCol; varying vec2 vRule; varying float vCrease, vCloth;
      void main(){
        vec3 N = normalize(vNv + vec3(0.0, 0.0, 1e-5)); if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(-vVp + vec3(0.0, 0.0, 1e-5));
        float ndv = abs(dot(N, V));
        vec3 Nw = normalize(vNw + vec3(0.0, 1e-5, 0.0)); if (!gl_FrontFacing) Nw = -Nw;
        float ink = mcLine(vCrease);
        ink = max(ink, max(mcShadeOf(Nw), step(0.5, vCloth) * step(0.3, Nw.z)) * mcRule(vRule.x, max(vRule.y, 0.01), max(-vVp.z, 0.05)));
        gl_FragColor = vec4(mcFinish(vCol, ink, mix(mcRegister(N, ndv), 1.0, smoothstep(45.0, 110.0, -vVp.z))), 1.0);   // far off the sliver would only be salt
      }`})}function Yt(t={}){return new a.ShaderMaterial({uniforms:{...t.style,uSway:{value:0},uSwayAmp:{value:t.sway||0},uBillow:{value:0}},side:a.BackSide,vertexShader:`
      ${zt}
      attribute vec2 rule;
      ${Xt}
      void main(){
        vec3 p = position;
        p = clothMove(p, rule);
        vec4 mvh = modelViewMatrix * vec4(p, 1.0); mvh.xyz *= 1.004; vec4 c = projectionMatrix * mvh;
        vec4 n = projectionMatrix * vec4(normalMatrix * normal, 0.0);
        gl_Position = mcHull(c, n.xy, 2.0 * uLine);
      }`,fragmentShader:"uniform vec3 uInk; void main(){ gl_FragColor = vec4(uInk, 1.0); }"})}function xt(t,n,e,i,l,m){const f=new a.BufferGeometry;return f.setAttribute("position",new a.Float32BufferAttribute(t,3)),f.setAttribute("normal",new a.Float32BufferAttribute(n,3)),f.setAttribute("color",new a.Float32BufferAttribute(e,3)),f.setAttribute("rule",new a.Float32BufferAttribute(i,2)),f.setAttribute("crease",new a.Float32BufferAttribute(l,1)),f.setIndex(m),f}function qt(t){let n=0;return t.map(e=>e?++n:n+.5)}function H(t,n,e,i){const l=t.length,m=[],f=[],L=[],N=[],y=[],w=[],A=qt(t.map(s=>s[2]));let x=.01;for(const s of t)x=Math.max(x,s[0]);for(let s=0;s<l;s++){const u=t[Math.max(0,s-1)],z=t[Math.min(l-1,s+1)],v=t[s];let M=z[0]-u[0],g=z[1]-u[1];const c=Math.hypot(M,g)||1;M/=c,g/=c;for(let b=0;b<=n;b++){const P=b/n*Math.PI*2,S=Math.cos(P),r=Math.sin(P);m.push(v[0]*S,v[1],v[0]*r),f.push(g*S,-M,g*r),L.push(e.r,e.g,e.b),N.push(b/n,Math.PI*2*x),y.push(A[s])}}const o=n+1;for(let s=0;s<l-1;s++)for(let u=0;u<n;u++){const z=s*o+u,v=z+1,M=z+o,g=M+1;t[s][0]>1e-6&&w.push(z,M,v),t[s+1][0]>1e-6&&w.push(v,M,g)}const p=xt(m,f,L,N,y,w);return i&&p.applyMatrix4(i),p}function it(t,n,e,i,l,m=new a.Vector3(1,0,0)){const f=t.length,L=[],N=[],y=[],w=[],A=[],x=[],o=qt(t.map((v,M)=>l?l[M]:M===0||M===f-1)),p=new a.Vector3,s=new a.Vector3,u=new a.Vector3;for(let v=0;v<f;v++){p.subVectors(t[Math.min(f-1,v+1)],t[Math.max(0,v-1)]).normalize(),s.crossVectors(p,m),s.lengthSq()<1e-6&&s.set(0,0,1),s.normalize(),u.crossVectors(s,p).normalize();const M=typeof n=="function"?n(v/(f-1)):n;for(let g=0;g<=e;g++){const c=g/e*Math.PI*2,b=Math.cos(c),P=Math.sin(c),S=s.x*b+u.x*P,r=s.y*b+u.y*P,h=s.z*b+u.z*P;L.push(t[v].x+S*M,t[v].y+r*M,t[v].z+h*M),N.push(S,r,h),y.push(i.r,i.g,i.b),w.push(g/e,Math.PI*2*M),A.push(o[v])}}const z=e+1;for(let v=0;v<f-1;v++)for(let M=0;M<e;M++){const g=v*z+M,c=g+1,b=g+z,P=b+1;x.push(g,b,c,c,b,P)}return xt(L,N,y,w,A,x)}const ze=new a.Matrix4,bt=new a.Quaternion,fe=new a.Vector3,he=new a.Vector3,$t=new a.Vector3,ot=(t,n,e,i=0,l=0,m=0,f=1)=>new a.Matrix4().compose(new a.Vector3(t,n,e),new a.Quaternion().setFromEuler(new a.Euler(i,l,m)),new a.Vector3(f,f,f));function Rt(t){const n=[[t*.5,0,1],[t*.62,t*.12,0],[t*.62,t*.3,1],[t*.34,t*.42,1],[t*.3,t*.62,0],[t*.42,t*.74,1]];for(let e=1;e<=9;e++){const i=-Math.PI/2+.38+e/9*(Math.PI-.38);n.push([Math.max(0,Math.cos(i))*t,t*1.72+Math.sin(i)*t,e===4?1:0])}return n[n.length-1][0]=0,n}function pe(t,n,e,i){const l=n-t,m=[[0,t,0],[e*1.25,t,1],[e*1.35,t+.25,0],[e*1.25,t+.5,1],[e,t+.62,1]],f=[.2+i()*.06,.52+i()*.08,.8+i()*.05];for(const L of f){const N=t+l*L,y=e*(1.5+i()*.25),w=.26+i()*.12;m.push([e,N-w*2.2,1],[e*1.18,N-w*1.5,1],[e*1.18,N-w*1.1,1],[y*.8,N-w*.7,0],[y,N,1],[y*.8,N+w*.7,0],[e*1.18,N+w*1.1,1],[e*1.18,N+w*1.5,1],[e,N+w*2.2,1])}return m.push([e,n-.3,1],[e*1.3,n-.12,0],[e*1.3,n,1],[0,n,0]),m}function Wt(t,n,e,i,l,m,f,L,N,y){const w=pe(-1.9,m,.44,n);for(const s of[-1,1])t.push(H(w,14,e,ot(s*l,0,i))),y||t.push(H(Rt(N),16,e,ot(s*l,m,i)));const A=[],x=[],o=28,p=[];for(let s=0;s<=o;s++){const u=s/o,z=F(-l,l,u),v=Math.sin(u*Math.PI);A.push(new a.Vector3(z,m-1.5+f*Math.pow(v,.8),i)),p.push(s===0||s===o)}t.push(it(A,.3,10,e,p,new a.Vector3(0,0,1)));for(const s of[1.9,m-2.6]){x.length=0;for(let u=0;u<=6;u++)x.push(new a.Vector3(F(-l,l,u/6),s,i));t.push(it(x.slice(),.21,8,e,null,new a.Vector3(0,0,1)))}for(let s=1;s<=L;s++){const u=s/(L+1),z=F(-l,l,u),v=m-1.5+f*Math.pow(Math.sin(u*Math.PI),.8),M=1.9,g=v,c=.15,b=F(M,m-2.6,.5),P=.4+s%2*.12,S=[[c,M,1],[c,b-P*1.5,1],[c*1.5,b-P*1.2,1],[c*1.5,b-P,1]];for(let r=1;r<8;r++){const h=-Math.PI/2+r/8*Math.PI;S.push([Math.max(c,Math.cos(h)*P),b+Math.sin(h)*P,r===4?1:0])}S.push([c*1.5,b+P,1],[c*1.5,b+P*1.2,1],[c,b+P*1.5,1],[c,g,1]),t.push(H(S,12,e,ot(z,0,i))),t.push(H(Rt(.3),10,e,ot(z,v+.2,i)))}}function Qt(t,n,e,i,l,m,f,L,N,y,w=!1){const A=[],x=[],o=[],p=[],s=[],u=[],v=new a.Vector3,M=new a.Vector3,g=new a.Vector3,c=new a.Vector3;for(let P=0;P<=f;P++)for(let S=0;S<=i;S++){const r=F(n,e,S/i),h=F(l,m,P/f);t(r,h,v),t(r+.001,h,M),t(r,h+.001,g),c.crossVectors(M.sub(v),g.sub(v)),c.lengthSq()<1e-16&&c.set(0,1,0),c.normalize(),w&&c.negate(),A.push(v.x,v.y,v.z),x.push(c.x,c.y,c.z),o.push(L.r,L.g,L.b);const V=N(r,h);p.push(V[0],V[1]),s.push(y(r,h))}const b=i+1;for(let P=0;P<f;P++)for(let S=0;S<i;S++){const r=P*b+S,h=r+1,V=r+b,k=V+1;w?u.push(r,V,h,h,V,k):u.push(r,h,V,h,k,V)}return xt(A,x,o,p,s,u)}const ut=(t,n)=>Math.sign(t)*Math.pow(Math.abs(t),n);function Jt(t,n,e,i,l,m,f,L,N,y=.8){return Qt((A,x,o)=>{const p=Math.cos(A),s=Math.sin(A),u=Math.cos(x),z=Math.sin(x),v=ut(u,y)*ut(p,i),M=ut(u,y)*ut(s,i),g=ut(z,y),c=1+.1*Math.pow(Math.abs(v*M),1.5);o.set(v*t*c,g*n,M*e*c),L&&g>0&&(o.y-=L*g*Math.exp(-((o.x/(t*.34))**2+(o.z/(e*.5))**2))),o.y+=N*.22*m.n3(o.x*.4+f,o.z*.4,g)*Math.abs(u)},0,Math.PI*2,40,-Math.PI/2+.001,Math.PI/2-.001,16,l,A=>[A/(Math.PI*2),2*(t+e)*1.6],(A,x)=>N?2.5+.62*m.n3(Math.cos(A)*.8+f,Math.sin(A)*.8,x*.9):(x>0?1.5:.5)+Math.sin(x)*.4,!0)}function ve(t,n,e,i,l,m){const o=(S,r)=>r/1.3+S*.09*Math.sin(e)+.85*n.fbm2(S*.16+e*2,r*.13+e,2)+e,p=(S,r,h)=>{const V=S*10.6,k=Math.abs(V)-(7-.9),R=Math.sign(V)||1,C=F(-8.15,4.4,r);let q=V,Q=2.3,U=0;if(k>0){const J=Math.min(k/.9,Math.PI/2),at=Math.max(0,k-.9*Math.PI/2);U=at/(3.6-.9*(Math.PI/2-1)),q=R*(6.1+.9*Math.sin(J)+U*(.35+.3*Math.sin(C*1.9+e+R))),Q=2.3-.9*(1-Math.cos(J))-at+U*.3*Math.sin(C*2.6+e*3+R*2)}const lt=n.fbm2(V*.2+e,C*.25-e,2),vt=o(V,C);Q+=(1-U*.7)*(.34*Math.pow(Math.abs(Math.sin(Math.PI*vt)),.7)+.3*lt)-.2,Q-=.5*j(.93,1,r)+.9*j(.05,0,r),q+=R*U*.25*lt,h.set(q,Q,C)},v=(S,r)=>Math.min((1-Math.abs(S))/.125,r/.06,(1-r)/.06000000000000005),M=S=>[(S+1)/2,-21.2],g=[-1,-.875,.875,1],c=[0,.06,.94,1],b=[5,38,5],P=[4,76,4];for(let S=0;S<3;S++)for(let r=0;r<3;r++){const h=S===1&&r===1;t.push(Qt(p,g[S],g[S+1],b[S],c[r],c[r+1],P[r],h?m||i:l,M,h?(V,k)=>o(V*10.6,F(-8.15,4.4,k)):(V,k)=>Math.min(v(V,k),1)*2.1))}}const Y=6.55,W=8.55,te=-2.3,Lt=9.2;async function me(t,n,e){const i=t.rng,l=t.noise,m=[],f=i()*40;Wt(m,i,n.brass,W,Y,Lt,2,7,.7,!0),await t.yield(),Wt(m,i,n.brass,-W,Y,6,1.4,7,.7),await t.yield();for(const y of[-1,1])for(const w of[-1,1])m.push(H([[0,-3.3,0],[.74,-3.3,1],[.86,-3.1,0],[.86,-2.8,1],[.72,-2.7,1],[.72,-2.2,1],[.95,-2.05,0],[.95,-1.8,1],[.6,-1.7,1]],14,n.brass,ot(y*Y,0,w*W)));for(const y of[-1,1]){const w=[];for(let A=0;A<=8;A++)w.push(new a.Vector3(y*Y,0,F(-W,W,A/8)));m.push(it(w,.3,10,n.brass,w.map((A,x)=>x%2===0)))}for(let y=0;y<7;y++){const w=F(-7.2,7.2,y/6),A=[];for(let x=0;x<=4;x++)A.push(new a.Vector3(F(-Y,Y,x/4),-.15-.25*Math.sin(x/4*Math.PI),w));m.push(it(A,.17,6,n.brass,null,new a.Vector3(0,0,1)))}await t.yield();const L=Jt(6.2,.85,8.3,.3,n.paper,l,f,0,0,.4);L.translate(0,.9,0),m.push(L),await t.yield(),ve(m,l,f,n.salmon,n.lemon,e?n.paper:null),await t.yield();const N=gt(m,!1);for(const y of m)y.dispose();return N}const ee=5,we=36;function yt(t,n,e,i){const l=t.attributes.position.count,m=new Float32Array(l*4);for(let f=0;f<l;f++)m[f*4]=n,m[f*4+1]=e,m[f*4+2]=i;return t.setAttribute("lp",new a.BufferAttribute(m,4)),t}async function de(t,n,e){const i=n.brass,l=[],m=44,f=12,L=[],N=[],y=[],w=[],A=[],x=[],o=[];for(let r=0;r<=m;r++){const h=r/m*2-1,V=.5+.5*Math.sign(h)*Math.pow(Math.abs(h),1.7);for(let k=0;k<=f;k++){const R=k/f*Math.PI*2;L.push(Math.cos(R),Math.sin(R),0),N.push(Math.cos(R),Math.sin(R),0),y.push(i.r,i.g,i.b),w.push(k/f,3.6),A.push(.5),x.push(0,0,V,0)}}for(let r=0;r<m;r++)for(let h=0;h<f;h++){const V=r*(f+1)+h,k=V+1,R=V+f+1,C=R+1;o.push(V,R,k,k,R,C)}const p=xt(L,N,y,w,A,o);p.setAttribute("lp",new a.Float32BufferAttribute(x,4));const s=[[.6,-2.1,1],[.8,-1.95,0],[.8,-1.65,1],[.68,-1.5,1],[.68,-1.2,1]];for(let r=0;r<=8;r++){const h=-1.1+r/8*2.2;s.push([Math.cos(h)*1.12,Math.sin(h)*1.12,r===4?1:0])}s.push([.68,1.2,1],[.68,1.5,1],[.8,1.65,1],[.8,1.95,0],[.6,2.1,1]);const u=yt(H(s,14,i),0,1,.5),z=[H([[.5,3.7,1],[.7,3.6,0],[.7,3.3,1],[.56,3.2,1],[.56,2.75,1],[.74,2.6,1],[.98,2.3,0],[1.1,1.95,0],[1.1,1.7,1],[.6,1.6,1]],14,i)];for(let r=0;r<4;r++){const h=Math.PI/4+r*Math.PI/2,V=[];for(let k=0;k<=6;k++){const R=k/6,C=.95+.42*Math.sin(R*2.4),q=2-1.15*R;V.push(new a.Vector3(Math.cos(h)*C,q,Math.sin(h)*C))}z.push(it(V,k=>.2*(1-k*.75),6,i,V.map((k,R)=>R===0),new a.Vector3(-Math.sin(h),0,Math.cos(h))))}for(const r of[-1,1]){const h=[new a.Vector3(r*.5,1.75,0),new a.Vector3(r*.62,1.2,0),new a.Vector3(r*.62,.5,0),new a.Vector3(r*.62,-.05,0)];z.push(it(h,.17,6,i,null,new a.Vector3(0,0,1))),z.push(H([[0,-.16,0],[.3,-.16,1],[.3,.04,1],[.16,.14,0],[0,.18,0]],8,i,ot(r*.62,0,0,0,0,-r*Math.PI/2)))}const v=yt(gt(z,!1),0,1,1);z.forEach(r=>r.dispose());const M=[H([[.8,-.27,1],[1.08,-.3,0],[1.2,-.17,1],[1.2,.17,1],[1.08,.3,0],[.8,.27,1]],20,i),H([[0,-.46,0],[.24,-.46,1],[.24,.46,1],[0,.46,0]],10,i)];for(const r of[-1,1]){const h=H(r<0?[[.24,-.2,0],[.8,-.27,0]]:[[.8,.27,0],[.24,.2,0]],20,i),V=h.attributes.crease,k=h.attributes.rule;for(let R=0;R<V.count;R++)V.setX(R,k.getX(R)*6);M.push(h)}const g=yt(gt(M,!1),0,3,1);M.forEach(r=>r.dispose()),await t.yield();const c=H([[.56,-.5,1],[.76,-.4,1],[.76,-.22,1],[.93,-.1,0],[.93,.1,0],[.76,.22,1],[.76,.4,1],[.56,.5,1]],10,i),b=Math.round(we*(e<.9?.5:1)),P=ee*(e<.9?2:1);for(let r=0;r<4;r++){for(const h of[p,u,v,g]){const V=h.clone(),k=V.attributes.lp;for(let R=0;R<k.count;R++)k.setX(R,r);l.push(V)}for(let h=0;h<b;h++)l.push(yt(c.clone(),r,4,3.6+(h+.5)*P));await t.yield()}const S=gt(l,!1);return await t.yield(),l.forEach(r=>r.dispose()),[p,u,v,g,c].forEach(r=>r.dispose()),S}const ne=`
attribute vec3 color; attribute vec2 rule; attribute float crease; attribute vec4 lp;
uniform vec3 uHip[4]; uniform vec3 uKnee[4]; uniform vec3 uFoot[4]; uniform vec3 uLks[4];   // uLks = (length, knee rounding in t, spin)
vec3 legAt(vec3 h, vec3 k, vec3 f, float kr, float t){
  vec3 a = h + (k - h) * (t * 2.0), b = k + (f - k) * (t * 2.0 - 1.0);
  return mix(a, b, smoothstep(0.5 - kr, 0.5 + kr, t));
}
// returns the object-space position; n = object-space normal; cre = crease value
vec3 legVertex(out vec3 n, out float cre){
  int i = int(lp.x + 0.5); float part = lp.y;
  vec3 h = uHip[i], k = uKnee[i], f = uFoot[i]; float len = max(uLks[i].x, 1.0), kr = uLks[i].y;
  float t = part > 3.5 ? 1.0 - lp.z / len : lp.z;
  float show = part > 3.5 ? step(0.035, t) : 1.0;
  t = clamp(t, 0.0, 1.0);
  vec3 o = legAt(h, k, f, kr, t);
  vec3 d = legAt(h, k, f, kr, min(t + 0.01, 1.0)) - legAt(h, k, f, kr, max(t - 0.01, 0.0));
  float dl = length(d);
  vec3 T = dl > 1e-5 ? d / dl : vec3(0.0, -1.0, 0.0);
  vec3 c = cross(T, vec3(1.0, 0.0, 0.0)); float cl = length(c);
  vec3 Bz = cl > 1e-4 ? c / cl : vec3(0.0, 0.0, 1.0);
  vec3 Ax = cross(Bz, T);
  float rad = mix(0.62, 0.5, smoothstep(0.42, 0.58, t));               // the shin is the thinner tube: it telescopes
  cre = crease;
  vec3 p;
  if (part < 0.5) {
    n = Bz * position.x + Ax * position.y; p = o + n * rad;
    cre = (1.0 - t) * len / ${ee.toFixed(1)} + 0.5;                    // a pen ring every pitch, between the collars
  } else if (part < 2.5 || part > 3.5) {
    float s = part > 3.5 ? show * rad / 0.6 : 1.0;
    p = o + (Ax * position.x - T * position.y + Bz * position.z) * s;
    n = Ax * normal.x - T * normal.y + Bz * normal.z;
  } else {
    float a = uLks[i].z, ca = cos(a), sa = sin(a);
    vec3 E1 = Bz * ca - T * sa, E3 = -T * ca - Bz * sa;
    p = o + E1 * position.x + Ax * position.y + E3 * position.z;
    n = E1 * normal.x + Ax * normal.y + E3 * normal.z;
  }
  return p;
}`;function Me(t){const n=()=>[0,1,2,3].map(()=>new a.Vector3),e={uHip:{value:n()},uKnee:{value:n()},uFoot:{value:n()},uLks:{value:n()}},i=Kt({style:t});Object.assign(i.uniforms,e),i.vertexShader=`${ne}
    varying vec3 vNv, vNw, vVp, vCol; varying vec2 vRule; varying float vCrease, vCloth;
    void main(){
      vec3 n; float cre; vec3 p = legVertex(n, cre); vCloth = 0.0;
      vec4 mv = modelViewMatrix * vec4(p, 1.0);
      vNv = normalMatrix * n; vNw = mat3(modelMatrix) * n; vVp = mv.xyz; vCol = color; vRule = rule; vCrease = cre;
      gl_Position = projectionMatrix * mv;
    }`;const l=Yt({style:t});return Object.assign(l.uniforms,e),l.vertexShader=`${zt}${ne}
    void main(){
      vec3 n; float cre; vec3 p = legVertex(n, cre);
      vec4 mvh = modelViewMatrix * vec4(p, 1.0); mvh.xyz *= 1.004; vec4 c = projectionMatrix * mvh;
      vec4 nc = projectionMatrix * vec4(normalMatrix * n, 0.0);
      gl_Position = mcHull(c, nc.xy, 2.0 * uLine);
    }`,{tint:i,hull:l,lu:e}}function ge(t={}){return new a.ShaderMaterial({uniforms:{...t.style,uU:{value:1},uDraw:{value:t.draw??.004},uFar:{value:t.far??420}},side:a.DoubleSide,vertexShader:`
      ${zt}
      attribute vec3 dir; attribute float side; attribute vec2 open; uniform float uU, uDraw, uFar;
      void main(){
        vec4 c = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        vec4 c2 = projectionMatrix * modelViewMatrix * vec4(position + dir * 0.2, 1.0);
        vec2 a = c.xy / max(abs(c.w), 1e-4), b = c2.xy / max(abs(c2.w), 1e-4);
        vec2 t = (b - a) * uRes; float tl = length(t);
        vec2 nrm = tl > 1e-5 ? vec2(-t.y, t.x) / tl : vec2(0.0, 1.0);
        float on = step(open.x + open.y * uDraw, uU) * step(c.w, uFar);
        gl_Position = mcHull(c, nrm * side, uLine * on);
        gl_Position.z -= 0.0006 * gl_Position.w;
      }`,fragmentShader:"uniform vec3 uInk; void main(){ gl_FragColor = vec4(uInk, 1.0); }"})}const xe=[[0,12],[.1,30],[.24,90],[.45,180],[.82,180],[.95,15],[1,15]],be=[[0,40],[.07,135],[.15,300],[.25,470],[.36,640],[.52,790],[.58,900],[.75,1175],[.82,1310],[.93,1560],[1,1560]];function ye(t,n){if(n<=t[0][0])return t[0][1];for(let e=1;e<t.length;e++)if(n<=t[e][0])return F(t[e-1][1],t[e][1],(n-t[e-1][0])/(t[e][0]-t[e-1][0]));return t[t.length-1][1]}function Ae(t,n){if(n<=t[0][0])return t[0][1];for(let e=1;e<t.length;e++)if(n<=t[e][0])return F(t[e-1][1],t[e][1],j(t[e-1][0],t[e][0],n));return t[t.length-1][1]}const ft=.4,It=[0,.1,.5,.6],ht=[-1,-1,1,1],pt=[-1,1,-1,1],At=1.2;function Se(t){const e=new Float32Array(769),i=new Float32Array(769),l=new Float32Array(769),m=o=>D(.9*t.lengthAt(o),14,62);for(let o=0;o<=768;o++){const p=t.course(o/768);i[o]=p[0],l[o]=p[1]}for(let o=1;o<=768;o++)e[o]=e[o-1]+Math.hypot(i[o]-i[o-1],l[o]-l[o-1])/m((o-.5)/768);const f=(o,p)=>{const s=D(p,0,1)*768,u=Math.min(767,Math.floor(s));return F(o[u],o[u+1],s-u)},L=o=>{if(o<=0)return o*m(0)/Math.max(.001,Math.hypot(i[1]-i[0],l[1]-l[0])*768);if(o>=e[768])return 1+(o-e[768])*.02;let p=0,s=768;for(;s-p>1;){const u=p+s>>1;e[u]<=o?p=u:s=u}return(p+(o-e[p])/Math.max(1e-9,e[s]-e[p]))/768},N=o=>o<0?[i[0]+(i[1]-i[0])*768*o,l[0]+(l[1]-l[0])*768*o]:[f(i,o),f(l,o)],y=Math.ceil(e[768])+3,w=[],A=[];for(let o=0;o<4;o++){const p=[];for(let s=-2;s<=y;s++){const u=L(s+It[o]+ft),z=L(s+It[o]+ft+(1-ft)*.5),v=N(Math.min(z,1)),M=t.lengthAt(D(z,0,1)),g=1+D(M/180,0,1)*.35;let c;z>=t.uLand?c=[t.landing[0]+ht[o]*t.half,t.landing[1],t.landing[2]+pt[o]*t.half]:c=t.groundAt(o,v[0]+ht[o]*Y*g,v[1]+pt[o]*W*(1+.012*M),D(z,0,1));const b={u,x:c[0],y:c[1]+At,z:c[2],leg:o};p.push(b),u>0&&u<1&&A.push(b)}w.push(p)}return A.sort((o,p)=>o.u-p.u),{phiAt:o=>f(e,o),bodyXZ:N,foot:(o,p,s)=>{const u=f(e,p)-It[o],z=Math.floor(u),v=u-z,M=w[o],g=M[D(z+2,0,M.length-1)];if(v>=ft)return s.set(g.x,g.y,g.z),0;const c=M[D(z+1,0,M.length-1)],b=v/ft,P=b*b*(3-2*b),S=t.lengthAt(p),r=D(.05*S,1.6,10)+Math.abs(g.y-c.y)*.35;return s.set(F(c.x,g.x,P),F(c.y,g.y,P)+Math.sin(Math.PI*b)*r*(1-.25*Math.sin(Math.PI*b)),F(c.z,g.z,P)),b},plants:w,falls:A,cycles:e[768]}}function Ve(t,n,e){const i=[],l=[],m=[],f=[],L=[];let N=0;const y=(A,x,o,p,s,u,z,v,M)=>{const g=p-A,c=s-x,b=u-o,P=Math.hypot(g,c,b)||1;for(const[S,r,h,V]of[[A,x,o,v],[p,s,u,M]])for(const k of[-1,1])i.push(S,r,h),l.push(g/P,c/P,b/P),m.push(k),f.push(z,V);L.push(N,N+1,N+2,N+1,N+3,N+2),N+=4};for(const A of t){const x=Math.round((5+n.int(0,2))*(e<.9?.7:1)),o=n()*6.283,p=A.y-At+.06;for(let s=0;s<x;s++){let u=o+s/x*6.283+n.range(-.3,.3),z=A.x+Math.cos(u)*1.3,v=A.z+Math.sin(u)*1.3;const M=4+n.int(0,2),g=n.range(.9,2);for(let c=0;c<M;c++){u+=n.range(-.75,.75);const b=z+Math.cos(u)*g,P=v+Math.sin(u)*g;if(y(z,p,v,b,p,P,A.u,c/M,(c+1)/M),c===1&&n.chance(.6)){const S=u+n.pick([-1,1])*n.range(.7,1.1);y(b,p,P,b+Math.cos(S)*g*1.3,p,P+Math.sin(S)*g*1.3,A.u,.5,1)}z=b,v=P}}}const w=new a.BufferGeometry;return w.setAttribute("position",new a.Float32BufferAttribute(i,3)),w.setAttribute("dir",new a.Float32BufferAttribute(l,3)),w.setAttribute("side",new a.Float32BufferAttribute(m,1)),w.setAttribute("open",new a.Float32BufferAttribute(f,2)),w.setIndex(L),w}async function Re(t,n={}){const e=(n.palette&&n.palette.length>=7?n.palette:Zt).map(d=>new a.Color(d)),i={paper:e[0],lemon:e[1],brass:e[1],salmon:e[2],green:e[3],powder:e[4],night:e[5],ink:e[6]},l=n.style||le();l.uPaper.value.copy(e[0]),l.uInk.value.copy(e[6]);const m=D(n.detail??t.quality?.detail??1,.6,1),f=t.rng,L=n.preview!==!1,N=n.close?[null,String(n.close)]:null,y=N?N[1].split(",").map(Number):null,w=typeof n.holdU=="number"?n.holdU:null,A=new a.Group,x=new a.Group,o=new a.Group;A.add(x),x.add(o);const p=Kt({sway:1,style:l}),s=Yt({sway:1,style:l}),u=(d,E,X,B)=>{const _=new a.Mesh(E,X),$=new a.Mesh(E,B);return _.frustumCulled=$.frustumCulled=!1,d.add(_,$),[_,$]},z=await me(t,i,!!n.snow);u(o,z,p,s),await t.yield();const v=f()*30,M=f.range(-1.2,1.2),g=Jt(4.4,1.2,1.9,.55,i.paper,t.noise,v,.6,1,.7);await t.yield();const c=new a.Group;u(c,g,p,s),x.add(c);const b=new a.Matrix4().compose(new a.Vector3(M,2.95,6.2),new a.Quaternion().setFromEuler(new a.Euler(.05,f.range(-.12,.12),0)),new a.Vector3(1,1,1)),P=H(Rt(.7),16,i.brass),S=[-1,1].map(d=>{const E=new a.Group;return u(E,P,p,s),x.add(E),E.userData.home=ot(d*Y,Lt,W),E});for(const d of[c,...S])d.matrixAutoUpdate=!1;await t.yield();const r=await de(t,i,m),h=Me(l);u(x,r,h.tint,h.hull),await t.yield();const V=n.lengthAt||(d=>Ae(xe,d)),k=n.uLand??.93,R=n.landing||[0,0,1560],C=n.snagU??.82,q=n.landHalf??7.4,Q=d=>Se({uLand:2,landing:R,half:q,groundAt:(E,X,B)=>[X,0,B],...d}),U=Q({lengthAt:V,uLand:k,course:n.course||(d=>[0,ye(be,d)]),...n.groundAt?{groundAt:n.groundAt}:{}}),lt=n.bodyY||((d,E)=>.985*E+3.5),vt=y?()=>30:d=>26+18*d,J=L?Q({lengthAt:vt,course:d=>[0,1800*d]}):null;await t.yield();const at=ge({style:l}),oe=f.fork("cracks"),Ct=d=>{const E=new a.Mesh(Ve(d.falls,oe,m),at);return E.frustumCulled=!1,x.add(E),E},rt=n.cracks===!1?null:Ct(U);await t.yield();const ct=J&&n.cracks!==!1?Ct(J):null;rt&&ct&&rt.scale.setScalar(0),await t.yield();const mt=[0,1,2,3].map(()=>new a.Vector3),Et=mt.map(()=>new a.Vector3),Ft=mt.map(()=>new a.Vector3),tt={u:0,L:12,phase:0,swing:[0,0,0,0],preview:L},Bt=n.snagPoint?new a.Vector3().fromArray(n.snagPoint):null,wt=new a.Vector3(R[0],R[1]+9,R[2]),Tt=new a.Euler,_t=new a.Vector3(1,1,1),ae=new a.Vector3(0,0,0),G=new a.Vector3,Pe=new a.Matrix4;let dt=null;function St(d,E,X,B){const _=X(d),$=E.phiAt(d),Vt=E.bodyXZ(d),Mt=Math.PI*2;let Ht=(B?lt(d,_):.985*_+3.5)+.012*_*Math.sin(2*Mt*$),Pt=.02*Math.sin(2*Mt*$+1),ie=.035*Math.sin(Mt*$);if(B){const I=j(C,C+.022,d)*(1-j(C+.03,C+.062,d)),K=j(C+.036,C+.075,d)*(1-j(k-.03,k,d)),O=Math.max(0,d-k),T=Math.exp(-O*90)*Math.sin(O*260)*(d>k?1:0);Pt+=.6*I-.4*K+.08*T,Ht-=3*T}o.position.set(Vt[0],Ht,Vt[1]),o.rotation.set(Pt,0,ie),o.updateMatrix();for(let I=0;I<4;I++){const K=Ft[I].set(ht[I]*Y,te,pt[I]*W).applyMatrix4(o.matrix),O=mt[I];if(tt.swing[I]=E.foot(I,d,O),B&&d>k-.03){const nt=j(k-.03,k,d);$t.set(R[0]+ht[I]*q,R[1]+At,R[2]+pt[I]*q),O.lerp($t,nt),tt.swing[I]*=1-nt}B&&Bt&&I===2&&O.lerp(Bt,j(C-.012,C,d)*(1-j(C+.012,C+.03,d)));const T=Et[I].addVectors(K,O).multiplyScalar(.5),et=fe.subVectors(O,K),st=et.length(),Ut=_*.5;if(st<_-.001&&st>.001){et.multiplyScalar(1/st);const nt=he.set(.1*ht[I],0,pt[I]);nt.addScaledVector(et,-nt.dot(et)),nt.lengthSq()>1e-8&&T.addScaledVector(nt.normalize(),Math.sqrt(Math.max(0,Ut*Ut-st*st*.25)))}h.lu.uHip.value[I].copy(K),h.lu.uKnee.value[I].copy(T),h.lu.uFoot.value[I].copy(O),h.lu.uLks.value[I].set(Math.max(_,st),D(1.8/_,.008,.2),O.z/At*.5+I)}const kt=.5*Math.sin(2*Mt*$+.6)+Pt*1.5;p.uniforms.uSway.value=kt,s.uniforms.uSway.value=kt;const Ot=B?j(C+.008,C+.04,d)*(1-j(k-.012,k+.012,d)):0;p.uniforms.uBillow.value=s.uniforms.uBillow.value=Ot,p.uniforms.uSway.value=s.uniforms.uSway.value=kt+Ot*.9*Math.sin(d*330),at.uniforms.uU.value=d;const jt=C+.012,Z=B?D((d-jt)/(.985-jt),0,1):0;c.matrix.multiplyMatrices(o.matrix,b),Z>0&&(G.setFromMatrixPosition(c.matrix),G.set(F(G.x,wt.x,Z)+10*Math.sin(Math.PI*Z),F(G.y,wt.y,Math.pow(Z,.75)),F(G.z+8*Math.sin(Math.PI*Math.min(Z*2,1)),wt.z,Z)),n.loose&&n.loose(0,d,Z,G),bt.setFromEuler(Tt.set(Z*9,Z*3,.4+Z*5)),c.matrix.compose(G,bt,Z>.985?ae:_t));for(let I=0;I<2;I++){const K=S[I],O=C+.02+I*.015,T=B?D((d-O)/.11,0,1):0;if(K.matrix.multiplyMatrices(o.matrix,K.userData.home),T>0){G.setFromMatrixPosition(K.matrix);const et=Math.min(T*6,1);G.set(F(G.x,R[0]+(I?17:-15),T*T),F(G.y+1.2*et,R[1]+.2,Math.pow(T,1.5)),F(G.z,R[2]-14+I*9,T*T)),n.loose&&n.loose(1+I,d,T,G),bt.setFromEuler(Tt.set(T*7*(I?1:-1),et*9,T*5)),K.matrix.compose(G,bt,_t)}}return tt.u=d,tt.L=_,tt.phase=$,Vt}function Gt(d){dt===null&&(ct&&ct.scale.setScalar(0),rt&&rt.scale.setScalar(1),x.position.set(0,0,0),tt.preview=!1),dt=D(d,0,1),St(dt,U,V,!0)}function Dt(d,E,X){if(ce(l,t,X),l.uTime.value=E,w!==null){const B=D(w+E*4e-4,0,1),_=St(B,U,V,!0);x.position.set(-_[0],0,-_[1]),ct&&ct.scale.setScalar(0),rt&&rt.scale.setScalar(1)}else if(dt===null&&J){const B=St(E/60%1,J,vt,!1);x.position.set(-B[0],0,-B[1])}}L?Dt(0,0,null):Gt(0);const re=(d,E=new a.Vector3)=>{const X=U.bodyXZ(d);return E.set(X[0],lt(d,V(d)),X[1])},se={portalSeat:{position:wt.clone(),normal:new a.Vector3(0,.5,-.866),size:13,tilt:!0},flyThrough:[[0,-10,16,0],[.035,-10,16,60],[.07,-9.5,26,128],[.15,0,9,260],[.25,-9,9,440],[.31,-20,40,530],[.36,-14,80,600],[.45,-12,150,700],[.52,0,188,760],[.58,18,172,880],[.66,30,150,1010],[.75,30,150,1150],[.82,30,150,1285],[.9,12,80,1440],[.96,0,43.6,1500],[1,0,9,1560]],viewpoints:{knobs:{u:.07,offset:[-9.5,0,0]},street:{u:.25},knee:{u:.3,leg:1,radius:14},over:{u:.55,above:4},landed:{u:.95}},bedAt:re,lengthAt:V,footfalls:U.falls,snag:{u:C,leg:2},hipLocal:[Y,te,W],bedSize:[14,18],headRailTop:Lt+2};return{object:A,radius:y?y[0]:w!==null?Math.max(24,V(w)*.42):24,height:y?y[1]:w!==null?V(w)+22:56,center:y?new a.Vector3(y[2],.985*30+3.5+y[3],y[4]):new a.Vector3(0,w!==null?(V(w)+12)*.55:27,0),anchors:se,update:Dt,setProgress:Gt,feet:mt,knees:Et,hips:Ft,body:o,state:tt,pillow:c,knobs:S,style:l,materials:{tint:p,hull:s,legTint:h.tint,legHull:h.hull,crack:at},dispose(){},ground:!0,groundY:0}}export{Zt as PALETTE,ue as STYLE_GLSL,zt as STYLE_VERT_GLSL,Re as buildHero,Yt as hullMaterial,H as latheGeo,le as makeStyle,ge as ribbonMaterial,ce as styleUpdate,Kt as tintMaterial,it as tubeGeo};
