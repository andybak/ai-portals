import*as _ from"three";import{RW_GLSL as Q,withShared as X,C as P,clamp as $,lerp as K,sstep as B}from"./the-red-weed-common.js";const E={stone:0,brick:1,tile:2,flint:3,wood:4,iron:5,cloth:6,dark:7,plaster:8,pit:9,lamp:10,ember:11,track:12},J=`
uniform float uTime;
attribute vec3 color; attribute vec4 aE;
varying vec3 vW, vP, vN, vCol; varying vec4 vE;
void main(){
  vec4 wp = modelMatrix*vec4(position, 1.0);
  vec3 n = normalize(mat3(modelMatrix)*normal);
  // washing on the line: it hangs from its top edge and stirs
  float sw = aE.z, ph = aE.w*40.0;
  wp.xyz += n*sw*(0.2*sin(uTime*1.2 + ph + wp.x*1.6) + 0.08*sin(uTime*2.7 + ph*2.0 + wp.y*3.0)) + vec3(0.0, 0.04, 0.0)*sw*sin(uTime*1.9 + ph);
  vW = wp.xyz; vP = position; vN = n; vCol = color; vE = aE;
  gl_Position = projectionMatrix*viewMatrix*wp;
}`,O=`
${Q}
uniform vec2 uSick;           // the sickness on the walls: bias, and how much it gains with height (per metre)
uniform float uGreen;         // the pit's breath
varying vec3 vW, vP, vN, vCol; varying vec4 vE;
void main(){
  vec3 n = normalize(vN); if (!gl_FrontFacing) n = -n;
  vec3 vv = cameraPosition - vW; float dist = length(vv); vec3 v = vv/max(dist, 1e-3);
  float k = floor(vE.x + 0.5), seed = fract(vE.w), burnt = step(1.5, vE.w)*step(k, 8.5);
  vec3 an = abs(n);
  vec2 q = an.y > 0.78 ? vP.xz : (an.x > an.z ? vec2(vP.z, vP.y) : vec2(vP.x, vP.y));
  float px = uPx*dist;                                    // metres one pixel covers here
  vec3 alb = vCol; float gloss = 0.0;
  float stain = 0.78 + 0.44*rwN(q*0.55 + seed*13.0);
  if (k < 0.5) {              // dressed stone in courses
    float row = floor(q.y/0.36);
    vec2 b = vec2(q.x/0.74 + 0.5*mod(row, 2.0) + 0.3*rwH(vec2(row, seed*91.0)), q.y/0.36), f = fract(b);
    float jd = min(min(f.x, 1.0 - f.x)*0.74, min(f.y, 1.0 - f.y)*0.36);
    float j = (1.0 - smoothstep(0.012, 0.035 + px, jd))*(1.0 - smoothstep(0.03, 0.14, px));
    alb *= (0.8 + 0.4*rwH(floor(b) + seed*7.0))*(1.0 - 0.5*j)*stain;
  } else if (k < 1.5) {       // brick
    float row = floor(q.y/0.085);
    vec2 b = vec2(q.x/0.23 + 0.5*mod(row, 2.0), q.y/0.085), f = fract(b);
    float jd = min(min(f.x, 1.0 - f.x)*0.23, min(f.y, 1.0 - f.y)*0.085);
    float lod = 1.0 - smoothstep(0.012, 0.05, px);
    float j = (1.0 - smoothstep(0.006, 0.014 + px, jd))*lod;
    alb *= mix(1.0, 0.72 + 0.56*rwH(floor(b) + seed*7.0), lod)*(1.0 - 0.4*j)*stain;
  } else if (k < 2.5) {       // roof tiles
    float row = floor(q.y/0.17);
    vec2 b = vec2(q.x/0.26 + 0.5*mod(row, 2.0), q.y/0.17), f = fract(b);
    float lod = 1.0 - smoothstep(0.02, 0.09, px);
    alb *= mix(1.0, (0.7 + 0.5*rwH(floor(b) + seed*3.0))*(0.72 + 0.4*f.y), lod)*(0.75 + 0.5*rwN(q*0.33 + seed*5.0));
  } else if (k < 3.5) {       // knapped flint in pale mortar
    float lod = 1.0 - smoothstep(0.02, 0.1, px);
    float fl = smoothstep(0.38, 0.62, rwN(q*9.0 + seed)), fl2 = rwN(q*23.0 + 7.0);
    alb *= mix(0.95, mix(1.5, 0.55 + 0.5*fl2, fl), lod)*stain; gloss = 0.05*fl*lod;
  } else if (k < 4.5) {       // weathered wood
    alb *= (0.72 + 0.5*rwN(q*vec2(1.3, 11.0) + seed*9.0))*stain;
  } else if (k < 5.5) {       // the cylinder: scorched grey metal, scaled and streaked
    float sc = rwN(q*0.9 + 3.0)*0.6 + 0.4*rwN(q*3.7);
    alb *= 0.55 + 0.75*sc; alb = mix(alb, alb*vec3(1.25, 0.95, 0.8), smoothstep(0.55, 0.8, rwN(q*0.31 + 11.0))); gloss = 0.22;
  } else if (k < 6.5) {       // cloth
    alb *= 0.9 + 0.14*rwN(q*4.0 + seed*9.0);
  } else if (k < 7.5) {       // an opening: a dark room behind old glass
    gloss = 0.07;
  } else if (k < 8.5) {       // limewash
    alb *= (0.84 + 0.2*rwN(q*1.2 + seed*5.0))*stain;
  }
  else if (k > 11.5) {        // the cart track: two ruts in bare sand, a strip of heath between them, ragged edges
    float ac = vE.w*2.0 - 1.0, along = vP.x*0.31 + vP.z*0.95;
    float wob = (rwN(vec2(along*0.35, 3.0)) - 0.5)*0.22;
    float rut = 1.0 - smoothstep(0.07, 0.2, abs(abs(ac + wob) - 0.52));
    float crown = 1.0 - smoothstep(0.08, 0.3, abs(ac + wob));
    float rag = smoothstep(0.62, 0.98, abs(ac) + (rwN(vP.xz*0.9) - 0.5)*0.5);
    alb *= 0.78 + 0.4*rwN(vP.xz*1.7);
    alb = mix(alb, vec3(0.2, 0.19, 0.15), 0.55*crown*smoothstep(0.3, 0.6, rwN(vP.xz*0.6 + 9.0)));
    alb = mix(alb, alb*vec3(0.42, 0.4, 0.4), rut*(0.7 + 0.3*rwN(vec2(along*1.3, ac*3.0))));
    alb = mix(alb, vec3(0.16, 0.14, 0.14), rag); gloss = 0.1*rut;
  }
  float ndl = dot(n, uKeyDir);
  // the afterglow is a wide band of sky, not a lamp: a wall turned any way toward it takes its rose and amber;
  // the far fire reddens what faces it; the high sky behind us fills the rest
  vec2 nh = n.xz/max(length(n.xz), 1e-3);
  float glowL = clamp(0.5 + 0.5*dot(nh, uGlow.xz), 0.0, 1.0); glowL = glowL*sqrt(glowL)*(1.0 - 0.75*n.y*n.y);
  vec3 fd = normalize(uFire.xyz - vW);
  vec3 lightc = uKeyCol*clamp(ndl*0.9 + 0.1, 0.0, 1.0) + rwAmb(n)*1.9
    + (uSkyRose*0.5 + uSkyAmber*0.4)*glowL*uGlow.w
    + uFireCol*uFire.w*clamp(dot(n, fd)*0.8 + 0.2, 0.0, 1.0)*0.55;
  // a burnt house: its embers light the inner faces of what is left of its walls, from the floor up
  float flick = 0.72 + 0.28*sin(uTime*2.3 + seed*40.0)*sin(uTime*3.7 + seed*17.0);
  if (burnt > 0.5 && !gl_FrontFacing) lightc += vec3(1.0, 0.3, 0.06)*1.1*(1.0 - smoothstep(0.0, 3.2, vW.y))*flick;
  // cloth lets the evening through
  if (k > 5.5 && k < 6.5) lightc += uKeyCol*0.5*clamp(-ndl, 0.0, 1.0)*clamp(dot(-v, uKeyDir), 0.0, 1.0);
  vec3 col = alb*lightc;
  vec3 r = reflect(-v, n); float fr = 1.0 - clamp(dot(n, v), 0.0, 1.0);
  col += rwSky(r)*gloss*(0.25 + 0.75*fr*fr);
  // the weed climbs every wall as far as the wall says (vE.y, metres above the water): lobed pads over one another
  float top = vE.y;
  if (top > 0.05) {
    float hN = 0.6*rwN(q*0.31 + seed*3.0) + 0.4*rwN(q*1.07 + 9.0);
    float m = (top - vW.y)/max(top, 1.0)*0.9 + (hN - 0.5)*1.1 - 0.16;
    vec4 pd = rwPad(q*1.9 + seed*17.0 + (vec2(rwN(q*2.7 + 3.0), rwN(q*2.7 + 41.0)) - 0.5)*0.55);
    float padK = 1.0 - smoothstep(0.06, 0.3, px), padH = mix(0.7, smoothstep(0.02, 0.34, pd.z), padK);
    // pad by pad: the growth is ragged at its edge, each pad there or not
    float cover = smoothstep(0.0, 0.14, m + (pd.w - 0.5)*0.3*padK)*(1.0 - 0.75*step(6.5, k)*step(k, 7.5));
    float sick = smoothstep(0.5, 0.62, uSick.x + uSick.y*vW.y + (pd.w - 0.5)*0.4*padK + (rwN(q*0.19 + 31.0) - 0.5)*0.5);
    vec3 wn = normalize(n + (an.y > 0.78 ? vec3(pd.x, 0.0, pd.y) : (an.x > an.z ? vec3(0.0, pd.y, pd.x) : vec3(pd.x, pd.y, 0.0)))*(-1.6)*(1.0 - padH)*padK);
    vec3 wc = rwWeed(wn, v, 0.1 + 0.3*(1.0 - padH), sick, 0.55 + 0.45*padH)*mix(1.0, 0.78 + 0.44*pd.w, padK*(1.0 - 0.6*sick))*(0.66 + 0.6*rwN(q*0.16 + seed*5.0));      // older and darker in places
    col = mix(col*(1.0 - 0.3*cover), wc, cover);
  }
  // a lamp left burning behind a window (its glazing bars across it); the dull red of embers in a burnt house's openings
  if (k > 9.5 && k < 10.5) {
    float bars = step(0.07, abs(fract(q.x/0.45) - 0.5))*step(0.06, abs(fract(q.y/0.58) - 0.5));
    col = vec3(1.0, 0.55, 0.2)*(1.2 + 0.1*sin(uTime*5.3 + seed*30.0))*mix(0.22, 1.0, bars)*(0.75 + 0.25*rwN(q*1.3 + seed*9.0));
  } else if (k > 10.5 && k < 11.5) {
    float em = rwN(q*2.3 + vec2(0.0, -uTime*0.25) + seed*31.0);
    col = vec3(0.95, 0.22, 0.04)*(0.12 + 0.5*em*em)*flick*(1.0 - 0.55*smoothstep(0.3, 2.4, vW.y));
  }
  // the pit: the open end of the cylinder breathes a faint green
  if (k > 8.5 && k < 9.5) {
    float sw = rwN(vP.xz*0.16 + vec2(uTime*0.05, -uTime*0.035))*0.6 + 0.4*rwN(vP.xz*0.45 - vec2(uTime*0.08, 0.0));
    col = vec3(0.04, 0.045, 0.045) + vec3(0.10, 0.62, 0.24)*uGreen*(0.06 + 0.94*sw*sw)*(0.55 + 0.45*sin(uTime*0.7 + sw*5.0));
  }
  gl_FragColor = vec4(rwAir(col, vW, cameraPosition), 1.0);
}`;function s0(t,e={}){return new _.ShaderMaterial({uniforms:X(t,{uSick:{value:new _.Vector2(-.4,.02)},uGreen:{value:1},...e}),vertexShader:J,fragmentShader:O,side:_.DoubleSide})}const T=(t,e,o=0,s=0,v=0)=>t.extra(e,o,v,s);function C(t,e,o,s,v,m,l,n){const a=o[0]-e[0],h=o[1]-e[1],u=o[2]-e[2],x=v[0]-e[0],d=v[1]-e[1],f=v[2]-e[2],w=h*f-u*d,b=u*x-a*f,k=a*d-h*x;w*m+b*l+k*n>=0?t.quad(e,o,s,v):t.quad(v,s,o,e)}function V(t,e,o,s,v,m,l){const n=o[0]-e[0],a=o[1]-e[1],h=o[2]-e[2],u=s[0]-e[0],x=s[1]-e[1],d=s[2]-e[2];let f=a*d-h*x,w=h*u-n*d,b=n*x-a*u;const k=Math.hypot(f,w,b)||1;f/=k,w/=k,b/=k;const N=f*v+w*m+b*l>=0?1:-1,q=t.v(e[0],e[1],e[2],f*N,w*N,b*N),W=t.v(o[0],o[1],o[2],f*N,w*N,b*N),j=t.v(s[0],s[1],s[2],f*N,w*N,b*N);N>0?t.tri(q,W,j):t.tri(q,j,W)}const Y=(t,e,o,s)=>t.tube(e,o,s*1.414,s*1.414,4,1);function n0(t,e=1){if(e<0){for(let o=0;o<t.p.length;o+=3)t.p[o]=-t.p[o],t.n[o]=-t.n[o];for(let o=0;o<t.i.length;o+=3){const s=t.i[o+1];t.i[o+1]=t.i[o+2],t.i[o+2]=s}}return t.geometry("aE",!0)}function r0(t,e){const o=e.z,s=3.4,v=e.rng,m=e.side??2,l=e.centre??20,n=m===1?14:8.2,a=m===1?3.4:2.5,h=1,u=[[0,l/2,h,(e.crown??9.5)-h]];let x=l/2;for(let r=0;r<m;r++){const i=n/2,y=(m===1?7.3:5.6-r*.5)-h+1;u.push([x+a+i,i,h,y],[-(x+a+i),i,h,y]),x+=a+n}const d=x+3.2,f=d+46,w=r=>{const i=Math.abs(r);return i<=d?10.4-.9*(i/d)*(i/d):K(9.5,.45,B(d,f,i)*.5+.5*$((i-d)/(f-d),0,1))},b=r=>K(1.1,.45,B(d+6,f-4,Math.abs(r))),k=r=>{for(const i of u){const y=(r-i[0])/i[1];if(Math.abs(y)<1)return i[2]+i[3]*Math.sqrt(Math.max(0,1-y*y))}return-1.5},N=new Set([-f,f,-d,d]);for(let r=0;r<=12;r++)N.add(K(d,f,r/12)),N.add(-K(d,f,r/12));for(const r of u)for(let i=0;i<=16;i++)N.add(r[0]-r[1]*Math.cos(i/16*Math.PI));const q=[...N].sort((r,i)=>r-i),W=P("#8d887e"),j=P("#a39d90"),H=P("#6a655c");T(t,E.stone,9.5,v()),t.color(W);for(let r=0;r<q.length-1;r++){const i=q[r],y=q[r+1],p=(i+y)/2,M=k(p)>-1;t.ex[1]=Math.abs(p)>d?Math.min(3.8,.5*(w(p)+b(p))+.5):3.8;const I=M?Math.max(k(i+1e-4*Math.sign(p-i)),h):-1.5,z=M?Math.max(k(y+1e-4*Math.sign(p-y)),h):-1.5,c=w(i)+b(i),g=w(y)+b(y);for(const D of[1,-1])C(t,[i,I,o+D*s],[y,z,o+D*s],[y,g,o+D*s],[i,c,o+D*s],0,0,D);M&&C(t,[i,I,o+s],[i,I,o-s],[y,z,o-s],[y,z,o+s],0,-1,0);const F=w(i),G=w(y),A=.45;t.color(H),C(t,[i,F,o+s-A],[y,G,o+s-A],[y,G,o-s+A],[i,F,o-s+A],0,1,0),t.color(W);for(const D of[1,-1])C(t,[i,c,o+D*s],[y,g,o+D*s],[y,g,o+D*(s-A)],[i,c,o+D*(s-A)],0,1,0),C(t,[i,F,o+D*(s-A)],[y,G,o+D*(s-A)],[y,g,o+D*(s-A)],[i,c,o+D*(s-A)],0,0,-D)}t.ex[1]=3.8;for(const r of[1,-1])C(t,[r*f,-1.5,o-s],[r*f,-1.5,o+s],[r*f,w(f)+.45,o+s],[r*f,w(f)+.45,o-s],r,0,0);const L=[];for(const r of u){for(const i of[1,-1])C(t,[r[0]+i*r[1],-1.5,o-s],[r[0]+i*r[1],-1.5,o+s],[r[0]+i*r[1],h,o+s],[r[0]+i*r[1],h,o-s],-i,0,0);t.color(j);for(let i=0;i<16;i++){const y=i/16*Math.PI,p=(i+1)/16*Math.PI,M=.62,I=[r[0]-r[1]*Math.cos(y),r[2]+r[3]*Math.sin(y)],z=[r[0]-r[1]*Math.cos(p),r[2]+r[3]*Math.sin(p)],c=[r[0]-(r[1]+M)*Math.cos(y),r[2]+(r[3]+M)*Math.sin(y)],g=[r[0]-(r[1]+M)*Math.cos(p),r[2]+(r[3]+M)*Math.sin(p)];for(const F of[1,-1]){const G=o+F*(s+.09);C(t,[I[0],I[1],G],[z[0],z[1],G],[g[0],g[1],G],[c[0],c[1],G],0,0,F),C(t,[c[0],c[1],G],[g[0],g[1],G],[g[0],g[1],o+F*s],[c[0],c[1],o+F*s],c[0]-r[0],c[1]-r[2]+1,0)}}t.color(W)}const S=u.flatMap(r=>[r[0]-r[1],r[0]+r[1]]).sort((r,i)=>r-i);for(let r=1;r<S.length-1;r+=2){const i=S[r],y=S[r+1],p=(i+y)/2,M=(y-i)/2+.25;L.push([p,o,6.5,.7]);for(const I of[1,-1]){const z=o+I*s,c=[p,z+I*2.5],g=5;C(t,[p-M,-1.5,z],[c[0],-1.5,c[1]],[c[0],g,c[1]],[p-M,g,z],-1,0,I),C(t,[p+M,-1.5,z],[c[0],-1.5,c[1]],[c[0],g,c[1]],[p+M,g,z],1,0,I),V(t,[p-M,g,z],[c[0],g,c[1]],[p,g+1.7,z],-1,1.2,I),V(t,[p+M,g,z],[c[0],g,c[1]],[p,g+1.7,z],1,1.2,I)}}L.push([-d-2,o,7,.6],[d+2,o,7,.6]);const R=[];for(const r of[1,-1]){for(let i=-d-14;i<d+14;i+=.62+.75*v()){if(Math.abs(i)<7.2||v()<.16)continue;const y=w(i)+b(i),p=y-Math.max(k(i),0)-.4,M=k(i)>-1?y-.3:y-.2;R.push([i,y+.02,o+r*(s+.14),Math.min(M,v.range(2.6,7.2)),0,r,v.range(.55,1.05),p])}for(const i of u)for(let y=0;y<26;y++){const p=v.range(-.98,.98);if(i[0]===0&&Math.abs(p*i[1])<7.2)continue;const M=i[2]+i[3]*Math.sqrt(1-p*p);R.push([i[0]+p*i[1],M+.05,o+r*(s+.05-.5*v()),Math.min(M-.25,v.range(1.6,4.6)),0,r,v.range(.4,.8),M])}}return{arches:u,half:d,far:f,hw:s,deckY:w,parH:b,hangs:R,posts:L,z:o}}function Z(t,e){const o=e.radius,s=e.width??.12,v=e.spokes??10,m=e.thick??o*.06,l=e.seg??16,n=e.paddles?[-s/2,s/2]:[0];for(const a of n){for(let h=0;h<l;h++){const u=h/l*Math.PI*2,x=(h+1)/l*Math.PI*2;Y(t,[Math.cos(u)*o,Math.sin(u)*o,a],[Math.cos(x)*o,Math.sin(x)*o,a],m)}for(let h=0;h<v;h++){const u=h/v*Math.PI*2;Y(t,[Math.cos(u)*o*.1,Math.sin(u)*o*.1,a],[Math.cos(u)*o,Math.sin(u)*o,a],m*.7)}}t.tube([0,0,-s/2-(e.axle??.1)],[0,0,s/2+(e.axle??.1)],o*.11,o*.11,8,1);for(let a=0;a<(e.paddles||0);a++){const h=a/e.paddles*Math.PI*2,u=Math.cos(h),x=Math.sin(h),d=o*.8,f=o*1.06;t.quad([u*d,x*d,-s/2],[u*f,x*f,-s/2],[u*f,x*f,s/2],[u*d,x*d,s/2])}}function l0(t,e){const o=new _.Matrix4().makeRotationFromEuler(new _.Euler(-1.12,.22,.06)).setPosition(e.at[0],e.at[1],e.at[2]);t.xf(o),T(t,E.wood,0,.37),t.color(P("#6e5a44")),t.box(0,.55,0,1.25,.06,.72),t.box(0,.95,.72,1.25,.4,.04),t.box(0,.95,-.72,1.25,.4,.04),t.box(-1.25,.95,0,.04,.4,.72),Y(t,[1.2,.5,.62],[3.5,.75,.5],.045),Y(t,[1.2,.5,-.62],[3.5,.75,-.5],.045),t.tube([0,.38,-1],[0,.38,1],.05,.05,6,0);const s=o.clone().multiply(new _.Matrix4().makeTranslation(0,.38,.93));t.xf(s),Z(t,{radius:.74,width:.08,spokes:12,seg:14}),t.xf(null);const v=new _.Vector3(0,.38,-.93).applyMatrix4(o),m=new _.Vector3(0,0,-1).transformDirection(o);return{hub:v,axis:m}}function U(t,e,o){const s=e.w,v=e.d,m=e.h,l=e.pitch??.95,n=s/2,a=v/2,h=m+a*l,u=o(),x=e.state||0,d=new _.Matrix4().makeRotationY(e.ry||0).setPosition(e.x,e.y??0,e.z);t.xf(d);const f=(e.wallCol||P("#8a5a48")).clone(),w=x===2?.42:1,b=x===2;T(t,e.wall??E.brick,b?(e.weed??3)*.6:e.weed??3,u+(b?2:0)),t.color(f.clone().multiplyScalar(w));for(const p of[1,-1]){const M=b?5:1;let I=b?m*o.range(.5,1):m;for(let z=0;z<M;z++){const c=-n+s*z/M,g=-n+s*(z+1)/M,F=b?m*o.range(.35,1):m;C(t,[c,-1,p*a],[g,-1,p*a],[g,F,p*a],[c,I,p*a],0,0,p),I=F}}for(const p of[1,-1])C(t,[p*n,-1,-a],[p*n,-1,a],[p*n,m,a],[p*n,m,-a],p,0,0),V(t,[p*n,m,-a],[p*n,m,a],[p*n,h,0],p,0,0);for(let p=0;p<(e.chimneys??1);p++){const M=p===0?1:-1;t.box(M*(n-.42),(m+h+1.5)/2,0,.36,(h+1.5-m)/2,.36,"-y"),t.box(M*(n-.42),h+1.62,0,.42,.1,.42)}const k=b?E.ember:E.dark,N=e.lamp;T(t,k,0,u),t.color(.07,.075,.09);const q=e.door??1,W=e.storeys??(m>4.2?2:1),j=Math.max(2,Math.round(s/3.2));for(const p of[1,-1])for(let M=0;M<W;M++)for(let I=0;I<j;I++){const z=-n+s*(I+.5)/j,c=M===0?.9:3.35,g=p*(a+.03),F=M===0&&p===q&&I===Math.floor(j/2);if(b&&o()<.4)continue;const G=!F&&N&&N[0]===p&&N[1]===M&&N[2]===I;G&&(T(t,E.lamp,0,u),t.color(1,.56,.2)),F?C(t,[z-.5,-.6,g],[z+.5,-.6,g],[z+.5,1.95,g],[z-.5,1.95,g],0,0,p):c+1.15<m-.15&&C(t,[z-.45,c,g],[z+.45,c,g],[z+.45,c+1.15,g],[z-.45,c+1.15,g],0,0,p),G&&(T(t,k,0,u),t.color(.07,.075,.09))}const H=.34,L=n+.3,S=m-H*l,R=a+H,r={x:o.range(-.3,.3)*s,r:o.range(.3,.42)*s,side:o.pick([1,-1]),deep:o.range(.5,1.2)},i=x===0?1:7,y=x===0?1:4;if(!b){T(t,E.tile,(e.weed??3)*(x?.9:.75),u),t.color(e.roofCol||P("#7a4a3a"));for(const p of[1,-1])for(let M=0;M<i;M++)for(let I=0;I<y;I++){const z=K(-L,L,M/i),c=K(-L,L,(M+1)/i),g=I/y,F=(I+1)/y,G=(z+c)/2,A=(g+F)/2;x===1&&Math.hypot((G-r.x)/r.r,(p===r.side?1-A:1+A*r.deep)/1.05)<1+.18*(o()-.5)||C(t,[z,K(S,h,g),p*K(R,0,g)],[c,K(S,h,g),p*K(R,0,g)],[c,K(S,h,F),p*K(R,0,F)],[z,K(S,h,F),p*K(R,0,F)],0,1,p*.5)}}if(x){T(t,E.wood,0,u),t.color(b?P("#1c1a19"):P("#5c4a3a"));const p=Math.max(5,Math.round(s/1.1));for(let M=0;M<=p;M++){const I=K(-n+.1,n-.1,M/p);for(const z of[1,-1]){if(b&&o()<.66||!b&&Math.abs(I-r.x)>r.r*1.05)continue;const c=b?o.range(.45,1):1;Y(t,[I,m,z*a],[I,K(m,h,c),z*K(a,0,c)],.055)}}(!b||o()<.5)&&Y(t,[-n,h-.05,0],[n,h-.05,0],.06)}return t.xf(null),{x:e.x,z:e.z,r:Math.hypot(n,a),hx:n,hz:a,h:m,ridge:h,m:d}}function i0(t,e){const o=new _.Matrix4().makeRotationY(e.ry||0).setPosition(e.x,0,e.z);t.xf(o);const s=P("#7d7b78"),v=P("#a59e90"),m=P("#5a4e44"),l=e.tower??22,n=3.3,a=.61;T(t,E.flint,8,a),t.color(s),t.box(0,(l-1)/2,0,n,(l+1)/2,n,"-y+y"),T(t,E.stone,8,a),t.color(v);for(const x of[1,-1])for(const d of[1,-1])t.box(x*(n-.2),(l-1)/2,d*(n-.2),.27,(l+1)/2,.27,"-y+y");t.box(0,14.6,0,n+.1,.14,n+.1),t.box(0,l+.1,0,n+.16,.28,n+.16);for(let x=0;x<4;x++){const d=x/4*Math.PI*2,f=Math.round(Math.cos(d)),w=Math.round(Math.sin(d));for(const b of[-1,0,1])t.box(f*(n+.02)+w*b*2.2,l+.75,w*(n+.02)-f*b*2.2,.16+.42*Math.abs(w),.4,.16+.42*Math.abs(f))}T(t,E.dark,0,a),t.color(.07,.075,.09);const h=[];for(let x=0;x<4;x++){const d=x/4*Math.PI*2,f=Math.round(Math.cos(d)),w=Math.round(Math.sin(d)),b=n+.04,k=(N,q)=>[f*b-w*N,q,w*b+f*N];C(t,k(-.62,16),k(.62,16),k(.62,18.6),k(-.62,18.6),f,0,w),V(t,k(-.62,18.6),k(.62,18.6),k(0,19.7),f,0,w),h.push(new _.Vector3(f*b,17.6,w*b).applyMatrix4(o))}C(t,[-n-.04,-.5,-.8],[-n-.04,-.5,.8],[-n-.04,2.6,.8],[-n-.04,2.6,-.8],-1,0,0),V(t,[-n-.04,2.6,-.8],[-n-.04,2.6,.8],[-n-.04,3.5,0],-1,0,0),T(t,E.tile,0,a),t.color(m);for(let x=0;x<4;x++){const d=x/4*Math.PI*2+Math.PI/4,f=d+Math.PI/2,w=(n-.25)*1.414;V(t,[Math.cos(d)*w,l+.38,Math.sin(d)*w],[Math.cos(f)*w,l+.38,Math.sin(f)*w],[0,l+3.9,0],Math.cos(d+Math.PI/4),1,Math.sin(d+Math.PI/4))}t.tube([0,l+3.8,0],[0,l+5.2,0],.05,.03,4,0);const u=(x,d,f,w,b,k)=>{T(t,E.flint,k,a+.1),t.color(s);for(const q of[1,-1])C(t,[x,-1,q*f],[d,-1,q*f],[d,w,q*f],[x,w,q*f],0,0,q);C(t,[d,-1,-f],[d,-1,f],[d,w,f],[d,w,-f],1,0,0),V(t,[d,w,-f],[d,w,f],[d,b,0],1,0,0),V(t,[x,w,-f],[x,w,f],[x,b,0],-1,0,0),T(t,E.tile,k*.6,a+.2),t.color(P("#6a5348"));for(const q of[1,-1])C(t,[x,b,0],[d+.3,b,0],[d+.3,w-.3,q*(f+.35)],[x,w-.3,q*(f+.35)],0,1,q*.5);T(t,E.dark,0,a),t.color(.07,.075,.09);const N=Math.max(1,Math.round((d-x)/5.5));for(const q of[1,-1])for(let W=0;W<N;W++){const j=K(x,d,(W+.5)/N),H=q*(f+.04),L=w*.3,S=w*.7;C(t,[j-.55,L,H],[j+.55,L,H],[j+.55,S,H],[j-.55,S,H],0,0,q),V(t,[j-.55,S,H],[j+.55,S,H],[j,S+1,H],0,0,q)}};u(n,n+19,4.4,6.6,11.6,5.5),u(n+19,n+27,3.2,5,8.6,4.5),T(t,E.flint,4,a+.3),t.color(s),t.box(n+5,1.2,4.4+1.5,1.6,2.2,1.5,"-y+y-z"),T(t,E.tile,2,a),t.color(P("#6a5348"));for(const x of[1,-1])C(t,[n+5,4.9,4.2],[n+5,4.9,7.7],[n+5+x*1.95,3.2,7.7],[n+5+x*1.95,3.2,4.2],x*.5,1,0);return t.xf(null),{openings:h,top:l,m:o,posts:[[e.x,e.z,7,.7]]}}function a0(t,e,o){const s=U(t,{x:e.x,z:e.z,ry:Math.PI/2,w:12,d:9,h:10.4,pitch:.85,wall:E.brick,wallCol:P("#7c5244"),roofCol:P("#6e4a3c"),weed:7.5,storeys:2,chimneys:0,door:e.door??1,lamp:e.lamp},o);U(t,{x:e.x+7.2,z:e.z-1.5,ry:0,w:6.5,d:7,h:5.2,pitch:.8,wall:E.brick,wallCol:P("#7c5244"),roofCol:P("#6e4a3c"),weed:4.5,chimneys:1},o),T(t,E.wood,3,.2),t.color(P("#5d5046")),t.box(e.x,11.6,e.z+6.7,1.1,1.3,.8),T(t,E.tile,2,.2),t.color(P("#6e4a3c")),t.box(e.x,13,e.z+6.8,1.3,.08,1),T(t,E.dark,0,.2),t.color(.07,.075,.09);for(const v of[1,-1])for(let m=0;m<4;m++){const l=e.z-4.5+m*3,n=e.x+v*4.54;C(t,[n,6.6,l-.45],[n,6.6,l+.45],[n,7.8,l+.45],[n,7.8,l-.45],v,0,0)}return T(t,E.brick,6,.5),t.color(P("#74503f")),t.box(e.x-7.6,.4,e.z,.35,1.9,3.8,"-y"),T(t,E.wood,5,.5),t.color(P("#4e4238")),Y(t,[e.x-7.6,2.3,e.z-3.6],[e.x-4.5,2.3,e.z-3.6],.12),Y(t,[e.x-7.6,2.3,e.z+3.6],[e.x-4.5,2.3,e.z+3.6],.12),{wheel:[e.x-6.05,1.75,e.z],posts:[[e.x,e.z,11,.6],[e.x-6,e.z,6,.5]],main:s}}function f0(t){T(t,E.wood,0,.83);const e=[-1,-.82,-.5,0,.5,.86,1],o=2.3,s=[],v=l=>.74*Math.pow(Math.max(0,1-Math.pow(Math.abs(l),l<0?2.2:3.2)),.6);for(const l of e){const n=v(l)+(l>.9?.34:0),a=.34+.2*l*l,h=-.2+.1*Math.abs(l)*Math.abs(l);s.push([[-n,a],[-n*.86,a-.2],[-n*.55,h+.07],[0,h],[n*.55,h+.07],[n*.86,a-.2],[n,a]].map(u=>[u[0],u[1],l*o]))}for(let l=0;l<s.length-1;l++)for(let n=0;n<6;n++){t.color(n===0||n===5?P("#cdc6b2"):n===1||n===4?P("#a39a86"):P("#8f8672"));const a=s[l][n],h=s[l][n+1],u=s[l+1][n+1],x=s[l+1][n];C(t,a,h,u,x,a[0]+h[0],-1,0)}const m=s[s.length-1];t.color(P("#b4ac96"));for(let l=0;l<5;l++)V(t,m[l],m[l+1],[0,.3,o],0,0,1);t.color(P("#d6cfba"));for(let l=0;l<s.length-1;l++)for(const n of[0,6])t.tube(s[l][n],s[l+1][n],.035,.035,4,0);t.color(P("#b9ad92"));for(const l of[-.45,.2,.74]){const n=v(l)*.92;t.box(0,.2,l*o,n,.025,.13)}t.color(P("#857a66")),C(t,[-.5,-.06,-1.5],[.5,-.06,-1.5],[.56,-.06,1.9],[-.56,-.06,1.9],0,1,0),t.color(P("#c9bd9e"));for(const l of[-1,1])t.tube([l*.2,.25,-1.25],[l*.3,.3,1.95],.028,.028,5,0),t.box(l*.33,.31,2.3,.07,.012,.36)}function h0(t,e,o){const[s,v]=e.a,[m,l]=e.b,n=e.y??2.25,a=m-s,h=l-v,u=Math.hypot(a,h),x=a/u,d=h/u;T(t,E.wood,1.2,.4),t.color(P("#5a4e42")),t.tube([s,-1,v],[s,n+.15,v],.07,.06,6,1),t.tube([m,-1,l],[m,n+.15,l],.07,.06,6,1);const f=k=>n-.22*4*k*(1-k);T(t,E.cloth,0,.4),t.color(P("#b9b2a4"));for(let k=0;k<8;k++)t.tube([s+a*(k/8),f(k/8),v+h*(k/8)],[s+a*((k+1)/8),f((k+1)/8),v+h*((k+1)/8)],.022,.022,4,0);const w=["#d8d2c4","#cfc9bc","#c2c6cc","#d9d0bd","#b8b4ac","#d2cdc2"];let b=.08;for(;b<.9;){const k=o.range(.5,1.5),N=o.range(.7,1.45),q=b+k/u;if(q>.94)break;const W=o();t.color(P(o.pick(w)));const j=3,H=4,L=[];for(let S=0;S<=H;S++)for(let R=0;R<=j;R++){const r=K(b,q,R/j),i=K(f(r),f(r)-N*(1-.06*Math.sin(R*2.1+W*9)),S/H),y=Math.pow(S/H,1.4);L.push(t.v(s+a*r,i,v+h*r,-d,0,x,[E.cloth,0,y,W]))}for(let S=0;S<H;S++)for(let R=0;R<j;R++){const r=L[S*(j+1)+R];t.quadI(r,r+1,r+j+2,r+j+1)}b=q+o.range(.03,.09)}}function d0(t,e){const o=e.radius??14,s=new _.Matrix4().makeRotationFromEuler(new _.Euler(e.tilt??.3,e.yaw??0,.08)).setPosition(e.x,e.y,e.z);t.xf(s),T(t,E.iron,0,.7),t.color(P("#46423c")),t.lathe(0,0,[[o,-9],[o,1.7],[o-.12,2],[o-1,2.05],[o-1.2,1.8],[o-1.2,-3.2]],44);for(const l of[.9,.2,-.5])t.lathe(0,0,[[o-1.2,l-.16],[o-1.42,l],[o-1.2,l+.16]],44);T(t,E.pit,0,.7),t.color(.02,.03,.02);const v=t.v(0,-3.1,0,0,1,0),m=t.count;for(let l=0;l<=28;l++){const n=l/28*Math.PI*2;t.v(Math.cos(n)*(o-1.2),-3.1,Math.sin(n)*(o-1.2),0,1,0)}for(let l=0;l<28;l++)t.tri(v,m+l+1,m+l);return t.xf(null),{m:s,mouth:new _.Vector3(0,-1.5,0).applyMatrix4(s)}}function p0(t,e){const o=e.pts,s=o.length,v=(e.width??2.4)/2,m=[-1,-.5,0,.5,1],l=[],n=e.heightAt;t.color(e.color||P("#b9a47e"));for(let a=0;a<s;a++){const h=o[Math.max(0,a-1)],u=o[Math.min(s-1,a+1)],x=u[0]-h[0],d=u[1]-h[1],f=Math.hypot(x,d)||1,w=-d/f,b=x/f,k=[];for(const N of m){const q=o[a][0]+w*N*v,W=o[a][1]+b*N*v,j=n(q,W),H=(n(q+1,W)-n(q-1,W))/2,L=(n(q,W+1)-n(q,W-1))/2,S=Math.hypot(H,1,L);k.push(t.v(q,j+.07,W,-H/S,1/S,-L/S,[E.track,0,0,.5+.5*N]))}l.push(k)}for(let a=0;a<s-1;a++)for(let h=0;h<4;h++)t.quadI(l[a][h],l[a][h+1],l[a+1][h+1],l[a+1][h])}export{E as KIND,r0 as bridgeInto,l0 as cartInto,i0 as churchInto,U as cottageInto,d0 as cylinderInto,n0 as finish,s0 as makeBuiltMaterial,a0 as millInto,f0 as skiffInto,p0 as trackInto,h0 as washingInto,Z as wheelInto};
