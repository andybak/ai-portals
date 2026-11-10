import{GREAT_BRIDGE as V,HIGH_BRIDGE as Q,CANYON_BRIDGE as U,greatDeck as X,highDeck as K,canyonBridge as W,routeDistance as J,MIST as Z}from"./bridges-of-marigold-plan.js";import{CANYON_LINE as ee,NOISE as te,PETAL as F,FOG_VERT_PARS as C,FOG_VERT as N,FOG_FRAG_PARS as E}from"./bridges-of-marigold-air-glsl.js";import{fogUniforms as I}from"../kit/fx.js";const oe=.5,O=.3;function ne(){const n=V,i=Q,e=U,s=ee;return[{name:"great",x:n.x,z:n.z0,dx:0,dz:-1,L:n.z0-n.z1,w:n.width,pre:14,post:0,deck:l=>X(n.z0-l),rings:3,ringSpeed:4.6,under:!1},{name:"high",x:i.x,z:i.z0,dx:0,dz:1,L:i.z1-i.z0,w:i.width,pre:0,post:12,deck:l=>K(i.z0+l),rings:3,ringSpeed:-4.2,under:!1},{name:"canyon",x:s.x0,z:s.z0,dx:(s.x1-s.x0)/s.length,dz:(s.z1-s.z0)/s.length,L:s.length,w:e.width,pre:9,post:9,deck:l=>W(Math.min(1,Math.max(0,l/s.length)))[1],rings:1,ringSpeed:3.4,under:!0}]}function ae(n,i,e){const s=t=>{const o=(t+n.pre)/(n.L+n.pre+n.post)*2-1;return .5+.5*Math.pow(Math.max(0,1-o*o),.55)},l=n.under?t=>n.w/2*s(t)*(.9+.2*i.n2(t/9+e,3.3)+.13*i.n2(t/2.7+e,7.1)):t=>n.w/2*(.9+.075*i.n2(t/9+e,3.3)+.045*i.n2(t/2.7+e,7.1)),A=n.under?1:2.6,x=(t,o)=>Math.min(1,Math.max(0,.5+.42*i.n2(t/4.6+e,o/3.9)+.2*i.n2(t/1.5+9.2,o/1.3+e))),m=(t,o)=>Math.min(1.35,Math.abs(o)/l(t)),g=(t,o)=>{const r=m(t,o);return n.deck(t)-oe-.62*(1-x(t,o))-.95*r*r*r*r},z=(t,o)=>{const r=Math.min(1,m(t,o));return g(t,o)-.15-A*Math.pow(1-r*r,.6)},f=(t,o,r)=>[n.x+n.dx*t-n.dz*o,r,n.z+n.dz*t+n.dx*o];return{half:l,heap:x,edge:m,top:g,bottom:z,point:f,dense:(t,o,r)=>{const u=f(t,0,n.deck(t)),p=J(u[0],u[1],u[2]),d=Math.min(1,Math.max(0,(75-p)/30));return r+(o-r)*d*d*(3-2*d)},mistTop:Z}}const $=`
uniform vec4 uRing; uniform float uTime;
float mgRings(vec2 q){
  float s = 0.;
  for(int k = 0; k < 3; k++){
    float on = step(float(k) + 0.5, uRing.z);
    float ar = mod(uTime*uRing.y + uRing.w + uRing.x*float(k)/max(uRing.z, 1.), uRing.x) - 20.;
    float d = length(q - vec2(ar, 0.)), x0 = (d - 6.0)/1.1, x1 = (d - 3.1)/0.8;
    s += on*(exp(-x0*x0) + 0.55*exp(-x1*x1));
  }
  return s; }
`,ie=`
${C}
attribute vec4 aBed; attribute float aHeap; varying vec4 vBed; varying float vHeap;
void main(){ vBed = aBed; vHeap = aHeap; vec4 mvPosition = modelViewMatrix*vec4(position, 1.); gl_Position = projectionMatrix*mvPosition;
${N} }`,re=`
${te}${F}${$}${E}
uniform vec3 uHot; uniform float uCell, uGain, uHoles; varying vec4 vBed; varying float vHeap;
void main(){
  // (a band of loose petals has gaps, by place on the bed: few along its middle, more and more toward its rims, where it frays out)
  // (the footprint is taken first: no derivative is asked for after a fragment has been thrown away)
  vec2 q = vBed.xy/uCell; vec2 fw = fwidth(q); float foot = max(fw.x, fw.y);
  float gap = 0.62*vnoise(vBed.xy*0.5 + 3.1) + 0.38*vnoise(vBed.xy*1.6 + 11.), fray = abs(vBed.z);
  if(uHoles > 0.5 && gap < 0.24 + 0.5*fray*fray*fray) discard;
  vec2 ci = floor(q), cf = fract(q); float best = -1., rim = 0., hue = 0.;
  for(int j = -1; j <= 1; j++) for(int i = -1; i <= 1; i++) for(int n = 0; n < 2; n++){
    vec2 g = vec2(float(i), float(j)), id = ci + g + float(n)*37.7;
    vec2 r2 = hash22(id + 3.7); float ang = hash12(id*1.31 + 7.9)*6.2832, hgt = hash12(id + 21.3);
    vec2 d = cf - (g + 0.15 + 0.7*r2); float cs = cos(ang), sn = sin(ang);
    vec2 l = vec2(cs*d.x + sn*d.y, -sn*d.x + cs*d.y);
    float s = mgPetal(vec2(l.x/0.5, l.y/1.25 + 0.5));
    if(s > 0. && hgt > best){ best = hgt; rim = s; hue = hash12(id + 5.5); }
  }
  float mid = clamp(1. - vBed.z*vBed.z, 0., 1.), prof = 0.36 + 0.72*mid*sqrt(mid);
  vec3 petal = mgPetalHue(hue)*(0.60 + 0.34*best)*(1.3 - 0.5*smoothstep(0.0, 0.2, rim));
  vec3 col = best < 0. ? uHot : petal;
  col = mix(col, mgPetalHue(0.5)*0.8 + uHot*0.1, smoothstep(0.3, 1.0, foot));
  col *= prof*(1.2 - 0.42*vHeap)*(1. + 1.1*mgRings(vBed.xy))*uGain*(vBed.w < 0. ? 1.15 : 1.);
  gl_FragColor = vec4(fxApplyFog(col), 1.);
}`,se=`
${C}${$}
attribute vec4 aP, aO, aD; uniform float uLod, uHalf, uGain; varying vec2 vQ; varying float vHue, vShade;
void main(){
  vec3 c = aP.xyz; float dist = max(length(c - cameraPosition), 1e-3);
  float f = dist <= uLod ? 1. : pow(uLod/dist, 1.6);
  float keep = clamp((f - aO.w)/(0.2*f + 0.01), 0., 1.), grow = min(pow(1./f, 0.3), 2.2);
  float ring = mgRings(aD.zy);
  float yaw = aO.x, pit = aO.y + 0.55*ring*(0.4 + 0.6*aD.w) + 0.07*sin(uTime*1.9 + aD.x*40.)*aD.w, rol = aO.z;
  vec3 Y = vec3(cos(yaw), 0., sin(yaw)), X = vec3(-Y.z, 0., Y.x), N = vec3(0., 1., 0.);
  vec3 Yp = Y*cos(pit) + N*sin(pit), Np = N*cos(pit) - Y*sin(pit), Xp = X*cos(rol) + Np*sin(rol);
  float len = aP.w*keep*grow;
  vec3 w = c + Xp*(position.x*len*0.66) + Yp*((position.y - 0.4)*len);
  vQ = vec2(position.x*2., position.y); vHue = aD.x;
  float e = aD.y/uHalf, mid = clamp(1. - e*e, 0., 1.);
  vShade = (0.36 + 0.72*mid*sqrt(mid))*(1.12 - 0.34*aD.w)*(0.78 + 0.4*fract(aD.x*7.31))*(1. + 1.1*ring)*uGain;
  vec4 mvPosition = viewMatrix*vec4(w, 1.); gl_Position = projectionMatrix*mvPosition;
${N} }`,ce=`
${F}${E}
varying vec2 vQ; varying float vHue, vShade;
void main(){
  float s = mgPetal(vQ);
  vec3 col = mgPetalHue(vHue)*(1.32 - 0.5*smoothstep(0., 0.22, s))*(0.82 + 0.3*vQ.y)*(1. - 0.14*exp(-abs(vQ.x)*14.))*vShade;
  gl_FragColor = vec4(fxApplyFog(col), 1.);
  if(s < 0.) discard;
}`;function de(n,i,e){const s=[];for(let c=-i.pre;c<i.L+i.post;c+=e.dense(c,1,0)>.5?1.5:3)s.push(c);s.push(i.L+i.post);const l=[],A=[],x=[],m=[],g=c=>{const t=Math.min(c+i.pre,i.L+i.post-c)/4;return .55+.45*Math.min(1,Math.max(0,t))},z=(c,t)=>{const o=l.length/3;for(const r of s)for(let u=0;u<=c;u++){const p=u/c*2-1,d=p*e.half(r)*g(r),a=t>0?e.top(r,d):e.bottom(r,d),h=e.point(r,d,a);l.push(h[0],h[1],h[2]),A.push(r,d,p,t),x.push(t>0?e.heap(r,d):.5)}for(let r=0;r<s.length-1;r++)for(let u=0;u<c;u++){const p=o+r*(c+1)+u,d=p+1,a=p+c+1,h=a+1;t>0?m.push(p,d,a,d,h,a):m.push(p,a,d,d,a,h)}};z(14,1),z(i.under?8:5,-1);const f=new n.BufferGeometry;return f.setAttribute("position",new n.Float32BufferAttribute(l,3)),f.setAttribute("aBed",new n.Float32BufferAttribute(A,4)),f.setAttribute("aHeap",new n.Float32BufferAttribute(x,1)),f.setIndex(m),f.computeBoundingSphere(),f}function le(n,i,e,s,l,A,x){const m=(l-s)*n.w*1.16,g=Math.round(m*(A+x)),z=x/(A+x),f=new Float32Array(g*4),c=new Float32Array(g*4),t=new Float32Array(g*4);for(let o=0;o<g;o++){const r=e(),u=e(),p=e(),d=e(),a=e(),h=e(),w=e(),k=e(),B=e(),b=e(),R=s+r*(l-s),S=n.under?Math.sign(u-.5)*Math.pow(Math.abs(u*2-1),.75)*1.34:(u*2-1)*1.16,y=S*i.half(R),L=Math.abs(S),T=.38+.32*w,P=b<z;let G,M,v=a*Math.PI*2,D=B*B*.6;if(P)G=i.bottom(R,Math.min(1,L)*Math.sign(S)*i.half(R))-.04,M=-(.7+.8*p),D=.3;else if(G=i.top(R,y)+.03+D*O*.6,L>.92)M=-(.25+.95*p),v=Math.atan2(n.dx*Math.sign(S),-n.dz*Math.sign(S))+(a-.5)*1.4;else{M=d<.16?.5+.7*p:.04+.3*p*p;const _=O-.03-D*O*.6;M=Math.min(M,Math.asin(Math.min(1,_/(.6*T))))}const H=i.point(R,y,G);f[o*4]=H[0],f[o*4+1]=H[1],f[o*4+2]=H[2],f[o*4+3]=T,c[o*4]=v,c[o*4+1]=M,c[o*4+2]=(h-.5)*.8,c[o*4+3]=(o+.5)/g,t[o*4]=k,t[o*4+1]=y,t[o*4+2]=R,t[o*4+3]=D}return{n:g,P:f,O:c,D:t}}const j=28,q=62;async function he(n,i){const{THREE:e,look:s,U:l,S:A}=i,x=new e.Group,m=[],g=[],z=A.heaps,f=s.glow.clone().lerp(new e.Color("#ffb648"),.5).multiplyScalar(1.45),c=new e.PlaneGeometry(1,1).translate(0,.5,0);m.push(c);const t=ne(),o=[];let r=0,u=0;for(let d=0;d<t.length;d++){const a=t[d],h=ae(a,z,11.7*(d+1));o.push(h);const w=a.L+a.pre+a.post+40,k={value:new e.Vector4(w,a.ringSpeed,a.rings,A.rings()*w)},B=de(e,a,h);m.push(B);const b=new e.ShaderMaterial({fog:!0,vertexShader:ie,fragmentShader:re,uniforms:{...I(),uTime:l.uTime,uRing:k,uHot:{value:f},uCell:{value:.42},uGain:{value:.8},uHoles:{value:a.under?1:0}}});m.push(b);const R=new e.Mesh(B,b);x.add(R),u+=B.index.count/3,await n.yield();const S=new e.ShaderMaterial({fog:!0,side:e.DoubleSide,vertexShader:se,fragmentShader:ce,uniforms:{...I(),uTime:l.uTime,uRing:k,uLod:{value:a.under?q:j},uHalf:{value:a.w/2},uGain:{value:.84}}});m.push(S);let y=-a.pre;for(;y<a.L+a.post-.01;){const L=h.dense(y+6,1,0),T=L>.5?12.5:45,P=Math.min(a.L+a.post,y+T),G=(a.under?4.6:2.6+7.4*h.dense((y+P)/2,1,0))*Math.min(1,.4+.6*s.detail),M=le(a,h,A.bed,y,P,G,a.under?G:0),v=new e.InstancedBufferGeometry;v.index=c.index,v.setAttribute("position",c.attributes.position),v.setAttribute("aP",new e.InstancedBufferAttribute(M.P,4)),v.setAttribute("aO",new e.InstancedBufferAttribute(M.O,4)),v.setAttribute("aD",new e.InstancedBufferAttribute(M.D,4)),v.instanceCount=M.n;const D=(y+P)/2,H=h.point(D,0,a.deck(D)-1.5),_=Math.hypot((P-y)/2,a.w*.62)+4+Math.abs(a.deck(y)-a.deck(P))/2;v.boundingSphere=new e.Sphere(new e.Vector3(H[0],H[1],H[2]),_),m.push(v);const Y=new e.Mesh(v,S);x.add(Y),g.push({g:v,n:M.n,at:v.boundingSphere.center,rad:_,lod:a.under?q:j}),y=P,await n.yield()}}const p=new e.Vector3;return{object:x,bridges:t,shapes:o,drawCalls:t.length+g.length,get triangles(){return u+r},update(d,a,h){p.setFromMatrixPosition(h.matrixWorld),r=0;for(const w of g){const k=Math.max(0,p.distanceTo(w.at)-w.rad),B=k<=w.lod?1:Math.pow(w.lod/k,1.6);w.g.instanceCount=Math.min(w.n,Math.ceil(w.n*B+1)),r+=w.g.instanceCount*2}},dispose(){for(const d of m)d.dispose()}}}export{O as PETAL_STAND,oe as TOP_UNDER,ae as bedShape,he as buildBridges,ne as layBridges};
